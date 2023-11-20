

'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import Link from 'next/link';
import { auth} from '@/app/firebase';
import { getDocs , collection} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';




function page() {

    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = React.useState(false);

    const [allUserData, setUserData] = useState([]);
  
    const [isclient, setIsClient] = useState(false);
  
    useEffect(()=>{
      setIsClient(true);
      const gedDatas = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({id: doc.id, data: doc.data()});
        });

        setUserData(data);
      }

      gedDatas();
 
    },[])

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

    const handleLogin = async (e) => {
        e.preventDefault();


        if(!email || !password) {
            alert('Please input all fields?');
            return;
        }
    
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
      
            const user = userCredential.user;

            
            const profile = {
              email: user.email,
              id: user.uid,
            }


            const res = allUserData.find(ur => ur.id === user.uid && ur.data.isAdmin === true);
        
            if(res){
            setEmail('');
            setPassword('');

            const credentials = {
              DeviceName: null,
              email:user.email,
              userId:user.uid,
            }
            router.push('/home');
            localStorage.setItem("credentials", JSON.stringify(credentials));
            return;
            }
            
            
            
            if(!user.emailVerified){
              alert('ACCOUNT is not verified yet!');
              return;
            }
      
  
            setEmail('');
            setPassword('');

            router.push('/device');
            localStorage.setItem("user", JSON.stringify(profile));
            return;
           
            
 
           
       
       
        })
        .catch((error) => {
      
          let errorMessage = null;
      
      
          switch(error.code) {
            case "auth/missing-password":
              errorMessage = "Password is missing, please try again!";
            break;
            case "auth/invalid-email":
              errorMessage = "Email is in valid format, please try again!";
            break;
            case "auth/weak-password":
              errorMessage = "Password must be at least 6 characters long.";
            break;
            case "auth/wrong-password":
              errorMessage = "Password is incorrect!";
            break;
            case 'auth/user-not-found':
              errorMessage = "Email is not registered!";
            break;
            case 'auth/invalid-login-credentials':
              errorMessage = "Account is not registered yet.";
            break;
            case 'auth/too-many-requests':
              errorMessage = "Access to this account is temporarily disabled due to many failed login attemps. You can immediately restore it by resetting your password or you can try again later.";
            break;
            default:
             
          }
      
          if(errorMessage){
            alert(errorMessage);
      
          }
      
      
        });
    }

  if(!isclient) return;


  return (
    <div className=" h-screen relative    ">
  
        <Image
            src="/Image/WebBackground.png"
            fill
            quality={100}
            alt='back image'
            objectFit='cover'
        />
  
   <div className='absolute top-0 left-0 border bottom-0 right-0'>
       
        <div className='flex  items-center px-2 gap-2  h-full '>
        <div className='border-r-2 h-[90%] w-full   relative  max-lg:block  max-md:hidden  max-sm:hidden '>
        <Image
            src="/Image/petLogo.png"
            fill
            objectFit='cover'
            alt='this is a logo image'
            quality={100}
            
        />
        </div>
        <div className='flex flex-col gap-5 p-5  h-full w-full justify-center'>
        <div className='flex flex-col gap-5  w-[75%] max-md:w-full'>
        <div className='flex flex-col  '>
        <label className='font-bold text-[30px]'>WELCOME USER!</label>
        <label className='text-sm opacity-[0.7]'>Login to continue.</label>
       
        </div>
        <TextField id="outlined-basic" label="Email" variant="outlined" className='w-full' placeholder='noonenero@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
        <FormControl className='w-full' variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            onChange={(e) => setPassword(e.target.value)} value={password}
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
        <div className='flex gap-2'>
        <button type="button" onClick={handleLogin} className=' shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 hover:bg-[coral] ease-in' >
           LOGIN
          </button>
      
        <button type="button" className='text-sm w-full p-4 border rounded text-[#FAB1A0] gap-2 border-rose-200 font-semibold hover:text-[coral] '>
    
          FORGET PASSWORD</button>
        </div> 
        <div className='flex justify-end items-center max-sm:w-full gap-1'>
            <span className=' text-sm opacity-50 font-semibold'>NEW USER?</span>
            <Link href="/register" className='text-red-700 font-bold text-sm opacity-70'>SIGN-UP.</Link>
        </div>
        </div>
      
        
    
        
       
        </div>
       
        </div>
       

    </div>
</div>
  )
}

export default page