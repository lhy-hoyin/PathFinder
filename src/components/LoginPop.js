import { useState } from "react";
import {
    Input, InputGroup, InputRightElement,
    Text, Button, useBoolean
} from '@chakra-ui/react';

import { Auth } from "../hooks/Auth";

import "../css/styles.css";

export default function LoginPop() {

    const { login } = Auth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useBoolean();

    return (
        <div >
            <form onSubmit={ login(email, password) }>
            
                <Text> Login Details</Text>

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
                        autoComplete="password"
                        paddingRight='4.5rem'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={setShowPassword.toggle}>
                            {showPassword ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <Button
                    type="submit"
                    colorScheme='blue'
                    margin={1}>
                    Log In
                </Button>

            </form>

            <a className='clickable' href="/forget-password">Forget Password?</a>

        </div>
    );
  }