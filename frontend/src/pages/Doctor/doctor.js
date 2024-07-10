import styles from './doctor.module.scss';
import doctorService from '../../services/doctorService';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import Modal from 'react-modal';
import Input from '../../components/input/input';
import departmentService from '../../services/departmentService';
import Select2 from '../../components/select/select2';

Modal.setAppElement('#root'); // Thiết lập

export default function Doctor () {
  const [doctorsBackup, setDoctorsBackup] = useState([]);
  const [department, setDepartment] = useState(null); 
  const [isCreate, setIsCreate] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [doctorSelected, setDoctorSelected] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartment(data);
    } catch (error) {
      console.error('Error fetching department:', error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const doctors = await doctorService.getAllDoctors();
      setDoctors(doctors);
      setDoctorsBackup(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      if (doctorSelected._id) {
        await doctorService.updateDoctor(doctorSelected._id, { ...doctorSelected });
      } else {
        await doctorService.addDoctor(doctorSelected);
      }
      fetchDoctors();
      closeModal();
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setDoctorSelected(doctor);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsCreate(false);
    setIsModalOpen(false);
  };

  const openPasswordModal = (e) => {
    e.preventDefault()
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      doctorSelected.department.push(value);
      setDoctorSelected(doctorSelected);
      return;
    }
    setDoctorSelected((prevDoctor) => ({
      ...prevDoctor,
      [name]: value
    }));
  };

  const handleUpdateActive = async (id, isActive, e) => {
    e.stopPropagation();
    try {
      await doctorService.updateActiveDoctor(id, isActive);
      fetchDoctors();
    } catch (error) {
      console.error('Error updating doctor status:', error);
    }
  };

  const handleFilter = (e) => {
    const { value } = e.target;
    if (!value) fetchDoctors();
    const temp = doctorsBackup.filter((doctor) => doctor.phone.includes(value));
    setDoctors(temp);
  };

  const handleCreateDoctor = () => {
    setDoctorSelected({ name: '', email: '', phone: '', department: [], password: '' });
    setIsCreate(true);
    openModal();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);
  };

  const handleUpdatePassword = async (e) => {
    
    e.preventDefault();
    try {
      await doctorService.updateDoctorPassword(doctorSelected._id, newPassword);
      closePasswordModal();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản lý bác sĩ</h2>
          <div style={{ minWidth: '11em' }}>
            <Button name="Thêm bác sĩ" color="blue" onClick={handleCreateDoctor} />
          </div>
        </div>
        <div style={{ width: '20em', margin: '0 0 1em 0' }}>
          <Input label={'Số điện thoại'} onChange={handleFilter} type='numeric' />
        </div>
      </div>
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
            <tr key={doctor._id} onClick={() => handleSelectDoctor(doctor)}>
              <td>{doctor.name}</td>
              <td>{doctor.phone}</td>
              <td>{doctor.email}</td>
              <td>{doctor.departmentId}</td>
              <td>
                {doctor.isActive ? (
                  <Button name='Vô hiệu' color='red' onClick={(e) => handleUpdateActive(doctor._id, false, e)} />
                ) : (
                  <Button name='Kích hoạt' color='green' onClick={(e) => handleUpdateActive(doctor._id, true, e)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {doctorSelected && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add File Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>Thông tin bác sĩ</h2>
          <form className={styles.form}>
            <Input label={'Tên'} name='name' value={doctorSelected.name} onChange={handleInputChange} />
            <Input label={'Số điện thoại'} name='phone' value={doctorSelected.phone} onChange={handleInputChange} isDisabled={!isCreate} />
            <Input label={'Email'} name='email' value={doctorSelected.email} onChange={handleInputChange} />
            {isCreate && <Input label={'Mật khẩu'} name='password' value={doctorSelected.password} type='password' onChange={handleInputChange} />}
            {!isCreate && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1em' }}>
                <Input label={'Mật khẩu'} name='password' value={'********'} type='password' isDisabled />
                <div style={{ padding: '1em' }}>
                  <Button name={'Đổi'} onClick={openPasswordModal} />
                </div>
              </div>
            )}
            <Select2 label={'Chuyên khoa'} value={doctorSelected.department[0]} name='department' onChange={handleInputChange} options={department} />
          </form>
          <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleUpdateDoctor} />
            </div>
          </div>
        </Modal>
      )}
      {doctorSelected && (
        <Modal
          isOpen={isPasswordModalOpen}
          onRequestClose={closePasswordModal}
          contentLabel="Change Password Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>Đổi mật khẩu</h2>
          <form className={styles.form}>
            <Input label={'Mật khẩu mới'} name='newPassword' value={newPassword} type='password' onChange={handlePasswordChange} />
          </form>
          <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closePasswordModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleUpdatePassword} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
