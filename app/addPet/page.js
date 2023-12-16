'use client'
import React from 'react'
import Image from 'next/image'
import SideBar from '../component/SideBar';
import AddPetsForm from '../component/AddPetsForm';
import { useState } from 'react';
import { useEffect } from 'react';


function page() {

  const [isclient, setIsclient] = useState(false);

  useEffect(()=>{
    const user = localStorage.getItem("credentials");
    if(!user){
      window.location.href = "/login";
    }
    
    setIsclient(true)
  },[])

  if(!isclient) return;
 
  return (
    <div className=" h-screen relative  ">
        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
            objectFit='cover'
        />
        <div className='absolute left-0 right-0  max-sm:px-5  px-10  py-4'>
            <div className='flex justify-between'>
            <SideBar />
        </div>

        <div className='flex  w-[100%]  h-full  '>
       <div className='w-2/5 max-md:w-full  min-h-max  flex justify-end items-center '>
       <AddPetsForm />
        </div>
       <div className=' w-3/5  min-h-max flex justify-center  items-center max-md:hidden  '>
        <div className='relative h-full w-full  md:block hidden '>
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