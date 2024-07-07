import styles from './userProfile.module.scss';
import {useLocation} from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserProfile () {
    const path = useLocation().pathname;
    

    return (
        <>
        {!(path.includes('/login') || path.includes('/register') || path.includes('/forgot')) && <div className={styles.container}>
            <div className={styles.avatar}></div>
            <div className={styles.name}>Nguyễn Văn A</div>
            <div style={{cursor: 'pointer'}}><LogoutIcon /></div>
        </div>}
        </>
    )
}