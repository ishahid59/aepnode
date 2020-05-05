

// // Local MSSQL 2008 Server at office(doesnt support FETCH NEXT  query)
// const config = {
//     user: 'ishahid2',
//     password: 'ishahid2723',
//     server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Aep',
// }


// const config = {
//     user: 'ishahid',
//     password: 'ishahid2723',
    
//     server: 'DESKTOP-PV1ENHD\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
//     // Trusted_Connection: true,
//     database: 'aep',
//     // port:1433
    
// }


//Local MSSQL Express 2017
const config = {
    server: 'DESKTOP-PV1ENHD\\SQLEXPRESS',
    database: 'Aep',
    user :'ishahid',
    password : 'ishahid2723',
    // options: {
    //     // Trusted_Connection: true,
    //     encrypt: false,
    // },
    // port: 1433
};



// // Eicra 2020
// const config = {
//     server: 'ws9.eicra.org', // or 213.175.193.168
//     database: 'Aep',
//     user :'ishahid2',
//     password : 'Is#kse494',
//     options: {
//         encrypt: false, // Important for Eicra
//     },
// };


module.exports=config