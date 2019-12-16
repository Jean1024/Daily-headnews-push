const cheerio = require('cheerio')
function getTime(){
  var d = new Date()
  var m = addZero(d.getMonth() + 1)
  var D = addZero(d.getDate())
  return `${m}月${D}日`
}

function addZero(s){
  return s < 10 ? '0' + s : s;
}
function getUrl(){
  var d = new Date()
  var y = addZero(d.getFullYear())
  var m = addZero(d.getMonth() + 1)
  var D = addZero(d.getDate())
  var _d = `${y}-${m}-${D}-0:${y}-${m}-${D}-23`
  return `https://s.weibo.com/weibo/%25E6%25AF%258F%25E6%2597%25A5%25E6%2597%25A9%25E6%258A%25A5?q=%E6%AF%8F%E6%97%A5%E6%97%A9%E6%8A%A5&typeall=1&suball=1&timescope=custom:${_d}&Refer=g`
}
function handleHtml(html){
  const $ = cheerio.load(html)
  const arr = []
  $('[node-type=feed_list_content_full]').each(function(index, item){
    arr.push($(item).text())
  })
  return handleFilterInfo(arr)
}

function handleFilterInfo(arr){
  const _arr = arr.filter(item => item.indexOf('中公早报') !== -1)
  const _d = getTime()
  const str = _arr[0]
  if(!str) return
  const temp = (((_d + str.split(_d)[1]).split('收起全文')[0]).split("#每")[0]).replace('中公早报', '每日早报')
  var html = formateHTML(temp)
  return html
}

function formateHTML(text){
  var str = '<p><h3>'
  const titile = text.split('1.')[0]
  str += titile + '</h3>'
  str += (text.split(titile)[1]).replace(/\；/g, '；<br /><br />')
  str += ';</p>'
  str += `<p>【心语】 ${getRandomTip.info}</p>`
  return str
}
const sendEmail = require('./sendEmail')
const getRandomTip = require('./getRandomTip')
module.exports = {
  getTime,
  getUrl,
  sendEmail,
  handleHtml,
  handleFilterInfo
}