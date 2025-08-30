import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';



export default function Home() {
    const { authState } = useContext(AuthContext);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setlikedPosts] = useState([])
    let navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios.get("http://localhost:3001/posts", {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setlikedPosts(response.data.likedPosts.map((like) => {
                    return like.PostId
                }));
            })
        }
    },[])
    const LikerPost = (postId) => {
        axios.post("http://localhost:3001/likes", { PostId: postId }, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return { ...post, Likes: [...post.Likes, 0] }
                    }
                    else {
                        const likeArray = post.Likes
                        likeArray.pop()
                        return { ...post, Likes: likeArray }
                    }

                } else {
                    return post
                }
            }))
            if (likedPosts.includes(postId)) {
                setlikedPosts(likedPosts.filter((id) => {
                    return id != postId
                }))
            } else {
                setlikedPosts([...likedPosts, postId])
            }
        })
    }

    return (
        <div>
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
                                    <Link to={`/profile/${value.UserId}`}>
                                    {value.username}
                                    </Link>
                                </div>

                                <div className='buttons'>
                                    <ThumbUpIcon onClick={
                                        () => LikerPost(value.id)
                                    } className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}
                                    />


                                    <label> {value.Likes.length}</label>
                                </div>

                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}
