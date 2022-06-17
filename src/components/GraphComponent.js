import React, { useEffect, useState } from "react";
import Graph from "react-vis-graph-wrapper";

import { graphData } from "../hooks/GraphData";

export default function GradGraph(){
    const { modules, preq } = graphData()

    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

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
            multiselect: true,
            dragView: false,
            zoomView: false
        }
    };
    
    return (
        <div id="graph" style={{ height: "600px" }}>
            <Graph graph={graph} options={options} />
        </div>
    );
}
  
  
  