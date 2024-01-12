'use client'
import React from 'react'
import Image from 'next/image'
import SideBar from '../component/SideBar';
import { useState } from 'react';
import { useEffect , useContext} from 'react';
import VideoFrame from '../component/VideoFrame';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { collection, addDoc, query, where, onSnapshot, getDocs,updateDoc, doc, deleteDoc, setDoc} from 'firebase/firestore';
import { db } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { BiHome } from "react-icons/bi";
import Swal from 'sweetalert2'
import { GlobalContext } from '../GlobalContext';



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
  const { showTimer, setShowTimer,  remainingTime} = useContext(GlobalContext)

    const [isClient , setisClient] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [message, setMessage] = React.useState('Hello, do you want to watch the live video?');
    const [credential, setCredential] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [liveStreamUrl, setLiveStreamUrl] = useState('');
    const [apiKey1, setApiKey] = useState('');
    const [channel, setChannel] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [liveiD, setLiveId] = useState("");
    const [liveStreamList, setLiveStreamList] = useState([]);
    const [reloadpage, setReloadPage] = useState(false)
    const [remainingTime2, setRemainingTime2] = useState(remainingTime)
    // const [showTimer, setShowTimer] = useState(false);
    const [errorMess, setErrorMessages] = useState("Something went wrong, please click the bottom to request the live video again?")
  

    useEffect(()=>{
      const user = localStorage.getItem("credentials");
      if(!user){
        window.location.href = "/login";
      }

      const d = JSON.parse(user);
      if(!d.DeviceName){
       window.location.href = "/home"
       return;
      }
     
    },[])

  



  


    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes < 10 ? '0' : ''}${minutes} mins ${seconds < 10 ? '0' : ''}${seconds} sec`;
    };
 
    useEffect(()=>{

        const storedStartTime =  localStorage.getItem('startTime');
        if (storedStartTime !== null) {
          if (remainingTime === 0) {
            setShowTimer(false);
            fetchLiveStreams(apiKey1, channel, liveiD)
            console.log("run heres");
          }
        }
       
    
   
    },[remainingTime])
  

  

    const handleVideoEnd = () => {
   
    
     const docRef = doc(db, 'Livestream', liveiD);
     updateDoc(docRef, {
       Youtube_Url:'',
       isliveNow:false,
       ended:true,
    }).then(()=>{
      console.log("Updated Database");
      setLiveStreamUrl("");
      setMessage("Live video ended, do you want to watch live again?");
      setVisible(true);
      setLoading(false);
    });
      // You can perform additional actions here when the video ends
    };

    const handleExitPAGE = () => {
    
      if(liveStreamUrl === ""){
        localStorage.removeItem('startTime')
        localStorage.removeItem('remaintime');
        localStorage.removeItem('flag');
        const docRef = doc(db, 'Livestream', liveiD);
        updateDoc(docRef, {
          Youtube_Url:'',
          isliveNow:false,
          ended:true,
       }).then(async()=>{
        await addDoc(collection(db, "Task"),{
          type:'Livestream',  
          deviceName:credential.DeviceName.trim(),
          document_id: liveiD,
          request:'Stop',
        });
         console.log("Url removed from live stream!");
         setLiveStreamUrl("");
         setVisible(false);
         setLoading(false);
         window.location.href = "/dashboard"
        });
        // You can perform additional actions here when the video ends
        return;
      }

      window.location.href = "/dashboard"
      return;
     };
 

    const handleRefetch =async () => {
      setVisible(false);
      setReloadPage(true)
      // Step 1: Get live broadcasts associated with the channel
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey1}&channelId=${channel}&eventType=live&type=video&part=snippet,id`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      const docRef = doc(db, 'Livestream', liveiD);
        updateDoc(docRef, {
          isliveNow: false,

        }).then(() => {
          setErrorMessages("Video quota exceeded!, Please contact adminstrator!");
          setVisible1(true);
          setLoading(false);
          setReloadPage(false)
  
        });
      return;
    }
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data); // Log the entire API response
    const liveVideo = data?.items && data?.items[0]; // Check if items array exists


    if(!data.items.length){
      setVisible1(true)
      setReloadPage(false)
    }

 
    if (liveVideo) {
      setVisible1(false);
      const videoId = liveVideo.id.videoId;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
        const docRef = doc(db, 'Livestream', liveiD);
        updateDoc(docRef, {
          Youtube_Url:url,
       }).then(()=>{
         console.log("Updated Database");
         setLiveStreamUrl(url);
         setReloadPage(false)
    
       });
  
      // // You can use the video IDs for further processing
    } else {
      // Handle case when there are no live videos
    }
  })
  .catch(error => {
    setVisible(false);
  });


  }



  const fetchLiveStreams = async (apiKey, channelId, id) => {

   localStorage.removeItem('startTime')
   setVisible(false);
 
        
    // Step 1: Get live broadcasts associated with the channel
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&eventType=live&type=video&part=snippet,id`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      const docRef = doc(db, 'Livestream', id);
        updateDoc(docRef, {
          isliveNow: false,

        }).then(() => {
          setErrorMessages("Video quota exceeded!, Please contact adminstrator!");
         setVisible1(true);
         setLoading(false);
        });
      return;
    }
    return response.json();
  })
  .then(data => {
    console.log('API Response:', data); // Log the entire API response
    const liveVideo = data?.items && data?.items[0]; // Check if items array exist

      if(!data.items.length){
        setShowTimer(false);
        setVisible1(true);
        setLoading(false);
      }

  
   
   

    if (liveVideo) {
      
      setShowTimer(false);
      setVisible1(false);
      const videoId = liveVideo.id.videoId;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
        const docRef = doc(db, 'Livestream', id);
        updateDoc(docRef, {
          Youtube_Url:url,
       }).then(()=>{
        setShowTimer(false);
         console.log("Youtube url is set successfully!");
         setLiveStreamUrl(url);     
       });
      // // You can use the video IDs for further processing
    } else {
      // Handle case when there are no live videos
    }
  })
  .catch(error => {
    setVisible(false);
  });

  };



    useEffect(()=> {

 
          const q = query(collection(db, "Livestream"));
          onSnapshot(q, (snapshot) => {
            const data = [];
          snapshot.docChanges().forEach((change) => {

            data.push({data: change.doc.data(), id: change.doc.id})
        });

        setLiveStreamList(data);
      
      });


  },[])
  

     

    useEffect(()=> {

        const user = localStorage.getItem("credentials")
        if(user){
            const datas = JSON.parse(user);
            const q = query(collection(db, "Livestream"), where("DeviceName", "==", datas.DeviceName.trim()));
            onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async(change) => {
       
            
            if (change.type === "modified" && change.doc.data().isliveNow === true) {
             
                setMessage('Please wait for a minute, proccessing youtube url.');
                // const storedStartTime = localStorage.getItem('startTime');
  
                // if (!storedStartTime) {
                //   const startTime = Date.now();
                //   localStorage.setItem('startTime', startTime.toString());
                //   setShowTimer(true);
                //   setApiKey(chhange.doc.data().ChannelID)
                //   setLiveId(change.doc.data().ApiKey)
                //   setChannel(cange.doc.id)
                //   setVisible(false);
                // }

                const startTime = Date.now();
                localStorage.setItem('startTime', startTime.toString());
                localStorage.setItem('remaintime', 1);
                localStorage.setItem('flag', 'true');
                setShowTimer(true);
                setApiKey(change.doc.data().ApiKey)
                setChannel(change.doc.data().ChannelID)
                setLiveId(change.doc.id)
                setVisible(false);
                  

                
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
     if(!showTimer){
      setVisible(true);
    }
     handleShowCredData();
    },[])

    const handleGoback = () => {
     
        window.location.href = '/dashboard';
       
        
 
    }


  

    const startVideoLive = async () => {
      setLoading(true);


        if(!liveStreamUrl){

        
          
          const user = localStorage.getItem("credentials")
          const datas = JSON.parse(user);
          const res = liveStreamList.find(e => e.data.DeviceName.trim() === datas.DeviceName.trim())
          if(!res){
            setVisible(false);
            setLoading(false)
            Swal.fire({
              title: "Warning?",
              text: "Please contact administrator to set up your live video, thank you!",
              icon: "warning",
              confirmButtonColor: "#FAB1A0",
              confirmButtonText: "Okay",
            }).then(()=>{
              window.location.href = "/reports"
            })  
          return;
         }


         const docRef = doc(db, 'Livestream', res.id);
         updateDoc(docRef, {
           ended:false,
        }).then(async()=>{
            setLiveId(res.id);   
            await addDoc(collection(db, "Task"),{
              type:'Livestream',
              deviceName:credential.DeviceName.trim(),
              document_id: res.id,
              request:'Start',
            });
            console.log('Sending request to live video!');
          setLoading(true);
         })


     


        }else{
         
          setVisible(false);
 
        }

        


        
    
       
      }


      const getData = async () => {

        try {
        
          const user = localStorage.getItem("credentials")
          if(user){
            const datas = JSON.parse(user);
            setCredential(datas);
            
          const q = collection(db, "Livestream");
          onSnapshot(q, (snapshot) => {
         snapshot.docChanges().forEach((change) => {
          const {DeviceName,Youtube_Url, isliveNow, ended, ApiKey, ChannelID  } = change.doc.data()


          if(DeviceName == datas.DeviceName.trim() && isliveNow && !Youtube_Url && !ended){
            setMessage('Please wait for a minute, proccessing youtube url.');
            const storedRemaingTime =  localStorage.getItem('remaintime');
            if(storedRemaingTime !== null){
            if(parseInt(storedRemaingTime, 10) !== 0){
              setShowTimer(true);
            }
          }
            setApiKey(ApiKey)
            setChannel(ChannelID)
            setLiveId(change.doc.id)
            setVisible(false);
          }
     
    
          if(DeviceName == datas.DeviceName.trim() && !Youtube_Url && !isliveNow && !ended){
            setMessage('Please wait a minute to see the live?');
            setLoading(true);
            setShowTimer(false);
            return;
          }

      
          if(DeviceName == datas.DeviceName.trim() && isliveNow == true && Youtube_Url){
            setMessage('Do you want to continue watching the live?');
            setShowTimer(false);
            setLiveId(change.doc.id)
            setLiveStreamUrl(Youtube_Url)
            setVisible1(false)
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
                {isClient && <VideoFrame  youtubeUrl={liveStreamUrl} handleVideoEnd={handleVideoEnd} liveiD={liveiD} deviceName = {credential.DeviceName.trim()}/>  }
              
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
         
          <label  className='font-bold opacity-60' >
          {message}
          </label>
          <div className='grid gap-2'>
          <div className={`w-full  p-1 flex gap-2  justify-center items-center rounded-md bg-[#FAB1A0]    ${!loading ? "cursor-pointer hover:bg-[coral] transition-all ease-in": "cursor-not-allowed pointer-events-none"}`} d onClick={startVideoLive}>
          {loading && (
            <CircularProgress  style={{
            color:'white'
          }} size={15} />  
          )}
           <span className='text-white font-bold'>{loading ? 'Please wait..': 'Yes'}</span>
          </div>
          {loading && (
          <div className='w-full gap-1  p-2 flex justify-center items-center rounded-md opacity-75 bg-red-500 hover:opacity-100 border transition-all ease-in cursor-pointer' onClick={handleExitPAGE}>
           <span className='text-white font-bold text-sm'>CANCEL</span>
          </div>

          )}
          
          <div className='w-full  p-1 flex gap-2 justify-center items-center border-[#FAB1A0] rounded-md  border  hover:border-[coral] transition-all ease-in cursor-pointer' onClick={handleGoback}>
          <BiHome color='#FAB1A0' size={20}/>
           <span className='text-[#FAB1A0] font-bold hover:text-[coral] '>GO HOME</span>
          </div>
          </div>
        
          </div>
          
        </Box>
      </Modal>

      <Modal
        open={visible1}
        aria-labelledby="modal-modal-title"handleExitPAGE
        aria-describedby="modal-modal-description"
       
      >
        <Box sx={style} >
        <Image
        width={160}
        height={160}
        src="/Image/SadDog.png"
        contentFit="cover"
       
      />
          <div className='grid gap-1 justify-center '>
          <label className='font-bold text-sm text-center opacity-70 mb-2'>
         {errorMess}
          </label>
          <div className='grid gap-2'>
          <div className={`${reloadpage && "pointer-events-none cursor-not-allowed"} w-full  p-1 flex justify-center gap-2 items-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer`} onClick={handleRefetch}>
            {reloadpage ? (
              <>
               <CircularProgress  style={{
                color:'white'
              }} size={15} />  
                <span className='text-white font-bold'>Reloading...</span>
              </>
            ): (

           <span className='text-white font-bold'>RELOAD</span>
            )}
          </div>
          <div className='flex justify-center items-center gap-2'>
          <div className='w-full gap-1  p-1 flex justify-center items-center rounded-md opacity-75 bg-red-500 hover:opacity-100 border transition-all ease-in cursor-pointer' onClick={handleExitPAGE}>
           <span className='text-white font-bold text-sm'>CANCEL</span>
          </div>
          <span className='text-[coral]'>/</span>
          <div className='w-full  p-1 flex justify-center items-center  border  bg-blue-500 opacity-75 hover:opacity-100 rounded-md  transition-all ease-in cursor-pointer' onClick={handleGoback}>
          <BiHome color='white' size={20}/>
           </div>
          </div>
      
          </div>
        
          </div>
          
        </Box>
      </Modal>

      <Modal
        open={showTimer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <Box sx={style} >
        <Image
        width={150}
        height={150}
        src="/Image/output-onlinegiftools (4).gif"
        contentFit="cover"
       
      />

      <div>
   
      <p className='font-bold text-sm opacity-70'>Livestreaming is not ready yet; please wait until 3 minutes to see the livestream.</p>
     
    
        <div className='mt-5'>
          <p className='font-bold opacity-70'>Time remaining: <p className='font-bold text-red-500'>{formatTime(remainingTime)}</p></p>
        
        </div>
    
        <div className='w-full gap-1  mt-5 mb-1 p-1 flex justify-center items-center rounded-md opacity-75 bg-red-500 hover:opacity-100 border transition-all ease-in cursor-pointer' onClick={handleExitPAGE}>
           <span className='text-white font-bold text-sm'>CANCEL</span>
          </div>
          <div className='w-full gap-1 p-1 flex justify-center items-center  border  bg-[#FAB1A0] opacity-75 hover:opacity-100 rounded-md  transition-all ease-in cursor-pointer' onClick={handleGoback}>
          <span className='text-white font-bold text-sm'>GO HOME</span>
           </div>
      </div>
        </Box>
      </Modal>

      
    
    </div>
            
           
          
          
          
    
         
        </div>
      )
}

export default page