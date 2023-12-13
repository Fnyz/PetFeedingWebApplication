'use client'
import React from 'react'
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from '../firebase';
import { onSnapshot, query, where, collection , orderBy, getDocs} from 'firebase/firestore';
import { useState,useEffect } from 'react';
import moment from 'moment';
import { BiSolidInfoCircle } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { AiFillEye } from "react-icons/ai";
function AdminNotifications() {

    const router = useRouter();
    const [notifications, setNotifications] = useState([]);

    

    useEffect(()=>{
   
        const q = query(collection(db, "notifications"), where("type", "==", "Admin"), orderBy("createdAt", "desc"));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach(async(docs) => {
       
         const q = query(collection(db, "users"), where("Devicename", "==", docs.data().deviceName));
 
 const querySnapshot = await getDocs(q);
 querySnapshot.forEach((doc1) => {
   // doc.data() is never undefined for query doc snapshots
    data.push({
     hasSeen:docs.data().hasSeen,
     devicename: docs.data().deviceName,
     image:doc1.data().image,
     Messages:docs.data().Messages,
     createdAt:docs.data().createdAt
    })
 });
 setNotifications(data);
 
       });
 
     
      
 
      
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
                {!notifications.length && (<div className='w-full  h-full flex flex-col justify-center items-center mt-28 '>
             <Image
        width={160}
        height={160}
        src="/Image/SadDog.png"
        contentFit="cover"
       
      />
           <label className='text-md font-bold opacity-60'>No notications found.</label>
            
          </div>
                )}
                {notifications.length &&  notifications.map((item, i) => {
                    return (
                        <div key={i} className={`w-[100%] border mb-2 h-[100px] border-l-4   rounded-sm shadow-md  p-2 ${item.hasSeen ? "opacity-50 " : "opacity-95 border-red-300"}  `}>
                            <div className='flex items-center ml-2 gap-1 mt-2'>
                           
                             
                                {item.hasSeen ?   <AiFillEye  size={15} color='gray'/>: <BiSolidInfoCircle size={15} color='green'/>}
                                <h1 className='text-[10px] font-bold'>{item.devicename} * </h1>
                                <span className='text-[8px]'>{moment(item.createdAt.toDate()).calendar()}</span>
                            </div>
                            <div className='ml-[25px] mt-2'>
                                <p className='text-[12px] leading-none mt-1'>
                                    {item.Messages}
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