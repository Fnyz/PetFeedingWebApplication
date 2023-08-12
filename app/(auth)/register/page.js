'use client'
import React from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import Link from 'next/link'






function page() {
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
            <span className='mr-1 text-sm'>Have an account? </span>
            <Link href="/login" className='text-red-700 font-semibold text-sm'>Sign-in.</Link>
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
        <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-col'>
        <label className='font-bold text-xl'>Sign up!</label>
        <label className='text-sm opacity-[0.7]'>Fill out this form</label>
        </div>
        <TextField id="outlined-basic" label="Firstname" variant="outlined" className='w-[500px]'/>
        <TextField id="outlined-basic" label="Lastname" variant="outlined" className='w-[500px]'/>
        <TextField id="outlined-basic" label="Username" variant="outlined" className='w-[500px]'/>
        <TextField id="outlined-basic" label="Email" variant="outlined" className='w-[500px]'/>
        <TextField id="outlined-basic" label="Password" variant="outlined" className='w-[500px]'/>
        </div>
        <div className='flex gap-2'>
        <button type="button" className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 hover:bg-[coral] ease-in'>CREATE ACCOUNT</button>
        </div> 

        </div>
       
        </div>
       

    </div>
</div>
  )
}

export default page