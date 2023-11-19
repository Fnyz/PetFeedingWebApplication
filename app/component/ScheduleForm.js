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
import { BiXCircle, BiAddToQueue, BiShowAlt, BiTimeFive, BiX, BiEdit ,BiSolidTrash, BiSave   } from "react-icons/bi";
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
    const a = petSchesData.find((d) => d.dts.Days === days && d.dts.DeviceName === credential.DeviceName)
    const b = a?.dts.ScheduleTime.find((d) => d.time === currentTime);
    
    if(b){
     const res = a?.dts.ScheduleTime.filter(d => d.time !== currentTime);
     const newArray =  [
      {cups: cups2,
       parameters:parameters,
       time:time2,
      }
     ]
    
     const updateSched = [...res, ...newArray]
     const docRef = doc(db, 'feeding_schedule', a.id);
     updateDoc(docRef, {
      ScheduleTime:updateSched,
   }).then(()=>{
     alert('Time is updated successfully');
   });


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
      const res = listSched.find(d => d.data.Petname.toLowerCase().trim() === name.toLowerCase().trim());
      
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

    if(!twelveHourTime || !caps){
      alert('Please fill out all fields');
      return;
    }


    const res  = listSched.find(d => d.data.Days === chooseDay && d.data.DeviceName === credential.DeviceName && d.data.Petname === name);
    
    const exist  = res?.data.ScheduleTime.find(s => s.time === militaryTime.trim() && s.parameters === parameters)
    
    if(exist){
          alert(`Schedule ${exist.time} time is already set please try again.`);
      return;
    }

  
    // Check if the time already exists in the list

   

   

    const existingItem = scheds1.find((item) => item.time === militaryTime.trim() && item.parameters === parameters);
   
    if (existingItem) {
      alert(`Time ${existingItem.time} already exists. Remove the existing entry first.`);
      return;
    }

    // Add the new food item and time to the list
    setSchedules([...scheds1, { time: militaryTime.trim(), cups: caps, parameters }]);
     
    


    const existingItem2 = scheds2.find((item) => item.time === militaryTime2.trim() && item.parameters2 === parameters2);
    if (existingItem2) {
      // You can handle the duplicate time case here
      alert(`Time ${existingItem2.time} already exists. Remove the existing entry first.`);
      return;
    }

    // Add the new food item and time to the list
    setSchedules2([...scheds2, { time: militaryTime2.trim(), cups: caps, parameters2 }]);

    setCaps('');  
    
  };




  const getAllListSched = () => {
    const q = query(collection(db, "feeding_schedule"));
   onSnapshot(q, (querySnapshot) => {
  const dt = [];
  const d = [];
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
      const q = query(collection(db, "List_of_Pets"));
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
      const petSchedule = {
        DeviceName: credential.DeviceName,
        Petname: name,
        Days: chooseDay,
        ScheduleTime: scheds1,
        synced:false,
        created_at: serverTimestamp(),
      }


   
  
      if(!name || !chooseDay || !scheds1.length) {
       alert('Feel out all fields.')
        return;
      }
  
      const res = listSched.find(d => d.data.Days.toLowerCase().trim() === chooseDay.toLowerCase().trim());
  
      if(!res){
        const docRef = await addDoc(collection(db, "feeding_schedule"), petSchedule);
  
        if(docRef.id){
          setSchedules([])
          setSchedules2([])
          setName('')
          await addDoc(collection(db, "Task"),{
            type:'Schedule',
            deviceName: credential.DeviceName,
            document_id: docRef.id,
            request:null,
          });
          alert('Schedule added successfully');
        }
        return;
       }
  

       const currentSched  = res.data.ScheduleTime || [];
       const updatedSched = [...currentSched, ...scheds1];
       const docRef = doc(db, 'feeding_schedule', res.id);
       updateDoc(docRef, {
         ScheduleTime:updatedSched,
      }).then(()=>{
        alert('Pet Schedule updated successfully');
        setSchedules([])
        setSchedules2([])
        setName('')
        setTwelveHourTime('')
      });
      return;
   


    
        
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
          value={twelveHourTime}      
          onChange={(e) =>  setTwelveHourTime(`${e.$H}:${e.$m}`)}
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
      <BiEdit size={20}  className='hover:text-blue-600 cursor-pointer text-blue-400 ' onClick={()=> handleUpdateTimeManage(s.time, s.cups)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Time Schedule</DialogTitle>
          <DialogDescription>
            Make changes to the schedule time here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Time
            </Label>
            <Input id="name" value={time2} className="col-span-3" onChange={(e)=> setTime2(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Cups
            </Label>
            <Input id="username" value={cups2} className="col-span-3" onChange={(e)=> setCups2(e.target.value)}  />
          </div>
        </div>
        <DialogFooter className=' flex  max-md:items-end'>
          <div className='flex justify-center items-center gap-2 p-2 w-[60%]  text-center rounded-md font-bold bg-[#FAB1A0] text-white cursor-pointer hover:bg-[coral] transition-all ease-in' onClick={()=> handleUpdateTimeHere(d.dts.Days, s.parameters)}>
            <BiSave size={20}/>
            <span>SAVE CHANGES</span>
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
    
     <Button variant="outline">CLEAR</Button>
     <div onClick={handleSubmit} className='flex transition-all ease-in  justify-center items-center gap-1 border p-2 rounded-md bg-[#FAB1A0] text-white shadow-sm cursor-pointer hover:bg-[coral]'>
      <BiTimeFive size={20} className='ml-2'/>
      <label className=' cursor-pointer font-bold  w-11'>SET</label>
        
      </div>
    </CardFooter>
    </Card>
  )
}

export default ScheduleForm