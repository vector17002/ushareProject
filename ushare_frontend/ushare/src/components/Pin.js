import React , {useState} from 'react'
import {client, urlFor} from '../client'
import {Link , useNavigate} from 'react-router-dom'
import { v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline } from 'react-icons/md'
import {AiTwotoneDelete } from 'react-icons/ai'
import { fetchUser } from '../utils/fetchuser'
export const Pin = ({pin : { postedBy , image , _id  ,save}}) => {
  const navigate = useNavigate();
  const [postHover , setPostHover] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const user = fetchUser();
  const alreadySaved = !!(save?.filter((item)=> item.postedBy._id === user?.sub))?.length;
  const savePin=(id)=>{
      if(!alreadySaved){
        setSavingPost(true);
        
        client.patch(id).setIfMissing({save:[]}).insert('after','save[-1]',[{
          _key: uuidv4(),
          userId : user?.sub,
          postedBy:{
            _type :'postedBy',
            _ref : user?.sub
          }
        }]).commit().then(()=>{
          window.location.reload();
          setSavingPost(false)
        })
      }
  }

  const deletePin=(id)=>{
    client.delete(id).then(()=>{
      window.location.reload();
    })
  }
  return (
    <div className='m-2 '>
      <div onMouseEnter={()=>setPostHover(true)}
      onMouseLeave={()=>setPostHover(false)}
      onClick={()=> navigate(`/pin-detail/${_id}`)}
      className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'>
     
       <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()}/>
        {postHover && (
          <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
           <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a href={`${image?.asset?.url}?dl=`} 
                download
                onClick={(e)=>e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline/>
                </a>
              </div>
              {alreadySaved ? (
                    <button type='button'
                        className='bg-red-500 text-white opacity-70 hover:opacity-100 font-bold px-5 py-1 rounded-3xl text-base hover:shadow-md outline-none'>
                        {save?.length} Likes
                    </button>
              ) : (
                <button type='button'
                className='bg-red-500 text-white opacity-70 hover:opacity-100 font-bold px-5 py-1 rounded-3xl text-base hover:shadow-md outline-none'
                onClick={(e)=>{
                  e.stopPropagation()
                  savePin(_id)
                }}>
                      Like
                </button>
              )}
           </div>
           <div className='flex justify-between items-center gap-2 w-full '>
            {postedBy?._id === user?.sub && (
               <button
               type='button'
               className='bg-white text-dark opacity-70 hover:opacity-100 font-bold px-3 py-3 rounded-3xl text-base hover:shadow-md outline-none'
               onClick={(e)=>{
                e.stopPropagation();
                deletePin(_id)
               }}>
               <AiTwotoneDelete/>
               </button>
            )}
           </div>
          </div>
        )}
      </div>    
      <Link
      to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
       <img
          className='w-9 h-9 rounded-full obeject-cover'
          src={postedBy?.image}
       />
       <p className='font-semibold capitalize'>{postedBy?.userName}</p>
      </Link>
    </div>
  )
}
