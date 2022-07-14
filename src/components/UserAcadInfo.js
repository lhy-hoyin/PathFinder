import { useState, useEffect } from "react";
import { Text, Select, Button, useToast } from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import { getCourseNames } from "../helpers/Database";
import NUM_OF_COHORT_YEARS from "../definitions";

export default function UserAcadInfo() {

    const toast = useToast();
    const { profileInfoReady, cohort, course, updateProfileAcad } = Auth();

    const [profileCohort, setProfileCohort] = useState("");
    const [profileCourse, setProfileCourse] = useState("");
    const [cohortYears, setCohortYears] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    useEffect(() => {
        const cohortYrs = []
        const currentYear = new Date().getFullYear()

        for (var i = 0; i < NUM_OF_COHORT_YEARS; i++) {
            const val = (currentYear - i).toString() + "/" + (currentYear - i + 1).toString()
            cohortYrs.push(val)
        }
        setCohortYears(cohortYrs)

        const fetchCourses = async () => {
            const allCourseNames = await getCourseNames()
            setAllCourses(allCourseNames)
        }
        fetchCourses().catch(console.error)

    }, []);

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileCohort(cohort);
        setProfileCourse(course);
    }, [profileInfoReady]);

    const handleUpdateAcadInfo = async e => {
        e.preventDefault();

        const startUpdate = async () => {
            const result = await updateProfileAcad(profileCohort, profileCourse)
            toast({
                title: result.title,
                description: result.description,
                status: result.status,
                duration: 5000,
                isClosable: true,
            })
        }
        startUpdate().catch(console.error)
    }

    return (
        <>
            <form onSubmit={handleUpdateAcadInfo}>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text style={{ whiteSpace: "nowrap" }} margin={1}>
                        Cohort: AY
                    </Text>
                    <Select
                        onChange={(e) => setProfileCohort(e.target.value)}
                        margin={1}
                        required>
                        <option key="default" hidden>{profileCohort}</option>
                        {
                            cohortYears.map(item => (<option key={item}>{item}</option>))
                        }
                    </Select>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text style={{ whiteSpace: "nowrap" }} margin={1}>Course:</Text>
                    <Select
                        onChange={(e) => setProfileCourse(e.target.value)}
                        margin={1}
                        required>
                        <option key="default" hidden>{profileCourse}</option>
                        {
                            allCourses.map(item => (<option key={item}>{item}</option>))
                        }
                    </Select>
                </div>

                <Button
                    type="submit"
                    colorScheme='blue'
                    margin={1}>
                    Update Profile
                </Button>

            </form>
        </>
    );
}