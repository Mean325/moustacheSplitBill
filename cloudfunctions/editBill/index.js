/**
 * @method 记一笔消费
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
  let { _id, teamId, num, categoryId, remark, date, partner, payer, splitType } = event;
  const updateTime = db.serverDate();

  let result;
  if (_id) {    // 含_id时,更新数据库该条数据
    await db.collection('bill').doc(_id).update({
      data: {
        openid: wxContext.OPENID,
        teamId,
        num,
        categoryId,
        remark,
        date,
        partner,
        payer,
        splitType,
        updateTime
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
  } else {    // 不含_id时,新增该条数据
    // let res = await cloud.callFunction({
    //   name: 'hexMD5',
    //   data: {
    //     str: updateTime + wxContext.OPENID
    //   }
    // })
    // _id = res.result;   // 当账目没有_id时,判断为新增,根据time和openid生成_id

    // console.log(_id);
    await db.collection('bill').add({
      data: {
        openid: wxContext.OPENID,
        teamId,
        num,
        categoryId,
        remark,
        date,
        partner,
        payer,
        splitType,
        updateTime
      },
      success: res => {   // 成功打印消息
        console.log('记账成功', res);
        result = {
          message: "记账成功",
          code: 200
        }
      },
      fail: res => {    // 存入数据库失败
        console.log('记账失败', res);
        result = {
          message: "记账失败",
          code: 400
        }
      }
    })
  }
  return result;
}