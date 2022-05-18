import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async e => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <auth>
      <h2>Let's Get Started</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="inputField"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button className="button block" aria-live="polite">
          Sign Up
        </button>

        <button className="button block" aria-live="polite">
          Login using email
        </button>
      </form>

      {isLoading ? <p>Signing up, please wait</p> : ""}
      <p>{email}</p>
    </auth>
  );
}
