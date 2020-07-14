// 添加虚拟好友

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {
    nickName,
    teamId
  } = event;

  if (!nickName) {
    return {
      message: '昵称不能为空',
      code: 1
    }
  }
  
  if (!teamId) {
    return {
      message: '团队不能为空',
      code: 1
    }
  }

  try {
    const res = await db.collection('user').add({
        data: {
          nickName,
          color: ramdomColor()
        }
      });
      if (res._id) {
        db.collection('user').doc(res._id).update({
            data: {
              openid: res._id
            },
          })
          .then(res => {
            console.log('虚拟用户openid添加成功')
            console.log(res);
            return res;
          })
        await db.collection('user_team').add({
            data: {
              _openid: res._id,
              _teamId: teamId
            }
          })
          .then(resq => {
            console.log('用户与团队管理表创建成功')
            console.log(resq);
            return resq;
          })
      }
  } catch (e) {
    return {
      message: e.message,
      code: -1
    }
  }


  return {
    message: '添加用户成功',
    code: 200,
    data: {}
  }

//       const res = await db.collection('user').add({
//         data: {
//           nickName
//         }
//       });
//       if (res._id) {
//         db.collection('user').doc(res._id).update({
//             data: {
//               openid: res._id
//             },
//           })
//           .then(res => {
//             console.log('虚拟用户openid添加成功')
//             console.log(res);
//             return res;
//           })
//         console.log('添加虚拟用户成功')
//         console.log(res);
//         await db.collection('user_team').add({
//             data: {
//               _openid: res._id,
//               _teamId: teamId
//             }
//           })
//           .then(resq => {
//             console.log('用户与团队管理表创建成功')
//             console.log(resq);
//             return resq;
//           })
//       }
}

/*随机产生十六进制的颜色值*/
var ramdomColor = function() {
  var str = "#";
  var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", /*"D", "E", "F"*/ ];

  for (let i = 0; i < 6; i++) {
    let random = parseInt(Math.random() * aryNum.length);

    str += aryNum[random];
  }
  console.log(str);
  return str;
}