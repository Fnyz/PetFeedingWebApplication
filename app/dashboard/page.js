'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BiSolidHand, BiLogOutCircle} from "react-icons/bi";
import ListOfPet from '@/app/component/ListOfPet';
import Notifications from '@/app/component/Notifications';
import SideBar from '../component/SideBar';
import { ProfileAccount } from '../component/Profile';
import { doc, onSnapshot} from "firebase/firestore";
import { db, auth } from '../firebase';
import TotalPets from '../component/TotalPets';
import { signOut} from 'firebase/auth'
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"





function page() {


    const [profile, setProfileData] = useState({});

    const router = useRouter();
    

  useEffect(()=>{
    const user = localStorage.getItem("credentials");

    
    if(user){
        const datas = JSON.parse(user);
        onSnapshot(doc(db, "users", datas.userId), (doc) => {
            setProfileData(doc.data())
        });
    }
  },[])
  
 






    
  return (
    <div className="h-screen relative ">
        <Image
            src="/Image/WebBackground.png"
            layout='fill'
            quality={100}
            alt='back image'
            objectFit='cover'
        />
        <div className='absolute left-0 right-0  px-10 pt-5'>
            <div className='flex justify-between'>
            <SideBar />
        
            <div className='flex items-center gap-2 mt-2'>
     
     <div className='w-[60px] h-[60px] p-[2px] rounded-full border-[#FAB1A0] border-2 justify-center items-center'>
     
     <div className="w-[52px] h-[52px] rounded-full overflow-hidden relative">
        <Image
           src={profile.image}
          fill
          alt='profile'
          

        />
      </div>
     </div>
        <div>
                <span className='text-[12px] opacity-[0.8]'>Welcome user</span>
                <div className='flex items-center gap-1'>
                    <span className='font-bold text-lg'>{profile.username}</span>
                    <BiSolidHand className='text-[#FAB1A0]'/>
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    gap:5,
                    alignItems:'center',
                    justifyContent: 'center',
                    marginLeft:10,
                }}>
                <ProfileAccount profile={profile} />
                /

                <AlertDialog>
      <AlertDialogTrigger asChild>
         <BiLogOutCircle size={20} color='red' opacity={0.6} className=' cursor-pointer'/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hey you watzupp!</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              signOut(auth).then(() => {
                localStorage.clear();
                router.push('/login')
              }).catch((error) => {
                console.log(error);
              });
            }}
          >
            {/** some inputs */}
            <button type="submit">Yes</button>
          </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

           

                </div>
               
        </div>
            </div>
           
        <div className='flex gap-5 w-[100%] mt-5  h-[500px]'>
            <div className='w-1/6  flex justify-center items-center relative'>
            <Image
            src="/Image/undraw_welcoming_re_x0qo.svg"
            layout='fill'
            quality={100}
            alt='back image'
        />
                
            </div>
            <div className=' w-[100%]'>
            <TotalPets  />
            <div className='flex gap-5 mt-5 '>
            <ListOfPet />

            <Notifications />
            </div>

            

            </div>
            
        </div>
       
        </div>
      

     
    </div>
  )
}

export default page