"use client"
import React from 'react'
import Lottie from 'react-lottie-player'
import Cw1Fr7IQkM from "../../public/Image/Cw1Fr7IQkM.json"

function loading() {
  return (
    <div className="w-full h-screen gap-2 bg-[#FAB1A0] flex  justify-center items-center max-xl:flex-col max-md:p-3 ">  
    <Lottie
       loop
       animationData={Cw1Fr7IQkM}
       play
       style={{ width: 300, height: 300 }}
     />
  
       <span className='font-bold text-[70px] text-white max-md:text-[30px] text-center'>!PURRFECT PLATE.</span>
 
     </div>
  )
}

export default loading