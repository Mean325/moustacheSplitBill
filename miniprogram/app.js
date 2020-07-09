// require('./libs/Mixins.js');

// const themeListeners = [];

App({
  globalData: {
    userInfo: {
      openid: "ouGKR4pZmbV1WnrmRCwHP8_Aw7oA"
    },   // 用户信息
    categoryList: [],  // 分类列表

    // theme: 'light', // 主题颜色: light/dark
    deviceInfo: {},   // 设备信息

    activeTeamId: "",   // 当前active的团队Id
    teamMembers: [],    // 团队成员
    selectedMembers: [],  // 选中的成员id列表,用于记账时选择参与人和付款人
  },
  // themeChanged(theme) {
  //   this.globalData.theme = theme;
  //   themeListeners.forEach((listener) => {
  //     listener(theme);
  //   });
  // },
  // watchThemeChange(listener) {
  //   if (themeListeners.indexOf(listener) < 0) {
  //     themeListeners.push(listener);
  //   }
  // },
  // unWatchThemeChange(listener) {
  //   const index = themeListeners.indexOf(listener);
  //   if (index > -1) {
  //     themeListeners.splice(index, 1);
  //   }
  // },
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'mean-hfb19',
        traceUser: true,
      })
    }

    // this.globalData = {};
    this.getDeviceInfo();   // 获取设备信息
  },
  /**
   * @method 获取设备信息
   */
  getDeviceInfo() {
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone X') != -1) {
          res.isIphoneX = true;
        }
        this.globalData.deviceInfo = res;
      }
    })
  },
  /**
   * @hook 监听系统主题改变事件
   */
  onThemeChange(result) {
    // if (!result) return;
    // var value = wx.getStorageSync('theme')
    // if (value === "light" || value === "dark") return;
    // this.globalData.theme = result.theme;
    // console.log(result.theme);
  },
  /**
   * @method 获取分类列表
   */
  getCategoryList() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getCategoryList',
        data: {}
      })
        .then(res => {
          let { data } = res.result;
          if (data.length) {
            data.forEach(item => {
              item.activeIcon = item.icon.split(".png")[0] + "_active.png";
            })    // 遍历数据, icon路径中添加_active用于选中时的样式
            this.globalData.categoryList = data;
            resolve(data);
          } else {
            reject(error);
          }
        })
        .catch(console.error)
    })
  },
  editConfig(params) {
    console.log(params);
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'editConfig',
        data: params
      })
        .then(res => {
          let { data } = res.result;
          console.log(data);
          resolve(data);
        })
        .catch(console.error)
    })
  },
  /**
   * 上一次操作的团队
   * @method 获取用户配置
   */
  getConfig() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getConfig',
        data: {}
      })
        .then(res => {
          let { data, code, message } = res.result;
          console.log(data);
          if (code === 200) {
            if (data) this.globalData.activeTeamId = data.activeTeamId;
            resolve(data);
          } else {
            reject(message);
          }
        })
        .catch(console.error)
    })
  },
})
