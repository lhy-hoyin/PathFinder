import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Text, Button } from '@chakra-ui/react';
import cloneDeep from "lodash/cloneDeep";
import withScrolling from "react-dnd-scrolling";

import { graphData } from "../hooks/GraphData";

import "../css/SemesterSchedule.css";

export default function semesterTable() {
  const [columns, setColumns] = useState([]);
  const [message, setMessage] = useState("");
  const [mods, setMods] = useState([]);
  const { timeTableMods, timeTableColumn, addNewSemester } = graphData();

  useEffect(() => {
    setMods(timeTableMods);
    setColumns(timeTableColumn);
  }, [timeTableMods, timeTableColumn]);

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
  };

  const onDragEnd = (result, columns, setColumns) => {
    //if drag to no where then do nothing
    if (!result.destination) return;
    const { source, destination } = result;

    //Checking preReq
    const index = destination.droppableId;
    const modId = result.draggableId;

    if (checkPre(modId, columns, parseInt(index)) === false) {
      setMessage("Prequities unmet!");
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const sourceItems = [...sourceColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);

    const columnCopy = cloneDeep(columns);

    columnCopy[source.droppableId].items.splice(source.index, 1);
    columnCopy[destination.droppableId].items.splice(destination.index, 0, removed);

    console.log(columnCopy);
    setColumns(columnCopy);
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
                  <Text>{column.name}</Text>
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
                                                : "#456C86",
                                              color: "white",
                                              ...provided.draggableProps.style
                                            }}
                                          >
                                            {item.content}
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
          <Button className="semPosButton" onClick={() => addNewSemester(columns)}> Add New Semester</Button>
          </div>
      </div>
    </>
  );
}
