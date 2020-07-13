// components/avatar/avatar.js
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    avatarUrl: {
      type: String,
      value: ""
    },    // 头像路径
    nickName: {
      type: String,
      value: ""
    },    // 昵称,在没有头像时显示
    width: {
      type: String,
      value: "40px"
    },    // 头像宽高
    color: String,  // 虚拟用户头像背景颜色
    marginLeft: String,
    marginRight: String,
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
