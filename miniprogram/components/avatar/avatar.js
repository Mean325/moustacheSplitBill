// components/avatar/avatar.js
Component({
  /**
   * 组件的属性列表
   */
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
