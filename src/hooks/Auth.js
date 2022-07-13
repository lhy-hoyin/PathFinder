import { useState, useEffect, useContext, createContext } from "react";

import { ProfileRoles } from "../constants";
import { supabase } from "../helpers/SupabaseClient";

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const Auth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [session, setSession] = useState(null);
    const [profileInfoReady, setProfileInfoReady] = useState(false);

    // User profile info (linked to database)
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [cohort, setCohort] = useState(null);
    const [course, setCourse] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());
        supabase.auth.onAuthStateChange((_event, session) => {setSession();})
    }, []);

    useEffect(() => {
        if (session)
            getProfile();
    }, [session]);

    const getProfile = async () => {
        try {
            const user = supabase.auth.user();

            if (user == null)
                return

            setEmail(user.email);

            let { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (status == 406) {
                setRole(ProfileRoles.New)
                setProfileInfoReady(true);
            }
            else if (error && status !== 406) {
                throw error
            }
            else if (data) {
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setCohort(data.cohort);
                setCourse(data.course);
                setRole(data.role);
                setProfileInfoReady(true);
                console.log("Profile info retrieved");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const updateProfileBasic = async (fName, lName) => {
        try {
            const user = supabase.auth.user()

            if (user == null)
                return {
                    status: 'error',
                    title: "Oops!",
                    description: "You are not logged in"
                };

            // Pacakage data properly
            const updates = {
                user_id: user.id,
                first_name: fName,
                last_name: lName,
                role: (role == ProfileRoles.New ? ProfileRoles.Normal : role),
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error) throw error
            else {
                // update local values
                setFirstName(updates.first_name);
                setLastName(updates.first_name);
                setRole(updates.role);

                console.log("Profile Updated successfully")
                return {
                    status: 'success',
                    title: "Update Successful",
                    description: "Your information has been updated in our system"
                };
            }

        } catch (error) {
            console.error(error.error_description || error.message);
            return {
                status: 'error',
                title: "Oops!",
                description: error.error_description || error.message
            };
        }
    };

    const updateProfileAcad = async (userCohort, userCourse) => {
        try {
            const user = supabase.auth.user()

            if (user == null)
                return {
                    status: 'error',
                    title: "Oops!",
                    description: "You are not logged in"
                };

            // Pacakage data properly
            const updates = {
                user_id: user.id,
                cohort: userCohort,
                course: userCourse,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error)
                throw error
            else {
                console.log("Profile Updated successfully");
                return {
                    status: 'success',
                    title: "Update Successful",
                    description: "Your information has been updated in our system"
                };
            }

        } catch (error) {
            console.error(error.error_description || error.message);
            return {
                status: 'error',
                title: "Oops!",
                description: error.error_description || error.message
            };
        }
    };

    const signup = async (email, password) => {

        //TODO: hex password here for security
        //note: login also need to hex, when this is implemented

        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            console.log("Verification email sent");
            return {
                status: 'success',
                title: "Account created!",
                description: "Check your email for the verification email!"
            };
            
        } catch (error) {
            console.error(error.error_description || error.message);
            return {
                status: 'error',
                title: "Oops!",
                description: error.error_description || error.message
            };
        }
    };

    const login = (email, password) => async e => {
        e.preventDefault();

        //TODO: hex password here for security
        //note: singup also need to hex, when this is implemented

        try {
            const { error } = await supabase.auth.signIn({ email, password });
            if (error) throw error;

            console.log("User logged in");
            getProfile();
        } catch (error) {
            alert(error.error_description || error.message);
            console.error(error.error_description || error.message);
        }
    };

    const logout = async e => {
        e.preventDefault();

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            resetLocalState()
            console.log("User logged out");
            
            window.location = window.location.origin.toString();
        } catch (error) {
            console.error(error.error_description || error.message);
        }
    };  

    const sendPasswordReset = (email, setMessage) => async e => {
        e.preventDefault();

        try {
            setMessage("Sending recovery link....please wait")

            const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
            if (error) throw error;

            alert("Recovery link has been sent to your email");
            setMessage("Link has been sent!");
        } catch (error) {
            setMessage("Email does not exist");
            console.error(error.error_description);
        }
    };

    const resettingPassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.update({ password: newPassword });
            if (error) throw error;
            console.log("User password updated");
            return {
                status: 'success',
                title: "Success: Password Updated",
                description: "You can now use your new password"
            };
        } catch (error) {
            console.error(error.error_description || error.message);
            return {
                status: 'error',
                title: "Oops!",
                description: error.error_description || error.message
            };
        }
    };

    function resetLocalState() {
        setProfileInfoReady(false)

        setEmail(null)
        setFirstName(null)
        setLastName(null)
        setCohort(null)
        setRole(null)
    }

    return {
        // Account-releated functions
        signup,
        login,
        logout,
        sendPasswordReset,
        resettingPassword,
        updateProfileBasic,
        updateProfileAcad,

        // Status of profile info
        profileInfoReady,

        // User-releated info
        email,
        firstName,
        lastName,
        cohort,
        course,
        role, 
    };
}