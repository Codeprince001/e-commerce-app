const layoutAdmin = require('../layout');

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};


const signupTemplate = ({ req, errors }) => {
  return layoutAdmin({
    content: `
  <!DOCTYPE html>
  <html>
  <div>
  Your is is: ${req.session.userId}
  <form method="POST">
    <label for="email">Email</label>
    <input name="email" id="email" placeholder="email" required/>
    ${getError(errors, 'email')}
    <label for="password">Password</label>
    <input name="password" id="password" placeholder="password" required/>
    ${getError(errors, 'password')}
    <label for="c_password">Confirm Password</label>
    <input name="passwordConfirmation" id="c_password" placeholder="confirm password" required/>
    ${getError(errors, 'passwordConfirmation')}
    <button type="submit">Sign up</button>
  </form>
</div>
  `});
};

module.exports = signupTemplate;