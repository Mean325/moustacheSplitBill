const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: {
      billRemind: false, // 记账提醒
      remindTime: "0:00", // 记账提醒时间
      receiveRemind: false // 收款提醒
    },
    tmplIds: [
      "iwS7L3Ks-86IyqdMpvihRglHB4qzrK9i4ZER5_M9sUE", // 记账提醒模板
      "4Pq_UQswBLqvEqEwcysL35t4gm96rFXI-fyHMq9bQQU" // 收款提醒模板
    ]
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
    const { value } = e.detail, // 当前开关的值
      { index, type } = e.currentTarget.dataset, // 提醒序号,用于订阅消息数组中取模板Id
      tmplId = this.data.tmplIds[Number(index)];
    let config = this.data.config;

    if (value) {
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: res => {
          console.log(res);
          if (res[tmplId] === "accept") {
            // 用户同意订阅消息
            wx.cloud.callFunction({
                name: 'addRemind',
                data: {
                  tmplId
                }
              })
              .then(res => {})
              .catch(console.error)
          } else if (res[tmplId] === "reject") {
            // 如果用户取消订阅消息
            config[type] = false;
            this.setData({
              config
            })
          }
        }
      });
    } else {
      // 用户关闭订阅消息
      wx.cloud.callFunction({
          name: 'delRemind',
          data: {
            tmplId
          }
        })
        .then(res => {})
        .catch(console.error)
    }
    config[type] = value;
    this.setData({
      config
    })
    // 添加/取消订阅消息成功后,更新用户配置
    app.editConfig({
      [type]: value
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
      const {
        billRemind,
        receiveRemind
      } = res;
      this.setData({
        'config.billRemind': billRemind,
        'config.receiveRemind': receiveRemind
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
  /**
   * 测试用
   * @method 发送记账提醒消息
   */
  sendMsg() {
    wx.cloud.callFunction({
        name: 'sendBillRemind',
        data: {}
      })
      .then(res => {
        console.log(res);
      })
      .catch(console.error)
  }
})