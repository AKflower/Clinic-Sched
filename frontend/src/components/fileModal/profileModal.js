import React from 'react';
import styles from './profileModal.module.scss';
import Input from '../input/input'
import Button from '../button/button'
import fileService from '../../services/fileService';
import { useState,useEffect } from 'react'
import { toast } from 'react-toastify'

const ProfileModal = ({ isOpen, onClose, file }) => {

    const role = localStorage.getItem('role')
    const [result,setResult] = useState(file.result)
    const handleInputChange = (e) => {
        setResult(e.target.value);
    }
    const handleUpdate = async () => {
        file.result=result;
        try {
          await fileService.updateFile(file._id, file);
          toast.success('Cập nhật kết quả thành công!')

       
        } catch (error) {
          console.error('Error updating file:', error.message);
        }
      };
    
    if (!file) return;
   
    return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2>{file.name}</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.content}>
        <div><span style={{fontWeight:'800'}}>Triệu chứng: </span><span>{file.symptom}</span></div>
        <div><span style={{fontWeight:'800'}}>Mô tả: </span><span>{file.description}</span></div>
        {role=='doctor' && <Input label={'Kết quả'} isTextArea={true} value={result} onChange={(e) => handleInputChange(e)}/>
    }
         {role=='doctor' && <Button name={'Lưu'}  onClick={() => handleUpdate() }/>
}
      </div>
    </div>
  );
};

export default ProfileModal;
