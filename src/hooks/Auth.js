import { useState, useEffect, useContext, createContext } from "react";

import { PROFILE_STATUS } from "../constants/ProfileStatus";
import { supabase } from "../supabaseClient"

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
    const [status, setStatus] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());
        supabase.auth.onAuthStateChange((_event, session) => {setSession();})
    }, []);

    useEffect(() => {
        getProfile();
    }, [session]);

    const setProfileStatus = (s) => {
        switch (s) {
            case PROFILE_STATUS.NEW:
                break;
            case PROFILE_STATUS.NORMAL:
                setIsReady(true);
                break;
            case PROFILE_STATUS.LOCKED:
                setIsLocked(true);
                break;
            default:
                console.error("Invalid Profile Status")
        }
    }

    const getProfile = async () => {
        try {
            const user = supabase.auth.user();

            if (user == null)
                return

            setEmail(user.email);

            let { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && status !== 406)
                throw error

            if (data) {
                setFirstName(data.FirstName);
                setLastName(data.LastName);
                setCohort(data.Cohort);
                setStatus(data.Status);
                setProfileInfoReady(true);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const updateProfile = (fName, lName) => async e => {
        e.preventDefault();

        try {
            const user = supabase.auth.user()

            if (user == null)
                return

            // Pacakage data properly
            const updates = {
                id: user.id,
                FirstName: fName,
                LastName: lName,
                Status: (status == PROFILE_STATUS.NEW ? PROFILE_STATUS.NORMAL : status),
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error)
                throw error
            else
                console.log("Profile Updated successfully")

        } catch (error) {
            console.error(error.message);
        }
    };

    const updateProfileAcad = (cohort) => async e => {
        e.preventDefault();

        try {
            const user = supabase.auth.user()

            if (user == null)
                return

            // Pacakage data properly
            const updates = {
                id: user.id,
                Cohort: cohort,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            })

            if (error)
                throw error
            else
                console.log("Profile Updated successfully")

        } catch (error) {
            console.error(error.message);
        }
    };

    const signup = (email, password1, password2, setMessage) => async e => {
        e.preventDefault();

        // Verify that password is matching
        if (password1 != password2) {
            setMessage("Password does not match");
            console.log("User input mis-matched password");
            return;
        }

        var password = password1;

        if (password.length < 6) {
            setMessage("Password too short (min 6 sharacters)");
            console.log("User password too short");
            return;
        }

        //TODO: hex password here for security
        //note: login also need to hex, when this is implemented

        try {
            setMessage("Signing up ... please be patient...");
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setMessage("Check your email for the login link!");
            console.log("Verification email sent");
        } catch (error) {
            console.error(error.error_description || error.message);
            setMessage(error.error_description || error.message);
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
            console.log("User logged out");
            alert("User logged out");
            
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

    const resettingPassword = (password1, password2, setMessage) => async e => {
        e.preventDefault();

        if (password1 != password2) {
            setMessage("Password does not match");
            console.log("User input mis-matched password");
            return;
        }

        var password = password1

        try {
            const {error } = await supabase.auth.update({password});
            if (error) throw error;
            alert("password changed ");
        } catch (error) {
            alert(error.error_description);
            console.error(error.error_description);
        }
    };

    return {
        // Account-releated functions
        signup,
        login,
        logout,
        sendPasswordReset,
        resettingPassword ,
        updateProfile,
        
        profileInfoReady, // Status of profile info


        // User-releated info
        status, // status of profile
        email,
        firstName,
        lastName,
    };
}