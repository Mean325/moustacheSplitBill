/**
 * @method 发送订阅消息
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

  try {
    const user = await db.collection("remind").get();

    const sendMsg = user.data.map(async msg => {
      try {
        await cloud.openapi.subscribeMessage.send({
          touser: msg._id,
          page: "pages/welcome/welcome",
          data: {
            thing3: {
              value: "222"
            },
            thing4: {
              value: "333"
            }
          },
          templateId: msg.tmplId
        });
      } catch (err) {
        console.log(err)
        return err
      }
    })
  } catch (error) {
    console.log(error)
    return error
  }
}