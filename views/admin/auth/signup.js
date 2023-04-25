const layoutAdmin = require('../layout');

const signupTemplate = ({ req }) => {
  return layoutAdmin({
    content: `
  <!DOCTYPE html>
  <html>
  <div>
  Your is is: ${req.session.userId}
  <form method="POST">
    <label for="email">Email</label>
    <input name="email" id="email" placeholder="email" required/>
    <label for="password">Password</label>
    <input name="password" id="password" placeholder="password" required/>
    <label for="c_password">Confirm Password</label>
    <input name="passwordConfirmation" id="c_password" placeholder="confirm password" required/>
    <button type="submit">Sign up</button>
  </form>
</div>
  `});
};

module.exports = signupTemplate;