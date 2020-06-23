const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.GMAIL_EMAIL}>`,
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: `<b>${options.message}</b>`, // html body
  });

  // console.log(info);
};

module.exports = sendEmail;
