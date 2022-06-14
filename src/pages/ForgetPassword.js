import { useState } from "react";

import { Auth } from "../hooks/Auth";
import Header from "../components/Header";


export default function sendingResetLink() {

    
    const {sendPasswordReset} = Auth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    return (
        <>
            <Header />
            <h1> Send Recovery Link </h1>
            <form onSubmit={sendPasswordReset(email, setMessage)}>
                <div className="forget_box">
                    <p>Email</p>
                    <input
                                id="email"
                                className="inputField"
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                    <p> {message} </p>
                    <button className = "Button block" > Send Link</button>
                </div>
            </form>
        </>
    );
  }