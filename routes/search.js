/* 
Route: /api/search 
*/
const Router = require('express');
const { collectionSearch, generalSearch } = require('../controllers/search');
const { verifyJWT } = require('../middlewares/authentication');

// Initialize variables
const router = Router();

// ================================================
// Collection search
// ================================================
router.get('/collection/:table/:search', verifyJWT, collectionSearch);

// ================================================
// General search
// ================================================
router.get('/all/:search', verifyJWT, generalSearch);

module.exports = router;
