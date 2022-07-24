import { useState } from "react";
import { Heading, Text, Input, Button } from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import Header from "../components/Header";

export default function sendingResetLink() {

    const { sendPasswordReset } = Auth();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    return (
        <>
            <Header />

            <Heading>Send Recovery Link </Heading>

            <form onSubmit={sendPasswordReset(email, setMessage)}>

                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    margin={1}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <Text> {message} </Text>

                <Button
                    type="submit"
                    colorScheme='blue'
                    margin={1}>
                    Send Link
                </Button>

            </form>
        </>
    );
}
