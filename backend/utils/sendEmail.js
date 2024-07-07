const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'clinicshed@gmail.com',
        pass: 'uuxy srbm pjyb wyzl', // Sử dụng mật khẩu ứng dụng tại đây
      },
    });

    const mailOptions = {
      from: 'clinicshed@gmail.com',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = sendEmail;
