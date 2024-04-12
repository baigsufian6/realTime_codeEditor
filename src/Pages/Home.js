import React,{useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

function Home() {

    const navigate = useNavigate();

    const[roomID, setroomID] = useState("")
    const[username, setusername] = useState("")

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setroomID(id);
        toast.success("Created A New Room")
    }

    const handleError = (e) => {
        setroomID(e.target.value)
    }

    const userHandleError = (e) => {
        setusername(e.target.value)
    }

    const createRoom = () => {
        if(!roomID || !username){
            toast.error("Enter RoomID And username")
            return
        }
        
        navigate(`/editor/${roomID}`, {

            state:{
                username,
            }
        })

    }

    const handleEventEnter = (e) => {
        if(e.code ===  'Enter'){
            createRoom();
        }
    }
   
  return (
    
    <div className='homeWrapper'>

        <div className='formWrapper'>

        <img className='homeLogo'src='/logo-fullstack.png' alt ="not loading img"/>
        <h4 className='mainLabel'> Paste Invitation ID </h4>
        <div className='inputGroup'>
            <input className='inputBox' value={roomID} onChange={handleError} onKeyUp={handleEventEnter} type='text' placeholder='ROOM ID'/>
            <input className='inputBox' value={username} onChange={userHandleError} onKeyUp={handleEventEnter} type='text' placeholder='USER NAME'/>
            <button className='btn btnJoin' onClick={createRoom}>Join</button>
            <span className='createInfo' onClick={createNewRoom}>If You Dont Have Invitation Then Create  <a href='/' className='createNewBtn'>New Room</a></span>
        </div>
        </div>

        <footer>
            <h4>MADE WITH 💪 BY <a href='https://github.com/baigsufian6'>SUFI STUDIO</a></h4>
        </footer>
      
    </div>
  )
}

export default Home
