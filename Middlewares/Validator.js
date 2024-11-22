const { check, validationResult } = require("express-validator");

exports.registerValidations = () => [
  check("username", "Username is required and cannot be empty").notEmpty(),
  check("email", "Invalid email format").isEmail(),
  check(
    "password",
    "Password must be at least 8 characters long, include 1 uppercase letter, 2 numbers, and 1 symbol"
  ).isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 2,
    minSymbols: 1,
  }),
];

exports.validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      msg: "Validation errors",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
