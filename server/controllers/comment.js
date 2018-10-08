const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let commentType = ctx.request.body.c_type


    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO comment(user, username, avatar, content, type, movie_id) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, commentType, movieId])
    }

    ctx.state.data = {}
  },

  /**
   * 获取评论列表
   */
  list: async ctx => {
    let movieId = +ctx.request.query.movie_id

    if (!isNaN(movieId)) {
      ctx.state.data = await DB.query('select * from comment where comment.movie_id = ?', [movieId])
    } else {
      ctx.state.data = []
    }
  },

  /**
   * 获取评论详情
   */
  detail: async ctx => {
    let commentId = +ctx.request.body.id
    let comment

    if (!isNaN(commentId)) {
      comment = (await DB.query('select * from comment where comment.id = ?', [commentId]))[0]
    } else {
      comment = {}
    }

    ctx.state.data = comment
  }

}