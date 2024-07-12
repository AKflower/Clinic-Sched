import styles from './scheduleManage.module.scss'
import Modal from 'react-modal';
import Input from '../../components/input/input';
import Select from '../../components/select/select';
import appointmentService from '../../services/appointment';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import CalendarComponent from '../../components/calendar/calendar';
import doctorService from '../../services/doctorService';


Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function ScheduleManage() {
    const [isDayOffModalOpen, setIsDayOffModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [doctors,setDoctors] = useState([])
    const handleDateChange = async (date) => {
        
        const data = await doctorService.getWorkingDoctor(date);
        // Đảm bảo rằng ngày được định dạng chính xác theo "YYYY-MM-DD"
        setDoctors(data);
        const dateInput = new Date(date);
      
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
        const day = String(dateInput.getDate()).padStart(2, '0');
      
        const formattedDate = `${year}-${month}-${day}`;
        setSelectedDate(formattedDate);
      
    
        openDayOffModal();
      };
      const openDayOffModal = () => {
        setIsDayOffModalOpen(true);
      };
      
      const closeDayOffModal = () => {
        setIsDayOffModalOpen(false);
      };
    return (
        <div className={styles.container}>
        <h1>Quản lý lịch làm việc</h1>
  
        <div className='d-flex center'>
        <CalendarComponent
        onChange={handleDateChange}
  
      />
        </div>
        <Modal
        isOpen={isDayOffModalOpen}
        onRequestClose={closeDayOffModal}
        contentLabel="Danh sách làm việc Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        
        <h2>Danh sách bác sĩ làm việc: {doctors.length}</h2>
        <div className={styles.doctorList}> {doctors.map((doctor) => (
            <div className={styles.doctor}>{doctor.name}</div>
        ))}</div>
        <div className={styles.button}>
          <div>
            <Button type="button" name="Hủy" color="#FF6347" onClick={closeDayOffModal} />
          </div>
        
        </div>
      </Modal>
  
      </div>
    )
}