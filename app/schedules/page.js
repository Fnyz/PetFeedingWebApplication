import React from 'react'

import Image from 'next/image'
import SideBar from '../component/SideBar';
import ScheduleForm from '../component/ScheduleForm';

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
            <div className='absolute left-0 right-0  px-10 pt-5'>
                <div className='flex justify-between'>
                <SideBar />
            </div>
    
            <div className='flex gap-5 w-[100%]  mt-5 mb-5 h-min  p-2'>
           <div className='w-2/5 h-min pl-10 flex justify-end items-center '>
           <ScheduleForm />
            </div>
           <div className=' w-3/5 h-min flex justify-center items-center '>
            <div className='relative h-[650px] w-[1100px]  md:block hidden '>
            <Image
                src="/Image/undraw_add_document_re_mbjx.svg"
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