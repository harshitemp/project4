import React from 'react'
import { Link } from 'react-router-dom'
import Main from '../pages/main/main'
import { auth } from '../config/firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'

function NavBar() {
    const [user] = useAuthState(auth)

    const logOut = async()=>{
        await signOut(auth)
    }
  return (
    <div className='navbar'>
        <div className='links'>
            <Link to="/">Home</Link>
            {!user ? <Link to="/login">Login</Link> :
            <Link to="/create-post">Create Post</Link>}
        </div>
        <div className='user'>
           {user && 
           <>
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""}  width="20" height="20"/>
            <button onClick={logOut}>Log Out</button>
           </>}
        </div>
    </div>
  )
}

export default NavBar