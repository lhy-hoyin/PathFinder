import { supabase } from "../supabaseClient";
import { pullModule, formatPreReq } from "../hooks/NUSModsAPI";

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

export const getModuleId = async (modCode, year) => {
    try {
        let { data, status, error } = await supabase
            .from("modules")
            .select("id")
            .eq('acad_year', year)
            .eq('code', modCode.toUpperCase())
            .single()

        if (error && status == 406) {
            /*
             * Error 406: multiple (or no) rows returned
             * No row fround is expected, do nothing here is suppress it
             */
        } else if (data == null)
            throw error

        return data

    } catch (error) {
        console.error(error.message)
        return null
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

export const upsertModule = async (moduleCode, acadYear) => {

    try {
        const modData = (await pullModule(moduleCode, acadYear)).data

        // Package data properly
        const updates = {
            code: modData.moduleCode,
            name: modData.title,
            description: modData.description,
            acad_year: modData.acadYear,
            credit: modData.moduleCredit,
            preclusion: modData.preclusion,
            pre_req: formatPreReq(modData.prereqTree),
            updated_at: new Date(),
        }

        // if table has existing entry, add the id to update the correct entry
        const existingRowId = await getModuleId(moduleCode, acadYear)
        if (existingRowId)
            updates.id = existingRowId.id

        let { data, error } = await supabase.from('modules').upsert(updates)

        if (error)
            throw error

        console.log("Database Updated:", moduleCode, acadYear)
        return data[0].id

    } catch (error) {
        console.error(error.message);
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

export const insertUserAcademicRecord = async (userId, newModId) => {
    try {
        const { error } = await supabase
        .from('academic')
        .insert([{
            user_id: userId,
            module: newModId,
            //TODO: status ...etc 
        }])

        if (error)
            throw error
        else
            return { status: 'success' }
        
    } catch (error) {
        console.error(error.error_description || error.message);
        return {
            status: 'error',
            title: "Oops!",
            description: error.error_description || error.message
        };
    }
};

/*
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