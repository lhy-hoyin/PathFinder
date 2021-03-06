import { Outlet, Navigate } from 'react-router-dom';
import { supabase } from "../helpers/SupabaseClient";

export function UserOnlyRoute(props) {
    const user = supabase.auth.user();
    return user ? <Outlet /> : <Navigate to='/sign-up' />
}