import { useState, useEffect } from "react";

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {
    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");

    const { profileInfoReady, email, firstName, lastName, updateProfile } = Auth();

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileFirstName(firstName);
        setProfileLastName(lastName);

    }, [profileInfoReady]);

    return (
        <>
            <form onSubmit={ updateProfile(profileFirstName, profileLastName) }>
                <table>
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
                                placeholder="Last Name"
                                value={profileLastName}
                                onChange={(e) => setProfileLastName(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr><button>Update Profile</button></tr>
                </table> 
            </form>

        </>
    );

}