import React, { createElement, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { useLocation,useNavigate } from 'react-router-dom'
import userService from '../../services/userService'
import doctorService from '../../services/doctorService'
import { toast } from 'react-toastify'
import styles from './videoCall.module.scss'
import Brand from '../brand/brand'
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LogoutIcon from '@mui/icons-material/Logout';

const VideoCall = ({ room,oppName,appointment }) => {
  
  const roomId = room._id;
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState({});
  const socketRef = useRef();
  const myPeer = useRef();
  const myVideoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [nameOpp, setNameOpp] = useState(null)
  const [oppId,setOppId] = useState(null);
  const role =localStorage.getItem('role');
  const id = localStorage.getItem('id');
  
  const otherVideoGridRef = useRef();
 const navigate = useNavigate()

//  var data=''
//  if (role=='doctor' )  data =  userService.getUserById(room.userId);
//  else data =  doctorService.getDoctorById(room.doctorId);
//  console.log('Data : ',data);
  useEffect(() => {

      socketRef.current = io.connect('http://localhost:3001');

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
              setMyStream(stream);
              myVideoRef.current.srcObject = stream;
            
              myPeer.current = new Peer();
              myPeer.current.on('open', (peerId) => {
                  socketRef.current.emit('join', roomId, peerId);
              });

              myPeer.current.on('call', (incomingCall) => {
                console.log('test',incomingCall);
                document.getElementById('video-other').classList.add('video-box')

                  incomingCall.answer(stream);
                  handleReceiveCall(incomingCall);
              });

              socketRef.current.on('new-user-connected', (peerId) => {
                console.log('test',peers);
                  // Check if the peerId already exists in peers
                  if (!peers[peerId]) {
                   
                      setOppId(peerId);
                      // if (role=='doctor' )  data = await userService.getUserById(peerId);
                      // else data = await doctorService.getDoctorById(peerId);
                      // setNameOpp(data.name);
                      const call = myPeer.current.call(peerId, stream);
                      handleSendCall(call);
                  }
              });

              socketRef.current.on('user-disconnected', (peerId) => {
                console.log('test');
              
                document.getElementById('video-other').innerHTML='';
                document.getElementById('video-other').classList.remove('video-box');
                if (peers[peerId]) {

                      peers[peerId].close();
                      // removePeer(peerId);

                  }
              });
              socketRef.current.on('user-camera-toggled', (peerId, isCameraOn) => {
                console.log('peer:', peerId);
                handleTogglePeerCamera(peerId, isCameraOn);
              });
          })
          .catch((err) => console.error('Error accessing media devices: ', err));

      return () => {
          if (myPeer.current) {
              myPeer.current.destroy();
          }
          socketRef.current.disconnect();
      };
  }, [roomId]);
  // useEffect(() => {
    
  //   fetchOpp(oppId)
  // },[oppId]);

  const fetchOpp = async (id) => {
    if (id==null) return;
    var data=''
    if (role=='doctor' )  data = await userService.getUserById(id);
    else data = await doctorService.getDoctorById(id);
    setNameOpp(data.name);
  }
  const handleSendCall = (call) => {
      if (call) {
          call.on('stream', (peerStream) => {
              addPeerStream(call.peer, peerStream);
              

          });

          call.on('close', () => {
              removePeer(call.peer);
          });

          setPeers({ ...peers, [call.peer]: call });
      }
  };

  const handleReceiveCall = (incomingCall) => {
    console.log('recive' );
      if (incomingCall) {
          incomingCall.on('stream', (peerStream) => {
              addPeerStream(incomingCall.peer, peerStream);
          });

          incomingCall.on('close', () => {
              removePeer(incomingCall.peer);
          });

          setPeers({ ...peers, [incomingCall.peer]: incomingCall });
      }
  };

  const addPeerStream = async (peerId, stream) => {
      // Kiểm tra xem video của peer đã tồn tại trong otherVideoGrid chưa
      console.log('testfsafa');
      const existingPeerVideo = document.querySelector(`.peer-video[data-peer="${peerId}"]`);
      const existingVideo = document.getElementById('video-other').childElementCount;
      console.log('testTOntai: ',existingPeerVideo);
      if (existingVideo ==0) {
       
          const peerVideo = document.createElement('video');
          peerVideo.srcObject = stream;
          peerVideo.autoplay = true;
          peerVideo.classList.add('peer-video');
          peerVideo.setAttribute('data-peer', peerId); // Đặt thuộc tính để xác định video của peer
          peerVideo.style.transform= 'scaleX(-1)'
          if (id==null) return;
         
     
          otherVideoGridRef.current.appendChild(peerVideo);
          const pName = document.createElement('p');
          pName.innerHTML=`${role=='user' ? 'Bác sĩ' : ''} ${oppName}`;
          pName.classList.add('chat-name')
          otherVideoGridRef.current.appendChild(pName)
      }
  };

 const removePeer = (peerId) => {
    const peerVideo = document.querySelector(`.peer-video[data-peer="${peerId}"]`);
    if (peerVideo) {
        peerVideo.remove();
    }

    const updatedPeers = { ...peers };
    delete updatedPeers[peerId];
    setPeers(updatedPeers);
};
const handleTogglePeerCamera = (peerId, isCameraOn) => {
  console.log(`Received user-camera-toggled event: ${peerId}, ${isCameraOn}`);
  const peerVideo = document.querySelector(`.peer-video[data-peer="${peerId}"]`);
  if (peerVideo) {
    peerVideo.style.display = isCameraOn ? 'block' : 'none';
  }
};
const toggleCamera = () => {
  if (myStream) {
    const videoTrack = myStream.getVideoTracks()[0];
    videoTrack.enabled = !isCameraOn;
    setIsCameraOn(!isCameraOn);

    // Notify other peers about the camera toggle
    console.log(`Sending toggle-camera event: ${roomId}, ${!isCameraOn}`);
    socketRef.current.emit('toggle-camera', roomId, !isCameraOn);
  }
};
const handleLeave = () =>{
  if (appointment.isReviewed) navigate('/home');
  else navigate(`/rating?id=${appointment._id}`);
}
  return (
    <div >
    <header className={styles.header}>
    <div className={styles.brand}><Brand size={1}/></div>
    <div className={styles.tool}>
      <div><MicIcon /></div>
      <div><CameraAltIcon /></div>
      <div onClick={() => handleLeave()}><LogoutIcon /></div>
    </div>
    </header>
      <div className="video-call d-flex center" style={{margin:'1em'}}>
         
          <div className="my-video video-box">
              <video ref={myVideoRef} muted autoPlay playsInline style={{transform: 'scaleX(-1)'}}/>
              <p className='chat-name'>Bạn</p>
          </div>
          <div ref={otherVideoGridRef} className="other-video-grid" id="video-other">
             {/* Các video stream của các peers khác */}
          </div>
        
        
      </div>
    </div>
  );
};

export default VideoCall;
