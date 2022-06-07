import { useState } from "react";

import { Auth } from "../components/Auth";
import Header from "../components/Header";

export default function reset_Password() {

    const {resettingPassword} = Auth();
    const [password, setPassword] = useState("");;
    const [passwordRepeat, setPasswordRepeat] = useState("");

    return (
        <>
            <Header />
            <h1>Reset password</h1>
            <form onSubmit={resettingPassword(password)}>
                <div className="reset_box">
                    <p>Set new password</p>
                    <input
                            id="confirm-password"
                            className="inputField"
                            type="password"
                            placeholder="Re-enter your password again"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    <button> Reset Password </button>
                </div>
            </form>
            
        </>

    );

}