import Button from '../../components/button/button'
import CardFile from '../../components/card/cardFile'
import styles from './file.module.scss'
import React, { useState, useEffect } from 'react';
import fileService from '../../services/fileService';
import Modal from 'react-modal';
import Input from '../../components/input/input';
import Select from '../../components/select/select';

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function File () {
    const userId=localStorage.getItem('id');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFile, setNewFile] = useState({
      userId: userId,
      name: '',
      gender: 'Nam',
      birthDate: '',  
      symptom: '',
      description: '',
    });
  
    useEffect(() => {
      fetchFiles();
    }, []);
  
    const fetchFiles = async () => {
      try {
        const data = await fileService.getFilesByUserId(userId);
        data.sort((a,b) => b.fileid-a.fileid);
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error.message);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await fileService.deleteFile(id);
        fetchFiles();
      } catch (error) {
        console.error('Error deleting file:', error.message);
      }
    };
  
    const handleEdit = (file) => {
      setSelectedFile(file);
      setIsEditing(true);
    };
    
    const handleUpdate = async (updatedFile) => {
      try {
        await fileService.updateFile(updatedFile._id, updatedFile);
        fetchFiles();
        setIsEditing(false);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error updating file:', error.message);
      }
    };
  
    const handleAddFile = async (e) => {
        e.preventDefault();
      try {
        await fileService.addFile(newFile);
        fetchFiles();
        closeModal();
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
      setNewFile({

        symptom: '',
        description: '',
        date: '',
        status: '',
        result: ''
      });
    };
    if (!files) return null;
    else return (
        <div className={styles.container}>
            <h1>Hồ sơ</h1>
            <div className={styles.button}>
                <div style={{minWidth: '8em'}}>
                <Button name={'Tạo mới'} color='#37A4F3' onClick={openModal} />
                </div>
               
            </div>
            <div className={styles.fileContainer}>
                {files.map((file) => (
                    <CardFile id={file.fileid} name={file.name} symptom={file.symptom} description={file.description} birthdate={file.birthDate} createdDate={file.createdDate} gender={file.gender} result={file.result}/>
                ))
                    }

            </div>
            <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add File Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Thêm Hồ Sơ Mới</h2>
        <form className={styles.form}>
            <Input label={'Tên'} name={'name'} value={newFile.name} onChange={handleInputChange}/>
            <Select label={'Giới tính'} options={[{value: 'Nam'},{value:'Nữ'}]} value={newFile.gender} onChange={handleInputChange} name={'gender'}/>
            <Input label={'Ngày sinh'} name={'birthDate'} type='date' value={newFile.birthDate} onChange={handleInputChange}/>
            <Input label={'Triệu chứng'} name={'symptom'} value={newFile.symptom} onChange={handleInputChange}/>
            <Input label={'Mô tả'} name={'description'} value={newFile.description} onChange={handleInputChange} isTextArea={true}/>
            <div className={styles.button}>
            <div>
                <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
            </div>
            <div>
                <Button type="button" name="Tạo hồ sơ" color='#37A4F3' onClick={handleAddFile} />
            </div>
            </div>
           
        </form>
      </Modal>
        </div>
    )
}
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };