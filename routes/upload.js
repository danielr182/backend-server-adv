/* 
Route: /api/user 
*/
const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { uploadFile } = require('../controllers/upload');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// default options
router.use(fileUpload());

// ================================================
// Upload files
// ================================================
router.put('/:type/:id', verifyJWT, uploadFile);

module.exports = router;
