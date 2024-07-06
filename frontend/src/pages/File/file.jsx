import Button from '../../components/button/button'
import CardFile from '../../components/card/cardFile'
import styles from './file.module.scss'

export default function File () {
    return (
        <div className={styles.container}>
            <h1>Hồ sơ</h1>
            <div className={styles.button}>
                <div style={{minWidth: '8em'}}>
                    <Button name={'Tạo mới'} color='#37A4F3'/>
                </div>
               
            </div>
            <div className={styles.fileContainer}>
                <CardFile id={'121'} name={'Nguyễn Văn A'} symptom={'Ho, sốt'} description={'Mỗi lần thiếu tiền là tôi cảm thấy mệt mỏi'}/>

            </div>
        </div>
    )
}