const request = require('request')
const cheerio = require('cheerio')
const nodemailer = require("nodemailer");
const config = require('./config')
const reqUrl = 'https://s.weibo.com/weibo/%25E6%25AF%258F%25E6%2597%25A5%25E6%2597%25A9%25E6%258A%25A5?q=%E6%AF%8F%E6%97%A5%E6%97%A9%E6%8A%A5&typeall=1&suball=1&timescope=custom:2019-12-16-0:2019-12-16-23&Refer=g'
function getTime(){
  var d = new Date()
  var m = addZero(d.getMonth() + 1)
  var D = addZero(d.getDate())
  return `${m}月${D}日`
}

function addZero(s){
  return s < 10 ? '0' + s : s;
}
var options = {
  url: reqUrl,
  method: 'GET',
  gzip:true,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "DNT": "1",
    "Host": "s.weibo.com",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36",
  },

};
function handleHtml(html){
  const $ = cheerio.load(html)
  const arr = []
  $('[node-type=feed_list_content_full]').each(function(index, item){
    arr.push($(item).text())
  })
  handleFilterInfo(arr)
}
function handleFilterInfo(arr){
  const _arr = arr.filter(item => item.indexOf('中公早报') !== -1)
  const _d = getTime()
  const str = _arr[0]
  if(!str) return
  const temp = (((_d + str.split(_d)[1]).split('收起全文')[0]).split("#每")[0]).replace('中公早报', '每日早报')
  var html = formateHTML(temp)
  sendEmail(html)
}
function formateHTML(text){
  var str = '<p><h3>'
  const titile = text.split('1.')[0]
  str += titile + '</h3>'
  str += (text.split(titile)[1]).replace(/\；/g, '；<br /><br />')
  str += ';</p>'
  return str
}
request.get(options, function(err, res, body){
  handleHtml(body)
})

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