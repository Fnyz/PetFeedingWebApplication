import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState , useEffect} from 'react';
import {collection, query, where, onSnapshot , orderBy, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { db } from '../firebase';
import Image from 'next/image';
import moment from 'moment';
import { MdErrorOutline } from "react-icons/md";
import { BiX } from "react-icons/bi";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:2,
  boxShadow: 24,
  p: 4,
};


function Notifications() {

    const [notif, setNotifications] = useState([]);
    const [seenNotifications, setSeenNotifications] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


 
    useEffect(() => {

      const user = localStorage.getItem("credentials");
      const datas = JSON.parse(user);
    
      if (datas) {
        const q = query(
          collection(db, "notifications"),
          where("deviceName", "==", datas.DeviceName.trim()),
          where("type", "==", "User"),
          where("hasSeen", "==", false),
          orderBy("createdAt", "desc")
        );
      
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newNotificationsData = new Map();
      
          querySnapshot.forEach((doc) => {
            const petName = doc.data().pet_name;
            const createdAt = doc.data()?.createdAt?.toDate();
            const hasSeen = doc.data().hasSeen;
      
            if (!petName) {
              const usersQuery = query(
                collection(db, "users"),
                where("username", "==", "Admin")
              );
      
              onSnapshot(usersQuery, (usersQuerySnapshot) => {
                usersQuerySnapshot.forEach((userDoc) => {
                  newNotificationsData.set(doc.id, {
                    name: userDoc.data().username,
                    weight: null,
                    deviceName:datas.DeviceName.trim(),
                    message: doc.data().Messages,
                    image: userDoc.data().image,
                    hasSeen,
                    id: doc.id,
                    createdAt,
                  });
                });
      
                // Update state
                setNotifications([...newNotificationsData.values()]);
                localStorage.setItem("notifications", JSON.stringify([...newNotificationsData.values()]));
              });
            }
      
            const listOfPetsQuery = query(
              collection(db, "List_of_Pets"),
              where("DeviceName", "==", datas.DeviceName.trim()),
              where("Petname", "==", petName || null)
            );
      
            onSnapshot(listOfPetsQuery, (petsQuerySnapshot) => {
              petsQuerySnapshot.forEach((petDoc) => {
                newNotificationsData.set(doc.id, {
                  name: petDoc.data().Petname,
                  weight: petDoc.data().Weight,
                  deviceName:datas.DeviceName.trim(),
                  message: doc.data().Messages,
                  image: petDoc.data().image,
                  hasSeen,
                  id: doc.id,
                  createdAt,
                });
              });
              
              // Update state
              setNotifications([...newNotificationsData.values()]);
              localStorage.setItem("notifications", JSON.stringify([...newNotificationsData.values()]));
            });
          });
        });
      
        return unsubscribe;
      }
    
    }, []);


    const handleUpdateSeen = () => {
      handleOpen();
      if(notif.length > 0) {
        notif.map(async(d)=> {
          const updateAlldocs = doc(db, "notifications", d.id);
          await updateDoc(updateAlldocs, {
            hasSeen: true
          }).then(()=>{
            setNotifications([])
          });
        })
        return;
      }
    }


    useEffect(() => {
        const user = localStorage.getItem("credentials");
        const datas = JSON.parse(user);
      
        if (datas) {
          const q = query(
            collection(db, "notifications"),
            where("deviceName", "==", datas.DeviceName.trim()),
            where("type", "==", "User"),
            where("hasSeen", "==", true),
            orderBy("createdAt", "desc")
          );
          const fetchData = () => {
            const notificationsData1 = [];
          
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
             
                const petName = doc.data().pet_name;
                const createdAt = doc.data().createdAt.toDate(); 
                const hasSeen = doc.data().hasSeen; 
      
              
                if (!petName) {
                  const usersQuery = query(
                    collection(db, "users"),
                    where("username", "==", "Admin")
                  );
          
                  const userUnsubscribe = onSnapshot(usersQuery, (usersQuerySnapshot) => {
                    usersQuerySnapshot.forEach((userDoc) => {
                      notificationsData1.push({
                        name: userDoc.data().username,
                        weight: null,
                        message: doc.data().Messages,
                        hasSeen,
                        deviceName: datas.DeviceName.trim(),
                        id:doc.id,
                        createdAt
                      });
                      notificationsData1.sort((a, b) => b.createdAt - a.createdAt);
                      setSeenNotifications([...notificationsData1]); // Update state with new data
          
                    });
                  });
                }
         
                const listOfPetsQuery = query(
                  collection(db, "List_of_Pets"),
                  where("DeviceName", "==", datas.DeviceName.trim()),
                  where("Petname", "==", petName || null)
                );
             
                const petUnsubscribe = onSnapshot(listOfPetsQuery, (petsQuerySnapshot) => {
                  petsQuerySnapshot.forEach((petDoc) => {
                    notificationsData1.push({
                      name: petDoc.data().Petname,
                      weight: petDoc.data().Weight,
                      message: doc.data().Messages, 
                      hasSeen,
                      deviceName: datas.DeviceName.trim(),
                      id:doc.id,
                      createdAt
                    });
                    notificationsData1.sort((a, b) => b.createdAt - a.createdAt);
                    setSeenNotifications([...notificationsData1]); // Update state with new data
                 
             
                  });
                });
              });
            });
          
            return unsubscribe;
          };

          fetchData();
          
        }
      }, [seenNotifications]);

  

      
      
   
  return (
    <div className=' border w-1/5 rounded-md p-2 shadow-md z-50 max-xl:w-full'>
        <di className='flex justify-between p-2'>
            <h1 className='text-[12px] font-bold opacity-[0.7] '>!Notifications</h1>
            
            <h1 className='text-[12px] font-bold opacity-[0.7] cursor-pointer hover:opacity-100' onClick={handleUpdateSeen}>See all</h1>
        </di>
        <div>
        <div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='flex items-center justify-between'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            List of notifications
          </Typography>
          <BiX size={20} color='red' onClick={()=>{
              setNotifications([]);
              localStorage.removeItem("notifications");
              handleClose();
          }} className=' cursor-pointer opacity-70 transition-all ease-in hover:opacity-100'/>
          </div>
      
          <span className=' opacity-60 text-sm'>
            See the list of read notifications.
          </span>

          <ScrollArea className=' p-1 rounded-sm w-full no-scrollbar h-[450px] mt-2'>
                {!seenNotifications.length ? (
                      <div className='w-full h-[430px] flex flex-col justify-center items-center'>
                      <Image
                 width={160}
                 height={160}   
                 src="/Image/SadDog.png"
                 contentFit="cover"
                
               />

                    <label className='text-md font-bold opacity-60'>No notifications found.</label>
                     
                   </div>)
                :  seenNotifications.map((item, i) => {
                    return (
                        <div key={i} className={`  w-full border mb-2 h-[100px] border-l-4  rounded-sm shadow-md px-2 pb-1`} 
                        >
                            <div className='flex items-center justify-between p-1 gap-1 mt-2 ' >
                              <div className='flex items-center gap-1 '>
                              <MdErrorOutline color='green' size={15} className='opacity-60' />
                                <h1 className='text-[13px] font-bold  capitalize opacity-60'>{item.message.toLowerCase().includes("water") ? item.deviceName : item?.name?.toUpperCase()} * </h1>
                                <span className='text-[10px] opacity-60 text-red-500 font-bold'> {moment(item.createdAt).calendar()}</span>
                              </div>
                            
                                <BiX size={20} color='red' onClick={async()=>{
                                    deleteDoc(doc(db, "notifications",item.id));
                                }} className=' cursor-pointer opacity-70 transition-all ease-in hover:opacity-100'/>
                            </div>
                            
                            <div className=' flex flex-col justify-center  px-1 gap-2 '>
                            {item.weight && (
                                <p className='text-[12px] opacity-60   font-bold'> {!item.weight === 0 }  Weight: {parseFloat(item?.weight).toFixed(2)} kg</p>
                            )}
                                <p className='text-[12px] leading-none   opacity-60 '>
                                   {item.message}.
                                </p>
                              
                           
                            </div>
                           
                        </div>
                    )
                })}
               

                </ScrollArea>

        </Box>
      </Modal>
    </div>
                <ScrollArea className='border p-1 rounded-sm w-full no-scrollbar h-[450px]'>
                {!notif.length ? (
                      <div className='w-full h-[430px] flex flex-col justify-center items-center'>
                      <Image
                 width={160}
                 height={160}   
                 src="/Image/sadface.gif"
                 className='opacity-70'
                 contentFit="cover"
                
               />

                    <label className='text-md font-bold opacity-60'>No notifications found.</label>
                     
                   </div>)
                :  notif.map((item, i) => {
                    return (
                        <div key={i} className={` ${!item.hasSeen && !item.weight ? ' pointer-events-none' : 'pointer-events-auto'} w-full border mb-2 h-[100px] border-l-4  border-[coral] rounded-sm shadow-md px-2 pb-1`} onTouchStart={()=> item.name === "Admin" && setIsHovered(true)} onTouchEnd={()=> item.name === "Admin" && setIsHovered(true)}
                         onMouseEnter={()=> item.name === "Admin" && item.hasSeen === true && setIsHovered(true)} onMouseLeave={()=> item.name === "Admin" && setIsHovered(false)} >
                            <div className='flex items-center justify-between p-1 gap-1 mt-2 ' >
                              <div className='flex items-center gap-1 '>
                              <MdErrorOutline color='green' size={15} className='opacity-60' />
                                <h1 className={`${item.message.toLowerCase().includes("water")? "text-[10px]": "text-[13px]"}  font-bold  capitalize opacity-60`}>{item.message.toLowerCase().includes("water") ? item.deviceName : item?.name?.toUpperCase()} * </h1>
                                <span className='text-[10px] opacity-60 text-red-500 font-bold'> {moment(item.createdAt).calendar()}</span>
                              </div>
                            
                                <BiX size={20} color='red' onClick={async()=>{
                                    deleteDoc(doc(db, "notifications",item.id));
                                }} className=' cursor-pointer opacity-70 transition-all ease-in hover:opacity-100'/>
                            </div>
                            
                            <div className=' flex flex-col justify-center  px-1 gap-2 '>
                            {item.weight && (
                                <p className='text-[12px] opacity-60   font-bold'> {!item.weight === 0 }  Weight: {parseFloat(item?.weight).toFixed(2)} kg</p>
                            )}
                                <p className='text-[12px] leading-none   opacity-60 '>
                                   {item.message}.
                                </p>
                              
                           
                            </div>
                            {isHovered && item.hasSeen && !item.weight && (
                                <div className='flex justify-end'>
                                <div className=' p-1 text-sm w-[100px] text-center opacity-60 rounded-sm font-bold bg-[#FAB1A0] text-white cursor-pointer hover:opacity-100 transition-all ease-in' onClick={()=> window.location.href ="/reports"}>
                                    <span>View now</span>
                                </div>
                                </div>
                               
                             )}
                        </div>
                    )
                })}
               

                </ScrollArea>
        </div>
    </div>
  )
}

export default Notifications