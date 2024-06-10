/* 
Route: /api 
*/
const Router = require('express');

// Initialize variables
const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Request made correctly.',
  });
});

module.exports = router;
