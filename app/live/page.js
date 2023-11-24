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
    const [loading, setLoading] = React.useState(false);
    const [liveStreamUrl, setLiveStreamUrl] = useState('https://www.youtube.com/watch?v=RNprQYHenNI&ab_channel=DisneyMusicVEVO');
    const [apiKey1, setApiKey] = useState('');
    const [channel, setChannel] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [liveiD, setLiveId] = useState("");


    const handleRefetch =async () => {

    
      try {
        // Step 1: Get live broadcasts associated with the channel
        const liveBroadcastsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey1}&channelId=${channel}&eventType=live&type=video&part=snippet,id`
        );
    
        const liveBroadcastsData = await liveBroadcastsResponse.json();
      
        // Step 2: Extract video IDs from the live broadcasts
        const videoIds = liveBroadcastsData.items.map((item) => item.id.videoId);
        console.log(videoIds);

          if(!videoIds[0]){
            setVisible1(true);
            setVisible(false);
            return;
          }
         
          setVisible(false);
          const url = `https://www.youtube.com/watch?v=${videoIds[0]}`;
          setLiveStreamUrl(url);

          const docRef = doc(db, 'Livestream', liveiD);
            updateDoc(docRef, {
              Youtube_Url:url,
           }).then(()=>{
             console.log("Updated Database");
           });

        // You can use the video IDs for further processing
      } catch (error) {
        console.error('Error fetching live streams:', error);
      }

    }

  



    const fetchLiveStreams = async (apiKey, channelId, id) => {
      setApiKey(apiKey);
      setChannel(channelId);
      setLiveId(id);
 
      try {
        // Step 1: Get live broadcasts associated with the channel
        const liveBroadcastsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&eventType=live&type=video&part=snippet,id`
        );
    
        const liveBroadcastsData = await liveBroadcastsResponse.json();
      
        // Step 2: Extract video IDs from the live broadcasts
        const videoIds = liveBroadcastsData.items.map((item) => item.id.videoId);

          if(!videoIds[0]){
            setVisible1(true);
            setVisible(false);
            return;
          }
          setVisible(false);
          const url = `https://www.youtube.com/watch?v=${videoIds[0]}`;
          setLiveStreamUrl(url);

          const docRef = doc(db, 'Livestream', id);
            updateDoc(docRef, {
              Youtube_Url:url,
           }).then(()=>{
             console.log("Updated Database");
           });
      
    
        
        
        // You can use the video IDs for further processing
      } catch (error) {
        console.error('Error fetching live streams:', error);
      }

     


    };
    
   
  

    useEffect(()=> {

        const user = localStorage.getItem("credentials")
        if(user){
            const datas = JSON.parse(user);
            const q = query(collection(db, "Livestream"), where("DeviceName", "==", datas.DeviceName.trim()));
            onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              setLiveId(change.doc.id)
            
            if (change.type == "modified" && change.doc.data().isliveNow === true) {
             
                setMessage('Please wait for a minute, proccessing youtube url.');
                fetchLiveStreams(change.doc.data().ApiKey,change.doc.data().ChannelID, change.doc.id);
  
   
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
     setVisible(true);
     setMessage('Hello, do you want to watch the live video?');
     handleShowCredData();
    },[])

    const handleGoback = () => {
        setVisible(false);
        window.location.href = '/dashboard';
    }


    
  

    const startVideoLive = async () => {

        
    
        const request = {
          DeviceName:credential.DeviceName.trim(),
          isliveNow: false,
          Youtube_Url:"",
          ApiKey:"",
          ChannelID:"",
          jsonKeyFile:{}
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
    
          if(!isliveNow && !Youtube_Url){
            setMessage('Please wait a minute to see the live?');
            setLoading(true);
            return;
          }
     
          if(DeviceName == datas.DeviceName.trim() && isliveNow == true && Youtube_Url){
            setMessage('Do you want to continue watching the live?');
            liveStreamUrl(Youtube_Url);
            setLoading(false);
            return;
          }
      
         });
      
       });
    
          }
    
        } catch (e) {
         
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

                 <div className=' max-h-min mt- 2'>
                {isClient && <VideoFrame  youtubeUrl={liveStreamUrl} /> }
                 
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
         
          <Typography id="modal-modal-description" className='font-bold opacity-60' >
          {message}
          </Typography>
          <div className='grid gap-2'>
          <div className={`w-full  p-1 grid justify-center items-center rounded-md bg-[#FAB1A0]    ${!loading && "cursor-pointer hover:bg-[coral] transition-all ease-in"}`} disabled={loading} onClick={startVideoLive}>
           <span className='text-white font-bold'>{loading ? 'WAIT': 'YES'}</span>
          </div>
          <div className='w-full  p-1 grid justify-center items-center border-[#FAB1A0] rounded-md border  hover:border-[coral] transition-all ease-in cursor-pointer' onClick={handleGoback}>
           <span className='text-[#FAB1A0] font-bold hover:text-[coral] '>GO HOME</span>
          </div>
          </div>
        
          </div>
          
        </Box>
      </Modal>

      <Modal
        open={visible1}
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
          Something went wrong, please click the bottom to request again.
          </Typography>
          <div className='grid gap-2'>
          <div className='w-full  p-1 grid justify-center items-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer' onClick={handleRefetch}>
           <span className='text-white font-bold'>Reload</span>
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