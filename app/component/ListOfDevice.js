import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import {BiSolidInfoCircle, BiEditAlt, BiSolidTrashAlt, BiSave, BiSolidFolderOpen, BiEdit, BiSolidLike, BiSolidKey} from "react-icons/bi";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {collection, query, where, onSnapshot , orderBy, serverTimestamp, getDoc} from "firebase/firestore";
import { db } from '../firebase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BiX } from "react-icons/bi";

import { Avatar } from '@mui/material';

import { doc, updateDoc} from "firebase/firestore";
import { ScrollArea, ScrollBar  } from "@/components/ui/scroll-area"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"












const options = [
  {
  val:'VIEW',
  icon: <BiSolidInfoCircle size={25} color='green' opacity={0.6}/>,
  color:'text-green-700'
 },
 {
  val:'DELETE',
  icon: <BiSolidTrashAlt size={25} color='red' opacity={0.6}/>,
  color:'text-red-700'
 }

];




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:2,
  zIndex:0,
  p: 4,
};


const ITEM_HEIGHT = 48;





function ListOfDevice({setPositions}) {

  const [listOfData, setUserDataList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = React.useState('');
  const [lasname, setLname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [device, setDevice] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [petId, setPetId] = React.useState('');
  const [needUpdate, setNeedUpdate] = React.useState(false);
  const [position, setPosition] = React.useState("")
  const [suggestDelete, setDelete] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [lives, setLiveList] = React.useState([]);
  const [apiky, setApiKy] = React.useState('');
  const [channel, setChannel] = React.useState('');





const HandleDelete = async () => {

  try {
    await deleteDoc(doc(db, "List_of_Pets", petId));
    alert('Pet is deleted successfully');
  } catch (error) {
    console.log('Something went wrong!');
    
  }
}

const suggestDeleting = () => {
  setDelete((prev) => !prev);
}






const [opens, setOpens] = React.useState(false);


  const handleClose2 = () => {
    setOpens(false);
  };

  const handleOpen2 = () => {
    setOpens(true);
  };





  

  const [choose, setChoose] = React.useState('');


  const liveStreamDetails = () => {

    const q = query(collection(db, "Livestream"));
    const data = [];  
    onSnapshot(q, (querySnapshot) => {
   querySnapshot.forEach((docing) => {
      data.push({dt: docing.data(), id: docing.id});
   });
    setLiveList(data)
   });
  }

  const getLiveStreamData = async (device) => {


   const res = lives.find(l => l.dt.DeviceName === device);
   const a = doc(db, "Livestream", res.id);
      await updateDoc(a, {
       ApiKey:apiky,
       ChannelID:channel
      }).then(()=>{
        Alert('Sumitted successfully!');
      });


  }

  useEffect(()=>{
    liveStreamDetails();
    setPosition("WITHDEVICE")
  
  },[])


  useEffect(()=> {
   

    if(search.length === 0){
      
      const q = query(collection(db, "users"), where("isAdmin", "==", false), where("hasDevice", "==", true));
      const data = [];  
      onSnapshot(q, (querySnapshot) => {
     querySnapshot.forEach((docing) => {
        data.push({dt: docing.data(), id: docing.id});

     });
     
      if(position === "WITHDEVICE" ){
        setPositions("WITHDEVICE")
        setUserDataList(data);
      }else{
        setPositions("WITHOUTDEVICE");
        const q = query(collection(db, "users"), where("isAdmin", "==", false),where("hasDevice", "==", false));
            const data = [];  
            onSnapshot(q, (querySnapshot) => {
           querySnapshot.forEach((docing) => {
              data.push({dt: docing.data(), id: docing.id});
      
           });
            setUserDataList(data);
        
         });
      }
     
     
   
   
    
   });

   return;

    };



    
    const userData = [...listOfData];
    const result = userData.filter((ds) => {
      if(ds.dt.username.trim().toLowerCase().includes(search.toLowerCase().trim())){
        return ds;
      }
    })

    

    setUserDataList(result);
   

    
  },[search, position, listOfData])



    const openTime = (type) => {
      if(type ==='VIEW'){
        setVisible(true);
     
      const res = listOfData.find(d => d.id === petId);
      if(!res) return;

      setName(res.dt.firstname);
      setLname(res.dt.lastname);
      setUsername(res.dt.username);
      setEmail(res.dt.email);
      setDevice(res.dt.Devicename)
      setChoose(res.dt.image);
      

      return;

    

      }

      const res = listOfData.find(d => d.id === petId);
      if(!res) return;   
      suggestDeleting();
    }


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClose = () => {
      setAnchorEl(null);
    };


    
  
 

  const handleUpdate = async () => {
    const docUpdate = {
      Petname:petname,
      Weight:weight,
      Gender:gender,
      GoalWeight:goalWeight,
      Age:age,
      image:choose,
      Updated_at: serverTimestamp(),
    }
    try {
      const collects = doc(db, "List_of_Pets", petId);
      await updateDoc(collects, docUpdate);
      alert('Data updated successfully');
      setNeedUpdate(false);      
   
    } catch (error) {
      console.log(error)
    }
  }




    
    
 

  return (
    <ScrollArea className='z-50 border w-4/5 h-[500px] max-md:w-full max-lg:w-full rounded-md overflow-hidden pt-5 shadow-sm'>
       <ScrollBar orientation="horizontal" />
      <div className='flex justify-between items-center  gap-5 px-10'>
      <div className='flex justify-center items-center  gap-5'>
      <Image
           src="/Image/team.png"
          width={40}
          height={40}
          alt='profile'
          objectFit='cover'

        />
      <label style={{
        fontSize:30,
        fontWeight:'bold',
      
        color:'#FAB1A0'
       }}>{position ==='WITHDEVICE'? "List of Users with Device" : "List of Users without Device"}
       </label>
      </div>
       <div className='flex gap-2 justify-center items-center'>

      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">FILTER BY USER'S</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="WITHDEVICE">USER WITH DEVICE</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="WITHOUTDEVICE">USER WITHOUT DEVICE</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
       <Paper
      component="form"
      value={search}
      onChange={(e)=> setSearch(e.target.value)}
      className='border '
      sx={{ p: ' 4px', display: 'flex', alignItems: 'center', width: 400, height:40, boxShadow:'none' }}
    >
    
      <InputBase
       
        sx={{ ml: 1, flex: 1 }}
        placeholder="SEARCH USER HERE ..."
        inputProps={{ 'aria-label': 'search google maps' }}
    
      
     
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>

   
    </Paper>
    </div>

      </div>
  

       
       <div class="flex mt-5">
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">IMAGE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">USERNAME</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">EMAIL</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Device</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">OPTIONS</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] ">STATUS</div>
      </div>

      <div className=' h-[350px] overflow-auto  p-2 '>
     
        {listOfData && listOfData.map((item, index) => {
          return (

            <div class="flex " key={index}>

       
            <div class="w-1/4 h-20    flex justify-center items-center">
             <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
             <Image
                src={item.dt.image || '/Image/anyaCuttie.jpg'}
               fill
               alt='profile'
               objectFit='cover'
     
             />
             </div>
            </div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center font-bold opacity-80 text-sm">{item.dt.username}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center text-[12px]">{item.dt.email}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center text-sm text-red-500 font-bold text-[12px]">{item.dt.Devicename ? item.dt.Devicename : "NO DEVICE"}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">

            <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={(e)=> {
          setAnchorEl(e.currentTarget)
          setPetId(item.id)
        }}
        style={{
          color:'red',
          opacity:0.5
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
  
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '15ch',
            
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.val}  onClick={handleClose}>
            <div className='flex justify-between items-center w-[100%]' onClick={()=> openTime(option.val)}>
              <label className = {option.color}> {option.val} </label>
              {option.icon}
            </div>
          </MenuItem>
        ))}

        
      </Menu>
    </div>
            </div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center text-sm  font-bold">
              <span className={`text-[10px] p-2 ${item.dt.isActive ? "bg-green-500":"bg-red-500"} opacity-80 text-white rounded-sm w-[100px]`}>{item.dt.isActive ? 'ACTIVE' : 'OFFLINE'}</span>
            </div>
            <Modal
        open={opens}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between '>
          <div>
          <Typography variant="h5" className='font-bold'>YOUTUBE API & KEY</Typography>
          
        <Typography variant="caption" className=' opacity-75'>Fill out the inputs below.</Typography>
          </div>
          <BiX size={30} onClick={()=> handleClose2(false)} color='red' className='cursor-pointer'/>
          
        </div>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="petname" className="text-right">
              API KEY
            </Label>
            <Input id="petname" placeholder='API KEY HERE'  className="col-span-3" value={apiky} onChange={(e)=> setApiKy(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              ID
            </Label>
            <Input id="age" placeholder="CHANNEL ID HERE"  className="col-span-3"  value={channel} onChange={(e)=> setChannel(e.target.value)}   />
          </div>

        

          <div className="grid grid-cols items-center gap-4">
           <div className='flex justify-center items-center border p-2 rounded-md font-bold text-white bg-[#FAB1A0] hover:bg-[coral] cursor-pointer gap-2' onClick={()=> getLiveStreamData(item.dt.Devicename)}>
            <BiSave size={20} color='white'/>
            <span>
              SUBMIT
            </span>
           </div>
          </div>
       
          
         
          
        </div>
        </Box>
      </Modal>
           </div>
           
     
          )
        })}




       <Modal
        open={visible}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between '>
          <div>
          <Typography variant="h5" className='font-bold'>VIEW USER'S PROFILE</Typography>
          
        <Typography variant="caption" className=' opacity-75'>See more details about this profile.</Typography>
          </div>
          <BiX size={30} onClick={()=> setVisible(false)} color='red' className='cursor-pointer'/>
      
        </div>

        <div className=' flex justify-center items-center mt-2'>
    <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={choose}
  className='object-cover'
  sx={{ width: 100, height: 100,  }}
/>      
        </div>
    </div>
    
   


  


        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="petname" className="text-right">
              Name
            </Label>
            <Input id="petname" placeholder='Kussy' value={name} className="col-span-3" disabled={!needUpdate} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Lastname
            </Label>
            <Input id="age" placeholder="15" value={lasname} className="col-span-3" disabled={!needUpdate}  />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Username
            </Label>
            <Input id="age" placeholder="15" value={username} className="col-span-3" disabled={!needUpdate}  />
          </div>
        
          
        
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Email
            </Label>
            <Input id="age" placeholder="15" value={email} className="col-span-3" disabled={!needUpdate} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Device
            </Label>
            <Input id="age" placeholder="15" className="col-span-3 " value={device} disabled={!needUpdate}  />
          </div>

          <div className="grid grid-cols items-center gap-4">
           <div className='flex justify-center items-center border p-2 rounded-md font-bold text-white bg-[#FAB1A0] hover:bg-[coral] cursor-pointer gap-2' onClick={handleOpen2}>
            <BiSolidKey size={20} color='white'/>
            <span>
              ADD YOUTUBE KEY
            </span>
           </div>
          </div>
       
          
         
          
        </div>
        </Box>
      </Modal>


      <Modal
        open={suggestDelete}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h6" gutterBottom className='text-center'>
        Do you want to delete this pet?
      </Typography>
      <div className='flex gap-2 mt-4'>
         <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={HandleDelete}>
          <BiSolidLike size={20} color='white'/>
           <span className='text-white font-bold'>YES, PLEASE</span>
          </div>
          <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={suggestDeleting}>
          <BiSolidTrashAlt size={20} color='white' />
           <span className='text-white font-bold'>CANCEL</span>
          </div>
      </div>
        </Box>
      </Modal>


   

    

   


    
      
       </div>
    
       
    </ScrollArea>
  )
}

export default ListOfDevice