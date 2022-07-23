import { useState } from "react";
import { Text, Input, Button, useToast } from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import PWD_MIN_LENGTH from "../definitions";

export default function ChangePassword() {

    const toast = useToast();
    const { resettingPassword } = Auth();

    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [message, setMessage] = useState("");

    const handleChangePassword = async e => {
        e.preventDefault();

        const startChangePassword = async () => {
            const result = await resettingPassword(password)
            toast({
                title: result.title,
                description: result.description,
                status: result.status,
                duration: 5000,
                isClosable: true,
            })
        }

        if (password !== passwordRepeat) {
            console.warn("Mis-matched password")
            setMessage("Password does not match")
        }
        // verify that password min length is met
        else if (password.length < PWD_MIN_LENGTH) {
            console.warn("User password too short")
            setMessage("Password needs at least " + PWD_MIN_LENGTH.toString() + " characters)")
        }
        else startChangePassword().catch(console.error)
    }

    return (
        <form onSubmit={handleChangePassword}>
            <Input
                id="password"
                type='password'
                placeholder="Enter New Password"
                autoComplete="new-password"
                required
                margin={1}
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

            <Input
                id="confirm-password"
                type='password'
                placeholder="Re-enter new password again"
                autoComplete="off"
                required
                margin={1}
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)} />


            <Text>{message}</Text>

            <Button
                type="submit"
                colorScheme='blue'
                margin={1}>
                Reset Password
            </Button>
        </form>
    );

}