// src/components/passwordChangeModal/passwordChangeModal.js
import styles from './passwordChangeModal.module.scss';
import Input from '../input/input';
import Button from '../button/button';
import { useState } from 'react';
import {toast} from 'react-toastify'

export default function PasswordChangeModal({ isOpen, onClose, onSave }) {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const handleCheck = async () => {
        if (retypePass!=newPass) {
            toast.error('Không trùng khớp')
        }
        else {
            onSave(oldPass,newPass);
        }
    }
    if (!isOpen) return null;

    const handleOldPassChange = (e) => setOldPass(e.target.value);
    const handleNewPassChange = (e) => setNewPass(e.target.value);
    const handleRetypePassChange = (e) => setRetypePass(e.target.value);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Đổi mật khẩu</h2>
                <Input label={'Mật khẩu cũ'} type='password' value={oldPass} onChange={handleOldPassChange} />
                <Input label={'Mật khẩu mới'} type='password' value={newPass} onChange={handleNewPassChange} />
                <Input label={'Xác nhận mật khẩu mới'} type='password' value={retypePass} onChange={handleRetypePassChange} />
                <div className={styles.buttonContainer}>
                    <Button name={'Hủy'} onClick={onClose} color='red' />
                    <Button name={'Lưu'} onClick={handleCheck} />
                </div>
            </div>
        </div>
    );
}
