const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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


app.post('/', (req, res) => {
  console.log(req.body);
  res.send("Account Created");
});

app.listen(3000, () => {
  console.log('listening');
});