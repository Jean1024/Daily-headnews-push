const request = require('request')
const {getUrl, handleHtml, sendEmail} = require('./utils')
const reqUrl = getUrl()
const options = {
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

module.exports = function(){
  request.get(options, function(err, res, body){
    const html = handleHtml(body)
    sendEmail(html)
  })
}
