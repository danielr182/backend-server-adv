/* 
Route: /api/login 
*/
const Router = require('express');
const { check } = require('express-validator');
const { googleAuth, userPassAuth, renewToken } = require('../controllers/login');
const { validateFields } = require('../middlewares/validate-fields');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// ================================================
// Login user - Google authentication
// ================================================
router.post(
  '/google',
  [
    check('token', 'Token is required').not().isEmpty(),
    validateFields,
  ],
  googleAuth
);

// ================================================
// Login user - Normal authentication
// ================================================
router.post(
  '/',
  [
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    validateFields,
  ],
  userPassAuth
);

// ================================================
// Login user - Normal authentication
// ================================================
router.get(
  '/renew',
  verifyJWT,
  renewToken
);

module.exports = router;
