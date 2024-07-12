import styles from './userProfile.module.scss';
import {useLocation, useNavigate} from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserProfile () {
    const name = localStorage.getItem('name')
    const path = useLocation().pathname;
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <>
        {!(path.includes('/login') || path.includes('/register') || path.includes('/forgot') ||  path.includes('/room') ) && <div className={styles.container}>
            <div className={styles.avatar}></div>
            <div className={styles.name}>{name}</div>
            <div style={{cursor: 'pointer'}} onClick={logOut}><LogoutIcon /></div>
        </div>}
        </>
    )
}