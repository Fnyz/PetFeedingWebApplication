'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Stack from '@mui/material/Stack';
import { BiXCircle, BiAddToQueue, BiShowAlt, BiTimeFive, BiX, BiEdit ,BiSolidTrash, BiSave, BiEditAlt    } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import moment from 'moment';
import { ScrollArea  } from "@/components/ui/scroll-area"
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'next/navigation';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { collection, addDoc, query, onSnapshot, serverTimestamp, where, deleteDoc, doc , updateDoc} from "firebase/firestore";
import { db } from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2'




const days = [
    {day: 'Monday'},
    {day: 'Tuesday'},
    {day: 'Wednesday'},
    {day: 'Thursday'},
    {day: 'Friday'},
    {day: 'Saturday'},
    {day: 'Sunday'},
    {day: 'Everyday'},

]








  







function ScheduleForm() {


    const [petDatas, setPetDatas] = React.useState([]);
    const [credential, setCredential] = React.useState({});
    const [data, setDataName] = React.useState([])
    const [chooseDay, setChooseDay] = React.useState('Everyday');
    const [twelveHourTime, setTwelveHourTime] = useState('');
    const [militaryTime, setMilitaryTime] = useState('');
    const [militaryTime2, setMilitaryTime2] = useState('');
    const [scheds1, setSchedules] = useState([]);
    const [scheds2, setSchedules2] = useState([]);
    const [caps, setCaps] = useState('')
    const [parameters, setParameters] = useState('');
    const [parameters2, setParameters2] = useState('');
    const [name, setName] = useState('');
    const [listSched, setListSched] = useState([]);
    const [show, setShow] = useState(false);
    const [petSchesData, setPetSchedDataset] = useState([]);
    const [time2 , setTime2] = useState('');
    const [cups2, setCups2] = useState('');
    const [currentTime, setCurrentTime] = useState('');
;   const [time3, setTime3] = useState('');
    const [click, setClick] = useState(false);
    const [click1, setClick1] = useState(false);
    const [showMe, setShowMe] = useState(false);
    const [petList, setPetList] = useState([]);
    const [slots, setSlots] = useState([]);

    

    const searchParams = useSearchParams()

    const petnames = searchParams.get('petnames') || null

    
  const getAllListofPet = () => {
    const q = query(collection(db, "List_of_Pets"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listOfPets = [];
      querySnapshot.forEach((doc) => {
          listOfPets.push({data: doc.data(), id: doc.id});
      });
      setPetList(listOfPets);
     
     
      
    });
  }

  
  useEffect(()=>{
    
   
      const jsonValue = localStorage.getItem('credentials');
      const credential = JSON.parse(jsonValue);
    
      const q = query(collection(db, "feeding_schedule"), where('DeviceName', "==", credential.DeviceName.trim()));
     onSnapshot(q, (querySnapshot) => {
    const forPetName = [];
    querySnapshot.forEach((docs) => {
      forPetName.push({data:docs.data(), id: docs.id});
  
    });

     setSlots(forPetName);


    // const filteredArray = forPetName.filter((a) => {
    //   return a.data.petSlot === "slot_one";
    // });
    
    // // Log the 'ScheduleTime' values for elements that meet the condition
    // const combinedScheduleTime = filteredArray.reduce((result, item) => {
    //   return result.concat(item.data.ScheduleTime);
    // }, []);

    // console.log(combinedScheduleTime);
  

    
    
    
  });
  

    
  },[])


  

    useEffect(()=>{
      getAllListofPet();
     setName(petnames)
     if(petnames){
      const q = query(collection(db, "feeding_schedule"), where("Petname", "==", petnames));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const schedDatas = [];
        querySnapshot.forEach((doc) => {
            schedDatas.push({dts: doc.data(), id: doc.id});
        });
        if(schedDatas.length > 0){
         setShow(true);
         return;
        }else{
         setShow(false)
         return;
        }
       
        
      });
     }
    },[])
    

    function FormRow({days, setChooseDay, chooseDay}) {

      return (
        <React.Fragment>
          {days.map((d, i)=> {
              return (
                  <Grid item xs={6}  key={i}  >
                  <Item className={`cursor-pointer transition-all ease-in font-bold text-white bg-[#FAB1A0] ${chooseDay === d.day && "bg-[coral]"} w-full `} onClick={()=> setChooseDay(d.day)}>{d.day === 'Everyday' ? d.day : d.day.slice(0,3).trim()}</Item>
                  </Grid>
              )
          })}
        </React.Fragment>
      );
  }
   
    


  const convertToMilitaryTime = () => {
    const date = new Date(`2000-01-01 ${twelveHourTime}`);
    const militaryTimeValue = date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' });
    const ampm = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).slice(-2);
    setMilitaryTime(militaryTimeValue)
    setParameters(ampm)
   
  
  }; 
  
  const convertToMilitaryTime2 = () => {
    const date = new Date(`2000-01-01 ${twelveHourTime}`);
    const militaryTimeValue = date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    const ampm = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).slice(-2);
    setMilitaryTime2(militaryTimeValue.split(' ')[0].trim())
    setParameters2(ampm)
 
  };  


  const handleUpdateTimeManage = (time, cups) => {
    setTime2(time)
    setCups2(cups)
    setCurrentTime(time)
   
  }


  const handleRemoveSchedTimeSched = async (time, days) => {
   
    const a = petSchesData.find((d) => d.dts.Days === days && d.dts.DeviceName === credential.DeviceName)
    const b = a?.dts.ScheduleTime.filter((d) => d.time !== time );
    
    if(a.dts.ScheduleTime.length - 1 === 0){
      await deleteDoc(doc(db, "feeding_schedule",a.id));
      return;
    }
    const docRef = doc(db, 'feeding_schedule', a.id);
    updateDoc(docRef, {
     ScheduleTime:b,
  }).then(()=>{
     
  });
    
    
  
  
  }

  const handleUpdateTimeHere = (days, parameters) => {
    setClick1(true);
    const a = petSchesData.find((d) => d.dts.Days === days && d.dts.DeviceName === credential.DeviceName)
    const b = a?.dts.ScheduleTime.find((d) => d.time === currentTime);
    const res  = listSched.find(d => d.data.Days === days.trim() && d.data.DeviceName === credential.DeviceName);

 





    const combinedData = [];

    const filteredArray = slots?.filter((c) => {
      return c.data.Slot === res?.data.Slot &&  c.data.Days === res.data.Days;
    });
    filteredArray?.forEach((item) => {
 const petname = item.data?.Petname;
 const scheduleTimes = item.data.ScheduleTime.map((time) => {
   return { petname, sched:time };
 });
 combinedData.push(...scheduleTimes);
   });

   const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
   const rs = combinedData.find(z => timeToMinutes(z.sched.time) === timeToMinutes(time3) || timeToMinutes(currentTime.split(' ')[0].trim()));
  
   if(rs){
  
    setClick1(false);
    Swal.fire({
      title: "Warning?",
      text: rs?.petname === name ? `You already set this time on ${res?.data.Slot==1 ? "SLOT ONE": "SLOT TWO"}` : `${time3} is already set to ${rs?.petname} in ${res?.data.petSlot=="slot_one"? "SLOT_ONE.": "SLOT_TWO."} on the pet schedule, please choose other time.`,
      icon: "error",
      confirmButtonColor: "#FAB1A0",
      confirmButtonText: "Close",
      
    }).then(()=>{
      Swal.close();
    })

   
    return;
  }else{
    if(b){
      const res = a?.dts.ScheduleTime.filter(d => d.time !== currentTime);
      const newArray =  [
       {cups: cups2,
        parameters:parameters,
        time:time3,
       }
      ]
     
      const updateSched = [...res, ...newArray]
      const docRef = doc(db, 'feeding_schedule', a.id);
      updateDoc(docRef, {
       ScheduleTime:updateSched,
    }).then(()=>{
     setClick1(false);
      Swal.fire({
       title: "Success?",
       text: `Time is updated successfully`,
       icon: "success",
       confirmButtonColor: "#FAB1A0",
       confirmButtonText: "Close",
       
     }).then(()=>{
       Swal.close();
     })
    });
 
 
     }
  }
    
   
  
  
  
    
     
  }




  const getSchedule = (name) => {
    const q = query(collection(db, "feeding_schedule"), where("Petname", "==", name));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const schedDatas = [];
      querySnapshot.forEach((doc) => {
          schedDatas.push({dts: doc.data(), id: doc.id});
      });
      setPetSchedDataset(schedDatas);
     
      
    });
    }

 

  useEffect(()=>{
    convertToMilitaryTime()
    convertToMilitaryTime2()

  },[twelveHourTime])


  useEffect(()=> {
    const isSchedule = () => {
      const res = listSched.find(d => d?.data?.Petname.toLowerCase().trim() === name?.toLowerCase().trim());
      
      if(!res){
        setShow(false);
        
        return;
      }

      setShow(true);
      }
  
      isSchedule();
  },[name])





  const removeFoodItem = (selectedTime, pr) => {
   
    setSchedules2(scheds2.filter((item) =>`${item.time} ${item.parameters2}` !== `${selectedTime} ${pr}`));
   
  };

  const removeFoodItem2 = (selectedTime, pr) => {

    const date = new Date(`2000-01-01 ${selectedTime}`);
    const militaryTimeValue = date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' });
    setSchedules(scheds1.filter((item) => `${item.time} ${item.parameters}` !== `${militaryTimeValue} ${pr}`));
  };


  const addFoodItem = () => {
  
    if(!caps){
      setClick(false);
          Swal.fire({
            title: "Warning?",
            text: "Please fill out all fields",
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Try again",
            
          })
      return;
    }

   
    const res  = listSched.find(d => d.data.Days === chooseDay && d.data.DeviceName === credential.DeviceName && d.data.Petname === name);
  
    const combinedData = [];

    const filteredArray = slots?.filter((a) => {
      return a.data.Slot === res?.data.Slot &&  a.data.Days === res?.data.Days;
    });
    filteredArray?.forEach((item) => {
 const petname = item.data?.Petname;
 const scheduleTimes = item.data.ScheduleTime.map((time) => {
   return { petname, sched:time };
 });
 combinedData.push(...scheduleTimes);
});

        const rs = combinedData.find(a => a.sched.time === militaryTime.trim());
        if(rs){
        
          Swal.fire({
            title: "Warning?",
            text: rs?.petname === name ? `You already set this time on ${res?.data.Slot==1 ? "SLOT ONE": "SLOT TWO"}` : `${militaryTime.trim()} is already set to ${rs?.petname} in ${res?.data.petSlot=="slot_one"? "SLOT_ONE": "SLOT_TWO"} on the pet schedule, please choose other time.`,
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Set time again",
            
          })
          setCaps('');  
       
          
        }else{
          const exist  = res?.data.ScheduleTime.find(s => s.time === militaryTime.trim() && s.parameters === parameters )
    
          if(exist){
            
                setClick(false);
                Swal.fire({
                  title: "Warning?",
                  text: `Schedule ${exist.time} time in ${exist.feedingSlot === "slot_two" ? "SLOT TWO" : "SLOT ONE"}  is already set, please try again.`,
                  icon: "warning",
                  confirmButtonColor: "#FAB1A0",
                  confirmButtonText: "Set time again",
                  
                })
            return;
          }
      
        
      
      
          const existingItem = scheds1.find((item) => item.time === militaryTime.trim() && item.parameters === parameters);
         
          if (existingItem) {
            
            setClick(false);
            Swal.fire({
              title: "Warning?",
              text: `Time ${existingItem.time} already exists, Remove the existing entry first.`,
              icon: "warning",
              confirmButtonColor: "#FAB1A0",
              confirmButtonText: "Set time again",
              
            })
           
            return;
          }
      
      
          // Add the new food item and time to the list
          setSchedules([...scheds1, { time: militaryTime.trim(), cups: caps, parameters}]);
           
          
      
      
          const existingItem2 = scheds2.find((item) => item.time === militaryTime2.trim() && item.parameters2 === parameters2);
          if (existingItem2) {
            // You can handle the duplicate time case here
            setClick(false);
            Swal.fire({
              title: "Warning?",
              text: `Time ${existingItem2.time} already exists. Remove the existing entry first.`,
              icon: "warning",
              confirmButtonColor: "#FAB1A0",
              confirmButtonText: "Set time again",
              
            })
         
            return;
          }
      
          // Add the new food item and time to the list
          setSchedules2([...scheds2, { time: militaryTime2.trim(), cups: caps, parameters2 }]);
      
          setCaps('');  
        }
    
  
    
  };




  const getAllListSched = () => {
    const q = query(collection(db, "feeding_schedule"));
   onSnapshot(q, (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push({data:doc.data(), id: doc.id});
  });
  
  setListSched(dt);

 

  
});
  }
  

  const handleRemoveSched = async (id) => {
    await deleteDoc(doc(db, "feeding_schedule",id));
  }







  




    const getAllDatas = () => {

      const user = localStorage.getItem("credentials")
      if(user){
          const datas = JSON.parse(user);
          const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    const dt2 = [];
    querySnapshot.forEach((doc) => {
        dt.push({id: doc.id, ds: doc.data()});
    });
  
    setPetDatas(dt);
    dt.forEach(d => {
        dt2.push({label: d.ds.Petname})
    })
    setDataName(dt2);
   
   
  });
      }
      
  
    }
  
    useEffect(()=>{
      getAllDatas();
      handleShowCredData();
      getAllListSched();
    },[])

   


    const handleShowCredData = () => {
      const user = localStorage.getItem("credentials")
      if(user){
          const datas = JSON.parse(user);
          setCredential(datas);
      }
    }

    const handleSubmit = async () => {
      setClick(true);
      const h = petList.find((a)=>a.data.DeviceName.toLowerCase().trim() === credential.DeviceName.trim() && a.data.Petname.trim().toLowerCase() === name.trim().toLowerCase())

      const petSchedule = {
        DeviceName: credential.DeviceName,
        Petname: name,
        Days: chooseDay,
        ScheduleTime: scheds1,
        petId:h?.id, 
        Slot:h.data.Slot,
        synced:false,
        created_at: serverTimestamp(),
      }

  
      if(!name || !chooseDay || !scheds1.length) {
        setClick(false);
        Swal.fire({
          title: "Warning?",
          text: "Please input all fields.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
        })
      
        return;
      }
  
      const res = listSched.find(d => d.data.Days.toLowerCase().trim() === chooseDay.toLowerCase().trim() && d.data.DeviceName.trim() === credential.DeviceName.trim() && d.data.Petname.toLowerCase().trim() === name.toLowerCase().trim());

  
      if(!res){
    
        const docRef = await addDoc(collection(db, "feeding_schedule"), petSchedule);
  
        if(docRef.id){
          setSchedules([])
          setSchedules2([])
          setName('')
          addDoc(collection(db, "Task"),{
            type:'Schedule',
            deviceName: credential.DeviceName,
            document_id: docRef.id,
            request:null,
          }).then(async()=>{
            await addDoc(collection(db, "PetFeedingSlot"), {
              Slot_One: scheds1,
            })
          });

          setClick(false);
          Swal.fire({
            title: "Success?",
            text: "Schedule added successfully",
            icon: "success",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Okay, Thank you.",
            
          })
        
        }
        return;
      }else{
      
          const currentSched  = res.data.ScheduleTime || [];
          const updatedSched = [...currentSched, ...scheds1];
          const docRef = doc(db, 'feeding_schedule', res.id);
          updateDoc(docRef, {
            ScheduleTime:updatedSched,
         }).then(()=>{
           setClick(false);
             Swal.fire({
               title: "Success?",
               text: "Schedule added successfully",
               icon: "success",
               confirmButtonColor: "#FAB1A0",
               confirmButtonText: "Okay, Thank you.",
               
             })
           setSchedules([])
           setSchedules2([])
           setName('')
           setTwelveHourTime('')
         });
         return;
     
      }
  

      
    
        
    }


    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));
  





  
 



  return (
    <Card className="w-full">
    <CardHeader>
     <CardTitle>Scheduler!</CardTitle>
     <CardDescription>Fill out this form belows.</CardDescription>
    </CardHeader>
    <CardContent>


    
       <div className="grid w-full items-center gap-4 ">
       <Autocomplete
       onInputChange={(event, newInputValue) => {
        setName(newInputValue)
        setSchedules([]);
        setSchedules2([])
        setTwelveHourTime('');
        setChooseDay('Everyday');
    }} // handles typing
      disablePortal
      id="combo-box-demo"
      options={data}
      sx={{ width: '100%' }}
      value={name}
     
  
   
      renderInput={(params, i) => <TextField {...params} key={i} label="Select Petname" />}
    />
         <div className="flex flex-col space-y-1.5">
           <Label className='mb-2 font-bold  opacity-50'>Days</Label>
          
           <Box sx={{ flexGrow: 1 }}>
         <Grid container spacing={2} direction='row'   >
        <Grid container item spacing={1} >
            <FormRow days={days} setChooseDay={setChooseDay} chooseDay={chooseDay} />
       </Grid>
 
      </Grid>
      
    </Box>

    <div className='flex max-lg:flex-col gap-2 ' style={{
      width:'100%',
      paddingBottom:10,
    
    }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}   >
      <DemoContainer components={['TimePicker']} sx={{
        width:'100%',
       
      }} >

        <TimePicker
          
          label="Select Time"
          className='w-full'
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          
          ampm={true}  
            
          onChange={(e) =>  setTwelveHourTime(`${e?.$H}:${e?.$m}` || "")}
          autoFocus={false}
        />
      </DemoContainer>
    </LocalizationProvider>

    <Box
      component="form"
      className='w-full pt-2'
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" className='w-full'  label="Cups" variant="outlined" value={caps} onChange={(e)=> setCaps(e.target.value)}/>
    </Box>

      
    </div>

    
    <div className='w-full rounded-md p-2 text-center  bg-[#FAB1A0] text-white hover:bg-[coral] transition-all ease-in cursor-pointer flex justify-center items-center gap-2 shadow-sm' onClick={addFoodItem} >
      <BiAddToQueue size={20} />
      <label className='cursor-pointer font-bold'>SET CAPS AND TIME</label>
    </div>
   
     <div className='flex justify-between items-center '>

     <label style={{
      marginTop:'10px',
      fontSize:15,
      fontWeight:'bold',
      opacity:0.6
     }}>List of schedule</label>


     {show && (

<div>
 

<Dialog>
<DialogTrigger asChild>
  <div className='flex justify-center items-center gap-1' onClick={()=> getSchedule(name)}>
  <BiShowAlt size={20} className='text-[#FAB1A0]'/>
<label className='text-[13px] font-bold opacity-50'>Pet Schedule</label>
  </div>
 
</DialogTrigger>
<DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>{name} set schedules.</DialogTitle>
    <DialogDescription>
      {`You have ${petSchesData.length} schedules for ${name}.`}
    </DialogDescription>
  </DialogHeader>
  <ScrollArea className="flex p-2 flex-col h-[400px]  border rounded-md space-y-1.5 ">
         {petSchesData.map((d, i)=> {
          return (
         <div className='flex flex-col border min-h-fit w-[100%] p-3 rounded-md mt-2' key={i}>
          <div className='flex justify-between items-center text-[13px]'>
          <label>Day: <span className='text-red-500' style={{
        
        fontWeight:'bold'
      }}>{d.dts.Days}</span></label>
       
       <div className='flex '>

     
       <BiX size={25}  className='hover:text-red-500 cursor-pointer text-[coral]' onClick={()=>handleRemoveSched(d.id)}/>
       </div>
     
    
          </div>

          <label className='text-[13px]'>Schedule Time:</label>
       
         {d.dts.ScheduleTime.map((s, b) => {
          return (  
            <div className='flex justify-between gap-1 space-y-0 border p-2 m-1 rounded-md' key={b}>
                 <div className='flex  items-center gap-1 space-y-0'>
                 <label className='text-[15px]'>{s.time} {s.parameters}</label>
                 <label className='text-[15px] text-[#FAB1A0]'>/</label>
                 <label  className='text-[15px]'>{s.cups} {s.cups > 1 ? 'cups': 'cup'}</label>
                 </div>
                 <div className='flex gap-2 justify-center items-center  '>
                 
                
                 <Dialog>
      <DialogTrigger asChild>
      <BiEdit size={20}  className='hover:text-blue-600 cursor-pointer text-blue-400 ' onClick={()=> handleUpdateTimeManage(`${s.time} ${s.parameters}`, s.cups)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Time Schedule</DialogTitle>
          <DialogDescription>
            Make changes to the schedule time here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
     
          {showMe ? (
      <div className='flex justify-end items-center gap-2 '>
<LocalizationProvider dateAdapter={AdapterDayjs}   >
   <DemoContainer components={['TimePicker']}  >

     <TimePicker
       
       label="Select Time"
     
       viewRenderers={{
         hours: renderTimeViewClock,
         minutes: renderTimeViewClock,
         seconds: renderTimeViewClock,
       }}
       
       ampm={true}  
         
       onChange={(e) =>  setTime3(`${e?.$H}:${e?.$m}` || "")}
       autoFocus={false}
     />
   </DemoContainer>
 </LocalizationProvider>
 <div className='opacity-50 cursor-pointer bg-[red] h-[54px] w-[50px] rounded-md flex justify-center items-center mt-2' onClick={()=> setShowMe(false)}>
            <BiX  size={22}  color='white'/>
            </div>
      </div>
   

          ): (
            <div className="flex flex-row justify-end items-center gap-2 ">
            <Label htmlFor="name" className="text-right">
              Time
            </Label>
            <Input id="name" value={time2} className="col-span-3 w-[59%]" onChange={(e)=> setTime2(e.target.value)} disabled />
            <div className='opacity-50 cursor-pointer bg-[blue] h-[39px] w-[50px] rounded-md flex justify-center items-center' onClick={()=> setShowMe(true)}>
            <BiEditAlt  size={22}  color='white'/>
            </div>
          </div>
          )}
         
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="username" className="text-right">
              Cups
            </Label>
            <Input id="username" value={cups2} className="col-span-3" onChange={(e)=> setCups2(e.target.value)}  />
          </div>
        </div>
        <DialogFooter className=' flex  max-md:items-end'>
          <div className='flex justify-center items-center gap-2 p-2 w-[60%]  text-center rounded-md font-bold bg-[#FAB1A0] text-white cursor-pointer hover:bg-[coral] transition-all ease-in' onClick={()=> handleUpdateTimeHere(d.dts.Days, s.parameters)}>
          {click1 ?
 <>
 <CircularProgress color='inherit' size={15} />
  <span className='text-sm font-bold text-white'>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
           <BiSave size={20}/>
            <span>SAVE CHANGES</span>
            </>
           
         }
        
          
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    /
                   <BiSolidTrash  size={20}  className='hover:text-red-600 cursor-pointer text-red-400 ' onClick={()=> handleRemoveSchedTimeSched(s.time, d.dts.Days, s.parameters)}/>

                 </div>
            </div>
         

          )
         })}
       
        <label style={{
         alignSelf:'flex-end',
         fontSize:13,
         opacity:0.7,
         marginTop:10,
        }}>{moment(d.dts?.created_at?.toDate()).calendar()}</label>
       </div>
          )
         })}
        

       
  </ScrollArea>


</DialogContent>

</Dialog>
</div>
     )}
  

     </div>
   
    <Box sx={{ width: '100%', height:150 }} className='border p-2  overflow-auto'>
      <Stack spacing={2}>
        {!scheds2.length ?
        <div  style={{
          height:130,
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          fontWeight:'bold',
          opacity:0.7
        }}>
         <label> No schedule found!</label>
        </div>
        
        
        : scheds2.map((d, i)=> {
          return(
            
              <Item className='flex  justify-between items-center' key={i.toString()}>
              <div className='ml-2 font-bold opacity-80'>
              <label>{d.time} {d.parameters2}</label>
              <label> / </label>
              <label>{d.cups} {d.cups > 1 ? 'cups': 'cup'}</label>
              </div>
      
              <BiXCircle className=' cursor-pointer hover:text-[red] transition-all ease-in' size={20}  onClick={()=>{
               removeFoodItem(d.time, d.parameters2)
               removeFoodItem2(d.time, d.parameters2)
              }}/>
            </Item>

          )
        })}
      </Stack>
    </Box>
           
         </div>
         
    
    
       </div>
   
    </CardContent>
    <CardFooter className="flex justify-between">
    {petnames ? (
      <Button variant="outline" onClick={()=>{
       window.location.href = "/dashboard"
       setName("");
      }}>Go back to Dashboard</Button>
    ): (
      <Button variant="outline" onClick={()=>{
       setName("");
       setCaps("");
       setSchedules([]);
       setSchedules2([]);
       setChooseDay("Everyday");
      }}>CLEAR</Button>
    )}
     <div onClick={handleSubmit} className='flex transition-all ease-in  justify-center items-center gap-2 border px-4 py-2 rounded-md bg-[#FAB1A0] text-white shadow-sm cursor-pointer hover:bg-[coral]'>
    

      {click ?
 <>
  <CircularProgress color='inherit' size={15} />
  <span className='text-sm font-bold text-white'>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
           <BiTimeFive size={20} className='ml-2'/>
      <label className=' cursor-pointer font-bold  w-11'>SET</label>
            </>
           
         }
        
      </div>
    </CardFooter>
    </Card>
  )
}

export default ScheduleForm