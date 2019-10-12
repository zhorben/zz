const Designer = require('../models/designer')

export default {
  get: async (ctx, next) => {
    if (ctx.isAuthenticated()) { // ctx.request.user ?
  
      let designers = await Designer.find({});
  
      designers = designers.map(designer => designer.toObject())
  
      ctx.body = ctx.render('welcome', { designers });
    } else {
      ctx.body = ctx.render('login');
    }
  }
}
