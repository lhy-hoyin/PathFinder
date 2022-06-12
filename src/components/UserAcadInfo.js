import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {

    const { profileInfoReady, cohort, updateProfileAcad } = Auth();

    const [profileCohort, setProfileCohort] = useState("");

    const currentYear = new Date().getFullYear()

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileCohort(cohort);
    }, [profileInfoReady]);

    return (
        <>
            <form onSubmit={updateProfileAcad(profileCohort) }>
                <table>
                    <tbody>
                        <tr>
                            <td>Cohort: AY</td>
                            <td>
                                <select
                                    required
                                    onChange={(e) => setProfileCohort(e.target.value)} >
                                    <option>{profileCohort}</option>
                                    <option>{(currentYear - 9)}/{(currentYear - 8)}</option>
                                    <option>{(currentYear - 8)}/{(currentYear - 7)}</option>
                                    <option>{(currentYear - 7)}/{(currentYear - 6)}</option>
                                    <option>{(currentYear - 6)}/{(currentYear - 5)}</option>
                                    <option>{(currentYear - 5)}/{(currentYear - 4)}</option>
                                    <option>{(currentYear - 4)}/{(currentYear - 3)}</option>
                                    <option>{(currentYear - 3)}/{(currentYear - 2)}</option>
                                    <option>{(currentYear - 2)}/{(currentYear - 1)}</option>
                                    <option>{(currentYear - 1)}/{(currentYear + 0)}</option>
                                    <option>{(currentYear + 0)}/{(currentYear + 1)}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button>Update Profile</button>
            </form>

        </>
    );

}