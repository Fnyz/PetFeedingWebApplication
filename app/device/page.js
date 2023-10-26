'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiLogOut } from "react-icons/bi";
import { TextField } from '@mui/material'   
import { signOut} from 'firebase/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import {getDocs, collection} from 'firebase/firestore'

function page() {

    const router = useRouter();

    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [data, setUserData] = useState({});


    useEffect(()=>{
        const user = localStorage.getItem("user");
        if(user){
            const data = JSON.parse(user);
            setUserData(data);
        }
    })


    


   const handleSubmitAuth = async (e) => {

    e.preventDefault();


    const credentials = {
      DeviceName: deviceName.trim(),
      password: password,
      email:data.email,
      userId:data.id,
    }

    try {

      if(!deviceName || !password){
        alert('Please input all fields?');
       return;
      }

      if(password.length < 4) {
        alert('Password must be at least 4 to 6 characters long!')
        setDeviceName('');
        setPassword('')
        return;
      }

      const querySnapshot = await getDocs(collection(db, "Device_Authorization"));
      querySnapshot.forEach((doc) => {
  
     

      const {email, DeviceName, password: pass } = doc.data();

      if(password !== pass) {
        alert('Password is incorrect!, please try again.');
        setDeviceName('');
        setPassword('')
        return;
      }


      if(email.toLowerCase().trim() !== credentials.email.toLowerCase().trim() || DeviceName.toLowerCase().trim() !==  deviceName.toLowerCase().trim()) {
        setDeviceName('');
        setPassword('')
       alert('Device not found! Please try again.');
       return;
      }



      if(email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && DeviceName.toLowerCase().trim() ===  deviceName.toLowerCase().trim()) {
        localStorage.setItem('credentials', credentials)
        window.location.href = '/dashboard';
        setDeviceName('');
        setPassword('')
        return;
      }

      
});




      
    } catch (error) {
      
    }
    

    



   
   }




    



    const logOut = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            router.push('/login')
          }).catch((error) => {
            console.log(error);
          });
    }
    
  return (
    <div  className="h-screen relative">

        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
        />

        <div className='gap-7 justify-center items-center flex absolute top-0 left-0 w-[100%]  p-5 h-[100%] '>
            <div className='flex flex-1  justify-center items-center h-screen'>
              
        <Image
            src="/Image/undraw_two_factor_authentication_namy.svg"
            width={600}
            height={600}
            quality={100}
            alt='back image'
        />
            </div>
            <div className='flex flex-1 h-screen relative  items-center'>
                <a href='/login' className='absolute right-5 top-5' onClick={logOut}> 
                <BiLogOut  size={30}/>
                </a>
                
                <div className='w-[90%]'>
                  
                   <h1 className='font-bold text-[30px]'>Connect Via Device</h1>    
                   <span className='text-sm opacity-[0.8]'>Please input fields to connect</span>
                   <div className='gap-2 flex flex-col'>
                   <TextField id="outlined-basic" label="Devicename" variant="outlined" className=' mt-2' placeholder='KissMemama' value={deviceName} onChange={(e)=> setDeviceName(e.target.value)}/>
                   <TextField id="outlined-basic" type='password' label="Password" variant="outlined" placeholder='2456*********' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                   <a onClick={handleSubmitAuth} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 cursor-pointer hover:bg-[coral] ease-in text-center'>CONNECT</a>
                   </div>
                </div>
                
            </div>
        </div>
  

    </div>
  )
}

export default page