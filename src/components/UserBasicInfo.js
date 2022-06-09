import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {

    const { profileInfoReady, email, firstName, lastName, enrollmentYear, updateProfile } = Auth();

    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");
    const [profileEnrollYr, setProfileEnrollYr] = useState("");

    useEffect(() => {
        setProfileEnrollYr(new Date().getFullYear())
    }, [])

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileFirstName(firstName);
        setProfileLastName(lastName);
        setProfileEnrollYr(enrollmentYear);

    }, [profileInfoReady]);

    return (
        <>
            <form onSubmit={ updateProfile(profileFirstName, profileLastName, profileEnrollYr) }>
                <table>
                    <tbody>
                        <tr>
                            <td>Email: </td>
                            <td>{email}</td>
                        </tr>
                        <tr>
                            <td>First Name:</td>
                            <td>
                                <input
                                    id="first-name"
                                    type="text"
                                    required
                                    placeholder="First Name"
                                    value={profileFirstName}
                                    onChange={(e) => setProfileFirstName(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Last Name:</td>
                            <td>
                                <input
                                    id="last-name"
                                    type="text"
                                    required
                                    placeholder="Last Name"
                                    value={profileLastName}
                                    onChange={(e) => setProfileLastName(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Enrollment Year: AY</td>
                            <td>
                                <input
                                    id="enrollment"
                                    type="number"
                                    required
                                    placeholder="Year which you enroll into NUS"
                                    min="0"
                                    value={profileEnrollYr}
                                    onChange={(e) => setProfileEnrollYr(e.target.value)}
                                />
                            </td>
                            </tr>
                    </tbody>
                </table> 
                <button>Update Profile</button>      
            </form>

        </>
    );

}