import styles from './doctors.module.scss'
import {useLocation} from 'react-router-dom';
import CardDoctor from '../../components/card/cardDoctor';


export default function Doctors () {
    const location = useLocation();
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };
    const query = useQuery();
    const id = query.get('id');
   

   
  
    return (
        <div className={styles.container}>
            <h1>Khám tim mạch</h1>
            <div className={styles.doctorsContainer}>
                <CardDoctor />
                <CardDoctor />
                <CardDoctor />
                <CardDoctor />
                <CardDoctor />
                <CardDoctor />
            </div>
        </div>
    )
}