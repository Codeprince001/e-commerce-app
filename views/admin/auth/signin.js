const signinTemplate = () => {
  return `
  <div>
  <form method="POST">
    <labe for="email">Email</label>
    <input name="email" id="email" placeholder="email" required/>
    <label for="password">Password</label>
    <input name="password" id="password" placeholder="password" required/>
    <button type="submit">Sign In</button>
  </form>
</div>
  `;
};

module.exports = signinTemplate;