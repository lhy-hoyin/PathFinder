import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Home/>}/>
                    <Route path = "/login" element = {<Login/>}/>
                    <Route path = "/sign-up" element = {<SignUp/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}