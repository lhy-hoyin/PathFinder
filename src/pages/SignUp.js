import { useState } from "react";
import { supabase } from "../supabaseClient";

import Header from "../components/Header";

import "../css/SignUp.css";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    //hack
    const handleSignup = async e => {
        e.preventDefault();

        try {
            setMessage("Signing up ... please be patient...");
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setMessage("Check your email for the login link!");
        } catch (error) {
            alert(error.error_description || error.message);
            setMessage("Oops..something wrong happened");
        }

    }

    return (
        <>
            <Header />
            <div className="frame">
                <div className="register-new" aria-live="polite">
                    <h1>Sign Up</h1> 
                    <form onSubmit={handleSignup}>
                        <input
                            id="email"
                            className="inputField"
                            type="email"
                            placeholder="Simply register for an account using your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            id="password"
                            className="inputField"
                            type="password"
                            placeholder="Password (Minimum 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="button block" aria-live="polite" onClick="handleSignup">
                            Register As New User
                        </button>
                    </form>
                </div>
            </div>

            <p>{message}</p>
        </>
    )
}
