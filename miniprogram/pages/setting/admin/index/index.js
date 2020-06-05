const app = getApp()

Page({
  data: {
  },

  onLoad: function() {
    let userInfo = app.globalData.userInfo;
    if (userInfo.openid !== 'o8Hls5RluXwV-Hktw2CNiiIEFe2M') {
      // 当用户不为超级管理员时,返回setting页面
      wx.navigateBack();
    } else {
      // 当用户为超级管理员时
    }
  },
})
