
import React, { Component } from "react";
import Color from "color";
import Graph from "react-vis-graph-wrapper";
import {graphData} from "../hooks/GraphData"


const colors = [
    "rgb(243, 166, 131)",
    "rgb(247, 215, 148)",
    "rgb(119, 139, 235)",
    "rgb(231, 127, 103)",
    "rgb(207, 106, 135)",
    "rgb(75, 101, 132)"
  ];
  
  const edges = [
    {
      from: "2010CS1231S",
      to: "2010MA1301"
    },
  
    {
      from: "2010CS2040S",
      to: "2010CS1231S"
    },
    {
      from: "2010ES1103",
      to: "2010ES2660"
    }
  ];
  
  const nodes = [
    {
      id: "2010MA1301",
      label: "MA1301"
    },
    {
      id: "2010CS1231S",
      label: "CS1231S"
    },
    {
      id: "2010CS2040S",
      label: "CS2040S"
    },
    {
      id: "2010ES1103",
      label: "ES1103"
    },
    {
      id: "1010ES2660",
      label: "ES2660"
    }
  ].map((c, i) => ({
    ...c,
    color: {
      border: Color(colors[i]).darken(0.2).hex(),
      background: colors[i],
      highlight: {
        border: Color(colors[i]).darken(0.3).hex(),
        background: Color(colors[i]).darken(0.2).hex()
      },
      hover: {
        border: Color(colors[i]).darken(0.3).hex(),
        background: Color(colors[i]).darken(0.2).hex()
      }
    }
  }));
  
  const graph = {nodes, edges};
  
  
  export default function GradGraph(){
    
  
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
        
        <div id="graph" style={{ height: "600px" }}>
          <Graph
            graph={graph}
            options={options}
          />
        </div>
        </>
      );
    }
  
  
  