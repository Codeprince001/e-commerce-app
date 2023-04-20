const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['jkhad5jbwh9k6nxbhfcbwheg6']
}));

app.get('/signup', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <labe for="email">Email</label>
        <input name="email" id="email" placeholder="email" required/>
        <label for="password">Password</label>
        <input name="password" id="password" placeholder="password" required/>
        <label for="c_password">Confirm Password</label>
        <input name="passwordConfirmation" id="c_password" placeholder="confirm password" required/>
        <button type="submit">Sign up</button>
      </form>
    </div>
  `);
});


app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email in use');
  }
  if (password !== passwordConfirmation) {
    return res.send("Password must match");
  }

  // create a user in our repo to represent this person
  const user = await usersRepo.create({ email, password });
  // Store the id of that user inside the users cookie
  req.session.userId = user.id;

  res.send("Account Created");
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send("you are logged out");

});

app.get('/signin', (req, res) => {
  res.send(`
  <div>
  <form method="POST">
    <labe for="email">Email</label>
    <input name="email" id="email" placeholder="email" required/>
    <label for="password">Password</label>
    <input name="password" id="password" placeholder="password" required/>
    <button type="submit">Sign In</button>
  </form>
</div>
  `);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });
  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePassword(
    user.password, password
  );
  if (!validPassword) {
    return res.send("Invalid Passowrd");
  }

  req.session.userId = user.id;

  res.send('You are signed in!!!!');
});

app.listen(3000, () => {
  console.log('listening');
}); 