import { useState } from "react";

import Header from "../components/Header";
import Graph from "../components/Graph"




import "../css/Home.css";

export default function Home() {
    const [course, setCourse] = useState("");
    
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

            <Graph/>

            
        </>
  );
}
