import React from 'react'
import axios from "axios"
import { useState } from 'react'

export default function ChangePassword() {
    const [oldPassword, setoldPassword] = useState("")
    const [newPassword, setnewPassword] = useState("")
    const changepassword = () => {
        axios.put("http://localhost:3001/auth/change-password", { oldPassword: oldPassword, newPassword: newPassword },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")

                }
            }
        ).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            }
        })
    }
    return (
        <div><h1>Change Your Password</h1>
            <input type="password" onChange={(e) => { setoldPassword((e.target.value)) }} placeholder="Old Password" />
            <input type="password" onChange={(e) => { setnewPassword((e.target.value)) }} placeholder="New  Password" />
            <button onClick={changepassword}>Change Password</button>
        </div>
    )
}
