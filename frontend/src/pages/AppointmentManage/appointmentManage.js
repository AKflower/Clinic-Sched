import styles from './appointmentManage.module.scss';
import appointmentService from '../../services/appointment';
import { useState, useEffect } from 'react';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Thiết lập phần tử gốc của ứng dụng

export default function AppointmentManage() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsBackup, setAppointmentsBackup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentSelected, setAppointmentSelected] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointments = await appointmentService.getAllAppointments();
      const sortedArray = appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(sortedArray);
      setAppointmentsBackup(sortedArray);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleFilter = async (e) => {
    const { value } = e.target;
    if (value === '' || value == null) fetchAppointments();
    const temp = appointmentsBackup.filter((app) => app.date.split('T')[0] === value);
    setAppointments(temp);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.updateAppointment(appointmentSelected._id, { ...appointmentSelected });
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await appointmentService.deleteAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setAppointmentSelected(appointment);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentSelected((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Quản lý lịch khám</h2>
      <div style={{ minWidth: '11em' }}>
        <Button name="Tạo lịch khám" color="blue" />
      </div>
    </div>
        <div style={{ width: '20em', margin: '0 0 1em 0' }}>
          <Input label={'Ngày khám'} onChange={handleFilter} type={'date'} />
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Người khám</th>
            <th>Bác sĩ</th>
            <th>Chuyên khoa</th>
            <th>Triệu chứng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id} onClick={() => handleSelectAppointment(appointment)}>
              <td>{formatDate(appointment.date)}</td>
              <td>{appointment.userId.name}</td>
              <td>{appointment.doctorId.name}</td>
              <td>{appointment?.departmentId?.name || ''}</td>
              <td>{appointment.fileId.symptom}</td>
              <td>
                <Button name="Xóa" color="red" onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(appointment._id); }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {appointmentSelected && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Appointment Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h2>Thông tin lịch khám</h2>
          <form className={styles.form}>
            <Input label={'Người khám'} name="userId" value={appointmentSelected.userId.name} isDisabled={true} />
            <Input label={'Bác sĩ'} name="doctorId" value={appointmentSelected.doctorId.name} isDisabled={true} />
            <Input label={'Chuyên khoa'} name="departmentId" value={appointmentSelected?.departmentId?.name || ''} isDisabled={true} />
            <Input label={'Triệu chứng'} name="symptom" value={appointmentSelected.fileId.symptom} onChange={handleInputChange} />
          </form>
          <div className={styles.button}>
            <div>
              <Button type="button" name="Hủy" color="#FF6347" onClick={closeModal} />
            </div>
            <div>
              <Button type="button" name="Xác nhận" color="#37A4F3" onClick={handleUpdateAppointment} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
