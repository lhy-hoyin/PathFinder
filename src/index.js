import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { ProvideAuth } from "./components/Auth";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        <ProvideAuth>
            <App />
        </ProvideAuth>
    </StrictMode>,
    rootElement
);