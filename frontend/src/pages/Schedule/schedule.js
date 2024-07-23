import styles from './schedule.module.scss';
import CalendarComponent from '../../components/calendar/calendar';
import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import departmentService from '../../services/departmentService';
import { useLocation } from 'react-router-dom'
import Button from '../../components/button/button';
import fileService from '../../services/fileService';
import Modal from 'react-modal';
import Input from '../../components/input/input';
import Select from '../../components/select/select';
import appointmentService from '../../services/appointment';
import { toast } from 'react-toastify';
import CardFile from '../../components/card/cardFile'

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng


export default function Schedule() {
    const userId = localStorage.getItem('id');
    console.log(userId)
    const [isDayOffModalOpen, setIsDayOffModalOpen] = useState(false);
const [dayOffReason, setDayOffReason] = useState('');
const [doctorSelected, setDoctorSelected] = useState(null);
const [reasons,setReasons] = useState([])
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
    
    const location = useLocation();
    const query = useQuery();
    const departmentId = query.get('departmentId');
    const doctorId = localStorage.getItem('id')
    useEffect(() => {

        fetchDoctor();
        
    }, [])

    const fetchDoctor = async () => {
        try {
            const data = await doctorService.getDoctorById(doctorId);
            const doctorDayOffDates = data.dayOff.map(dayOff => new Date(dayOff.date).toISOString().split('T')[0]);
            const reasons = data.dayOff.map(dayOff => dayOff.reason)
            console.log(reasons);
            setReasons(reasons)
            // const shiftedDayOffDates = shiftDatesBackward(doctorDayOffDates.map(day => day.date));
            const shiftedDates = doctorDayOffDates.map(date => {
                const currentDate = new Date(date);
                currentDate.setDate(currentDate.getDate() - 1); // Lùi lại 1 ngày
                return currentDate.toISOString().split('T')[0]; // Chuyển đổi về định dạng YYYY-MM-DD
            });
            setDoctorDayOffDates(shiftedDates);
            setDoctor(data);

          } catch (error) {
            console.error('Error fetching files:', error.message);
          }
    }
    const [doctorDayOffDates, setDoctorDayOffDates] = useState([]); 
    const [department, setDepartment] = useState(null); // Khởi tạo department là null ban đầu
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateCheck, setSelectedDateCheck] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nestedModalContent, setNestedModalContent] = useState(null); // null, 'create', 'select'
    const [doctor,setDoctor] = useState(null)
    const [isMarkedDateModalOpen, setIsMarkedDateModalOpen] = useState(false);
    const [markedDate, setMarkedDate] = useState(null);

    const [files, setFiles] = useState([]);
    const [file,setFile] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [timeSlotsBusy,setTimeSlotsBusy] = useState([])
    const [timeSlotSelected,setTimeSlotSelected] = useState(null)
    const [newFile, setNewFile] = useState({
        userId: userId,
      name: '',
      gender: 'Nam',
      birthDate: '',  
      symptom: '',
      description: '',
    });
    
      
    
    const timeSlotsData = [
        { id: 1, name: '8:00', time: '08:00' },
        { id: 2, name: '8:30', time: '08:30' },
        { id: 3, name: '9:00', time: '09:00' },
        { id: 4, name: '9:30', time: '09:30' },
        { id: 5, name: '10:00', time: '10:00' },
        { id: 6, name: '10:30', time: '10:30' },
        { id: 7, name: '11:00', time: '11:00' },
        { id: 8, name: '11:30', time: '11:30' },
        { id: 9, name: '13:00', time: '13:00' },
        { id: 10, name: '13:30', time: '13:30' },
        { id: 11, name: '14:00', time: '14:00' },
        { id: 12, name: '14:30', time: '14:30' },
        { id: 13, name: '15:00', time: '15:00' },
        { id: 14, name: '15:30', time: '15:30' },
        { id: 15, name: '16:00', time: '16:00' },
        { id: 16, name: '16:30', time: '16:30' },
      ];
      
      const [timeSlots,setTimeSlots] = useState(timeSlotsData)
    
      
      
//   const fetchTimeSlot = async (date) => {
    
//     const data = await appointmentService.getDoctorAppointmentsTimeByDate(doctorId,date);
//     checkTimeSlot(data,new Date(date))
//     console.log(timeSlotsData);
//     setTimeSlotsBusy(data)
//   }

  const handleDateChange = (date) => {
    
    console.log(date);
    const dateCompare = new Date(date);
    
    const today= new Date()
    today.setHours(0,0,0)
    if (dateCompare< today) {
      toast.warning('Chỉ có thể chọn ngày nghỉ trong tương lai!')
      return;
    }
    setSelectedDateCheck(date);

    // Đảm bảo rằng ngày được định dạng chính xác theo "YYYY-MM-DD"
    const dateInput = new Date(date);
  
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const day = String(dateInput.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
  

    openDayOffModal();
  };
  
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFile((prevFile) => ({
      ...prevFile,
      [name]: value
    }));
  };
  const openDayOffModal = () => {
    setIsDayOffModalOpen(true);
  };
  
  const closeDayOffModal = () => {
    setIsDayOffModalOpen(false);
  };
