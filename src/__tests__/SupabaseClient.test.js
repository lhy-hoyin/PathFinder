test("can get env variables", () => {
	const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
	const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

	expect(supabaseUrl).toBeDefined()
	expect(supabaseAnonKey).toBeDefined()
})