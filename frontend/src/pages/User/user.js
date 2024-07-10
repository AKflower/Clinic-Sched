import styles from './user.module.scss';
import UserService from '../../services/userService';
import { useState, useEffect} from  'react'
import Button from '../../components/button/button';
import Modal from 'react-modal';
import Input from '../../components/input/input'

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function User () {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await UserService.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await UserService.addUser(newUser);
      fetchUsers(); 
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  

  const handleUpdateUser = async (e) => {
    console.log('test');
    e.preventDefault();
    try {
      await UserService.updateUser(userSelected._id, { ...userSelected });
      fetchUsers(); 
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
    
  };
  const handleChange = async () => {

  }
  const handleDeleteUser = async (id) => {
    try {
      await UserService.deleteUser(id);
      fetchUsers(); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const [userSelected,setUserSelected] = useState(null)
    const handleSelectUser = function(user) {
    
        setUserSelected(user);
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
      setUserSelected((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    };
    const handleUpdateActive = async (id,isActive,e) => {
      e.stopPropagation();
      try {
      await UserService.updateActiveUser(id,isActive);
      fetchUsers(); 
      
    }
    catch(error){
      console.error('Error deleting user:', error);
    }
      
    }
    
    return (
        
        <div className={styles.container}>
        <h2>Quản lý người dùng</h2>  
            <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Năm sinh</th>
                    <th>Email</th>
                    <th></th>
                    </tr>
                    
                </thead>
                <tbody>

                   {users.map((user) => (
                    <tr key={user._id} onClick={() => handleSelectUser(user)}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.birthdate}</td>
                        <td>{user.email}</td>
                        <td>{user.isActive ? <Button name='Vô hiệu' color='red' onClick={(e) => handleUpdateActive(user._id,false,e)}/>:<Button name='Kích hoạt' color='green' onClick={(e) => handleUpdateActive(user._id,true,e)}/>}</td>
                    </tr>

                )) }
                </tbody>
            </table>
            {userSelected &&<Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Add File Modal"
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            <h2>Thông tin người dùng</h2>
            <form className={styles.form}>
            <Input label={'Tên'} name='name' value={userSelected.name} onChange={handleInputChange}/>
            <Input label={'Số điện thoại'} name='phone' value={userSelected.phone} isDisabled={true}/>
            <Input label={'Email'} name='email' value={userSelected.email} onChange={handleInputChange}/>
            <Input label={'Năm sinh'} value={userSelected.birthdate} type='date' name='birthdate' onChange={handleInputChange}/>
            </form>
            <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleUpdateUser}/>
            </div>
          </div>
            
            
          </Modal>}
        </div>
    )
}

