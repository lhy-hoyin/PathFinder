import { useState } from "react";

import Header from "../components/Header";
import GraphComponent from "../components/GraphComponent"
import Graph from "react-vis-graph-wrapper";
import Color from "color";
import { graphData } from "../hooks/GraphData";

import { supabase } from "../supabaseClient";

import "../css/Home.css";



const edges = [
    {
      from: "CS1231S",
      to: "MA1301"
    },
  
    {
      from: "CS2040",
      to: "CS1231S"
    }
  ];

export default function Home() {
    const [course, setCourse] = useState("");
    const [nodes, setNodes] = useState([]);
    const [message, setMessage] = useState("")

    const { getNodes, test } = graphData();

    const graph = {nodes, edges}
    
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
            from: {
              enabled: true,
              scaleFactor: 0.7
            },
            to: {
              enabled: false
            }
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
        <>
            <Header />
            <div className="textbox">
                <h1> Design YOUR path today</h1>
                <p> lol idk only limited to SoC</p>
                <p> Maybe put a getting started button here as a "tutorial"</p>
            </div>
            <div>
                <p>Select Course: </p>
                <select required onChange={(e) => setCourse(e.target.value)}>
                    <option>Computer Science</option>
                    <option>Option2</option>
                </select> 
            </div> 

            <form onSubmit={getNodes(setNodes)}>
          
                <button className="Button block"> Generate notes</button>
        
            </form>
            
            
            <div id="graph" style={{ height: "600px" }}>
          <Graph
            graph={graph}
            options={options}
          />
        </div>

            
        </>
  );
}
