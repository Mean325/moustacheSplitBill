// 获取当前用户所在的团队列表

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
  const $ = db.command.aggregate;

  const res = await db.collection('user_team')
  .aggregate()
  .group({
    _id: '$_teamId',
    members: $.addToSet('$_openid')
  })
  .match({
    members: _.elemMatch(_.eq(wxContext.OPENID))
  })
  .lookup({
    from: 'user',
    localField: 'members',
    foreignField: 'openid',
    as: 'members',
  })
  .lookup({
    from: 'bill',
    localField: '_id',
    foreignField: 'teamId',
    as: 'billData',
  })
  .lookup({
    from: 'team',
    localField: '_id',
    foreignField: '_id',
    as: 'teamData',
  })
  .replaceRoot({
    newRoot: $.mergeObjects([ $.arrayElemAt(['$teamData', 0]), '$$ROOT' ])
  })
  .end()
  console.log(res);

  let list = res.list;
  for(let item of list) {
    item.amount = 0;
    if (item.billData.length === 0) continue;
    item.billData.forEach(bill => {
      item.amount += bill.num;
    })
  }   // 计算总金额

  return {
    message: "获取成功",
    code: 200,
    data: list
  }
}