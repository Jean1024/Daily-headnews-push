const schedule = require('node-schedule')
const getInfoAndSend = require('./app')
function scheduleCronstyle(){
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, 2, 3, 4, 5, 6, 7]; // 每周的哪天运行
    rule.hour = 8;  // 哪个时辰运行
    rule.minute = 0; // 分钟

    schedule.scheduleJob(rule, function(){
        console.log('scheduleCronstyle:' + new Date());
        getInfoAndSend()
    }); 
}

scheduleCronstyle();
