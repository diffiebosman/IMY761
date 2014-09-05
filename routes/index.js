var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res){
	var username = req.param('username');

    res.render('musicApp', {
        login: username
    });
});

module.exports = router;
