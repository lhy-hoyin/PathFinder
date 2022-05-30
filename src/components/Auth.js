import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const Auth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    //const user = supabase.auth.user()
    const [session, setSession] = useState(null)

    const [username, setUsername] = useState(null);
    //const [avatar_url, setAvatarUrl] = useState(null);
    const [isReady, setIsReady] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            getUserProfile();
        })
    }, []);    

    const getUserProfile = async () => {
        try {
            const user = supabase.auth.user();

            if (user == null)
                return

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, avatar_url, isReady`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username);
                //setAvatarUrl(data.avatar_url);
                setIsReady(data.isReady);
            }
        } catch (error) {
            console.error(error.message);
            
        }
    }

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
        } catch (error) {
            console.error(error.error_description || error.message);
        }
    };

    const send_password_reset = (email, setMessage) => async e => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.api.resetPasswordForEmail(email)
            if (error) throw error;
              alert("Recovery link has been sent to your email");
          } catch (error) {
              setMessage("Email does not exist");
              console.error(error.error_description);
          }
    };

    return {
        signup,
        login,
        logout,
        send_password_reset,

        username,
        //email,
        //avatar_url,
        isReady,
    };
}