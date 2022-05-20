import { useState } from 'react';

import "../css/Header.css";

export default function Header() {

    //const [username, setUsername] = useState(null);
    const [username, setUsername] = useState("Joe"); // TODO

    return (
        <section className="header">

            <a href="/">
                <img src="img/icon.png" alt="Pathfinder" height="100" width="100"/>
            </a>

            <div className="nav-links">
                {username == null ? (
                    <ul>
                        <li><a href="/SignUp">Sign Up</a></li>
                        <li><a href="/Login">Login</a></li>
                    </ul>
                ) : (
                    <ul>
                        <li>Welcome, {username}!</li>
                        <li><a href="/Logout">Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}