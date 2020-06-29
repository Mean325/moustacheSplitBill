/**
 * @method 获取账单列表
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
  let { teamId } = event;

  const res = await db.collection('bill')
//   .where({
//     teamId: teamId,
//     partner: _.elemMatch(_.eq(wxContext.OPENID))
//   })
//   .get()
//   .then(res => {
//     result = {
//       message: "获取成功",
//       code: 200,
//       data: res.data
//     }
//   })
//   .catch(err => {
//     console.error(err)
//     result = {
//       message: "获取失败",
//       code: 400,
//       err
//     }
//   })
//   return result;
  .aggregate()
  .group({
    _id: '$date',
    count: $.sum('$num'),
    bill: $.addToSet({
      _id: '$_id',
      categoryId: '$categoryId',
      date: '$date',
      num: '$num',
      openid: '$openid',
      partner: '$partner',
      payer: '$payer',
      remark: '$remark',
      splitType: '$splitType',
      teamId: '$teamId',
      updateTime: '$updateTime',
    })
  })
  .end()
  console.log(res);

  return {
    message: "获取成功",
    code: 200,
    data: res.list
  }
}