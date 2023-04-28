const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');


const validator = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 character'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a number greater than 1"),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existinguser = await usersRepo.getOneBy({ email });
      if (existinguser) {
        throw new Error("E-mail already in use");
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('must be between 4 and 20 characters'),
  requireConfirmPassword: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('must be between 4 and 20 characters')
    .custom(
      ((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Passwords must match");
        } else {
          return true;
        };
      })
    ),
  requireExactEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('must provide a valid eamil')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found");
      }
    }),
  requireExactPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid password');
      }
      const validPassword = await usersRepo.comparePassword(
        user.password, password
      );
      if (!validPassword) {
        throw new Error("Invalid Password");
      }
    })
};

module.exports = validator;