import { useState } from 'react';
import Popup from 'reactjs-popup';

import { supabase } from "../supabaseClient";
import { Auth } from "../components/Auth";
import LoginPop from './LoginPop';

import "../css/Header.css";

export default function Header() {

    const user = supabase.auth.user();
    const { username, logout } = Auth();

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
                            <li>Welcome, {username ?? "user"}!</li>
                            <li className='clickable'><a onClick={logout}>Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}