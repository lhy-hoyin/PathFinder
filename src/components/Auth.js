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
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    const user = supabase.auth.user()

    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, []);

    /*
    useEffect(() => {
        getProfile()
    }, [session])
    */

    const getProfile = async () => {
        try {
            const user = supabase.auth.user()

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert(error.message)
        }
    }

    const signup = async e => {
        e.preventDefault();

        try {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          alert("Check your email for the login link!");
        } catch (error) {
          alert(error.error_description || error.message);
        }
    };

    const login = async e => {
        e.preventDefault();

        try {
          const { error } = await supabase.auth.signIn({ email, password });
          if (error) throw error;
            console.debug("User logged in");
        } catch (error) {
          alert(error.error_description || error.message);
        }

    };

    const logout = async e => {
        e.preventDefault();

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            console.debug("User logged out");
        } catch (error) {
            console.log(error.error_description || error.message);
        }
    }

    return {
        signup,
        login,
        logout,
        username,
        email,
        avatar_url,
    };
}