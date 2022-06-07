import { useState } from "react";

import { Auth } from "../components/Auth";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function reset_Password() {
    const nav = useNavigate();
    const {resettingPassword} = Auth();
    const [password, setPassword] = useState("");;
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [message, setMessage] = useState("");

    return (
        <>
            <Header />
            <h1>Reset password</h1>
            <form onSubmit={resettingPassword(password, passwordRepeat, setMessage)}>
                <div className="reset_box">
                    <p>Set new password</p>
                    <input
                            id="password"
                            className="inputField"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                
                    <input
                            id="confirm-password"
                            className="inputField"
                            type="password"
                            placeholder="Re-enter your password again"
                            autoComplete="off"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)} />

                    <p>{message}</p>
                    <button> Reset Password </button>
                </div>
                <button onClick={() => nav('/')}> Back TODO change to profile </button> 
            </form>
            
        </>

    );

}