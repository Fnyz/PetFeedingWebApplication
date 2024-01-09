'use client'
import React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { collection, query,onSnapshot, where} from "firebase/firestore"; 
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { BiMenu} from "react-icons/bi";
import { BiHome, BiChat, BiBell} from "react-icons/bi";
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Badge from '@mui/material/Badge';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { BiSolidReport ,BiSolidReceipt  } from "react-icons/bi";

function SideBarAdmin() {
  const pathname = usePathname()
  const [messages, setAllMessages] = useState([]);
  const [notifications, setAllNotifications] = useState([]);
  const [reports, setReports] = useState([]);


  useEffect(()=>{
    const q = query(collection(db, "Messages"), where("hasDevice", "==", true), where("hasSeen", "==", false), where("adminSend", "==", true));
    onSnapshot(q, (querySnapshot) => {
   const dt = [];
   querySnapshot.forEach((doc) => {
       dt.push({data:doc.data(), id:doc.id});
   });
   setAllMessages(dt);
   });

 
},[])

useEffect(()=>{
  const q = query(collection(db, "Reports"), where("hasSeen", "==", false));
  onSnapshot(q, (querySnapshot) => {
 const dt = [];
 querySnapshot.forEach((doc) => {
     dt.push({data:doc.data(), id:doc.id});
 });
 setReports(dt);
 });


},[])

useEffect(()=>{
  const q = query(collection(db, "Notifications"), where("type", "==", "User"), where("hasSeen", "==", false));
  onSnapshot(q, (querySnapshot) => {
 const dt = [];
 querySnapshot.forEach((doc) => {
     dt.push({data:doc.data(), id:doc.id});
 });
 setAllNotifications(dt);
 });


},[])

 
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });

      const sideList = [
        {
          name: 'Home',
          link: '/home',
          icon: <BiHome size={24}/>,
        },
        {
          name: 'Notifications',
          link: '/notifications',
          icon: notifications.length > 0 ? <Badge badgeContent={notifications.length} color="secondary">
        <BiBell size={24}/>
          </Badge> : <BiBell size={24}/>
        },
        {
          name: 'Reports',
          link: '/usersReport',
          icon:  reports.length > 0 ? <Badge badgeContent={reports.length} color="secondary">
          <BiSolidReceipt  size={24}/>
          </Badge> : <BiSolidReport size={24}/>
        },
        {
          name: 'Chats',
          link: '/chats',
          icon:  messages.length > 0 ? <Badge badgeContent={messages.length} color="secondary">
          <BiChat size={24}/>
          </Badge> : <BiChat size={24}/>
        },
       
      ]
    
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };
    
      const list = (anchor) => (
        <Box
          sx={{ width:  250, }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <div className='flex ml-10 items-center gap-2  mt-6'>
          
        <Image
           src="/Image/animals.png"
          width={20}
          height={20}
          alt='profile'
          objectFit='cover'

        />
        <div className='flex flex-col relative'>
          <label className='text-[22px] text-[#FAB1A0]'>PURRFECT</label>
          <label className='text-[6px] absolute transform -rotate-90 -right-4 bottom-3'>PLATE</label>
        </div>
          </div>
          <List>
            {sideList.map((text, index) => (
              <ListItem key={index} >
                <Link href={text.link} className={`flex w-[100%] p-2 rounded-lg ${text.link === pathname ? 'none' : 'border'}`} style={{
                  backgroundColor: text.link === pathname ? '#FAB1A0' : 'white',
           
                }} onClick={()=>{
                  if("/notifications" === text.link){
              
                    setAllNotifications([]);
                    return;
                  }else if("/chats" === text.link){
                    setAllNotifications([]);
          
                    return;
                  }else{
                    return;
                  }
                }} >
                
                  <ListItemIcon className='flex justify-center items-center ml-2' style={{
                    color: text.link === pathname ? 'white' : 'gray', 
                  }}>
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText primary={text.name} style={{
                    color: text.link === pathname ? 'white' : 'gray', 
                  }}/>
                </Link>
              </ListItem>
            ))}
          </List>
         
        </Box>
      );
  return (
    <div>
   
        
          <Button onClick={toggleDrawer('left', true)}><BiMenu className='h-10 w-10 text-[#FAB1A0] cursor-pointer' /></Button>
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
    
   
    </div>
  )
}

export default SideBarAdmin