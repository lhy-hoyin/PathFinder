import { useState, useEffect } from "react";

import { ProfileRoles } from "../constants";
import { Auth } from "../hooks/Auth"

export default function AdminAccess() {

    const { profileInfoReady, role } = Auth();

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!profileInfoReady)
            return

        if (role & ProfileRoles.Admin)
            setShowContent(true);

    }, [profileInfoReady])

    return (
        <>
            {showContent ? (
                <>
                    <p>Admin Quick Links</p>
                    <a href="/api">API</a>  
                </>
            ): (<></>)}
        </>
    );

}