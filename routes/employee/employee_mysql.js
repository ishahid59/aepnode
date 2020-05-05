const express = require('express');

const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysql = require('mysql');
const mysqlConnection = require('../../connection');
const authenticateToken =require('../user');

const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL



// // TEST MSSQL
// Router.get('/mssql',async function (req, res) {
// // async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         // await sql.connect('mssql://username:password@localhost/database')
//         let value=0;
//         await sql.connect('mssql://ishahid2:ishahid2723@IQBAL-PC/Aep')
//         const result = await sql.query`select TOP 10 * from Emp_Main where EmpId > ${value}`
//         // console.dir(result)
//         res.send(result);
//         // console.log(result)
//     } catch (err) {
//         // ... error checks
//         console.log("MSSQL ERRORS: "+ err )
//     //    return res.send("MSSQL ERROR: "+ err);
//        return res.status(400).send("MSSQL ERROR: "+ err);
//     }
// // }
// });



// TEST MSSQL
// Router.get('/mssql', async (req, res) => {
//     try {
//         let value = 0;
//         await sql.connect('mssql://ishahid2:ishahid2723@IQBAL-PC/Aep')
//         const result = await sql.query`select TOP 10 * from Emp_Main where EmpId > ${value}`
//         res.send(result);
//     } catch (err) {
//         console.log("MSSQL ERRORS: " + err)
//         return res.status(400).send("MSSQL ERROR: " + err);
//     }
// });


// const mssqlconfig = {
//     user: 'ishahid2',
//     password: 'ishahid2723',
//     server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Aep'
// }


// Router.get('/mssql', async (req, res) => {
//     try {
//         let pool = await sql.connect(mssqlconfig)
//         let result1 = await pool.request()
//             .input('input_parameter', sql.Int, 0)
//             .input('jobtitle_parameter', sql.Int, 25)
//             .query('select * from Emp_Main where EmpId > = @input_parameter AND JobTitle =@jobtitle_parameter')
//         res.send(result1);
//     } catch (err) {
//         return res.status(400).send("MSSQL ERROR: " + err);
//     }
// });



