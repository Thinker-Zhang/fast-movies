const DB = require('../utils/db.js')

module.exports = {

  // 随机拉取一部热门电影
  hot: async ctx => {
    let movieId = +ctx.params.id
    let movie

    if (!isNaN(movieId)) {
      movie = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
      movie.firstComment = (await DB.query('SELECT * FROM comment WHERE comment.movie_id = ? LIMIT 1 OFFSET 0', [movieId]))[0] || null
    } else {
      movie = {}
    }

    ctx.state.data = movie
  },

  // 拉取热门电影列表
  list: async ctx => {
    ctx.state.data = await DB.query('SELECT * FROM movies;')
  },

  // 拉取电影详情
  detail: async ctx => {
    let movieId = +ctx.request.body.id
    let movie

    if (!isNaN(movieId)) {
      movie = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
    } else {
      movie = {}
    }

    ctx.state.data = movie
  }
}