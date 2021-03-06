var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/primes/:id', db.getPrimes);
router.get('/api/isPrime/:id', db.isPrime);
router.get('/api/log', db.getLog);
/*router.get('/api/logtest', db.insertLogTest);*/
router.get('/api/logtxt', db.getLogTxt);

module.exports = router;
