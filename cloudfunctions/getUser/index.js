/**
 * @method 获取用户信息
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
  const { ...params } = event;

  let result;
  const res = await db.collection('user').where({
    data: {
      openid: wxContext.OPENID
    }
  }).get();
  
  console.log(res);
  if (res) {
    return {
      message: "获取用户信息成功",
      code: 200,
      data: res
    }
  } else {
    return {
      message: "未找到该用户信息",
      code: -1,
      data: null
    }
  }
}