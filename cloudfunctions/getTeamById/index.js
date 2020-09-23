// 获取当前用户所在的团队列表

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const $ = db.command.aggregate;
  const { teamId } = event;

  let res = await db.collection('user_team')
  .aggregate()
  .match({
    _teamId: teamId
  })
  .group({
    _id: '$_teamId',
    members: $.addToSet('$_openid')
  })
  .lookup({
    from: 'user',
    localField: 'members',
    foreignField: 'openid',
    as: 'members',
  })
  .lookup({
    from: 'team',
    localField: '_id',
    foreignField: '_id',
    as: 'teamData',
  })
  .replaceRoot({
    newRoot: $.mergeObjects([ $.arrayElemAt(['$teamData', 0]), '$$ROOT' ])
  })
  .project({
    teamData: 0
  })
  .end()
  console.log(res);

  let list = res.list[0];
  if (!list) {
    return {
      message: '没有找到该团队',
      code: -1,
      data: null
    }
  }
  list.inTeam = false;
  for (n of list.members) {
    if (n.openid == wxContext.OPENID) {
       list.inTeam = true;
       break;
    }
  }

  return {
    message: "获取成功",
    code: 200,
    data: list
  }
}