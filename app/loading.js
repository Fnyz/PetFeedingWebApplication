"use client"
import Lottie from 'react-lottie-player'
import dsdds from "../public/Image/dsdds.json"
export default function Loading() {
    // Or a custom loading skeleton component
    return (
      <div className="w-full h-screen gap-2 bg-white justify-center flex items-center ">  
      <Lottie
         loop
         animationData={dsdds}
         play
         style={{ width: 200, height: 200 }}
       />
       <div className='flex flex-col'>
         <span className='font-bold text-[70px] text-[#FAB1A0]'>!PURRFECT PLATE.</span>
       </div>
       </div>
    )
  }