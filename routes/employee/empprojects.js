const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysqlConnection = require('../connection');
const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL
// const { poolPromise } = require('../db')


Router.get('/:empid', async (req, res) => {
    try {
        let empid = req.param("empid");
        let strsql=
            `SELECT  Pro_Main.ProjectName, Pro_Main.ProjectNo,  List_EmpProjectRole.Str1 AS disEmpProjectRole, 
            List_EmpProjectRole_1.Str1 AS disSecProjectRole, Pro_Team.ID, Pro_Team.DutiesAndResponsibilities, Pro_Team.DurationFrom, Pro_Team.DurationTo, 
            Pro_Team.MonthsOfExp, Pro_Team.EmpProjectRole, Pro_Team.SecProjectRole, Pro_Team.EmpID, Pro_Team.ProjectID, Pro_Team.Notes
            FROM Pro_Main INNER JOIN
            Pro_Team ON Pro_Main.ProjectID = Pro_Team.ProjectID INNER JOIN
            List_EmpProjectRole ON Pro_Team.EmpProjectRole = List_EmpProjectRole.ListID INNER JOIN
            List_EmpProjectRole AS List_EmpProjectRole_1 ON Pro_Team.SecProjectRole = List_EmpProjectRole_1.ListID
            WHERE  (Pro_Team.EmpID = ${empid})
            ORDER BY Pro_Main.ProjectNo DESC`

        
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

Router.get('/view/:id', async (req, res) => {
    try {
        let id = req.param("id");
        let strsql=
            `SELECT  Pro_Main.ProjectName, Pro_Main.ProjectNo,  List_EmpProjectRole.Str1 AS disEmpProjectRole, 
            List_EmpProjectRole_1.Str1 AS disSecProjectRole, Pro_Team.ID, Pro_Team.DutiesAndResponsibilities, Pro_Team.DurationFrom, Pro_Team.DurationTo, 
            Pro_Team.MonthsOfExp, Pro_Team.EmpProjectRole, Pro_Team.SecProjectRole, Pro_Team.EmpID, Pro_Team.ProjectID, Pro_Team.Notes
            FROM Pro_Main INNER JOIN
            Pro_Team ON Pro_Main.ProjectID = Pro_Team.ProjectID INNER JOIN
            List_EmpProjectRole ON Pro_Team.EmpProjectRole = List_EmpProjectRole.ListID INNER JOIN
            List_EmpProjectRole AS List_EmpProjectRole_1 ON Pro_Team.SecProjectRole = List_EmpProjectRole_1.ListID
            WHERE  (Pro_Team.ID = ${id})`
        
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


module.exports = Router;