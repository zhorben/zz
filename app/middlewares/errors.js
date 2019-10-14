
export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      // could use template methods to render error page
      ctx.status = err.status
      ctx.body = {
        error: err.message
      }
    } else {
      ctx.body = 'Error 500'
      ctx.status = 500
      console.error(err.message, err.stack) // stderr/stdout
    }
  }
}
