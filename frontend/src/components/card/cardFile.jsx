import styles from './cardFile.module.scss';

export default function CardFile ({name,id,symptom,description,createdDate}) {
    return (
        <div className={styles.container}>
            <h4>{name}</h4>
            <div className={styles.field}>
                <div>Mã hồ sơ</div>
                <div>#{id}</div>
            </div>
            <div className={styles.field}>
                <div>Triệu chứng</div>
                <div>{symptom}</div>
            </div>
            <div className={styles.field}>
                <div>Mô tả</div>
                <div>{description}</div>
            </div>
            <div className={styles.field}>
                <div>Ngày tạo</div>
                <div>{createdDate}</div>
            </div>
        </div>
    )
}