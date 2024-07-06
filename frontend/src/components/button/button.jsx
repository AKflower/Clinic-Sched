import styles from './button.module.scss'

export default function Button({name,color="#1F95A7"}) {
    return (
        <div className={styles.container}>
            <button style={{background:color}}>{name}</button>
        </div>
    )
}