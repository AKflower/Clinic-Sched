import { useState, useEffect } from 'react';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import VideoCall from '../../components/VideoCall/videoCall';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './room.module.scss';
import Brand from '../../components/brand/brand';
import roomService from '../../services/roomService';
import userService from '../../services/userService';
import doctorService from '../../services/doctorService';
import Button from '../../components/button/button';
import appointmentService from '../../services/appointment';
import ProfileModal from '../../components/fileModal/profileModal'; // Import the modal component

const Room = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');
  const location = useLocation();
  const useQuery = () => new URLSearchParams(location.search);
  const query = useQuery();
  const roomId = query.get('id');
  const [room, setRoom] = useState(null);
  const [nameOpp, setNameOpp] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage modal visibility
  const [appointment,setAppointment] = useState(null);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await roomService.getRoomById(roomId);
        var data = '';
        if (role == 'doctor') data = await userService.getUserById(roomData.userId);
        else data = await doctorService.getDoctorById(roomData.doctorId);
        const appointmentData = await appointmentService.getAppointmentById(roomData.appointmentId);
        if (role=='user' && id== appointmentData.userId && appointmentData.userAttend==false){ await appointmentService.updateAppointmentUserAttend(appointmentData._id,true);
        console.log('test')};
        setAppointment(appointmentData);
        setNameOpp(data.name);
        setRoom(roomData);
        if (role == 'doctor' && roomData.doctorId != id) {
          navigate('/home');
        } else if (role == 'user' && roomData.userId != id) {
          navigate('/home');
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const handleUpdateStatus = async (id, status, e) => {
    e.stopPropagation();
    try {
      await roomService.updateRoomStatus(roomId, 1);
      await appointmentService.updateAppointmentStatus(id, status);
      navigate('/appointment');
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const toggleProfileModal = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className={styles.container}>
      {room && <VideoCall room={room} oppName={nameOpp} appointment={appointment}/>}
      {( room) && 
      <div className={styles.toolDoctor}>
        <div style={{minWidth:'10em'}}>
          <Button name={'Hồ sơ'} color='orange' onClick={toggleProfileModal} />
        </div>
        {role == 'doctor' && <div style={{minWidth:'10em'}}>
          <Button name={'Hoàn thành'} onClick={(e) => handleUpdateStatus(room.appointmentId,'Complete',e)} />
        </div>}
      </div>}
      {appointment?.fileId && <ProfileModal isOpen={isProfileOpen} onClose={toggleProfileModal} file={appointment?.fileId} />}
    </div>
  );
};

export default Room;
