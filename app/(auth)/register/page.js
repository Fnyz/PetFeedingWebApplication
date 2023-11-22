'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import Link from 'next/link'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { auth, db } from '@/app/firebase'
import { setDoc , doc} from 'firebase/firestore';
import { createUserWithEmailAndPassword , sendEmailVerification} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';



function page() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter()
    const [isclient, setIsClient] = useState(false);
    const [click, setClick] = useState(false);
 

    const [showPassword, setShowPassword] = React.useState(false);


    useEffect(()=>{
     setIsClient(true);
    },[])




    const handleSubmit = () => {

      setClick(true);
    
        
    
        if(!firstName || !lastName || !username || !password){
          setClick(false);
          Swal.fire({
            title: "Warning?",
            text: "Please input all fields.",
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Yes, I will",
          })
          return;
        }
    
    
     
    
            createUserWithEmailAndPassword(auth,
              email,
              password
            ).then((users) => {
    
              const user = auth.currentUser;
            
                sendEmailVerification(user)
               .then(() => {
               const ref = doc(db, 'users', users.user.uid)
               setDoc(ref,{
                  firstname: firstName,
                  lastname: lastName,
                  username: username,
                  email:email,
                  userId: users.user.uid,
                  image: null,
                  deviceId: null,
                  registered: false,
                  created_at: Date.now(),
                  isAdmin: false,
                  hadDevice: false,
                  Devicename:null
               }).catch((error) => {
              console.log('network error', error)});
    
              setFirstname('')
              setLastname('')
              setEmail('')
              setUsername('')
              setPassword('')
              setClick(false);
              Swal.fire({
                title: "Warning?",
                text: "Account created successfully, please check your email to verify immediately.",
                icon: "success",
                confirmButtonColor: "#FAB1A0",
                confirmButtonText: "Okay, Thank you!",
              }).then((result) => {
                if (result.isConfirmed) {
                  setTimeout(() => {
                    router.push('/login');
                 }, 3000);
                }
              });
             
             
            })
    
              
        
          }).catch((error) => {
    
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
                case 'auth/email-already-in-use':
                  errorMessage = "User email already exists.";
                break;
                default:
              }
    
              if(errorMessage){
                setClick(false);
                Swal.fire({
                  title: "Warning?",
                  text: errorMessage,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Try again",
                })
              }
        
         
              
          })
    
   
    
        
      }
    
 
    
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if(!isclient){
    return;
  }
  return (
    <div className="h-screen relative w-full">
  
        <Image
            src="/Image/WebBackground.png"
            layout="fill"
            quality={100}
            alt='back image'
        />
  
   <div className='absolute top-0 left-0 right-0 bottom-0 border w-screen h-full '>
        
         <div className=' flex h-full border justify-center items-center '>
         <div className='    relative w-full h-[90%] border-r-2 max-md:hidden block'>
        
      
      <Image
          src="/Image/petLogo.png"
          fill
          objectFit="contained"
          alt='this is a logo image'
          quality={100}
          
      />

        </div>
        <div className='flex p-5 items-center w-full'>
        
        <div className='flex flex-col w-[75%] max-md:w-full  p-2'>
        <label className='font-bold text-[30px]'>SIGN UP!</label>
        <label className='text-sm opacity-[0.7]'>Fill out this form.</label>
         <div className='flex flex-col gap-3 mt-5'>

         <TextField id="outlined-basic1" label="Firstname" variant="outlined" className='w-full' placeholder='John' value={firstName} onChange={(e)=> setFirstname(e.target.value)}/>
        <TextField id="outlined-basic2" label="Lastname" variant="outlined" className='w-full' placeholder='Doe' value={lastName} onChange={(e)=> setLastname(e.target.value)}/>
        <TextField id="outlined-basic3" label="Username" variant="outlined" className='w-full' placeholder='PeanutButter' value={username} onChange={(e)=> setUsername(e.target.value)}/>
        <TextField id="outlined-basic4" label="Email" variant="outlined" className='w-full'placeholder='noonenero@gmail.com' value={email} onChange={(e)=> setEmail(e.target.value)} />
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
        <button type="button" onClick={handleSubmit}  className=' flex justify-center items-center gap-2 shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 hover:bg-[coral] ease-in' >
        {click ?
 <>
  <CircularProgress color='inherit' size={20}/>
  <span>
   PLEASE WAIT...
  </span>
 </>
          : 
            <>
           
            <span>
            LOGIN
            </span>
            </>
           
         }
         

        </button>
        <div className='flex justify-end   mt-5'>
            <span className='mr-1 text-sm opacity-50 font-semibold '>HAVE AN ACCOUNT? </span>
            <Link href="/login" className='text-red-700 font-bold text-sm opacity-70'>SIGN-IN.</Link>
        </div>
         
         </div>
      
        </div>

  
        </div>
   

  

    
         </div>
       
       

    </div>
</div>
  )
}

export default page