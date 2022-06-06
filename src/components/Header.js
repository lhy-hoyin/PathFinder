import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';

import { supabase } from "../supabaseClient";
import { Auth } from "../hooks/Auth";
import LoginPop from './LoginPop';

import "../css/Header.css";

export default function Header() {

    const navigate = useNavigate();
    const user = supabase.auth.user();
    const { profileInfoReady, isReady, email, firstName, lastName, logout } = Auth();

    useEffect(() => {
        if (!profileInfoReady)
            return

        if (!isReady)
            return navigate("/profile/new");

    }, [profileInfoReady]);

    return (
        <section className="header">

            <a href="/">
                <img src="img/icon.png" alt="Pathfinder" height="100" width="100"/>
            </a>

            <div className="nav-links">
                {!user ? (
                    <ul>
                        <li className='clickable'><a href="/sign-up">Sign Up</a></li>
                        <Popup
                            className='login-popups'
                            trigger={
                                <li className="clickable">Login</li>
                            }>
                            <LoginPop />
                        </Popup>
                    
                    </ul>
                ) : (
                    <ul>
                            <li>Welcome, {firstName ?? lastName ?? email ?? "user"}!</li>
                            <li className='clickable'><a onClick={logout}>Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}