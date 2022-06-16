import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import Color from "color";

const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

const colors = [
    "rgb(243, 166, 131)",
    "rgb(247, 215, 148)",
    "rgb(119, 139, 235)",
    "rgb(231, 127, 103)",
    "rgb(207, 106, 135)",
    "rgb(75, 101, 132)"
  ];

function useProvideGraphData() {

  const getNodes = (setNodes) => async e => {
    e.preventDefault();
    let nodes = []
    try {
      let { data, error, status, count } = await supabase
        .from("testing")
        .select("module", { count: "exact" });
      if (error && status !== 406) {
        throw error;
      }
  
      if (data) {
        console.log(data);
        let temp = data.slice(0);
        //console.log(Object.values(temp[1]).toString());
        //console.log(count);
        let x = 0;
  
        while (x !== count) {
          nodes[x] = {id: Object.values(temp[x]).toString(),
                    label: Object.values(temp[x]).toString(),
                    color: {
                        border: Color(colors[x]).darken(0.2).hex(),
                        background: colors[x],
                        highlight: {
                          border: Color(colors[x]).darken(0.3).hex(),
                          background: Color(colors[x]).darken(0.2).hex()
                        },
                        hover: {
                          border: Color(colors[x]).darken(0.3).hex(),
                          background: Color(colors[x]).darken(0.2).hex()
                        }
                      }
                    };
          x = x + 1;
        }
        console.log(nodes)
        setNodes(nodes);  
        nodes = []
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const test = (setMessage) => async e =>{
    e.preventDefault();
    setMessage("Hellow world")
  }

  return {
      getNodes,
      test,
  };
}