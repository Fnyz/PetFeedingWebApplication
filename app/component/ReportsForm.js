'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BiMailSend} from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { collection, doc, updateDoc, addDoc,  query, orderBy, onSnapshot, getDoc} from "firebase/firestore"; 
import { db } from '../firebase';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';







function ReportsForm() {

    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [deviceName, setDeviceName] = useState('');
    const [data, setData] = useState({})
    const [messageSend, setSendMessage] = useState('');
    const [messageData, setDataMessage] = useState([]);
    const [userImage, setUserImage] = useState('');
    const [userName, setUserName] = useState('');
    const [reportsData, setReportsDataData] = useState([]);
    const [click, setClick] = useState(false);
    
    
  


    const getReportsList = () => {
      const q = query(collection(db, "Reports"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push({data:doc.data(), id:doc.id});
    });
    setReportsDataData(dt);

  });
  
    }

    const getUserData = async () => {
        const jsonValue = localStorage.getItem('credentials');
        const credential = JSON.parse(jsonValue);
        setDeviceName(credential.DeviceName);
        setData(credential)
    
        const docRef = doc(db, "users", credential.userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          setUserImage(docSnap.data().image);
          setUserName(docSnap.data().username);
          setEmail(docSnap.data().email);
        } 
    
      }
    
      useEffect(()=> {
        getUserData();
        getReportsList();
      },[])


      useEffect(()=> {
        const q = query(collection(db, "Messages"), orderBy("createdAt", "desc"));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach((docs) => {
           data.push({dt:docs.data(), id: docs.id});
       });
    
       setDataMessage(data);
     });
       
     
      }, [])
    
  





  

    const handleSubmitReports = async  () => {

        setClick(true);
        const initialMessages = [
          { message, timestamp: new Date() }
        ];
    
        const reports = {
          DeviceName: deviceName,
          Email:email,
          Username: userName,
          Message:initialMessages,
          createdAt: new Date(),
       }


       if(!message) {
        setClick(false)
        Swal.fire({
          title: "Warning?",
          text: "Please input all fields.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
         
        })
          return;
      }





       const res = reportsData.find(r =>  r.data.DeviceName === deviceName);

       if(!res){
        addDoc(collection(db, "Reports"),reports)
        .then((docs)=> {
          if(docs.id){
            setClick(false);
            setMessage('');
            Swal.fire({
              title: "Success?",
              text: "Report added successfully.",
              icon: "success",
              confirmButtonColor: "#FAB1A0",
              confirmButtonText: "Yes, I will.",
              
             
            })

          }
        });


  
        return;
       }

       const currentMessage  = res.data.Message || [];
       const updatedMessages = [...currentMessage, ...initialMessages];
       const docRef = doc(db, 'Reports', res.id);
       updateDoc(docRef, {
         Message:updatedMessages,
      }).then(()=>{
        setClick(false);
        setMessage('');
        Swal.fire({
          title: "Success?",
          text: "Report added successfully.",
          icon: "success",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
         
        })
      });


    
      }
  



  return (
    <>
    <Card className="w-[440px]">
    <CardHeader>
     <CardTitle>Reports</CardTitle>
     <CardDescription>Fill out this form below.</CardDescription>
    </CardHeader>
    <CardContent>
    <div className=' flex justify-center items-center'>
    </div>

     <form>
       <div className="grid w-full items-center gap-4">
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="email">Email Address</Label>
           <Input id="petname" placeholder="Input email here" value={email} onChange={(e)=>{
             setEmail(e.target.value);
            }} disabled/>
         </div>
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="username">Username</Label>
           <Input id="age" placeholder="Input username here"  value={userName} onChange={(e)=>{
             setUserName(e.target.value);
            }} disabled/>
         </div>
         
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="Message">Message</Label>
           <Textarea placeholder="Type your message here." value={message} onChange={(e)=>{
             setMessage(e.target.value);
            }}  />
         </div>
         <div className='flex justify-between  items-center  '>
    
    
        
       
         </div>
    
      
   
    
       </div>
     </form>
    </CardContent>
    <CardFooter className="flex justify-between">
     <Button variant="outline">CLEAR</Button>
    
     <div onClick={handleSubmitReports} className='flex transition-all ease-in  justify-center items-center gap-2 border px-4 py-2 rounded-md bg-[#FAB1A0] text-white shadow-sm cursor-pointer hover:bg-[coral]'>
     {click ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span className='text-sm font-bold '>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
           <BiMailSend size={20} />
      <label className=' cursor-pointer font-bold  w-11'>SEND</label>
            </>
           
         }
         

        
      </div>
    </CardFooter>
    </Card>
 
    </>
  )
}

export default ReportsForm