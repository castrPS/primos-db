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
          message: limit + ' primeiros números primos.'
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
      var array = data;
      if(array.length > 0){
        res.status(200)
          .json({
            status: 'success prime',
            data: array[0].num,
            message: 'Resultado" : ' + id + ' é primo. , Menor divisor": ' + array[0].num
          });
        }else{
          var limit = Math.sqrt(id);
          db.any('select * from primes where num <= $1', limit)
            .then(function (data) {
              array = data;
              for (var i = 0; i<array.length; i++){
                if ((id % array[i].num) == 0){
                  res.status(200)
                    .json({
                        status: 'success not-prime',
                        data: array[i].num,
                        message: 'Resultado : ' + id + ' não é primo. , Menor divisor: ' + array[i].num
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