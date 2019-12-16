const config = require('../config.json')
const nodemailer = require("nodemailer");
function sendEmail(text){
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email',
      service: "qq", // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
          user: config.from,
          // 这里密码不是qq密码，是你设置的smtp授权码
          pass: config.key
      }
    });
    let mailOptions = {
      from: `"${config.nickname}" <${config.from}>`, // sender address
      to: config.to, // list of receivers
      subject: '每日早报', // Subject line
      // 发送text或者html格式
      // text: "test", // plain text body
      html: text // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      resolve()
      console.log("邮件发送成功!");
    });
  })
}

module.exports = sendEmail
