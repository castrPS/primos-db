var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://gwveoxkgwcegmi:01364c26d2792df508acf73865cad04bd9541a3050fbc9489eb009c99463f9a9@ec2-23-23-216-40.compute-1.amazonaws.com:5432/da4k37g2kd3to4';
var db = pgp(connectionString);

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
  var id = parseInt(req.params.id);
  db.any('select * from primes where num = $1', id)
    .then(function (data) {
      if(data != []){
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved if it is prime'
          });
        }else{
          var limit = Math.sqrt(id);
          db.any('select * from primes where num <= $1', limit)
            .then(function (data) {
              for (var i = 0; i<data.length(); i++){
                if (id % data[i].num == 0){
                  res.status(200)
                    .json({
                        status: 'success',
                        data: data[i],
                        message: 'Retrieved if it is prime'
                  });
                }
              }
            })
            .catch(function (err) {
              return next(err);
            });
        }
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