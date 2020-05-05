//MySql COnnection
const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({

    // host     : 'localhost',
    // user     : 'root',
    // password : '',
    // database : 'node12',
    // multipleStatements: true


    // host     : 'sql3.freemysqlhosting.net',
    // user     : 'sql3334151',
    // password : 'PSj3cNHnIJ',
    // database : 'sql3334151',
    // multipleStatements: true

    // host     : 'mysqlcluster27.registeredsite.com',
    // user     : 'ishahid',
    // password : 'Is#kse494',
    // database : 'ksep',
    // multipleStatements: true



  });

  // mysqlConnection.connect((err)=>{
  //     if(!err){
  //       console.log("Database Connection Successful");
  //     }
  //     else{
  //       console.log("Connection Failure");
  //     }
  // });

  
  module.exports = mysqlConnection;
