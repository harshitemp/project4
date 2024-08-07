import React, { useEffect, useState } from 'react'
import {Post as IPost} from './main'
import { addDoc, collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
interface Props {
    post : IPost
}
interface Like{
    llikeId : string ,
    userId : string
}

function Post(props : Props) {

    const [likes,setLikes] = useState<Like[] | null>(null)
    const {post} = props
    const [user] = useAuthState(auth)

    const likesRef = collection(db,"likes")
    const likesDoc = query(likesRef,where("postId","==",post.id))
    const getLikes = async()=>{
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc)=>({userId : doc.data().userId, llikeId : doc.id})))
        
    }
    const addLike = async(data : any) => {
      try {
        const newDoc = await addDoc(likesRef,{userId:user?.uid , postId : post.id})
      if(user){
          setLikes((prev)=>
          prev ? [...prev,{userId : user.uid, llikeId : newDoc.id}] : [{userId : user.uid,llikeId : newDoc.id}])
      }
      } catch (error) {
        console.log(error);
        
      }
    };
    const dislike = async()=>{
        try {
            const likeToDelete = query(
                likesRef,
                where("postId","==",post.id),
                where("userId","==",user?.uid)
                )

            const queried = await getDocs(likeToDelete)
            const likeId = queried.docs[0].id
            const toDelete = doc(db,"likes",queried.docs[0].id)
            await deleteDoc(toDelete)
            if(user){
                setLikes((prev)=>
                    prev && prev.filter((like)=> like.llikeId !== likeId)
                )
            }
        } catch (error) {
            
        }
    }
    const didUserLiked = likes?.find((like)=>like.userId == user?.uid)
    useEffect(()=>{
        getLikes()
    },[likes])

  return (
    <div>
        <div className='title'>
            <h1>{post.title}</h1>
        </div>
        <div className='body'>
            <p>{post.description}</p>
        </div>
        <div className='footer'>
            <p>@{post.username}</p>
            <button onClick={didUserLiked ? dislike : addLike}>{didUserLiked ? <>👎</>:<>👍</>}</button>
            { <p>Likes : {likes ? likes.length : 0}</p>}
        </div>
    </div>
  )
}

export default Post