'use client'

import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { ScrollArea ,ScrollBar } from "@/components/ui/scroll-area"
import { Avatar } from '@mui/material';
import { db } from '../firebase';
import { onSnapshot, query, where, collection, orderBy, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"





  







function NotificationList() {

    const [isClient, setIsclient] = useState(false);
    const [notifications, setNotifications] = useState([]);


    useEffect(()=>{
       setIsclient(true);
    },[])


    
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
    deviceName: docs.data().deviceName,
    image:doc1.data().image,
    Messages:docs.data().Messages,
    createdAt:docs.data().createdAt
   })
});
setNotifications(data);

      });

    
     

     
    });

     
    },[])

    if(!isClient) return;
 



  return (
    <Card className="w-full h-[700px]">
    <CardHeader>
     <CardTitle>List of Notifications</CardTitle>
     <CardDescription>See the list of notification here.</CardDescription>
    </CardHeader>

    <CardContent className='h-full '> 
      <ScrollArea className='flex flex-col space-y-2 gap-2 h-[550px] p-3 border rounded-sm w-full '>
      <ScrollBar orientation="horizontal" />
        {!notifications.length && (
          <div className='w-full  h-full flex flex-col justify-center items-center mt-28 '>
          <Image
     width={160}
     height={160}
     src="/Image/SadDog.png"
     contentFit="cover"
    
   />
        <label className='text-md font-bold opacity-60'>No notications found.</label>
         
       </div>
        )}
        {notifications && notifications.map((d, i)=> {
            return (
                
        <div className={`flex  justify-between items-center border gap-9 mb-2 p-3 w-full rounded-md max-md:flex-col ${!d.hasSeen ? "border-[#FAB1A0]": " opacity-50"} `}>
        <div className='flex justify-center items-center gap-4 '>
        <div className={`border p-1 rounded-full ${!d.hasSeen && "border-[#FAB1A0]"}  relative `}>
    <Avatar
alt="Remy Sharp"
src={d.image ||"/Image/anyaCuttie.jpg"}
sx={{ width: 50, height: 50 }}
/>      
    </div>
        <div className='flex flex-col justify-center'>
            <span className={`font-bold max-md:text-[15px] ${!d.hasSeen && "text-[#FAB1A0]"}`}>{d.deviceName}</span>
            <span className={`text-sm opacity-60 max-md:text-[13px] ${!d.hasSeen && "text-[#FAB1A0]"} w-[100%] `}>{d.Messages} </span>
        </div>
        </div>
     
        <div className='text-[10px] opacity-70 max-md:self-end max-md:text-[12px] text-red-500 font-bold w-[100px]'>
           {moment(d.createdAt.toDate()).calendar()}
        </div>
    </div>

            )
        })}       
        
        </ScrollArea>
    </CardContent>
 
    </Card>
  )
}

export default NotificationList