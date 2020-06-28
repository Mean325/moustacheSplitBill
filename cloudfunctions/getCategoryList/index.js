// 获取分类列表 - 超级管理员
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const { type } = event;

  return await db.collection('category').get();
}