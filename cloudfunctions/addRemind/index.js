/**
 * @method 添加记账提醒的订阅消息
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
    tmplId
  } = event;

  if (!tmplId) {
    return {
      code: -1,
      message: '模板消息不能为空',
      data: null
    }
  }

  let result;
  await db.collection('remind').add({
    data: {
      openid: wxContext.OPENID,
      tmplId
    }
  })
  .then(res => {
    console.log('添加提醒成功', res)
    result = {
      message: "添加提醒成功",
      code: 200,
      data: null
    }
  })
  .catch(err => {
    console.error(err)
    result = {
      message: "添加提醒失败",
      code: 400,
      err
    }
  })
  return result;
}