Router.get('/mssql', async (req, res) => {
    try {
        let empid = 0;
        let pool = await sql.connect(mssqlconfig)
        // let result = await pool.request()
        //     .query(`select * from emp_main where empid > ${empid}`)


        // Stored procedure
        let result = await pool.request()
        // // .input('input_parameter', sql.Int, value)
        // // .output('output_parameter', sql.VarChar(50))
        .execute('spEmpView')           
            

        // result.recordsets.length // count of recordsets returned by the procedure
        // result.recordsets[0].length // count of rows contained in first recordset
        // result.recordset // first recordset from result.recordsets
        res.send(result.recordset);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})


















Router.get('/netsol', function (req, res) {

    let sql="SELECT * FROM Emp_Main WHERE empid>0 "

     mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});


Router.get('/all', function (req, res) {

    let sql="SELECT emp_main.empid, emp_main.firstname, emp_main.lastname, list_empjobtitle.str1 AS jobtitle, \
     list_empregistration.str1 AS registration, emp_main.consultant, emp_main.hiredate, emp_main.created_at, \
     emp_main.updated_at FROM emp_main INNER JOIN list_empjobtitle ON emp_main.jobtitle = list_empjobtitle.listid \
     INNER JOIN list_empregistration on emp_main.registration=list_empregistration.listid WHERE emp_main.empid>0 order by emp_main.empid"

     mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});




// Datatable severside code Working
// ***************************************************************************
Router.get('/', function (req, res) {

    let draw = req.query.draw;
    let limit = req.query.length;
    let offset = req.query.start;
    let ordercol = req.query.order[0].column;
    let orderdir = req.query.order[0].dir;
    let search = req.query.search.value;

    var columns = {
        0: 'empid',
        1: 'firstname',
        2: 'lastname',
        3: 'jobtitle',
        4: 'registration',
        5: 'hiredate',
    }

    var totalData = 0;
    var totalbeforefilter = 0;
    var totalFiltered = 0;
    var col = columns[ordercol];

    //For Getting the TotalData without Filter
    let sql1 = `SELECT * FROM emp_main WHERE emp_main.empid>0`;
    mysqlConnection.query(sql1, (err, rows, fields) => {
        totalData = rows.length;
        totalbeforefilter = rows.length;
    });

    let data = 0;
    // For getting the DataTable
    let sql = `SELECT emp_main.empid, emp_main.firstname, emp_main.lastname, list_empjobtitle.str1 AS jobtitle, \
    list_empregistration.str1 AS registration, emp_main.consultant, emp_main.hiredate, emp_main.created_at, \
    emp_main.updated_at FROM emp_main INNER JOIN list_empjobtitle ON emp_main.jobtitle = list_empjobtitle.listid \
    INNER JOIN list_empregistration on emp_main.registration=list_empregistration.listid WHERE emp_main.empid>0`

    if (search == "") {
        console.log("No Search");
        sql = sql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;

        mysqlConnection.query(sql, (err, rows, fields) => {
            if (!err) {
                totalFiltered = totalbeforefilter;
                res.json({
                    "draw": draw,
                    "recordsTotal": totalData,
                    "recordsFiltered": totalFiltered,
                    "data": rows
                });
            }
            else {
                console.log(err);
            }


        });


    } else {
        console.log(sql);
        sql = sql + ` AND firstname LIKE '%${search}%'`;
        sql = sql + ` OR lastname LIKE '%${search}%'`;
        sql = sql + ` OR list_empjobtitle.str1 LIKE '%${search}%'`;
        sql = sql + ` OR list_empregistration.str1 LIKE '%${search}%'`;

        mysqlConnection.query(sql, (err, rows, fields) => {
            if (!err) {
                totalFiltered = rows.length
                res.json({
                    "draw": draw,
                    "recordsTotal": totalData,
                    "recordsFiltered": totalFiltered,
                    "data": rows
                });
            }
            else {
                console.log(err);
            }
        });

    } // end else

});


// Search Datatable severside code
// ***************************************************************************
Router.post('/search', function (req, res) {

    let draw = req.body.draw;
    let limit = req.body.length;
    let offset = req.body.start;
    let ordercol = req.body['order[0][column]'];
    let orderdir = req.body['order[0][dir]'];

    let firstname=req.body.firstname;
    let lastname=req.body.lastname; 
    let jobtitle=req.body.jobtitle;
    let registration=req.body.registration;


    var columns = {
        0: 'empid',
        1: 'firstname',
        2: 'lastname',
        3: 'jobtitle',
        4: 'registration',
        // 5: 'hiredate',
        5: 'empid',
    }

    var totalData = 0;
    var totalbeforefilter = 0;
    var totalFiltered = 0;
    var col = columns[ordercol];// to get name of order col not index


    // For Getting the TotalData without Filter
    let sql1 = `SELECT * FROM emp_main WHERE emp_main.empid>0`;
    mysqlConnection.query(sql1, (err, rows, fields) => {
        totalData = rows.length;
        totalbeforefilter = rows.length;
    });


    let sql = `SELECT emp_main.empid, emp_main.firstname, emp_main.lastname, list_empjobtitle.str1 AS jobtitle, \
    list_empregistration.str1 AS registration, emp_main.consultant, emp_main.hiredate, emp_main.created_at, \
    emp_main.updated_at FROM emp_main INNER JOIN list_empjobtitle ON emp_main.jobtitle = list_empjobtitle.listid \
    INNER JOIN list_empregistration on emp_main.registration=list_empregistration.listid WHERE emp_main.empid>0`


    filterpresent=false;
    // NOTE "mysqlConnection.escape" is used to avoid sql inj with dynamic generated query parameters 
    // which is not possible with "?"
    if (firstname !== "") {
        //sql = sql+ ` AND firstname = '%${firstname}%'`;
         sql = sql+ " AND firstname Like "+ mysqlConnection.escape("%"+firstname+"%");
         filterpresent=true;
    }
    if (lastname !== "") {
        // sql = sql+ ` AND lastname LIKE '%${lastname}%'`;
        sql = sql+ " AND lastname Like "+ mysqlConnection.escape("%"+lastname+"%");
        filterpresent=true;
    }
    if (jobtitle > 0) {
        // sql = sql+ ` AND jobtitle = '${jobtitle}'`;
        sql = sql+ " AND jobtitle = "+ mysqlConnection.escape(jobtitle);
        filterpresent=true;
    }
    if (registration > 0) {
        // sql = sql+ ` AND registration = '${registration}'`;
        sql = sql+ " AND registration = "+ mysqlConnection.escape(registration);
        filterpresent=true;
    }
    console.log(sql);
        sql = sql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;

        mysqlConnection.query(sql, (err, rows, fields) => {

            if (!err) {

                if (!filterpresent) {
                    totalFiltered = totalbeforefilter;
                }
                else{
                    totalFiltered = rows.length;
                }
                
                res.json({
                    "draw": draw,
                    "recordsTotal": totalData,
                    "recordsFiltered": totalFiltered,
                    "data": rows
                });
            }
            else {
                console.log(err);
            }
        });

});









Router.get('/:empid', function (req, res) {
    // mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid="+req.param('empid'),(err,rows,fields)=>{
    mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid=?", req.param('empid'), (err, rows, fields) => {
        if (!err) {
            res.send(rows[0]);
            console.log(rows[0]);
            // res.render("Hello.ejs", {name:rows});
        } else {
            console.log(err);
        }
    });
});


