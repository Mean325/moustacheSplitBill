/**
 * @method 编辑用户配置
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

  const {
    data
  } = await db.collection('config').doc(wxContext.OPENID).get()
  console.log(data);
  if (data) {
    console.log("更新")
    return await db.collection('config').doc(wxContext.OPENID).update({
      // data 传入需要局部更新的数据
      data: {
        ...param
      }
    })
  } else {
    console.log("新建");
    // 新建的时候报undefined is not an object???
    return await db.collection('config').doc(wxContext.OPENID).set({
      // data 传入需要局部更新的数据
      data: {
        ...param
      }
    })
  }
}