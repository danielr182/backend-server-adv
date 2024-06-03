/* 
Route: /api/login 
*/
const Router = require('express');
const { check } = require('express-validator');
const { googleAuth, userPassAuth } = require('../controllers/login');
const { validateFields } = require('../middlewares/validate-fields');

// Initialize variables
const router = Router();

// ================================================
// Login user - Google authentication
// ================================================
router.post('/google', googleAuth);

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

module.exports = router;
