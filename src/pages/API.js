import { useState, useEffect } from "react";

export default function API() {

    const API_BASE_URL = "https://api.nusmods.com/v2/";

    const [queryUrl, setQueryUrl] = useState(API_BASE_URL.toString());
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [data, setData] = useState([]);

    const [acadYear, setAcadYear] = useState("2021/2022");
    const [moduleCode, setModuleCode] = useState("CS2040S");

    const query = async e => {
        e.preventDefault();

        const aYr = acadYear.replace("/", "-")
        const url = API_BASE_URL + aYr + "/modules/" + moduleCode + ".json"
        setQueryUrl(url)

        setIsLoaded(false)
        fetch(url)
            .then(res => res.json())
            .then(res => { console.log(res); return res })
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
            <textarea
                disabled
                style={{ width: "100%" }}
                value={JSON.stringify(data, replacer, '    ')} />
        </>
    )

}