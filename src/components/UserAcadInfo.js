import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";
import { getCourseNames } from "../hooks/Database";

export default function UserAcadInfo() {

    const NUM_OF_COHORT_YEARS = 5

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

    return (
        <>
            <form onSubmit={updateProfileAcad(profileCohort, profileCourse) }>
                <table><tbody>
                    <tr>
                        <td>Cohort: AY</td>
                        <td>
                            <select
                                onChange={(e) => setProfileCohort(e.target.value)}
                                required>
                                <option key="default" hidden>{profileCohort}</option>
                                {
                                    cohortYears.map(item => (
                                        <option key={item}>{item}</option>
                                    ))
                                }
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Course:</td>
                        <td>
                            <select
                                onChange={(e) => setProfileCourse(e.target.value)}
                                required>
                                <option key="default" hidden>{profileCourse}</option>
                                {
                                    allCourses.map(item => (
                                        <option key={item}>{item}</option>
                                    ))
                                }
                            </select>
                        </td>
                    </tr>
                </tbody></table>
                <button>Update Profile</button>
            </form>
        </>
    );
}