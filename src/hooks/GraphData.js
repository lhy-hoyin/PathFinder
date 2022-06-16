import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";


const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

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
                      label: Object.values(temp[x]).toString()};
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