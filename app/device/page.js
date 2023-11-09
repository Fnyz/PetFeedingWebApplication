'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiLogOut } from "react-icons/bi";
import { TextField } from '@mui/material'   
import { signOut} from 'firebase/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import {getDocs, collection} from 'firebase/firestore'
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';

function page() {

    const router = useRouter();

    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [data, setUserData] = useState({});
    
    const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


    useEffect(()=>{
        const user = localStorage.getItem("user");
        if(user){
            const data = JSON.parse(user);
            setUserData(data);
        }
    },[])


    


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
        setDeviceName('');
        setPassword('')
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
        setDeviceName('');
        setPassword('')
        alert('Password is incorrect!, please try again.');
      
        return;
      }


      if(email.toLowerCase().trim() !== credentials.email.toLowerCase().trim() || DeviceName.toLowerCase().trim() !==  deviceName.toLowerCase().trim()) {
        setDeviceName('');
        setPassword('')
       alert('Device not found! Please try again.');
       return;
      }



      if(email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && DeviceName.toLowerCase().trim() ===  deviceName.toLowerCase().trim()) {
        setDeviceName('');
        setPassword('')
        localStorage.setItem('credentials', JSON.stringify(credentials))
        window.location.href = '/dashboard';
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

    console.log(password)
    
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
                   <FormControl className=' mt-2' variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
                   <a onClick={handleSubmitAuth} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 cursor-pointer hover:bg-[coral] ease-in text-center'>CONNECT</a>
                   </div>
                </div>
                
            </div>
        </div>
  

    </div>
  )
}

export default page