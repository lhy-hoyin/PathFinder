import { useState, useEffect } from "react";
import { Text, Select, Button, useToast } from '@chakra-ui/react';

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

            <div className="generalinfo">
                <h1> Design YOUR path today</h1>
                <p> Only limited to Computer Science for now</p>
            </div>

            <form onSubmit={ getData(selectedCourse) }>
                
                <div style={{
                    gap: "5px",
                    display: "flex",
                    flexFlow: "row wrap",
                    alignItems: "center"
                }}>
                    <Text style={{ whiteSpace: "nowrap" }} margin={1}>
                        Course: 
                    </Text>

                    <div style={{ width: "fit-content" }}>
                        <Select
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required >
                            <option key="default" hidden>{selectedCourse}</option>
                            {
                                courseSelection.map(item => ( <option key={item}>{item}</option> ))
                            }
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        colorScheme='blue'>
                        Generate Module Dependency Graph
                    </Button>
                </div>

            </form>

            <div style={{
                display: "flex",
                width: "50%",
                justifyContent: "s"
            }}>
                <p>Legend:</p>
                <p>Gray = Module Completed</p>
                <p>Green = Module availble</p>
                <p>Red = Module Lock</p>
            </div>

            <GraphComponent />

            <SemesterSchedule />

        </>
    );
}
