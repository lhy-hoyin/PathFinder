import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute'

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import NewUser from "./pages/NewUser";
import UserProfile from "./pages/UserProfile";

import "./css/styles.css";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Home/>}/>
                    <Route path = "/sign-up" element = {<SignUp/>}/>
                    <Route path = "/forget-password" element = {<ForgetPassword/>}/>

                    //any route related to the user enter here eg. profile, reset password, etc
                    <Route path='/' element = {<ProtectedRoute/>}>
                        <Route path ="/reset-password"element = {<ResetPassword/>}/>
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/profile/new" element={<NewUser />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </div>
    );
}