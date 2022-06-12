import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {

    const { profileInfoReady, email, firstName, lastName, enrollmentYear, updateProfile } = Auth();

    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");
    const [profileEnrollYr, setProfileEnrollYr] = useState("");

    const currentYear = new Date().getFullYear()

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
                                <select
                                    required
                                    defaultValue="hii"
                                    onChange={(e) => setProfileEnrollYr(e.target.value)}
                                >
                                    <option>{ profileEnrollYr }</option>
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