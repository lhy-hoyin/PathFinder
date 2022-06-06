import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NewUser from "./pages/NewUser";

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/profile/new" element={<NewUser />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}