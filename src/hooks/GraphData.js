import { useState, useContext, createContext } from "react";
import cloneDeep from 'lodash/cloneDeep';
import Color from "color";

import { supabase } from "../supabaseClient";
import { ModuleStateColor } from "../constants"

const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

function useProvideGraphData() {

    const [modules, setModules] = useState([]);
    const [preq, setPreq] = useState([]);

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

    const nodeExist = (checkMod, arr) => {
        let modExist = [];
        let count = 0;
    
        for (var x = 0; x < checkMod.length; x++) {
          if (arr.includes(checkMod[x])) {
            modExist[count] = checkMod[x];
            count++;
          }
        }
        return modExist;
      };

    const updateStatus = (allMods, selectedModule) => {
        let index = allMods.findIndex((x) => x.id === selectedModule);
    
        if (allMods[index].status === true) {
          allMods[index].color = colouring(ModuleStateColor.Completed);
          return allMods;
        }
        //Starting modules that have no prequities
        if (allMods[index].pre.length === 0) {
          if (allMods[index].status === false) {
            allMods[index].color = colouring(ModuleStateColor.Available);
          } else {
            allMods[index].color = colouring(ModuleStateColor.Completed);
          }
        } else {
          //Modules with preq
          for (var count = 0; count < allMods[index].pre.length; count++) {
            
            //For or nodes
            if (allMods[index].pre[count][0].length > 1) {
              for ( var count1 = 0; count1 < allMods[index].pre[count].length; count1++) {
                let temp = allMods.findIndex( (x) => x.id === allMods[index].pre[count][count1]);
                if (allMods[temp].status === true) {
                  allMods[index].color = colouring(ModuleStateColor.Available);
                  return allMods;
                }
              }
              allMods[index].color = colouring(ModuleStateColor.Locked);
              return allMods;
            } else {
              let temp = allMods.findIndex((x) => x.id === allMods[index].pre[count]);

              if (allMods[temp].status === false) {
                allMods[index].color = colouring(ModuleStateColor.Locked);
                return allMods;
              }
            }
          }
    
          allMods[index].color = colouring(ModuleStateColor.Available);
        }
    
        return allMods;
      };

    const getData = (modsArr) => async e => {
        e.preventDefault();

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
            let orCount = 0;

            let edges = [];
            let edgeCount = 0;

            for (var node = 0; node < count; node++) {

                mod[node] = {
                    id: temp[node].code,
                    label: temp[node].code,
                    color: colouring(ModuleStateColor.Completed),
                    info: [temp[node].name, temp[node].acad_year, temp[node].credit, temp[node].description],
                    status: false,
                    pre: []
                };

                if (temp[node].pre_req) {

                    for (var req = 0; req < temp[node].pre_req.length; req++) {
                        
                        let modWithOr = temp[node].pre_req[req].toString().split(",");
                        modWithOr = nodeExist(modWithOr, modsArr)

                        if (modWithOr.length > 1) {

                            orNodes[orCount] = {
                                id:  orNodesLabel(modWithOr),
                                label: orNodesLabel(modWithOr),
                                shape: "ellipse",
                                color: colouring(ModuleStateColor.Completed),
                                info: ["", "", "", ""],
                                status: false,
                                pre: [modWithOr]
                            }
                            orCount++;

                            mod[node].pre.push(orNodesLabel(modWithOr));
                            edges[edgeCount] = { from: temp[node].code, to: orNodesLabel(modWithOr) }
                            edgeCount++;

                            for(var orReq = 0; orReq < modWithOr.length; orReq++) {
                                edges[edgeCount] = { from: orNodesLabel(modWithOr) , to: modWithOr[orReq] }
                                edgeCount++;
                            }

                        } else{
                            if (modWithOr.toString() !== "") {
                                mod[node].pre.push(modWithOr.toString());
                                edges[edgeCount] = { from: temp[node].code, to: modWithOr.toString() };
                                edgeCount++;
                            }
                            
                        }                       
                    }
                }
            }

            mod = mod.concat(orNodes)

            for (var x = 0; x < mod.length; x++) {
                updateStatus(mod, mod[x].id);
            }

            setPreq(edges); // need to set edges first
            setModules(mod);

        } catch (error) {
            alert(error.message);
        }
    };

    const getCourses = async () => {
        try {
            let { data, error } = await supabase
                .from("courses")
                .select("course_name")

            if (data == null)
                throw error 

            return data.map(row => row.course_name)

        } catch (error) {
            console.error(error.message);
        }
    }

    const updateGraph = (nodes) => {
        let index = modules.findIndex((x) => x.id === nodes.toString());
        if (modules[index].color.background === ModuleStateColor.Locked) {
          alert("Module is locked. Please clear the prequities first.");
        } else {
            const modulesCopy = cloneDeep(modules);
            modulesCopy[index].status = !modulesCopy[index].status;
            for (var x = 0; x < modulesCopy.length; x++) {
                updateStatus(modulesCopy, modulesCopy[x].id);
            }
            setModules(modulesCopy);
          //  isUpdating(!updating)
        }
      };

    return {
        getData,
        getCourses,
        updateGraph,

        modules,
        preq
    };
}