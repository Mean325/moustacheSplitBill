Component({
  properties: {

  },
  data: {
    num: 0,
    hasDot: false // 防止用户多次输入小数点
  },
  methods: {
    tapKey: function (evt) {
      var x = evt.currentTarget.dataset.key
      if (x == '.') {
        if (this.data.hasDot) return
        this.setData({
          hasDot: true
        })
      }
      this.setData({
        num: this.data.num == '0' ? x : this.data.num + x
      })
    },
    tapSubmit: function () {
      // 用户已提交
      console.log('res =', this.data.num)
    },
    tapDel: function () {
      if (this.data.num == '0') return
      if (this.data.num[this.data.num.length - 1] == '.') this.setData({
        hasDot: false
      })
      this.setData({
        num: this.data.num.length == 1 ? '0' : this.data.num.substring(0, this.data.num.length - 1)
      })
    },
    tapClear: function () {
      this.setData({
        num: '0',
        hasDot: false
      })
    }
  }
})
