import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { graphData } from "../hooks/GraphData";

export default function semesterTable() {
  const [columns, setColumns] = useState([]);
  const [message, setMessage] = useState("");
  const [mods, setMods] = useState([]);
  const { timeTableMods } = graphData();

  useEffect(() => {
    const timeTableColumns = [
      {
        id: "Modules",
        name: "Modules",
        items: timeTableMods
      },
      {
        id: "Semester 1",
        name: "Semester 1",
        items: []
      },
      {
        id: "Semester 2",
        name: "Semester 2",
        items: []
      },
      {
        id: "Semester 3",
        name: "Semester 3",
        items: []
      },
      {
        id: "Semester 4",
        name: "Semester 4",
        items: []
      }
    ];
    setMods(timeTableMods);
    setColumns(timeTableColumns);
  }, [timeTableMods]);

  console.log(columns);

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
      console.log(modPre);
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

    //moving module to another column
    if (source.droppableId !== destination.droppableId) {
      //Checking preReq
      const index = destination.droppableId;
      const modId = result.draggableId;

      if (checkPre(modId, columns, parseInt(index)) === false) {
        setMessage("Prequities unmet!");
        return;
      }
      //console.log(checkPre(modId, columns, parseInt(index)));
      // console.log(columns[0].items.some((a)=> a.id === "eight task"));

      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      //moving modules withing the same row
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
    console.log(columns);
  };

  return (
    <>
      <p>Notice: {message}</p>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
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
                            minHeight: 500
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
                                        minHeight: "50px",
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
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}