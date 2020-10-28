const app = getApp();

/**
 * @methods 根据团队id获取团队信息
 */
const getTeamById = (teamId) => {
  console.log(teamId);
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'getTeamById',
      data: {
        teamId
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          app.globalData.activeTeam = data;
          resolve(data);
        } else {
          reject(message)
        }
      })
      .catch(console.error)
  })
}

module.exports = {
  getTeamById
};