// miniprogram/pages/admin/setWelcome/setWelcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      remind: false,
      remindTime: "0:00"
    },
    // tmplId: "iwS7L3Ks-86IyqdMpvihRu9lBgfm4AtjqzIVSm08Jxk"
    tmplId: "iwS7L3Ks-86IyqdMpvihRuiPt7Tjef9uJh51jwMRT0g"
  },
  /**
   * 获取云端配置
   * @hook 页面加载时
   */
  onLoad(options) {
    this.getWelcomeConfig();
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
    this.setData({
      'config.remind': value
    })
    const { tmplId } = this.data;
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success(res) {
        console.log(res);
        if (res[tmplId] === "accept") {
          wx.cloud.callFunction({
            name: 'addRemind',
            data: {
              time1: "111",
              thing3: "222",
              thing4: "333",
              tmplId: tmplId
            }
          })
            .then(res => {
              wx.showToast({
                title: '设置成功',
              })
            })
            .catch(console.error)
        }
      }
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
   * 调用云函数getWelcomeConfig获取
   * @method 获取启动页配置
   */
  getWelcomeConfig() {
    // wx.cloud.callFunction({
    //   name: 'getWelcomeConfig',
    //   data: {}
    // })
    //   .then(res => {
    //     let data = res.result.data;
    //     console.log(res);
    //     this.setData({
    //       config: data
    //     });
    //   })
    //   .catch(console.error)
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