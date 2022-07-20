import { useState, useContext, createContext, useEffect } from "react";
import cloneDeep from 'lodash/cloneDeep';
import Color from "color";

import { Module } from "../classes/Module";
import { supabase } from "../helpers/SupabaseClient";
import { ModuleColor } from "../constants"


const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

function useProvideGraphData() {

    const [userModules, setUserModules] = useState([])
    const [userModUpdate, isUserModUpdate] = useState(false)

    useEffect(() => {
        if (userModUpdate && modules.length !== 0) {

            const modulesCopy = cloneDeep(modules)
            userModuleGraph(modulesCopy)
            setModules(modulesCopy)
        }

        isUserModUpdate(false)

    }, [userModUpdate])


    const [gradReq, setGradReq] = useState([]);
    const [modules, setModules] = useState([]);
    const [preq, setPreq] = useState([]);

    const [timeTableMods, setTimeTableMods] = useState([]);

    const setColor = (selectedColor) => {
        const color = {
            border: Color(selectedColor).darken(0.2).hex(),
            background: selectedColor,
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

    const updateColour = (allMods, selectedModule, custom) => {
        const index = allMods.findIndex((x) => x.id === selectedModule);

        if (allMods[index].isCompleted) {
            allMods[index].color = setColor(ModuleColor.Completed.rgb);
            if (allMods[index].dependentMods.length === 0) {
                return allMods;
            }
        }

        if (allMods[index].preq.length === 0 && allMods[index].orPreq.length === 0 && !allMods[index].isCompleted) {
            allMods[index].color = setColor(ModuleColor.Available.rgb);
        } 

        if (allMods[index].dependentMods.length !== 0) {

            //if it is a User Module that where isCompleted = true then dont need to do anything
            let isFixed =  custom.findIndex((x) => x === allMods[index].id)
            if (isFixed !== -1) {
              return
            }

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
                        allMods[indexOr].color = setColor(ModuleColor.Completed.rgb);
                        totalOrCount++;
                    } else {
                        allMods[indexOr].color = setColor(ModuleColor.Locked.rgb);
                    }
                }  
                
                // Don't need to change status of dependency mod if it is a User Module 
                isFixed =  custom.findIndex((x) => x === allMods[index2].id)                 
                if (isFixed !== -1) {
                  continue
                }
               
                if (totalCount === modPreq.length && totalOrCount === modOrPreq.length) {
                    allMods[index2].color = allMods[index2].isCompleted
                        ? setColor(ModuleColor.Completed.rgb)
                        : setColor(ModuleColor.Available.rgb);
                } else {  
                    allMods[index2].isCompleted = false;
                    allMods[index2].color = setColor(ModuleColor.Locked.rgb);
                    
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

    const relationShip = (count, mod, orNodes, edges, pos) => {
        let edgesCount = 0;
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
                    const position = pos.find((a) => a.id === label)
                    orNodes[index2] = new Module(
                        label,
                        [null, null, null, null],
                        setColor(ModuleColor.Locked.rgb),
                        position === undefined ? null : position.x,
                        position === undefined ? null : position.y
                    );

                    orNodes[index2].changingLabel("or");
                    orNodes[index2].shape = "ellipse";

                    for (var index3 = 0; index3 < orPreqMods[index2].length; index3++) {
                        const updateOrDep = mod.findIndex((x) => x.id === orPreqMods[index2][index3]);
                        mod[updateOrDep].addDependentMods(moduleId);
                        edges[edgesCount] = addEdges(label, orPreqMods[index2][index3]);
                        edgesCount++;
                    }

                    edges[edgesCount] = addEdges(moduleId, label);
                    edgesCount++;

                    orNodes[index2].addDependentMods(moduleId);
                }
            }
        }
    }

    const getData = (selectedCourse) => async e => {
        e.preventDefault();

        const selectedCourseIndex = gradReq.findIndex((x) => x.id === selectedCourse)

        // Graph related     
        const gradMod = cloneDeep(gradReq[selectedCourseIndex].modReq)
        const pos = gradReq[selectedCourseIndex].pos

        // Semester related
        const modsArr = cloneDeep(gradReq[selectedCourseIndex].modReq)
        const additionalMods = []

        // Including the user related modules
        for (var userModIndex = 0; userModIndex < userModules.length; userModIndex++) {
            if (!modsArr.includes(userModules[userModIndex].code)) {
                modsArr.push(userModules[userModIndex].code)
                additionalMods.push(userModules[userModIndex].code)
            }
        }

        try {
            let { data, error } = await supabase
                .from("modules")
                .select("*")
                .filter('code', 'in', `(${modsArr})`)

            if (data == null)
                throw ("no data from database")

            let temp = data.slice(0);

            let mod = [];
            let modCount = 0
            let orNodes = [];

            let edges = [];

            let tableMods = [];
            let blank1 = [];
            let blank2 = [];

            for (var num = 0; num < modsArr.length; num++) {

                if (additionalMods.some((x) => x === temp[num].code)) {
                    continue
                }

                const position = pos.find((a) => a.id === temp[num].code);

                const module = new Module(
                    temp[num].code,
                    [temp[num].name, temp[num].acad_year, temp[num].credit, temp[num].description],
                    setColor(ModuleColor.Locked.rgb),
                    position === undefined ? null : position.x,
                    position === undefined ? null : position.y
                );

                mod[modCount] = module
                mod[modCount].setPreReq(temp[num].pre_req, gradMod);
                modCount++
            }

            for (var num = 0; num < modsArr.length; num++) {

                const module = new Module(
                    temp[num].code,
                    [temp[num].name, temp[num].acad_year, temp[num].credit, temp[num].description],
                    setColor(ModuleColor.Locked.rgb),
                    null,
                    null
                );

                tableMods[num] = module
                tableMods[num].setPreReq(temp[num].pre_req, modsArr);
            }

            relationShip(mod.length, mod, orNodes, edges, pos)
            relationShip(modsArr.length, tableMods, blank1, blank2, pos)
            mod = mod.concat(orNodes);

            for (var count1 = 0; count1 < mod.length; count1++) {
                updateColour(mod, mod[count1].id, []);
            }
            userModuleGraph(mod)

            setPreq(edges)
            setModules(mod)
            setTimeTableMods(tableMods);

        } catch (error) {
            console.error(error.message);
        }
    };

    const userModuleGraph = (mod) => {
        
      // Setting up the colour for the module and the dependant mod
      for (var userModIndex = 0; userModIndex < userModules.length; userModIndex++) {
          const index = mod.findIndex((x) => x.id === userModules[userModIndex].code)
          if (index !== -1 && userModules[userModIndex].isCompleted) {
              mod[index].isCompleted = true
              updateColour(mod, mod[index].id, []);
          }

          if (index !== -1 && !userModules[userModIndex].isCompleted) {
              mod[index].isCompleted = false
              updateColour(mod, mod[index].id, []);
          }   
      }       
              
      //Reverting the colour for those module that have been override
      for (var userModIndex = 0; userModIndex < userModules.length; userModIndex++) {
          const index = mod.findIndex((x) => x.id === userModules[userModIndex].code)
          
          if (index !== -1 && !userModules[userModIndex].isCompleted) {
            
            if (mod[index].preq.length !== 0 ) {
              updateColour(mod, mod[index].preq[0], [])
            }

            if(mod[index].orPreq.length !== 0 ) {
              updateColour(mod, mod[index].orPreq[0][0], [])
            }
          }
      }

      for (var userModIndex = 0; userModIndex < userModules.length; userModIndex++) {
        const index = mod.findIndex((x) => x.id === userModules[userModIndex].code)
        if (index !== -1 && userModules[userModIndex].isCompleted) {
            mod[index].isCompleted = true
            mod[index].color = setColor(ModuleColor.Completed.rgb)
        }
      }

    }

    const unchangeMod = (modsCount, currentModsState) => {
      for (var count = 0; count < modsCount.length ; count++) {
        currentModsState[modsCount[count]].isCompleted = true
        currentModsState[modsCount[count]].color = setColor(ModuleColor.Completed.rgb)
      }
    }

    const updateGraph = (nodes) => {
        let index = modules.findIndex((x) => x.id === nodes.toString());
        if (modules[index].color.background === ModuleColor.Locked.rgb) {
            alert("Module is locked. Please clear the prequities first.");
        } else if (modules[index].label === "or") {
            return; //do nothing
        } else {
            const modulesCopy = cloneDeep(modules);
            const state = !modulesCopy[index].isCompleted;
            const customMod = []
            const unchange = []

            modulesCopy[index].isCompleted = state
            
          
            for (var userModIndex = 0; userModIndex < userModules.length; userModIndex++) {
              let temp = modulesCopy.findIndex((x) => x.id === userModules[userModIndex].code)
              if (temp !== -1 && userModules[userModIndex].isCompleted) { 
                unchange.push(temp)
                customMod.push(userModules[userModIndex].code)                
              }                
            }

            if (customMod.some((x) => x ===  nodes.toString())) {
              return
            }


            for (var index1 = 0; index1 < modulesCopy.length; index1++) {
              updateColour(modulesCopy, modulesCopy[index1].id, customMod);
              //Overriding User related modules to orignal state
              unchangeMod(unchange, modulesCopy)
            }

            // Checking again this time 
            for (var index1 = modulesCopy.length - 1; index1 >= 0; index1--) {
              updateColour(modulesCopy, modulesCopy[index1].id, customMod);
              //Overriding User related modules to orignal state
              unchangeMod(unchange, modulesCopy)
            }


            // Overriding selected module that may have been affected
            modulesCopy[index].isCompleted = state
            modulesCopy[index].color = modulesCopy[index].isCompleted 
              ?  setColor(ModuleColor.Completed.rgb) 
              : setColor(ModuleColor.Available.rgb)

            setModules(modulesCopy);
        }
    };

    return {
        getData,
        getCoursesRequirement,
        updateGraph,

        setUserModules,
        isUserModUpdate,
        userModules,
        modules,
        preq,

        timeTableMods,
    };
}