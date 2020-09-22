const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: {
      remind: false,
      remindTime: "0:00"
    },
    tmplId: "iwS7L3Ks-86IyqdMpvihRglHB4qzrK9i4ZER5_M9sUE"
  },
  /**
   * 获取云端配置
   * @hook 页面加载时
   */
  onLoad(options) {
    this.getConfig();
  },
  setDarkMode() {
    wx.showModal({
      title: '提醒',
      content: "深色模式目前只支持跟随系统",
      showCancel: false
    })
  },
  /**
   * 实现数据双向绑定
   * @hook 提醒switch改变事件
   */
  switchRemind(e) {
    let value = e.detail.value;
    if (value) {
      const {
        tmplId
      } = this.data;
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: res => {
          console.log(res);
          if (res[tmplId] === "accept") {
            // 用户同意订阅消息
            wx.cloud.callFunction({
                name: 'addRemind',
                data: {
                  tmplId: tmplId
                }
              })
              .then(res => {})
              .catch(console.error)
          } else if (res[tmplId] === "reject") {
            // 如果用户取消订阅消息
            this.setData({
              'config.remind': false
            })
          }
        }
      });
    } else {
      // 用户关闭订阅消息
      wx.cloud.callFunction({
          name: 'delRemind',
          data: {}
        })
        .then(res => {})
        .catch(console.error)
    }
    this.setData({
      'config.remind': value
    })
    // 添加/取消订阅消息成功后,更新用户配置
    app.editConfig({
        hasRemind: value
      })
      .then(res => {
        console.log(res);
        console.log("更新配置");
      })
  },
  /**
   * 实现数据双向绑定
   * @hook 提醒日期改变事件
   */
  handleRemindTimeChange(e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({
      'config.remindTime': value
    })
  },
  /**
   * 调用云函数getConfig获取
   * @method 获取配置
   */
  getConfig() {
    app.getConfig().then(res => {
      const { hasRemind } = res;
      this.setData({
        'config.remind': hasRemind
      })
    })
  },
  /**
   * 调用云函数adminSetWelcome获取
   * @method 设置启动页配置
   */
  saveWelcomeConfig() {
    wx.cloud.callFunction({
        name: 'adminSetWelcome',
        data: {
          config: this.data.config
        }
      })
      .then(res => {
        console.log(res);
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack();
      })
      .catch(console.error)
  },
  sendMsg() {
    wx.cloud.callFunction({
        name: 'sendMsg',
        data: {}
      })
      .then(res => {
        console.log(res);
      })
      .catch(console.error)
  }
})