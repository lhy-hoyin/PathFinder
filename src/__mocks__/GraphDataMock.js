import cloneDeep from 'lodash/cloneDeep';
import Color from "color";

import { ModuleColor } from "../constants"

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

export const updateColour = (allMods, selectedModule, custom) => {
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


export const updateGraph = (nodes, modules) => {
    let index = modules.findIndex((x) => x.id === nodes.toString());
    if (modules[index].color.background === ModuleColor.Locked.rgb) {
        // Prompt user this: "Module is locked. Please clear the prequities first."
        return "no change"
    } else if (modules[index].label === "or") {
        return ; //do nothing
    } else {
        const modulesCopy = cloneDeep(modules);
        const state = !modulesCopy[index].isCompleted;
        const customMod = []
        const unchange = []
        const userModules = []

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
        }

        // Checking again this time in for the front arrays
        for (var index1 = modulesCopy.length - 1; index1 >= 0; index1--) {
          updateColour(modulesCopy, modulesCopy[index1].id, customMod);
        }


        // Overriding selected module that may have been affected
        modulesCopy[index].isCompleted = state
        modulesCopy[index].color = modulesCopy[index].isCompleted 
          ?  setColor(ModuleColor.Completed.rgb) 
          : setColor(ModuleColor.Available.rgb)

        return modulesCopy;
    }
};