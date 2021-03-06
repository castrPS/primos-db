var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://gwveoxkgwcegmi:01364c26d2792df508acf73865cad04bd9541a3050fbc9489eb009c99463f9a9@ec2-23-23-216-40.compute-1.amazonaws.com:5432/da4k37g2kd3to4';
var db = pgp(connectionString);

function getLog(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var i = '-';
  var o = '-';
  insertLog(ip, 'getLog', i, o);
   db.any('select * from log',)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'este é o log'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getLogTxt(req, res, next) {
  res.download("log.txt");
}

function insertLog(ip, func, inObj, outObj) {
    var currentdate = new Date(); 
    var hourtime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
    var fs = require('fs');
    var contents = fs.readFileSync("log.txt", { "encoding": "utf8"});
    var str = "\r\n\r\nip: " + ip + "\r\ndate and time: " + hourtime + "\r\nfunction called: " + func + "\r\ninput: " + inObj + "\r\noutput: " + outObj;
    fs.writeFile("log.txt", (contents+str), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    db.none('insert into log (IP, hourtime, function, inObj, outObj) ' +
      'values($1, $2, $3, $4, $5)',
    [ip, hourtime, func, inObj, outObj])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted on log'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

/*function insertLogTest(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    var currentdate = new Date(); 
    var hourtime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    db.none("insert into log (IP, hourtime) " +
      "values($1, $2)", [ip, hourtime])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted on log with ' + ip + hourtime
        });
    })
    .catch(function (err) {
      return next(err);
    });
}*/

function getPrimes(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var limit = parseInt(req.params.id);
  db.any('select num from primes limit $1', limit)
    .then(function (data) {
      
      var array = data;
      var numbers = [];
      for (var i = 0; i < array.length; i++){
        numbers = numbers.concat(array[i].num);
      }
      insertLog(ip, 'getPrimes', limit, numbers);
      res.status(200)
        .json({
          status: 'success',
          data: numbers,
          message: limit + ' primeiros números primos.'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function isPrime(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var id = parseInt(req.params.id);
  db.any('select * from primes where num = $1', id)
    .then(function (data) {
      var array = data;
      if(array.length > 0){
        insertLog(ip, 'isPrime', id, array[0].num);
        res.status(200)
          .json({
            status: 'success prime',
            data: [array[0].num],
            message: 'Resultado : ' + id + ' é primo. , Menor divisor: ' + array[0].num
          });
        }else{
          var limit = Math.sqrt(id);
          db.any('select * from primes where num <= $1', limit)
            .then(function (data) {
              array = data;
              for (var i = 0; i<array.length; i++){
                if ((id % array[i].num) == 0){
                  insertLog(ip, 'isPrime', id, array[i].num);
                  res.status(200)
                    .json({
                        status: 'success not-prime',
                        data: [array[i].num],
                        message: 'Resultado : ' + id + ' não é primo. , Menor divisor: ' + array[i].num
                  });
                }
              }
              insertLog(ip, 'isPrime', id, id);
                  res.status(200)
                    .json({
                        status: 'success maybe-prime',
                        data: [id],
                        message: 'Resultado : ' + id + ' talvez seja primo.'
                  });
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
  isPrime: isPrime,
  getLog: getLog/*,
  insertLogTest: insertLogTest*/,
  getLogTxt: getLogTxt
};