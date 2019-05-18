const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const elasticsearch = require('elasticsearch')

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
})

const INDEX = 'nasa-meteorite-landings-test1'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/ping', async ctx => {
    ctx.status = 200
    ctx.body = 'pong'
    ctx.respond = true
  })

  router.get('/search', ctx => {
    return new Promise((resolve, reject) => {
      const searchQuery = ctx.query.query
      esClient.search({
        index: INDEX,
        body: {
          query: {
            match_phrase_prefix: {
              "name": searchQuery
            }
          }
        }
      }, (err, response) => {
        if (err) {
          console.error(err)
          ctx.status = 200
          ctx.body = 'Something went wrong'
          ctx.respond = true
          reject();
        }


        ctx.status = 200
        ctx.body = {
          took: response.took,
          hits: response.hits.hits,
          total: response.hits.total.value
        }
        ctx.respond = true
        resolve();
      })
    })


  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
