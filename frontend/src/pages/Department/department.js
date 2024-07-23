import styles from './department.module.scss';
import departmentService from '../../services/departmentService';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import Modal from 'react-modal';
import Input from '../../components/input/input';

Modal.setAppElement('#root'); // Thiết lập

export default function Department () {
  const [departments, setDepartments] = useState([]);
  const [departmentsBackup, setDepartmentsBackup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentSelected, setDepartmentSelected] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departments = await departmentService.getAllDepartments();
      setDepartments(departments);
      setDepartmentsBackup(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      if (departmentSelected._id) {
        await departmentService.updateDepartment(departmentSelected._id, departmentSelected.name,departmentSelected.description);
      } else {
        await departmentService.addDepartment(departmentSelected.name,departmentSelected.description);
      }
      fetchDepartments(); 
      closeModal();
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleSelectDepartment = (department) => {
    setDepartmentSelected(department);
    openModal();
  };

  const handleCreateDepartment = () => {
    setDepartmentSelected({ name: '', description: '' });
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentSelected((prevDepartment) => ({
      ...prevDepartment,
      [name]: value
    }));
  };

  const handleFilter = (e) => {
    const { value } = e.target;
    if (!value) {
      fetchDepartments();
    } else {
      const filteredDepartments = departmentsBackup.filter((department) => 
        department.name.toLowerCase().includes(value.toLowerCase())
      );
      setDepartments(filteredDepartments);
    }
  };
  const  handleUpdateActive = async (id, isActive, e)  => {
    e.stopPropagation();
    try {
      await departmentService.updateDepartmentIsActive(id, isActive);
      fetchDepartments(); 
    } catch (error) {
      console.error('Error updating department status:', error);
    }
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{display: 'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2>Quản lý chuyên khoa</h2>  
            <div style={{minWidth:'11em'}}><Button name="Thêm chuyên khoa" color="blue" onClick={handleCreateDepartment} /></div>
        </div>
        
        <div style={{ width: '20em', margin: '0 0 1em 0' }}>
          <Input label="Chuyên khoa" onChange={handleFilter} />
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ minWidth: '10em' }}>Chuyên khoa</th>
            <th>Mô tả</th>
            <th style={{ minWidth: '5em' }}></th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department._id} onClick={() => handleSelectDepartment(department)}>
              <td>{department.name}</td>
              <td>{department.description}</td>
              <td>
                <Button 
                  name={department.isActive ? 'Vô hiệu' : 'Kích hoạt'} 
                  color={department.isActive ? 'red' : 'green'} 
                  onClick={(e) => handleUpdateActive(department._id, !department.isActive, e)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Department Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>{departmentSelected._id ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa'}</h2>
        <form className={styles.form} onSubmit={handleUpdateDepartment}>
          <Input 
            label="Tên" 
            name="name" 
            value={departmentSelected.name} 
            onChange={handleInputChange} 
            required 
          />
          <Input 
            label="Giới thiệu" 
            name="description" 
            value={departmentSelected.description} 
            onChange={handleInputChange} 
            isTextArea 
            required 
          />
          <div className={styles.button}>
            <Button type="button" name="Hủy" color="#FF6347" onClick={closeModal} />
            <Button type="submit" name="Xác nhận" color="#37A4F3" />
          </div>
        </form>
      </Modal>
    </div>
  );
}

