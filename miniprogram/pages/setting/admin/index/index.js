const app = getApp()

Page({
  data: {
  },

  onLoad: function() {
    let userInfo = app.globalData.userInfo;
    if (userInfo.openid !== 'ouGKR4pZmbV1WnrmRCwHP8_Aw7oA') {
      // 当用户不为超级管理员时,返回setting页面
      wx.navigateBack();
    } else {
      // 当用户为超级管理员时
    }
  },
})
