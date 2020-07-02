/**
 * @method 结算账单
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
  const { teamId } = event;

  const user_team = db.collection('user_team');

//   if (payInfo.length === 0) {
//     return {
//       code: -1,
//       msg: '购物车中没有勾选物品'
//     }
//   }

  const res = await user_team
  .aggregate()
  .match({
    _teamId: _.eq(teamId)
  })
  .lookup({
    from: 'user',
    localField: '_openid',
    foreignField: 'openid',
    as: 'user'
  })
  .lookup({
    from: 'bill',
    localField: '_openid',
    foreignField: 'payer',
    as: 'payerData',
  })
  .lookup({
    from: 'bill',
    localField: '_openid',
    foreignField: 'partner',
    as: 'partnerData',
  })
  .project({
    payerData: 1,
    partnerData: 1,
    user: $.arrayElemAt(['$user', 0])
  })
  .end()
  console.log(res);

  let list = res.list;
  list.forEach(item => {
    item.payCount = 0;
    item.costCount = 0;
    item.payerData.forEach(n => {
      item.payCount += n.num / n.payer.length
    })
    item.partnerData.forEach(n => {
      item.costCount += n.num / n.partner.length
    })
    item.num = item.payCount - item.costCount;

    delete item.payerData;
    delete item.partnerData;
    delete item._id;
  })

  console.log(list);

  return {
    message: "获取成功",
    code: 200,
    data: list
  }
}