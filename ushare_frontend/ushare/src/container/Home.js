import React, {useRef , useState , useEffect} from 'react';
import {HiMenu} from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import {Link , Route , Routes} from 'react-router-dom'; 
import { client} from '../client';
import logo from '../assets/tehstonu.png';
import Sidebar from '../components/Sidebar';
import {userQuery} from '../utils/data';
import { Userprofile } from '../components/Userprofile';
import { Pins } from './Pins';
import {fetchUser} from '../utils/fetchuser'
export const Home = () => {
  
  const [ toggleSidebar , setToggleSidebar] = useState(false);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();
  const [user , setUser] = useState(null);
  useEffect(()=>{
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data)=>{
      setUser(data[0]);
    })
 
  },[])

  useEffect(()=>{
    scrollRef.current.scrollTo(0,0)
  },[])
return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
     <div className='hidden md:flex h-screen flex-intitial '>
     <Sidebar user={user && user}/>      
    </div>
    <div className='flex md:hidden flex-row'>
    <div className='w-full pd-2 flex flex-row justify-between items-center shadow-md'>
    <HiMenu size={40}  className="cursor-pointer" onClick={()=>setToggleSidebar(true)}/>
      <Link to="/">
          <h3 style={{fontFamily: `'Kanit', sans-serif`,fontSize : '1.5rem' , color:'white' , borderRadius:'.5rem'}} className='p-1 m-2 bg-gradient-to-r from-purple-500 to-red-500'>Ushare</h3>
      </Link>
      <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="logo" className="w-12 h-12" style={{borderRadius:'50%'}}/>
      </Link>
    </div>
    {toggleSidebar && (
      <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
          <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={()=> setToggleSidebar(false)} />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
      </div>
    )}
    </div>
    <div className='pb-2 flex-l h-screen w-full overflow-y-scroll' ref={scrollRef}>
           <Routes>
            <Route path="/*" element={<Pins user={user && user}/>}/>
            <Route path="/user-profile/:userId/" element={<Userprofile/>}/>
           </Routes>
    </div>
    </div>
  )
}
