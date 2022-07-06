import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from "react-dom/client";

import { ProvideAuth } from "./hooks/Auth";
import { ProvideGraphData } from "./hooks/GraphData"
import App from "./App";

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement);

root.render(
    <ChakraProvider>
        <ProvideAuth>
            <ProvideGraphData>
                <App />
            </ProvideGraphData>
        </ProvideAuth>
    </ChakraProvider>
);