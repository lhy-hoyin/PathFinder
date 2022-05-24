import { useState } from "react";

import { Auth } from "../components/Auth";
import Header from "../components/Header";

import "../css/SignUp.css";

export default function SignUp() {

    const { signup } = Auth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <>
            <Header />
            <div className="frame">
                <div className="register-new" aria-live="polite">
                    <h1>Sign Up</h1> 
                    <form onSubmit={signup(email, setMessage, password)}>
                        <input
                            id="email"
                            className="inputField"
                            type="email"
                            placeholder="Simply register for an account using your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            id="password"
                            className="inputField"
                            type="password"
                            placeholder="Password (Minimum 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
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
