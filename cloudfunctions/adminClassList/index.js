// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const { type } = event;

  let res = [];
  for (let l = 1; l < 3; l++) {
    let list = await db.collection('_classList')
      .where({
        type: l
      })
      .get();
    console.log(list.data);
    res.push(list.data);
  }
  return {
    data: res
  };
}