import { useState } from 'react';

import "../css/Header.css";

export default function Header() {

    const [username, setUsername] = useState(null);
    //const [username, setUsername] = useState("Joe"); // TODO

    return (
        <section className="header">

            <a href="/">
                <img src="img/icon.png" alt="Pathfinder" height="100" width="100"/>
            </a>

            <div className="nav-links">
                {username == null ? (
                    <ul>
                        <li className='clickable'><a href="/sign-up">Sign Up</a></li>
                        <li className='clickable'><a href="/login">Login</a></li>
                    </ul>
                ) : (
                    <ul>
                        <li>Welcome, {username}!</li>
                        <li className='clickable'><a href="/logout">Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}