const BASE_URL = "https://api.nusmods.com/v2/";

export const moduleExist = async (moduleCode, acadYear) => {
	return getModule(moduleCode, acadYear)
		.then(res => { return (res.data ? true : false) })
};

export const getModule = async (moduleCode, acadYear) => {

	if (acadYear === undefined) {
		const currentYear = new Date().getFullYear()
		acadYear = currentYear.toString() + "/" + (currentYear + 1).toString()
	}

	const queryUrl
		= BASE_URL
		+ acadYear.replace("/", "-").toUpperCase().replace("AY", "")
		+ "/modules/"
		+ moduleCode.toUpperCase()
		+ ".json"

	return fetch(queryUrl)
		.catch(err => { const mute = err })
		.then(res => res.json())
		.then(
			(result) => { return {data: result} },
			(err) => { return { error: err } }
		)
		
};