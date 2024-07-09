import styles from './cardInfor.module.scss'

export default function CardInfor({title,fields=[]}) {
    console.log('Khóc: ',title,fields);
    return(
        <div className={styles.container}>
            <h5 style={{textAlign: 'center'}}>{title}</h5>
            {fields.map((field) => {
                <div className={styles.field}>
                <p>{field.label}:</p>
                <p>{field.value}</p>
            </div>
            })}
            
           
        </div>
    )
}