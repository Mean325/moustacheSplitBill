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


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let { teamId } = event;

  return db.collection('bill').where({
    teamId: teamId,
    partner: _.elemMatch(_.eq(wxContext.OPENID))
  })
  .get();
}