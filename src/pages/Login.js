import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';


export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext)
    const login = () => {
        axios.post("http://localhost:3001/auth/login", { username: username, password: password }).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
            } else {
                localStorage.setItem("accessToken", response.data.token)
                setAuthState({
                    username : response.data.username,
                    id: response.data.id,
                    status: true
                });
                navigate("/")

            }
        })
    }


    return (
        <div className='loginContainer' >
            <input type="text" onChange={(e) => {
                setUsername(e.target.value)
            }} placeholder="Username" />
            <input type="password" onChange={(e) => {
                setPassword(e.target.value)
            }} placeholder="Password" />

            <button onClick={login}>Login</button>
        </div>
    )
}
