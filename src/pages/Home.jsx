import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'


const Home = () => {
   
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const generateRoomId = (e)=>{
    e.preventDefault();
      setRoomId(uuidv4());
  }

  const handlejoinroom = ()=>{
     if(!username || !roomId) {
      toast.error("UserName and RoomId is Required")
      return;
     }
   
     toast.success("Created a new room");
     navigate(`/editor/${roomId}`, {
      state:{
        username,
      }
     })
  }

  const handleEnterIntoRoom = (e)=>{
    if(e.code === "Enter"){
      handlejoinroom();    
    }
  }

  return (
    <div className='home-container'>
      <div className="home-login-page">
        <img className='home-login-page-logo' src="img.png" alt="code editor logo" />
        <p className="">Paste invitation ROOM ID</p>
        <input
         type="text"
         className="home-text-field" 
          placeholder="Enter Room ID"
          value={roomId}
          onKeyUp={handleEnterIntoRoom}
          onChange={(e)=>{setRoomId(e.target.value)}}
          />
        <input 
        className="home-text-field"
         type="text" 
         placeholder='Enter User Name' 
         value={username}
         onKeyUp={handleEnterIntoRoom}
         onChange={(e) =>{setUserName(e.target.value)}}
         />
        <button 
        className='btn join-room-btn'
        onClick={handlejoinroom}
        >Join</button>
        <p className='home-generate-id' >If you don't have an invite then create <a className='home-a-tag' onClick={generateRoomId} href="">New room</a></p>
      </div>

      <footer>
        <h4>Build with 💙 by <a className='home-a-tag' href="">Krish</a></h4>
      </footer>

    </div>
  )
}

export default Home