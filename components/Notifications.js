import React from 'react'
import { AiFillWarning } from "react-icons/ai";

function Notifications() {

    const notif = [
        {
            name:'Snowy',
            date:'3 mins ago', 
            weight: '240kg',
            about:'Snowy is over weight please do something about it.'
          
        },
        {
            name:'Kimmy',
            date:'1 hour ago', 
            weight: '240kg',
            about:'Kimmy is over weight please do something about it.'
          
        },
        {
            name:'Fighter',
            date:'3 mins ago', 
            weight: '40kg',
            about:'Fighter is over weight please do something about it.'
          
        },
        {
            name:'Fighter',
            date:'3 mins ago', 
            weight: '40kg',
            about:'Fighter is over weight please do something about it.'
          
        },
    ]
  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7]'>!Notifications</h1>
            <span className='text-[12px] opacity-[0.6]'>See all</span>
        </di>
        <div>
                <div className='border p-1 rounded-sm overflow-auto no-scrollbar h-[350px]'>
                {notif.map((item, i) => {
                    return (
                        <div key={i} className='w-[100%] border mb-2 h-[100px] border-l-4 border-red-300 rounded-sm shadow-md'>
                            <div className='flex items-center ml-2 gap-1 mt-2'>
                                <AiFillWarning size={15} color='red'/>
                                <h1 className='text-[8px] font-bold'>{item.name} * </h1>
                                <span className='text-[8px]'>{item.date}</span>
                            </div>
                            <div className='ml-[25px] mt-1'>
                                <h1 className='text-[11px] font-bold'>Weight: {item.weight}</h1>
                                <p className='text-[10px] leading-none mt-1'>
                                    {item.about}
                                </p>
                            </div>
                        </div>
                    )
                })}

                </div>
        </div>
    </div>
  )
}

export default Notifications