'use client'
import React from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import Link from 'next/link'






function page() {
  return (
    <div className="h-screen   relative">
  
        <Image
            src="/Image/WebBackground.png"
            layout="fill"
            quality={100}
            alt='back image'
        />
  
   <div className='absolute top-0 left-0 border w-screen '>
        <div className='flex justify-end  px-10 mt-5'>
            <span className='mr-1 text-sm'>Have an account? </span>
            <Link href="/login" className='text-red-700 font-semibold text-sm'>Sign-in.</Link>
        </div>
         
         <div className='border flex '>
         <div className='  flex-1 relative h-screen'>
        
      
      <Image
          src="/Image/logo.png"
          fill
          objectFit="contained"
          alt='this is a logo image'
          
      />

    

        </div>
        <div className=' flex-1 '>
            <label>Oten dako </label>

        </div>
    
         </div>
       
       

    </div>
</div>
  )
}

export default page