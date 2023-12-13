import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import {BiSolidInfoCircle, BiEditAlt, BiSolidTrashAlt, BiSave, BiSolidFolderOpen, BiEdit, BiSolidLike, BiSolidTimeFive } from "react-icons/bi";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {collection, query, where, onSnapshot , orderBy, serverTimestamp, addDoc, deleteDoc} from "firebase/firestore";
import { db } from '../firebase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BiX, BiCalendar } from "react-icons/bi";
import { petsData } from '../animeData';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaBalanceScale } from "react-icons/fa";
import { Avatar } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { doc, updateDoc} from "firebase/firestore";
import { ScrollArea, ScrollBar  } from "@/components/ui/scroll-area"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
 



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});













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
  p: 2,
};


const ITEM_HEIGHT = 48;

function generateFakeWeight(min, max) {
  const fakeWeight = (Math.random() * (max - min) + min).toFixed(2); // Generates a random weight between min and max with 2 decimal places
  return `${fakeWeight} kg`;
}





function ListOfPet() {
  const [warn, setWarning] = React.useState(false);
  const [goalMonthSet, setGoalMonths] = React.useState(false);
  const [value, setValue] = React.useState();
  const [value1, setValue1] = React.useState();
  const [listOfPet, setListOfPet] = useState([]);
  const [listOfPet1, setListOfPet1] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dog, setDog] = React.useState([]);
  const [cat, setCat] = React.useState([]);
  const [gender, setGender] = React.useState('');
  const [age, setAge] = React.useState('');
  const [petId, setPetId] = React.useState('');
  const [position, setPosition] = React.useState("")
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
const [click, setClick] = React.useState(false);
const [click1, setClick1] = React.useState(false);
const [petSchesData, setPetSchedDataset] = useState([]);
const [scheduleOpens, setScheduleOpens] = useState(false);


const HandleDelete = async () => {
 
  setClick(true)
  try {
    await deleteDoc(doc(db, "List_of_Pets", petId)).then(()=>{
      setDelete(false);
      const user = localStorage.getItem("credentials");
      const datas = JSON.parse(user);
      const q = query(collection(db, "feeding_schedule"), where("Petname", "==", petname.trim()), where("DeviceName", "==", datas.DeviceName.trim()));
      onSnapshot(q, (querySnapshot) => {
       querySnapshot.forEach((docs) => {
        deleteDoc(doc(db, "feeding_schedule", docs.id));
       });
      
     });
    });
    setClick(false)
  } catch (error) {
    console.log('Something went wrong!');
    
  }
}

