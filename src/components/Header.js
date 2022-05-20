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
                        <li className='signup-link'><a href="/SignUp">Sign Up</a></li>
                        <li className='Loginin-link'><a href="/Login">Login</a></li>
                    </ul>
                ) : (
                    <ul>
                        <li className='userName'>Welcome, {username}!</li>

                        <li className='logout-link'><a href="/Logout">Logout</a></li>
                    </ul>
                )}
            </div>

        </section>
    );
}