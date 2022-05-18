import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = supabase.auth.user()

  const handleSignup = async e => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async e => {
    
    e.preventDefault();

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
    <auth>
      <h2>Let's Get Started</h2>
      <form onSubmit={handleSignup}>
        <label htmlFor="email">Email</label>
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

        <button className="button block" aria-live="polite">
          Sign Up
        </button>
      </form>
      <form onSubmit={handleLogin}>
        <label> Email</label>
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
        
        <button className = "Button block" aria-live="polite">
            Sign in
        </button>

      </form>

      <h3> Status </h3>
      <p className="text-center text-2xl">
      {
        user ? "You are logged in"
        : "You're not logged in"
      }
      </p>

      {isLoading ? <p>Loading please wait, please wait</p> : ""}
      <p>{email}</p>


    </auth>
  );
}
