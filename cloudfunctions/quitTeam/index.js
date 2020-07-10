/**
 * @method 退出团队
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { teamId } = event;
  
  try {
    // 查询有没该用户与团队的关联数据
    const result = await db.collection('user_team').where({
      _openid: wxContext.OPENID,
      _teamId: teamId
    }).get()

    // 如果有数据，则返回201，如果没数据则添加该用户
    const data = result.data;
    if (data.length) {
      let res = await db.collection('user_team').doc(data[0]._id).remove()
      return {
        message: '退出团队成功',
        code: 200,
        data: null
      }
      
    } else {
      return {
        message: '您不在该团队中',
        code: 201,
        data: null
      }
    }
  } catch (e) {
    return {
      message: e.message,
      code: -1,
    }
  } 
}