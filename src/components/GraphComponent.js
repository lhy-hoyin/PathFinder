import React, { useEffect, useState } from "react";
import Graph from "react-vis-graph-wrapper";
import {
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    IconButton
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { graphData } from "../hooks/GraphData";

import "../css/GraphComponent.css";

export default function GradGraph() {

    const { modules, preq, updateGraph } = graphData()

    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [credit, setCredit] = useState("");
    const [descibe, setDescribe] = useState("");

    useEffect(() => {
        setNodes(modules)
        setEdges(preq)
    }, [modules]);

    const graph = { nodes, edges }

    const options = {
        layout: {
            randomSeed: 23,
            hierarchical: {
                enabled: false,
                levelSeparation: 40,
                nodeSpacing: 300,
                treeSpacing: 100,
                blockShifting: true,
                edgeMinimization: true,
                direction: "LR",
                sortMethod: "hubsize"
            }
        },
        edges: {
            smooth: {
                enabled: true,
                type: "dynamic",
                roundness: 1
            },
            arrows: {
                from: { enabled: true },
                to: { enabled: false }
            }
        },
        nodes: {
            shape: "box",
            font: {
                face: "Circular, Futura",
                color: "#fff",
                size: 15
            },
            fixed: {
                x: false,
                y: false
            },
            physics: false,
            color: {
                border: "red"
            },
            margin: {
                top: 7,
                bottom: 7,
                left: 10,
                right: 10
            },
            mass: 1
        },
        physics: {
            hierarchicalRepulsion: {
                centralGravity: 1,
                springLength: 200,
                springConstant: 0.1,
                nodeDistance: 150,
                damping: 1
            },
            maxVelocity: 500,
            minVelocity: 3,
            solver: "barnesHut",
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 100,
                onlyDynamicEdges: false,
                fit: true
            },
            timestep: 0.5
        },
        interaction: {
            hover: true,
            hoverConnectedEdges: true,
            multiselect: false,
            dragView: true,
            zoomView: true
        }
    };

    const findMod = (mod) => {
        try {
            for (var index = 0; index <= graph.nodes.length; index++) {
                if (graph.nodes[index].id === mod) {
                    return index;
                }
            }
        } catch { return -1; }
    };

    const events = {
        select: ({ nodes, edges }) => {
            const index = findMod(nodes.toString());
            setCode(graph.nodes[index]?.id || "");
            setName(graph.nodes[index]?.info[0] || "");
            setYear(graph.nodes[index]?.info[1] || "");
            setCredit(graph.nodes[index]?.info[2] || "");
            setDescribe(graph.nodes[index]?.info[3] || "");
        },

        doubleClick: ({ nodes, edges }) => {
            if (nodes.length !== 0) {
                updateGraph(nodes);
            }
        }
    };

    return (
        <div style={{ display: "flex", margin: "1%", gap: "1%" }}>
            <div id="graph" className="graphBox" >

                <Popover isLazy>
                    <PopoverTrigger>
                        <IconButton background="transparent" icon={<QuestionOutlineIcon />} />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>
                            <Text>Legend</Text>
                            <Text style={{ backgroundColor: "grey" }}>Module Completed</Text>
                            <Text style={{ backgroundColor: "greenyellow" }}>Module Available</Text>
                            <Text style={{ backgroundColor: "red" }}>Module Locked</Text>
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                            <Text>Graph Interation</Text>
                            <Text>Left Click: display module info</Text>
                            <Text>Double Left Click: toggle module status</Text>
                            <Text>Left Click & Drag: move module/graph</Text>
                            <Text>Scrolling: zoom in/out</Text>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>

                <Graph
                    style={{ height: "600px" }}
                    graph={graph}
                    options={options}
                    events={events} />

            </div>

            <div style={{ flex: "25%" }}>
                <p>
                    {name ? "You have selected: " + name.toString() : "Click on a module to find out more!"}
                </p>
                <p>
                    {code}
                    {credit ? " (" + credit.toString() + " MC)" : ""}
                </p>
                <p>{year ? "Academic Year: " + year.toString() : ""}</p>
                <br />
                <p>{descibe}</p>
            </div>

        </div>
    );
}