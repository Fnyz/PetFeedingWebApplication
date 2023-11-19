'use client'

import React, { useState , useEffect} from 'react'
import Image from 'next/image'
import {collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import { db } from '../firebase';


function TotalPets() {


    
  const [listOfPet, setListOfPet] = useState([]);




  
  useEffect(()=>{

    const user = localStorage.getItem("credentials");

    
    if(user){
        const datas = JSON.parse(user);
        
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas?.DeviceName?.trim()), orderBy("Created_at", "desc"));
        const data = [];
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((docs) => {
            data.push({dt:docs.data(), id: docs.id});
            setListOfPet(data);
        });
        
        })

    }



    },[])

  return (
    <div className='w-4/5  flex '>
    <div className='flex flex-row gap-2 '>
        <div className=' w-[170px] border h-20 rounded-md  shadow-sm'>
            <h1 className='pl-2 text-[10px] pt-1'>Notifications</h1>
            <div className='flex'>
                <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> 100</span>
                
                <div className=' flex-1 relative h-[50px] opacity-[0.7]'>
                <Image
        src="/Image/icons8-notification.svg"
        layout='fill'
        className='fill-black stroke-2'
        alt='icons'
        />
                </div>
            
            </div>
        </div>
        <div className=' w-[170px] border h-20 rounded-md  shadow-sm'>
        <h1 className='pl-2 text-[10px] pt-1'>Pets</h1>
            <div className='flex'>
                <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> {listOfPet.length}</span>
                <div className=' flex-1 relative h-[50px]'>
                <Image
        src="/Image/1517090.svg"
        layout='fill'
        className='fill-black stroke-2'
        alt='icons'
        />
                </div>
            </div>
        </div>
        <div className=' w-[150px]  h-20 rounded-md relative max-md:hidden block'>
        <Image
        src="/Image/undraw_sign_in_re_o58h.svg"
        layout='fill'
        alt='icons'
        />
        </div>
        
    </div>
   
</div>
  )
}

export default TotalPets