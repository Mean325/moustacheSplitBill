// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let { _id } = event;

  try {
    return await db.collection('_classList').doc(_id).remove()
  } catch (e) {
    console.error(e)
  }
}