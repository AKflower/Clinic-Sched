import styles from './booking.module.scss';
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


export default function Booking() {
    const userId = localStorage.getItem('id');
    console.log(userId)
   
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
    function isTimeSlotPass(slotTime,selectedDateCheck) {
        const today =new Date()
        const slotHour = parseInt(slotTime.split(':')[0], 10); // Lấy giờ từ chuỗi thời gian
        const slotMinute = parseInt(slotTime.split(':')[1], 10);
        console.log(slotTime,selectedDateCheck)
        if (today<selectedDateCheck) {
            console.log('case1')
            return false;
            
        }
        else if (today.getDate()>selectedDateCheck.getDate()) {
            console.log('case2',today.getDate()==selectedDateCheck.getDate())

            return true;
        }
        else if (today.getDate()==selectedDateCheck.getDate()){
          console.log('case',today.getHours(), slotHour)
          
            if (today.getHours() < slotHour) {
                return false;
            }
            
            // Nếu giờ hiện tại bằng slotHour, kiểm tra phút
            if (today.getHours() === slotHour && today.getMinutes() >= slotMinute+30) {
              console.log('case4');
                return true;
            }

            return true;
            
        }
        else return true;
      }
    const location = useLocation();
    const query = useQuery();
    const departmentId = query.get('departmentId');
    const doctorId = query.get('doctorId');
    useEffect(() => {
        fetchDoctor();
        fetchFiles();
        fetchDepartment();
    }, [])
    const fetchFiles = async () => {
        try {
          const data = await fileService.getFilesByUserId(userId);
          data.sort((a,b) => b.fileid-a.fileid);
          setFiles(data);
        } catch (error) {
          console.error('Error fetching files:', error.message);
        }
      };
    const fetchDoctor = async () => {
        try {
            const data = await doctorService.getDoctorById(doctorId);
            setDoctor(data);
          } catch (error) {
            console.error('Error fetching files:', error.message);
          }
    }
    const fetchDepartment = async () => {
        try {
            const data = await departmentService.getDepartmentById(departmentId);
            setDepartment(data); // Cập nhật state department sau khi lấy dữ liệu thành công
        } catch (error) {
            console.error('Error fetching department:', error.message);
        }
    };
    const [department, setDepartment] = useState(null); // Khởi tạo department là null ban đầu
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateCheck, setSelectedDateCheck] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nestedModalContent, setNestedModalContent] = useState(null); // null, 'create', 'select'
    const [doctor,setDoctor] = useState(null)

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
    
      
      
  const fetchTimeSlot = async (date) => {
    
    const data = await appointmentService.getDoctorAppointmentsTimeByDate(doctorId,date);
    checkTimeSlot(data,new Date(date))
    console.log(timeSlotsData);
    setTimeSlotsBusy(data)
  }

  const handleDateChange = (date) => {
    
    console.log(date);
    setSelectedDateCheck(date);
    // Đảm bảo rằng ngày được định dạng chính xác theo "YYYY-MM-DD"
    const dateInput = new Date(date);
  
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const day = String(dateInput.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
  
    fetchTimeSlot(formattedDate);
    openModal();
  };
  const handleAddFile = async (e) => {
    e.preventDefault();
  try {
    const fileCreated = await fileService.addFile(newFile);
    setFile(fileCreated)
    closeNestedModal();

  } catch (error) {
    console.error('Error adding file:', error.message);
  }
};
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFile((prevFile) => ({
      ...prevFile,
      [name]: value
    }));
  };
