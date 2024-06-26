// server/utils/mail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendOrderEmail = (orderDetails) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'client-email@example.com',
        subject: 'Order Confirmation',
        text: `Your order has been placed successfully. Details: ${JSON.stringify(orderDetails)}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = { sendOrderEmail };
