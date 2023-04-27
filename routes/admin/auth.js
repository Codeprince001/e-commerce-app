const express = require('express');


const { errorHandler } = require('../../middlewares/middlewares');
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
  errorHandler(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    // create a user in our repo to represent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.redirect('/admin/products');
  });

router.get('/signout', (req, res) => {
  req.session = null;
  res.send("you are logged out");

});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post('/signin',
  [requireExactEmail, requireExactPassword],
  errorHandler(signinTemplate),
  async (req, res) => {

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;

    res.redirect('/admin/products');
  });

module.exports = router;