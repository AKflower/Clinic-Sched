import styles from './forgotPassword.module.scss'
import Brand from '../../components/brand/brand'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import { Link } from 'react-router-dom';

export default function ForgotPassword () {
    return (
        <div className={styles.container}>
            <div className={styles.brandContainer}>
                <Brand size={2}></Brand>
            </div>
            <form>
                    <Input label={'Số điện thoại'}/>
                    <Button name={'Gửi yêu cầu'}></Button>
                   
            </form>
           
        </div>
    )
}