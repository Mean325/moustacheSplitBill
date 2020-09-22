/**
 * @method 关闭记账提醒
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { id } = event;
  
  try {
    const res = await db.collection('remind').doc(wxContext.OPENID).remove()
    return {
      code: 200,
      data: res,
      message: "删除成功"
    }
  } catch(e) {
    console.error(e)
    return {
      code: -1,
      data: null,
      message: e
    }
  }
}