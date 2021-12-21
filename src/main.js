// ts-check

const Koa = require('koa')
const Pug = require('koa-pug')
const path = require('path')

const app = new Koa()

// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(async (ctx) => {
  ctx.body = 'Hello World!'
  await ctx.render('main')
})

app.listen(5000)
