import { useState } from 'react';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import VideoCall from '../../components/VideoCall/videoCall';
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './room.module.scss'
import Brand from '../../components/brand/brand';
import { useEffect } from 'react';
import roomService from '../../services/roomService';

const Room = () => {
  const navigate = useNavigate()
  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');
  const location = useLocation();
  const useQuery = () => {
    return new URLSearchParams(location.search);
};
  const query = useQuery();
  const roomId = query.get('id');
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await roomService.getRoomById(roomId);
        setRoom(roomData);
        if (role == 'doctor' && roomData.doctorId!=id ) {
          navigate('/home');
        }
        else if (role == 'user' && roomData.userId!=id) {
          navigate('/home');
        }
      } catch (err) {
   
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  return (
    <div  className={styles.container}>
      <header className={styles.header}>
      <div className={styles.brand}><Brand size={1}/></div>
      <div className={styles.tool}></div>
      </header>
      <h1></h1>
     
     
      <VideoCall roomId={roomId} />
    </div>
  );
};

export default Room;