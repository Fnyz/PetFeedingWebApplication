
'use client'
import React from 'react'
import Image from 'next/image'
import SideBar from '../component/SideBar';
import ScheduleForm from '../component/ScheduleForm';
import { useSearchParams } from 'next/navigation';



function page() {

    
const searchParams = useSearchParams()

const petnames = searchParams.get('petnames') || null

    return (
        <div className="h-screen relative">
            <Image
                src="/Image/WebBackground.png"
                layout='fill'
                quality={100}
                alt='back image'
                objectFit='cover'
            />
            <div className={`absolute left-0 right-0 max-sm:px-5  px-10 ${petnames && "mt-10"}`}>
                <div className='flex justify-between'>
                {!petnames && <SideBar />}
            </div>
    
            <div className='flex gap-5 w-full min-h-max p-2'>
           <div className='w-2/5 min-h-max  flex justify-end items-center max-md:w-full'>
           <ScheduleForm />
            </div>
           <div className=' w-3/5 min-h-max flex justify-center items-center max-md:hidden '>
            <div className='relative h-full w-full  '>
            <Image
                src="/Image/undraw_time_management_re_tk5w.svg"
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