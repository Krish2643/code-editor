import React, { useState, useEffect, useRef } from 'react'
import Client from '../Components/Client';
import Editor from '../Components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import {useLocation, useParams, Navigate, useNavigate} from 'react-router-dom'


const EditorPages = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

     function handleErrors(e) {
         console.log('socket error', e);
         toast.error('Socket connection failed, try again later.');
         reactNavigator('/');
     }

        // user join hote hi ye event call hogi
      socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username
      })


    // listening for joined event (user join hone ke baad)
      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=>{
           if(username !== location.state?.username){
                toast.success(`${username} joined the room`);
                console.log(`${username} joined the room`);
           }
             setClients(clients);
             socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
          });
      })

      // listening for disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) => {
                return prev.filter(
                    (client) => client.socketId !== socketId
                );
            });
        }
    );
    };
    init()

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);  // we are unsuscribe all the events
      socketRef.current.off(ACTIONS.DISCONNECTED);
  };
  }, []);


  async  function copyRoomId(){
        try{
              await navigator.clipboard.writeText(roomId);
              toast.success( "Room ID has been copied to your clipboard");
              console.log(roomId);
        }catch(err){
              toast.error( "Failed to copy Room Id: "+ err);
        }
    }

    function leaveRoom(){
         reactNavigator('/');
    }

    if (!location.state) {
      return <Navigate to="/" />;
       }

  


  return (
    <div className='editor-container'>
        <div className="editor-left-side">
            <div className="editor-left-upper-side">
            <img className='editor-logo' src="/img.png" alt="logo image" />
            <h3>Connected</h3>
            <div className="editor-client-list">
              
               {clients.map((client) => (
                  <Client key={client.socketId} username={client.username}/>
               ))}
            </div>
            </div>
            <div className="editor-left-bottom-side">
                <button className='btn copy-btn' onClick={copyRoomId} >Copy ROOM ID</button>
                <button className='btn leave-btn' onClick={leaveRoom} >Leave</button>
            </div>

        </div>
        <div className="editor-right-side">
              <Editor socketRef={socketRef} 
              roomId={roomId} 
             onCodeChange={(code)=> {codeRef.current = code}}/>
        </div>
    </div>
  )
}

export default EditorPages