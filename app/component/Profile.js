'use client'
import * as React from 'react';
import { BiEditAlt, BiSave, BiSolidPencil, BiX, BiSolidFolderOpen} from "react-icons/bi";
import Button from '@mui/material/Button';
import Image from 'next/image';
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
import { Avatar } from '@mui/material';
import { doc, onSnapshot, getDoc,  updateDoc, collection, getDocs} from "firebase/firestore";
import { db , auth} from '../firebase';
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
import { userPpl } from '../userProfileImage';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider, getAuth} from 'firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from 'sweetalert2'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export function ProfileAccount() {

  const [username, setUserName] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [male, setMale] = React.useState([]);
  const [female, setFemale] = React.useState([]);
  const [choose, setChoose] = React.useState('https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150503834.jpg?w=826&t=st=1697706737~exp=1697707337~hmac=2a4a5611ce185b9b850476197e4d41d6211e4c445fd80962382d793ae80a3edd');
  const [profile, setProfile] = React.useState('');
  const [current, setCurrent] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disables, setDisabled] = React.useState(true);
  const [userData, setUserData] = React.useState([]);
  const [click, setClick] = React.useState(false);
  const [click1, setClick1] = React.useState(false);

  React.useEffect(() => {
    const getAllUsers  = async () => {

  
      const querySnapshot = await getDocs(collection(db, "users"));
      const dt = []
      querySnapshot.forEach((doc) => {
           dt.push({id: doc.id, datas: doc.data()});
      });
      setUserData(dt);
    
    }



    getAllUsers();

    
   },[])


  const handleSubmitMe = () => {
 
    setClick(true)
        const res = userData.find(dt => dt.datas.email.trim().toLowerCase() === email.trim().toLowerCase());
        if(!res){
            updateEmail(auth.currentUser, email.trim()).then(() => {
              setClick(false)
              Swal.fire({
                title: "Success!",
                text: "Successfully updated email address.",
                icon: "success",
                confirmButtonColor: "#FAB1A0",
                confirmButtonText: "Okay",
               
              })
              }).catch((error) => {
                
                console.log('Something went wrong!')
              });
        }else{
          Swal.fire({
            title: "Warning!",
            text: "Email is already used!.",
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Okay",
          })
         
        }

    
   }




  const updatePasswordInFirebase = async () => {
    setClick1(true)
    try {
      
      const user = auth.currentUser;
  
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, current);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, password);
        setClick(false)
        Swal.fire({
          title: "Success!",
          text: "Password updated successfully!",
          icon: "success",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Okay",
        })
     
        setCurrent('');
        setPassword('');
      } else {
        setClick1(false)
        Swal.fire({
          title: "Warning!",
          text: "No users found!",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Okay",
        })
      }
    } catch (error) {
        let errorMessage = null;

        switch(error.code) {
          case "auth/missing-password":
            errorMessage = "Password is missing, please try again.";
          break;
          case "auth/weak-password":
            errorMessage = "Password must be at least 6 characters long.";
          break;
          case "auth/wrong-password":
            errorMessage = "Password is incorrect, please try again.";
          break;
          case 'auth/too-many-requests':
            errorMessage = "Access to this account is temporarily disabled due to many failed login attemps. You can immediately restore it by resetting your password or you can try again later.";
          break;
          default:
           
        }
   
        if(errorMessage){
          setClick1(false)
          setPassword('')
          Swal.fire({
            title: "Warning!",
            text: errorMessage,
            icon: "warning",
            confirmButtonColor: "#FAB1A0",
            confirmButtonText: "Try Again",
          })
       
        }
    }
  };


  const handleUpdateProfile = async () => {
    setClick(true)
     const userDt = {
        email:email,
        firstname: name.split(' ')[0].trim(),
        lastname: name.split(' ')[1].trim(),
        image: choose,
        username,
     }

     const dt1 = doc(db, "users", profile.userId );
     await updateDoc(dt1, userDt).then(()=>{
      setClick(false)
      
     });
     

   }

  const handleShowUserData = () => {

    
    const user = localStorage.getItem("credentials")   
    if(user){
        const datas = JSON.parse(user);
        onSnapshot(doc(db, "users", datas.userId), (doc) => {
          setUserName(doc.data().username);
          setName(`${doc.data().firstname} ${doc.data().lastname}`);
          setEmail(doc.data().email);
          setChoose(doc.data().image);
          setProfile(datas)
        });
    }
  }

  React.useEffect(()=>{
    const Male = userPpl.filter(item => item.category === 'Male');
    const Female = userPpl.filter(item => item.category === 'Female');

    setMale(Male);
    setFemale(Female);
  },[])

  return (
    <>
    <Dialog >
      <DialogTrigger asChild className='cursor-pointer' onClick={handleShowUserData}>
        <BiEditAlt  size={20} opacity={0.5} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  bg-gray absolute">
        <DialogHeader>
          <DialogTitle>Update profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
       <div className=' flex justify-center items-center'>
        <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={choose}
  sx={{ width: 105, height: 100 }}
/>      
        </div>
       </div>
          <Sheet >
      <SheetTrigger asChild>
        <div className='justify-center items-center border gap-1 flex mx-24 p-2 rounded-md bg-[#FAB1A0] cursor-pointer'>
        <BiEditAlt  size={15} color='white' />
          <label className='text-[10px] text-white font-bold cursor-pointer'>CHOOSE YOUR IMAGE</label>
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
          <label className='font-bold text-blue-500  opacity-50'>Male</label>
          <ImageList  cols={3} rowHeight={110}>
      {male.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && " border-2 border-[#FAB1A0]"} w-[100px] border h-[100px]  overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=>{
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
  
       Female</label>
          <ImageList  cols={3} rowHeight={110}>
      {female.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && " border-2 border-[#FAB1A0]"} w-[100px] h-[100px] border overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=> setChoose(item.image)}>
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

   
     
  
  
     <Button component="label" variant="contained" className='opacity-60' startIcon={<CloudUploadIcon />} >
      Upload file
      <VisuallyHiddenInput type="file" onChange={(event)=> {
       const file = event.target.files[0]
       setChoose(URL.createObjectURL(file));
      }}/>
    </Button>
   


   
         
         
        </div>
        <SheetFooter>
          <SheetClose asChild>
         
            <div className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  bg-[#FAB1A0] hover:shadow-md transition-all ease-in cursor-pointer w-full'>
     <BiSave size={22} color='white'/>
<label className='text-white font-bold cursor-pointer'>SAVE CHANGES</label>

</div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
      
        <div className="grid gap-4 py-3" >
 
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input disabled={disables ? false: true} id="name" value={name} className="col-span-3"  onChange={(e)=>{
              setName(e.target.value);
            }}  />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" disabled={username === "Admin" ? true : disables ? false: true} value={username} className="col-span-3"  onChange={(e)=>{
              setUserName(e.target.value);
            }} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative" >
            <Label htmlFor="email" className="text-right" >
              Email
            </Label>
            <Input disabled={disables} id="email" value={email} className="col-span-3"  onChange={(e)=>{
              setEmail(e.target.value);
            }}   />
            <div className='absolute right-0 top-0 border rounded-r-sm bg-white p-2' onClick={()=>{
              setDisabled((prev)=> !prev);
            }}>
              {!disables ? <BiX size={22} color='red'/> :  <BiSolidPencil size={22} />}
           
            </div>
        
          </div>
          {disables && (
     <div className=' flex justify-end gap-1'>
     <Label htmlFor="username" className="text-right text-[12px]">
         Do you want to change your password? 
       </Label>
       <Dialog>
 <DialogTrigger asChild>
   <label className=' text-[12px] text-red-500 cursor-pointer'>Click here</label>
 </DialogTrigger>
 <DialogContent className="sm:max-w-[425px]">
   <DialogHeader>
     <DialogTitle>Edit password</DialogTitle>
     <DialogDescription>
       Make changes to your password here. Click save when you're done.
     </DialogDescription>
   </DialogHeader>
   <div className="grid gap-4 py-4">
     <div className="grid grid-cols-4 items-center gap-4">
       <Label htmlFor="current" className="text-right">
         Current Password
       </Label>
       <Input id="current" value={current} type='password' className="col-span-3" onChange={(e)=>{
         setCurrent(e.target.value);
       }}  />
     </div>
     <div className="grid grid-cols-4 items-center gap-4">
       <Label htmlFor="password" className="text-right">
         New Password
       </Label>
       <Input id="password" value={password} type='password' className="col-span-3" onChange={(e)=>{
         setPassword(e.target.value);
       }}  />
     </div>
   </div>
   <DialogFooter>
     <div  className=' transition-all ease-in cursor-pointer text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 bg-[#FAB1A0] hover:bg-[coral]' onclick={updatePasswordInFirebase}>
     {click1 ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
            <span>
           SAVE CHANGES
            </span>
            </>
           
         }
         
     </div>
   </DialogFooter>
 </DialogContent>
</Dialog>
     </div>
          )}
     
        
        </div>
        <DialogFooter>
          {disables ? <div  className=" transition-all ease-in cursor-pointer text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 bg-[#FAB1A0] hover:bg-[coral]" onClick={handleUpdateProfile}>
          {click ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
            <span>
            UPDATE PROFILE
            </span>
            </>
           
         }
         
            </div> : 
          <div  className="  transition-all ease-in cursor-pointer text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 bg-[#FAB1A0] hover:bg-[coral]"  onClick={handleSubmitMe}>
{click ?
 <>
  <CircularProgress color='inherit' size={15}/>
  <span>
   PLEASE WAIT
  </span>
 </>
          : 
            <>
           
            <span>
            UPDATE EMAIL
            </span>
            </>
           
         }
         

          </div>
          }
          
        </DialogFooter>
      </DialogContent>
    </Dialog>

    
    </>
  )
}
