import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import Color from "color";

const graphContext = createContext();

export function ProvideGraphData({ children }) {
    const graphData = useProvideGraphData();
    return <graphContext.Provider value={graphData}>{children}</graphContext.Provider>;
}

export const graphData = () => {
    return useContext(graphContext);
};

const colors = [
    "rgb(243, 166, 131)",
    "rgb(247, 215, 148)",
    "rgb(119, 139, 235)",
    "rgb(231, 127, 103)",
    "rgb(207, 106, 135)",
    "rgb(75, 101, 132)"
];

function useProvideGraphData() {

    const [modules, setModules] = useState([]);
    const [preq, setPreq] = useState([]);

    const getData = () => async e => {
        e.preventDefault();
        try {
            let { data, error, status, count } = await supabase
                .from("testing")
                .select("*", { count: "exact" });
            if (data) {
                console.log(data);
                let temp = data.slice(0);
                let edges = [];
                let x = 0;
                let mod = [];

                console.log(temp[2].Prequites.length);
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
                    if (temp[node].Prequites !== null) {
                        for (var req = 0; req < temp[node].Prequites.length; req++) {
                            edges[x] = {
                                from: temp[node].module,
                                to: temp[node].Prequites[req]
                            };
                            x++;
                        }
                    }
                }

                console.log(edges);
                setPreq(edges);
                setModules(mod);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const test = (setMessage) => async e => {
        e.preventDefault();
        setMessage("Hellow world")
    }

    return {
        getData,
        test,

        modules,
        preq
    };
}