import { useState } from "react";
import { supabase } from "../supabaseClient";

import "../css/LoginPop.css";

export default function LoginPop() {

    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const user = supabase.auth.user()

    const handleLogin = async e => {
    
        e.preventDefault();

        // FIXME: Let Auth.js handle this
        try {
          setLoading(true);
    
          const { error } = await supabase.auth.signIn({ email, password });
          if (error) throw error;
          alert("Signed in");
        } catch (error) {
          alert(error.error_description || error.message);
        } finally {
          setLoading(false);
        }
    
      };

    return (
        <form className = 'login-popup'onSubmit={handleLogin}>
            <div className="inside-login-popup">
                <label> Login Details</label>
                <input
                id="email"
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />

                <input
                id="password"
                className="inputField"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />

                <button className = "Button block" >
                    Sign in
                </button>

                <a className='clickable' href="/reset_password">Forget Password?</a>

            </div>
        </form>
    );
  }