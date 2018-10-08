const DB = require('../utils/db')

module.exports = {

  /**
   * 添加收藏
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = +ctx.request.body.comment_id

    if (!isNaN(commentId)) {
      let collection = await DB.query('select * from collection where collection.user = ?', [user])
      let isCollected = false
      collection.forEach(item => {
        if (item.comment_id === commentId) {
          isCollected = true
        }
      })
      if (!isCollected) {
        await DB.query('INSERT INTO collection(user, comment_id) VALUES (?, ?)', [user, commentId])
      }
    }

    ctx.state.data = {}
  },

  /**
   * 获取收藏列表
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let collect = []
    let comment = []

    collect = await DB.query('select * from collection where collection.user = ?', [user])

    for (let i = 0; i < collect.length; i++) {
      comment.push((await DB.query('select * from comment where comment.id = ?', [collect[i].comment_id]))[0])
      comment[i].movie = (await DB.query('select * from movies where movies.id = ?', [comment[i].movie_id]))[0]
    }
    
    ctx.state.data = comment
  }
}