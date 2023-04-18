const express = require("express");
const req = require("express/lib/request");
const connection = require("../connection");
const AuthController = require("../controllers/auth");
const PassController = require("../controllers/passenger");

const router = express.Router();

router.get("/profile", AuthController.isPassengerLoggedIn, (req, res)=>{
    connection.query('SELECT `balance` FROM `wallet` WHERE `user_id` = ? ORDER BY `time` DESC', req.user.user_id, (err, data) => {
        console.log(data[0]);
        if (err) {
            console.log(err);
        } else {
            res.render("passenger_details",{
                cookie : req.cookie,
                user : req.user,
                balance : data[0].balance
            })
        }
    })
});

router.get("/update_pass", AuthController.isPassengerLoggedIn, (req, res)=>{
    res.render("update_password",{
        user : req.user
    })
});

router.get("/edit_profile", AuthController.isPassengerLoggedIn, (req, res)=>{
    res.render("edit_passenger",{
        cookie : req.cookie,
        user : req.user
    })
});

router.get("/wallet", AuthController.isPassengerLoggedIn, async (req, res, next)=>{
    try{
        await connection.query('SELECT * FROM `wallet` WHERE `user_id` = ?', req.user.user_id, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.render("balance",{
                    user : req.user,
                    rows : data
                })
            }
        })
    }catch (err){
        console.log(err);
        return next;
    }
});

router.get("/addToken", AuthController.isPassengerLoggedIn, (req, res)=>{
    res.render("add_token_form",{
        user : req.user
    })
});

router.get("/travel", AuthController.isPassengerLoggedIn, async (req, res, next)=>{
    try{
        await connection.query('SELECT * FROM `uses` WHERE `passengeruser_id` = ?', req.user.user_id, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.render("travel_log",{
                    user : req.user,
                    rows : data
                })
            }
        })
    }catch (err){
        console.log(err);
        return next;
    }
});

router.get("/helpdesk", AuthController.isPassengerLoggedIn, (req, res)=>{
    res.render("pass_helpdesk",{
        user : req.user
    })
});

router.post('/update', AuthController.isPassengerLoggedIn, PassController.updatePassProfile);

router.post('/addToken', AuthController.isPassengerLoggedIn, PassController.addToken);

router.post('/updatePass', AuthController.isPassengerLoggedIn, PassController.updatePassword);

// router.post('/edit_profile', PassController.editPassProfile);

module.exports = router;