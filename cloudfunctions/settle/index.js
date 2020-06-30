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
  .replaceRoot({
    newRoot: $.mergeObjects([ $.arrayElemAt(['$payerData', 0]), '$$ROOT' ])
  })
  .project({
    _id: '$_id',
    user: $.arrayElemAt(['$user', 0]),
    num: '$num',
    payerNum: $.cond({
      if: '$num',
      then: $.size('$payer'),
      else: 1
    }),
    partnerNum: $.cond({
      if: '$num',
      then: $.size('$partner'),
      else: 1
    })
  })
  .group({
    _id: '$user',
    payCount: $.sum($.divide(['$num', '$payerNum'])),
    costCount: $.sum($.divide(['$num', '$partnerNum'])),
  })
  .replaceRoot({
    newRoot: $.mergeObjects([ '$_id', '$$ROOT' ])
  })
  .project({
    _id: 0
  })
  .end()
  console.log(res);

  return {
    message: "获取成功",
    code: 200,
    data: res.list
  }
}