

'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import { BiLogoGoogle } from "react-icons/bi";
import Link from 'next/link';
import { auth} from '@/app/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';



function page() {

    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = React.useState(false);

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
 
            if(!user.emailVerified){
              return;
            }
      
  
            const profile = {
              email: user.email,
              id: user.uid,
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


  return (
    <div className="h-screen relative">
  
        <Image
            src="/Image/WebBackground.png"
            layout="fill"
            
            quality={100}
            alt='back image'
        />
  
   <div className='absolute top-0 left-0 '>
        <div className='flex justify-end w-screen px-10 mt-5'>
            <span className='mr-1 text-sm'>New user?</span>
            <Link href="/register" className='text-red-700 font-semibold text-sm'>Sign-up.</Link>
           
        </div>
        <div className='flex  flex-1 items-center px-2 gap-5'>
        <div className='border-r-2 ml-5 w-[900px] h-[900px] relative md:block hidden'>
        <Image
            src="/Image/logo.png"
            fill
            objectFit='contained'
            alt='this is a logo image'
            quality={100}
            
        />
        </div>
        <div className='flex flex-col gap-5 pl-5'>
        <div className='flex flex-1 flex-col gap-5'>
        <div className='flex flex-col'>
        <label className='font-bold text-[30px]'>WELCOME USER!</label>
        <label className='text-sm opacity-[0.7]'>Login to continue</label>
       
        </div>
        <TextField id="outlined-basic" label="Email" variant="outlined" className='w-[500px]' placeholder='noonenero@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
        <FormControl className='w-[500px]' variant="outlined" onChange={(e) => setPassword(e.target.value)} value={password}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
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
        </div>
        <div className='flex gap-2'>
        <button type="button" onClick={handleLogin} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 hover:bg-[coral] ease-in' >LOGIN</button>
      
        <button type="button" className='text-sm w-full p-4 border rounded text-[#FAB1A0] border-rose-200 font-semibold hover:text-[coral]'>FORGET PASSWORD</button>
        </div> 
        <label className='text-sm opacity-[0.8]'>
           | Login with 
        </label>

        <div className=' hover:shadow-md shadow w-full p-3 border flex justify-center items-center gap-1 rounded cursor-pointer font-semibold opacity-[0.7]'>
            <BiLogoGoogle className='h-5 w-5'/>
            <label className='text-sm'>Sign in with Google</label>
        </div>
        
    
        
       
        </div>
       
        </div>
       

    </div>
</div>
  )
}

export default page