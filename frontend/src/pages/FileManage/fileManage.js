import styles from './fileManage.module.scss';
import fileService from '../../services/fileService';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import Modal from 'react-modal';
import Input from '../../components/input/input'

Modal.setAppElement('#root'); // Thiết lập

export default function FileManage () {
  const [filesBackup,setFilesBackup] = useState([]);
    const [files, setFiles] = useState([]);
    useEffect(() => {
        fetchFiles();
      }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFiles = async () => {
        try {
        const files = await fileService.getAllFiles();
        setFiles(files);
        setFilesBackup(files);

        } catch (error) {
        console.error('Error fetching files:', error);
        }
    };
    const handleUpdateFile = async (e) => {
        e.preventDefault();
        try {
          await fileService.updateFile(fileSelected._id, { ...fileSelected });
          fetchFiles(); 
          closeModal();
        } catch (error) {
          console.error('Error updating file:', error);
        }
      };
    
    const [fileSelected,setfileSelected] = useState(null)
    const handleSelectFile = function(user) {
    
        setfileSelected(user);
        openModal();
    }
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
  
  
    };
    const handleInputChange = (e) => {
      console.log(e.target)
      const { name, value } = e.target;
      console.log(name,value);
      setfileSelected((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    };
    // const handleUpdateActive = async (id,isActive,e) => {
    // e.stopPropagation();
    // try {
    //   await fileService.updateActiveFile(id,isActive);
    //   fetchFiles(); 
    // }
    // catch(error){
    //   console.error('Error deleting user:', error);
    // }
      
    // }
    const handleFilter = async (e) => {
      
      const {value} = e.target;
      if (value=='' || value==null) fetchFiles()
      console.log(value);
   
      var temp = filesBackup.filter((file) => file.name.includes(value));
      setFiles(temp);
    }
        return (
        <div className={styles.container}>
        <div className={styles.header}>
        <h2>Quản lý hồ sơ bệnh án</h2>  
        <div style={{    width: '20em', margin:'0 0 1em 0'}}>
          <Input label={'Tên bệnh nhân'} onChange={handleFilter} />
        </div> 
        </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Tên</th>
                    <th>Năm sinh</th>
                    <th>Triệu chứng</th>
                   
                   
                    </tr>
                    
                </thead>
                <tbody>

                   {files.map((file) => (
                    <tr  onClick={() => handleSelectFile(file)}>
                        <td>{file.name}</td>
                        <td>{formatDate(file.birthDate)}</td>
                        <td>{file.symptom}</td>
                       
          
                    </tr>

                )) }
                </tbody>
            </table>
            {fileSelected &&<Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add File Modal"
                className={styles.modal}
                overlayClassName={styles.overlay}
              >
                <h2>Thông tin hồ sơ bệnh án</h2>
                <form className={styles.form}>
                <Input label={'Tên'} name='name' value={fileSelected.name} onChange={handleInputChange}/>
                
                <Input label={'Năm sinh'} name='date' value={formatDateYYYY(fileSelected.birthDate)} onChange={handleInputChange} type='date'/>
                <Input label={'Triệu chứng'} name='symptom' value={fileSelected.symptom} onChange={handleInputChange}/>
                <Input label={'Mô tả'} value={fileSelected.description} name='description' onChange={handleInputChange} isTextArea={true}/>
                </form>
                <div className={styles.button}>
                <div>
                  <Button type="button" name="Hủy" color='#FF6347' onClick={closeModal} />
                </div>
                <div>
                  <Button type="button" name="Xác nhận" color='#37A4F3' onClick={handleUpdateFile}/>
                </div>
              </div>
                
                
              </Modal>}
        </div>
            
          
        
    )
}
function formatDate(dateInput) {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const formatDateYYYY = (dateInput) => {
    const date =new Date(dateInput)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };