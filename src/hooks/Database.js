import { supabase } from "../supabaseClient";

export const getCourseNames = async () => {
    try {
        let { data, error } = await supabase
            .from("courses")
            .select("course_name")

        if (data == null)
            throw error

        return data.map(row => row.course_name)

    } catch (error) {
        console.error(error.message)
    }
};