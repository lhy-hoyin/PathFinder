import { useState, useEffect } from "react";

export default function API() {

    const API_BASE_URL = "https://api.nusmods.com/v2/";

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);

    var url = API_BASE_URL + "2021-2022/modules/CS2030S.json"

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

    return (
        <>
            <h1>API</h1>

            <h3>Search</h3>
            {error ? <div>Error: {error.message}</div> : <></>}
            {isLoaded ? <></> : <div>Loading...</div>}


            <h3>Results</h3>
            {JSON.stringify(data)}
        </>
    )

}