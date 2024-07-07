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
import Select from '../../components/select/select'
Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function Booking() {
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
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
          const data = await fileService.getAllFiles();
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nestedModalContent, setNestedModalContent] = useState(null); // null, 'create', 'select'
    const [doctor,setDoctor] = useState(null)
    const [files, setFiles] = useState([]);
    const [file,setFile] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newFile, setNewFile] = useState({
      name: '',
      gender: 'Nam',
      birthDate: '',  
      symptom: '',
      description: '',
    });
  const timeSlots = [
    { id: 0, name: '8:00', time: '08:00' },
    { id: 1, name: '8:30', time: '08:30' },
    { id: 2, name: '9:00', time: '09:00' },
    { id: 3, name: '9:30', time: '09:30' },
    { id: 4, name: '10:00', time: '10:00' },
    { id: 5, name: '10:30', time: '10:30' },
    { id: 6, name: '11:00', time: '11:00' },
    { id: 7, name: '11:30', time: '11:30' },
    { id: 8, name: '13:00', time: '13:00' },
    { id: 9, name: '13:30', time: '13:30' },
    { id: 10, name: '14:00', time: '14:00' },
    { id: 11, name: '14:30', time: '14:30' },
    { id: 12, name: '15:00', time: '15:00' },
    { id: 13, name: '15:30', time: '15:30' },
    { id: 14, name: '16:00', time: '16:00' },
    { id: 15, name: '16:30', time: '16:30' },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNestedModalContent(null); // Reset nested modal content
  };

  const openNestedModal = (content) => {
    setNestedModalContent(content);
  };

  const closeNestedModal = () => {
    setNestedModalContent(null);
  };

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
        <div>Ngày: {selectedDate.toLocaleDateString()} - Bác sĩ {doctor && doctor.name}</div>
        
          <h3>Chọn khung giờ</h3>
          <div className={styles.timeSlotContainer}>
            {timeSlots.map((timeSlot) => (
              <div className={styles.timeSlot}>{timeSlot.name}</div>
            ))}
          </div>
          
            <div className='d-flex' style={{ alignItems: 'center' }}>
            <h3>Hồ sơ</h3>
            {!file &&<div className={styles.btnContainer}>
              <div>
                <Button type="button" name="Chọn" color='#37A4F3' onClick={() => openNestedModal('select')} />
              </div>
              <div>
                <Button type="button" name="Tạo hồ sơ" color='green' onClick={() => openNestedModal('create')} />
              </div>
            </div>}
          </div>
          {file && 
            <div>
                <h5>{file.name}</h5>
                <p>Triệu chứng: {file.symptom}</p>    
          </div>}
          <form className={styles.form}>
          <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color='#37A4F3' />
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
              {/* Your list of existing files goes here */}
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeNestedModal} />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
