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
      const resq = await db.collection('user_team').add({
        data: {
          _openid: wxContext.OPENID,
          _teamId: res._id
        }
      })
      console.log(resq);
      return {
        code: 200,
        data: res._id,
        message: "创建团队成功"
      };
    }
  } else {
    return {
      code: -1,
      message: "团队名称不能为空"
    }
  } 
}