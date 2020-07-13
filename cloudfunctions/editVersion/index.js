/**
 * @method 编辑版本更新介绍
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
  let {
    _id,
    version,
    updateTime,
    intro
  } = event;

  let result;
  if (_id) { // 含_id时,更新数据库该条数据
    await db.collection('version').doc(_id).update({
        data: {
          version,
          updateTime,
          intro
        }
      })
      .then(res => {
        console.log('编辑成功', res)
        result = {
          message: "编辑成功",
          code: 200,
          data: res._id
        }
      })
      .catch(err => {
        console.error(err)
        result = {
          message: "编辑失败",
          code: 400,
          err
        }
      })
  } else { // 不含_id时,新增该条数据
    await db.collection('version').add({
        data: {
          version,
          updateTime,
          intro
        }
      })
      .then(res => {
        console.log('新增成功', res)
        result = {
          message: "新增成功",
          code: 200,
          data: res._id
        }
      })
      .catch(err => {
        console.error(err)
        result = {
          message: "新增失败",
          code: 400,
          err
        }
      })
  }
  return result;
}