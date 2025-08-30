import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import '../App.css';

export default function Post() {
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [postObject, setPostObject] = useState({})
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  let navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data)
    })
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data)
    })
  }, [id])

  const addComment = () => {
    axios.post(
      "http://localhost:3001/comments",
      { commentBody: newComment, PostId: id },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      }
    ).then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      } else {
        const commentToAdd = { commentBody: newComment, username: response.data.username }
        setComments([...comments, commentToAdd])
        setNewComment("")
      }
    })
  }

  const deleteComment = (id) => {
    axios.delete(`http://localhost:3001/comments/${id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }).then(() => {
      setComments(comments.filter((val) => {
        return val.id !== id
      }))
    })
  }

  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }).then(() => {
      navigate("/")
    })
  }

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter a New Title")
      axios.put("http://localhost:3001/posts/title", { NewTitle: newTitle, id: id }, {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      })
      setPostObject({ ...postObject, title: newTitle })
    } else {
      let NewPost = prompt("Enter a New Post")
      axios.put("http://localhost:3001/posts/postText", { NewPost: NewPost, id: id }, {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      })
      setPostObject({ ...postObject, postText: NewPost })
    }
  }
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div onClick={() => { if (authState.username === postObject.username) { editPost("title") } }} className="title"> {postObject.title} </div>
          <div onClick={() => { if (authState.username === postObject.username) { editPost("body") } }} className="body">{postObject.postText}</div>
          <div className="footer">{postObject.username} {authState.username === postObject.username && (<button onClick={() => {
            deletePost(postObject.id)
          }}>Delete Post</button>)} </div>
        </div>
      </div>
      <div className="rightSide">
        <div className='addCommentContainer'>
          <input type="text" placeholder='Comment...' value={newComment} onChange={(e) => {
            setNewComment(e.target.value)
          }} autoComplete='off' />
          <button onClick={addComment} >Add Comment</button>
        </div>
        <div className='listOfComments'>
          {comments.map((comment, commentIndex) => {
            return (
              <div key={commentIndex} className='comment' >
                {comment.commentBody}
                <label>Username: {comment.username}</label>
                {authState.username === comment.username && <button onClick={() => { deleteComment(comment.id) }}>X</button>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
