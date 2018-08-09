var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
            host: 'primos-db.herokuapp.com', 
            port: 5432,
            database: 'primes',
            user: 'postgres',
            password: '38190971'
        });

function getPrimes(req, res, next) {
  var limit = parseInt(req.params.id);
  db.any('select * from primes limit $1', limit)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved some prime numbers'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function isPrime(req, res, next) {
  var limit = parseInt(req.params.id);
  limit = Math.sqrt(limit);
  db.any('select * from primes where num <= $1', limit)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved if it is prime'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getPrimes: getPrimes,
  isPrime: isPrime
  /*insertLog: insertLog,
  getLog: getLog*/
};