import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Auth } from "../hooks/Auth";
import UserBasicInfo from "../components/UserBasicInfo";
import { ProfileRoles } from "../constants";

export default function NewUser() {

    const { logout, profileInfoReady, role } = Auth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!profileInfoReady)
            return

        if (role >= ProfileRoles.Normal)
            return navigate("/profile");

    }, [profileInfoReady]);

    return (
        <>
            <h1>Set Up Your New Profile</h1>
            <UserBasicInfo />

            <form onSubmit={ logout }>
                <button>Logout Now</button>
            </form>
        </>
    );
}