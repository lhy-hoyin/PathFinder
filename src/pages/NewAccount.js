import { useState } from "react";

import { Auth } from "../components/Auth";

export default function NewAccount() {

    const { email, firstName, lastName } = Auth();

    const [profileFirstName, setProfileFirstName] = useState(firstName);
    const [profileLastName, setProfileLastName] = useState(lastName);

    return (
        <>
            <h1>NewAccount Page</h1>

            <p>{email}</p>

            <input
                id="first-name"
                type="text"
                placeholder="First Name"
                value={profileFirstName || ''}
                onChange={(e) => setProfileFirstName(e.target.value)}
                />

            <input
                id="last-name"
                type="text"
                placeholder="Last Name"
                value={profileLastName || ''}
                onChange={(e) => setProfileLastName(e.target.value)}
                />

            <button>Update Profile</button>
        </>
    );

}