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

export const getModInfo = async (modId) => {
    try {
        let { data, error } = await supabase
            .from("modules")
            .select("*")
            .eq('id', modId)
            .single()

        if (data == null)
            throw error

        return data

    } catch (error) {
        console.error(error.message)
    }
};

export const getUserAcademic = async (userId) => {
    try {
        let { data, error } = await supabase
            .from("academic")
            .select("*")
            .eq('user_id', userId)

        if (data == null)
            throw error

        return data

    } catch (error) {
        console.error(error.message)
    }
};

/* 
export const insertUserAcademicRecord = aysnc () => {
const { data, error } = await supabase
  .from('academic')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
};

export const updateUserAcademicRecord = aysnc (recordId) => {

};
*/

export const deleteUserAcademicRecord = async (recordId) => {
    try {
        const { status, error } = await supabase
            .from('academic')
            .delete()
            .eq('id', recordId)
            .single()

        return { status, error }
    } catch (error) {
        console.error(error.message)
        return { status, error }
    }
};