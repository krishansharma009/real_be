const express = require('express');
const router = express.Router();
const supportController = require('./supportController');



router.get('/', supportController.getData);
router.post('/', supportController.PostData);
router.delete('/:id', supportController.deleteData);



module.exports = router