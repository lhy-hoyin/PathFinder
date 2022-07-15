import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Text, Button, Tooltip } from '@chakra-ui/react';
import { DndProvider } from "react-dnd";
import cloneDeep from "lodash/cloneDeep";
import withScrolling from "react-dnd-scrolling";

import { graphData } from "../hooks/GraphData";
import { ModuleColor } from "../constants"

import "../css/SemesterSchedule.css";

class Semester {
    constructor(id, year) {
        this.id = id
        this.name = id
        this.items = []
        this.year = year
    }

    addModule(mod) {
        this.items = this.items.push(mod)
    }

    addModules(modsArr) {
        this.items = this.items.concat(modsArr)
    }
}

export default function SemesterSchedule() {

    const ScrollingComponent = withScrolling("div");

    const { timeTableMods } = graphData();

    const [mods, setMods] = useState([]);
    const [semesters, setSemesters] = useState([new Semester("Modules", -0.5)]);

    useEffect(() => {
        setSemesters(current => [...current,
            new Semester("Semester 1", 1),
            new Semester("Semester 2", 1.5),
            new Semester("Semester 1", 2),
            new Semester("Semester 1", 2.5),
        ])
    }, []);

    useEffect(() => {
        setMods(timeTableMods);
        semesters[0].addModules(timeTableMods)

    }, [timeTableMods]);

    const label = (andMods, orMods) => {

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

    const findPreqCol = (col, mod, index) => {
        let x = false;
        for (var colIdx = 1; colIdx < index; colIdx++) {
            x = col[colIdx].items.some((y) => y.id === mod.toString());
            if (x) {
                return x;
            }
        }
        return x;
    };

    const findDepCol = (col, mod) => {
        let x = false;
        for (var colIdx = 2; colIdx < col.length; colIdx++) {
            x = col[colIdx].items.some((y) => y.id === mod.toString());
            if (x) {
                const arr = [];
                arr[0] = colIdx;
                arr[1] = col[colIdx].items.findIndex((y) => y.id === mod.toString());
                return arr;
            }
        }

        return x;
    };

    const check = (checkPreq, checkOrPreq, columns, desIndex, srcIndex, index) => {
        let totalPreqCount = 0;
        for (var preqIndex = 0; preqIndex < checkPreq.length; preqIndex++) {
            if (findPreqCol(columns, checkPreq[preqIndex], desIndex)) {
                totalPreqCount++;
            }
        }

        let totalOrPreqCount = 0;
        for (var preqOrIndex = 0; preqOrIndex < checkOrPreq.length; preqOrIndex++) {
            let orCount = 0;
            for (var orIndex = 0; orIndex < checkOrPreq[preqOrIndex].length; orIndex++) {
                if (findPreqCol(columns, checkOrPreq[preqOrIndex][orIndex], desIndex)) {
                    orCount++;
                }
            }
            if (orCount > 0) {
                totalOrPreqCount++;
            }
        }

        //toggling the color
        if (totalOrPreqCount === checkOrPreq.length && totalPreqCount === checkPreq.length) {
            columns[srcIndex].items[index].semColor = ModuleColor.Normal.hex;
            columns[srcIndex].items[index].tooltip = "";
        } else {
            columns[srcIndex].items[index].semColor = ModuleColor.Locked.hex;
            columns[srcIndex].items[index].tooltip = "Missing prequities.\nRequires: " + label(checkPreq, checkOrPreq);
        }
    };

    const preqCheck = (draggedMod, columns, desIndex, srcIndex, index) => {
        const selectedMod = mods.find((a) => a.id === draggedMod);
        const checkPreq = selectedMod.preq;
        const checkOrPreq = selectedMod.orPreq;

        //if it returns to the module table preq doesnt have to be check
        if (desIndex === 0) {
            columns[srcIndex].items[index].semColor = ModuleColor.Normal.hex;
            columns[srcIndex].items[index].tooltip = "";
            //if it does not preq then doesnt have to be check
        } else if (checkPreq.length === 0 && checkOrPreq.length === 0) {
            columns[srcIndex].items[index].semColor = ModuleColor.Normal.hex;
        } else {
            check(checkPreq, checkOrPreq, columns, desIndex, srcIndex, index);
        }
    };

    const backwardCheck = (draggedMod, columns) => {
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

    const handleDragEnd = (result) => {
        //dragged to blank area
        if (!result.destination)
            return

        const { source, destination } = result;

        preqCheck(
            result.draggableId,
            semesters,
            parseInt(destination.droppableId),
            parseInt(source.droppableId),
            source.index
        );

        const sourceColumn = semesters[source.droppableId];
        const sourceItems = [...sourceColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);

        const columnCopy = cloneDeep(semesters);

        columnCopy[source.droppableId].items.splice(source.index, 1);
        columnCopy[destination.droppableId].items.splice(destination.index, 0, removed);

        backwardCheck(result.draggableId, columnCopy);

        setSemesters(columnCopy);
        backwardCheck(result.draggableId, columnCopy);
    };

    const addNewSemester = () => {
        const timeTableCopy = cloneDeep(semesters);
        const num = timeTableCopy.length;
        const years = timeTableColumn[num - 1].year + 0.5;
        const sem = years % 1 === 0 ? 1 : 2

        timeTableCopy.push(new Semester("Semester " + sem, years));
        setTimeTableColumn(timeTableCopy); // Update with new table
    };

    const deletePrevSemester = () => {
        if (semesters.length === 1)
            return

        const lastCol = semesters.length - 1;
        const timeTableCopy = cloneDeep(semesters);
        timeTableCopy.pop();

        // return items on the semester to the pool of semester
        timeTableCopy[0].items = timeTableCopy[0].items.concat(
            semesters[lastCol].items
        );

        setTimeTableColumn(timeTableCopy); // Update with new table
    };

    const displaySemesters = ([columnId, sem], index) => {
        return (
            <div key={columnId} >

                <div style={{ textAlign: "center", width: "100%" }}>
                    {sem.year % 1 === 0 ? (<p>Year {sem.year}</p>) : <br></br>}
                    <Text>{sem.name}</Text>
                </div>

                <div style={{ margin: 10 }}>
                    <DndProvider backend={HTML5Backend}>
                        <ScrollingComponent className="columnStyle">
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                                                padding: 4,
                                                width: 250,
                                                minHeight: 350
                                            }}
                                        >
                                            {sem.items?.map(displayModules)}
                                            {provided.placeholder}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        </ScrollingComponent>
                    </DndProvider>
                </div>

            </div>
        )
    };

    const displayModules = (item, index) => {
        return (
            <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
            >
                {(provided, snapshot) => {
                    return (
                        <Tooltip hasArrow label={item.tooltip}>
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}

                                style={{
                                    userSelect: "none",
                                    padding: 16,
                                    margin: "4px 0px",
                                    minHeight: "25px",
                                    backgroundColor: snapshot.isDragging ? "#263B4A" : item.semColor,
                                    color: "white",
                                    ...provided.draggableProps.style
                                }}
                            >
                                {item.label}
                            </div>
                        </Tooltip>
                    )
                }}
            </Draggable>
        );
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                {Object.entries(semesters).map(displaySemesters)}
            </DragDropContext>

            <div className="semButtonFrame">
                <Button onClick={addNewSemester}>
                    Add New Semester
                </Button>

                {(semesters.length === 1) ? <></> :
                    <Button  onClick={deletePrevSemester}>
                        Delete Previous Semester
                    </Button>
                }
            </div>
        </div>
    );
}
