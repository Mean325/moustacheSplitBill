/**
 * @method 生成结算方案
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { teamId } = event;

  const user_team = db.collection('user_team');

  if (!teamId) {
    return {
      code: -1,
      msg: '没有选择团队'
    }
  }

  const res = await user_team
  .aggregate()
  .match({
    _teamId: _.eq(teamId)
  })
  .lookup({
    from: 'user',
    localField: '_openid',
    foreignField: 'openid',
    as: 'user'
  })
  .lookup({
    from: 'bill',
    localField: '_openid',
    foreignField: 'payer',
    as: 'payerData',
  })
  .lookup({
    from: 'bill',
    localField: '_openid',
    foreignField: 'partner',
    as: 'partnerData',
  })
  .project({
    payerData: 1,
    partnerData: 1,
    user: $.arrayElemAt(['$user', 0])
  })
  .end()
  console.log(res);

  let payList = [],
  collectList = [];
  res.list.forEach(item => {
    item.payCount = 0;
    item.costCount = 0;
    item.payerData.forEach(n => {
      item.payCount += n.num / n.payer.length
    })
    item.partnerData.forEach(n => {
      item.costCount += n.num / n.partner.length
    })
    item.num = (item.payCount - item.costCount).toFixed(2);

    delete item.payerData;
    delete item.partnerData;
    delete item.payCount;
    delete item.costCount;
    delete item._id;

    item.num > 0 ? collectList.push(item) : payList.push(item);
  })
  collectList.sort((a, b) => a.num - b.num);
  payList.sort((a, b) => b.num - a.num);
  console.log(collectList);
  console.log(payList);

  let solution = [];
  pay:
  for (var i = 0; i < payList.length; i++) {
    let pay = payList[i];
    collect: 
    for (var j = 0; j < collectList.length; j++) {
      let collect = collectList[j];
      if (pay.num === 0) {
        continue pay;
      }
      if (collect.num === 0) {
        continue collect;
      }
    
      console.log(pay.num);
      console.log(collect.num);
      let payNum =  Math.abs(pay.num);
      let collectNum = Math.abs(collect.num);
      balance = (payNum - collectNum).toFixed(2);

      let obj = {}
      if (balance >= 0) {    // 当付款款大于收款时
        pay.num = balance;
        collect.num = 0;
        console.log(pay.num);
        obj = {
          payer: pay.user,
          collecter: collect.user,
          num: collectNum
        }
      } else {
        collect.num = balance;
        pay.num = 0;
        console.log(collect.num);
        obj = {
          payer: pay.user,
          collecter: collect.user,
          num: payNum
        }
      }
      solution.push(obj);
    }

  }
  console.log(solution);

  solution = solution.filter(n => n.num !== 0)
  console.log(solution);

  return {
    message: "获取成功",
    code: 200,
    data: solution
  }
}