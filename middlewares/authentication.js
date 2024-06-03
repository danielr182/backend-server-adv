const jwt = require('jsonwebtoken');

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

module.exports = { verifyJWT };
