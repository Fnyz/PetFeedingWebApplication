'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { FaBalanceScale } from "react-icons/fa";
import { BiEditAlt, BiSave, BiSolidFolderOpen} from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BiRfid, BiPlus } from "react-icons/bi";
import { Avatar } from '@mui/material';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { petsData } from '../animeData';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image';
import { collection, addDoc, query, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';


function generateFakePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}


function generateFakeWeight(min, max) {
  const fakeWeight = (Math.random() * (max - min) + min).toFixed(2); // Generates a random weight between min and max with 2 decimal places
  return `${fakeWeight} kg`;
}




function AddPetsForm() {

    const [dog, setDog] = React.useState([]);
    const [cat, setCat] = React.useState([]);
    const [choose, setChoose] = React.useState('');
    const [petname, setPetName] = React.useState('');
    const [age, SetPetAge] = React.useState('');
    const gender = [
      {val: 'male', label: 'Male' },
      {val: 'female', label: 'Female' },
    ]
    const [genders, setGenders] = React.useState('');
    const [rfid, SetRfid] = React.useState('');
    const [weight, SetWeight] = React.useState('');
    const [goalWeight, SetGoalWeight] = React.useState('');
    const [petDatas, setPetDatas] = React.useState([]);
    const [credential, setCredential] = React.useState({});


    const getAllDatas = () => {
      const q = query(collection(db, "List_of_Pets"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push(doc.data());
    });
  
    setPetDatas(dt);
   
   
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

    
  
      if(!petname || !genders || !rfid || !weight || !goalWeight || !age){
        alert('Please input all fields.')
        return;
      }
  
       const res = petDatas.find(d => d?.Petname.toLowerCase().trim() === petname.toLowerCase().trim() && d?.DeviceName.toLowerCase().trim() === credential.DeviceName.toLowerCase().trim());
      
       if(!res){
        
        const addListPet = await addDoc(collection(db, "List_of_Pets"), {
          DeviceName:credential.DeviceName.trim(),
          Petname: petname,
          Gender:genders,
          Rfid:rfid,
          Weight:weight,
          GoalWeight:goalWeight,
          Age:age,
          image:choose || null,
          synced:false,
          Created_at: serverTimestamp(),
          Updated_at: serverTimestamp(),
        });
  
        if(addListPet.id){
          await addDoc(collection(db, "Task"), {
            type:'refresh_pet',
            deviceName:credential.DeviceName.trim(),
            document_id:addListPet.id,
            request:null,
          });
    
          setPetName('');
          setGenders('');
          SetGoalWeight('');
          SetPetAge('');
          SetRfid('');
          SetWeight('');
          alert('Successfully added new pet!');
        }
  
        return;
       }
  
       if(res.Petname.toLowerCase().trim() === petname.toLowerCase().trim()){
      
        setPetName('');
        alert('Pet is already exists!');
       }
        
    }
  


    const handleFakeRFID = () => {
      setTimeout(() => {
        const fakePassword = generateFakePassword(20);
        SetRfid(fakePassword)
      }, 3000);
  
    }
  
    const handleFakeWeight = () => {
      setTimeout(() => {
        const fakeWeight = generateFakeWeight(15, 25);
        SetWeight(fakeWeight)
      }, 3000);
  
    }


 

    
  React.useEffect(()=>{
    const dog = petsData.filter(item => item.category === 'Dog');
    const cat = petsData.filter(item => item.category === 'Cat');

    setDog(dog);
    setCat(cat);
    setChoose('/Image/anyaCuttie.jpg');
  },[])

  return (
    <Card className="w-full">
    <CardHeader>
     <CardTitle>Add pet!</CardTitle>
     <CardDescription>Fill out this form below.</CardDescription>
    </CardHeader>
    <CardContent>
    <div className=' flex justify-center items-center'>
    <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={choose}
  sx={{ width: 100, height: 100, objectFit:'contain' }}
/>      
        </div>
    </div>
    
    <Sheet>
      <SheetTrigger asChild >
        <div className='my-4 flex justify-center items-center'>
        <div className='flex justify-center items-center gap-1 p-3  rounded-md  bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer max-md:w-[200px]'>
        <BiEditAlt  size={15} color='white' />
          <label className='text-[10px] text-white font-bold cursor-pointer'>CHOOSE PET IMAGE</label>
        </div>
        </div>
     
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>CHOOSE YOUR IMAGE</SheetTitle>
          <SheetDescription>
            Feel free to choose it your favorite image here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <label className='font-bold text-blue-500  opacity-50'>Dog's</label>
          <ImageList  cols={3} rowHeight={115}>
      {dog.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && "border-2 border-[#FAB1A0]"} w-[100px] h-[100px] m-1 border  overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=>{
            setChoose(item.image)
          }}>
          <Image 
          src={item.image}
          fill
          objectFit='contain'
          className='p-2'
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>


    <label className='font-bold text-pink-500 opacity-50'>
  
       Cat's</label>
          <ImageList  cols={3} rowHeight={115}>
      {cat.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && "border-2 border-[#FAB1A0]"} border m-1 w-[100px] h-[100px]  overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=> setChoose(item.image)}>
          <Image 
          src={item.image}
          fill
          objectFit='contain'
          className='p-2'
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>

     <div className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer'>
      <BiSolidFolderOpen size={20} color='white'/>
      <label className='text-white font-bold cursor-pointer'>UPLOAD IMAGE</label>
   
     </div>
         
         
        </div>
        <SheetFooter>
          <SheetClose asChild>
          <div className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  border-[#FAB1A0] hover:shadow-md transition-all ease-in cursor-pointer w-full'>
<BiSave size={20} color='#FAB1A0'/>
<label className='text-[#FAB1A0] font-bold cursor-pointer'>SAVE CHANGES</label>

</div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>

     <form>
       <div className="grid w-full items-center gap-4">
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="petname">Petname</Label>
           <Input id="petname" placeholder="Name of pet here" value={petname} onChange={(e)=>{
              setPetName(e.target.value);
            }} />
         </div>
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="age">Age</Label>
           <Input id="age" placeholder="Input Age here"  value={age} onChange={(e)=>{
              SetPetAge(e.target.value);
            }} />
         </div>
         
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="gender">Gender</Label>
           <Select  onValueChange={(e)=> setGenders(e)}  >
             <SelectTrigger id="gender">
               <SelectValue placeholder="Select Gender" />
             </SelectTrigger>
             <SelectContent position="popper ">
              {gender.map((d, i)=> {
                return (
                  <SelectItem value={d.val} key={i}>{d.label}</SelectItem>
                )
              })}
         
            
             </SelectContent>
           </Select>
         </div>
         <div className='flex justify-between  items-center  gap-2'>
    
         <div className="flex flex-col w-full space-y-1.5 ">
           <Label htmlFor="rfid">RFID</Label>
           <Input id="rfid" placeholder="Generate RFID here" disabled  value={rfid} onChange={(e)=>{
              SetRfid(e.target.value);
            }}/>
         </div>
         <div className=' gap-2 h-[40px] mt-5 flex justify-center items-center w-full rounded-sm cursor-pointer   bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in' onClick={handleFakeRFID}>
            <BiRfid size={20} color='white' className='max-md:hidden block'/>
             <label className='text-white font-bold cursor-pointer'>Set RFID</label>
         </div>
    
        
       
         </div>
    
         <div className='flex justify-between  items-center  gap-2  '>
    
    <div className="flex flex-col w-full space-y-1.5 ">
    <Label htmlFor="rfid">Weight</Label>
    <Input id="weight"  placeholder="Pet weight"  value={weight} onChange={(e)=>{
              SetWeight(e.target.value);
            }}  />
    </div>
    <div className='gap-2 cursor-pointer h-[40px] mt-5 flex justify-center items-center w-full rounded-sm   bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in' onClick={handleFakeWeight}>
        <FaBalanceScale size={20} color='white' className=' max-md:hidden block'/>
    <label className='text-white font-bold cursor-pointer'>Weight PET</label>
    </div>
     </div>
    
     <div className="flex flex-col space-y-1.5">
           <Label htmlFor="goalWeight">Goal Weight</Label>
           <Input id="goalWeight" placeholder="Input goal weight of pet"  value={goalWeight} onChange={(e)=>{
              SetGoalWeight(e.target.value);
            }} />
         </div>
    
       </div>
     </form>
    </CardContent>
    <CardFooter className="flex justify-between">
     <Button variant="outline">CLEAR</Button>
     <div onClick={handleSubmit} className='flex transition-all ease-in  justify-center items-center gap-1 border p-2 rounded-md bg-[#FAB1A0] text-white shadow-sm cursor-pointer hover:bg-[coral]'>
      <BiSave size={20} />
      <label className=' cursor-pointer font-bold '>SUBMIT</label>
      </div>
   
    </CardFooter>
    </Card>
  )
}

export default AddPetsForm