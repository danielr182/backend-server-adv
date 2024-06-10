const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: errors.array().at(0).msg,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = { validateFields };
