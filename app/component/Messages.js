'use client'

import React from 'react'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { BiMessageRoundedDots } from "react-icons/bi";
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import Divider from '@mui/material/Divider';
 
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useMemo } from 'react';
import { collection, doc, updateDoc, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDoc} from "firebase/firestore"; 
import { db } from '../firebase';
import Image from 'next/image';


const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )
   

function Messages() {



    const [mess, setMess] = useState('');
    const [dvName, setDvName] = useState('');
    const [cred, setCred] = useState({});
    const [images, setUserImage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setSenderEmail] = useState('');
    const [messageData, setMessageData] = useState([]);




 

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



    const handleSendMessage = async () => {

        const initialMessage = [
          {
            message: mess,
            username: username,
            image: images,
            type: 'User',
            messagedate: new Date(),
          }
        ]
    
    
    
    
        const message = {
          deviceName: dvName.trim(),
          sender: email,
          message:initialMessage,
          createdAt: serverTimestamp(),
        }
    
    
        
        const dts = messageData.find((d) => d.data.deviceName === dvName && d.data.sender === email);
        
        if(!dts){
          addDoc(collection(db, "Messages"),message)
          .then((docs)=> {
            if(docs.id){
              setMess('')
              alert('Message sent successfully');
            }
          });
    
          return;
        }
            
            const currentMessage  = dts.data.message || [];
            const updatedMessages = [...currentMessage, ...initialMessage];
            const docRef = doc(db, 'Messages', dts.id);
            updateDoc(docRef, {
              message:updatedMessages,
           }).then(()=>{
             setMess('')
             console.log('update send message success')
           });
           return;
      }


      const dataMessage = (m) => {
    
        return m.find(d => d?.data.sender === email && d.data.deviceName === dvName);
    
      }
    
     
    
    
      const dMessage = useMemo(()=> dataMessage(messageData), [messageData]);


  return (


    <Dialog>
    <DialogTrigger asChild>
    <Box sx={{ '& > :not(style)': { m: 1, position:'absolute', right:20, bottom:25, } }}>
    <Fab aria-label="add">
      <BiMessageRoundedDots size={25} className='hover:text-red-600' />
    </Fab>
    
  </Box>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Message</DialogTitle>
        <DialogDescription>
          Feel free to message the admin for more questions?
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
      <ScrollArea className="h-72 w-[100%] rounded-md border">
      <div className="p-4">

      {!dMessage && (
              <label style={{
                opacity:0.5,
              }}>No message found!</label>
            )}
            {dMessage && dMessage?.data.message.map((data, i) => {
               return (
               <div  className= {`space-y-2 flex items-center  ${data.type === 'User' &&  "pl-[130px]" } w-[100%] `}>
                <div>
                <Image 
          src={data.image}
          width={50}
          height={50}
          objectFit='contain'
          className='p-2'

          />
                </div>
                <div className='flex flex-col'>
                    <label className='text-[10px] opacity-70'>{data.username} / 10:20</label>
                    <label className='text-[13px] opacity-80 font-bold'>{data.message}</label>
                </div>
               </div>
              )
            })}
       
      </div>
    </ScrollArea>
      </div>
      <Divider />
      <DialogFooter>
          <div >
          <Input value={mess} placeholder='Input message here' onChange={(e)=> setMess(e.target.value)}  />
         </div>
        <Button type="submit" onClick={handleSendMessage}>SEND</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    
  
    
  )
}

export default Messages