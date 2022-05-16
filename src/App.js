import { useState } from "react"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://udtzazrwdrljfzefspzj.supabase.co"
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdHphenJ3ZHJsamZ6ZWZzcHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI3Mjc1NzMsImV4cCI6MTk2ODMwMzU3M30.ex95GAtoMYArdMXQ6TiNUriflf5N97uNNHcGV97O6H8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function App() {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
        setLoading(true)
        const { error } = await supabase.auth.signIn({ email })
        if (error) throw error
        alert('Check your email for the login link!')
        } catch (error) {
        alert(error.error_description || error.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <>
            <h1>PathFinder</h1>
            <p>Hello World</p>

            <form onSubmit={handleLogin}>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    className="inputField"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button className="button block" aria-live="polite">
                Sign Up
                </button>

            </form>

            {loading ? <p>Loading</p> : ""}
            <p>{email}</p>

            <div></div>
        </>
    );
}