const checkTimeSlot = (timeSlotsBusy,date) => {
    const today = new Date();
    timeSlots.forEach((timeSlot) => {
        if (timeSlotsBusy.includes(timeSlot.id)) timeSlot.isBusy=true;
        else timeSlot.isBusy=false;
        if (isTimeSlotPass(timeSlot.time,date)) timeSlot.isPass=true;
        else timeSlot.isPass=false;
        console.log(timeSlot);
    })
   
    setTimeSlots(timeSlots);
}
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
        status: 'await', // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
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

  const openNestedModal = (content) => {
    setNestedModalContent(content);
  };

  const closeNestedModal = () => {
    setNestedModalContent(null);
  };
  const handleChooseFile = (file) => {
    setFile(file)
    closeNestedModal();
  }
  

  return (
    <div className={styles.container}>
      <h1>Khám {department && department.name.toLowerCase()}</h1>
      <h2>Đặt lịch - Bác sĩ {doctor && doctor.name}</h2>
      <div className='d-flex center'>
        <CalendarComponent onChange={handleDateChange} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add File Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Đặt Lịch</h2>
        <div>Thời gian: {timeSlotSelected && timeSlotSelected.time+','} {selectedDate} - Bác sĩ {doctor && doctor.name}</div>
        
          <h3>Chọn khung giờ</h3>
          <div className={styles.timeSlotContainer}>
            {timeSlots.map((timeSlot) => (
              <div  key={timeSlot.id} className={timeSlot.isBusy ?   styles.timeSlotBusy : (timeSlotSelected && timeSlotSelected.id ==timeSlot.id) ? styles.timeSlotSelected : styles.timeSlot} onClick={() => handleSelectTimeSlot(timeSlot)} style={timeSlot.isPass ? {background:'red',cursor:'none',color:'white'} : {}}>{timeSlot.name}</div>
            ))}
          </div>
          
            <div className='d-flex' style={{ alignItems: 'center' }}>
            <h3>Hồ sơ</h3>
           <div className={styles.btnContainer}>
              <div>
                <Button type="button" name="Chọn" color='#37A4F3' onClick={() => openNestedModal('select')} />
              </div>
              <div>
                <Button type="button" name="Tạo hồ sơ" color='green' onClick={() => openNestedModal('create')} />
              </div>
            </div>
          </div>
          {file && 
            <div className={styles.file}>
                <h5>#{file.fileid} {file.name}</h5>
                <p>Triệu chứng: {file.symptom}</p>    
          </div>}
          <form className={styles.form}>
          <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleConfirmAppointment}/>
            </div>
          </div>
        </form>
      </Modal>

      {nestedModalContent && (
        <Modal
          isOpen={true}
          onRequestClose={closeNestedModal}
          contentLabel={nestedModalContent === 'create' ? "Tạo hồ sơ" : "Chọn hồ sơ"}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          {nestedModalContent === 'create' ? (
            <div>
              <h2>Tạo hồ sơ</h2>
              <form className={styles.form}>
            <Input label={'Tên'} name={'name'} value={newFile.name} onChange={handleInputChange}/>
            <Select label={'Giới tính'} options={[{value: 'Nam'},{value:'Nữ'}]} value={newFile.gender} onChange={handleInputChange} name={'gender'}/>
            <Input label={'Ngày sinh'} name={'birthDate'} type='date' value={newFile.birthDate} onChange={handleInputChange}/>
            <Input label={'Triệu chứng'} name={'symptom'} value={newFile.symptom} onChange={handleInputChange}/>
            <Input label={'Mô tả'} name={'description'} value={newFile.description} onChange={handleInputChange} isTextArea={true}/>
            <div className={styles.button}>
            <div>
                <Button type="button" name="Hủy" color='#FF6347' onClick={closeNestedModal} />
            </div>
            <div>
                <Button type="button" name="Tạo hồ sơ" color='#37A4F3' onClick={handleAddFile} />
            </div>
            </div>
           
        </form>
            </div>
          ) : (
            <div>
              <h2>Chọn hồ sơ</h2>
              <div className={styles.fileContainer}>
              {files.map((file) => (
                  <div onClick={() => handleChooseFile(file)}><CardFile id={file.fileid} name={file.name} symptom={file.symptom} description={file.description} birthdate={file.birthDate} createdDate={file.createdDate} gender={file.gender}/></div>
              ))
                  }

            </div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeNestedModal} />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
