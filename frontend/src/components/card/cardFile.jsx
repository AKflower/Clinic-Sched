import styles from './cardFile.module.scss';

export default function CardFile ({name,gender,id,symptom,description,birthdate,createdDate}) {
    return (
        <div className={styles.container}>
            <h4>{name} - {gender} - {formatDate(birthdate)}</h4>
            <div className={styles.field}>
                <div>Mã hồ sơ:</div>
                <div>#{id}</div>
            </div>
            <div className={styles.field}>
                <div>Triệu chứng:</div>
                <div>{symptom}</div>
            </div>
            <div className={styles.field}>
                <div>Mô tả:</div>
                <div>{description}</div>
            </div>
            <div className={styles.field}>
                <div>Ngày tạo:</div>
                <div>{formatDate(createdDate)}</div>
            </div>
            
        </div>
    )
}
const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    var formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate);
    return formattedDate;

  };