import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import {BiSolidInfoCircle, BiSolidEditAlt, BiSolidTrashAlt} from "react-icons/bi";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import { db } from '../firebase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';



const options = [
  {
  val:'VIEW',
  icon: <BiSolidInfoCircle size={25} color='green' opacity={0.6}/>,
  color:'text-green-700'
 },
 {
  val:'EDIT',
  icon: <BiSolidEditAlt size={25} color='blue' opacity={0.6}/>,
  color:'text-blue-700'
 },
 {
  val:'DELETE',
  icon: <BiSolidTrashAlt size={25} color='red' opacity={0.6}/>,
  color:'text-red-700'
 }

];

const ITEM_HEIGHT = 48;



function ListOfPet() {

  const [listOfPet, setListOfPet] = useState([]);




  
  useEffect(()=>{

    const user = localStorage.getItem("credentials");

    
    if(user){
        const datas = JSON.parse(user);
        
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas?.DeviceName?.trim()), orderBy("Created_at", "desc"));
        const data = [];
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((docs) => {
            data.push({dt:docs.data(), id: docs.id});
            setListOfPet(data);
        });
        
        })

    }



    },[])


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


    
    
 

  return (
    <div className='z-50 border w-4/5 h-[500px] rounded-md overflow-hidden pt-5 shadow-sm'>
      <div className='flex justify-between items-center  gap-5 px-10'>
      <div className='flex justify-center items-center  gap-5'>
      <Image
           src="/Image/animals.png"
          width={40}
          height={40}
          alt='profile'
          objectFit='cover'

        />
      <label style={{
        fontSize:30,
        fontWeight:'bold',
      
        color:'#FAB1A0'
       }}>List of Pets
       </label>
      </div>
   
       <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
    
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search pet here . . ."
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>

   
    </Paper>
      </div>
  

       
       <div class="flex mt-5">
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">IMAGE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">PETNAME</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">WEIGHT</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">AGE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">GENDER</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] ">OPTIONS</div>
      </div>

      <div className=' h-[350px] overflow-auto'>

        {listOfPet && listOfPet.map((item, index) => {
          return (
            <div class="flex " key={index}>

       
            <div class="w-1/4 h-20    flex justify-center items-center">
             <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
             <Image
                src={item.dt.image}
               fill
               alt='profile'
               objectFit='cover'
     
             />
             </div>
            </div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.Petname}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.Weight}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.Age}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center capitalize">{item.dt.Gender}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">

            <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
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
            <div className='flex justify-between items-center w-[100%]'>
              <label className = {option.color}> {option.val}</label>
              {option.icon}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
            </div>
           </div>
     
          )
        })}

    

   


    
        
       </div>
    
       
    </div>
  )
}

export default ListOfPet