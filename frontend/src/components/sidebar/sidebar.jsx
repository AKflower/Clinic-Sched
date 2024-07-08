import styles from './sidebar.module.scss';
import Brand from '../brand/brand';
import { Link } from 'react-router-dom';
import {useLocation } from 'react-router-dom'
import user from '../../assets/images/user.svg'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export default function Sidebar () {
    const role = localStorage.getItem('role')
    const path = useLocation().pathname;
    console.log(path);  
    
    return (
        <div className={styles.container} style={{display:path.includes('/login') || path.includes('/register') || path.includes('/forgot') ? 'none' : 'block'}}>
            <div style={{margin: '0 0 0 2em'}}><Brand size={1} /></div>
            
            <Link to='/home'>
                <div className={styles.item} style={path.includes('/home') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                   <OtherHousesOutlinedIcon /><span>Trang chủ</span>
                </div>
            </Link>
            {role == 'user'&&<Link to='/file'>
                <div className={styles.item} style={path.includes('/file') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                    <AssignmentIndOutlinedIcon /><span>Hồ sơ</span>
                </div>
            </Link>}
            <Link to='/appointment'>
                <div className={styles.item} style={path.includes('/appointment') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                    <CalendarMonthOutlinedIcon /><span>Lịch khám</span>
                </div>
            </Link>
            <Link to='/profile'>
                <div className={styles.item} style={path.includes('/profile') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                    <PersonOutlineIcon /><span>Tài khoản</span>
                </div>
            </Link>
        </div>  

    )
}