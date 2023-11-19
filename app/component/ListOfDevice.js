import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import {BiSolidInfoCircle, BiEditAlt, BiSolidTrashAlt, BiSave, BiSolidFolderOpen, BiEdit, BiSolidLike} from "react-icons/bi";
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
import { petsData } from '../animeData';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaBalanceScale } from "react-icons/fa";
import { Avatar } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { doc, updateDoc} from "firebase/firestore";
import { ScrollArea, ScrollBar  } from "@/components/ui/scroll-area"












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

function generateFakeWeight(min, max) {
  const fakeWeight = (Math.random() * (max - min) + min).toFixed(2); // Generates a random weight between min and max with 2 decimal places
  return `${fakeWeight} kg`;
}





function ListOfDevice() {

  const [listOfData, setUserDataList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dog, setDog] = React.useState([]);
  const [cat, setCat] = React.useState([]);
  const [name, setName] = React.useState('');
  const [lasname, setLname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [device, setDevice] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [age, setAge] = React.useState('');
  const [petId, setPetId] = React.useState('');
  const [needUpdate, setNeedUpdate] = React.useState(false);
  const [gendered, setGenders] = React.useState([{
   gender:'Male',
   val: 'male',
  },
  {
    gender:'Female',
    val: 'female',
   }

]);
const [petname, setPetname] = React.useState('');
const [weight, setWeight] = React.useState('');
const [goalWeight, setGoalWeight] = React.useState('');
const [suggestDelete, setDelete] = React.useState(false);
const [search, setSearch] = React.useState('');

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




const handleNeedupdate = () => {
  setNeedUpdate((prev) => !prev);
}


const [opens, setOpens] = React.useState(false);

  const handleClickOpen = () => {
    setOpens(true);
  };

  const handleClose2 = () => {
    setOpens(false);
  };




  

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const [choose, setChoose] = React.useState('');


  useEffect(()=> {


      const q = query(collection(db, "users"), where("isAdmin", "==", false), where("hasDevice", "==", true));
      const data = [];  
      onSnapshot(q, (querySnapshot) => {
     querySnapshot.forEach((docing) => {
        data.push({dt: docing.data(), id: docing.id});

     });
    setUserDataList(data);
    
   });



  
   
     
  
    // if(search.length === 0){
    //   const user = localStorage.getItem("credentials");
    //   const datas = JSON.parse(user);
    //   if(user){
        
    //     return;
    //   }

    
     
    // };


    // const pets = [...listOfPet];
    // const result = pets.filter((ds) => {
    //   if(ds.dt.Petname.trim().toLowerCase().includes(search.toLowerCase().trim())){
    //     return ds;
    //   }
    // })

    // setListOfPet(result);
    

    
  },[])







  


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


    
    
  React.useEffect(()=>{
    const dog = petsData.filter(item => item.category === 'Dog');
    const cat = petsData.filter(item => item.category === 'Cat');

    setDog(dog);
    setCat(cat);
    setChoose('/Image/anyaCuttie.jpg');
  },[])


  const handleFakeWeight = () => {
    setTimeout(() => {
      const fakeWeight = generateFakeWeight(15, 25);
      setWeight(fakeWeight)
    }, 3000);

  }


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
      value={search}
      onChange={(e)=> setSearch(e.target.value)}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
    
      <InputBase
       
        sx={{ ml: 1, flex: 1 }}
        placeholder="SEARCH PET HERE ..."
        inputProps={{ 'aria-label': 'search google maps' }}
    
      
     
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>

   
    </Paper>
      </div>
  

       
       <div class="flex mt-5">
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">IMAGE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">USERNAME</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">EMAIL</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Device</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] ">OPTIONS</div>
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
            <div class="w-1/4 h-20 text-center  flex justify-center items-center font-bold opacity-80">{item.dt.username}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.email}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.Devicename}</div>
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
          <Typography variant="h5" className='font-bold'>VIEW PET PROFILE</Typography>
          
        <Typography variant="caption" className=' opacity-75'>See more details about this pet.</Typography>
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
    {needUpdate &&  <div className='justify-center items-center border gap-1 flex mx-24 p-2 mt-2 rounded-md  bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer' onClick={handleClickOpen}>
        <BiEditAlt  size={15} color='white' />
          <label className='text-[10px] text-white font-bold cursor-pointer'>CHANGE PET IMAGE</label>
        </div>}
   
    <Modal
        open={opens}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between '>
          <div>
          <Typography variant="h5" className='font-bold'>CHOOSE PET IMAGE</Typography>
          
        <Typography variant="caption" className=' opacity-75'>Feel free to choose it your favorite image here.</Typography>
          </div>
          <BiX size={30} onClick={()=> handleClose2(false)} color='red' className='cursor-pointer'/>
      
        </div>
        <div className="grid gap-4 py-4">
          <label className='font-bold text-blue-500  opacity-50'>Dog's</label>
          <ImageList  cols={3} rowHeight={110} >
      {dog.map((item) => (
        <ImageListItem key={item.image} >
          <div className={`${item.image === choose && 'border  border-[#FAB1A0]'} hover:border hover:border-[#FAB1A0] cursor-pointer w-[100px] h-[100px]  overflow-hidden rounded-md relative `} onClick={()=>{
            setChoose(item.image)
          }}>
          <Image 
          src={item.image}
          fill
          objectFit='cover'
          className='p-2 rounded-md border '
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>


    <label className='font-bold text-pink-500 opacity-50'>
  
       Cat's</label>
          <ImageList  cols={3} rowHeight={110}>
      {cat.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && 'border  border-[#FAB1A0]'} hover:border hover:border-[#FAB1A0] cursor-pointer w-[100px] h-[100px]  overflow-hidden rounded-md relative `} onClick={()=> {
            setChoose(item.image)
          }}>
          <Image 
          src={item.image}
          fill
          objectFit='contain'
          className='p-2 border rounded-md'
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>

     <div className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer'>
     <BiSolidFolderOpen size={22} color='white'/>
      <label className='text-white font-bold cursor-pointer'>UPLOAD IMAGE</label>
   
     </div>

     <div onClick={()=> setOpens(false)} className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  border-[#FAB1A0] hover:shadow-md transition-all ease-in cursor-pointer w-full'>
     <BiSave size={22} color='#FAB1A0'/>
<label className='text-[#FAB1A0] font-bold cursor-pointer'>SAVE CHANGES</label>

</div>
         
         
        </div>
        </Box>
      </Modal>

  


        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="petname" className="text-right">
              Name
            </Label>
            <Input id="petname" placeholder='Kussy' value={petname} className="col-span-3" disabled={!needUpdate} onChange={(e) => setPetname(e.target.value)}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Lastname
            </Label>
            <Input id="age" placeholder="15" value={age} className="col-span-3" disabled={!needUpdate} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Username
            </Label>
            <Input id="age" placeholder="15" value={age} className="col-span-3" disabled={!needUpdate} onChange={(e) => setAge(e.target.value)} />
          </div>
        
          
        
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Email
            </Label>
            <Input id="age" placeholder="15" value={goalWeight} className="col-span-3" disabled={!needUpdate} onChange={(e) => setGoalWeight(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Device
            </Label>
            <Input id="age" placeholder="15" className="col-span-3 " value={weight} disabled={!needUpdate}  onChange={(e) => setWeight(e.target.value)} />
          </div>
       
          {needUpdate && (

<div className="flex items-center gap-2 border p-2 justify-center rounded-md border-[#FAB1A0] cursor-pointer hover:border-[coral] transition-all ease-in" onClick={handleFakeWeight}>
          <FaBalanceScale size={20} className='hover:text-[coral] text-[#FAB1A0]'/>
            <span className='text-[#FAB1A0] hover:text-[coral] font-bold' >GENERATE WEIGHT</span>
          </div>
          )}
          {needUpdate ?
          <div className='flex gap-2'>
          <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={handleUpdate}>
          <BiSave size={25} color='white'/>
           <span className='text-white font-bold'>SUBMIT</span>
          </div>
          <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={handleNeedupdate}>
          <BiX size={25} color='white'/>
           <span className='text-white font-bold'>CANCEL</span>
          </div>
          </div> 
           :   <div className="flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={handleNeedupdate}>
          <BiEdit size={20} color='white'/>
           <span className='text-white font-bold'>EDIT</span>
          </div>}
         
          
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