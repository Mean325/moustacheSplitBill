const app = getApp();

Page({
  data: {
    activeType: 1,    // 当前分类类型,1为支出,2为收入
    listData: [],
    pageMetaScrollTop: 0,
    scrollTop: 0,
  },
  /**
   * @hook 进入该页面时获取分类列表
   */
  onShow() {
    this.getClassList();
  },
  /**
   * 调用云函数adminClassList获取
   * @method 获取分类列表数据
   */
  getClassList() {
    this.drag = this.selectComponent('#drag');
    wx.cloud.callFunction({
      name: 'adminClassList',
      data: {}
    })
      .then(res => {
        let datas = res.result.data;
        console.log(datas);
        datas.forEach(data => {
          data.forEach(item => {
            // item.dragId = `item${ index }`;
            item.bookkeepNum = 0;
            item.fixed = false;
          })
        })
        this.setData({
          listData: datas
        });

        this.drag.init();   // 拖动列表初始化
      })
      .catch(console.error)
  },
  /**
   * 赋值给activeType,并重新获取分类列表
   * @hook 顶部分类类型组件改变事件
   */
  handleTypeChange(e) {
    let value = e.detail;
    this.setData({
      activeType: value
    })
  },
  /**
   * 保存改变后的数据
   * @hook 数组拖动排序结束事件
   */
  sortEnd(e) {
    console.log("sortEnd", e.detail.listData)
    this.setData({
      listData: e.detail.listData
    });
  },
  /**
   * @hook 数组拖动排序改变事件
   */
  change(e) {
    console.log("change", e.detail.listData)
  },
  // sizeChange(e) {
  //   wx.pageScrollTo({ scrollTop: 0 })
  //   this.setData({
  //     size: e.detail.value
  //   });
  //   this.drag.init();
  // },
  /**
   * @hook 数组item点击事件
   */
  itemClick(e) {
    let data = e.detail.data;
    if (data._id) {
      app.setActiveCategoryDetail(data);
      wx.navigateTo({
        url: `/pages/setting/admin/classManage/addClass/addClass?_id=${ data._id }&type=${ data.type }`
      })
    }
  },
  /**
   * 调用云函数adminDelCategory
   * @method 可拖动列表item,右滑删除按钮点击事件
   */
  handleDel(e) {
    console.log(e.detail);
    let { _id } = e.detail;
    wx.showModal({
      content: '删除后无法恢复,是否删除?',
      confirmText: '删除',
      confirmColor: '#fa5151',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'adminDelCategory',
            data: {
              _id
            }
          })
            .then(res => {
              console.log(res);
              if (res.result.stats.removed === 1) {
                wx.showToast({
                  title: '删除成功'
                })
                wx.vibrateShort();
                this.getClassList();
              }
            })
            .catch(console.error)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 页面滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },
  /**
   * 携带当前记账类型参数,跳转到添加分类页面
   * @method 添加分类按钮点击事件
   */
  addClass() {
    let type = this.data.activeType;
    wx.navigateTo({
      url: `/pages/setting/admin/classManage/addClass/addClass?type=${ type }`,
    })
  },
})