useEffect(()=> {
      
  const user = localStorage.getItem("credentials")
  if(user){
      const datas = JSON.parse(user);
      const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
      onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
       if (change.doc.data().Weight && change.doc.data().Petname === petname && change.doc.data().Token === 1) {
        setWeight(change.doc.data().Weight)
        setClick1(false)

        return;
      }
      // if (change.doc.data().Rfid && change.doc.data().Petname === petname && change.doc.data().Token === 0) {
      //   SetRfid(change.doc.data().Rfid)
      //   setClick1(false);

      //   return;
      // }

    });
  
  });


  }
},[ click1])


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
    setPosition("ALL")
    const user = localStorage.getItem("credentials");
      const datas = JSON.parse(user);
      if(user){
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName.trim()), orderBy("Created_at", "desc"));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach((docs) => {
           data.push({dt:docs.data(), id: docs.id});
       });
       
       setListOfPet1(data);
       
     });
        return;
      }
  }, [])

  useEffect(()=> {
  
    if(search.length === 0){
      const user = localStorage.getItem("credentials");
      const datas = JSON.parse(user);
      if(user){
        if(position === "ALL"){
          const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName.trim()), orderBy("Created_at", "desc"));
          onSnapshot(q, (querySnapshot) => {
         const data = [];
         querySnapshot.forEach((docs) => {
             data.push({dt:docs.data(), id: docs.id});
         });
         
         setListOfPet(data);
         
       });
          return;
        }
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName.trim()),where("petType", "==", position.toLowerCase().trim()) , orderBy("Created_at", "desc"));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach((docs) => {
           data.push({dt:docs.data(), id: docs.id});
       });
       
       setListOfPet(data);
       
     });
        return;
      }

    
     
    };


    const pets = [...listOfPet];
    const result = pets.filter((ds) => {
      if(ds.dt.Petname.trim().toLowerCase().includes(search.toLowerCase().trim())){
        return ds;
      }
    })

    setListOfPet(result);
  

    
  },[search, listOfPet, position])







  


    const openTime = (type) => {
      if(type ==='VIEW'){
        setVisible(true);
     
      const res = listOfPet.find(d => d.id === petId);
      if(!res) return;

      setPetname(res.dt.Petname);
      setAge(res.dt.Age);
      setGender(res.dt.Gender);
      setGoalWeight(res.dt.GoalWeight);
      setChoose(res.dt.image)
      setWeight(res.dt.Weight);
   

        return;
      }

      const res = listOfPet.find(d => d.id === petId);
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


  const handleFakeWeight = async () => {
    setClick1(true)
    const petWeightss = doc(db, "List_of_Pets", petId);
      await updateDoc(petWeightss, {
        requestWeight: true,
      }).then(()=>{
        setClick1(true)
        const user = localStorage.getItem("credentials");
      const datas = JSON.parse(user);
        addDoc(collection(db, "Task"), {
          type:'request_weight',
          deviceName:datas.DeviceName.trim(),
          document_id:petId,
          request:null,
        })
      })

  }


  const handleUpdate = async () => {
    setClick(true)
    const docUpdate = {
      Petname:petname,
      Weight:weight,
      Gender:gender,
      GoalWeight:goalWeight,
      Age:age,
      image:choose,
      Updated_at: serverTimestamp(),
      Token:1,
      requestWeight:false,
      StartGoalMonth: dayjs(value.$d).format('MM/DD/YYYY'),
      EndGoalMonth:  dayjs(value1.$d).format('MM/DD/YYYY'),
    }
    try {
      const collects = doc(db, "List_of_Pets", petId);
      await updateDoc(collects, docUpdate);
      setClick(false)
      setNeedUpdate(false);      
   
    } catch (error) {
      console.log(error)
    }
  }

  const getSchedule = (name) => {
    const q = query(collection(db, "feeding_schedule"), where("Petname", "==", petname));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const schedDatas = [];
      querySnapshot.forEach((doc) => {
          schedDatas.push({dts: doc.data(), id: doc.id});
      });
      setPetSchedDataset(schedDatas);
     
      
    });
    }




  const dataSetnew = (m) => {
     return [ "All", ...Array.from(new Set(m.map(d => d.dt.petType)))];
  }

 


  const dMessage = useMemo(()=> dataSetnew(listOfPet1), [listOfPet1]);
  


  

    
    
 

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
   
      <div className='flex gap-2 justify-center items-center'>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=' cursor-pointer border px-4 py-2 rounded-md'>
          <span className='font-bold opacity-70'>FILTER BY TYPE</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose option</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {dMessage.length - 1 > 0 ? dMessage.map((d , i)=> {
            return  (
              <DropdownMenuRadioItem value={d.toUpperCase()}>{d.toUpperCase()}</DropdownMenuRadioItem>
         )
          }): (
            <div className='flex justify-center items-center p-2'>
              <label >No types found!</label>
            </div>
            
          )}
         
        
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
   
       <Paper
      component="form"
      className='border '
      value={search}
      onChange={(e)=> setSearch(e.target.value)}
      sx={{ p: ' 4px', display: 'flex', alignItems: 'center', width: 400, height:40, boxShadow:'none' }}
    >
    
      <InputBase
       
        sx={{ ml: 1, flex: 1 }}
        placeholder="SEARCH PET HERE"
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
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">PETNAME</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">PETTYPE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">WEIGHT</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">AGE</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">GENDER</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] ">OPTIONS</div>
      </div>

      <div className=' h-[350px] overflow-auto  p-2 '>
        
        {listOfPet.length > 0 ? listOfPet.map((item, index) => {
          return (
            <div class="flex " key={index}>

       
            <div class="w-1/4 h-20    flex justify-center items-center">
             <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
             <Image
                src={item?.dt?.image}
               fill
               alt='profile'
               objectFit='cover'
     
             />
             </div>
            </div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center font-bold opacity-80">{item.dt.Petname}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center capitalize font-bold opacity-80">{item.dt.petType}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{parseFloat(item?.dt?.Weight).toFixed(2)}</div>
            <div class="w-1/4 h-20 text-center  flex justify-center items-center">{item.dt.Age}</div>
            <div class={`w-1/4 h-20 text-center  flex justify-center items-center capitalize font-bold opacity-80 ${item.dt.Gender === 'female' ? "text-pink-500": "text-blue-500"}`}>{item.dt.Gender}</div>
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
              <label className = {`font-bold ${option.color}`}> {option.val} </label>
              {option.icon}
            </div>
          </MenuItem>
        ))}

        
      </Menu>
    </div>
            </div>
           </div>
     
          )
        }): (
          
          <div className='w-full border h-full flex flex-col justify-center items-center'>
             <Image
        width={160}
        height={160}
        src="/Image/SadDog.png"
        contentFit="cover"
       
      />
           <label className='text-md font-bold opacity-60'>No pets found.</label>
            
          </div>
        )}


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

    <Button component="label" variant="contained" className='opacity-60' startIcon={<CloudUploadIcon />} >
      Upload file
      <VisuallyHiddenInput type="file" onChange={(event)=> {
       const file = event.target.files[0]
       setChoose(URL.createObjectURL(file));
      }}/>
    </Button>

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
              Petname
            </Label>
            <Input id="petname" placeholder='Kussy' value={petname} className="col-span-3" disabled={!needUpdate} onChange={(e) => setPetname(e.target.value)}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Age
            </Label>
            <Input id="age" placeholder="15" value={age} className="col-span-3" disabled={!needUpdate} onChange={(e) => setAge(e.target.value)} />
          </div>
        
           <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="petname" className="text-right">
              Gender
            </Label>
          <Box sx={{
            width:270,
            display: 'flex',
            gap:1,
          }} >
      <FormControl fullWidth >
        <Select
          value={gender}
          onChange={handleChange}
          className='h-[38px]  opacity-70'
          disabled={!needUpdate}
        > 
         {gendered.map((d,i)=> {
          return (
              <MenuItem value={d.val} key={i}>{d.gender}</MenuItem>
          )
         })}
     
        </Select>
      </FormControl>
  
    </Box>
 
          </div> 
          
        
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Goal Weight
            </Label>
            <Input id="age" placeholder="15" value={goalWeight} className="col-span-3" disabled={!needUpdate} onChange={(e) => setGoalWeight(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Weight
            </Label>
            <Input id="age" placeholder="15" className="col-span-3 " value={parseFloat(weight).toFixed(2)} disabled={!needUpdate}  onChange={(e) => setWeight(e.target.value)} />
          </div>
          {!needUpdate && (
          <div className="flex justify-center  items-center gap-1 ">
            <span className='text-sm font-bold opacity-60'> See the pet schedule?</span>
            <span className='text-red-500 italic text-sm cursor-pointer font-bold hover:opacity-100 opacity-60 transition-all ease-in' onClick={()=>{
              setScheduleOpens(true);
              getSchedule();
            }}>Click here</span>     
          </div>

          )}
       
          {needUpdate && (

<div className="flex items-center gap-2 border p-2 justify-center rounded-md border-[#FAB1A0] cursor-pointer hover:border-[coral] transition-all ease-in" onClick={handleFakeWeight}>
        
            {click1 ?
 <>
 
  <span className='text-sm text-[#FAB1A0] font-bold' >
   PLEASE WAIT ..
  </span>
 </>
          : 
            <>
           
           <FaBalanceScale size={20} className='hover:text-[coral] text-[#FAB1A0]'/>
            <span className='text-[#FAB1A0] hover:text-[coral] font-bold' >GENERATE WEIGHT</span>
            </>
           
         }
         
          </div>
          )}       
          
    
         {needUpdate && (

<>
<div className="grid  items-center gap-4  ">
          
          {goalMonthSet ? (
 <div className='my-3'>
  <div className=' flex justify-between items-center  '>
  <label className='font-bold'>  Select Goal Month:</label>
  <BiX size={25} color='red' className='opacity-60 hover:opacity-100 cursor-pointer' onClick={()=> setGoalMonths(false)}/>
    </div>
  <div className=' flex flex-col w-full'>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
 <DemoContainer components={['DatePicker', 'DatePicker']}>
  <div className='flex flex-col gap-2 w-full'>
  <DatePicker label="Start Date:"   value={value1}
     onChange={(newValue) => setValue1(newValue)}/>
   <DatePicker
     label="End Date"
     value={value}
     onChange={(newValue) => setValue(newValue)}
   />
  </div>
  
 </DemoContainer>
</LocalizationProvider>
  </div>

 </div> 

 ): (

<div className='mt-3 gap-1 flex'>
      <span className='font-bold opacity-60 text-sm'>Do you want to set the goal month?</span>
      <span className='italic text-red-500 font-bold opacity-60 hover:opacity-100 cursor-pointer text-sm' onClick={()=> {
       setWarning(true);
      }}>Click here</span>
    </div>

 )}


          </div>
          
 
<Modal
        open={warn}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
          <div className='w-full flex justify-center items-center'>
          <Image
        width={150}
        height={150}
        src="/Image/KawaiDog.png"
        contentFit="cover"
       
      />
          </div>
      
        <div className='w-full justify-center  flex  px-5'>
         <span className='text-[20px] font-bold mr-1 text-[#FAB1A0]'>|</span>
         <span className='text-[15px]  opacity-40 font-bold'>Please make sure you have already consulted the professional before setting the goal for the month.</span>
      
          </div>
          <div className='flex gap-2 mt-4 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={()=> {
            setWarning(false);
            setGoalMonths(true);  
          }}>
          <BiCalendar color='white' size={20} />
           <span className='text-white font-bold'>Set Goal month now</span>
          </div>
      </div>
       
      <div className='flex gap-2 mt-3 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md  border-[#FAB1A0] opacity-50 hover:opacity-100  transition-all ease-in cursor-pointer" onClick={()=>{
             setWarning(false);
          }} >
          <BiX size={24} color='#FAB1A0' />
           <span className='text-[#FAB1A0] font-bold'>Close</span>
          </div>
      </div>
        </Box>
      </Modal>
