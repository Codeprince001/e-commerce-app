const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['jkhad5jbwh9k6nxbhfcbwheg6']
}));
app.use(authRouter);

app.listen(3000, () => {
  console.log('listening');
}); 