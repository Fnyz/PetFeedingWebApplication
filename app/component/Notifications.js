import React from 'react'
import { AiFillWarning } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState , useEffect} from 'react';
import {collection, query, where, onSnapshot , orderBy, getDocs, doc} from "firebase/firestore";
import { db } from '../firebase';
import { BiSolidBell } from "react-icons/bi";
import Image from 'next/image';
import moment from 'moment';
import { MdErrorOutline } from "react-icons/md";
function Notifications() {

    const [notif, setNotifications] = useState([]);

    useEffect(()=> {
   
        const user = localStorage.getItem("credentials");
          const datas = JSON.parse(user);
          if(user){
            const q = query(collection(db, "notifications"), where("deviceName", "==", datas.DeviceName.trim()), where("type", "==", "User"), orderBy("createdAt", "desc"));
            onSnapshot(q, (querySnapshot) => {
           const data = [];
           querySnapshot.forEach(async(docs) => {
         
const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName.trim()), where("Petname", "==", docs.data().Messages.split(" ")[1]));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc1) => {
  // doc.data() is never undefined for query doc snapshots
   data.push({
    name: doc1.data().Petname,
    weight: doc1.data().Weight,
    message: docs.data().Messages,
    dataNotif: docs.data().createdAt,
   })
});

setNotifications(data);
           });
          
    
          
         });
           
          }
      }, [])
    
   
  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md z-50 max-md:w-full max-lg:w-full'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7] text-red-500'>!Notifications</h1>
        </di>
        <div>
                <ScrollArea className='border p-1 rounded-sm w-full no-scrollbar h-[450px]'>
                {!notif.length ? (
                      <div className='w-full h-[450px] flex flex-col justify-center items-center'>
                      <Image
                 width={160}
                 height={160}   
                 src="/Image/KawaiDog.png"
                 contentFit="cover"
                
               />
                    <label className='text-md font-bold opacity-60'>No notifications found.</label>
                     
                   </div>)
                :  notif.map((item, i) => {
                    return (
                        <div key={i} className='w-full border mb-2 h-[100px] border-l-4 border-[coral] rounded-sm shadow-md px-2 pb-1'>
                            <div className='flex items-center p-1 gap-1 '>
                            <MdErrorOutline color='blue' size={15} className='opacity-60' />
                                <h1 className='text-[13px] font-bold  capitalize opacity-60'>{item.name} * </h1>
                                <span className='text-[10px]'>{moment(item.dataNotif.toDate()).calendar()}</span>
                         
                            </div>
                          
                            <div className=' flex flex-col justify-center  px-1 gap-2 '>
                            <p className='text-[12px] opacity-60   font-bold'>Weight: {parseFloat(item?.weight).toFixed(2)} kg</p>
                                <p className='text-[15px] leading-none font-bold  text-red-500 opacity-60 '>
                                   {item.message}.
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

export default Notifications