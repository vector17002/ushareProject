import { AiOutlineLogout } from 'react-icons/ai';
import React , {useEffect , useState } from 'react';
import { Link , useNavigate, useParams } from 'react-router-dom';
import { userCreatedPinsQuery , userQuery } from '../utils/data';
import { client } from '../client'
import { MasonryLayout } from './MasonryLayout';
import { Spinner } from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology,coding'

export const Userprofile = () => {
 const [user , setUser] = useState(null);
 const [pins,setPins] = useState(null);
 const [activeBtn , setActiveBtn] = useState('created')
 const navigate = useNavigate()
 const {userId} = useParams()

 useEffect(()=>{
 const query = userQuery(userId)
 client.fetch(query).then((data)=>{
  setUser(data[0])
 })
 },[userId])

 useEffect(()=>{
  const query = userCreatedPinsQuery(userId)

  client.fetch(query).then((data)=>{
    setPins(data);
  })

 },[userId])

 if(!user) return <Spinner  message='Loading profile'/>



 const logout = () =>{
    localStorage.clear()
    navigate(('/login'))
 }
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
    <div className='flex flex-col pb-5'>
      <div className='relative flex flex-col mb-7'>
      <div className='flex flex-col justify-center items-center'>
          <img
          src={randomImage}
          className=' w-4/5 h-370 xl:h-510 shadow-lg object-cover'
            alt='banner-pic'
          />
          <img
            className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
            src={user.image}
            style={{boxShadow : '2px 4px 10px black'}}
          />
          <h1 className='font-bold text-3xl text-center mt-3'>{user.userName}</h1>
          <div className='absolute top-0 z-1 right-0 p-2'>
             <button
             type='button'
             className='bg-mainColor flex justify-center item-center rounded-full outline-none shadow-md'
             onClick={logout}>
              <AiOutlineLogout color='red'/>
             </button>
          </div>
          
      </div>
      {pins?.length ?  ( <div className='px-2'>
             <MasonryLayout pins={pins}/>
          </div>) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2 text-gray'>
            No posts yet.... 🤒
            </div>
          )}
      </div>
    </div>
</div>
  )
}
