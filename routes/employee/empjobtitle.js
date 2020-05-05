const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysqlConnection = require('../connection');
const sql = require('mssql'); // TEST MSSQL
const mssqlconfig = require('../../mssqlconfig'); // TEST MSSQL
// const { poolPromise } = require('../db')


// Router.get('/',  (req, res) => {
//     let sql = "SELECT list_empjobtitle.listid, list_empjobtitle.str1,list_empjobtitle.str2 FROM list_empjobtitle WHERE list_empjobtitle.listid>-1 ORDER BY list_empjobtitle.listid";
//     mysqlConnection.query(sql, (err, rows, fields) => {
//         if (!err) {
//             res.json(rows);
//         } else {
//             console.log(err);
//         }
//     });
// })


Router.get('/', async (req, res) => {
    try {
         let pool = await sql.connect(mssqlconfig)
        //let pool = await poolPromise
        let result = await pool.request()
            .query(`SELECT list_empjobtitle.listid, list_empjobtitle.str1,list_empjobtitle.str2 FROM list_empjobtitle WHERE list_empjobtitle.listid>-1 ORDER BY list_empjobtitle.listid`)
        res.send(result.recordset);
    } catch (err) {
        return res.status(400).send("MSSQL ERROR: " + err);
    }
})


module.exports = Router;