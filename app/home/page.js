'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiSolidHand, BiLogOutCircle} from "react-icons/bi";
import Notifications from '@/app/component/Notifications';
import SideBarAdmin from '../component/SideBarAdmin';
import { ProfileAccount } from '../component/Profile';
import { doc, onSnapshot} from "firebase/firestore";
import { db, auth } from '../firebase';
import { signOut} from 'firebase/auth'
import ListOfDevice from '../component/ListOfDevice';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import TotalUser from '../component/TotalUser';
import AdminNotifications from '../component/adminNotifications';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:10,
  boxShadow: 24,
  p: 4,
};



function page() {


    const [profile, setProfileData] = useState({});
    const [position, setPosition1] = useState("WITHDEVICE");
    const [isclient, setIsclient] = useState(false);
    const [logout, setLogout] = useState(false);
    useEffect(()=>{
      setIsclient(true);
    },[])
  




 

  

  
    useEffect(()=>{
    
        const user = localStorage.getItem("credentials");
        if(!user){
          window.location.href = "/login"
          return;
      }
        
     
          const d = JSON.parse(user);
          if(d.DeviceName){
           window.location.href = "/dashboard"
           return;
          }
            const datas = JSON.parse(user);
            onSnapshot(doc(db, "users", datas.userId), (doc) => {
                setProfileData(doc.data())
                
            });
     
      },[])
 

   

      if(!isclient){
        return;
      }


    
  return (


   
    <div className="h-screen relative ">
        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
            objectFit='cover'
            className='max-md:hidden block'
        />
        <div className='absolute left-0 right-0  px-5 pt-5 max-xl:px-3'>
            <div className='flex justify-between '>
            <SideBarAdmin />
        
            <div className='flex  items-center gap-2 mt-2 '>
     
     <div className='w-[60px] h-[60px] p-[2px] rounded-full border-[#FAB1A0] border  justify-center items-center'>
     
     <div className="w-[52px] h-[52px] rounded-full overflow-hidden relative ">
        <Image
           src={profile?.image || '/Image/anyaCuttie.jpg'}
          fill
          alt='profile'
          

        />
      </div>
     </div>
        <div>
                <span className='text-[12px] opacity-[0.8]'>Welcome user</span>
                <div className='flex items-center gap-1'>
                    <span className='font-bold text-lg'>{profile.username}</span>
                    <BiSolidHand className='text-[#FAB1A0]'/>
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    gap:5,
                    alignItems:'center',
                    justifyContent: 'center',
                    marginLeft:10,
                }}>
                <ProfileAccount profile={profile} />
                /
                <BiLogOutCircle size={20} color='red' opacity={0.6} className=' cursor-pointer' onClick={()=> setLogout(true)}/>
               
           

                </div>
               
        </div>
            </div>
           
        <div className='flex gap-5 w-[100%]   h-full max-xl:p-2 '>
            <div className='w-1/6   2xl:flex justify-center items-center relative md:hidden  '>
            <Image
            src="/Image/undraw_welcoming_re_x0qo.svg"
            layout='fill'
            quality={100}
            alt='back image'
        />
                
            </div>
            <div className=' w-[100%]'>
            <TotalUser position={position} />
            <div className='flex gap-5 mt-5    max-xl:flex-col'>
            <ListOfDevice setPositions={setPosition1}/>

            <AdminNotifications />
            </div>

            

            </div>
            
        </div>
       
        </div>

        <Modal
        open={logout}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <Box sx={style} >
        <div className='flex justify-center items-center'>
        <Image
        width={140}
        height={140}
        src="/Image/output-onlinegiftools (8).gif"
        contentFit="cover"
       
      />

      <div>
        <div className='flex items-center gap-1'>
        <span className='font-bold text-lg'>Warning</span>
        <Image
        width={25}
        height={25}
        src="/Image/output-onlinegiftools (10).gif"
        contentFit="cover"
       
      />

        </div>
        <p className='text-sm opacity-75'>Do you want to log out?</p>
      </div>
        </div>
        <div className='flex justify-center items-center gap-2 font-bold'>
          <div className='w-full p-2  text-center rounded-l-lg bg-[#FAB1A0] opacity-75 hover:opacity-100 cursor-pointer transition-all ease-in' onClick={()=>{
             localStorage.clear();
             window.location.href = "/login"
             event.preventDefault();
             signOut(auth).then(() => {
               const a = doc(db, "users", userId);
               updateDoc(a, {
               isActive:false
              }).then(()=> {
           
           })
               
             }).catch((error) => {
               console.log(error);
             });
          }}>
            <span className='text-white font-bold'>YES</span>
          </div>
          <div className='w-full p-2 border text-center rounded-r-lg font-bold border-[#FAB1A0] hover:opacity-100 opacity-60 cursor-pointer' onClick={()=> setLogout(false)}>
            <span className='text-[#FAB1A0]'>CANCEL</span>
          </div>
        </div>
       
        </Box>
      </Modal>
      

     
    </div>
  )
}

export default page