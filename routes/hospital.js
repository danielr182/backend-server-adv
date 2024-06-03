/* 
Route: /api/hospital 
*/
const Router = require('express');
const { check } = require('express-validator');
const { createHospital, deleteHospital, getHospital, updateHospital } = require('../controllers/hospital');
const { validateFields } = require('../middlewares/validate-fields');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// ================================================
// Get all hospitals
// ================================================
router.get('/', verifyJWT, getHospital);

// ================================================
// Create a hospital
// ================================================
router.post('/', [verifyJWT, check('name', 'Name is required').not().isEmpty(), validateFields], createHospital);

// ================================================
// Update a hospital by ID
// ================================================
router.put('/:id', [verifyJWT, check('name', 'Name is required').not().isEmpty(), validateFields], updateHospital);

// ================================================
// Delete a hospital by ID
// ================================================
router.delete('/:id', verifyJWT, deleteHospital);

module.exports = router;
