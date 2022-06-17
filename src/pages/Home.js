import { useState } from "react";

import Header from "../components/Header";
import GraphComponent from "../components/GraphComponent"

import { graphData } from "../hooks/GraphData";



import "../css/Home.css";



export default function Home() {
    const [course, setCourse] = useState("");
    const [nodes, setNodes] = useState([]); //To be changed
    const [message, setMessage] = useState("")

    const { getNodes, test, modules } = graphData();
    
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
            
            


            <GraphComponent/>
            
        </>
  );
}
