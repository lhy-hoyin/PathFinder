import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Auth } from "../hooks/Auth";

import "../css/LoginPop.css";

export default function LoginPop() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const user = supabase.auth.user()

    const { login } = Auth();

    return (
        <form className='login-popup' onSubmit={ login(email, password) }>
            <div className="inside-login-popup">
                <label> Login Details</label>
                <input
                    id="email"
                    className="inputField"
                    type="email"
                    placeholder="Your email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />

                <input
                    id="password"
                    className="inputField"
                    type="password"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />

                <button className = "Button block" >
                    Log In
                </button>

                <a className='clickable' href="/forget-password">Forget Password?</a>

            </div>
        </form>
    );
  }