// for emp detail page
Router.get('/empdetails/:empid', function (req, res) {
    // mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid="+req.param('empid'),(err,rows,fields)=>{
    mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid=?", req.param('empid'), (err, rows, fields) => {
        if (!err) {
            res.send(rows[0]);
            // res.render("Hello.ejs", {name:rows});
        } else {
            console.log(err);
        }
    });
});


Router.post('/', function (req, res) {
    // With express-Validator   
    // Router.post('/',[ 
    //     check('lastname',"Lastname cannot be empty.").notEmpty(),
    //     check('firstname',"Firstname cannot be empty.").notEmpty()
    //     ], 
    //     function (req, res) {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(422).json({ errors: errors.array() });
    //     }

    console.log(req.body);
    console.log(req.body.hiredate);
    let postdata = req.body;

    // if(req.body.hiredate==null){

    //     req.body.hiredate="0000-00-00";
    // }
    mysqlConnection.query('INSERT INTO emp_main SET ?', postdata, function (error, results, fields) {
        if (!error) {
            // console.log(query.sql); 
            console.log("success");
            res.send(results);
        } else {
            console.log(error);
        }
    });
});


Router.delete('/:empid', function (req, res) {
    // let delete1 = req.body.empid;
    // console.log(delete1);
    mysqlConnection.query("DELETE FROM emp_main WHERE empid=?", req.param('empid'), (err, rows, fields) => {
        // mysqlConnection.query("DELETE FROM emp_main WHERE empid=?", delete1, (err, rows, fields) => {

        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

// Router.post('/update', function(req,res){
//     let firstname= req.body.firstname;
//     let lastname= req.body.lastname;
//     let empid =req.body.empid;
//     let query = `UPDATE emp_main SET firstname = ?, lastname = ? WHERE empid=?`;
//     mysqlConnection.query(query,[firstname,lastname,empid],(err,rows,fields)=>{
//         if (!err) {
//             res.send(rows);
//         } else {
//             console.log(err);
//         }
//     });
// });

Router.post('/update',authenticateToken, [
    check('lastname', "Lastname cannot be empty.").notEmpty(),
    check('firstname', "Firstname cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
],
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        //Consulant Checked send 1, but unchecked sends null so be manually put in 0
        if (req.body.consultant == null) {
            req.body.consultant = 0;
        }
        let post3 = req.body;
        console.log(post3);
        let query = `UPDATE emp_main  SET ? WHERE empid=?`;
        mysqlConnection.query(query, [post3, req.body.empid], (err, rows, fields) => {
            if (!err) {
                res.send(rows);
                console.log(post3);
            } else {
                console.log("err");
            }
        });
    });








module.exports = Router;


// app.get('/', function(req, res){
//     // let myname= "FROM EJS"
// //    res.render("Hello.ejs", {name:myname, myBoolean:false});
// // res.render("Hello.ejs");
//    mysqlConnection.query("SELECT * FROM emp_main",(err,rows,fields)=>{
//        if(!err){
//         res.send(rows);
//         // res.render("Hello.ejs", {name:rows});
//        }else{
//            console.log(err);
//        }
//    });
// });