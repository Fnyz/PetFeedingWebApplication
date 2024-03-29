'use client'
import React from 'react'
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from '../firebase';
import { onSnapshot, query, where, collection , orderBy, getDocs, deleteDoc, doc} from 'firebase/firestore';
import { useState,useEffect } from 'react';
import moment from 'moment';
import { BiSolidInfoCircle } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { AiFillEye } from "react-icons/ai";
import { BiX } from "react-icons/bi";
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
     createdAt:docs.data().createdAt,
     id:docs.id
    })
 });
 setNotifications(data);
 
       });
 
     
      
 
      
     });
 
      
     },[notifications])

 



  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md z-50  max-xl:w-full'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7] '>!Notifications</h1>
            <span className='text-[12px] opacity-[0.6] cursor-pointer hover:opacity-100 hover:font-bold' onClick={()=> {
                 router.push('/notifications')
            }}>See all</span>
        </di>
        <div>
                <ScrollArea className='border p-1 rounded-sm w-full no-scrollbar h-[450px]'>
             
                {!notifications.length ? <div className='w-full  h-full flex flex-col justify-center items-center mt-28 '>
                <Image
           width={160}
           height={160}
           className=' opacity-70'
           src="/Image/sadface.gif"
           contentFit="cover"
          
         />
              <label className='text-md font-bold opacity-60'>No notications found.</label>
               
             </div>
                   :  notifications.map((item, i) => {
                    return (
                        <div key={i} className={`w-[100%] border mb-2 h-[100px] border-l-4   rounded-sm shadow-md  p-2 ${item.hasSeen ? "opacity-50 " : "opacity-95 border-red-300"}  `}>
                            <div className='flex items-center justify-between ml-2 gap-1 mt-2'>
                           
                                
                                <div className='flex items-center gap-1'>
                                {item.hasSeen ?   <AiFillEye  size={15} color='gray'/>: <BiSolidInfoCircle size={15} color='green'/>}
                                <h1 className='text-[10px] font-bold'>{item.devicename} * </h1>
                                <span className='text-[8px]'>{moment(item.createdAt.toDate()).calendar()}</span>
                                </div>
                                <BiX size={20} color='red' onClick={async()=>{
                                    deleteDoc(doc(db, "notifications",item.id));
                                }} className=' cursor-pointer opacity-70 transition-all ease-in hover:opacity-100'/>
                               
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