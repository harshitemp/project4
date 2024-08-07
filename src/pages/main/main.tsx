import React, { useEffect, useState } from 'react'
import {getDocs,collection, doc} from 'firebase/firestore'
import { db } from '../../config/firebase'
import Post from './Post'
export interface Post{
  id : string
  userId : string 
  title :string
  username : string
  description : string
}
function Main() {
  const postRef = collection(db,"posts")
  const [posts,setPosts] = useState<Post[] | null>(null)

  const getPosts = async()=>{
    const data = await getDocs(postRef)
    setPosts(
      data.docs.map((doc)=>({...doc.data(),id:doc.id})) as Post[]
    )
    
  }
  useEffect(()=>{
    getPosts()
  },[posts])
  return (
    <div>{posts?.map((post)=>(
      <Post post={post}/>
    ))}</div>
  )
}

export default Main