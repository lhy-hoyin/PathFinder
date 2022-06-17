import { useState, useContext, createContext } from "react";
import Color from "color";

import { supabase } from "../supabaseClient";

const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

function useProvideGraphData() {

    const [modules, setModules] = useState([]);
    const [preq, setPreq] = useState([]);

    const colors = [
        "rgb(243, 166, 131)",
        "rgb(247, 215, 148)",
        "rgb(119, 139, 235)",
        "rgb(231, 127, 103)",
        "rgb(207, 106, 135)",
        "rgb(75, 101, 132)"
    ];

    const getData = () => async e => {
        e.preventDefault();
        try {
            let { data, error, status, count } = await supabase
                .from("testing")
                .select("*", { count: "exact" });

            if (data == null)
                throw ("no data from database")

            //console.debug("Data", data);

            let temp = data.slice(0);
            let edges = [];
            let mod = [];
            let x = 0;

            for (var node = 0; node < count; node++) {

                mod[node] = {
                    id: temp[node].module,
                    label: temp[node].module,
                    color: {
                        border: Color(colors[node]).darken(0.2).hex(),
                        background: colors[node],
                        highlight: {
                            border: Color(colors[node]).darken(0.3).hex(),
                            background: Color(colors[node]).darken(0.2).hex()
                        },
                        hover: {
                            border: Color(colors[x]).darken(0.3).hex(),
                            background: Color(colors[x]).darken(0.2).hex()
                        }
                    }
                };

                if (temp[node].Prequites) {
                    //console.debug(temp[node].Prequites.length);
                    for (var req = 0; req < temp[node].Prequites.length; req++) {
                        edges[x] = { from: temp[node].module, to: temp[node].Prequites[req] };
                        x++;
                    }
                }

            }

            console.debug("Edges", edges);

            setModules(mod);
            setPreq(edges);

        } catch (error) {
            alert(error.message);
        }
    };

    return {
        getData,

        modules,
        preq
    };
}