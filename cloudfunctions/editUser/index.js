// 添加用户信息

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;

  try {
    // 查询有没用户数据
    const user = await db.collection('user').where({
      _openid: OPENID
    }).get()

    // 如果有数据，则只是更新用户数据，如果没数据则添加该用户
    if (user.data.length) {
      await db.collection('user').where({
        _openid: OPENID
      }).update({
        data: event
      })
    } else {
      await db.collection('user').add({
        data: event
      })
    }
  } catch (e) {
    return {
      message: e.message,
      code: -1,
    }
  }

  return {
    message: '用户数据保存成功',
    code: 200,
    data: null
  }
}