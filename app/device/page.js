'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiLogOut } from "react-icons/bi";
import { TextField } from '@mui/material'   
import { signOut} from 'firebase/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import {updateDoc , collection, query, onSnapshot, doc} from 'firebase/firestore'
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import bcrypt from 'bcryptjs'
import CryptoJS, { SHA256 } from 'crypto-js'

function page() {

    const router = useRouter();

    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [data, setUserData] = useState({});
    const [deviceList, setDeviceList] = useState([]);
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    
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
            setEmail(data.email)
        }
    },[])


    
    const getListDevice = () => {
      const q = query(collection(db, "Device_Authorization"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push({data:doc.data(), id:doc.id});
    });
    setDeviceList(dt);
    console.log(dt);

  });
  
    }


  

    useEffect(()=>{
      getListDevice()
    },[])





    const handleNewDevice = async () => {
      const res = deviceList.find(d => d.data.Email === '' && d.data.Token === 0);
     
const devicess = doc(db, "Device_Authorization", res.id);
await updateDoc(devicess, {
  Email: email.trim(),
  Token:1,
});
    setDeviceName(res.data.DeviceName);
    setShow(false);
 
    }


    


    


   const handleSubmitAuth = async (e) => {

    e.preventDefault();


 
    const credentials = {
      DeviceName: deviceName.trim(),
      email:data.email,
      userId:data.id,
    }


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



      const res = deviceList.find(d => d.data.Email === data.email && d.data.DeviceName.trim() === deviceName.trim())




      var hashPass = CryptoJS.SHA256(password, '').toString();
 

      if(!res){
         alert('Email is dont have a device');
         setShow(true);
        return;
      }

     
      if(res.data.Password.trim() !== hashPass.trim() || res.data.Email !== data.email) {
        alert('Invalid Credentials, please try again.')
        setDeviceName('');
        setPassword('');
        return;
      }


      if(res.data.Password.trim() === hashPass.trim() && res.data.Email === data.email) {
        setDeviceName('');
        setPassword('')
        localStorage.setItem("credentials", JSON.stringify(credentials));
        alert('Welcome user, please wait for a moment.');
        window.location.href = '/dashboard';
        return;
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
        <Dialog>
      <DialogTrigger asChild>
        {show && (
  <div className=' text-sm font-bold rounded text-[#FAB1A0] w-full border border-[#FAB1A0] transition-all  p-4 cursor-pointer hover:text-[coral] ease-in text-center '>
  ADD DEVICE
</div>
        )}
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bind Device</DialogTitle>
          <DialogDescription>
           Please click submit to bind a new device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} placeholder='@pedropenduco' className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleNewDevice}>SUBMIT</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
                   <a onClick={handleSubmitAuth} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 cursor-pointer hover:bg-[coral] ease-in text-center'>CONNECT</a>
                   </div>
                </div>
                
            </div>
        </div>
  

    </div>
  )
}

export default page