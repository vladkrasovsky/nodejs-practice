const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(data) {
  const { userName, userEmail, userMessage } = data;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVICE,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_SERVICE_USER, // generated ethereal user
      pass: process.env.MAIL_SERVICE_PASSWORD, // generated ethereal password
    },
  });
  const letter = `<h1 style="color: blue; text-decoration: underline">
      Ви отримали листа від ${userName}
    </h1>
    <p>Його контактний email ${userEmail}</p>
    <p>Текст повідомлення: ${userMessage}</p>`;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "alex_goit_56@outlook.com", // sender address
    to: "sorokolital@gmail.com", // list of receivers
    subject: "April 2023. First Intergalactic Jedi Conference.", // Subject line
    text: userMessage, // plain text body
    html: letter, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail;

// alex_goit_56
// history_goit
