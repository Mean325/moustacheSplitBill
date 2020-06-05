Component({
  data: {
    selected: -1,
    backgroundColor: "#EDEDED",
    color: "#AAAAAA",
    selectedColor: "#333333",
    list: [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "/images/tabBar/home.png",
        "selectedIconPath": "/images/tabBar/home_active.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/statistics/statistics",
        "iconPath": "/images/tabBar/statistics.png",
        "selectedIconPath": "/images/tabBar/statistics_active.png",
        "text": "统计"
      },
      {
        "pagePath": "/pages/tools/tools",
        "iconPath": "/images/tabBar/tool.png",
        "selectedIconPath": "/images/tabBar/tool_active.png",
        "text": "工具"
      },
      {
        "pagePath": "/pages/setting/setting",
        "iconPath": "/images/tabBar/my.png",
        "selectedIconPath": "/images/tabBar/my_active.png",
        "text": "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})