/**
 * @method 获取更新介绍列表
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database({
  throwOnNotFound: false
})
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    let { data } = await db.collection('version').get();

    data = data.sort((a, b) => {
      //将两个版本号拆成数字
      let arr1 = a.version.split('.').map(n => parseInt(n)),
          arr2 = b.version.split('.').map(n => parseInt(n)),
          i = 0,
          diff = 0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环
      while (i < 3) {
        if ((diff = arr1[i] - arr2[i]) !== 0) break 
        i++;
      }
      return -diff;  // 小于0为倒序,大于0为正序
    })

    console.log(data);
    return {
      message: "获取成功",
      data,
      code: 200
    }
  } catch (e) {
    return {
      message: e.message,
      code: -1,
    }
  }
}