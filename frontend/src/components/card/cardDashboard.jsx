import styles from './cardDashboard.module.scss'
import { useNavigate } from 'react-router-dom'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
export default function CardDashBoard({data}) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/appointment`)
    }
    return (
        <div className={styles.container}>
            <div className={styles.icon}><AssignmentTurnedInIcon /> </div> 
           <h1>{data.quant}</h1>
           <h2>{data.text}</h2>
            
        </div>
    )
}