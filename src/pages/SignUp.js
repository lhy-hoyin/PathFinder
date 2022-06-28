import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heading, Text,
    FormControl, FormHelperText,
    Input, InputGroup, InputRightElement,
    Button,
    useBoolean
} from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

import "../css/SignUp.css";

export default function SignUp() {

    const navigate = useNavigate();
    const user = supabase.auth.user();
    const { signup } = Auth();

    const [email, setEmail] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [message, setMessage] = useState('');

    const [showPassword, setShowPassword] = useBoolean();

    useEffect(() => {
        if (user != null)
            return navigate("/");
    }, [user]);

    return (
        <>
            <Header />

            <div className="frame">
                <div className="register-new" aria-live="polite">

                    <form onSubmit={signup(email, pass1, pass2, setMessage)}>

                        <Heading>Sign Up</Heading>

                        <Text>
                            Create An <i>PathFinder</i> account now using your email and password
                        </Text>

                        <FormControl isRequired>

                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                required
                                margin={1}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />

                            <InputGroup size='md' margin={1}>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter Password"
                                    autoComplete="new-password"
                                    paddingRight='4.5rem'
                                    required
                                    value={pass1}
                                    onChange={(e) => setPass1(e.target.value)} />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={setShowPassword.toggle}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormHelperText margin={1}>
                                Password should contain at least 6 characters
                            </FormHelperText>

                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Re-enter Password"
                                autoComplete="off"
                                required
                                margin={1}
                                value={pass2}
                                onChange={(e) => setPass2(e.target.value)} />
                            <FormHelperText margin={1}>
                                You can't show/hide this, so make sure to type correctly
                            </FormHelperText>

                            <Button colorScheme='blue' type="submit" margin={1}>
                                Register As New User
                            </Button>

                        </FormControl>

                    </form>

                    <p>{message}</p>

                </div>
            </div>
            
        </>
    )
}
