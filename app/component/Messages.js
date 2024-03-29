'use client'

import React, { useCallback, useRef } from 'react'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { BiMessageRoundedDots, BiMailSend } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Divider from '@mui/material/Divider';
import moment from 'moment';

import { useState, useEffect, useMemo } from 'react';
import { collection, doc, updateDoc, addDoc, serverTimestamp, query, where, onSnapshot, getDoc} from "firebase/firestore"; 
import { db } from '../firebase';
import Image from 'next/image'
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )
   

function Messages() {



    const [mess, setMess] = useState('');
    const [notif, setNotif] = useState([]);
    const [dvName, setDvName] = useState('');
    const [cred, setCred] = useState({});
    const [images, setUserImage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setSenderEmail] = useState('');
    const [messageData, setMessageData] = useState([]);
    const messagesContainerRef = useRef(null);
    const [click, setClick] = useState(false);
  


    useEffect(() => {
      // Scroll to the bottom when messages change
      scrollToBottom();
  
    }, [mess]);

    
    const scrollToBottom = () => {
      // Check if the container reference exists
      if (messagesContainerRef.current) {
        // Scroll to the bottom of the container
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };





 
     

    useEffect(()=>{

      const q = query(collection(db, "notifications"), where('type', "==", "User"));
      onSnapshot(q, (querySnapshot) => {
     const dt = [];
     querySnapshot.forEach((doc) => {
         dt.push({data:doc.data(), id:doc.id});
     });
     setNotif(dt);
  
 
   });
   

    },[])

      useEffect(()=>{

        const q = query(collection(db, "Messages"));
        onSnapshot(q, (querySnapshot) => {
       const dt = [];
       querySnapshot.forEach((doc) => {
           dt.push({data:doc.data(), id:doc.id});
       });
       setMessageData(dt);
    
   
     });
     

      },[])


     


    


    const getUserData = async () => {
        const jsonValue = localStorage.getItem('credentials');
        const credential = JSON.parse(jsonValue);
        setDvName(credential.DeviceName);
        setCred(credential)
    
        const docRef = doc(db, "users", credential.userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          setUserImage(docSnap.data().image);
          setUsername(docSnap.data().username);
          setSenderEmail(docSnap.data().email);
        } 
    
      }
    
      useEffect(()=> {
        getUserData();
      },[])



    const handleSendMessage = useCallback(() => {
         setClick(true)

           console.log('adas')
      
         if(!mess) {
          setClick(false)
          toast.error('Please input the message.', {
            position: "top-right",
            autoClose: 1700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            return;
        }
    
        const initialMessage = [
          {
            message: mess,
            username: username,
            image: images,
            type: 'Admin',
            messagedate: new Date(),
         
          }
        ]


        const notification = {
          deviceName: dvName.trim(),
          Messages: `${username} is send you a message please check it to chat.`,
          createdAt: serverTimestamp(),
          hasSeen:false,
          pet_name:null,
          type:"Admin",
  
        }
    
    
    
    
        const message = {
          adminSend:true,
          hasDevice:true,
          Image:images,
          deviceName: dvName.trim(),
          sender: email,
          message:initialMessage,
          createdAt: serverTimestamp(),
          hasSeen: false,
        }
    
    
        
        const dts = messageData.find((d) => d.data.deviceName === dvName && d.data.sender === email);
        
        if(!dts){
          addDoc(collection(db, "Messages"),message)
          .then((docs)=> {
            if(docs.id){
              console.log('reach')
              console.log(notification);
              addDoc(collection(db, "notifications"),notification)
              .then((docs)=> {
              if(docs.id){
              setMess('')
              setClick(false)
              }
          });
            }
          });
    
          return;
        }
            
            const currentMessage  = dts.data.message || [];
            const updatedMessages = [...currentMessage, ...initialMessage];
            const docRef = doc(db, 'Messages', dts.id);
            updateDoc(docRef, {
              adminSend:true,
              hasSeen: false,
              message:updatedMessages,
           }).then(()=>{
            console.log('reach2')
       
            addDoc(collection(db, "notifications"),notification);
             setMess('')
             setClick(false)
           });
           return;
      },[mess])


      const dataMessage = (m) => {
    
        return m.find(d => d?.data.sender === email && d.data.deviceName === dvName);
    
      }
    
     
    
    
      const dMessage = useMemo(()=> dataMessage(messageData), [messageData]);


  return (

    <>
    <Dialog >
    <DialogTrigger asChild >
    <Box sx={{ '& > :not(style)': { m: 1, position:'absolute', right:20, bottom:25} }} onClick={()=>{
       console.log('hello');
       const b = dMessage?.data.message.map(d =>{
        return d.unseen === false ? { ...d, unseen: true } : d
       })
   
    

   const dts = messageData.find((d) => d.data.deviceName === dvName && d.data.sender === email);
      if(dts?.data.adminSend === false){
              const docRef = doc(db, 'Messages', dts?.id);
        updateDoc(docRef, {
        message:b
    })
 
    return;
      }
 
  
   

  

    }}  >
    <Fab aria-label="add" >
    <Badge badgeContent={dMessage?.data?.adminSend === false ? dMessage?.data.message.filter(a => a.type === "User" && a.unseen === false).length: 0} color="primary">
    <BiMessageRoundedDots size={25} className='hover:text-red-600' 
    />
    </Badge>
    </Fab>
    
  </Box>
  
    </DialogTrigger>
    <DialogContent className="w-full" >
      <DialogHeader>
        <DialogTitle className="max-md:text-start">Message</DialogTitle>
        <DialogDescription className="max-md:text-start">
          Feel free to message the admin for more questions?
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
      <div className="element-with-scroll h-72 w-[100%] rounded-md border p-3" ref={messagesContainerRef}>
   

      {!dMessage && (
              <label style={{
                opacity:0.5,
              }}>No message found!</label>
            )}
            {dMessage && dMessage?.data.message.map((data, i) => {
               return (
               <div  className= {`space-y-2 flex  ${data.type === 'Admin' && " ml-[127px]" } mt-1 ${data.type === 'Admin' ? " w-[70%]": "w-full" }  items-center  ${data.type === 'Admin' && " justify-end" } `}>
                <div>
                <Image 
          src={data.image}
          width={60}
          height={60}
          objectFit='contain'
          className='p-2'

          />
                </div>
                <div className='flex flex-col w-full'>
                    <div className={` w-full flex max-md:${data.type === 'Admin' && "flex-col" } gap-1 max-md:gap-0 `}>
                    <span className='text-[10px] opacity-70 leading-normal'>{data.type === 'Admin' ? dvName : "Admin"} / </span>
                    <span className='text-[10px] opacity-70 leading-normal'>{moment(data.messagedate.toDate()).calendar()}</span>
                    </div>
                    <label className='text-[13px] opacity-80 font-bold'>{data.message}</label>
                </div>
               </div>
              )
            })}
       
   
    </div>
      </div>
      <Divider />
      <DialogFooter className='flex max-sm:flex-col gap-2'>
        
          <div className='w-full' >
          <Input value={mess} placeholder='Input message here' className='w-full' onChange={(e)=> setMess(e.target.value)}  />
         </div>
         <div className=' rounded-md w-full p-2 gap-2 justify-center font-bold flex items-center text-white bg-[#FAB1A0] cursor-pointer hover:bg-[coral]' onClick={handleSendMessage}>
         {click ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span className='text-sm font-bold '>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
           <BiMailSend size={20} color='white'/>
          <span>SEND</span>
            </>
           
         }
    
         </div>
      
      </DialogFooter>

    </DialogContent>
  </Dialog>

  <ToastContainer
position="top-right"
autoClose={1500}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
className="opacity-80"
/>
    
  
 </>
  )
}

export default Messages