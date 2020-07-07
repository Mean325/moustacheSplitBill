// 添加/编辑团队

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
    if (result.data.length) {
      return {
        message: '该用户已在团队中',
        code: 201,
        data: null
      }
    } else {
      let res = await db.collection('user_team').add({
        data: {
          _openid: wxContext.OPENID,
          _teamId: teamId
        }
      })
      return {
        message: '加入团队成功',
        code: 200,
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