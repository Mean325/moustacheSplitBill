let iconList = [
  "/images/class/baomihua.png",
  "/images/class/canyin.png",
  "/images/class/dangao.png",
  "/images/class/diannao.png",
  "/images/class/dianying.png",
  "/images/class/duanxiu.png",
  "/images/class/hanbao.png",
  "/images/class/huoguo.png",
  "/images/class/jiandao.png",
  "/images/class/jianshen.png",
  "/images/class/kafei.png",
  "/images/class/lifa.png",
  "/images/class/qunzi.png",
  "/images/class/shuben.png",
  "/images/class/shutiao.png",
  "/images/class/switch.png",
  "/images/class/xuegao.png",
  "/images/class/yaowan.png",
  "/images/class/youxiji-1.png",
  "/images/class/youxiji-2.png",
  "/images/class/qiandai.png",
  "/images/class/gongzi.png",
  "/images/class/hongbao.png",
  "/images/class/jianzhi.png",
  "/images/class/tongqian.png",
];

const utils = require("../../../../../utils/utils.js");
const app = getApp();

Page({
  data: {
    iconList: [],   // 图标列表
    activeClass: {
      icon: iconList[0],
      name: ""
    }   // 当前active的分类
  },
  /**
   * @hook 页面加载时,获取当前路由参数
   */
  onLoad(options) {
    console.log(options.type);
    this.setData({
      iconList
    });

    let _id = options._id;
    if (_id) {
      let { activeCategoryDetail } = app.globalData;
      console.log(activeCategoryDetail);
      let { fixed, bookkeepNum, ...data } = activeCategoryDetail;
      console.log(_id);
      
      this.setData({
        activeClass: { ...data }
      })
    }
  },
  /**
   * 实现数据双向绑定
   * @hook 顶部分类名称input输入事件
   */
  handleInputChange(e) {
    setTimeout(()=> {
      this.setData({
        'activeClass.name': e.detail.value
      })
    }, 200);
  },
  /**
   * 修改当前icon数据
   * @method 图标点击事件
   */
  selectIcon(e) {
    let { icon } = e.currentTarget.dataset;
    this.setData({
      'activeClass.icon': icon
    })
  },
  /**
   * 调用云函数adminAddClass新增用户默认分类
   * @method 底部添加分类事件
   */
  addClass: utils.throttle(function () {
    let pages = getCurrentPages();
    let { options } = pages.pop();
    let type = Number(options.type);   // 获取路由参数type

    let { name, icon, _id } = this.data.activeClass;
    console.log(name);
    if (!type) {
      wx.showToast({
        title: '出错啦,请返回上一页重新进入',
        icon: 'none',
      })
      return;
    }
    if (!name) {
      wx.showToast({
        title: '请输入分类名称',
        icon: 'none',
      })
      return;
    }
    if (!icon) {
      wx.showToast({
        title: '请输入分类图标',
        icon: 'none',
      })
      return;
    }
    console.log("调用云函数");
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adminAddClass',
      // 传给云函数的参数
      data: {
        type,
        name,
        icon,
        _id
      }
    })
    .then(res => {
      console.log(res);
      wx.showToast({
        title: '添加成功',
        icon: 'none',
      })
      wx.navigateBack();    // 返回上一页
    })
    .catch(console.error)
  }, 1000)
})