'use client'

import React from 'react'
import ReactPlayer from 'react-player'
import AudioRecorders from './AudioRecorder'



function VideoFrame({youtubeUrl}) {
  return (
    <div className=' max-md:px-1 px-7 grid gap-5  h-full'>
 <div className=' h-[700px] '>
<ReactPlayer url={youtubeUrl}  controls width={'100%'} height={'100%'} />
 </div>


     <AudioRecorders />
    </div>


   
    
  )
}

export default VideoFrame