import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { UserOnlyRoute } from './components/ProtectedRoute';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import NewUser from "./pages/NewUser";
import UserProfile from "./pages/UserProfile";
import API from "./pages/API";

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    // Open to all
                    <Route path="/" element={<Home/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/forget-password" element={<ForgetPassword/>}/>

                    // Accessible only when logged in
                    <Route path='/' element={<UserOnlyRoute />}>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/profile/new" element={<NewUser />} />

                        // Admin only
                        <Route path="/api" element={<API />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </div>
    );
}