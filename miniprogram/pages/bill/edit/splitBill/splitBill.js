Page({
  data: {

  },
  onLoad: function (options) {
    const {
      teamMembers,
      selectedMembers
    } = app.globalData;
    const list = this.formatList(teamMembers);
    this.setData({
      list,
      selectedMembers
    })
  },
})