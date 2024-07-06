import styles from './register.module.scss'
import Brand from '../../components/brand/brand'
import Input from '../../components/input/input'
import Button from '../../components/button/button'

export default function Register () {
    return (
        <div className={styles.container}>
            <div className={styles.brandContainer}>
                <Brand size={2}></Brand>
            </div>
            <form>
                    <Input label={'Số điện thoại'}/>
                    <Input label={'Mật khẩu'} type={'password'}/>
                    <Input label={'Xác nhận mật khẩu'} type={'password'}/>
                    <Button name={'Đăng ký'}></Button>
                    
            </form>
           
        </div>
    )
}