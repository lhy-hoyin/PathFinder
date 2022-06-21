import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { ProvideAuth } from "./hooks/Auth";
import { ProvideGraphData } from "./hooks/GraphData"
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        <ProvideAuth>
            <ProvideGraphData>
                <App />
            </ProvideGraphData>
        </ProvideAuth>
    </StrictMode>,
    rootElement
);