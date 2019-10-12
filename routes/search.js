const Router = require('koa-router');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/search'
});

const Designer = require('../models/designer');

router
  .get('/', async function(ctx, next) {
    const { query, gender } = ctx.query

    if (!query) return next();

    const designers = await Designer.find({ $text: { $search: query } });

    ctx.body = designers.map(designer => pick(designer, Designer.publicFields))

  });

module.exports = router


