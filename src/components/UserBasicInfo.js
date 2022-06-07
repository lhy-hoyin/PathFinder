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
            <p>Email: {email}</p>
            <form onSubmit={ updateProfile(profileFirstName, profileLastName) }>

                <input
                    id="first-name"
                    type="text"
                    placeholder="First Name"
                    value={profileFirstName}
                    onChange={(e) => setProfileFirstName(e.target.value)}
                />

                <input
                    id="last-name"
                    type="text"
                    placeholder="Last Name"
                    value={profileLastName}
                    onChange={(e) => setProfileLastName(e.target.value)}
                />

                <button>Update Profile</button>
            </form>

        </>
    );

}