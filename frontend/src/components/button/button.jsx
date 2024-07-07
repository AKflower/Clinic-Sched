import styles from './button.module.scss'

export default function Button({ onClick,name,color="#1F95A7",disabled=false}) {
    return (
        <div className={styles.container} onClick={onClick}>
            <button style={{background:color}} disabled={disabled}>{name}</button>
        </div>
    )
}