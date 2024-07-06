import styles from './input.module.scss'

export default function Input({label,type='text'}) {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            <input type={type} />
        </div>
    )
   

    
}