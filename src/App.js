import Header from "./components/Header";
import Auth from "./components/Auth";

import "./styles.css";

export default function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Auth />
            </main>
        </div>
    );
}