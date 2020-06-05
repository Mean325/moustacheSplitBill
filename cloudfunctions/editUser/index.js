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

  await db.collection('user').add({
    data: event
  })
  .then(resq => {
    console.log('用户添加成功')
    console.log(resq);
    return resq;
  })
  .catch(err => {
    console.log(err);
    return err;
  })
}