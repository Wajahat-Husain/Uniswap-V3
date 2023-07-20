import React, { useState } from 'react'
import './App.css'
import ConnectWallet from './components/ConnectWallet'
import SwapToken from './components/SwapToken'
import { ToastContainer } from 'react-toastify';

function App() {
  const [userInfo, setUserInfo] = useState({});
  const [etherObj, setEtherObj] = useState({});

  const userInfoValue = (userData) => {
    setUserInfo(userData);
    console.log("userInfo etherObj", userInfo);
  };
  const etherObjValue = (etherData) => {
    setEtherObj(etherData);
    console.log("App etherObj", etherObj);
  }
  return (
    <>
    <ToastContainer/> 
    <ConnectWallet userInfoValue={userInfoValue} etherObjValue={etherObjValue}/>
    <SwapToken userInfo={userInfo} etherObj={etherObj}/> 
    </>
  )
}

export default App
