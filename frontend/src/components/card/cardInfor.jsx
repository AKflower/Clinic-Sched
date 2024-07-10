import styles from './cardInfor.module.scss'

export default function CardInfor({title,fields}) {
   
    return(
        <div className={styles.container}>
            <h5 style={{textAlign: 'center'}}>{title}</h5>
            {fields.map((field) => (

                <div className={styles.field}>
                <p>{field.label}:</p>
                <p style={{maxWidth: '20em',textAlign: 'right'}}>{field.value}</p>
            </div>
            ))}
        </div>
    )
}