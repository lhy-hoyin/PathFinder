import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import Header from "./components/Header";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import Login from"./pages/Login";
import SignUp from"./pages/SignUp";

import "./css/styles.css";

export default function App() {
    /*
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])
    */

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Home/>}/>
                    <Route path = "/Login" element = {<Login/>}/>
                    <Route path = "/SignUp" element = {<SignUp/>}/>
                </Routes>
            </BrowserRouter>

        </div>
    );
}