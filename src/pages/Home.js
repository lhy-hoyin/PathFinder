import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";
import { graphData } from "../hooks/GraphData";
import { getCourseNames } from "../hooks/Database";

import Header from "../components/Header";
import AdminAccess from "../components/AdminAccess";
import GraphComponent from "../components/GraphComponent";
import SemesterSchedule from "../components/SemesterSchedule"

import "../css/Home.css";

export default function Home() {

    const { getData, getCoursesRequirement } = graphData();
    const { profileInfoReady,  course } = Auth();

    const [selectedCourse, setSelectedCourse] = useState("");
    const [courseSelection, setCourseSelection] = useState([]);
    

    //const modsArr = ["CS1231S","CS1101S","MA1521","MA2001","IS1103","ES2660","CS2100","CS2030S","CS2040S","CS2109S","ST2334","CS2106","CS3230","CS2101","CS2103T"]

    useEffect(() => {

        const fetchCourses = async () => {
            getCoursesRequirement() 
            const courseNames = await getCourseNames()
            setCourseSelection(courseNames)
        }
        fetchCourses().catch(console.error)
        
    }, [])

    useEffect(() => {
        if (!profileInfoReady)
            return

        setSelectedCourse(course);
    }, [profileInfoReady])

    return (
        <>
            <Header />

            <AdminAccess />

            <div className="textbox">
                <h1> Design YOUR path today</h1>
                <p> Only limited to Computer Science for now</p>
            </div>

            <form onSubmit={getData(selectedCourse) }>
                
                <div className="selectingGrad">
                    <p>Course: </p>
                    <select required onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option key="default" hidden>{selectedCourse}</option>
                        {
                            courseSelection.map(item => (
                                <option key={item}>{item}</option>
                            ))
                        }
                    </select>
                    <button className="buttonBlock">Generate Module Dependency Graph</button>
                </div>

                <div className="selectingGrad2">
                    <p>Legend:</p>
                    <p>Gray = Module Completed</p>
                    <p>Green = Module availble</p>
                    <p>Red = Module Lock</p>
                </div>

                <GraphComponent />
                <SemesterSchedule/>

            </form>

        </>
    );
}
