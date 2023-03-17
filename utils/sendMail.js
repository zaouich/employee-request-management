const nodemailer = require("nodemailer")
const sendMail =async (data_)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
      port: process.env.MAIL_POST,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
      }
    })
    const object = {
        from: "baderzaouichbz@gmail.com",
        to : data_.to,
        subject : data_.subject,
        text:data_.text
    }
    await transporter.sendMail(object)
}
module.exports = sendMail