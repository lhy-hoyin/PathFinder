import Header from "./components/Header";
import Auth from "./components/Auth";
import Login from"./pages/Login";
import SignUp from"./pages/SignUp";

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import "./styles.css";
import "./components/Header.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                
                <Routes>
                    <Route path = "/" element = {<Header/>}/>
                    <Route path = "/Login" element = {<Login/>}/>
                    <Route path = "/SignUp" element = {<SignUp/>}/>
                </Routes>
                
            </BrowserRouter>
        </div>
    );
}