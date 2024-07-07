import styles from './register.module.scss'
import Brand from '../../components/brand/brand'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import { useState } from 'react';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';




export default function Register () {
    const [isLoading,setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        reTypePassword: '',
      });
      const navigate = useNavigate()
    
      const handleChange = (e) => {
        console.log(e.target);
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
        console.log(formData)
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        for (const field in formData) {
            if (formData[field].trim() === '') {
              toast.error(`Vui lòng không để trống bất kì thông tin nào!`);
              return;
            }
          }
        if (formData.password!=formData.reTypePassword) {
            toast.error('Mật khẩu không trùng khớp nhau!');
            setFormData((prevData) => ({
                ...prevData,
                reTypePassword: ''
              }));
              return;
        }
        try {
          const response = await authService.register(
            formData.name,
            formData.phone,
            formData.email,
            formData.password,
            formData.reTypePassword,
          );
          console.log('User registered:', response);

          setFormData(() => ({
            phone: '',
            name: '',
            password:'',
            email: '',
            reTypePassword: ''
          }));
          toast.success('Đăng ký thành công!');
          setTimeout(function () {
            navigate(`/login`)
          },1000)
        } catch (err) {
          console.error('Registration error:', err.message);
          setIsLoading(false);
        }
      };
      
    return (
        
        <div className={styles.container}>
            <div className={styles.brandContainer}>
                <Brand size={2}></Brand>
            </div>
            <form>
                    <Input label={'Họ và tên'} name="name" value={formData.name} onChange={handleChange}/>
                    <Input label={'Số điện thoại'} name="phone" value={formData.phone} onChange={handleChange}/>
                    <Input label={'Email'} type={'email'} name="email" value={formData.email} onChange={handleChange}/>
                    <Input label={'Mật khẩu'} type={'password'} name="password" value={formData.password} onChange={handleChange}/>
                    <Input label={'Xác nhận mật khẩu'} type={'password'} name="reTypePassword" value={formData.reTypePassword} onChange={handleChange}/>
                    <Button name={'Đăng ký'} onClick={handleSubmit} disabled={isLoading}></Button>
                    
            </form>
           
        </div>
    )
}