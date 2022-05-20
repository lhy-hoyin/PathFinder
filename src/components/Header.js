import "../css/Header.css";

export default function Header() {

    return (
        <section className="header">
            <nav>

                <a href="/">
                    <img src="img/icon.png" alt="Pathfinder" />
                </a>

                <div className="nav-links">
                    <ul>
                        <li><a href="/Login"> Login</a></li>
                        <li><a href="/SignUp"> Sign Up</a></li>
                    </ul>
                </div>

            </nav>
        </section>
    );
}