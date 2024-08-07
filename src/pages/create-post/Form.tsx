import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth, db } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

interface FormData {
  title: string;
  description: string;
}

function Form() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)

  const schema = yup.object().shape({
    title: yup.string().required("Required Title field"),
    description: yup.string().required("Required description field")
  });

  const { register, handleSubmit, formState : {errors} } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const postsRef = collection(db,"posts")

  const onPostCreation = async(data : any) => {
    await addDoc(postsRef,{
      ...data,
      username : user?.displayName,
      userId : user?.uid
    })
    navigate("/")
  };

  return (<form onSubmit={handleSubmit(onPostCreation)}>
      <input placeholder='title..' {...register("title")} />
      <p style={{color : "red"}}>{errors.title?.message}</p>
      <textarea placeholder='desc..' {...register("description")} />
      <p style={{color : "red"}}>{errors.description?.message}</p>
      <input type="submit" />
    </form>)
  
}

export default Form;
