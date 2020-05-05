const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysqlConnection = require('../connection');
const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL
// const { poolPromise } = require('../db')


// Router.get('/',  (req, res) => {
//     let sql = "SELECT list_empregistration.listid, list_empregistration.str1,list_empregistration.str2 FROM list_empregistration WHERE list_empregistration.listid>-1 ORDER BY list_empregistration.listid";
//     mysqlConnection.query(sql, (err, rows, fields) => {
//         if (!err) {
//             res.json(rows);
//         } else {
//             console.log(err);
//         }
//     });
// })

// Router.get('/', async (req, res) => {
//     try {
//         let pool = await sql.connect(mssqlconfig)
//         // let pool = await poolPromise
//         let result = await pool.request()
//             .query(`SELECT list_empregistration.listid, list_empregistration.str1,list_empregistration.str2 FROM list_empregistration WHERE list_empregistration.listid>-1 ORDER BY list_empregistration.listid`)
//         res.send(result.recordset);
//     } catch (err) {
//         return res.status(400).send("MSSQL ERROR: " + err);
//     }
// })


// ALL RECORDS
Router.get('/:empid', async (req, res) => {
    try {
        let empid = req.param("empid");
        let strsql=
            `SELECT List_EmpRegistration.Str1 AS disRegistration, List_State.str1 AS disRegState, List_Country.Str1 AS disCountry, Emp_Registration.ID, Emp_Registration.RegYear, 
            Emp_Registration.RegIssueDate, Emp_Registration.RegExpDate, Emp_Registration.RegistrationNo, Emp_Registration.Notes, Emp_Registration.Registration, 
            Emp_Registration.RegState, Emp_Registration.Country, Emp_Registration.EmpID
            FROM Emp_Registration INNER JOIN
            List_EmpRegistration ON Emp_Registration.Registration = List_EmpRegistration.ListID INNER JOIN
            List_State ON Emp_Registration.RegState = List_State.ListID INNER JOIN
            List_Country ON Emp_Registration.Country = List_Country.ListID
            WHERE (Emp_Registration.EmpID = ${empid})
            ORDER BY disRegistration`

        
        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let result = await pool.request()
            // .query(`SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid=${empid}`)
            .query(strsql);
            res.send(result.recordset);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})



// VIEW 1 RECORD
Router.get('/view/:id', async (req, res) => {
    try {
        let id = req.param("id");
        let strsql=
            `SELECT List_EmpRegistration.Str1 AS disRegistration, List_State.str1 AS disRegState, List_Country.Str1 AS disCountry, Emp_Registration.ID, Emp_Registration.RegYear, 
            Emp_Registration.RegIssueDate, Emp_Registration.RegExpDate, Emp_Registration.RegistrationNo, Emp_Registration.Notes, Emp_Registration.Registration, 
            Emp_Registration.RegState, Emp_Registration.Country, Emp_Registration.EmpID
            FROM Emp_Registration INNER JOIN
            List_EmpRegistration ON Emp_Registration.Registration = List_EmpRegistration.ListID INNER JOIN
            List_State ON Emp_Registration.RegState = List_State.ListID INNER JOIN
            List_Country ON Emp_Registration.Country = List_Country.ListID
            WHERE (Emp_Registration.ID = ${id})`

        
        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let result = await pool.request()
            // .query(`SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid=${empid}`)
            .query(strsql);
            res.send(result.recordset[0]);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})



// EDIT
Router.get('/edit/:id', async function (req, res) {
    try {
        let pool = await sql.connect(mssqlconfig)
        let result = await pool.request()
        .query(`SELECT * FROM Emp_Registration WHERE ID=${req.param("id")}`)
        res.send(result.recordset[0])
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});



// DELETE
Router.delete('/:id', async function (req, res) {
    try {
        let pool = await sql.connect(mssqlconfig)
        let result = await pool.request()
        .query(`DELETE FROM Emp_Registration WHERE ID=${req.param("id")}`)
        res.send(result.rowsAffected)
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});



// UPDATE
Router.post('/update', async function (req, res) {

    try {

        let pool = await sql.connect(mssqlconfig)
        let result = await pool.request()
            .query(`UPDATE Emp_Registration  SET 
            Registration='${req.body.Registration}',
            RegState='${req.body.RegState}',
            Country='${req.body.Country}',
            RegistrationNo='${req.body.RegistrationNo}',
            RegYear='${req.body.RegYear}',
            RegIssueDate='${req.body.RegIssueDate}',
            RegExpDate='${req.body.RegExpDate}',
            Notes='${req.body.Notes}',
            EmpID='${req.body.EmpID}'
            WHERE ID=${req.body.ID}`)
       
        res.send(result.rowsAffected)
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});


// INSERT
Router.post('/', async function (req, res) {

    try {

        const CalculatedID=70 // test

        let pool = await sql.connect(mssqlconfig)
        let result = await pool.request()
            .query(`INSERT INTO  Emp_Registration (
                ID,
                Registration,
                RegState,
                Country,
                RegistrationNo,
                RegYear,
                RegIssueDate,
                RegExpDate,
                Notes,
                EmpID)
                VALUES (
                '${CalculatedID}',
                '${req.body.Registration}',
                '${req.body.RegState}',
                '${req.body.Country}',
                '${req.body.RegistrationNo}',
                '${req.body.RegYear}',
                '${req.body.RegIssueDate}',
                '${req.body.RegExpDate}',
                '${req.body.Notes}',
                '${req.body.EmpID}')`)

        res.send(result.rowsAffected)

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});



module.exports = Router;