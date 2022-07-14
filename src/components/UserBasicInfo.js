import { useState, useEffect } from "react";
import { Text, Input, Button, useToast } from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";

export default function UserBasicInfo() {

    const toast = useToast();
    const { profileInfoReady, email, firstName, lastName, updateProfileBasic } = Auth();

    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");

    useEffect(() => {
        if (!profileInfoReady)
            return

        setProfileFirstName(firstName);
        setProfileLastName(lastName);
    }, [profileInfoReady]);

    const handleUpdateAcadInfo = async e => {
        e.preventDefault();

        const startUpdate = async () => {
            const result = await updateProfileBasic(profileFirstName, profileLastName)
            toast({
                title: result.title,
                description: result.description,
                status: result.status,
                duration: 5000,
                isClosable: true,
            })
        }
        startUpdate().catch(console.error)
    }

    return (
        <>
            <form onSubmit={handleUpdateAcadInfo}>

                <Text style={{ whiteSpace: "nowrap" }} margin={1}>
                    Email: {email}
                </Text>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text style={{ whiteSpace: "nowrap" }} margin={1}>
                        First Name:
                    </Text>
                    <Input
                        id="first-name"
                        type="text"
                        placeholder="First Name"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Text style={{ whiteSpace: "nowrap" }} margin={1}>
                        Last Name:
                    </Text>
                    <Input
                        id="last-name"
                        type="text"
                        placeholder="Last Name"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    colorScheme='blue'
                    margin={1}>
                    Update Profile
                </Button>

            </form>

        </>
    );

}