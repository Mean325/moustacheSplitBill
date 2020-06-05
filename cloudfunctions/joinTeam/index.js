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
  
  return db.collection('user_team').add({
    data: {
      _openid: wxContext.OPENID,
      _teamId: teamId
    }
  })
    .then(res => {
      console.log('用户与团队管理表创建成功')
      console.log(res);
      return res;
    })
  
}