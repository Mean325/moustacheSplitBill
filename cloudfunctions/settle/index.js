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
  let { teamId } = event;

  const res = await db.collection('user_team')
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
    // _id: 0,
    // _openid: 0,
    // _teamId: 0,
    payerData: 1,
    partnerData: 1,
    user: $.arrayElemAt(['$user', 0])
  })
  .end()
  console.log(res);

  return {
    message: "获取成功",
    code: 200,
    data: res.list
  }
}