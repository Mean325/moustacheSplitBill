/**
 * @method 获取用户信息
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
  const wxContext = cloud.getWXContext();
  const { ...params } = event;

  try {
    const result = await cloud.openapi.wxacode.createQRCode({
      path: 'pages/other/wifi/wifi?SSID=zjzl_asus_5G&password=Zjzl1234567890123',
      width: 430
    })
    return result
  } catch (err) {
    return err
  }
}