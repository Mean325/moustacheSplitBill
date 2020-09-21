/**
 * @method 发送订阅消息
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database({
  throwOnNotFound: false
})
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {
    ...param
  } = event;

  try {
    // 获取当前时间
    const now = formatTime(new Date(), 'Y年M月D日'),
          content1 = "记得记账哦",
          content2 = "晚上好，今天还有支出未记录吗？"

    const user = await db.collection("remind").get();

    const sendMsg = user.data.map(async msg => {
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: msg._id,
          page: "pages/welcome/welcome",
          data: {
            time1: {
              value: now
            },
            thing3: {
              value: content1
            },
            thing4: {
              value: content2
            }
          },
          templateId: msg.tmplId
        });
      } catch (err) {
        console.log(err)
        return err
      }
    })
  } catch (error) {
    console.log(error)
    return error
  }
}


function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * date: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTime(date, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}