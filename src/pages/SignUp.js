import { useState } from "react";

import Header from "../components/Header";

import "../css/SignUp.css";

export default function SignUp() {
    const [email, setEmail] = useState('');

    //hack
    const handleSignup = async e => {
        e.preventDefault();
        setEmail("Email is " + email);
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
                        <button className="button block" aria-live="polite" onClick="handleSignup">
                            Register As New User
                        </button>
                    </form>
                </div>
            </div>

            <p>{email}</p>
        </>
    )
}
