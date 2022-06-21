import { useState, useContext, createContext } from "react";
import Color from "color";

import { supabase } from "../supabaseClient";
import { ModuleStateColor } from "../constants"

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

    const colouring = (selectedColor) => {
        const color ={
           border: Color(selectedColor).darken(0.2).hex(),
           background : selectedColor,
           highlight: {
             border: Color(selectedColor).darken(0.3).hex(),
             background: Color(selectedColor).darken(0.2).hex()
            },
            hover: {
                border: Color(selectedColor).darken(0.3).hex(),
                background: Color(selectedColor).darken(0.2).hex()
            }
        }
         
         return color;
    }

    const orNodesLabel = (orArray) => {
        let label = orArray[0].toString();
        for (var x = 1; x < orArray.length; x++) {
          label = label + " or " + orArray[x]
        }
        return label
    }

    const nodeExist = (checkMod, arr) => {
        for (var x = 0; x < checkMod.length; x++) {
          if ( arr.includes(checkMod[x]) ) {
            //do nothing check next mod
          } else {
            return false
          }
        }
        return true;
    };

    const getData = (modsArr) => async e => {
        e.preventDefault();
        try {
            let { data, error } = await supabase
                .from("modules")
                .select("*")
                .filter('code', 'in', `(${modsArr})`)

            if (data == null)
                throw ("no data from database")

            let temp = data.slice(0);
            const count = temp.length

            let mod = [];
            let orNodes = [];
            let orCount = 0;

            let edges = [];
            let edgeCount = 0;

            for (var node = 0; node < count; node++) {

                mod[node] = {
                    id: temp[node].code,
                    label: temp[node].code,
                    color: colouring(ModuleStateColor.Completed),
                    info: [temp[node].name, temp[node].acad_year, temp[node].credit, temp[node].description]
                };

                if (temp[node].pre_req) {

                    for (var req = 0; req < temp[node].pre_req.length; req++) {

                        const modWithOr = temp[node].pre_req[req].toString().split(',');

                        if(modWithOr.length > 1 && nodeExist(modWithOr, modsArr)) {

                            orNodes[orCount] = {
                                id: "or" +  modWithOr.toString(),
                                label: orNodesLabel(modWithOr),
                                shape: "ellipse",
                                colors: colouring(colors[node])
                            }
                            orCount++;

                            edges[edgeCount] = { from: temp[node].code, to: "or" +  modWithOr.toString() }
                            edgeCount++;

                            for(var orReq = 0; orReq < modWithOr.length; orReq++) {
                                edges[edgeCount] = { from:  "or" +  modWithOr.toString() , to: modWithOr[orReq] }
                                edgeCount++;
                            }

                        } else{
                            edges[edgeCount] = { from: temp[node].code, to: temp[node].pre_req[req] };
                            edgeCount++;
                        }                       
                    }
                }
            }

            mod = mod.concat(orNodes)

            setPreq(edges); // need to set edges first
            setModules(mod);

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