import styles from './input.module.scss'

export default function Input({label, value, type='text',name,onChange}) {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            <input name={name} type={type} onChange={onChange} value={value}/>
        </div>
    )
   

    
}