// 获取当前用户所在的团队列表

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var $ = db.command.aggregate;
  const { code } = event;

  return db.collection('invite').doc(code).get()
}