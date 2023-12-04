import React from 'react'
import { AiFillWarning } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState , useEffect} from 'react';
import {collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import { db } from '../firebase';
import { BiSolidBell } from "react-icons/bi";
import moment from 'moment';
function Notifications() {

    const [notif, setNotifications] = useState([]);

    useEffect(()=> {
   
        const user = localStorage.getItem("credentials");
          const datas = JSON.parse(user);
          if(user){
            const q = query(collection(db, "notifications"), where("deviceName", "==", datas.DeviceName.trim()), orderBy("createdAt", "desc"));
            onSnapshot(q, (querySnapshot) => {
           const data = [];
           querySnapshot.forEach((docs) => {
               data.push({dt:docs.data(), id: docs.id});
           });
           setNotifications(data);
          
         });
           
          }
      }, [])
    
   
  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md z-50 max-md:w-full max-lg:w-full'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7]'>!Notifications</h1>
            <span className='text-[12px] opacity-[0.6]'>See all</span>
        </di>
        <div>
                <ScrollArea className='border p-1 rounded-sm w-full no-scrollbar h-[450px]'>
                {!notif.length ? (
                    <div>

                    </div>)
                :  notif.map((item, i) => {
                    return (
                        <div key={i} className='w-[100%] border mb-2 h-[100px] border-l-4 border-red-300 rounded-sm shadow-md'>
                            <div className='flex items-center ml-2 gap-1 mt-2'>
                                <BiSolidBell size={15} color='blue'/>
                                <h1 className='text-[12px] font-bold opacity-60'>{item.dt.Messages.split(" ")[1]} * </h1>
                                <span className='text-[8px]'></span>
                            </div>
                            <div className='ml-[25px] mt-1'>
                              
                                <p className='text-[15px] leading-none mt-1'>
                                   {item.dt.Messages}.
                                </p>
                                <p className='text-[12px] mt-4 self-end text-red-500 opacity-60 font-bold'>{moment(item.dt.createdAt.toDate()).calendar()}</p>
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