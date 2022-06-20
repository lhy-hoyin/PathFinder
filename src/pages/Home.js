import Header from "../components/Header";
import AdminAccess from "../components/AdminAccess";

import "../css/Home.css";

export default function Home() {
    return (
        <>
            <Header />
            <AdminAccess />
            <div className="textbox">
                <h1> Design YOUR path today</h1>
                <p> lol idk only limited to SoC</p>
                <p> Maybe put a getting started button here as a "tutorial"</p>
            </div>
        </>
  );
}
