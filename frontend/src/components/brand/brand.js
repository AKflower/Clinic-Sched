import styles from './brand.module.scss'
import logo from '../../assets/images/logo.png'

export default function Brand({size=1}) {
    return (
        <div className={styles.brandContainer}>
            <div className={styles.logoContainer} >
                <img src={logo} style={{width:size*4+'em'}}/>
            </div>
            <div className={styles.brandName} style={{fontSize:size+'em'}}>
                <span>UTE</span><span>Health</span>
            </div>
        </div>
    )
}