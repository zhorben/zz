const Router = require('koa-router');
const connection = require('../libs/connection');
const pick = require('lodash/pick');

const router = new Router({
  prefix: '/users'
});

const User = require('../models/User');

router
  .param('userById', async (id, ctx, next) => {
    if (!connection.Types.ObjectId.isValid(id)) {
      ctx.throw(404);
    }

    ctx.userById = await User.findById(id);

    if (!ctx.userById) {
      ctx.throw(404, 'user with this id not found');
    }

    await next();
  })
  .post('/', async function(ctx) {
    let user = await User.create(pick(ctx.request.body, User.publicFields));
    ctx.body = user.toObject();
  })
  .patch('/:userById', async function(ctx) {
    Object.assign(ctx.userById, pick(ctx.request.body, User.publicFields));
    await ctx.userById.save();

    ctx.body = ctx.userById.toObject();
  })
  .get('/:userById', async function(ctx) {
    ctx.body = ctx.userById.toObject();
  })
  .del('/:userById', async function(ctx) {
    await ctx.userById.remove();
    ctx.body = 'ok';
  })
  .get('/', async function(ctx) {
    const users = await User.find({});
    ctx.body = users.map(user => user.toObject());
  });

module.exports = router
