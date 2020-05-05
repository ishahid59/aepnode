const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysqlConnection = require('../connection');
const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL
// const { poolPromise } = require('../db')




// Router.get('/jobtitle', async (req, res) => {
//     try {
//         let pool = await sql.connect(mssqlconfig)
//         //let pool = await poolPromise
//         let jobtitle = await pool.request()
//             .query(`SELECT * FROM List_EmpJobTitle WHERE List_EmpJobTitle.ListID>-1 ORDER BY List_EmpJobTitle.ListID`)
//         let department = await pool.request()
//             .query(`SELECT * FROM List_Department WHERE List_Department.ListID>-1 ORDER BY List_Department.ListID`)
       
//             res.send([
//                 {"jobtitle": jobtitle.recordset},
//                 {"department": department.recordset}
//             ]);
            
//     } catch (err) {
//         return res.status(400).send("MSSQL ERROR: " + err);
//     }
// })


// EMP EDITMODAL COMBOS
Router.get('/emp', async (req, res) => {
    try {
        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise

        let jobtitle = await pool.request()
            .query(`SELECT * FROM List_EmpJobTitle WHERE List_EmpJobTitle.ListID>-1 ORDER BY List_EmpJobTitle.ListID`)
        let department = await pool.request()
            .query(`SELECT * FROM List_Department WHERE List_Department.ListID>-1 ORDER BY List_Department.ListID`)
        let prefix = await pool.request()
            .query(`SELECT * FROM List_EmpPrefix WHERE List_EmpPrefix.ListID>-1 ORDER BY List_EmpPrefix.ListID`)
        let suffix = await pool.request()
            .query(`SELECT * FROM List_EmpSuffix WHERE List_EmpSuffix.ListID>-1 ORDER BY List_EmpSuffix.ListID`)
        let registration = await pool.request()
            .query(`SELECT * FROM List_EmpRegistration WHERE List_EmpRegistration.ListID>-1 ORDER BY List_EmpRegistration.ListID`)
        let disciplinesf330 = await pool.request()
            .query(`SELECT * FROM List_DisciplineSF330 WHERE List_DisciplineSF330.ListID>-1 ORDER BY List_DisciplineSF330.ListID`)
        let disciplinesf254 = await pool.request()
            .query(`SELECT * FROM List_DisciplineSF254 WHERE List_DisciplineSF254.ListID>-1 ORDER BY List_DisciplineSF254.ListID`)
        let employeestatus = await pool.request()
            .query(`SELECT * FROM List_EmpStatus WHERE List_EmpStatus.ListID>-1 ORDER BY List_EmpStatus.ListID`)
        let comid = await pool.request()
            .query(`SELECT ComID,CompanyName FROM Com_Main WHERE Com_Main.ComID>-1 ORDER BY Com_Main.CompanyName`)

        res.send([
            {"jobtitle":jobtitle.recordset},
            {"department":department.recordset},
            {"prefix":prefix.recordset},
            {"suffix":suffix.recordset},
            {"registration":registration.recordset},
            {"disciplinesf330":disciplinesf330.recordset},
            {"disciplinesf254":disciplinesf254.recordset},
            {"employeestatus":employeestatus.recordset},
            {"comid":comid.recordset}
        ]);

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})


// EMP SEARCH COMBOS
Router.get('/empsearch', async (req, res) => {
    try {
        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise

        let jobtitle = await pool.request()
            .query(`SELECT * FROM List_EmpJobTitle WHERE List_EmpJobTitle.ListID>-1 ORDER BY List_EmpJobTitle.ListID`)
        let department = await pool.request()
            .query(`SELECT * FROM List_Department WHERE List_Department.ListID>-1 ORDER BY List_Department.ListID`)
        let prefix = await pool.request()
            .query(`SELECT * FROM List_EmpPrefix WHERE List_EmpPrefix.ListID>-1 ORDER BY List_EmpPrefix.ListID`)
        let suffix = await pool.request()
            .query(`SELECT * FROM List_EmpSuffix WHERE List_EmpSuffix.ListID>-1 ORDER BY List_EmpSuffix.ListID`)
        let registration = await pool.request()
            .query(`SELECT * FROM List_EmpRegistration WHERE List_EmpRegistration.ListID>-1 ORDER BY List_EmpRegistration.ListID`)
        let disciplinesf330 = await pool.request()
            .query(`SELECT * FROM List_DisciplineSF330 WHERE List_DisciplineSF330.ListID>-1 ORDER BY List_DisciplineSF330.ListID`)
        let disciplinesf254 = await pool.request()
            .query(`SELECT * FROM List_DisciplineSF254 WHERE List_DisciplineSF254.ListID>-1 ORDER BY List_DisciplineSF254.ListID`)
        let employeestatus = await pool.request()
            .query(`SELECT * FROM List_EmpStatus WHERE List_EmpStatus.ListID>-1 ORDER BY List_EmpStatus.ListID`)
        let comid = await pool.request()
            .query(`SELECT ComID,CompanyName FROM Com_Main WHERE Com_Main.ComID>-1 ORDER BY Com_Main.CompanyName`)
             
            
        // Emp Childs
        let empdegree = await pool.request()
            .query(`SELECT * FROM List_EmpDegree WHERE List_EmpDegree.ListID>-1 ORDER BY List_EmpDegree.ListID`)
        let emptraining = await pool.request()
            .query(`SELECT * FROM List_EmpTraining WHERE List_EmpTraining.ListID>-1 ORDER BY List_EmpTraining.ListID`)

        // Projects related
        let projecttype = await pool.request()
            .query(`SELECT * FROM List_ProjectType WHERE List_ProjectType.ListID>-1 ORDER BY List_ProjectType.ListID`)
        let caoid = await pool.request()
            .query(`SELECT CaoID,Name,FullName FROM Cao_Main WHERE Cao_Main.CaoID>-1 ORDER BY Cao_Main.Name`)
        let proocategory = await pool.request()
            .query(`SELECT * FROM List_ProOCategory WHERE List_ProOCategory.ListID>-1 ORDER BY List_ProOCategory.ListID`)
        let empprojectrole = await pool.request()
            .query(`SELECT * FROM List_EmpProjectRole WHERE List_EmpProjectRole.ListID>-1 ORDER BY List_EmpProjectRole.ListID`)
       
            
        res.send([
            {"jobtitle":jobtitle.recordset},
            {"department":department.recordset},
            {"prefix":prefix.recordset},
            {"suffix":suffix.recordset},
            {"registration":registration.recordset},
            {"disciplinesf330":disciplinesf330.recordset},
            {"disciplinesf254":disciplinesf254.recordset},
            {"employeestatus":employeestatus.recordset},
            {"comid":comid.recordset},
            // Emp Childs
            {"empdegree":empdegree.recordset},
            {"emptraining":emptraining.recordset},
            // Projects related
            {"projecttype":projecttype.recordset},
            {"caoid":caoid.recordset},
            {"proocategory":proocategory.recordset},
            {"empprojectrole":empprojectrole.recordset}           

        ]);

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})




// EMPLOYEEID COMBO ON TOP OF DETAIL PAGE
Router.get('/emp/employeeid', async (req, res) => {
    try {
        let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let employeeid = await pool.request()
            .query(`SELECT EmpID,EmployeeID FROM Emp_Main WHERE Emp_Main.EmpID>-1 ORDER BY Emp_Main.EmployeeID`)
            res.send(employeeid.recordset);

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})


// EMP DEGREE COMBOS
Router.get('/empdegree', async (req, res) => {
    try {
        let pool = await sql.connect(mssqlconfig)
        let empdegree = await pool.request()
            .query(`SELECT * FROM List_EmpDegree WHERE List_EmpDegree.ListID>-1 ORDER BY List_EmpDegree.ListID`)
        let state = await pool.request()
            .query(`SELECT * FROM List_State WHERE List_State.ListID>-1 ORDER BY List_State.ListID`)
        let country = await pool.request()
            .query(`SELECT * FROM List_Country WHERE List_Country.ListID>-1 ORDER BY List_Country.ListID`)

            res.send([
                {"empdegree":empdegree.recordset},
                {"state":state.recordset},
                {"country":country.recordset},
            ]);

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})

// EMP REGISTRATION COMBOS
Router.get('/empregistration', async (req, res) => {
    try {
        let pool = await sql.connect(mssqlconfig)
        let empregistration = await pool.request()
            .query(`SELECT * FROM List_EmpRegistration WHERE List_EmpRegistration.ListID>-1 ORDER BY List_EmpRegistration.ListID`)
        let state = await pool.request()
            .query(`SELECT * FROM List_State WHERE List_State.ListID>-1 ORDER BY List_State.ListID`)
        let country = await pool.request()
            .query(`SELECT * FROM List_Country WHERE List_Country.ListID>-1 ORDER BY List_Country.ListID`)

            res.send([
                {"empregistration":empregistration.recordset},
                {"state":state.recordset},
                {"country":country.recordset},
            ]);

    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})



module.exports = Router;