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
  let { id } = event;

  console.log(id);
  const res = await db.collection('bill')
  .aggregate()
  .match({
    _id: _.eq(id),
  })
  .lookup({
    from: 'user',
    localField: 'creator',
    foreignField: 'openid',
    as: 'creator',
  })
  // .project({
  //   creator: $.arrayElemAt(['$creator', 0]),
  // })
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
  .end()
  console.log(res.list[0]);

  return {
    message: "获取成功",
    code: 200,
    data: res.list[0]
  }
}