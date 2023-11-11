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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

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
import { BiPlus } from "react-icons/bi";
import { collection, addDoc, query, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';



const days = [
    {day: 'Mon'},
    {day: 'Tue'},
    {day: 'Wed'},
    {day: 'Thu'},
    {day: 'Fri'},
    {day: 'Sat'},
    {day: 'Sun'},
    {day: 'Everday'},

]



function FormRow({days, setChooseDay}) {
    return (
      <React.Fragment>
        {days.map((d, i)=> {
            return (
                <Grid item xs={5}  key={i}  >
                <Item className='cursor-pointer font-bold bg-[#FAB1A0] text-white hover:bg-[coral]' onClick={()=> setChooseDay(d.day)}>{d.day}</Item>
                </Grid>
            )
        })}
      </React.Fragment>
    );
  }

  







function ScheduleForm() {

  
    const [petname, setPetName] = React.useState('');   
    const [genders, setGenders] = React.useState('');
    const [petDatas, setPetDatas] = React.useState([]);
    const [credential, setCredential] = React.useState({});
    const [data, setDataName] = React.useState([])
    const [chooseDay, setChooseDay] = React.useState('');






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
    },[])


    const handleShowCredData = () => {
      const user = localStorage.getItem("credentials")
      if(user){
          const datas = JSON.parse(user);
          setCredential(datas);
      }
    }

    const handleSubmit = async () => {

    console.log(chooseDay)
        
    }
  


 


 

    

  return (
    <Card className="w-[440px]">
    <CardHeader>
     <CardTitle>Scheduler!</CardTitle>
     <CardDescription>Fill out this form below.</CardDescription>
    </CardHeader>
    <CardContent>


    
       <div className="grid w-full items-center gap-4 ">
       <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={data}
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label="Petname" />}
    />
         <div className="flex flex-col space-y-1.5">
           <Label className='mb-2'>Days</Label>

           <Box sx={{ flexGrow: 1 }}>
         <Grid container spacing={1} direction='row' className='ml-5' >
        <Grid container item spacing={2} >
            <FormRow days={days} setChooseDay={setChooseDay} />
       </Grid>
 
      </Grid>
      
    </Box>


    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label="Set Time and Date"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
           
         </div>
         
    
    
       </div>
   
    </CardContent>
    <CardFooter className="flex justify-between">
     <Button variant="outline">CLEAR</Button>
     <Button className='gap-1' onClick={handleSubmit}> <BiPlus size={20}/> SUBMIT </Button>
    </CardFooter>
    </Card>
  )
}

export default ScheduleForm