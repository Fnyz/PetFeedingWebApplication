// TimerContext.js
"use client"
import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const isBrowser = typeof window !== 'undefined'; // Check if running in the browser

  let initialCount = 600; // Default initial count if localStorage is unavailable

  if (isBrowser) {
    initialCount = localStorage.getItem('timerCount') || 600;
  }

  const [count, setCount] = useState(Number(initialCount));
  const [isRunning, setIsRunning] = useState(false);
  const [modalTime, setModalTime] = useState(false);

 
  useEffect(()=>{
   const res = localStorage.getItem("timesave")
   setModalTime(res);
   setIsRunning(res);
  },[])


  useEffect(() => {

    
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (count === 60) {
          clearInterval(interval); // Stop the timer when it reaches 1 minute
          console.log('Timer reached 1 minute');
                  setIsRunning(false); // Stop the timer
                  // Here you can display a message or perform any action when the timer reaches 1 minute
                  setModalTime(false);
                 localStorage.setItem("timesave", false)
        } else {
          setCount((prevCount) => {
            const updatedCount = prevCount - 1;
            localStorage.setItem('timerCount', updatedCount); // Store updated count in localStorage
            return updatedCount;
          }); // Decrease count by 1 every second
        }
      }, 1000); // Run the interval every 1000 milliseconds (1 second)
    }

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount or when stopping the timer
    };
  }, [count, isRunning]);

  const startTimer = () => {
    setIsRunning(true); // Start the timer
  };

  const stopTimer = () => {
    setIsRunning(false); // Stop the timer
  };

  const resetTimer = () => {
    setCount(600); // Reset count to the initial value (600 seconds)
    setIsRunning(false); // Stop the timer
    localStorage.setItem('timerCount', 600); // Reset the stored count in localStorage
  };

  return (
    <TimerContext.Provider
      value={{
        count,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
        modalTime,
        setModalTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
