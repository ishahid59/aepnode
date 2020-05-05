const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysqlConnection = require('../connection');
const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL
// const { poolPromise } = require('../db')



// Router.get('/:empid',  (req, res) => {
//     // let sql = "SELECT emp_degree.id, emp_degree.degree as str1,emp_degree.empid FROM emp_degree WHERE emp_degree.empid=? ORDER BY emp_degree.id";

//     let sql = "SELECT emp_degree.empid, list_empdegree.str1 FROM emp_degree INNER JOIN list_empdegree ON emp_degree.degree=list_empdegree.listid WHERE emp_degree.empid=?";

//     mysqlConnection.query(sql,req.param("empid"), (err, rows, fields) => {
//         if (!err) {
//             res.json(rows);
//         } else {
//             console.log(err);
//         }
//     });
// })



// ALL
Router.get('/:projectid', async (req, res) => {
    try {
        let projectid = req.param("projectid");
        let strsql=
            `SELECT Emp_Main.EmployeeID AS disEmployeeID, List_EmpProjectRole.Str1 AS disEmpProjectRole, List_EmpProjectRole_1.Str1 AS disSecProjectRole, Pro_Team.ID, 
            Pro_Team.DutiesAndResponsibilities, Pro_Team.DurationFrom, Pro_Team.DurationTo, Pro_Team.MonthsOfExp, Pro_Team.Notes, Pro_Team.ProjectID, 
            Pro_Team.EmpProjectRole, Pro_Team.SecProjectRole, Pro_Team.EmpID
            FROM Pro_Team INNER JOIN
            Emp_Main ON Pro_Team.EmpID = Emp_Main.EmpID INNER JOIN
            List_EmpProjectRole ON Pro_Team.EmpProjectRole = List_EmpProjectRole.ListID INNER JOIN
            List_EmpProjectRole AS List_EmpProjectRole_1 ON Pro_Team.SecProjectRole = List_EmpProjectRole_1.ListID
            WHERE (Pro_Team.ProjectID = ${projectid})
            ORDER BY disEmployeeID`

        
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
            `SELECT List_EmpDegree.str1 AS disDegree, Emp_Degree.DegreeField, Emp_Degree.Institution, Emp_Degree.YearDegreeEarned, List_State.str1 AS disState, 
            List_Country.Str1 AS disCountry, Emp_Degree.ID, Emp_Degree.Notes, Emp_Degree.Degree, Emp_Degree.DegState, Emp_Degree.Country, 
            Emp_Degree.EmpID 
            FROM Emp_Degree INNER JOIN 
            List_EmpDegree ON Emp_Degree.Degree = List_EmpDegree.ListID INNER JOIN 
            List_State ON Emp_Degree.DegState = List_State.ListID INNER JOIN 
            List_Country ON Emp_Degree.Country = List_Country.ListID 
            WHERE (Emp_Degree.ID = ${id})`

        
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
            .query(`SELECT * FROM Emp_Degree WHERE ID=${req.param("id")}`)
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
            .query(`DELETE FROM Emp_Degree WHERE ID=${req.param("id")}`)
        res.send(result.rowsAffected)
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
});


// UPDATE
Router.post('/update',
    [
        check('Degree', "Degree cannot be empty.").isInt({ gt: 0 }),
        check('DegreeField', "DegreeField cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
    ],

    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            let pool = await sql.connect(mssqlconfig)
            let result = await pool.request()
                .query(`UPDATE Emp_Degree  SET 
            Degree='${req.body.Degree}',
            DegreeField='${req.body.DegreeField}',
            Institution='${req.body.Institution}',
            DegState='${req.body.DegState}',
            Country='${req.body.Country}',
            YearDegreeEarned='${req.body.YearDegreeEarned}',
            Notes='${req.body.Notes}',
            EmpID='${req.body.EmpID}'
            WHERE ID=${req.body.ID}`)

            res.send(result.rowsAffected)

        } catch (err) {
            return res.status(400).send("MSSQL ERROR: " + err);
        }
    });



// INSERT
Router.post('/',
    [
        check('Degree', "Degree cannot be empty.").isInt({ gt: 0 }),
        check('DegreeField', "DegreeField cannot be empty.").notEmpty()//.isEmail().withMessage('Firstname TEST must contain a number')
    ],

    async function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            const CalculatedID = 70 // test

            let pool = await sql.connect(mssqlconfig)
            let result = await pool.request()
                .query(`INSERT INTO  Emp_Degree (
            ID,
            Degree,
            DegreeField,
            Institution,
            DegState,
            Country,
            YearDegreeEarned,
            Notes,
            EmpID)
            VALUES (
            '${CalculatedID}',
            '${req.body.Degree}',
            '${req.body.DegreeField}',
            '${req.body.Institution}',
            '${req.body.DegState}',
            '${req.body.Country}',
            '${req.body.YearDegreeEarned}',
            '${req.body.Notes}',
            '${req.body.EmpID}')`)

            res.send(result.rowsAffected)

        } catch (err) {
            return res.status(400).send("MSSQL ERROR: " + err);
        }
    });

module.exports = Router;