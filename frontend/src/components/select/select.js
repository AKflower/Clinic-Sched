import styles from './select.module.scss'

export default function Select({label,name,onChange,value,options}) {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
       
            <select name={name}  onChange={onChange} value={value} >
                {options.map((option) => (
                    <option value={option.value}>{option.value}</option>
                ))}
            </select> 
        </div>
    )
}