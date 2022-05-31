import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NewAccount from "./pages/NewAccount";

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Home />} />
                    <Route path = "/sign-up" element = {<SignUp />} />
                    <Route path = "/new-profile" element = {<NewAccount />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}