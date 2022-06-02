import Popup from 'reactjs-popup';

import { supabase } from "../supabaseClient";
import { Auth } from "./Auth";
import LoginPop from './LoginPop';

import "../css/Header.css";

export default function Header() {

    const user = supabase.auth.user();
    const { email, firstName, lastName, logout } = Auth();

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