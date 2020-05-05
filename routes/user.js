require('dotenv').config()

const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
// const mysql = require('mysql');
// const mysqlConnection = require('../connection');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');


// const cors = require('cors');

// Router.use(cors());
// Router.options('*', cors()) // include before other routes

// Router.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//     next();
// });



//  Router.get('/', authenticateToken, (req, res) => {
Router.get('/', (req, res) => {

    let sql = "SELECT users.id, users.email,users.name, users.password, users.remember_token, users.created_at, users.updated_at FROM users";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
})



// Router.post('/', async (req, res) => {
//     try {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10)
//       const user = { email: req.body.email, password: hashedPassword, created_at:new Date().getTime() }

//        users.push(user)
//        res.status(201).send()
//     } catch {
//       res.status(500).send()
//     }
// })


Router.post('/', async (req, res) => {
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        created_at: mysqlTimestamp
    }

    mysqlConnection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
        if (!error) {
            // console.log(query.sql); 
            console.log("success");
            res.send(user);
        } else {
            console.log(error);
        }
    });
});


Router.get('/:id', function (req, res) {
    mysqlConnection.query("SELECT * FROM users WHERE users.id=?", req.param('id'), (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            // res.render("Hello.ejs", {name:rows});
        } else {
            console.log(err);
        }
    });
});


Router.delete('/:id', function (req, res) {
    // mysqlConnection.query("SELECT * FROM emp_main WHERE emp_main.empid="+req.param('empid'),(err,rows,fields)=>{
    mysqlConnection.query("DELETE FROM users WHERE users.id=?", req.param('id'), (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            // res.render("Hello.ejs", {name:rows});
        } else {
            console.log(err);
        }
    });
});



// Router.put('/', authenticateToken,
Router.put('/',
    [
        check('name', "name cannot be empty").notEmpty(),
        check('email', "must be a valid email").isEmail()
    ],

    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        console.log(req.body.email);
        let id = req.body.id;
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let remember_token = req.body.remember_token;
        let created_at = req.body.created_at;
        let updated_at = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        // const hashedPassword = await bcrypt.hash(req.body.password, 10)

        let query = `UPDATE users SET name = ?, email = ?, password = ?, remember_token = ?, created_at = ?, updated_at = ? WHERE id=?`;
        mysqlConnection.query(query, [name, email, password, remember_token, created_at, updated_at, id], (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });



Router.post('/login',
    [
        check('email', "Email cannot be empty").notEmpty().isEmail().withMessage("Must be a valid email"),
        check('password', "Password cannot be empty").notEmpty()
    ],

    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors);
        }

        mysqlConnection.query("SELECT * FROM users WHERE users.email=?", req.body.email, async (err, rows, fields) => {

            if (!err) {

                const user = rows[0];
                if (user == null) {
                    // return res.status(400).send('Cannot find user');
                    return res.status(400).send({ errors: [{ 'msg': 'Cannot find user' }] });
                }

                try {
                    if (await bcrypt.compare(req.body.password, rows[0].password)) {
                        // res.send('Success') // only use 1 send accessToken cannot be send if this send is used
                        const useremail = req.body.email;
                        const user2 = { email: useremail };
                        //**for creation token must pass SECRET key .env file to heroku */
                        const accessToken = jwt.sign(user2, process.env.ACCESS_TOKEN_SECRET)
                        // res.header("Access-Control-Allow-Origin", "*");
                        // res.setHeader("Content-Type", "application/json");
                        // res.setHeader("Accept", "application/json");
                        res.json({ access_token: accessToken,user: user});
                    }
                    else {
                        // res.send('Not allowed')
                        return res.status(422).json({ errors: [{ 'msg': 'Incorrect password' }] });
                    }
                } catch (error) {
                    res.status(500).send(error.message);
                }

            } else {
                res.status(500).send(err.message)
            }

        }) // end mysqlConnection

    }) // end Router.post








// //LOGIN VALIDATION
// //https://www.youtube.com/watch?v=Ud5xKCYQTjM
// //https://github.com/WebDevSimplified/Nodejs-User-Authentication/blob/master/server.js
// Router.post('/login2',
//     // [
//     //     check('email', "email cannot be empty").notEmpty(),
//     //     check('password', "email cannot be empty").notEmpty()
//     // ],

//     (req, res) => {
//         // const errors = validationResult(req);
//         // if (!errors.isEmpty()) {
//         //     return res.status(422).json(errors);
//         // }


//         let user = {};
//         mysqlConnection.query("SELECT * FROM users WHERE users.email=?", req.body.email, (err, rows, fields) => {
//             if (!err) {
//                 user = rows[0];
//                 res.send("success");
//                 if (user == null) {
//                     return res.status(400).send('Cannot find user');
//                 }

//                 // bcrypt.compare(req.body.password, user.password, function (err, result) {
//                 //     if (result == true) {
//                 //         // res.send('Correct Password');
//                 //         // After Auth succes generate token
//                 //         const useremail = req.body.email;
//                 //         const user2 = { email: useremail };
//                 //         const accessToken = jwt.sign(user2, process.env.ACCESS_TOKEN_SECRET)
//                 //         // res.header("Access-Control-Allow-Origin", "*");
//                 //         res.json({ access_token: accessToken });
//                 //     } else {
//                 //         //  res.send('Incorrect password');
//                 //         //  res.status(422).json('Incorrect password');
//                 //         // ** NOTE to show errors in "catch(err => {" of front end we must use .status(422) or others but not 200
//                 //         // this way all the validation err and this error msg can be shown in one catch
//                 //         return res.status(422).json({ errors: [{ 'msg': 'Incorrect password' }] });
//                 //     }
//                 // });
//             } else {
//                 res.status(500).send(err.message)
//             }

//         })//End of the SQL

//     })



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
     if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}



module.exports = Router;
// to export authenticateToken in server to use globally or use in individual modules
// note: exporting this will cause authenticateToken activated for all routes in this module
// So middlewares should be kept in a seperate module
// module.exports = authenticateToken;
