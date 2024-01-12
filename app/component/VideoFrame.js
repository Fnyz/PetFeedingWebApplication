'use client'

import React from 'react'
import ReactPlayer from 'react-player/youtube'
import AudioRecorders from './AudioRecorder'
import { db } from '../firebase'
import { collection, addDoc,updateDoc, doc} from 'firebase/firestore';
import { BiStop } from "react-icons/bi";
import Lottie from 'react-lottie-player'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import videoloading from "../../public/Image/videoloading.json"

import Image from 'next/image'
import { useState } from 'react'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:2,
  display:'flex',
  p: 4,
};


function VideoFrame({youtubeUrl, handleVideoEnd, liveiD, deviceName}) {

  const [show, setshow] = useState(false);

  const handleStopLiveStream = () => {
    
    const docRef = doc(db, 'Livestream', liveiD);
    updateDoc(docRef, {
      Youtube_Url:'',
      isliveNow:false,
      ended:true,
   }).then( async()=>{
    await addDoc(collection(db, "Task"),{
      type:'Livestream',  
      deviceName:deviceName,
      document_id: liveiD,
      request:'Stop',
    });
    window.location.reload();
   });
  }
  return (
    <div className=' max-md:px-1 px-7 grid gap-5  h-full max-md:ml-[10px] '>
      {!youtubeUrl ? (
        <div className=' border justify-center items-center flex rounded-md '>
        
  
          <Lottie
          loop
          animationData={videoloading}
          play
       
          className='w-[750px] h-[750px] max-md:h-[600px] max-md:w-[300px]'
        />
        </div>

      ): (
      <div>
 <div className=' h-[700px] max-xl:h-[600px]'>
<ReactPlayer url={youtubeUrl}    width={'100%'} height={'100%'} playing={true} 
onEnded={handleVideoEnd} // Event handler for video end
config={{
          youtube: {
            playerVars: {
             
              showinfo: 0, // Hide video title
              autoplay: 1, // Enable autoplay for YouTube
            },
          },
        }} />
 </div>

 <div className='border mt-5 w-[200px]  py-2 text-center border-[#FAB1A0] cursor-pointer opacity-60 hover:opacity-100 transition-all ease-in rounded-sm flex justify-center items-center gap-1' onClick={()=> setshow(true)}>
     <BiStop size={25} color='#FAB1A0'/>
                  <span className='text-[#FAB1A0] font-bold'>STOP LIVE STREAM</span>
                 </div>
    </div>

      )}

<AudioRecorders isAddPet={false}/>

<Modal
        open={show}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style} >
        <Image
        width={160}
        height={160}
        src="/Image/SadDog.png"
        contentFit="cover"
       
      />
          <div className='grid gap-1 justify-center '>
         
          <label  className='font-bold opacity-60 text-sm text-justify' >
          Are you sure you want to stop the livestream? This will end the livestream.
          </label>
          <div className='grid gap-2'>
          <div className={`w-full  p-1 flex gap-2 opacity-60  justify-center items-center rounded-md bg-[#FAB1A0]  cursor-pointer hover:opacity-100 hover:bg-[coral] ease-in transition-all  `} onClick={handleStopLiveStream}>
         
           <span className='text-white font-bold'>{'YES, PLEASE'}</span>
          </div>

          
          <div className='w-full  p-1 flex gap-2 justify-center items-center border-[coral] rounded-md  border text-[coral]  transition-all ease-in cursor-pointer hover:shadow-sm'onClick={()=> setshow(false)}>
        
           <span className='font-bold  '>CANCEL</span>
          </div>
          </div>
        
          </div>
          
        </Box>
      </Modal>
      </div>


   
    
  )
}

export default VideoFrame