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

  return db.collection('user_team')
  .aggregate()
  .lookup({
    from: 'user',
    localField: '_openid',
    foreignField: 'openid',
    as: 'member',
  })
  .project({
    _teamId: 1,
    _openid: 1,
    member: $.arrayElemAt(['$member', 0])
  })
  .group({
    _id: '$_teamId',
    _teamId: $.first('$_teamId'),
    _openid: $.first('$_openid'),
    members: $.addToSet('$member')
  })
  .lookup({
    from: 'team',
    localField: '_teamId',
    foreignField: '_id',
    as: 'teamData',
  })
  .match({
    _openid: wxContext.OPENID,
    _id: teamId
  })
  .replaceRoot({
    newRoot: $.mergeObjects([ $.arrayElemAt(['$teamData', 0]), '$$ROOT' ])
  })
  .project({
    teamData: 0,
    _id: 0,
    _openid: 0
  })
  .end()
  .then(res => {
    console.log(res);
    return res;
   })
  .catch(err => console.error(err))
}