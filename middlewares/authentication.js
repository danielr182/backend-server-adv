const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { roles } = require('../constants/roles');

// ================================================
// Verify token
// ================================================
const verifyJWT = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Token is required.',
      errors: 'custom error',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: 'Incorrect token.',
      errors: err.toString(),
    });
  }
  next();
};

const validateRole = async (req, res, next) => {
  const uid = req.uid;
  
  try {
    const dbUser = await User.findById(uid);

    if (!dbUser) {
      return res.status(404).json({
        ok: false,
        message: 'User does not exist',
        errors: 'validation error',
      });
    }

    if (dbUser.role !== roles.admin) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have privileges to perform this action.',
        errors: 'validation error',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error validating role',
      errors: err.toString(),
    });
  }
}

const validateRoleAndSameUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;
  
  try {
    const dbUser = await User.findById(uid);

    if (!dbUser) {
      return res.status(404).json({
        ok: false,
        message: 'User does not exist',
        errors: 'validation error',
      });
    }

    if (dbUser.role !== roles.admin && uid !== id) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have privileges to perform this action.',
        errors: 'validation error',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error validating role',
      errors: err.toString(),
    });
  }
};

module.exports = { verifyJWT, validateRole, validateRoleAndSameUser };
