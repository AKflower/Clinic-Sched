import styles from './appointment.module.scss';
import { useState, useEffect } from 'react';
import appointmentService from '../../services/appointment';
import Input from '../../components/input/input';
import Modal from 'react-modal';
import CardInfor from '../../components/card/cardInfor';
import Button from '../../components/button/button';
import payment from '../../assets/images/qr.jpg'
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom'
import fileService from '../../services/fileService';
import reviewService from '../../services/reviewService';
import StarIcon from '@mui/icons-material/Star';


Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function Appointment() {
     
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
    const location = useLocation();
    const query = useQuery();
    const day = query.get('day');
    const navigate = useNavigate()
    const role = localStorage.getItem('role');
    const timeSlotsData = [
        { id: 1, name: '8:00', time: '08:00' },
        { id: 2, name: '8:30', time: '08:30' },
        { id: 3, name: '9:00', time: '09:00' },
        { id: 4, name: '9:30', time: '09:30' },
        { id: 5, name: '10:00', time: '10:00' },
        { id: 6, name: '10:30', time: '10:30' },
        { id: 7, name: '11:00', time: '11:00' },
        { id: 8, name: '11:30', time: '11:30' },
        { id: 100, name: '12:00', time: '12:00' },
        { id: 101, name: '12:30', time: '12:30' },
        { id: 9, name: '13:00', time: '13:00' },
        { id: 10, name: '13:30', time: '13:30' },
        { id: 11, name: '14:00', time: '14:00' },
        { id: 12, name: '14:30', time: '14:30' },
        { id: 13, name: '15:00', time: '15:00' },
        { id: 14, name: '15:30', time: '15:30' },
        { id: 15, name: '16:00', time: '16:00' },
        { id: 16, name: '16:30', time: '16:30' },
    ];
    const isPastAppointment = (timeSlot, date) => {
      const appointmentDateTime = new Date(date.toDateString() + ' ' + timeSlot.time);
      const now = new Date();
      return now > appointmentDateTime;
  };
  const isOnTimeAppointment = (timeSlot, date) => {
 
    const appointmentDateTime = new Date(date.toDateString() + ' ' + timeSlot.time);
    const now = new Date();
    
    // Calculate the end of the 30-minute window
    const windowEnd = new Date(appointmentDateTime.getTime() + 30 * 60000);
    console.log(appointmentDateTime,windowEnd)
    // Check if now is within 30 minutes after the appointment time
    return now >= appointmentDateTime && now <= windowEnd;
  };
    const [timeSlots, setTimeSlots] = useState(timeSlotsData);
    const [appointments, setAppointments] = useState([]);
    const [appointmentTimes, setAppointmentTimes] = useState([]);
    const [date, setDate] = useState(day ? new Date(day) :new Date());
    const doctorId = localStorage.getItem('id');
    const userId = localStorage.getItem('id');
    const [isEditModalOpen,setIsEditModalOpen] = useState(false)
    const [result,setResult] = useState('')
    const fetchDoctorAppointmentsByDate = async (doctorId, date) => {
        try {
            var timeSlots = timeSlotsData;
            const appointments = await appointmentService.getDoctorAppointmentsByDate(doctorId, date.toISOString().split('T')[0]);
            appointments.forEach(async (appointment) => {
                var temp = timeSlots.find((a) => a.id === appointment.timeId);
                temp.doctorId = appointment.doctorId || null;
                temp.userId = appointment.userId || null;
                temp.fileId = appointment.fileId || null;
                temp.departmentId = appointment.departmentId || null;
                temp.status = appointment.status;
                temp.isPast = isPastAppointment(temp, date);
                temp.isOnTime = isOnTimeAppointment(temp,date)
                temp._id = appointment._id;
                temp.roomId = appointment.roomId;
                setResult(appointment.fileId.result);
                if (appointment.isReviewed) temp.reviewInfo = await reviewService.getReviewByAppointment(appointment._id)
                else temp.reviewInfo = null;
            });
            console.log(timeSlots);
            setTimeSlots(timeSlots);
            setAppointments(appointments);
        } catch (error) {
            console.error('Error fetching user appointments:', error.message);
        }
    };

    const fetchDoctorAppointmentsTimeByDate = async (doctorId, date) => {
        try {
            const appointments = await appointmentService.getDoctorAppointmentsTimeByDate(doctorId, date.toISOString().split('T')[0]);
            setAppointments(appointments);
        } catch (error) {
            console.error('Error fetching doctor appointment times:', error.message);
        }
    };

    const fetchUserAppointmentsByDate = async (userId, date) => {
        console.log(date);
        try {
            var timeSlots = timeSlotsData;
            const appointments = await appointmentService.getUserAppointmentsByDate(userId, date.toISOString().split('T')[0]);
            appointments.forEach(async (appointment) => {
                var temp = timeSlots.find((a) => a.id === appointment.timeId);
                temp.doctorId = appointment.doctorId || null;
                temp.userId = appointment.userId || null;
                temp.fileId = appointment.fileId || null;
                temp.departmentId = appointment.departmentId || null;
                temp.status=  appointment.status;
                temp.isPast = isPastAppointment(temp, date);
                temp._id = appointment._id;
                temp.isOnTime = isOnTimeAppointment(temp,date);
                temp.userAttend = appointment.userAttend;
                temp.isReviewed = appointment.isReviewed;

                temp.roomId = appointment.roomId;
                
                if (appointment.isReviewed) temp.reviewInfo = await reviewService.getReviewByAppointment(appointment._id);
                else temp.reviewInfo = null;
                setResult(appointment.fileId.result);
            });
            
            console.log(timeSlots);
            console.log('test: ',timeSlots);
            setTimeSlots(timeSlots);
            setAppointments(appointments);
        } catch (error) {
            console.error('Error fetching user appointments:', error.message);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [appointment, setAppointment] = useState(null);

    const handleSelectAppointment = function (appointment) {
        console.log(appointment);
        setAppointment(appointment);
        
        openModal();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openPaymentModal = () => {
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
    }; 
    const openEditModal = () => {
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false)
    }
    const handleChangeDate = (e) => {
        console.log(e.target.value)
        var newDate = new Date(e.target.value);

        if (isNaN(newDate)) {
            console.error('Invalid date format');
            return;
        }

        setDate(newDate);

        if (role === 'doctor') {
            if (doctorId && newDate) {
                fetchDoctorAppointmentsByDate(doctorId, newDate);
            }
        } else {
            if (userId && newDate) {
                fetchUserAppointmentsByDate(userId, newDate);
            }
        }
    };
    const handleCall = (roomId) => {

        navigate(`/room?id=${roomId}`)
    }
    const handleInputChange = (e) => {
        setResult(e.target.value);
    }
    const handleUpdate = async (appointment) => {
        appointment.fileId.result=result;
        try {
          await fileService.updateFile(appointment.fileId._id, appointment.fileId);
          toast.success('Cập nhật kết quả thành công!')
            closeEditModal();
       
        } catch (error) {
          console.error('Error updating file:', error.message);
        }
      };
    
    
    const handlePay = async () => {
      if (appointment) {
          try {
              const updatedAppointment = {
                  ...appointment,
                  status: 'Paid'
              };
              await appointmentService.updateAppointmentStatus(appointment._id, 'Paid');
              setAppointment(updatedAppointment);
              closePaymentModal();
              toast.success('Chờ xác nhận');
              if (role === 'doctor') {
                  fetchDoctorAppointmentsByDate(doctorId, date);
              } else {
                  fetchUserAppointmentsByDate(userId, date);
              }
          } catch (error) {
              console.error('Error updating appointment:', error.message);
          }
      }
  };

    useEffect(() => {
        if (role == 'doctor') {
            if (doctorId && date) {
                fetchDoctorAppointmentsByDate(doctorId, date);
            }
        } else {
            if (userId && date) {
                fetchUserAppointmentsByDate(userId, date);
            }
        }
    }, [role, doctorId, userId, date]);
    
    if (!appointments) return null;
    else if (role == 'user')
        return (
            <div className={styles.container}>
                <h1>Lịch khám</h1>
                <div className={styles.date}>
                    <Input label='Chọn ngày' type="date" value={formatDateYYYMMDD(date)} onChange={handleChangeDate} />
                </div>

                <div className={styles.appointmentList}>
                    {timeSlots.map((timeSlot) => (
            
                        <div className={styles.appointmentContainer} >
                            <div className={styles.timeSlot}>{timeSlot.name}</div>
                            {(timeSlot.doctorId && !(timeSlot.status=='Paid')) && <div className={styles.content} style={(timeSlot.isPast || timeSlot.status=='Complete')? {background:'#7cdc7a'} : {}} onClick={() => handleSelectAppointment(timeSlot)}>
        
                                <div style={{ fontWeight: '600' }}>Khám {timeSlot.departmentId && timeSlot.departmentId.name.toLowerCase()} </div>
                                <div style={{ fontWeight: '400' }}>Bác sĩ: {timeSlot.doctorId && timeSlot.doctorId.name}</div>
                                <div style={{ fontSize: '.75em' }}> <span>Mã hồ sơ: #{timeSlot.fileId && timeSlot.fileId.fileid}</span></div>
                                <div style={{ fontSize: '.75em', display: 'flex', gap: '2em' }}><span style={{ fontWeight: '500' }}>{timeSlot.userId.name}</span><span>Triệu chứng: {timeSlot.fileId && timeSlot.fileId.symptom}</span></div>
                                {timeSlot.reviewInfo && <div className={styles.review + ' d-flex center'} style={timeSlot.reviewInfo.rating>3 ? { backgroundColor: 'rgb(5 132 38)'} : {backgroundColor: '#000'}}>{ timeSlot.reviewInfo.rating} <StarIcon /></div>}
                                

                            </div>}
                        </div>
        ))}
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add File Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <h2>Thông tin cuộc hẹn</h2>
                    <div style={{ gap: '1em', display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: '80vh' }}>
                        <CardInfor title={'Thông tin bác sĩ'} fields={[{ label: 'Tên', value: appointment?.doctorId?.name || '' }, { label: 'Chuyên khoa', value: appointment?.departmentId?.name || '' }, { label: 'Giá', value: appointment?.doctorId?.price || '' }]} />

                        <CardInfor title={'Thông tin người khám'} fields={[{ label: 'Tên', value: appointment?.userId?.name || '' }, { label: 'Triệu chứng', value: appointment?.fileId?.symptom || '' }, { label: 'Mã hồ sơ', value: appointment?.fileId?.fileid || '' }, { label: 'Kết quả khám', value: appointment?.fileId?.result || '' }]} />
                        {appointment?.status=="Wait for payment" && <div style={{marginTop:'1em'}}><Button name='Thanh toán' onClick={openPaymentModal}  /></div>}
                        {(appointment && appointment.fileId && appointment.fileId.status==0 && appointment.status=="Confirmed" ) && <div style={{marginTop:'1em'}} onClick={() => handleCall(appointment.roomId._id)}><Button name='Gọi ngay'  /></div>}
                        {(appointment && appointment.userAttend && !appointment.isReviewed) && <div style={{marginTop:'1em'}} onClick={() => navigate(`/rating?id=${appointment._id}`)}><Button name='Đánh giá' color='rgb(255 164 75)' /></div>}
                        {appointment?.reviewInfo && <div className={styles.feedback}>Nhận xét: <span>{appointment.reviewInfo.feedback}</span></div>}
                    </div>
                </Modal>
                <Modal
                    isOpen={isPaymentModalOpen}
                    onRequestClose={closePaymentModal}
                    contentLabel="Payment Modal"
                    className={styles.modal+' '+styles.backgroundGreen}
                    overlayClassName={styles.overlay}
                >
                    <h2 style={{color:'white'}}>Thanh toán</h2>
                    <div className='d-flex center'><img src={payment} style={{maxHeight: '20em'}}/></div>
                    <div style={{display:'flex',flexDirection:'row',float:'right',gap:'1em'}}>
                        <div style={{minWidth:'6em'}}><Button onClick={closePaymentModal} name={'Đóng'} color='red'/></div>
                        <div style={{minWidth:'6em'}}><Button onClick={handlePay} name={'Xác nhận'} /></div>
                    </div>
                </Modal>
            </div>
        );
    else if (role == 'doctor')
        return (
            <div className={styles.container}>
                <h1>Lịch khám</h1>
                <div className={styles.date}>
                    <Input label='Chọn ngày' type="date" value={formatDateYYYMMDD(date)} onChange={handleChangeDate} />
                </div>

                <div className={styles.appointmentList}>
                    {timeSlots.map((timeSlot) => (
                      
                        <div className={styles.appointmentContainer}>
                            <div className={styles.timeSlot}>{timeSlot.name}</div>
                            {(timeSlot.doctorId && !(timeSlot.status=='Paid')) && <div className={styles.content} style={(timeSlot.status=='Complete')? {background:'#7cdc7a'} : (timeSlot.isOnTime) ? {background:'red',color:'white'} : timeSlot.isPast ? {background:'silver'} : {}} onClick={() => handleSelectAppointment(timeSlot)}>
                                <div style={{ fontWeight: '600' }}>Khám {timeSlot.departmentId && timeSlot.departmentId.name.toLowerCase()}</div>
                                <div style={{ fontWeight: '400' }}>Bác sĩ: {timeSlot.doctorId && timeSlot.doctorId.name}</div>
                                <div style={{ fontSize: '.75em' }}> <span>Mã hồ sơ: #{timeSlot.fileId && timeSlot.fileId.fileid}</span></div>
                                <div style={{ fontSize: '.75em', display: 'flex', gap: '2em' }}><span style={{ fontWeight: '500' }}>{timeSlot.userId.name}</span><span>Triệu chứng: {timeSlot.fileId && timeSlot.fileId.symptom}</span></div>
                                {timeSlot.reviewInfo && <div className={styles.review + ' d-flex center'} style={timeSlot.reviewInfo.rating>3 ? { backgroundColor: 'rgb(5 132 38)'} : {backgroundColor: '#000'}}>{ timeSlot.reviewInfo.rating} <StarIcon /></div>}
                            </div>}
                        </div>
                    ))}
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add File Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <h2>Thông tin cuộc hẹn</h2>
                    <div style={{ gap: '1em', display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: '80vh' }}>
                        <CardInfor title={'Thông tin bác sĩ'} fields={[{ label: 'Tên', value: appointment?.doctorId?.name || '' }, { label: 'Chuyên khoa', value: appointment?.departmentId?.name || '' }, { label: 'Giá', value: appointment?.doctorId?.price || '' }]} />
                       
                        <CardInfor title={'Thông tin người khám'} fields={[{ label: 'Tên', value: appointment?.userId?.name || '' }, { label: 'Triệu chứng', value: appointment?.fileId?.symptom || '' }, { label: 'Mã hồ sơ', value: appointment?.fileId?.fileid || '' } ,{ label: 'Kết quả khám', value: appointment?.fileId?.result || '' }]} />
                        {(appointment && appointment.fileId && appointment.fileId.status==0 && appointment.status=="Confirmed" ) && <div style={{marginTop:'1em'}} onClick={() => handleCall(appointment.roomId._id)}><Button name='Tham gia cuộc gọi'  /></div>}
                        {appointment?.status=="Complete" && <Button name={'Chỉnh sửa kết quả'} onClick={openEditModal}/>}
                        {appointment?.reviewInfo && <div className={styles.feedback}>Nhận xét: <span>{appointment.reviewInfo.feedback}</span></div>}

                    </div>
                </Modal>
                <Modal
                    isOpen={isPaymentModalOpen}
                    onRequestClose={closePaymentModal}
                    contentLabel="Payment Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <h2>Thanh toán</h2>
                    <p>Thông tin thanh toán của bạn ở đây...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={closePaymentModal}>Đóng</Button>
                        <Button onClick={() => alert('Thanh toán thành công!')}>Xác nhận</Button>
                    </div>
                </Modal>
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    contentLabel="Payment Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <h2>Chỉnh sửa kết quả</h2>
                    <Input  label={'Kết quả khám'} isTextArea={true} value={result} onChange={(e) => handleInputChange(e)}/>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'1em' }}>
                    <div style={{minWidth:'5em'}}><Button onClick={closeEditModal} name={'Đóng'} color='red'/></div>
                    <div style={{minWidth:'5em'}}><Button name={'Lưu'} onClick={() => handleUpdate(appointment)} /></div>
                </div>
                    
                  
                </Modal>
            </div>
        );
}
function formatDateYYYMMDD(dateInput) {
  const date = new Date(dateInput)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}