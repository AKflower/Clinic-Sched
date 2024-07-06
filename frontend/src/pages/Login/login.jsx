import styles from './login.module.scss'
import Brand from '../../components/brand/brand'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import { Link } from 'react-router-dom';

export default function Login () {
    return (
        <div className={styles.container}>
            <div className={styles.brandContainer}>
                <Brand size={2}></Brand>
            </div>
            <form>
                    <Input label={'Số điện thoại'}/>
                    <Input label={'Mật khẩu'} type={'password'}/>
                    <Button name={'Đăng nhập'}></Button>
                    <div className={styles.footerLogin}>
                        <Link to="/register">Đăng ký</Link>
                        <Link to="/forgot">Quên mật khẩu</Link>
                        
                    </div>
            </form>
           
        </div>
    )
}