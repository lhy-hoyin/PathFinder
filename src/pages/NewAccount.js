import { useState, useEffect } from "react";

import { supabase } from "../supabaseClient";
import { Auth } from "../components/Auth";

export default function NewAccount() {
    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");

    const { profileReady, email, firstName, lastName, updateProfile } = Auth();

    useEffect(() => {
        if (!profileReady)
            return

        setProfileFirstName(firstName);
        setProfileLastName(lastName);

    }, [profileReady]);

    const updateBasicInfo = async e => {
        e.preventDefault();

        /*const user = supabase.auth.user();

        var profileIsComplete = (profileFirstName.length != 0) && (profileLastName.length != 0)

        // Pacakage data properly
        const updates = {
            id: user.id,
            FirstName: profileFirstName,
            LastName: profileLastName,
            isReady: profileIsComplete,
            updated_at: new Date(),
        }

        console.log("trigger1")
        updateProfile(updates)*/

        //alert("Profile Updated successfully")
    };

    return (
        <>
            <h1>NewAccount Page</h1>

            <p>Email: {email}</p>
            <form onSubmit={ updateBasicInfo }>

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