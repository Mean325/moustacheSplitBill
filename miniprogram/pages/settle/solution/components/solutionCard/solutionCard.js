// components/solutionCard/solutionCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },    // 
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
    toRemind() {
      const { payer, collecter, num } = this.data.data;
      wx.navigateTo({
        url: `/pages/settle/solution/remind/remind?payee=${ collecter.nickName }&payer=${ payer.nickName }&amount=${ num }`,
      })
    }
  }
})
