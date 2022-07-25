import { Semester } from "../classes/Semester";

import {
    handleAddSemester,
    handleDeletePrevSemester,
    handleDragEnd
} from "../__mocks__/SemesterScheduleMock";

//temporary column
var temp = [ new Semester({ name: "Modules", year: 0.5 }),
    new Semester({ name: "Semester 1", year: 1 }),
    new Semester({ name: "Semester 2", year: 1.5 })
]

// temporary modules: MA1521 and ST2334
var data = [
    {
        id: "MA1521", label: "MA1521", semColor: "#456C86", dependentMods: ['ST2334'], orPreq: [], preq: []
    }, 
    {
        id: "ST2334", label: "ST2334", semColor: "#456C86", dependentMods: [], orPreq: [], preq: ['MA1521']
    }
]

test("Adding modules into the Semester Table", () => {
    temp[0].modules = data
    expect(temp[0].modules.length === 2).toBeTruthy();
});

test("When ST2334 into the semester 2 wihout clearing its prerequitites, it will turn red", () => {
    const movingModules = {
        destination: {droppableId: '2', index: 0}, draggableId: "ST2334", source: {index: 1, droppableId: '0'}
    }
    temp = handleDragEnd(movingModules, temp)
    expect(temp[2].modules[0].semColor ==="#FF0000").toBeTruthy();
});

test("When MA1521 into the semester 1, ST2334 will be reverted back to the normal color", () => {
    const movingModules = {
        destination: {droppableId: '1', index: 0}, draggableId: "MA1521", source: {index: 0, droppableId: '0'}
    }
    temp = handleDragEnd(movingModules, temp)
    expect(temp[2].modules[0].semColor ==="#456C86").toBeTruthy();
});

test("Adding new semester", () => {
    handleAddSemester(temp)
    expect(temp[3].year === 2).toBeTruthy();

});

test("Deleting previous semester", () => {
    handleDeletePrevSemester(temp)
    expect(temp.length === 3).toBeTruthy();

});

test("Deleting semesters with module should reappear at the Module Table", () => {
    handleDeletePrevSemester(temp)
    expect(temp[0].modules.length === 1).toBeTruthy();
}) 


