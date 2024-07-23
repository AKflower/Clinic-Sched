import styles from './userProfile.module.scss';
import { useLocation, useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserProfile() {
    const name = localStorage.getItem('name')
    const path = useLocation().pathname;
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        navigate('/login')
    }
    const role = localStorage.getItem('role')
    var roleName;
    if (role == 'admin') roleName = 'Admin';
    else if (role == 'user') roleName = 'User';
    else roleName = 'Doctor';
    return (
        <>
            {!(path.includes('/login') || path.includes('/resgister') || path.includes('/forgot') || path.includes('/room')) && <div className={styles.container}>
                <div className={styles.avatar}></div>
                <div className={styles.name}><span style={{ color: 'green' }}>{roleName}</span> {name}</div>
                <div style={{ cursor: 'pointer' }} onClick={logOut}><LogoutIcon /></div>
            </div>}
        </>
    )
}