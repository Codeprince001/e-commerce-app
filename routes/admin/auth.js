const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { checkEmail, checkPassword, checkConfirmPassword } = require('./validator');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});


router.post('/signup', [checkEmail, checkPassword, checkConfirmPassword], async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

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
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
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

module.exports = router;