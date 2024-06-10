/* 
Route: /api/image 
*/
const Router = require('express');
const { getImage } = require('../controllers/images');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

router.get('/:type/:img', getImage);

module.exports = router;
