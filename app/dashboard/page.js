'use client'
import React from 'react'
import Image from 'next/image'
import { BiMenu, BiDotsVerticalRounded, BiSolidHand, BiBell} from "react-icons/bi";
import { FiBell } from "react-icons/fi";
function page() {
  return (
    <div className="h-screen relative ">
        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
            objectFit='cover'
        />
        <div className='absolute left-0 right-0  px-5'>
            <div className='flex justify-between'>
            <BiMenu className='h-10 w-10 text-[#FAB1A0] cursor-pointer' />
            <div className='flex items-center gap-2 mt-2'>
     
     <div className='w-[60px] h-[60px] p-[2px] rounded-full border-[#FAB1A0] border-2 justify-center items-center'>
     <div className="w-[52px] h-[52px] rounded-full overflow-hidden relative">
        <Image
           src="/Image/luffy.png"
          layout='fill'
        />
      </div>
     </div>
        <div>
                <span className='text-[11px] opacity-[0.8]'>Welcome user</span>
                <div className='flex items-center gap-1'>
                    <span className='font-bold'>KIRITIAN</span>
                    <BiSolidHand className='text-[#FAB1A0]'/>
                    </div>
                </div>
                <BiDotsVerticalRounded size={20}/>
        </div>
            </div>
           
        <div className='flex gap-5 w-[100%] mt-5  h-[500px]'>
            <div className='w-1/5   flex justify-center items-center relative'>
            <Image
            src="/Image/undraw_welcoming_re_x0qo.svg"
            layout='fill'
            quality={100}
            alt='back image'
        />
                
            </div>
            <div className='w-4/5  flex '>
                <div className='flex flex-row gap-2 '>
                    <div className=' w-[150px] border h-20 rounded-md'>
                        <h1 className='pl-2 text-[10px] pt-1'>Notifications</h1>
                        <div className='flex'>
                            <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> 100</span>
                            
                            <div className=' flex-1 relative h-[50px] opacity-[0.7]'>
                            <Image
                    src="/Image/icons8-notification.svg"
                    layout='fill'
                    className='fill-black stroke-2'
                    />
                            </div>
                        
                        </div>
                    </div>
                    <div className=' w-[150px] border h-20 rounded-md'>
                    <h1 className='pl-2 text-[10px] pt-1'>Pets</h1>
                        <div className='flex'>
                            <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> 10</span>
                            <div className=' flex-1 relative h-[50px]'>
                            <Image
                    src="/Image/1517090.svg"
                    layout='fill'
                    className='fill-black stroke-2'
                    />
                            </div>
                        </div>
                    </div>
                    <div className=' w-[150px]  h-20 rounded-md relative'>
                    <Image
                    src="/Image/undraw_sign_in_re_o58h.svg"
                    layout='fill'
                    />
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default page