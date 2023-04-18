const express = require("express");
const connection = require("../connection");

const router = express.Router();
const AuthController = require('../controllers/auth');

router.get("/", (req, res)=>{
    res.render("index")
});

router.get("/login", (req, res)=>{
    res.render("login")
});


router.get("/register", async (req, res, next)=>{
    // console.log(req.body),
    connection.query('SELECT * FROM `rto`', (err, rows) =>{
        if(rows.length > 0){
            res.render("registration",{
                message: req.body.message,
                rtos: rows 
            })
        }
    })
});

router.get("/recover_pass", (req, res)=>{
    res.render("recover_password")
});

router.get("/helpdesk", (req, res)=>{
    res.render("helpdesk")
});

router.get("/welcome", AuthController.isPassengerLoggedIn, (req, res)=>{
    res.render("welcome")
});

// router.get("/officer_profile", AuthController.isPassengerLoggedIn, (req, res)=>{
//     res.render("officer_details")
// });


module.exports = router;