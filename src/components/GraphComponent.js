import React, { useEffect, useState } from "react";
import Graph from "react-vis-graph-wrapper";

import { graphData } from "../hooks/GraphData";

import "../css/GraphComponent.css";

export default function GradGraph(){
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
                from:   { enabled: true },
                to:     { enabled: false }
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
                return index; }
          }
        } catch { return -1; }
    };

    const events = {
        select: ({ nodes, edges }) => {
            const index = findMod(nodes.toString());
            if (index !== -1) {
                setCode(graph.nodes[index].id);
                setName(graph.nodes[index].info[0]);
                setYear(graph.nodes[index].info[1]);
                setCredit(graph.nodes[index].info[2]);
                setDescribe(graph.nodes[index].info[3]);
            } else {
                setCode("");
                setName("");
                setYear("");
                setCredit("");
                setDescribe("");
            }
        },

        doubleClick: ({ nodes, edges }) => {
            if (nodes.length !== 0) {
                updateGraph(nodes);
            }
        }
    };
    
    return (
        <>
            <div className="graphBox" id="graph" style={{ height: "700px" }}>
                <Graph graph={graph} options={options} events = {events} />
            </div>
            <div className = "disModuleText">
                <p>Selected module: {code} </p>
                <p>Name: {name} </p>
                <p>Academic Year: {year} </p>
                <p>Credits: {credit} </p>
                <p>Description: {descibe}</p>
          </div>
        </>
        
    );
}
  
  
  