

'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TextField } from '@mui/material'
import Link from 'next/link';
import { auth} from '@/app/firebase';
import { getDocs , collection, query, onSnapshot, updateDoc, doc} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification  } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { BiX, BiMailSend  } from "react-icons/bi";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:10,
  boxShadow: 24,
  p: 4,
};


function page() {

    const router = useRouter()

    const [email, setEmail] = useState('');
    const [email1, setEmail1] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [allUserData, setUserData] = useState([]);
    const [isclient, setIsClient] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [deviceList, setDeviceList] = useState([]);
    const [listUser, setUserList] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [message, setMessage] = useState("You have successfully logged in to your account. Please wait for a moment..");

    useEffect(()=>{
      const user = localStorage.getItem("credentials");
      if(user){
       
        if(!user.DeviceName){
          window.location.href = "/home";
        }else{
          window.location.href = "/dashboard";
        }
      }
      
    },[])
  

    
  const getListDevice = () => {
    
    const q = query(collection(db, "Device_Authorization"));
   onSnapshot(q, async (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push({data:doc.data(), id:doc.id});
  });
      setDeviceList(dt);    
   });

  }

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



    
  
  
    useEffect(()=>{
      getListUser();
      getListDevice();
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
        setClick(true)


        if(!email || !password) {
          setClick(false)
          Swal.fire({
            title: "Warning?",
            text: "Please input all fields.",
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Yes, I will.",
            
           
          })
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
            setShowLogin(true);
            setClick(false);
            setMessage("Welcome admin you have successfully logged in to your account, please wait for a moment..")
            setTimeout(() => {
              router.push('/home');
              localStorage.setItem("credentials", JSON.stringify(credentials));
            }, 3000);
            return;
            }
            
            
           
            if(!user.emailVerified){
              setClick(false)
                Swal.fire({
                  title: "Warning?",
                  text: "Account not verified yet.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Send email verification",
                }).then((result) => {
                  if (result.isConfirmed) {
                    sendEmailVerification(user)
                   .then(() => {
                    setEmail("");
                    setPassword("")
                    Swal.fire({
                      title: "Success",
                      icon: "success",
                      text: "Email verification sent successfully, please check your email.",
                      confirmButtonColor: "#FAB1A0",
                      cancelButtonColor: "#d33",
                       confirmButtonText: "Close",
                    });
                })
                  
                 
                  }
                });
  
  
              return;
            }
      
         
         

            const res1 = deviceList.find(d => d.data.Email === user.email && d.data.registered === true);
            if(!res1){
             
             
              router.push('/device');
              localStorage.setItem("user", JSON.stringify(profile));
              setTimeout(() => {
                setClick(false)
                setEmail('');
                setPassword('');
              }, 2000);
              return;
            }

            const credentials = {
              DeviceName: res1.data.DeviceName,
              email:user.email,
              userId:user.uid,
            }



            const a = listUser.find(d => d.data.email === res1.data.Email);
            if(!a) return;
            const devicesss = doc(db, "users", a.id);
            updateDoc(devicesss, {
              isActive:true
            }).then(()=> {
              setClick(false)
              setEmail('');
              setPassword('');
              localStorage.setItem("credentials", JSON.stringify(credentials));
              setShowLogin(true);
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 3000);

              return;
            })
           
           
            
 
           
       
       
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
              errorMessage = "Invalid login credentials";
            break;
            case 'auth/too-many-requests':
              errorMessage = "Access to this account is temporarily disabled due to many failed login attemps. You can immediately restore it by resetting your password or you can try again later.";
            break;
            default:
             
          }
      
          if(errorMessage){
            setClick(false)
              Swal.fire({
                title: "Warning?",
                text: errorMessage,
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#FAB1A0",
                confirmButtonText: "Try again",
              })

              setEmail('');
              setPassword('');
          }
      
      
        });
    }




  const handleresetPassword =() => {
    setClick2(true)
    sendPasswordResetEmail(auth, email1)
    .then(() => {
      setClick2(false)
      Swal.fire({
        title: "Success?",
        text: "Password reset sent successfully, please check your email address!",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#FAB1A0",
        confirmButtonText: "Try again",
      })

      setEmail1("")
    })
    .catch((error) => {
      
      const errorMessage = error.message;
 
      Swal.fire({
        title: "Warning?",
        text: errorMessage,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#FAB1A0",
        confirmButtonText: "Try again",
      })
      setClick2(false)
      setEmail1("")
      // ..
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
        <button type="button" onClick={handleLogin} className=' flex justify-center items-center gap-2 shadow text-sm font-bold rounded text-white w-full bg-[#FAB1A0] hover:text-white transition-all hover:bg-coral  p-4 hover:bg-[coral] ease-in' >
           {click ?
 <>
  <CircularProgress color='inherit' size={20}/>
  <span className='font-bold'>
   PLEASE WAIT
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
      
        <button type="button" className='text-sm w-full p-4 border rounded text-[#FAB1A0] gap-2 border-rose-200 font-semibold hover:text-[coral] ' onClick={handleOpen}>
    
          FORGET PASSWORD</button>
        </div> 
        <div className='flex justify-end items-center max-sm:w-full gap-1'>
            <span className=' text-sm opacity-50 font-semibold'>NEW USER?</span>
            <Link href="/register" className='text-red-700 font-bold text-sm opacity-70'>SIGN-UP.</Link>
        </div>

   
        </div>
      
        
    
        
       
        </div>
       
        </div>

        <div>


        <Modal
        open={showLogin}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <Box sx={style} >
        <div className='flex justify-center items-center'>
        <Image
        width={150}
        height={150}
        src="/Image/output-onlinegiftools (6).gif"
        contentFit="cover"
       
      />

      <div>
        <div className='flex items-center gap-1'>
        <span className='font-bold text-lg'>SUCCESS</span>
        <Image
        width={25}
        height={25}
        src="/Image/output-onlinegiftools (7).gif"
        contentFit="cover"
       
      />

        </div>
        <p className='text-sm opacity-75'>{message}</p>
      </div>
        </div>
       
        </Box>
      </Modal>
    
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between '>
          <div>
          <Typography variant="h5" className='font-bold'>RESET PASSWORD</Typography>
          
        <Typography variant="caption" className=' opacity-75'>Enter the email associated with your account below.</Typography>
          </div>
          <BiX color='red' className='cursor-pointer' onClick={handleClose}/>
        </div>
        <div className="flex flex-col mt-4  gap-2">
            <Label htmlFor="petname" >
              Email address
            </Label>
            <Input id="petname" placeholder='@youremailhere'  className="col-span-3" value={email1} onChange={(e)=> setEmail1(e.target.value)} />
          </div>
          <div className='flex justify-center mt-4 items-center border p-2 rounded-md font-bold text-white bg-[#FAB1A0] hover:bg-[coral] cursor-pointer gap-2' onClick={handleresetPassword} >
 
  {click2 ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span className='font-bold text-sm'>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
           <BiMailSend size={20} color='white'/>
  <span>
    SUBMIT REQUEST
  </span>
            </>
           
         }
         
 </div>
        </Box>
      </Modal>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
    </div>
       

    </div>
</div>
  )
}

export default page