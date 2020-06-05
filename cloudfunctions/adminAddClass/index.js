// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const { type, icon, name, _id } = event;
  if (_id) {
    await db.collection('_classList').doc(_id).update({
      data: {
        icon,
        type,
        name
      },
      success: res => {
        onsole.log('更改成功', res)
        return {
          message: "更改成功",
          res
        }
      },
      fail: err => {
        message: "更改失败"
      }
    })
  } else {
    await db.collection('_classList').add({
      data: {
        type,
        icon,
        name
      },
      success(res) { //成功打印消息
        console.log('添加分类数据成功', res)
      },
      fail(res) { //存入数据库失败
        console.log('订单存入数据库操作失败');
        //云函数更新
      }
    })
  }
  return event;
}