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
  .aggregate()
  .match({
    teamId: _.eq(teamId),
    // partner: _.elemMatch(_.eq(wxContext.OPENID))
  })
  .lookup({
    from: 'user',
    localField: 'partner',
    foreignField: 'openid',
    as: 'partner',
  })
  .lookup({
    from: 'user',
    localField: 'payer',
    foreignField: 'openid',
    as: 'payer',
  })
  .lookup({
    from: 'category',
    localField: 'categoryId',
    foreignField: '_id',
    as: 'category',
  })
  .group({
    _id: '$date',
    count: $.sum('$num'),
    bill: $.addToSet({
      _id: '$_id',
      categoryId: '$categoryId',
      category: $.arrayElemAt(['$category', 0]),
      date: '$date',
      num: '$num',
      creator: '$creator',
      partner: '$partner',
      payer: '$payer',
      remark: '$remark',
      splitType: '$splitType',
      teamId: '$teamId',
      updateTime: '$updateTime',
    })
  })
  .sort({
    _id: -1
  })
  .end()
  console.log(res);

  let list = res.list,
      amount = 0;
  list.forEach(item => {
    amount += item.count;
  })   // 计算总金额

  return {
    message: "获取成功",
    code: 200,
    data: {
      list,
      amount 
    }
  }
}