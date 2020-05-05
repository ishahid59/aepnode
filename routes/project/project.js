const express = require('express');

const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysql = require('mysql');
const mysqlConnection = require('../../connection');
const authenticateToken =require('../user');

const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL

// const { poolPromise } = require('../db')



Router.get('/mssql', async (req, res) => {
    try {
        let projectid = 0;
        let pool = await sql.connect(mssqlconfig)
        //const pool = await poolPromise
        let result = await pool.request()
            .query(`SELECT ProjectID, ProjectNo, 
            ProjectName, ProjectRole, AwardYear, ProjectManager, 
            OwnerCategory,ComID,PrimaryProjectType,SecondaryProjectType,
            Owner,Client,ProjectAgreementNo,ProjectStatus,ProposalID
            FROM Pro_Main where ProjectID > ${projectid}`)

        // // Stored procedure
        // let result = await pool.request()
        // // // .input('input_parameter', sql.Int, value)
        // // // .output('output_parameter', sql.VarChar(50))
        // .execute('spEmpView')           
            

        // result.recordsets.length // count of recordsets returned by the procedure
        // result.recordsets[0].length // count of rows contained in first recordset
        // result.recordset // first recordset from result.recordsets
        res.send(result.recordset);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})

















// Datatable severside code Working
// ***************************************************************************
// Router.get('/', async function (req, res) {
Router.post('/', async function (req, res) {

    let draw = req.body.draw;
    let limit = req.body.length;
    let offset = req.body.start;
    let ordercol = req.body['order[0][column]'];
    let orderdir = req.body['order[0][dir]'];
    let search = req.body['search[value]'];

    var columns = {
        0 : 'ProjectID',
        1 : 'ProjectNo',          
        2 : 'ProjectName',
        3 : 'ProjectRole',
        4 : 'AwardYear',
        5 : 'ProjectManager',
        6 : 'OwnerCategory',
        7 : 'ComID',
        8 : 'PrimaryProjectType',
        9 : 'SecondaryProjectType',
        10 : 'Owner',
        11 : 'Client',
        12 : 'ProjectAgreementNo',
        13 : 'ProjectStatus',
        13 : 'ProposalID',
    }



    var totalData = 0;
    var totalbeforefilter = 0;
    var totalFiltered = 0;
    var col = columns[ordercol];


    // // For Getting the TotalData without Filter
    // try {
    //     let pool = await sql.connect(mssqlconfig)
    //     let result2 = await pool.request()
    //         .query(`SELECT(SELECT COUNT(*)FROM Emp_Main) AS Total`)
    //         let count=result2.recordset[0].Total-2;
    //         totalData = count;
    //         totalbeforefilter = count;
    // } catch (err) {
    //     return res.status(400).send("MSSQL ERROR: " + err);
    // }



let strsql = 
    `SELECT Pro_Main.ProjectName, List_ProPRole.Str1 AS disProjectRole, Pro_Main.AwardYear, Pro_Main.ProjectNo, List_ProOCategory.Str1 AS disOwnerCategory, 
    Com_Main.CompanyName AS disComID, List_ProjectType.Str1 AS disPrimaryProjectType, Pro_Main.SecondaryProjectType, CAO_Main.Name AS disOwner, 
    CAO_Main_1.Name AS disClient, Pro_Main.ProjectAgreementNo, Emp_Main.EmployeeID AS disProjectManager, List_ProStatus.Str1 AS disProjectStatus, 
    Proposal_Main.ProposalNo AS disProposalID, Pro_Main.ProjectRole, Pro_Main.OwnerCategory, Pro_Main.ComID, Pro_Main.PrimaryProjectType, Pro_Main.Owner, 
    Pro_Main.Client, Pro_Main.ProjectManager, Pro_Main.ProjectStatus, Pro_Main.ProposalID, Pro_Main.ProjectID
    FROM  Pro_Main LEFT OUTER JOIN
    List_ProStatus ON Pro_Main.ProjectStatus = List_ProStatus.ListID LEFT OUTER JOIN
    List_ProjectType ON Pro_Main.PrimaryProjectType = List_ProjectType.ListID LEFT OUTER JOIN
    List_ProOCategory ON Pro_Main.OwnerCategory = List_ProOCategory.ListID LEFT OUTER JOIN
    List_ProPRole ON Pro_Main.ProjectRole = List_ProPRole.ListID LEFT OUTER JOIN
    Proposal_Main ON Pro_Main.ProposalID = Proposal_Main.ProposalID LEFT OUTER JOIN
    CAO_Main ON Pro_Main.Owner = CAO_Main.CAOID LEFT OUTER JOIN
    CAO_Main AS CAO_Main_1 ON Pro_Main.Client = CAO_Main_1.CAOID LEFT OUTER JOIN
    Com_Main ON Pro_Main.ComID = Com_Main.ComID LEFT OUTER JOIN
    Emp_Main ON Pro_Main.ProjectManager = Emp_Main.EmpID
    WHERE (Pro_Main.ProjectID > 0)`

    if (search == "") {

        try {
            
             let pool = await sql.connect(mssqlconfig)
            // let pool = await poolPromise
            let result2 = await pool.request()
            .query(`SELECT(SELECT COUNT(*)FROM Pro_Main) AS Total`)
            let count=result2.recordset[0].Total-2;
            totalData = count;
            totalbeforefilter = count;

            // let result = await pool.request()
            //  .input('Offset', sql.Int, offset)
            //  .input('Limit', sql.Int, limit)
            // // // .output('output_parameter', sql.VarChar(50))
            // .execute('spEmpView4') 

           //With Mysql ca use "limit":  strsql = strsql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;
           strsql = strsql + ` order by ${col} ${orderdir} OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
           let result = await pool.request().query(strsql)
               
                totalFiltered = totalbeforefilter;
                // res.setHeader('Access-Control-Allow-Origin', '*');
                // res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
                // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
                res.json({
                    "draw": draw,
                    "recordsTotal": totalData,
                    "recordsFiltered": totalFiltered,
                    "data": result.recordset
            });
        } 

        catch (err) {
            // console.log("error")
           return res.status(400).send("MSSQL ERROR: " + err);
        }


    } else {
        // console.log(sql);
        // sql = sql + ` AND firstname LIKE '%${search}%'`;
        // sql = sql + ` OR lastname LIKE '%${search}%'`;
        // sql = sql + ` OR list_empjobtitle.str1 LIKE '%${search}%'`;
        // sql = sql + ` OR list_empregistration.str1 LIKE '%${search}%'`;

        // mysqlConnection.query(sql, (err, rows, fields) => {
        //     if (!err) {
        //         totalFiltered = rows.length
        //         res.json({
        //             "draw": draw,
        //             "recordsTotal": totalData,
        //             "recordsFiltered": totalFiltered,
        //             "data": rows
        //         });
        //     }
        //     else {
        //         console.log(err);
        //     }
        // });

    } // end else

});






// Search Datatable severside code
// ***************************************************************************
// Router.post('/search', function (req, res) {
    Router.post('/search', async function (req, res) {
    

    let draw = req.body.draw;
    let limit = req.body.length;
    let offset = req.body.start;
    let ordercol = req.body['order[0][column]'];
    let orderdir = req.body['order[0][dir]'];

    // let firstname=req.body.firstname;
    // let lastname=req.body.lastname; 
    // let jobtitle=req.body.jobtitle;
    // let registration=req.body.registration;


    // var columns = {
    //     0: 'empid',
    //     1: 'firstname',
    //     2: 'lastname',
    //     3: 'jobtitle',
    //     4: 'registration',
    //     // 5: 'hiredate',
    //     5: 'empid',
    // }

    var columns = {
        0 : 'ProjectID',
        1 : 'ProjectNo',          
        2 : 'ProjectName',
        3 : 'ProjectRole',
        4 : 'AwardYear',
        5 : 'ProjectManager',
        6 : 'OwnerCategory',
        7 : 'ComID',
        8 : 'PrimaryProjectType',
        9 : 'SecondaryProjectType',
        10 : 'Owner',
        11 : 'Client',
        12 : 'ProjectAgreementNo',
        13 : 'ProjectStatus',
        13 : 'ProposalID',
    }


    var totalData = 0;
    var totalbeforefilter = 0;
    var totalFiltered = 0;
    var col = columns[ordercol];// to get name of order col not index


    // // For Getting the TotalData without Filter
    // let sql1 = `SELECT * FROM emp_main WHERE emp_main.empid>0`;
    // mysqlConnection.query(sql1, (err, rows, fields) => {
    //     totalData = rows.length;
    //     totalbeforefilter = rows.length;
    // });


    let strsql = 
        `SELECT Pro_Main.ProjectName, List_ProPRole.Str1 AS disProjectRole, Pro_Main.AwardYear, Pro_Main.ProjectNo, List_ProOCategory.Str1 AS disOwnerCategory, 
        Com_Main.CompanyName AS disComID, List_ProjectType.Str1 AS disPrimaryProjectType, Pro_Main.SecondaryProjectType, CAO_Main.Name AS disOwner, 
        CAO_Main_1.Name AS disClient, Pro_Main.ProjectAgreementNo, Emp_Main.EmployeeID AS disProjectManager, List_ProStatus.Str1 AS disProjectStatus, 
        Proposal_Main.ProposalNo AS disProposalID, Pro_Main.ProjectRole, Pro_Main.OwnerCategory, Pro_Main.ComID, Pro_Main.PrimaryProjectType, Pro_Main.Owner, 
        Pro_Main.Client, Pro_Main.ProjectManager, Pro_Main.ProjectStatus, Pro_Main.ProposalID, Pro_Main.ProjectID
        FROM  Pro_Main LEFT OUTER JOIN
        List_ProStatus ON Pro_Main.ProjectStatus = List_ProStatus.ListID LEFT OUTER JOIN
        List_ProjectType ON Pro_Main.PrimaryProjectType = List_ProjectType.ListID LEFT OUTER JOIN
        List_ProOCategory ON Pro_Main.OwnerCategory = List_ProOCategory.ListID LEFT OUTER JOIN
        List_ProPRole ON Pro_Main.ProjectRole = List_ProPRole.ListID LEFT OUTER JOIN
        Proposal_Main ON Pro_Main.ProposalID = Proposal_Main.ProposalID LEFT OUTER JOIN
        CAO_Main ON Pro_Main.Owner = CAO_Main.CAOID LEFT OUTER JOIN
        CAO_Main AS CAO_Main_1 ON Pro_Main.Client = CAO_Main_1.CAOID LEFT OUTER JOIN
        Com_Main ON Pro_Main.ComID = Com_Main.ComID LEFT OUTER JOIN
        Emp_Main ON Pro_Main.ProjectManager = Emp_Main.EmpID
        WHERE (Pro_Main.ProjectID > 0)`

    // filterpresent=false;
    // // NOTE "mysqlConnection.escape" is used to avoid sql inj with dynamic generated query parameters 
    // // which is not possible with "?"
    // if (firstname !== "") {
    //     //sql = sql+ ` AND firstname = '%${firstname}%'`;
    //      sql = sql+ " AND firstname Like "+ mysqlConnection.escape("%"+firstname+"%");
    //      filterpresent=true;
    // }
    // if (lastname !== "") {
    //     // sql = sql+ ` AND lastname LIKE '%${lastname}%'`;
    //     sql = sql+ " AND lastname Like "+ mysqlConnection.escape("%"+lastname+"%");
    //     filterpresent=true;
    // }
    // if (jobtitle > 0) {
    //     // sql = sql+ ` AND jobtitle = '${jobtitle}'`;
    //     sql = sql+ " AND jobtitle = "+ mysqlConnection.escape(jobtitle);
    //     filterpresent=true;
    // }
    // if (registration > 0) {
    //     // sql = sql+ ` AND registration = '${registration}'`;
    //     sql = sql+ " AND registration = "+ mysqlConnection.escape(registration);
    //     filterpresent=true;
    // }


    // console.log(strsql);
    // strsql = strsql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;

        // mysqlConnection.query(sql, (err, rows, fields) => {

        //     if (!err) {

        //         if (!filterpresent) {
        //             totalFiltered = totalbeforefilter;
        //         }
        //         else{
        //             totalFiltered = rows.length;
        //         }
                
        //         res.json({
        //             "draw": draw,
        //             "recordsTotal": totalData,
        //             "recordsFiltered": totalFiltered,
        //             "data": rows
        //         });
        //     }
        //     else {
        //         console.log(err);
        //     }
        // });


        try {
            
            let pool = await sql.connect(mssqlconfig)
            //let pool = await poolPromise
            let result2 = await pool.request()
            .query(`SELECT(SELECT COUNT(*)FROM Pro_Main) AS Total`)
            let count=result2.recordset[0].Total-2;
            totalData = count;
            totalbeforefilter = count;

            // let result = await pool.request()
            //  .input('Offset', sql.Int, offset)
            //  .input('Limit', sql.Int, limit)
            // // // .output('output_parameter', sql.VarChar(50))
            // .execute('spEmpView4') 

           //With Mysql ca use "limit":  strsql = strsql + ` order by ${col} ${orderdir} limit ${limit} offset ${offset} `;
           strsql = strsql + ` order by ${col} ${orderdir} OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
           let result = await pool.request().query(strsql)
               
                totalFiltered = totalbeforefilter;
                 res.json({
                    "draw": draw,
                    "recordsTotal": totalData,
                    "recordsFiltered": totalFiltered,
                    "data": result.recordset
            });
        } 

        catch (err) {
            // console.log("error")
           return res.status(400).send("MSSQL ERROR: " + err);
        }

        

});





// Project Edit page
Router.get('/:projectid', async function (req, res) {

    try {
    let projectid = req.param("projectid");  
 
    let strsql = `SELECT ProjectID, ProjectNo, 
    ProjectName, ProjectRole, AwardYear, ProjectManager, 
    OwnerCategory,ComID,PrimaryProjectType,SecondaryProjectType,
    Owner,Client,ProjectAgreementNo,ProjectStatus,ProposalID
    FROM Pro_Main where ProjectID = ${projectid}`


        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let result = await pool.request()
            //.query(`SELECT * FROM emp_main WHERE emp_main.empid=${empid}`)
            .query(strsql)
        res.send(result.recordset[0]);
    }
    catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});


// Router.get('/:empid', function (req, res) {
//     // mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid="+req.param('empid'),(err,rows,fields)=>{
//     mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid=?", req.param('empid'), (err, rows, fields) => {
//         if (!err) {
//             res.send(rows[0]);
//             console.log(rows[0]);
//             // res.render("Hello.ejs", {name:rows});
//         } else {
//             console.log(err);
//         }
//     });
// });



// Pro Detail
Router.get('/prodetails/:projectid', async (req, res) => {

  try {  
      
    let projectid = req.param("projectid");  
    let strsql = 
        `SELECT Pro_Main.ProjectName, List_ProPRole.Str1 AS disProjectRole, Pro_Main.AwardYear, Pro_Main.ProjectNo, List_ProOCategory.Str1 AS disOwnerCategory, 
        Com_Main.CompanyName AS disComID, List_ProjectType.Str1 AS disPrimaryProjectType, Pro_Main.SecondaryProjectType, CAO_Main.Name AS disOwner, 
        CAO_Main_1.Name AS disClient, Pro_Main.ProjectAgreementNo, Emp_Main.EmployeeID AS disProjectManager, List_ProStatus.Str1 AS disProjectStatus, 
        Proposal_Main.ProposalNo AS disProposalID, Pro_Main.ProjectRole, Pro_Main.OwnerCategory, Pro_Main.ComID, Pro_Main.PrimaryProjectType, Pro_Main.Owner, 
        Pro_Main.Client, Pro_Main.ProjectManager, Pro_Main.ProjectStatus, Pro_Main.ProposalID, Pro_Main.ProjectID
        FROM  Pro_Main LEFT OUTER JOIN
        List_ProStatus ON Pro_Main.ProjectStatus = List_ProStatus.ListID LEFT OUTER JOIN
        List_ProjectType ON Pro_Main.PrimaryProjectType = List_ProjectType.ListID LEFT OUTER JOIN
        List_ProOCategory ON Pro_Main.OwnerCategory = List_ProOCategory.ListID LEFT OUTER JOIN
        List_ProPRole ON Pro_Main.ProjectRole = List_ProPRole.ListID LEFT OUTER JOIN
        Proposal_Main ON Pro_Main.ProposalID = Proposal_Main.ProposalID LEFT OUTER JOIN
        CAO_Main ON Pro_Main.Owner = CAO_Main.CAOID LEFT OUTER JOIN
        CAO_Main AS CAO_Main_1 ON Pro_Main.Client = CAO_Main_1.CAOID LEFT OUTER JOIN
        Com_Main ON Pro_Main.ComID = Com_Main.ComID LEFT OUTER JOIN
        Emp_Main ON Pro_Main.ProjectManager = Emp_Main.EmpID
        WHERE (Pro_Main.ProjectID = ${projectid})`

        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let result = await pool.request()
            .query(strsql)
        res.send(result.recordset[0]);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})



// Router.post('/', function (req, res) {
//     // With express-Validator   
//     // Router.post('/',[ 
//     //     check('lastname',"Lastname cannot be empty.").notEmpty(),
//     //     check('firstname',"Firstname cannot be empty.").notEmpty()
//     //     ], 
//     //     function (req, res) {
//     //     const errors = validationResult(req);
//     //     if (!errors.isEmpty()) {
//     //         return res.status(422).json({ errors: errors.array() });
//     //     }

//     console.log(req.body);
//     console.log(req.body.hiredate);
//     let postdata = req.body;

//     // if(req.body.hiredate==null){

//     //     req.body.hiredate="0000-00-00";
//     // }
//     mysqlConnection.query('INSERT INTO emp_main SET ?', postdata, function (error, results, fields) {
//         if (!error) {
//             // console.log(query.sql); 
//             console.log("success");
//             res.send(results);
//         } else {
//             console.log(error);
//         }
//     });
// });


// Router.delete('/:empid', function (req, res) {
//     mysqlConnection.query("DELETE FROM emp_main WHERE empid=?", req.param('empid'), (err, rows, fields) => {
//          if (!err) {
//             res.send(rows);
//         } else {
//             console.log(err);
//         }
//     });
// });



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



// Router.post('/update',authenticateToken, [
//     check('lastname', "Lastname cannot be empty.").notEmpty(),
//     check('firstname', "Firstname cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
// ],
//     function (req, res) {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(422).json({ errors: errors.array() });
//         }

//         //Consulant Checked send 1, but unchecked sends null so be manually put in 0
//         if (req.body.consultant == null) {
//             req.body.consultant = 0;
//         }
//         let post3 = req.body;
//         console.log(post3);
//         let query = `UPDATE emp_main  SET ? WHERE empid=?`;
//         mysqlConnection.query(query, [post3, req.body.empid], (err, rows, fields) => {
//             if (!err) {
//                 res.send(rows);
//                 console.log(post3);
//             } else {
//                 console.log("err");
//             }
//         });
//     });


// Router.post('/update',authenticateToken, [
//     check('lastname', "Lastname cannot be empty.").notEmpty(),
//     check('firstname', "Firstname cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
// ],
//     function (req, res) {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(422).json({ errors: errors.array() });
//         }






// DELETE
Router.delete('/:projectid', async function (req, res) {
    try {
        let pool = await sql.connect(mssqlconfig)
        let result = await pool.request()
        .query(`DELETE FROM Pro_Main WHERE ProjectID=${req.param("ProjectID")}`)
        res.send(result.rowsAffected)
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});



// UPDATE
Router.post('/update',
    [
        check('Lastname', "Lastname cannot be empty.").notEmpty(),
        check('Firstname', "Firstname cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
    ],

    async function (req, res) {
        console.log(req.body.HireDate);
        let dt=''
        if (req.body.HireDate=="") {
            dt=null;
        } 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            let pool = await sql.connect(mssqlconfig)
            let result = await pool.request()
                .query(`UPDATE Emp_Main  SET 
            Firstname='${req.body.Firstname}', 
            Lastname='${req.body.Lastname}',
            MiddleI='${req.body.MiddleI}',
            Prefix='${req.body.Prefix}',
            Suffix='${req.body.Suffix}',
            FullName='${req.body.FullName}',
            ComID='${req.body.ComID}',
            Jobtitle='${req.body.JobTitle}',
            Department='${req.body.Department}',
            Registration='${req.body.Registration}',
            HireDate='${req.body.HireDate}',
            DisciplineSF254='${req.body.DisciplineSF254}',
            DisciplineSF330='${req.body.DisciplineSF330}',
            EmployeeStatus='${req.body.EmployeeStatus}',
            ExpWithOtherFirm='${req.body.ExpWithOtherFirm}',
            Employee_Consultant='${req.body.Employee_Consultant}'
            WHERE EmpID=${req.body.EmpID}`)
            // HireDate='${req.body.HireDate}',
            res.send(result.rowsAffected)
        } catch (err) {
            return res.status(400).send("MSSQL ERROR: " + err);
        }

    });


// INSERT
Router.post('/add',
    [
        check('Lastname', "Lastname cannot be empty.").notEmpty(),
        check('Firstname', "Firstname cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
    ],

    async function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const CalculatedEmpID = 118 // test

            let pool = await sql.connect(mssqlconfig)
            let result = await pool.request()
                .query(`INSERT INTO Emp_Main (
                EmpID,
                EmployeeID,
                Firstname, 
                Lastname,
                MiddleI,
                Prefix,
                Suffix,
                FullName,
                ComID,
                Jobtitle,
                Department,
                Registration,
                HireDate,
                DisciplineSF254,
                DisciplineSF330,
                EmployeeStatus,
                ExpWithOtherFirm,
                Employee_Consultant,
                ImageData)  
                VALUES (
                '${CalculatedEmpID}',
                '${req.body.EmployeeID}',
                '${req.body.Firstname}',
                '${req.body.Lastname}',
                '${req.body.MiddleI}',
                '${req.body.Prefix}',
                '${req.body.Suffix}',
                '${req.body.FullName}',
                '${req.body.ComID}',
                '${req.body.JobTitle}',
                '${req.body.Department}',
                '${req.body.Registration}',
                '${req.body.HireDate}',
                '${req.body.DisciplineSF254}',
                '${req.body.DisciplineSF330}',
                '${req.body.EmployeeStatus}',
                0.00,
                0,
                null)`
                )
            //res.send(result.rowsAffected)
            // Send CalculatedEmpID in the backtic format to use it for going to detail page using this new empid
            res.send(`${CalculatedEmpID}`)

        } catch (err) {
            return res.status(400).send("MSSQL ERROR: " + err);
        }

    });










// .query(`UPDATE Emp_Main  SET 
// Firstname='${req.body.Firstname}', 
// Lastname='${req.body.Lastname}',
// MiddleI='${req.body.MiddleI}',
// Prefix='${req.body.Prefix}',
// Suffix='${req.body.Suffix}',
// FullName='${req.body.FullName}',
// ComID='${req.body.ComID}',
// Jobtitle='${req.body.JobTitle}',
// Department='${req.body.Department}',
// Registration='${req.body.Registration}',
// HireDate='${req.body.HireDate}',
// DisciplineSF254='${req.body.DisciplineSF254}',
// DisciplineSF330='${req.body.DisciplineSF330}',
// EmployeeStatus='${req.body.EmployeeStatus}',
// ExpWithOtherFirm='${req.body.ExpWithOtherFirm}',
// Employee_Consultant='${req.body.Employee_Consultant}'
// WHERE EmpID=${req.body.EmpID}`)



module.exports = Router;


