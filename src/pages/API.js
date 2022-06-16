import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function API() {

    const API_BASE_URL = "https://api.nusmods.com/v2/";

    const [queryUrl, setQueryUrl] = useState(API_BASE_URL.toString());
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [data, setData] = useState([]);

    // Query Parameters
    const [acadYear, setAcadYear] = useState("2021/2022");
    const [moduleCode, setModuleCode] = useState("CS2040S");

    const query = async e => {
        e.preventDefault();

        const url = API_BASE_URL + acadYear.replace("/", "-") + "/modules/" + moduleCode.toUpperCase() + ".json"
        setQueryUrl(url)

        setIsLoaded(false)
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setData(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const updateModuleInfo = async e => {
        e.preventDefault();

        try {
            if (data.length == 0) {
                console.warn("No data to update")
                return
            }

            // Package data properly
            const updates = {
                code: data.moduleCode,
                name:data.title,
                description: data.description,
                acadYear: data.acadYear,
                credit: data.moduleCredit,
                preclusion: data.preclusion,
                preReq: formatPreReq(data.prereqTree),
                updated_at: new Date(),
            }

            // if table has existing entry, add the id to update the correct entry
            const existingRow = await getExistingRow(acadYear, moduleCode)
            if (existingRow) 
                updates.id = existingRow.id

            let { error } = await supabase.from('modules').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error) throw error
            else console.log("Database Updated")

        } catch (error) {
            console.error(error.message);
        }
    }

    function formatPreReq(input) {
        var prereq = []

        if (input == null) {
            // Do nothing else
            // This is here to avoid undefined behaviour when attempting
            // to read data.prereqTree.or or data.prereqTree.and
        }
        else if (input.or) {
            // Only have OR pre-req
            prereq[0] = input.or.toString()
        }
        else if (data.prereqTree.and) {
            // Only AND pre-req, which may include OR pre-req
            const d = input.and
            for (var i = 0; i < d.length; i++) {
                prereq[i] = (d[i].or) ? d[i].or.toString() : d[i]
            }
        }
        else if (input) {
            prereq[0] = data.prereqTree.toString()
        }

        return prereq
    }

    async function getExistingRow(aYear, mCode) {
        try {
            let { data, error, status } = await supabase
                .from('modules')
                .select("id")
                .eq('acadYear', aYear)
                .eq('code', mCode.toUpperCase())
                .single()

            if (error && status != 406)
                throw error

            return data
        }
        catch (error) {
            console.error(error.message);
            return null
        }
    }

    function replacer(key, value) {
        switch (key) {
            // filter out unwanted info
            case "description":
            case "attributes":
            case "semesterData":
            case "workload":
            case "timetable":
                return undefined;
                break;
            default:
                return value;
        }
    }

    return (
        <>
            <h1>API</h1>

            <h3>Parameters</h3>
            <form onSubmit={query}>
                <input
                    type="text"
                    required
                    placeholder="Acad Year"
                    value={acadYear}
                    onChange={(e) => setAcadYear(e.target.value)}
                />
                <input
                    type="text"
                    required
                    placeholder="Module Code"
                    value={moduleCode}
                    onChange={(e) => setModuleCode(e.target.value)}
                />
                <button>Query</button>
            </form>

            <h3>Searching</h3>
            { queryUrl }
            {error ? <div>Error: {error.message}</div> : <></>}
            {isLoaded ? <></> : <div>Loading...</div>}

            <h3>Results</h3>
            <form onSubmit={updateModuleInfo}>
                <p>acadYear: {data.acadYear}</p>
                <p>moduleCode: {data.moduleCode}</p>
                <p>title: {data.title}</p>
                <p>description: {data.description}</p>
                <p>moduleCredit: {data.moduleCredit}</p>
                <p>preclusion: {data.preclusion}</p>
                <p>prereqTree: {JSON.stringify(data.prereqTree, replacer)}</p>
                <button>Update Database</button>
            </form>

            <h3>Filtered Return</h3>
            <textarea disabled
                style={{ width: "100%" }}
                value={JSON.stringify(data, replacer, '    ')} />
        </>
    )

}