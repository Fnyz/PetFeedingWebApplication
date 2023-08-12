'use client'
import React from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import { BiLogoGoogle } from "react-icons/bi";
import Link from 'next/link';
import { useRouter } from 'next/navigation'





function page() {

    const router = useRouter()
  return (
    <div className="h-screen relative">
  
        <Image
            src="/Image/WebBackground.png"
            layout="fill"
            
            quality={100}
            alt='back image'
        />
  
   <div className='absolute top-0 left-0 '>
        <div className='flex justify-end w-screen px-10 mt-5'>
            <span className='mr-1 text-sm'>New user?</span>
            <Link href="/register" className='text-red-700 font-semibold text-sm'>Sign-up.</Link>
           
        </div>
        <div className='flex  flex-1 items-center px-2 gap-5'>
        <div className=' overflow-hidden border-r-2 ml-5'>
        <Image
            src="/Image/logo.png"
            width={560}
            height={560}
            objectFit="contained"
            alt='this is a logo image'
            
        />
        </div>
        <div className='flex flex-col gap-5 pl-5'>
        <div className='flex flex-1 flex-col gap-5'>
        <div className='flex flex-col'>
        <label className='font-bold text-xl'>Welcome user!</label>
        <label className='text-sm opacity-[0.7]'>Login to continue</label>
        </div>
        <TextField id="outlined-basic" label="Email" variant="outlined" className='w-[500px]'/>
        <TextField id="outlined-basic" label="Password" variant="outlined" className='w-[500px]'/>
        </div>
        <div className='flex gap-2'>
        <button type="button" onClick={() => router.push('/device')} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-2 hover:bg-[coral] ease-in'>LOGIN</button>
        <button type="button" className='text-sm w-full p-2 border rounded text-[#FAB1A0] border-rose-200 font-semibold hover:text-[coral]'>FORGET PASSWORD</button>
        </div> 
        <label className='text-sm opacity-[0.8]'>
           | Login with 
        </label>

        <div className=' hover:shadow-md shadow w-full p-3 border flex justify-center items-center gap-1 rounded cursor-pointer font-semibold opacity-[0.7]'>
            <BiLogoGoogle className='h-5 w-5'/>
            <label className='text-sm'>Sign in with Google</label>
        </div>

        
        
       
        </div>
       
        </div>
       

    </div>
</div>
  )
}

export default page