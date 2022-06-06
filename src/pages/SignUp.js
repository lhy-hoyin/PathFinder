import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Auth } from "../hooks/Auth";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

import "../css/SignUp.css";

export default function SignUp() {

    const navigate = useNavigate();
    const user = supabase.auth.user();

    const { signup } = Auth();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user != null)
            return navigate("/");
    }, [user]);

    return (
        <>
            <Header />
            <div className="frame">
                <div className="register-new" aria-live="polite">
                    <h1>Sign Up</h1> 
                    <form onSubmit={ signup(email, password1, password2, setMessage) }>
                        <input
                            id="email"
                            className="inputField"
                            type="email"
                            placeholder="Simply register for an account using your email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            id="password"
                            className="inputField"
                            type="password"
                            placeholder="Password (Minimum 6 characters)"
                            autoComplete="new-password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)} />
                        <input
                            id="confirm-password"
                            className="inputField"
                            type="password"
                            placeholder="Re-enter your password again"
                            autoComplete="off"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)} />
                        <button className="button block" aria-live="polite">
                            Register As New User
                        </button>
                    </form>
                </div>
            </div>
            <p>{message}</p>
        </>
    )
}
