// 创建邀请

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
  const { itemId } = event;
  
  return db.collection('invite').add({
    data: {
      timestamp: db.serverDate(),
      itemId
    }
  })
  .then(res => {
    console.log('创建邀请成功')
    return res;
  })
}