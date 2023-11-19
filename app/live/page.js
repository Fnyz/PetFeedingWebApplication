'use client'
import React from 'react'
import Image from 'next/image'
import SideBar from '../component/SideBar';
import { useState } from 'react';
import { useEffect } from 'react';
import VideoFrame from '../component/VideoFrame';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { collection, addDoc, query, where, onSnapshot, getDocs,updateDoc, doc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase';





const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:2,
    display:'flex',
    p: 4,
  };
  



function page() {

    const [isClient , setisClient] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [credential, setCredential] = React.useState({});
    const [youtubeUrl, setYoutubeUrl] = React.useState('https://www.youtube.com/watch?v=EF8C4v7JIbA&ab_channel=BBCEarth');
    const [loading, setLoading] = React.useState(false);


    useEffect(()=> {

        const user = localStorage.getItem("credentials")
        if(user){
            const datas = JSON.parse(user);
            const q = query(collection(db, "Livestream"), where("DeviceName", "==", datas.DeviceName.trim()));
            onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
            
            if (change.type == "modified" && change.doc.data().isliveNow === true) {
                setMessage('The video is change , click continue to watch.');
                setYoutubeUrl(change.doc.data().Youtube_Url);
            }
           
          });
        
        });


        }
    },[])
    


    const handleShowCredData = () => {
        const user = localStorage.getItem("credentials")
        if(user){
            const datas = JSON.parse(user);
            setCredential(datas);
        }
    }


    

    useEffect(()=>{
     setisClient(true);
     setVisible(false);
     setMessage('Hello, do you want to watch the live video?');
     handleShowCredData();
    },[])

    const handleGoback = () => {
        setVisible(false);
        window.location.href = '/dashboard';
    }


    
  

    const startVideoLive = async () => {

        const jsonKeyFile =  {
          "client_id":"85076363562-calnoh5d29tju3sohoucghqqiij0np0o.apps.googleusercontent.com",
          "project_id":"norse-habitat-403110",
          "auth_uri":"https://accounts.google.com/o/oauth2/auth",
          "token_uri":"https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
          "client_secret":"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","redirect_uris":["http://localhost"]
        }
    
        const request = {
          DeviceName:credential.DeviceName.trim(),
          Youtube_Url:'',
          isliveNow: false,
          jsonKeyFile,
        }
    
        const docRef = await addDoc(collection(db, "Livestream"),request);
        if(docRef.id) {
          await addDoc(collection(db, "Task"),{
            type:'Livestream',
            deviceName:credential.DeviceName.trim(),
            document_id: docRef.id,
            request:'Start',
          });
          console.log('Sending request to live video!');
         return;
        }
      }


      const getData = async () => {
   
        try {
          setMessage('Hello, do you want to watch the live video?');
          const user = localStorage.getItem("credentials")
          if(user){
            const datas = JSON.parse(user);
            setCredential(datas);
            
          const q = collection(db, "Livestream");
          onSnapshot(q, (snapshot) => {
         snapshot.docChanges().forEach((change) => {
          const {DeviceName,Youtube_Url, isliveNow } = change.doc.data()
    
          if(!Youtube_Url){
            setMessage('Please wait a minute to see the live?');
            setLoading(true);
            return;
          }
     
          if(DeviceName == datas.DeviceName.trim() && isliveNow == true){
            setMessage('Do you want to continue watching the live?');
            setYoutubeUrl(Youtube_Url);
            setLoading(false);
            return;
          }
      
         });
      
       });
    
          }
    
        } catch (e) {
          // error reading value
        }
      };
    
    
      useEffect(()=> {
        getData();
      },[])


    


    return (
        <div className="h-screen relative ">
            <Image
                src="/Image/WebBackground.png"
                layout='fill'
                quality={100}
                alt='back image'
                objectFit='cover'
            />
          
            <div className='absolute left-0 right-0 px-7 py-4   '>
                <div className='flex justify-between  '>
                <SideBar />
                 </div>

                 <div className=' max-h-min mt-2'>
                {isClient && <VideoFrame  youtubeUrl={youtubeUrl} /> }
                 
                 </div>
                
            </div>

            <div>
    
      <Modal
        open={visible}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
        <Image
        width={160}
        height={160}
        src="/Image/KawaiDog.png"
        contentFit="cover"
       
      />
          <div className='grid gap-1 justify-center '>
         
          <Typography id="modal-modal-description" >
          {message}
          </Typography>
          <div className='grid gap-2'>
          <div className='w-full  p-1 grid justify-center items-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer' onClick={startVideoLive}>
           <span className='text-white font-bold'>{loading ? 'WAIT': 'YES'}</span>
          </div>
          <div className='w-full  p-1 grid justify-center items-center border-[#FAB1A0] rounded-md  hover:border-[coral] transition-all ease-in cursor-pointer' onClick={handleGoback}>
           <span className='text-[#FAB1A0] font-bold hover:text-[coral]'>NO</span>
          </div>
          </div>
        
          </div>
          
        </Box>
      </Modal>
    </div>
            
           
          
          
          
    
         
        </div>
      )
}

export default page