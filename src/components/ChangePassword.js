import { useState } from "react";

import { Auth } from "../hooks/Auth";

export default function ChangePassword() {

    const { resettingPassword } = Auth();

    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [message, setMessage] = useState("");

    return (
        <form onSubmit={resettingPassword(password, passwordRepeat, setMessage)}>
            <div className="reset_box">
                <input
                    id="password"
                    className="inputField"
                    type="password"
                    placeholder="Enter new password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <input
                    id="confirm-password"
                    className="inputField"
                    type="password"
                    placeholder="Re-enter new password again"
                    autoComplete="off"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)} />

                <p>{message}</p>
                <button> Reset Password </button>
            </div>
        </form>
    );

}