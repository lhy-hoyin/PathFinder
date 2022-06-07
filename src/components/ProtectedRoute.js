import {Outlet, Navigate} from 'react-router-dom';
import { supabase } from "../supabaseClient";

const user = supabase.auth.user();


export default function protectedRoutes(props) {

	return user?(<Outlet/>): <Navigate to ='/sign-up'/>
}