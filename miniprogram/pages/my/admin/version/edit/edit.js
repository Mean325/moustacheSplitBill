const utils = require("../../../../../utils/utils.js");

Page({
  data: {
    formats: {},
    readOnly: false,
    version: {
      version: "",
      updateTime: "",
      intro: ""
    }
    
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    const { id } = options;
    if (id) {
      this.getDetail(id);
      this.setData({
        'version._id': id
      })
    }
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },
  /**
   * 实现版本号输入框数据双向绑定
   * @method 版本号输入框input输入事件
   */
  handleInputChange(e) {
    this.setData({
      'version.version': e.detail.value
    })
  },
  // 日期选择器改变事件钩子
  bindDateChange(e) {
    this.setData({
      'version.updateTime': e.detail.value
    })
  },
  // 输入事件钩子
  handleInput(e) {
    this.setData({
      'version.intro': e.detail.html
    })
  },
  // 获取商品详情
  getDetail(id) {
    wx.cloud.callFunction({
      name: 'getVersionById',
      data: {
        id
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            version: data
          })
          this.editorCtx.setContents({
            html: data.intro
          })
        }
      })
      .catch(console.error)
  },
  /**
   * 调用云函数
   * @method 编辑更新记录
   */
  editVersion() {
    const { version, updateTime, intro } = this.data.version;
    if (!version) {
      wx.showToast({
        title: '请输入版本号',
        icon: 'none',
      })
      return;
  }  else if (!updateTime) {
      wx.showToast({
        title: '请选择更新时间',
        icon: 'none',
      })
      return;
    }
     else if (!intro) {
      wx.showToast({
        title: '请输入更新内容',
        icon: 'none',
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'editVersion',
      data: {
        ...this.data.version
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        console.log(data);
        if (code === 200) {
          wx.navigateBack({
            success: res => {
              wx.showToast({
                title: '编辑成功',
              })
            }
          });
        } else {
          wx.showToast({
            title: message,
            icon: 'none',
          })
        }
      })
      .catch(console.error)
  },
})
