import styles from './card.module.scss';
import pic1 from '../../assets/images/department/1.png';
import pic2 from '../../assets/images/department/2.png';
import pic3 from '../../assets/images/department/3.png';
import pic4 from '../../assets/images/department/4.png';
import pic5 from '../../assets/images/department/5.png';
import { useState, useEffect } from 'react';

import {useNavigate} from 'react-router-dom'

export default function Card({id,index,name,description}) {
    const [pic,setPic] = useState()
    const navigate = useNavigate()
    const handleClick = () => {
        console.log(id);
        navigate(`/home/doctors?id=${id}`)
        //Redicert
    }
    useEffect(() => {
        // Logic để set hình ảnh dựa vào id
        switch (index) {
            case 0:
                setPic(pic1);
                break;
            case 1:
                setPic(pic2);
                break;
            case 2:
                setPic(pic3);
                break;
            case 3:
                setPic(pic4);
                break;
            case 4:
                setPic(pic5);
                break;
            default:
                setPic(null); // Xử lý khi id không khớp với bất kỳ case nào
                break;
        }
    }, [id]);
    return (
        <div className={styles.container} onClick={handleClick}>
            <img src={pic} style={{width: '10em'}}/>
            <h4>{name}</h4>
            <p>{description}</p>
        </div>
    )
}