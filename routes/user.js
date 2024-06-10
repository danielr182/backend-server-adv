/* 
Route: /api/user 
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, deleteUser, getUsers, updateUser } = require('../controllers/user');
const { validateFields } = require('../middlewares/validate-fields');
const { verifyJWT, validateRole, validateRoleAndSameUser } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// ================================================
// Get all users
// ================================================
router.get('/', verifyJWT, getUsers);

// ================================================
// Create a user
// ================================================
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    validateFields,
  ],
  createUser
);

// ================================================
// Update a user by ID
// ================================================
router.put(
  '/:id',
  [
    verifyJWT,
    validateRoleAndSameUser,
    check('name', 'Name is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    validateFields,
  ],
  updateUser
);

// ================================================
// Delete a user by ID
// ================================================
router.delete('/:id', [verifyJWT, validateRole], deleteUser);

module.exports = router;
