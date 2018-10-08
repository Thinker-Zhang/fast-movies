const DB = require('../utils/db.js')

module.exports = {

  // 拉取我发布的影评列表
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let comment

    comment = await DB.query('select * from comment where comment.user = ?', [user])

    for (let i = 0; i < comment.length; i++) {
      comment[i].movie = (await DB.query('select * from movies where movies.id = ?', [comment[i].movie_id]))[0]
    }

    ctx.state.data = comment
  }
}