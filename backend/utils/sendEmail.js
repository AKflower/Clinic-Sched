const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc bất kỳ dịch vụ email nào khác
    auth: {
      user: 'clinicshed@gmail.com',
      pass: 'Dung0804'
    }
  });

  const mailOptions = {
    from: 'clinicshed@gmail.com',
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
