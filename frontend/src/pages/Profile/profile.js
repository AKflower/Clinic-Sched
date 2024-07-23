import styles from './profile.module.scss';
import Input from '../../components/input/input';
import doctorService from '../../services/doctorService';
import userService from '../../services/userService';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import PasswordChangeModal from '../../components/passwordChangeModal/passwordChangeModal';
import authService from '../../services/authService';
import {toast} from 'react-toastify'

export default function Profile() {
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('id');
const token = localStorage.getItem('token')
  useEffect(() => {
    if (role === 'doctor') fetchDoctor();
    else fetchUser();
  }, []);

  const fetchDoctor = async () => {
    const data = await doctorService.getDoctorById(id);
    setDoctor(data);
  };

  const fetchUser = async () => {
    const data = await userService.getUserById(id);
    setUser(data);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSavePassword = async (currentPassword,newPassword) => {

    // Xử lý logic lưu mật khẩu ở đây
    try{
    if (role=='doctor') await authService.changePassword(token,doctor.phone,currentPassword,newPassword)
    else await authService.changePassword(token,user.phone,currentPassword,newPassword);
    toast.success('Đổi mật khẩu thành công!')
    closeModal();
}
    catch(err)  {console.error(err);toast.error('Sai mật khẩu!') }
  };
  const handleSaveInfor = () => {
     if (role=='doctor') doctorService.updateDoctor(id,doctor)
     else userService.updateUser(id,user);
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (role=='doctor') setDoctor((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    else setUser((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };
  const renderProfile = (data) => (
    <div className={styles.container}>
      <h1>Trang cá nhân</h1>
      <div className={styles.formContainer}>
        <Input label={'Họ tên'} value={data.name} name={'name'} onChange={handleInputChange}/>
        <Input label={'Số điện thoại'} value={data.phone} isDisabled />
        <Input label={'Email'} value={data.email} isDisabled />
        <Input label={'Ngày sinh'} type='date' value={formatDate(data.birthdate)} name={'birthdate'} onChange={handleInputChange}/>
        <div><Button name={'Lưu'} color='green' onClick={handleSaveInfor}/></div>
        <div className={styles.passwordContainer}>
          <Input label={'Mật khẩu'} type='password' value={'*******'} isDisabled />
          <Button name={'Đổi'} onClick={openModal} color='red'/>
        </div>

      </div>
      <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSavePassword} />
    </div>
  );

  if (user) return renderProfile(user);
  if (doctor) return renderProfile(doctor);

  return null;
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
