// TimerContext.js
"use client"

import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const isBrowser = typeof window !== 'undefined'; // Check if running in the browser

  let initialCount = 180; // Default initial count if localStorage is unavailable
  const goalTime = 0; // Set the goal time in seconds

  if (isBrowser) {
    initialCount = parseInt(localStorage.getItem('timerCount'), 10) || 180;
  }

  const [count, setCount] = useState(Number(initialCount));
  const [isRunning, setIsRunning] = useState(false);
  const [modalTime, setModalTime] = useState(false);

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('timerCount'), 10) || initialCount;
    setCount(savedCount);
  }, [setCount, initialCount]);

  useEffect(() => {
    const savedModalTime = localStorage.getItem('timesave');
    setModalTime(savedModalTime);
    setIsRunning(savedModalTime === 'true');
  }, [setModalTime, setIsRunning]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (count <= goalTime) {
          clearInterval(interval);
          setIsRunning(false);
          setModalTime(false);
          localStorage.setItem('timesave', false);
        } else {
          setCount((prevCount) => {
            const updatedCount = prevCount - 1;
            localStorage.setItem('timerCount', updatedCount);
            return updatedCount;
          });
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [count, isRunning, goalTime]);

  const startTimer = () => {
    setIsRunning(true);
    localStorage.setItem('timesave', true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    localStorage.setItem('timesave', false);
  };

  const resetTimer = () => {
    setCount(initialCount);
    setIsRunning(false);
    setModalTime(false);
    localStorage.setItem('timerCount', initialCount);
    localStorage.setItem('timesave', false);
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
        setModalTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
