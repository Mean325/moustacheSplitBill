// 添加虚拟好友

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
  console.log(wxContext);
  const { nickName, teamId } = event;
  
  if (nickName) {
    if (teamId) {
    const res = await db.collection('user').add({
      data: {
        nickName
      }
    });
    if (res._id) {
      db.collection('user').doc(res._id).update({
        data: {
          openid: res._id
        },
      })
      .then(res => {
        console.log('虚拟用户openid添加成功')
        console.log(res);
        return res;
      })
      console.log('添加虚拟用户成功')
      console.log(res);
      await db.collection('user_team').add({
        data: {
          _openid: res._id,
          _teamId: teamId
        }
      })
        .then(resq => {
          console.log('用户与团队管理表创建成功')
          console.log(resq);
          return resq;
        })
    }
    } else {
      return {
        code: -1,
        message: "团队ID不能为空"
      }
    } 
  } else {
    return {
      code: -1,
      message: "好友名称不能为空"
    }
  } 
}