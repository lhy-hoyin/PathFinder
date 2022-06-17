import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';

import { supabase } from "../supabaseClient";
import { ProfileRoles } from "../constants";
import { Auth } from "../hooks/Auth";
import LoginPop from './LoginPop';

import "../css/Header.css";

export default function Header() {

    const navigate = useNavigate();
    const user = supabase.auth.user();
    const { profileInfoReady, role, email, firstName, lastName, logout } = Auth();

    useEffect(() => {
        if (!profileInfoReady)
            return

        if (role == ProfileRoles.New)
            return navigate("/profile/new");

    }, [profileInfoReady]);

    return (
        <section className="header">

            <a href="/">
                <img src="img/banner.png" alt="Pathfinder" height="100"/>
            </a>

            <div className="nav-links">
                {!user ? (
                    <ul>
                        <li className='clickable'><a href="/sign-up">Sign Up</a></li>
                        <Popup
                            className='login-popups'
                            trigger={
                                <li className="clickable"  style={{cursor:'pointer'}}>Login</li>
                            }>
                            <LoginPop />
                        </Popup>
                    
                    </ul>
                ) : (
                    <ul>
                            <li>Welcome, {firstName ?? lastName ?? email ?? "user"}!</li>
                            <li className='clickable'><a onClick={logout}  style={{cursor:'pointer'}}>Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}