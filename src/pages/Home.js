import { useState, useEffect } from "react";
import {
    Text, Select, Button, Tooltip,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import { graphData } from "../hooks/GraphData";
import { getCourseNames } from "../helpers/Database";
import { supabase } from "../helpers/SupabaseClient";

import Header from "../components/Header";
import AdminAccess from "../components/AdminAccess";
import GraphComponent from "../components/GraphComponent";
import SemesterSchedule from "../components/SemesterSchedule";
import ModulesTable from "../components/ModulesTable";


export default function Home() {

    const user = supabase.auth.user();
    const isLoggedIn = (user !== null);

    const { getData, getCoursesRequirement } = graphData();
    const { profileInfoReady, course } = Auth();

    const [tabIndex, setTabIndex] = useState(0);
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

    const handleTabsChange = (index) => {
        setTabIndex(index)
    }

    return (
        <>
            <Header />

            <AdminAccess />

            <Tabs
                isLazy
                isManual
                index={tabIndex}
                onChange={handleTabsChange}
                variant='enclosed'>
                <TabList>
                    <Tab>Graph</Tab>

                    <Tooltip
                        label={isLoggedIn ? "" : "Requires login"}
                        placement='top'
                        closeOnClick={false}
                        shouldWrapChildren>
                        <Tab isDisabled={!user}>Modules</Tab>
                    </Tooltip>

                </TabList>

                <TabPanels>
                    <TabPanel>

                        <form onSubmit={getData(selectedCourse)}>

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
                                            courseSelection.map(item => (<option key={item}>{item}</option>))
                                        }
                                    </Select>
                                </div>

                                <Button type="submit" colorScheme='blue'>
                                    Generate Module Dependency Graph
                                </Button>
                            </div>
                        </form>

                        <GraphComponent />
                        <SemesterSchedule />
                    </TabPanel>

                    <TabPanel>
                        <ModulesTable />
                    </TabPanel>
                </TabPanels>
            </Tabs>



        </>
    );
}
