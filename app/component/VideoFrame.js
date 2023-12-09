'use client'

import React from 'react'
import ReactPlayer from 'react-player/youtube'
import AudioRecorders from './AudioRecorder'
import { db } from '../firebase'
import { collection, addDoc,updateDoc, doc} from 'firebase/firestore';

function VideoFrame({youtubeUrl, handleVideoEnd, liveiD, deviceName}) {

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
   });
  }
  return (
    <div className=' max-md:px-1 px-7 grid gap-5  h-full '>
 <div className=' h-[700px]'>
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

 <div className='border m-2 w-[200px]  py-2 text-center border-[#FAB1A0]' onClick={handleStopLiveStream}>
                  <label className='text-[#FAB1A0] font-bold'>STOP LIVE STREAM</label>
                 </div>
     <AudioRecorders isAddPet={false}/>
    </div>


   
    
  )
}

export default VideoFrame