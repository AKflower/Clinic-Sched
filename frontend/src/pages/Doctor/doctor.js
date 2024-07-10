import styles from './doctor.module.scss';
import doctorService from '../../services/doctorService';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import Modal from 'react-modal';
import Input from '../../components/input/input'

Modal.setAppElement('#root'); // Thiết lập

export default function Doctor () {
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        fetchDoctors();
      }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDoctors = async () => {
        try {
        const doctors = await doctorService.getAllDoctors();
        setDoctors(doctors);
        } catch (error) {
        console.error('Error fetching doctors:', error);
        }
    };
    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        try {
          await doctorService.updateDoctor(doctorSelected._id, { ...doctorSelected });
          fetchDoctors(); 
          closeModal();
        } catch (error) {
          console.error('Error updating doctor:', error);
        }
      };
    
    const [doctorSelected,setdoctorSelected] = useState(null)
    const handleSelectDoctor = function(user) {
    
        setdoctorSelected(user);
        openModal();
    }
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
  
  
    };
    const handleInputChange = (e) => {
      console.log(e.target)
      const { name, value } = e.target;
      console.log(name,value);
      setdoctorSelected((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    };
    const handleUpdateActive = async (id,isActive,e) => {
    e.stopPropagation();
    try {
      await doctorService.updateActiveDoctor(id,isActive);
      fetchDoctors(); 
    }
    catch(error){
      console.error('Error deleting user:', error);
    }
      
    }
        return (
        <div className={styles.container}>
        <h2>Quản lý bác sĩ</h2>  
            <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Chuyên khoa</th>
                    <th></th>
                    </tr>
                    
                </thead>
                <tbody>

                   {doctors.map((doctor) => (
                    <tr  onClick={() => handleSelectDoctor(doctor)}>
                        <td>{doctor.name}</td>
                        <td>{doctor.phone}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.departmentId}</td>
                        <td>{doctor.isActive ? <Button name='Vô hiệu' color='red' onClick={(e) => handleUpdateActive(doctor._id,false,e)}/>:<Button name='Kích hoạt' color='green' onClick={(e) => handleUpdateActive(doctor._id,true,e)}/>}</td>
                    </tr>

                )) }
                </tbody>
            </table>
            {doctorSelected &&<Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add File Modal"
                className={styles.modal}
                overlayClassName={styles.overlay}
              >
                <h2>Thông tin bác sĩ</h2>
                <form className={styles.form}>
                <Input label={'Tên'} name='name' value={doctorSelected.name} onChange={handleInputChange}/>
                <Input label={'Số điện thoại'} name='phone' value={doctorSelected.phone} isDisabled={true}/>
                <Input label={'Email'} name='email' value={doctorSelected.email} onChange={handleInputChange}/>
                <Input label={'Chuyên khoa'} value={doctorSelected.departmentId} name='departmentId' onChange={handleInputChange}/>
                </form>
                <div className={styles.button}>
                <div>
                  <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
                </div>
                <div>
                  <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleUpdateDoctor}/>
                </div>
              </div>
                
                
              </Modal>}
        </div>
            
          
        
    )
}