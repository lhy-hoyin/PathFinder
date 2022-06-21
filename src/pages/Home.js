import { useState } from "react";
import { graphData } from "../hooks/GraphData";

import Header from "../components/Header";
import AdminAccess from "../components/AdminAccess";
import GraphComponent from "../components/GraphComponent";

import "../css/Home.css";



export default function Home() {
    const [course, setCourse] = useState("");
    const [message, setMessage] = useState("")

    //TODO: insert relevant modules
    const modsArr = ["CS1101S","CS2100","CS2030S","CS2040S"]

    const { getData } = graphData();

    return (
        <>
            <Header />
            <AdminAccess />
            <div className="textbox">
                <h1> Design YOUR path today</h1>
                <p> lol idk only limited to SoC</p>
                <p> Maybe put a getting started button here as a "tutorial"</p>
            </div>

            <form onSubmit={getData(modsArr)}>
                <p>Select Course: </p>
                <select required onChange={(e) => setCourse(e.target.value)}>
                    <option>Computer Science</option>
                    <option>Option2</option>
                </select>
                <button className="Button block">Generate Dependency Graph</button>
                <GraphComponent />
            </form>

        </>
    );
}
