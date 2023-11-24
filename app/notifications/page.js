'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import NotificationList from '../component/NotificationList';
import SideBarAdmin from '../component/SideBarAdmin';



function page() {

    

    return (
        <div className="h-screen relative">
            <Image
                src="/Image/WebBackground.png"
                layout='fill'
                quality={100}
                alt='back image'
                objectFit='cover'
            />
            <div className='absolute left-0 right-0 max-sm:px-5  px-10 '>
                <div className='flex justify-between'>
                <SideBarAdmin />
            </div>
    
            <div className='flex gap-5 w-full min-h-max p-2'>
           <div className='w-2/5 min-h-max  flex justify-end items-center max-md:w-full'>
           <NotificationList />
            </div>
           <div className=' w-3/5 min-h-max flex justify-center items-center max-md:hidden '>
            <div className='relative h-full w-full  '>
            <Image
                src="/Image/undraw_notify_re_65on.svg"
                layout='fill'
                quality={100}
                alt='back image'
            />
            </div>
        
           </div>
            </div>
               
            </div>
          
    
         
        </div>
      )
}

export default page