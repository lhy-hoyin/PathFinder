import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Text, Button } from '@chakra-ui/react';
import cloneDeep from "lodash/cloneDeep";
import withScrolling from "react-dnd-scrolling";

import { graphData } from "../hooks/GraphData";
import { ModuleSemseterStateColor } from "../constants"

import "../css/SemesterSchedule.css";

export default function semesterTable() {
  const [columns, setColumns] = useState([]);
  const [message, setMessage] = useState("");
  const [mods, setMods] = useState([]);
  const { timeTableMods, timeTableColumn, addNewSemester, deletePrevSemester } = graphData();

  useEffect(() => {
    setMods(timeTableMods);
    setColumns(timeTableColumn);
  }, [timeTableMods, timeTableColumn]);

  /*
  const checkPre = (draggedMod, columns, index) => {
    const modPre = mods.find((a) => a.id === draggedMod).pre;
    let status = false;

    if (index === 0) {
      return true;
    }

    if (modPre.length === 0) {
      return true;
    } else {
      if (index === 1) {
        return false;
      }
      //searching the columns
      for (var y = 0; y < modPre.length; y++) {
        //for OR nodes
        if (modPre[y][0].length > 1) {
          for (var z = 0; z < modPre[y][0].length; z++) {
            for (var x = 1; x < index; x++) {
              if (columns[x].items.some((a) => a.id === modPre[y][z])) {
                status = true;
              }
            }
          }
        } else {
          //Not or nodes
          for (var x = 1; x < index; x++) {
            if (columns[x].items.some((a) => a.id === modPre[y])) {
              status = true;
            }
          }
        }
        if (status === false || y === modPre.length - 1) {
          return status;
        } else {
          status = false;
        }
      }
      return status;
    }
  }; */

  const label = (andMod, orMod)=> {

    const orLabel = (orArray) => {
      let label = "(" + orArray[0].toString();
      for (var x = 1; x < orArray.length; x++) {
        label = label + " or " + orArray[x];
      }
      return label + ")";
    };

    let msg = ""
    if(andMod.length !==0) {
      msg = andMod[0]
      for(var x = 1; x < andMod.length; x++) {
        msg = msg + " and " + andMod[x]
      }
      if (orMod.length !== 0){
        msg = msg + " and "
      } else {
        return msg
      }
    }

    msg = msg + orLabel(orMod[0])
    for(var orCount = 1; orCount < orMod; orCount++) {
      msg = msg + " and " + orLabel(orMod[orCount])
    }

    return msg
    
  }

  const findPreqCol = (col, mod, index) => {
    let x = false;
    for (var colIdx = 1; colIdx < index; colIdx++) {
      x = col[colIdx].items.some((y) => y.id === mod.toString());
      if (x) {
        //console.log(x)
        return x;
      }
    }
    // console.log(x)
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

  const check = (checkPreq, checkOrPreq, columns, desIndex, srcIndex, index ) => {
    let totalPreqCount = 0;
    for (var preqIndex = 0; preqIndex < checkPreq.length; preqIndex++) {
      if (findPreqCol(columns, checkPreq[preqIndex], desIndex)) {
        totalPreqCount++;
      }
    }

    let totalOrPreqCount = 0;
    for (var preqOrIndex = 0; preqOrIndex < checkOrPreq.length; preqOrIndex++) {
      let orCount = 0;
      for (
        var orIndex = 0;
        orIndex < checkOrPreq[preqOrIndex].length;
        orIndex++
      ) {
        if (findPreqCol(columns, checkOrPreq[preqOrIndex][orIndex], desIndex)) {
          orCount++;
        }
      }
      if (orCount > 0) {
        totalOrPreqCount++;
      }
    }

    //toggling the color
    if (
      totalOrPreqCount === checkOrPreq.length &&
      totalPreqCount === checkPreq.length
    ) {
      columns[srcIndex].items[index].semColor = ModuleSemseterStateColor.Normal;
    } else {
      columns[srcIndex].items[index].semColor = ModuleSemseterStateColor.Locked;
      setMessage("Prequities of " + columns[srcIndex].items[index].id + " not met.\n  Requires: "
      + label(checkPreq, checkOrPreq))
    }
  };

  const preqCheck = (draggedMod, columns, desIndex, srcIndex, index) => {
    const selectedMod = mods.find((a) => a.id === draggedMod);
    const checkPreq = selectedMod.preq;
    const checkOrPreq = selectedMod.orPreq;
    //const checkDepMod = selectedMod.dependentMods;

    //if it returns to the module table preq doesnt have to be check
    if (desIndex === 0) {
      columns[srcIndex].items[index].semColor = ModuleSemseterStateColor.Normal;
      //if it does not preq then doesnt have to be check
    } else if (checkPreq.length === 0 && checkOrPreq.length === 0) {
      columns[srcIndex].items[index].semColor = ModuleSemseterStateColor.Normal;
    } else {
      check(checkPreq, checkOrPreq, columns, desIndex, srcIndex, index);
    }
  };

  const backwardCheck = (draggedMod, columns) => {
    const selectedMod = mods.find((a) => a.id === draggedMod);
    const checkDepMod = selectedMod.dependentMods;
    if (checkDepMod.length !== 0) {
      for (var depModcount = 0; depModcount < checkDepMod.length; depModcount++ ) {
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

  const onDragEnd = (result, columns, setColumns) => {
    //if drag to no where then do nothing
    if (!result.destination) return;
    const { source, destination } = result;

    //Checking preReq
    const index = destination.droppableId;
    const modId = result.draggableId;

    /*
    if (checkPre(modId, columns, parseInt(index)) === false) {
      setMessage("Prequities unmet!");
      return;
    }*/

    preqCheck( result.draggableId, columns, parseInt(destination.droppableId),  
      parseInt(source.droppableId), source.index );

    const sourceColumn = columns[source.droppableId];
    const sourceItems = [...sourceColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    const columnCopy = cloneDeep(columns);

    columnCopy[source.droppableId].items.splice(source.index, 1);
    columnCopy[destination.droppableId].items.splice(destination.index, 0, removed);

    backwardCheck(result.draggableId, columnCopy);

    console.log(columnCopy);
    setColumns(columnCopy);
    backwardCheck(result.draggableId, columnCopy);
  };

  const ScrollingComponent = withScrolling("div");

  return (
    <>
      <h2 className="notice">Note: {message}</h2>
      <div className="semParent">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="semChild">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                  key={columnId}
                >
                  <div style={{ rowGap: "10px", textAlign:"center" }}>
                    {column.year % 1 === 0 ? (
                      <p> Year {column.year}</p>
                    ) : (
                      <p className="blank"> blank </p>
                    )}
                    <Text>{column.name}</Text>
                  </div>
                  
                  <div style={{ margin: 8 }}>
                    <DndProvider backend={HTML5Backend}>
                      <ScrollingComponent className="columnStyle">
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? "lightblue"
                                    : "lightgrey",
                                  padding: 4,
                                  width: 250,
                                  minHeight: 350
                                }}
                              >
                                {column.items.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: "none",
                                              padding: 16,
                                              margin: "0 0 8px 0",
                                              minHeight: "25px",
                                              backgroundColor: snapshot.isDragging
                                                ? "#263B4A"
                                                : item.semColor,
                                              color: "white",
                                              ...provided.draggableProps.style
                                            }}
                                          >
                                            {item.label}
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </ScrollingComponent>
                    </DndProvider>
                  </div>
                </div>
              </div>
            );
          })}
        </DragDropContext>
        <div className="semButtonFrame">
          <Button className="semAPosButton" onClick={() => addNewSemester(columns)}> Add New Semester</Button>
          <Button className="semAPosButton" disabled={columns.length === 5} onClick={() => deletePrevSemester(columns)}>Delete Previous Semester</Button>
          </div>
      </div>
    </>
  );
}
