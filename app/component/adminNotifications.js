'use client'
import React from 'react'
import { AiFillWarning } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from '../firebase';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { useState,useEffect } from 'react';
import moment from 'moment';
import { BiSolidInfoCircle } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { AiFillEye } from "react-icons/ai";
function AdminNotifications() {

    const router = useRouter();
    const [notifications, setNotifications] = useState([]);

    

    useEffect(()=>{
        const q = query(collection(db, "Notifications"), where("type", "==", "User"));
        onSnapshot(q, (querySnapshot) => {
       const dt = [];
       querySnapshot.forEach((doc) => {
           dt.push({data:doc.data(), id:doc.id});
       });
       dt.sort((a,b) =>b.data.createdAt -  a.data.createdAt);
    
       setNotifications(dt);

       });

     
    },[])



  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md z-50 max-md:w-full max-lg:w-full'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7] '>!Notifications</h1>
            <span className='text-[12px] opacity-[0.6] cursor-pointer hover:opacity-100 hover:font-bold' onClick={()=> {
                 router.push('/notifications')
            }}>See all</span>
        </di>
        <div>
                <ScrollArea className='border p-1 rounded-sm w-full no-scrollbar h-[450px]'>
                { notifications.length &&  notifications.map((item, i) => {
                    return (
                        <div key={i} className={`w-[100%] border mb-2 h-[100px] border-l-4   rounded-sm shadow-md  p-2 ${item.data.hasSeen ? "opacity-50 " : "opacity-95 border-red-300"}  `}>
                            <div className='flex items-center ml-2 gap-1 mt-2'>
                           
                             
                                {item.data.hasSeen ?   <AiFillEye  size={15} color='gray'/>: <BiSolidInfoCircle size={15} color='green'/>}
                                <h1 className='text-[10px] font-bold'>{item.data.User} * </h1>
                                <span className='text-[8px]'>{moment(item.data.createdAt.toDate()).calendar()}</span>
                            </div>
                            <div className='ml-[25px] mt-2'>
                                <p className='text-[12px] leading-none mt-1'>
                                    {item.data.Messages}
                                </p>
                            </div>
                        </div>
                    )
                })}

                </ScrollArea>
        </div>
    </div>
  )
}

export default AdminNotifications