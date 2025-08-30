import React from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { use } from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';

export default function Profile() {
    const { id } = useParams()
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    const navigate = useNavigate()
    const { authState } = useContext(AuthContext);
    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
            if (response.data && response.data.username) {
                setUsername(response.data.username)
            } else {
                setUsername("Usuário não encontrado")
            }
        })
        axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
            setListOfPosts(response.data)
        })
    }, [id])
    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h1>Username: {username}</h1>
                { authState.username === username && (<button onClick={() => {
                    navigate("/change-password")
                }}>Change my password</button>)}
            </div>
            <div className='listOfPosts'>
                {
                    listOfPosts.map((value, index) => {
                        return (
                            <div className='post' key={index}>
                                <div className='title' >
                                    {value.title}
                                </div>

                                <div className='body' onClick={() => {
                                    navigate(`/post/${value.id}`)
                                }}>
                                    {value.postText}
                                </div>

                                <div className='footer'>
                                    <div className='username'>
                                        {value.username}
                                    </div>

                                    <div className='buttons'>
                                        <label> {value.Likes.length}</label>
                                    </div>

                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
