const BASE_URL = "https://api.nusmods.com/v2/";

const generateQueryUrl = (moduleCode, acadYear) => {
    if (moduleCode === undefined) {
        console.error("getModule: no moduleCode to search")
        return undefined
    }

    if (acadYear === undefined) {
        const currentYear = new Date().getFullYear()
        acadYear = currentYear.toString() + "/" + (currentYear + 1).toString()
    }

    return BASE_URL
        + acadYear.replace("/", "-").toUpperCase().replace("AY", "")
        + "/modules/"
        + moduleCode.toUpperCase()
        + ".json"
}

export const moduleExist = async (moduleCode, acadYear) => {
    const queryUrl = generateQueryUrl(moduleCode, acadYear)
    return fetch(queryUrl)
        .then(res => { return res.ok })
};

export const pullModule = async (moduleCode, acadYear) => {
    const queryUrl = generateQueryUrl(moduleCode, acadYear)
    return fetch(queryUrl)
        .then(res => res.json())
        .then(
            (result) => { return { data: result } },
            (err) => { return { error: err } }
        )
};

export const formatPreReq = (input) => {
    var prereq = []

    if (input === undefined || input === null) {
        // Do nothing else
        // This is here to avoid undefined behaviour when attempting
        // to read data.prereqTree.or or data.prereqTree.and
    }
    else if (input.or) {
        // Only have OR pre-req
        prereq[0] = input.or.toString()
    }
    else if (input.and) {
        // Only AND pre-req, which may include OR pre-req
        const d = input.and
        for (var i = 0; i < d.length; i++) {
            prereq[i] = (d[i].or) ? d[i].or.toString() : d[i]
        }
    }
    else if (input) {
        prereq[0] = input.toString()
    }

    return prereq
};