const layoutAdmin = require('../layout');

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};

const signinTemplate = ({ req, errors }) => {
  return layoutAdmin({
    content: `
  <!DOCTYPE html>
  <html>
  <head></head>
  <body>
    <div>
      <form method="POST">
        <labe for="email">Email</label>
        <input name="email" id="email" placeholder="email" required/>
        ${getError(errors, 'email')}
        <label for="password">Password</label>
        <input name="password" id="password" placeholder="password" required/>
        ${getError(errors, 'password')}
        <button type="submit">Sign In</button>
      </form>
    </div>
  </body>
  </html>
  `});
};

module.exports = signinTemplate;