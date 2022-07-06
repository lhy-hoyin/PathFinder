import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heading, Text,
    FormControl, FormHelperText,
    Input, InputGroup, InputRightElement,
    Button,
    useBoolean, useToast
} from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import PWD_MIN_LENGTH from "../definitions";

import "../css/SignUp.css";

export default function SignUp() {

    const toast = useToast();
    const navigate = useNavigate();
    const user = supabase.auth.user();
    const { signup } = Auth();

    const [email, setEmail] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useBoolean();
    const [showPassword, setShowPassword] = useBoolean();

    useEffect(() => {
        if (user != null)
            return navigate("/");
    }, [user]);

    const handleSignup = async e => {
        e.preventDefault();

        const startSignUp = async () => {
            setIsLoading.on()

            const result = await signup(email, pass1)
            toast({
                title: result.title,
                description: result.description,
                status: result.status,
                duration: 5000,
                isClosable: true,
            })

            setIsLoading.off()
        }

        // Verify that password is matching
        if (pass1 !== pass2) {
            console.warn("Mis-matched password")
            setErrorMsg("Password does not match")
        }
        // verify that password min length is met
        else if (pass1.length < PWD_MIN_LENGTH) {
            console.warn("User password too short")
            setErrorMsg("Password needs at least " + PWD_MIN_LENGTH.toString() + " characters)")
        }
        else startSignUp().catch(console.error)
        
    }

    return (
        <>
            <Header />

            <div className="frame">
                <div className="register-new" aria-live="polite">

                    <form onSubmit={handleSignup}>

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

                            <Button
                                type="submit"
                                colorScheme='blue'
                                loadingText='Signing up ... please be patient...'
                                isLoading={isLoading}
                                margin={1}>
                                Register As New User
                            </Button>

                        </FormControl>

                    </form>

                    <p>{errorMsg}</p>

                </div>
            </div>
            
        </>
    )
}
