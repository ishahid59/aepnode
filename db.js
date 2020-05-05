// const sql = require('mssql')
// const config = 
// // Eicra 2020
// {
//     server: 'ws9.eicra.org', // or 213.175.193.168
//     database: 'Aep',
//     user :'ishahid2',
//     password : 'Is#kse494',
//     options: {
//         encrypt: false, // Important for Eicra
//     },
// }
// //Local MSSQL Express 2017
// // {
// //     server: 'DESKTOP-PV1ENHD\\SQLEXPRESS',
// //     database: 'Aep',
// //     user: 'ishahid',
// //     password: 'ishahid2723',
// // }

// //Local MSSQL 2008 Server at office(doesnt support FETCH NEXT  query)
// // const config = {
// //     user: 'ishahid2',
// //     password: 'ishahid2723',
// //     server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
// //     database: 'Aep',
// // }





// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(pool => {
//     console.log('Connected to MSSQL')
//     return pool
//   })
//   .catch(err => console.log('Database Connection Failed! Bad Config: ', err))



// module.exports = {
//   sql, poolPromise
// }