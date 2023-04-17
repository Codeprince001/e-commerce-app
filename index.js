const express = require('express');

const app = express();

app.get('/', (req, res) => {
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

// middleware function
const bodyParser = (req, res, next) => {
  if (req.method = 'POST') {
    req.on('data', data => {
      const parsed = data.toString('utf8').split('&');
      const formData = {};
      for (let pair of parsed) {
        const [key, value] = pair.split('=');
        formData[key] = value;
      }
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};

app.post('/', bodyParser, (req, res) => {
  console.log(req.body);
  res.send("Account Created");
});

app.listen(3000, () => {
  console.log('listening');
});