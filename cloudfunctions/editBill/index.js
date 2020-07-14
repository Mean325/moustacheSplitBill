/**
 * @method 记一笔消费
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let {
    _id,
    teamId,
    num,
    categoryId,
    remark,
    date,
    partner,
    payer,
    splitType
  } = event;
  const updateTime = db.serverDate();

  let result;
  if (_id) { // 含_id时,更新数据库该条数据
    await db.collection('bill').doc(_id).update({
        data: {
          creator: wxContext.OPENID,
          teamId,
          num,
          categoryId,
          remark,
          date,
          partner,
          payer,
          splitType,
          updateTime
        }
      })
      .then(res => {
        console.log('更改成功', res)
        result = {
          message: "更改成功",
          code: 200,
          data: res._id
        }
      })
      .catch(err => {
        console.error(err)
        result = {
          message: "更改失败",
          code: 400,
          err
        }
      })
  } else { // 不含_id时,新增该条数据
    await db.collection('bill').add({
        data: {
          creator: wxContext.OPENID,
          teamId,
          num,
          categoryId,
          remark,
          date,
          partner,
          payer,
          splitType,
          updateTime
        }
      })
      .then(res => {
        console.log('记账成功', res)
        result = {
          message: "记账成功",
          code: 200,
          data: res._id
        }
      })
      .catch(err => {
        console.error(err)
        result = {
          message: "更改失败",
          code: 400,
          err
        }
      })
  }
  return result;
}