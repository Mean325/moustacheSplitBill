/**
 * @method 发送收款提醒消息
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
    const now = formatTime(new Date(), 'Y年M月D日');

    const msgs = await db.collection('remind').where({
      openid: "1",
      tmplId: "4Pq_UQswBLqvEqEwcysL35t4gm96rFXI-fyHMq9bQQU"
    }).get(); // 查询收款人是否开启收款提醒
    console.log(msgs)

    if (msgs.data) {
      const sendMsg = msgs.data.map(async msg => {
        try {
          await cloud.openapi.subscribeMessage.send({
            touser: msg.openid,
            page: `pages/bill/edit/edit?id=${ id }`, // 账单详情页
            data: {
              name2: {
                value: now
              },
              amount3: {
                value: `¥${ content1 }`
              },
              time4: {
                value: now
              },
              time4: {
                value: `对方已点击还款,如有疑问点击查看详情`
              }
            },
            templateId: msg.tmplId
          });
        } catch (err) {
          console.log(err)
          return err
        }
      })
    }
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