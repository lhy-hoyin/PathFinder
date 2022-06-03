import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Forget_password from "./pages/Forget_password"
import ResetPassword from "./pages/ResetPassword"

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Home/>}/>
                    <Route path = "/sign-up" element = {<SignUp/>}/>
                    <Route path = "/forget_password" element = {<Forget_password/>}/>
                    <Route path ="/reset-password"element = {<ResetPassword/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}