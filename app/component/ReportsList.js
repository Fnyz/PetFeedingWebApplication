'use client'

import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { ScrollArea ,ScrollBar } from "@/components/ui/scroll-area"
import { Avatar } from '@mui/material';
import { db } from '../firebase';
import { onSnapshot, query, where, collection, orderBy, getDocs , doc, updateDoc, addDoc, serverTimestamp} from 'firebase/firestore';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Modal from '@mui/material/Modal';
import {  BiX, BiCircle , BiMailSend, BiMessageSquareDetail  } from "react-icons/bi";
import Box from '@mui/material/Box';
import { Input } from "@/components/ui/input"


  
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    p: 4,
  };







function ReportsList() {

    const [isClient, setIsclient] = useState(false);
    const [reports, setReports] = useState([]);
    const [open, setOpen] = useState(false);
    const [image, setImg] = useState('');
    const [dvName, setDvname] = useState('');
    const [mess, setMess] = useState([]);
    const [sendSMS, setSendSMS] = useState(false);
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState("")
    const [allMessages, setAllMessages] = useState([]);
    const [adImage, setImageAdmin] = useState("");
    const [email, setEmail] = useState("")

    useEffect(()=>{
       setIsclient(true);
    },[])


    
    useEffect(()=>{
   
       const q = query(collection(db, "Reports"), orderBy("createdAt", "desc"));
       onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach(async(docs) => {
      
        const q = query(collection(db, "users"), where("Devicename", "==", docs.data().DeviceName));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc1) => {
  // doc.data() is never undefined for query doc snapshots
   data.push({
    hasSeen:docs.data().hasSeen,
    deviceName: docs.data().DeviceName,
    image:doc1.data().image,
    Messages:docs.data().Message,
    createdAt:docs.data().createdAt,
    id:docs.id,
    active:doc1.data().isActive,
    email:doc1.data().email
   })
});
setReports(data);

      });

    
     

     
    });

     
    },[])


    useEffect(()=>{
      const q = query(collection(db, "Messages"), where("hasDevice", "==", true));
      onSnapshot(q, (querySnapshot) => {
     const dt = [];
     querySnapshot.forEach((doc) => {
         dt.push({data:doc.data(), id:doc.id});
     });
     setAllMessages(dt);
     });

   
  },[])


  useEffect(()=> {

    const q = query(collection(db, "users"));
    onSnapshot(q, (querySnapshot) => {
   const dt = [];
   querySnapshot.forEach((doc) => {
       dt.push({data:doc.data(), id:doc.id});
   });
   const res = dt.find(a=> a.data.username === 'Admin' && a.data.isAdmin === true);
   setImageAdmin(res.data.image)
   console.log(res.data.image);
  

   
 });
},[])

  const handleSendMessage = async () => {
  

   const initialMessage = [
     {
      message: message,
      username: 'Admin',
      image: adImage,
      type: 'Admin',
      messagedate: new Date(),
      unseen:false,
     }
   ]


    const notification = {
        deviceName:dvName,
        Messages: `Admin is send you a message please check it to chat.`,
        createdAt: serverTimestamp(),
        hasSeen:false,
        type:"User"
    }

   const message = {
     hasDevice:true,
     Image:image,
     deviceName: dvName,
     sender: email,
     message:initialMessage,
     createdAt: serverTimestamp(),
     hasSeen: false,
   }


   
   const dts = allMessages.find((d) => d.data.deviceName === dvName && d.data.sender === email);
   
   if(!dts){
     addDoc(collection(db, "Messages"),message)
     .then((docs)=> {
       if(docs.id){
         addDoc(collection(db, "notifications"),notification)
         .then((docs)=> {
         if(docs.id){
          setMessage('')
          setSendSMS(false);
         }
     });
       }
     });

     return;
   }
       
      
 }

   

    if(!isClient) return;
 



  return (
    <Card className="w-full h-[700px]">
    <CardHeader>
     <CardTitle>List of Reports</CardTitle>
     <CardDescription>See the list of reports here from user.</CardDescription>
    </CardHeader>

    <CardContent className='h-full '> 
      <ScrollArea className='flex flex-col space-y-2 gap-2 h-[550px] p-3 border rounded-sm w-full '>
      <ScrollBar orientation="horizontal" />
        {!reports.length && (
          <div className='w-full  h-full flex flex-col justify-center items-center mt-28 ' >
          <Image
     width={160}
     height={160}
     src="/Image/SadDog.png"
     contentFit="cover"
    
   />
        <label className='text-md font-bold opacity-60'>No notications found.</label>
         
       </div>
        )}
        {reports && reports.map((d, i)=> {
            return (
                
        <div  onClick={()=> {
            setImg(d.image)
            setDvname(d.deviceName)
            setOpen(true)
            setMess(d.Messages)
            setActive(true)
            setEmail(d.email)
            const docRef = doc(db, 'Reports', d.id);
      updateDoc(docRef, {
        hasSeen:true,
     }).then(()=>{
       console.log('update send message success')
     });
          }} className={`flex  justify-between items-center border gap-9 mb-2 p-3 w-full rounded-md max-md:flex-col ${!d.hasSeen ? "border-[#FAB1A0]": " opacity-50"} `}>
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
            <span className={`text-sm opacity-60 max-md:text-[13px] ${!d.hasSeen && "text-[#FAB1A0]"} w-[100%] `}>{d.Messages[d.Messages.length - 1].message} </span>
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

    <Modal
        open={open}
      
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between mb-2'>
          <div className='flex justify-center items-center gap-2'>
          <span className='font-bold text-red-500'>{dvName}</span>
          <span>
            list of Report's.
            </span>
          </div>
         
          <BiX size={30} onClick={()=> setOpen(false)} color='red' className='cursor-pointer'/>
        </div>
        <div   className=" h-[300px] mb-5 border rounded-md p-2 " >

           {mess.length && mess.map((d, i)=>{
            return (
                <div  className= {`space-y-2 flex items-center border p-2 rounded-md gap-2 mb-2  `}>
              
                <div className='flex flex-col'>
                    <label className='text-[10px] opacity-70'>{moment(d.timestamp.toDate()).calendar()}</label>
                    <label className='text-[13px] opacity-80 font-bold'>{d.message}</label>
                </div>
               </div>

            )
           })} 
          

           
           
        </div>

        <div className='w-full flex gap-2' >
           <div className=' rounded-md w-full p-2 gap-2 justify-center font-bold flex items-center text-white bg-[#FAB1A0] cursor-pointer hover:bg-[coral]' onClick={()=>{
             const dts = allMessages.find((d) => d.data.deviceName === dvName && d.data.sender === email)
             if(dts){
               window.location.href = "/chats"
               return;
             }
             setSendSMS(true)
           }}>
         <BiMessageSquareDetail size={17} color='white'/>
          <span>SEND MESSAGE NOW</span>
         </div>
         </div>
       
        </Box>
      </Modal>

      <Modal
        open={sendSMS}
      
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between mb-4'>
         
          <div className='flex justify-center items-center gap-4'>
            <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={image ||"/Image/anyaCuttie.jpg"}
  sx={{ width: 50, height: 50 }}
/>      
        </div>
            <div className='flex flex-col justify-center'>
                <span className='font-bold max-md:text-[15px]'>{dvName}</span>
                {active ? (
  <div className=' flex items-center gap-1 w-full'>
  <span className='text-sm opacity-60 max-md:text-[13px]'>Active now</span>
  <BiCircle size={10} color='green' className=' bg-green-700 overflow-hidden rounded-full'/>
  </div>

                ): (
                    <div className=' flex items-center gap-1 w-full'>
                    <span className='text-sm opacity-60 max-md:text-[13px]'>Offline now</span>
                    <BiCircle size={10} color='red' className=' bg-red-700 overflow-hidden rounded-full'/>
                    </div>
    
                )}
              
                
               
            </div>
            </div>
         
          <BiX size={30} onClick={()=> {
            setSendSMS(false)
          } } color='red' className='cursor-pointer'/>
        </div>
        <div className='w-full flex gap-2' >
          <Input  placeholder='Input message here' className='w-3/4'  onChange={(e)=> setMessage(e.target.value)} value={message} />
          <div className=' rounded-md w-1/4 p-2 gap-1 justify-center font-bold flex items-center text-white bg-[#FAB1A0] cursor-pointer hover:bg-[coral]'  onClick={handleSendMessage}>
         <BiMailSend size={20} color='white'/>
          <span>SEND</span>
         </div>
         </div>
       
        </Box>
      </Modal>
 
    </Card>
  )
}

export default ReportsList