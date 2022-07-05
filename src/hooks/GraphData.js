import { useState, useContext, createContext } from "react";
import cloneDeep from 'lodash/cloneDeep';
import Color from "color";

import { supabase } from "../supabaseClient";
import { ModuleStateColor } from "../constants"
import { Module } from "../components/Module"

const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

function useProvideGraphData() {

    const [gradReq, setGradReq] = useState([]);
    const [modules, setModules] = useState([]);
    const [preq, setPreq] = useState([]);
    const [timeTableMods, setTimeTableMods] = useState([]);

    const colouring = (selectedColor) => {
        const color ={
           border: Color(selectedColor).darken(0.2).hex(),
           background : selectedColor,
           highlight: {
             border: Color(selectedColor).darken(0.3).hex(),
             background: Color(selectedColor).darken(0.2).hex()
            },
            hover: {
                border: Color(selectedColor).darken(0.3).hex(),
                background: Color(selectedColor).darken(0.2).hex()
            }
        }
         
         return color;
    }

    const orNodesLabel = (orArray) => {
        let label = orArray[0].toString();
        for (var x = 1; x < orArray.length; x++) {
          label = label + " or " + orArray[x]
        }
        return label
    }
      
    const addEdges = (fromMod, toMod) => {
      return { from: fromMod, to: toMod };
    };

    const updateColour = (allMods, selectedModule) => {
      let index = allMods.findIndex((x) => x.id === selectedModule);
  
      if (allMods[index].isCompleted) {
        allMods[index].color = colouring(ModuleStateColor.Completed);
        if (allMods[index].dependentMods.length === 0) {
          return allMods;
        }
      }

      if ( allMods[index].preq.length === 0 && allMods[index].orPreq.length === 0 && !allMods[index].isCompleted ) {
        allMods[index].color = colouring(ModuleStateColor.Available);
      }
  
      if (allMods[index].dependentMods.length !== 0) {
        const depMod = allMods[index].dependentMods; //the other mods that depend on the selected module
        
        for (var xx = 0; xx < depMod.length; xx++) {
          const index2 = allMods.findIndex((x) => x.id === depMod[xx]);
  
          // The preq and the orpreq of the current dependant mod in the loop
          const modPreq = allMods[index2].preq;
          const modOrPreq = allMods[index2].orPreq;
  
          let totalCount = 0;
          for (var y = 0; y < modPreq.length; y++) {
            const index3 = allMods.findIndex((x) => x.id === modPreq[y]);
            if (allMods[index3].isCompleted) {
              totalCount++;
            }
          }
  
          let totalOrCount = 0;
          for (var y = 0; y < modOrPreq.length; y++) {
            let orCheck = false;
            //Since its a or relationship, the "OR" node needs to be updated as well
            const indexOr = allMods.findIndex(
              (x) => x.id === orNodesLabel(modOrPreq[y])
            );
  
            for (var z = 0; z < modOrPreq[y].length; z++) {
              const index4 = allMods.findIndex((x) => x.id === modOrPreq[y][z]);
              if (allMods[index4].isCompleted) {
                orCheck = true;
              }
            }
  
            if (orCheck) {
              allMods[indexOr].color = colouring(ModuleStateColor.Completed);
              totalOrCount++;
            } else {
              allMods[indexOr].color = colouring(ModuleStateColor.Locked);
            }
          }
  
          if (
            totalCount === modPreq.length &&
            totalOrCount === modOrPreq.length
          ) {
            allMods[index2].color = allMods[index2].isCompleted
              ? colouring(ModuleStateColor.Completed)
              : colouring(ModuleStateColor.Available);
          } else {
            allMods[index2].isCompleted = false;
            allMods[index2].color = colouring(ModuleStateColor.Locked);
          }
        }
      }

      return allMods;
    };

    const getCoursesRequirement = async () => {

        const posSetUp = (posArr) => {
            if (posArr === null)
                return null
            
            let pos = []
            for (var count = 0; count < posArr.length; count++) {
                pos[count] = {
                    id: posArr[count][0],
                    x: posArr[count][1],
                    y: posArr[count][2]
                };
            }

            return pos
        };

        try {
            let { data, error } = await supabase
                .from("courses")
                .select("*")

            if (data == null) throw error

            let temp = data.slice(0);
            let allCourses = [];

            for (var index = 0; index < temp.length; index++) {
                allCourses[index] = {
                    id: temp[index].course_name,
                    modReq: temp[index].grad_requirement,
                    pos: posSetUp(temp[index].position)
                }
            }

            setGradReq(allCourses)

        } catch (error) {
            console.error(error.message);
        }
    }

    const getData = (selectedCourse) => async e => {
        e.preventDefault();

        const selectedCourseIndex = gradReq.findIndex((x) => x.id === selectedCourse)
        const modsArr = gradReq[selectedCourseIndex].modReq
        const pos = gradReq[selectedCourseIndex].pos

        try {
            let { data, error } = await supabase
                .from("modules")
                .select("*")
                .filter('code', 'in', `(${modsArr})`)

            if (data == null)
                throw ("no data from database")

            let temp = data.slice(0);
            const count = temp.length

            let mod = [];
            let orNodes = [];
      
            let edges = [];
            let edgesCount = 0;

            let tableMods = [];
      
            for (var num = 0; num < count; num++) {
              mod[num] = new Module(
                temp[num].code,
                [temp[num].name, temp[num].acad_year, temp[num].credit, temp[num].description],
                colouring(ModuleStateColor.Locked),
                pos.find((a) => a.id === temp[num].code).x || null,
                pos.find((a) => a.id === temp[num].code).y || null
              );
      
              mod[num].setPreReq(temp[num].pre_req, modsArr);
            }
            
            for (var index = 0; index < count; index++) {
              const moduleId = mod[index].id;
              const preqMods = mod[index].preq;
              const orPreqMods = mod[index].orPreq;

              if (preqMods.length > 0) {
                for (var index1 = 0; index1 < preqMods.length; index1++) {

                  edges[edgesCount] = addEdges(moduleId, preqMods[index1]);
                  edgesCount++;

                  const x = mod.findIndex((x) => x.id === preqMods[index1]);
                  mod[x].addDependentMods(moduleId);
                }
              }

              if (orPreqMods.length > 0) {
                for (var index2 = 0; index2 < orPreqMods.length; index2++) {
                  // Creating "OR" nodes
                  const label = orNodesLabel(orPreqMods[index2]);
                  orNodes[index2] = new Module(
                    label,
                    [null, null, null, null],
                    colouring(ModuleStateColor.Locked),
                    pos.find((a) => a.id === label).x,
                    pos.find((a) => a.id === label).y
                  );

                  orNodes[index2].changingLabel("or");
                  orNodes[index2].shape = "ellipse";

                  for (var index3 = 0; index3 < orPreqMods[index2].length; index3++) {
                    edges[edgesCount] = addEdges(label, orPreqMods[index2][index3]);
                    edgesCount++;
                  }

                  edges[edgesCount] = addEdges(moduleId, label);
                  edgesCount++;

                  orNodes[index2].addDependentMods(moduleId);
                }
              }
            }
      
            for (var count1 = 0; count1 < mod.length; count1++) {
              updateColour(mod, mod[count1].id);
              tableMods[count1] = {
                id: mod[count1].id,
                content: mod[count1].id,
                pre: mod[count1].preq.concat(mod[count1].orPreq)
              }
            }

            mod = mod.concat(orNodes);

            setTimeTableMods(tableMods);
            setPreq(edges)
            setModules(mod)

        } catch (error) {
            console.error(error.message);
        }
    };

    const updateGraph = (nodes) => {
        let index = modules.findIndex((x) => x.id === nodes.toString());
        if (modules[index].color.background === ModuleStateColor.Locked) {
          alert("Module is locked. Please clear the prequities first.");
        } else if (modules[index].label === "or") {
          return; //do nothing
        } else {
          const modulesCopy = cloneDeep(modules);
          modulesCopy[index].isCompleted = !modulesCopy[index].isCompleted;
    
          for (var index1 = 0; index1 < modulesCopy.length; index1++) {
            updateColour(modulesCopy, modulesCopy[index1].id);
          }
            setModules(modulesCopy);
        }
      };

    return {
        getData,
        getCoursesRequirement,
        updateGraph,

        modules,
        preq,
        timeTableMods,
    };
}