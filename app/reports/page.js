'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SideBar from '../component/SideBar';
import ReportsForm from '../component/ReportsForm';
import Messages from '../component/Messages';


function page() {
  const [isclient, SetIsClient] = useState(false);

  useEffect(()=>{
    SetIsClient(true)
  },[])

  if(!isclient){
    return;
  }
  return (
    <div className="h-screen relative  ">

        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
            objectFit='cover'
        />
        <div className='absolute left-0 right-0 max-md:px-2 px-10  min-h-max '>
            <div className='flex justify-between'>
            <SideBar />
           </div>

        <div className='flex gap-5 w-full   min-h-max  '>
       <div className='w-2/5 min-h-max flex  justify-center items-center max-lg:w-full mt-10 max-md:mt-12'>
       <ReportsForm />
        </div>
       <div className=' w-3/5 min-h-max flex justify-center items-center max-md:hidden   '>
        <div className='relative h-full  w-full mt-36 max-md:mt-12'>
        <Image
            src="/Image/undraw_anonymous_feedback_re_rc5v.svg"
            layout='fill'
            quality={100}
            alt='back image'
        />
        </div>
    
       </div>
        </div>
           
        </div>

        <Messages />


     
    </div>
  )
}

export default page