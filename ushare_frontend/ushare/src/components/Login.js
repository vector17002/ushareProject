import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logo.png';
import jwtDecode from 'jwt-decode';
import {client } from '../client';

export const Login = () => {
  const navigate = useNavigate();
   function handleCallbackResponse(response){
    var userObject = jwtDecode(response.credential);
    localStorage.setItem('user' , JSON.stringify(userObject));
    const doc= {
      _id: userObject.sub,
      _type :'user',
      userName : userObject.name,
      image : userObject.picture
     } 
     client.createIfNotExists(doc).
     then(()=>{
      navigate('/' , {replace :true})   
     })
   }
   useEffect(()=>{
    /*global google*/       
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_ID,
            callback : handleCallbackResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("signIn"),
            {size:"medium"}
        )
    },[]);

  return (
    <div className='flex justify-start items-center flex-col h-screen' >
    <div className='relative w-full h-full'>
       <video 
        src={shareVideo}
        type='video/mp4'
        Loop
        controls={false}
        muted
        autoPlay
        className='w-full h-full object-cover'
       />
       <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
       <div className='p-5'>
         <img src={logo} width="150px" style={{borderRadius : '20px' , boxShadow : '2px 2px 10px lightcyan' }} alt="logo"/>
       </div>
       <div id='signIn'>
       </div>
       </div>
    </div>
    </div>
  )
}
