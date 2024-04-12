// EditorPages.jsx
import React, { useState, useRef, useEffect } from "react";
import Clients from "../Components/Clients.js";
import Editor from "../Components/Editor.js";
import toast from 'react-hot-toast';
import { initSocket } from '../Socket.js';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from "../Actions.js";

function EditorPages() {
  const socketRef = useRef(null);
  const codeRef = useRef(null)
  const location = useLocation();
  const { roomID } = useParams();
  const reactNavigator = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect-error', (err) => handleErr(err));
      socketRef.current.on('connect-failed', (err) => handleErr(err));

      function handleErr(e) {
        console.log('socket-error', e);
        toast.error('socket connection failed, try again later');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomID,
        username: location.state?.username
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined the room`);
        }
        setClient(clients);
        socketRef.current.emit(ACTIONS.SYN_CODE, {
          CODE : codeRef.current,
          socketId,
        })
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketID, username }) => {
        toast.success(`${username} Left The Room `);
        setClient((prev) => {
          return prev.filter(client => client.socketId !== socketID);
        });
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

    }

  }, [location.state?.username, reactNavigator, roomID]);

  const [client, setClient] = useState([]);



  async function copyRoomID(){
    try{

      await navigator.clipboard.writeText(roomID)
      toast.success('roomID had been copied to yout clipboard')
    }catch(err){

      toast.error('could not copy roomId');
      console.error(err)

    }
  }


  function leaveRoom(){
    reactNavigator('/')
  }

  if (!location.state) {
    return <Navigate to='/' />;
  }

  return (
    <div className="mainWrapper">
      <aside className="sideBar">
        <div className="sideBarInner">
          <div className="logo">
            <img className='logoImg' src="/logo-fullstack.png" alt=" not loading" />
          </div>
          <h3>Connected</h3>
          <div className="userList">
            {client.map((client, index) => (
              <Clients clientKey={index} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyID" onClick={copyRoomID}>Copy Room ID</button>
        <button className="btn Leaving" onClick={leaveRoom}>Leave</button>
      </aside>
      <section className="editorWrapper">
        <Editor socketRef={socketRef} roomID ={roomID} onCodeChange={(code) => {codeRef.current = code}}/>
      </section>
    </div>
  );
}

export default EditorPages;