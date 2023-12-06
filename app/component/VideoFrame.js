'use client'

import React from 'react'
import ReactPlayer from 'react-player/youtube'
import AudioRecorders from './AudioRecorder'



function VideoFrame({youtubeUrl, handleVideoEnd}) {
  return (
    <div className=' max-md:px-1 px-7 grid gap-5  h-full'>
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


     <AudioRecorders isAddPet={false}/>
    </div>


   
    
  )
}

export default VideoFrame