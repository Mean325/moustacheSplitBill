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
  console.log(wxContext);
  const { name } = event;
  
  if (name) {
    const res = await db.collection('team').add({
      data: {
        createTime: new Date().getTime(),
        adminId: wxContext.OPENID,
        name,
        amount: 0
      }
    });
    if (res._id) {
      console.log('添加团队成功')
      console.log(res);
      await db.collection('user_team').add({
        data: {
          _openid: wxContext.OPENID,
          _teamId: res._id
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
      message: "团队名称不能为空"
    }
  } 
}