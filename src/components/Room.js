import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/socketContext';

const Room = () => {
    const { id } = useParams();
    const { socket, me } = useSocket();
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null)
    const [participants, setParticipants] = useState({})
    useEffect(() => {
        if (!id || !socket || !me) return;
        getVideoStream();
    }, [id, socket, me]);

    const getVideoStream = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStream(stream)
            }
        }).catch(error => {
            console.error('Error accessing webcam:', error);
        });
    };

    useEffect(() => {
        if (!id || !socket || !me || !stream) return;

        socket.emit("join-room", { meetingID: id, peerID: me.id });

        socket.on("user-joined", (data) => {
            console.log(data, "--------")
            const { peerID } = data
            const call = me.call(peerID, stream)
            console.log(call)
            call.on("stream", (peerStream) => {
                console.log(peerStream, peerID)
                setParticipants(prev => ({
                    ...prev, [peerID]: {
                        stream: peerStream
                    }
                }))
            })
        })

        me.on('call', (call) => {
            console.log('Incoming call:', call);
            call.answer(stream);
            call.on('stream', (peerStream) => {
                console.log('Received stream:', peerStream);
                setParticipants((prev) => ({
                    ...prev,
                    [call.peer]: {
                        stream: peerStream,
                    },
                }));
            });
        });
        socket.on("users", (data) => {
            console.log(data);
        });

        socket.on("user-disconnected", (data) => {
            const { peerID } = data
            const updatedStreams = { ...participants };
            delete updatedStreams[peerID];
            setParticipants(updatedStreams);
        })
    }, [id, socket, me, stream])




    useEffect(() => {
        console.log(participants)
    }, [participants])



    return (
        <div>
            <div className='meet-room-header'>
                <div>
                    MEETING ID : {id}
                </div>
                <div>
                    MY ID : {me?.id}
                </div>
            </div>
            <div>
                <video ref={videoRef} autoPlay playsInline muted />
            </div>
            <div className="video-grid">
                {Object.keys(participants).map((streamId) => (
                    <div key={streamId} className="video-item">
                        <video
                            autoPlay
                            playsInline
                            ref={(videoRef) => {
                                if (videoRef && participants[streamId].stream) {
                                    videoRef.srcObject = participants[streamId].stream;
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Room;
