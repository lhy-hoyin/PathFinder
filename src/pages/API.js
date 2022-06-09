import { useState, useEffect } from "react";

export default function API() {

    const API_BASE_URL = "https://api.nusmods.com/v2/";

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);

    var url = API_BASE_URL + "2021-2022/modules/CS2106.json"

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(res => { console.log(res); return res } )
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
    }, [])

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

            <h3>Searching</h3>
            { url }
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