import React from 'react'
import {auth,provider} from '../config/firebase'
import {signInWithPopup} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const googleSignIn = async()=>{
        const result = await signInWithPopup(auth,provider)
        navigate('/')
        
    }
  return (
    <div>
        <p>Sign in to Google to continue</p>
        <button onClick={googleSignIn}>Sign in with Google</button>
    </div>
  )
}

export default Login