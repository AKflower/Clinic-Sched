// AppointmentChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentChart = ({ appointments }) => {
  // Tính toán số lượng cuộc hẹn mỗi ngày trong tháng
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const appointmentsPerDay = Array(daysInMonth).fill(0);

  appointments.forEach(appointment => {
    const date = new Date(appointment.date);
    if (date.getMonth() === new Date().getMonth()) {
      const day = date.getDate();
      appointmentsPerDay[day - 1]++;
    }
  });

  const data = {
    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Số lượng lịch khám',
        data: appointmentsPerDay,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê lịch khám trong tháng',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Đảm bảo giá trị trên trục y là số nguyên
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AppointmentChart;
