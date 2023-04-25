const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requireConfirmPassword, requireExactEmail, requireExactPassword } = require('./validator');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});


router.post('/signup',
  [requireEmail, requirePassword, requireConfirmPassword],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    // errors : [{value: 'password', msg: ''password invalid, param: 'password', location: 'body'}] 
    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;
    // create a user in our repo to represent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send("Account Created");
  });

router.get('/signout', (req, res) => {
  req.session = null;
  res.send("you are logged out");

});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post('/signin',
  [requireExactEmail, requireExactPassword], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ req, errors }));
    }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.send('You are signed in!!!!');
  });

module.exports = router;