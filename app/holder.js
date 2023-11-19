'use client'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function Holder({children}) {
    const [isClient , setisClient] = useState(false);
    useEffect(()=>{
     setisClient(true);
    },[])
    
  return (
    <>
    {isClient && children}
    </>
  )
}

export default Holder