const { validationResult } = require('express-validator');

module.exports = {
  /* When this error handler middleware is used in a route handler,
  it first checks if there are any errors from the previous middleware,
  using the validationResult function from the express-validator package.
  If there are errors, the dataCb function is called (if provided)to fetch 
  any necessary data for the template, and then the error message(s) and the fetched data 
  are passed to the templateFunc to generate an error page to be sent as the response.*/

  errorHandler(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }
        return res.send(templateFunc({ errors, ...data }));
      }
      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }
    next();
  }
};