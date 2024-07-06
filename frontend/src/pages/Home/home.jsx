import styles from './home.module.scss';
import Card from '../../components/card/card';
import { useState } from 'react';

export default function Home () {
    // const [department,setDepartment] = useState(null);
    
    return (
        <div className={styles.container}>
            <h1>Đặt khám</h1>
            <div className={styles.departmentContainer}>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                
            </div>
            
        </div>
    )
}