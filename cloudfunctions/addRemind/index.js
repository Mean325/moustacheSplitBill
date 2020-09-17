/**
 * @method 保存用户提醒
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
  } = await db.collection('remind').doc(wxContext.OPENID).get()
  console.log(data);
  if (data) {
    // console.log("更新")
    // return await db.collection('config').doc(wxContext.OPENID).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     ...param
    //   }
    // })
  } else {
    console.log("新建")
    return await db.collection('remind').doc(wxContext.OPENID).set({
      // data 传入需要局部更新的数据
      data: {
        ...param
      }
    })
  }
}