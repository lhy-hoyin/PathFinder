import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {

    const NUM_OF_COHORT_YEARS = 5

    const { profileInfoReady, cohort, updateProfileAcad } = Auth();

    const [profileCohort, setProfileCohort] = useState("");
    const [cohortYears, setCohortYears] = useState([]);
    
    useEffect(() => {
        const cohortYrs = []
        const currentYear = new Date().getFullYear()

        for (var i = 0; i < NUM_OF_COHORT_YEARS; i++) {
            const val = (currentYear - i).toString() + "/" + (currentYear - i + 1).toString()
            cohortYrs.push(val)
        }

        setCohortYears(cohortYrs)
    }, []);

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileCohort(cohort);
    }, [profileInfoReady]);

    return (
        <>
            <form onSubmit={updateProfileAcad(profileCohort) }>
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
                </tbody></table>
                <button>Update Profile</button>
            </form>
        </>
    );
}