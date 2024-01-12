
"use client"

import React, { createContext, useState, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
export const GlobalContext = createContext();
import { BiX } from "react-icons/bi";
import {onSnapshot, collection, query, orderBy} from "firebase/firestore";
import { db } from './firebase';

export const TimerProvider = ({ children }) => {
 
 
  const [showTimer, setShowTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180); // Initial remaining time in seconds

  const user = typeof window !== 'undefined' && localStorage.getItem('credentials')
    ? JSON.parse(localStorage.getItem('credentials'))
    : null;

    const flag = typeof window !== 'undefined' && localStorage.getItem('flag')
    ? localStorage.getItem('flag') === 'true'
    : null;

  useEffect(()=>{

     if(user){
      const q = query(collection(db, "Messages"), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
        
          if (change.type === "modified" && change.doc.data().message && change.doc.data().deviceName === user.DeviceName && change.doc.data().adminSend === false) {
            const b = change.doc.data().message
          .sort((msg1, msg2) => msg2.messagedate - msg1.messagedate)
          .filter(d => d?.unseen === false);
            
              if(b[0]?.type === "User"){
                console.log(b[0]?.type)
                notify(b[0].message, b[0].username, b[0].image, "MESSAGES")
              }
          }
         
        });
      });
     }
      return () => {
        console.log("null")
      }
    
     
  },[])

  useEffect(() => {


   
    const previousNotificationsLength = localStorage.getItem('previousNotificationsLength');
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && change.doc.data().deviceName === user?.DeviceName && change.doc.data().type === "User" && !change.doc.data().hasSeen) {
          data.push({ dt: change.doc.data(), id: change.doc.id });
        }
      });

      

      const newNotificationsLength = data.length;
 
      if (newNotificationsLength !== Number(previousNotificationsLength)) {
        console.log('Length of notifications changed due to new data.');
        
        // Update localStorage with the new length
        localStorage.setItem('previousNotificationsLength', newNotificationsLength);
        if(data.length > 0){
            notify(data[0]?.dt.Messages,data[0]?.dt.Messages.toLowerCase().includes("water") ? user?.DeviceName : data[0]?.dt?.pet_name?.toUpperCase() || "Admin", "/Image/output-onlinegiftools (2).gif", "MESSAGES")
         
        }
     
        // unsubscribe();
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  

  useEffect(() => {

   
      const timerInterval = setInterval(calculateRemainingTime, 1000);
      function calculateRemainingTime() {
        (() => {
          const storedStartTime =  localStorage.getItem('startTime');
          if (storedStartTime !== null) {
            const startTime = parseInt(storedStartTime, 10);
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            const newRemainingTime = Math.max(0, 180 - elapsedTime);
  
            setRemainingTime(newRemainingTime);
          
            if (newRemainingTime === 0 && flag) {
              setShowTimer(false);
              localStorage.setItem('flag', 'false');
              localStorage.setItem('remaintime', newRemainingTime);
              notify('Livestream is now ready please check it now!', user?.DeviceName, "/Image/liveGif.gif", "LIVESTREAM")
              clearInterval(timerInterval);
            }
          } else {
            clearInterval(timerInterval);
          }
        })();
      }
  
      // Clean up the timer when the component unmounts
      return () => clearInterval(timerInterval);
   
  }, [showTimer]);

  

 
  
  






  const notify = (message, sender, image, fromwhere) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={image}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <div className='flex items-center gap-2'>
              <p className="text-sm font-medium text-gray-900">
                {sender}
              </p>
              <p className="text-sm opacity-50 font-medium">
                * {fromwhere}
              </p>
              </div>
             
              <p className="mt-1 text-md text-gray-500">
               {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
           <BiX size={20} />
          </button>
        </div>
      </div>
    ))
 
  };

  

 

  return (
    <GlobalContext.Provider value={{
      setShowTimer, showTimer, remainingTime, flag
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
