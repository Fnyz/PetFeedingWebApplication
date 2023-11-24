"use client"
import Lottie from 'react-lottie-player'
import dsdds from "../public/Image/dsdds.json"
export default function Loading() {
    // Or a custom loading skeleton component
    return (
      <div className="w-full h-screen gap-2 bg-white flex  justify-center items-center max-md:flex-col max-md:p-3 ">  
      <Lottie
         loop
         animationData={dsdds}
         play
         style={{ width: 200, height: 200 }}
       />
    
         <span className='font-bold text-[70px] text-[#FAB1A0] max-md:text-[30px] text-center'>!PURRFECT PLATE.</span>
   
       </div>
    )
  }