</>

         )}
       
          {needUpdate ?
          <div className='flex gap-2'>
          <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={handleUpdate}>
          {click ?
 <>
 
  <span className='text-sm text-white font-bold' >
   PLEASE WAIT ..
  </span>
 </>
          : 
            <>
           
           <BiSave size={25} color='white'/>
           <span className='text-white font-bold'>SUBMIT</span>
            </>
           
         }
         
       
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
        <div className='w-full justify-center items-center flex flex-col px-5'>
        <Image
        width={160}
        height={160}
        src="/Image/KawaiDog.png"
        contentFit="cover"
       
      />
        <Typography variant="h9" gutterBottom className='text-center'>
        Are you sure you want to delete this pet? This remove also the pet schedule.
      </Typography>
          </div>
       
      <div className='flex gap-2 mt-4 '>
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

      <Modal
        open={scheduleOpens}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography variant="h6" gutterBottom className='text-center'>
        <span className='font-bold text-[coral] '>{petname}</span> list of schedules
      </Typography>
    
      <ScrollArea className="flex p-2 flex-col h-[245px]  border rounded-md space-y-1.5 ">

        {!petSchesData.length && <div className='text-[#FAB1A0] w-full h-full flex justify-center flex-col items-center font-bold '>
      
             <Image
        width={160}
        height={160}
        src="/Image/KawaiDog.png"
        contentFit="cover"
       
      />
      <span className='font-bold '>No schedule found!</span>
        
          </div>}
          {petSchesData && petSchesData.map((d, i) => {
            return (
              <>
              <div className='h-full w-full mb-2' key={i}>
              <div className=' w-full border shadow-md p-2 rounded-md flex flex-col'>
                <span className='text-red-500 font-bold'>* {d.dts.Days}</span>
                <label className='text-[13px]'>Schedule Time:</label>
                {d.dts.ScheduleTime.map((s, b) =>{
                  return (
                    <div key={b}>
                       <div className='flex  items-center gap-1 space-y-0'>
                 <label className='text-[15px]'>{s.time} {s.parameters}</label>
                 <label className='text-[15px] text-[#FAB1A0]'>/</label>
                 <label  className='text-[15px]'>{s.cups} {s.cups > 1 ? 'CUPS': 'CUP'}</label>
                 </div>
                    </div>
                  )
                })}
              </div>
                </div>

              </>
            )
          })}
      </ScrollArea>
      <div className='flex gap-2 mt-4'>
         <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={()=>{
          window.location.href =  `/schedules?petnames=${petname}`
         }} >
          <BiSolidTimeFive size={20} color='white'/>
           <span className='text-white font-bold'>ADD CHEDULE</span>
          </div>
          <div className="w-full flex items-center gap-2 border p-2 justify-center rounded-md border-[#FAB1A0] hover:opacity-100 opacity-50 transition-all ease-in cursor-pointer" onClick={()=>{
            setScheduleOpens(false);
          }}>
          <BiX size={20} color='#FAB1A0' />
           <span className='text-[#FAB1A0] font-bold'>CLOSE</span>
          </div>
      </div>
        </Box>
      </Modal>


   

    

   


    
      
       </div>
    
       
    </ScrollArea>
  )
}

export default ListOfPet