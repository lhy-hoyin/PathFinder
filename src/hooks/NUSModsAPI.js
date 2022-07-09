const BASE_URL = "https://api.nusmods.com/v2/";

const generateQueryUrl = (moduleCode, acadYear) => {
	if (moduleCode === undefined) {
		console.error("getMdule: no moduleCode to search")
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

export const getModule = async (moduleCode, acadYear) => {
	const queryUrl = generateQueryUrl(moduleCode, acadYear) 
	return fetch(queryUrl)
		.then(res => res.json())
		.then(
			(result) => { return { data: result } },
			(err) => { return { error: err } }
		)
};