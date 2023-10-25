

'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import { BiLogoGoogle } from "react-icons/bi";
import Link from 'next/link';
import { auth , db} from '@/app/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loginform from '@/app/component/Loginform';
import { useRouter } from 'next/navigation';











function page() {

    const router = useRouter()


 
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {

        'use client'

        e.preventDefault();

        router.push('/device', {
            data: 'hello'
        })
    
        


        
        // signInWithEmailAndPassword(auth, email, password)
        // .then((userCredential) => {
      
        //     const user = userCredential.user;
      
                 
        //     if(!user.emailVerified){
        //       return;
        //     }
      
            
      

      
        //     const profile = {
        //       email: user.email,
        //       id: user.uid,
        //     }

        //     setEmail('');
        //     setPassword('');

        //     history.push("/device");
            
        //     return;
       
       
        // })
        // .catch((error) => {
      
        //   let errorMessage = null;
      
      
        //   switch(error.code) {
        //     case "auth/missing-password":
        //       errorMessage = "Password is missing, please try again!";
        //     break;
        //     case "auth/invalid-email":
        //       errorMessage = "Email is in valid format, please try again!";
        //     break;
        //     case "auth/weak-password":
        //       errorMessage = "Password must be at least 6 characters long.";
        //     break;
        //     case "auth/wrong-password":
        //       errorMessage = "Password is incorrect!";
        //     break;
        //     case 'auth/user-not-found':
        //       errorMessage = "Email is not registered!";
        //     break;
        //     case 'auth/invalid-login-credentials':
        //       errorMessage = "Account is not registered yet.";
        //     break;
        //     case 'auth/too-many-requests':
        //       errorMessage = "Access to this account is temporarily disabled due to many failed login attemps. You can immediately restore it by resetting your password or you can try again later.";
        //     break;
        //     default:
             
        //   }
      
        //   if(errorMessage){
        //     console.log(errorMessage)
      
        //   }
      
      
        // });
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
            
        />
        </div>
        <div className='flex flex-col gap-5 pl-5'>
        <div className='flex flex-1 flex-col gap-5'>
        <div className='flex flex-col'>
        <label className='font-bold text-[40px]'>Welcome user!</label>
        <label className='text-sm opacity-[0.7]'>Login to continue</label>
       
        </div>
        <TextField id="outlined-basic" label="Email" variant="outlined" className='w-[500px]' placeholder='noonenero@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
        <TextField id="outlined-basic" label="Password" type='password' variant="outlined" className='w-[500px]' placeholder='***********' onChange={(e) => setPassword(e.target.value)} value={password}/>
        </div>
        <div className='flex gap-2'>
        <button type="button" onClick={handleLogin} className='shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-2 hover:bg-[coral] ease-in' >LOGIN</button>
        <button type="button" className='text-sm w-full p-2 border rounded text-[#FAB1A0] border-rose-200 font-semibold hover:text-[coral]'>FORGET PASSWORD</button>
        </div> 
        <label className='text-sm opacity-[0.8]'>
           | Login with 
        </label>

        <div className=' hover:shadow-md shadow w-full p-3 border flex justify-center items-center gap-1 rounded cursor-pointer font-semibold opacity-[0.7]'>
            <BiLogoGoogle className='h-5 w-5'/>
            <label className='text-sm'>Sign in with Google</label>
        </div>
        <Loginform />
    
        
       
        </div>
       
        </div>
       

    </div>
</div>
  )
}

export default page