import cloneDeep from "lodash/cloneDeep";

import { Semester } from "../classes/Semester";
import { ModuleColor } from "../constants";

import "../css/SemesterSchedule.css";

const mods = [
    {
        id: "MA1521", label: "MA1521", semColor: "#456C86", dependentMods: ['ST2334'], orPreq: [], preq: []
    }, 
    {
        id: "ST2334", label: "ST2334", semColor: "#456C86", dependentMods: [], orPreq: [], preq: ['MA1521']
    }
]

export const  label = (andMods, orMods) => {

    const orLabel = (orArray) => {
        let label = ""

        if (orArray.length === 0)
            return label

        for (var x = 0; x < orArray.length; x++) {
            label += orArray[x] + (orArray[x + 1] ? " or " : "")
        }

        return "(" + label + ")";
    };

    let msg = ""
    if (andMods.length !== 0) {
        msg = andMods[0]
        for (var x = 1; x < andMods.length; x++) {
            msg = msg + " and " + andMods[x]
        }
        if (orMods.length !== 0) {
            msg = msg + " and "
        } else {
            return msg
        }
    }

    msg = msg + orLabel(orMods[0])
    for (var orCount = 1; orCount < orMods; orCount++) {
        msg = msg + " and " + orLabel(orMods[orCount])
    }

    return msg
}

export const  findPreqCol = (col, mod, index) => {
    // check all previous semesters, ie. sems < current sem (aka index), for mod
    for (var colIdx = 1; colIdx < index; colIdx++) {
        if (col[colIdx].modules.some((y) => y.id === mod.toString()))
            return true;
    }
    return false;
}; 

export const  findDepCol = (col, mod) => {
    let x = false;
    for (var colIdx = 2; colIdx < col.length; colIdx++) {
        x = col[colIdx].modules.some((y) => y.id === mod.toString());
        if (x) {
            const arr = [];
            arr[0] = colIdx;
            arr[1] = col[colIdx].modules.findIndex((y) => y.id === mod.toString());
            return arr;
        }
    }

    return x;
};

export const check = (checkPreq, checkOrPreq, columns, desIndex, srcIndex, index) => {
    let totalPreqCount = 0;
    for (var preqIndex = 0; preqIndex < checkPreq.length; preqIndex++) {
        if (findPreqCol(columns, checkPreq[preqIndex], desIndex)) {
            totalPreqCount++;
        }
    }

    let totalOrPreqCount = 0;
    for (var preqOrIndex = 0; preqOrIndex < checkOrPreq.length; preqOrIndex++) {
        for (var orIndex = 0; orIndex < checkOrPreq[preqOrIndex].length; orIndex++) {
            if (findPreqCol(columns, checkOrPreq[preqOrIndex][orIndex], desIndex)) {
                totalOrPreqCount++;
                break;
            }
        }
    }

    //toggling the color
    if (totalOrPreqCount === checkOrPreq.length && totalPreqCount === checkPreq.length) {
        columns[srcIndex].modules[index].semColor = ModuleColor.Normal.hex;
        columns[srcIndex].modules[index].tooltip = "";
    } else {
        columns[srcIndex].modules[index].semColor = ModuleColor.Locked.hex;
        columns[srcIndex].modules[index].tooltip = "Missing prequities.\nRequires: " + label(checkPreq, checkOrPreq);
    }
};

export const preqCheck = (draggedMod, desIndex, srcIndex, index, semesters) => {
    const selectedMod = mods.find((a) => a.id === draggedMod);
    const checkPreq = selectedMod.preq;
    const checkOrPreq = selectedMod.orPreq;

    //if it returns to the module table preq doesnt have to be check
    if (desIndex === 0) {
        selectedMod.semColor = ModuleColor.Normal.hex;
        selectedMod.tooltip = "";
        //if it does not preq then doesnt have to be check
    } else if (checkPreq.length === 0 && checkOrPreq.length === 0) {
        selectedMod.semColor = ModuleColor.Normal.hex;
    } else {
        check(checkPreq, checkOrPreq, semesters, desIndex, srcIndex, index);
    }
};

export const  backwardCheck = (draggedMod, columns) => {
    const selectedMod = mods.find((a) => a.id === draggedMod);
    const checkDepMod = selectedMod.dependentMods;
    if (checkDepMod.length !== 0) {
        for (var depModcount = 0; depModcount < checkDepMod.length; depModcount++) {
            const depCheck = findDepCol(columns, checkDepMod[depModcount]);
            if (depCheck !== false) {
                const depSrc = depCheck[0];
                const depIndex = depCheck[1];

                const depMod = mods.find((a) => a.id === checkDepMod[depModcount]);
                const depModPreq = depMod.preq;
                const depModOrPreq = depMod.orPreq;

                check(depModPreq, depModOrPreq, columns, depSrc, depSrc, depIndex);
            }
        }
    }
}; 

export const  handleDragEnd = (result, semesters) => {
    //dragged to blank area
    if (!result.destination)
        return

    const { source, destination } = result;

    preqCheck(
        result.draggableId,
        parseInt(destination.droppableId),
        parseInt(source.droppableId),
        source.index,
        semesters
    );

    const sourceColumn = semesters[source.droppableId];
    const sourceItems = [...sourceColumn.modules];
    const [removed] = sourceItems.splice(source.index, 1);

    const columnCopy = cloneDeep(semesters);

    columnCopy[source.droppableId].modules.splice(source.index, 1);
    columnCopy[destination.droppableId].modules.splice(destination.index, 0, removed);

    backwardCheck(result.draggableId, columnCopy);

    //Ensure the module in the module columns is same colour and has no tooltip
    columnCopy[0].modules.map(x => x.semColor = ModuleColor.Normal.hex)
    columnCopy[0].modules.map(x => x.tooltip = "")

    return columnCopy;
}; 

export const  handleAddSemester = (semesters) => {
    const years = semesters[semesters.length - 1].year + 0.5;
    const sem = years % 1 === 0 ? 1 : 2

    return semesters.push(new Semester({ name: "Semester " + sem, year: years }))
};

export const  handleDeletePrevSemester = (semesters) => {
    if (semesters.length === 1)
        return

    const prevSem = semesters[semesters.length - 1]
    prevSem.modules.map(x => x.semColor = ModuleColor.Normal.hex)
    prevSem.modules.map(x => x.tooltip = "")
        
    semesters[0].addModules(prevSem.modules) // return modules on the semester to the pool of semester

    semesters.pop()// remove previous semester
    return semesters
};


