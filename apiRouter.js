const express = require('express');
const router = express.Router();

router.get('/home', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/:id', function(req, res) {
    res.json({ message: 'id = ' + req.params.id });
});

module.exports = router;