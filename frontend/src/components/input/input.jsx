import styles from './input.module.scss'

export default function Input({label, value, type='text',name,onChange,isTextArea=false,isDisabled=false}) {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            {!isTextArea ?
               ( <input name={name} type={type} onChange={onChange} value={value} disabled={isDisabled}/>) : 
               (<textarea name={name} type={type} onChange={onChange} value={value}></textarea>)}
        </div>
    )
   

    
}