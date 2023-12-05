import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/socketContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { socket, me } = useSocket()

    const navigate = useNavigate()


    const [meetID, setMeetID] = useState('')

    useEffect(() => {
        socket.on("room-created", (data) => {
            navigate(`/room/${data?.meetingID}`)
        })
    }, [socket])



    const handleRoomCreate = () => {
        socket.emit("create-room", {})
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setMeetID(value)
    }

    const joinRoom = () => {
        navigate(`/room/${meetID}`)
    }


    return (
        <div className='meet-home'>
            <div className='meet-home-peer-id'>PEER ID : {me?.id}</div>
            <div className='meet-home-join-meet-wrap'>
                <input value={meetID} name='meetingID' placeholder='Enter Meeting ID' onChange={handleChange} />
                <button onClick={joinRoom}>Join Meeting</button>
            </div>
            <div className='meet-home-create-wrap'>
                <button onClick={handleRoomCreate}>Create Meeting</button>
            </div>
        </div>
    )
}

export default Home