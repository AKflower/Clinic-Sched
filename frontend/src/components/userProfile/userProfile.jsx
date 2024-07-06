import styles from './userProfile.module.scss';

export default function UserProfile () {
    return (
        <div className={styles.container}>
            <div className={styles.avatar}></div>
            <div className={styles.name}>Nguyễn Văn A</div>
        </div>
    )
}