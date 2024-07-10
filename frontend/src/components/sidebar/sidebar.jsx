import styles from './sidebar.module.scss';
import Brand from '../brand/brand';
import { Link } from 'react-router-dom';
import {useLocation } from 'react-router-dom'
import user from '../../assets/images/user.svg'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ApartmentIcon from '@mui/icons-material/Apartment';


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
           {(role == 'user' || role=='doctor') && <Link to='/appointment'>
                <div className={styles.item} style={path.includes('/appointment') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                    <CalendarMonthOutlinedIcon /><span>Lịch khám</span>
                </div>
            </Link>}
            {(role == 'user' || role=='doctor') &&<Link to='/profile'>
                <div className={styles.item} style={path.includes('/profile') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                    <PersonOutlineIcon /><span>Tài khoản</span>
                </div>
            </Link>
    }
         {role == 'admin' &&   <>
            <Link to='/manage_appointment'>
                <div className={styles.item} style={path.includes('/manage_appointment') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                <CalendarMonthOutlinedIcon /><span>Quản lý lịch khám</span>
                </div>
            </Link>
            <Link to='/manage_user'>
                <div className={styles.item} style={path.includes('/manage_user') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                <PersonOutlineIcon /><span>Quản lý người dùng</span>
                </div>
            </Link>
            <Link to='/manage_doctor'>
                <div className={styles.item} style={path.includes('/manage_doctor') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                <LocalHospitalIcon /><span>Quản lý bác sĩ</span>
                </div>
            </Link>
            <Link to='/manage_file'>
            <div className={styles.item} style={path.includes('/manage_file') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                <AssignmentIndOutlinedIcon /><span>Quản lý hồ sơ</span>
            </div>
            </Link>
            <Link to='/manage_department'>
            <div className={styles.item} style={path.includes('/manage_department') ? {backgroundColor: '#17BB4F',color:'white'} : {}}>
                <ApartmentIcon /><span>Quản lý chuyên khoa</span>
            </div>
            </Link>
            </>
        }
        </div>  

    )
}