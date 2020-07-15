const app = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    value: {
      type: String,
      value: ""
    },    // 按钮文字
    openType: String,
    disabled: Boolean
  },
  data: {
    isIphoneX: false,   // iPhone X系列安全区域处理
  },
  attached() {
    const { deviceInfo } = app.globalData;
    const { isIphoneX } = deviceInfo;
    console.log("isIphoneX:" + isIphoneX);
    this.setData({
      isIphoneX
    })
  },
  methods: {

  }
})
