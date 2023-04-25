const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

const validator =

  module.exports = {
    checkEmail: check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .custom(async email => {
        const user = await usersRepo.getOneBy({ email });
        if (user) {
          throw new Error("E-mail already in use");
        }
      }),
    checkPassword: check('password').trim().isLength({ min: 4, max: 20 }),
    checkConfirmPassword: check('passwordConfirmation').trim().isLength({ min: 4, max: 20 }).custom(
      ((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Passwords must match");
        }
      })
    )

  };