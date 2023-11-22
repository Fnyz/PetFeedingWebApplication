'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiLogOut } from "react-icons/bi";
import { TextField } from '@mui/material'   
import { signOut} from 'firebase/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/navigation';
import {updateDoc , collection, query, onSnapshot, doc, where, getDocs} from 'firebase/firestore'
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
import CryptoJS, { SHA256 } from 'crypto-js'
import { BiSolidDevices } from "react-icons/bi";
import { FaConnectdevelop } from "react-icons/fa6";
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';
function page() {

    const router = useRouter();

    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [data, setUserData] = useState({});
    const [deviceList, setDeviceList] = useState([]);
    const [email, setEmail] = useState('');
    const [show, setShow] = useState(false);
    const [listUser, setUserList] = useState([]);
    const [isClient, setClient] = useState(false);
    const [click, setClick] = useState(false);
    
    const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


    useEffect(()=>{
      setClient(true);
        const user = localStorage.getItem("user");
        if(user){
            const data = JSON.parse(user);
            setUserData(data);
            setEmail(data.email)
        }
       
    },[])


     
    const getListUser = () => {
      const q = query(collection(db, "users"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push({data:doc.data(), id:doc.id});
    });
    setUserList(dt);

  });
  
    }






    
    const getListDevice = () => {
      const q = query(collection(db, "Device_Authorization"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push({data:doc.data(), id:doc.id});
    });
    setDeviceList(dt);
    const user = localStorage.getItem("user");
    if(user){
        const data = JSON.parse(user);
        const res = dt.find(d => d.data.Email === data.email);
        if(!res) {
          setShow(true); 
          return;
        };

        setDeviceName(res.data.DeviceName);


    }
    

  });
  
    }


  

    useEffect(()=>{
      getListDevice();
      getListUser();
    },[])





    const handleNewDevice = async () => {
      const res = deviceList.find(d => d.data.Email === '' && d.data.Token === 0);
     
const devicess = doc(db, "Device_Authorization", res.id);

await updateDoc(devicess, {
  Email: email.trim(),
  Token:1,
}).then(async()=>{

const q = query(collection(db, "users"), where("email", "==", email.trim()));
const querySnapshot = await getDocs(q);
querySnapshot.forEach(async (docss) => {
   
  const devicesss = doc(db, "users", docss.id);
  await updateDoc(devicesss, {
    hasDevice: true,
    Devicename:res.data.DeviceName,
  }).then(()=> {
    setDeviceName(res.data.DeviceName);
    setShow(false);
  })
 
});



});
   
 
    }


    


    


   const handleSubmitAuth = async (e) => {

    e.preventDefault();
    setClick(true);


 
    const credentials = {
      DeviceName: deviceName.trim(),
      email:data.email,
      userId:data.id,
    }


      if(!deviceName || !password){
        setClick(false);
        setPassword('')
        Swal.fire({
          title: "Warning?",
          text: "Please input all fields.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
        })
      
       return;
      }

      if(password.length < 4) {
        setClick(false);
        Swal.fire({
          title: "Warning?",
          text: "Password must be at least 4 to 6 characters long!",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
        })
        setPassword('')
        return;
      }



      const res = deviceList.find(d => d.data.Email === data.email && d.data.DeviceName.trim() === deviceName.trim())




      var hashPass = CryptoJS.SHA256(password, '').toString();
 

      if(!res){
        setClick(false);
         Swal.fire({
          title: "Warning?",
          text: "Email is dont have a device",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Okay, Thank you..",
          
        })
         setShow(true);
        return;
      }

     
      if(res.data.Password.trim() !== hashPass.trim() || res.data.Email !== data.email) {
        setClick(false);
        Swal.fire({
          title: "Warning?",
          text: "Invalid Credentials, please try again.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Try again",
        })
        setPassword('');
        return;
      }


      if(res.data.Password.trim() === hashPass.trim() && res.data.Email === data.email) {
        
        const a = listUser.find(d => d.data.email === res.data.Email);
        if(!a) return;
        const devicesss = doc(db, "users", a.id);
        await updateDoc(devicesss, {
          isActive:true
        }).then(()=> {
          setPassword('')
          setClick(false);
          Swal.fire({
            title: "Welcome user!",
            text: "Your account is logged in successfully.",
            icon: "success",
            showCancelButton: false,
          })
          localStorage.setItem("credentials", JSON.stringify(credentials));
          window.location.href = '/dashboard';
          return;
        })
       
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


    if(!isClient){
      return;
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
            <div className='flex flex-1  justify-center items-center h-screen max-md:hidden '>
              
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
                
                <div className='w-[85%] max-md:w-[100%]'>
                  
                   <h1 className='font-bold text-[30px]'>Connect Via Device</h1>    
                   <span className='text-sm opacity-[0.8]'>{show ? 'Please click the button below to add device.': 'Please input fields to connect.'}</span>
                   <div className='gap-2 flex flex-col mt-4'>
               {!show && (
                <>
                    <TextField disabled id="outlined-basic" label="Devicename" variant="outlined"  placeholder='KissMemama' value={deviceName} onChange={(e)=> setDeviceName(e.target.value)}/>
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
                </>
               )}
        <Dialog>
      <DialogTrigger asChild>
        {show && (
  <div className='flex justify-center items-center gap-2 text-sm font-bold rounded text-white w-full border bg-[#FAB1A0] transition-all  p-4 cursor-pointer hover:bg-[coral] ease-in text-center '>
    <BiSolidDevices size={20}/>
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

                 {!show && (
                   <a onClick={handleSubmitAuth} className='shadow text-sm font-bold rounded flex justify-center items-center gap-2 text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 cursor-pointer hover:bg-[coral] ease-in text-center'>
                    {click ?
 <>
  <CircularProgress color='inherit' size={20}/>
  <span>
   PLEASE WAIT...
  </span>
 </>
          : 
            <>
           
        
           <FaConnectdevelop size={20} color='white'/>
                    CONNECT
            </>
           
         }
                    </a>

                 )}
                   </div>
                </div>
                
            </div>
        </div>
  

    </div>
  )
}

export default page