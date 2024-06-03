/* 
Route: /api/medic 
*/
const Router = require('express');
const { check } = require('express-validator');
const { createMedic, deleteMedic, getMedics, updateMedic } = require('../controllers/medic');
const { validateFields } = require('../middlewares/validate-fields');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// ================================================
// Get all medics
// ================================================
router.get('/', verifyJWT, getMedics);

// ================================================
// Create a medic
// ================================================
router.post(
  '/',
  [
    verifyJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('hospital', 'Hospital should be a valid Id').isMongoId(),
    validateFields,
  ],
  createMedic
);

// ================================================
// Update a medic by ID
// ================================================
router.put(
  '/:id',
  [
    verifyJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('hospital', 'Hospital is required').not().isEmpty(),
    validateFields,
  ],
  updateMedic
);

// ================================================
// Delete a medic by ID
// ================================================
router.delete('/:id', verifyJWT, deleteMedic);

module.exports = router;
