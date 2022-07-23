import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heading, Button } from '@chakra-ui/react';

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

    }, [profileInfoReady, role]);

    return (
        <>
            <Heading as='h1'>Set Up Your New Profile</Heading>
            <UserBasicInfo />

            <form onSubmit={logout}>
                <Button type="submit">Logout Now</Button>
            </form>
        </>
    );
}