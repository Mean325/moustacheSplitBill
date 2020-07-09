/**
 * @method 获取更新介绍列表
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
  const wxContext = cloud.getWXContext()

  let res;
  try {
    res = await db.collection('version').get();
    console.log(res);
  } catch (e) {
    return {
      message: e.message,
      code: -1,
    }
  } 
  return {
    message: "获取成功",
    data: res.data,
    code: 200
  }
}