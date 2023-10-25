'use client'

import React from 'react'
import Image from 'next/image'
import { BiLogOut } from "react-icons/bi";
import { BiSolidSend } from "react-icons/bi";
import { TextField } from '@mui/material'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function page() {

    const wifiAvailable =[
        {ip: '192.186.255.10'},
        {ip: '192.186.255.06'},
        {ip: '192.186.255.05'},
        {ip: '192.186.255.02'},
        {ip: '192.186.255.11'},
    ]
    const params = useParams()
    console.log(params.data)

    
    
  return (
    <div  className="h-screen relative">

        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
        />

        <div className='gap-7 justify-center items-center flex absolute top-0 left-0 w-[100%]  p-5 h-[100%] '>
            <div className='flex flex-1  justify-center items-center h-screen'>
              
        <Image
            src="/Image/undraw_two_factor_authentication_namy.svg"
            width={600}
            height={600}
            quality={100}
            alt='back image'
        />
            </div>
            <div className='flex flex-1 h-screen relative  items-center'>
                <Link href='/login' className='absolute right-5 top-5'> 
                <BiLogOut  size={30}/>
                </Link>
                
                <div className='w-[90%]'>
                   <h1 className='font-bold text-lg'>Connect Via Wifi</h1>
                   <span className='text-sm opacity-[0.8]'>Please choose to connect device</span>
                   <div className='border w-[100%] mb-7 rounded-md shadow-sm mt-2 overflow-auto h-40 no-scrollbar'>
                    {wifiAvailable.map((connect, i) => {
                        return (
                            <div className='flex justify-between px-2 p-1' key={i}>
                            <div className=' flex items-center gap-5 '>
                                <div className='w-10 h-10 justify-center items-center flex rounded-full text-white font-bold bg-[#FAB1A0]'>
                                    IP
                                </div>
                                <h1>{connect.ip}</h1>
                                
                            </div>
                            <div className='flex opacity-[0.8] hover:opacity-[1] items-center justify-center gap-2 p-1 w-[112px] rounded-lg text-sm text-white bg-[#6750A4]'>
                            <BiSolidSend />
                            <span className='text-[11px] font-bold'>CONNECT</span>
                        </div>
                        </div>
                        )
                    })}
                   </div>
                   <h1 className='font-bold text-lg'>Connect Via Device</h1>
                   <span className='text-sm opacity-[0.8]'>Please input fields to connect</span>
                   <div className='gap-2 flex flex-col'>
                   <TextField id="outlined-basic" label="Email" variant="outlined" className=' mt-2'/>
                   <TextField id="outlined-basic" label="Password" variant="outlined" />
                   <button type="button" onClick={() => router.push('/dashboard')}  className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-3 hover:bg-[coral] ease-in'>CONNECT</button>
                   </div>
                </div>
                
            </div>
        </div>
  

    </div>
  )
}

export default page