// const checkTimeSlot = (timeSlotsBusy,date) => {
//     const today = new Date();
//     timeSlots.forEach((timeSlot) => {
//         if (timeSlotsBusy.includes(timeSlot.id)) timeSlot.isBusy=true;
//         else timeSlot.isBusy=false;
//         if (isTimeSlotPass(timeSlot.time,date)) timeSlot.isPass=true;
//         else timeSlot.isPass=false;
//         console.log(timeSlot);
//     })
   
//     setTimeSlots(timeSlots);
// }
const handleConfirmAppointment = async (e) => {
    e.preventDefault()
    if (!timeSlotSelected) {
        console.error('Please select a time slot.');
        toast.error(`Vui lòng chọn khung giờ!`);
        return;
    }
    if (!file) {
        console.error('Please select a file');
        toast.error(`Vui lòng chọn hồ sơ!`);
        return;
    }

    // Thay đổi userId và doctorId tùy vào cách bạn lưu thông tin người dùng và bác sĩ
    // const date = formatDate(selectedDate)
    const newAppointmentData = {
        userId,
        doctorId,
        fileId: file._id,
        date: selectedDate,
        timeId: timeSlotSelected.id,
        note: '',
        departmentId: departmentId  // Ghi chú có thể để trống ban đầu
    };

    try {
        const newAppointment = await appointmentService.addAppointment(newAppointmentData);
        console.log('New Appointment:', newAppointment);
        toast.success(`Đặt lịch thành công!`);
        // Thực hiện các hành động khác sau khi lưu thành công, ví dụ đóng modal
        closeModal();
    } catch (error) {
        console.error('Error adding appointment:', error.message);
    }
};
  const handleSelectTimeSlot = (timeSlot) => {
    console.log('test: ',timeSlot);
    if (timeSlot.isPass || timeSlot.isBusy) return;
    setTimeSlotSelected(timeSlot);
  }
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNestedModalContent(null); // Reset nested modal content
    setFile(null)
    setTimeSlotSelected(null)

  };

 
 

  const handleDeleteDayOff = async (date) => {
    try {
      await doctorService.deleteDayOff(doctorId, date);

      fetchDoctor(); // Cập nhật lại danh sách bác sĩ sau khi xóa ngày nghỉ
      toast.success('Ngày nghỉ đã được xóa thành công.');
      closeMarkedDateModal()
    } catch (error) {
      console.error('Error deleting day off:', error);
      toast.error('Có lỗi xảy ra khi xóa ngày nghỉ.');
    }
  };
  const handleDayOffReasonChange = (e) => {
    setDayOffReason(e.target.value);
  };
  const handleConfirmDayOff = async () => {
    try {
      await doctorService.updateDayOff(doctorId, { date: selectedDate, reason: dayOffReason });
      fetchDoctor(); // Cập nhật lại danh sách bác sĩ sau khi thêm ngày nghỉ
      closeDayOffModal(); // Đóng modal sau khi xác nhận thành công
    } catch (error) {
      console.error('Error confirming day off:', error);
    }
  };
  const [reason,setReason] = useState(null)
  const handleMarkedDateClick = (date) => {
    console.log(date);
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() ); // Lùi lại 1 ngày
    console.log(currentDate);
    var index = doctorDayOffDates.indexOf( currentDate.toISOString().split('T')[0])
    console.log(index);
    setReason(reasons[index]);
    setMarkedDate(date);
  
    setIsMarkedDateModalOpen(true);
  };
  const closeMarkedDateModal = () => {
    setIsMarkedDateModalOpen(false);
  };
  
  return (
    <div className={styles.container}>
      <h1>Lịch làm việc</h1>

      <div className='d-flex center'>
      <CalendarComponent onChange={handleDateChange} disabledDates={doctorDayOffDates} onDateClick={handleMarkedDateClick} />

      </div>
      <Modal
      isOpen={isDayOffModalOpen}
      onRequestClose={closeDayOffModal}
      contentLabel="Đăng ký ngày nghỉ Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      
      <h2>Đăng ký ngày nghỉ</h2>
      <Input label={'Lý do'} isTextArea={true} onChange={handleDayOffReasonChange} />
      <div className={styles.button}>
        <div>
          <Button type="button" name="Hủy" color="#FF6347" onClick={closeDayOffModal} />
        </div>
        <div>
          <Button type="button" name="Xác nhận" color="#37A4F3" onClick={handleConfirmDayOff} />
        </div>
      </div>
    </Modal>
    <Modal
    isOpen={isMarkedDateModalOpen}
    onRequestClose={closeMarkedDateModal}
    contentLabel="Thông tin ngày đã đăng ký nghỉ"
    className={styles.modal}
    overlayClassName={styles.overlay}
  >
    <h2>Lý do nghỉ</h2>
   
    <p>{reason}</p>
    <div className={styles.button}>
    
    <div>
      <Button  name="Đóng" color="#37A4F3" onClick={closeMarkedDateModal} />
    </div>
    <div>
    <Button name={'Hủy đăng ký'} color='red' onClick={() => handleDeleteDayOff(markedDate)}/>
    </div>
  </div>
   
  
  
  </Modal>
  {/* Rest of your component code */}

    </div>
  );
}
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
