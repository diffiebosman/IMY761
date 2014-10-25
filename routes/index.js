var express = require('express');
var router = express.Router();

var checkUse = require('../sockets/base');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' , public: '/public'});
});

router.get('/checkAvailability', function(req, res){
	res.send({
		availability: checkUse.usedArrs
	});
});

router.post('/test', function(req, res){
	var username = req.param('username');
	var instrument = req.param('instrument');

    res.render('musicApp', {
        login: username,
        instrument: instrument
    });
});

module.exports = router;