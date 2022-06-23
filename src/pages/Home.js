import { useState, useEffect } from "react";
import { graphData } from "../hooks/GraphData";

import Header from "../components/Header";
import AdminAccess from "../components/AdminAccess";
import GraphComponent from "../components/GraphComponent";

import "../css/Home.css";

export default function Home() {
    
    const [course, setCourse] = useState("");
    const [message, setMessage] = useState("");
    const [courseSelection, setCourseSelection] = useState([]);

    //TODO: insert relevant modules
    const modsArr = ["CS1231S","CS1101S","MA1521","MA2001","IS1103","ES2660","CS2100","CS2030S","CS2040S","CS2109S","ST2334","CS2106","CS3230","CS2101","CS2103T"]

    const { getData, getCourses } = graphData();

    useEffect(() => {

        const fetchCourses = async () => {
            const allCourseNames = await getCourses()
            setCourseSelection(allCourseNames)
        }

        fetchCourses()
            .catch(console.error)
        
    }, [])

    return (
        <>
            <Header />
            <AdminAccess />
            <div className="textbox">
                <h1> Design YOUR path today</h1>
                <p> lol idk only limited to SoC</p>
                <p> Maybe put a getting started button here as a "tutorial"</p>
            </div>

            <form onSubmit={getData( course )}>
                <p>Select Course: </p>
                <div className="selectingGrad">
                    <select required onChange={(e) => setCourse(e.target.value)}>
                        {
                            courseSelection.map(item => (
                                <option key={item}>{item}</option>
                            ))
                        }
                    </select>
                    <button className="buttonBlock">Generate Dependency Graph</button>
                </div>
                <div className="selectingGrad2">
                    <p>Gray = Module Completed</p>
                    <p>Green = Module availble</p>
                    <p>Red = Module Lock</p>
                </div>
                <GraphComponent />
            </form>

        </>
    );
}
