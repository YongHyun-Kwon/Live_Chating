// ts-check

const Koa = require('koa')
const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const websockify = require('koa-websocket')
const serve = require('koa-static')
const mount = require('koa-mount')

const app = websockify(new Koa())

// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  ctx.body = 'Hello World!'
  await ctx.render('main')
})

// Using routes
app.ws.use(
  route.all('/ws', (ctx) => {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    ctx.websocket.on('message', (data) => {
      // do something with the message from client
      if (typeof data !== 'string') {
        return
      }

      const { message, nickname } = JSON.parse(data)

      const { server } = app.ws

      if (!server) {
        return
      }

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            message,
            nickname,
          })
        )
      })
    })
  })
)

app.listen(5000)
