module.exports = {
    data: {
        theme: '',
    },
    // themeChanged(theme) {
    //     this.setData({
    //         theme,
    //     });
    // },
    onLoad() {
        const app = getApp();
        this.setData({
            theme: app.globalData.theme
        });
    },
    // onUnload() {
    //     getApp().unWatchThemeChange(this.themeChanged);
    // },

    onThemeChange() {
        console.log("子页面获取app");
        const app = getApp();
        this.setData({
            theme: app.globalData.theme
        });
    }
};