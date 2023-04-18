const express = require("express");
const connection = require("../connection");
const AuthController = require("../controllers/auth");
const OfficialController = require("../controllers/official");

const router = express.Router();

// My Profile
router.get("/profile", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("officer_details",{
        user : req.user
    })
});
router.get("/updatePassword", AuthController.isOfficerLoggedIn, (req, res)=>{
    console.log(req.user);
    res.render("update_password",{
        user : req.user
    })
});
router.get("/query", AuthController.isOfficerLoggedIn, (req, res)=>{
    connection.query("SELECT * FROM passenger", (err, rows) => {
        if(err) throw err;
        res.render('query', {
            user : req.user,
            passengers : rows
        })
    })
});
router.get("/helpdesk", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("officer_helpdesk",{
        user : req.user
    })
});
// Manage Passengers    #
router.get("/freshPass", AuthController.isOfficerLoggedIn, (req, res)=>{
        connection.query("SELECT * FROM `passenger` WHERE rto_id = ? AND status = ?", [req.user.rto_id, "0"], (err, rows) => {
        if(err) throw err;
        res.render('passengers_fresh', {
            user : req.user,
            passengers : rows
        })
    })
});
router.get("/activePass", AuthController.isOfficerLoggedIn, (req, res)=>{
    connection.query("SELECT * FROM passenger WHERE rto_id = ? AND status = ?", [req.user.rto_id, "1"], (err, rows) => {
        if(err) throw err;
        res.render('passengers_active', {
            user : req.user,
            passengers : rows
        })
    })
});
router.get("/rejectedPass", AuthController.isOfficerLoggedIn, (req, res)=>{
    connection.query("SELECT * FROM passenger WHERE rto_id = ? AND status = ?", [req.user.rto_id, "-1"], (err, rows) => {
        if(err) throw err;
        res.render('passengers_rejected', {
            user : req.user,
            passengers : rows
        })
    })
});
router.get("/addPass", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("add_passenger",{
        user : req.user
    })
});
router.get("/editPass", AuthController.isOfficerLoggedIn, (req, res)=>{
        res.render("select_edit_passenger",{
            user : req.user
        })
});
router.get("/editPass/:uid", AuthController.isOfficerLoggedIn, (req, res)=>{
    uid = req.params.uid;
    console.log(req.user.rto_id, uid);
    connection.query("SELECT * FROM `passenger` WHERE rto_id = ? AND `user_id` = ?", [req.user.rto_id, uid], (err, passengers) => {
        console.log(passengers.length);
        // if(err) throw err;
        if(passengers.length > 0){
            res.render("officer_edit_passenger",{
                user : req.user,
                passenger : passengers[0]
            })
        }else {
            res.render("select_edit_passenger",{
                user : req.user,
                message : "Passenger Not Found.",
                type : "error"
            })
        }
    })
});
router.get("/addToken/:passenger_id", AuthController.isOfficerLoggedIn, (req, res)=>{
    var pass_id= req.params.passenger_id;
    console.log(pass_id);
    res.render("officer_add_token_form",{
        user : req.user,
        p_id : pass_id
    })
});
router.get("/accept/:uid", AuthController.isOfficerLoggedIn, (req, res)=>{
    uid = req.params.uid;
    connection.query("SELECT * FROM passenger WHERE user_id = ?", uid, (err, passengers) => {
        if(err) throw err;
        res.render("assign_card",{
            user : req.user,
            passenger : passengers[0].user_id
        })
    })
});
// Manage Vehicles  ##
router.get("/addVehicle", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("add_vehicle",{
        user : req.user
    })
});
router.get("/registeredVehicle", AuthController.isOfficerLoggedIn, (req, res)=>{
    connection.query("SELECT * FROM vehicle WHERE rto_id = ?", req.user.rto_id, (err, rows) => {
        if(err) throw err;
        res.render("registered_vehicle",{
            user : req.user,
            vehicles : rows
        })
    })
});
// Revenue
router.get("/totalRev", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("officer_details",{
        user : req.user
    })
});
router.get("/addToken", AuthController.isOfficerLoggedIn, (req, res)=>{
    res.render("officer_add_token_form",{
        user : req.user,
        p_id : null
    })
});

router.post('/assignCard', AuthController.isOfficerLoggedIn, OfficialController.assignCard);

router.post('/addPass', AuthController.isOfficerLoggedIn, OfficialController.addPassProfile);

router.post('/editPassProfile', AuthController.isOfficerLoggedIn, OfficialController.editPassProfile);

router.post('/updatePassProfile', OfficialController.updatePassProfile);

router.post('/updatePass', AuthController.isOfficerLoggedIn, OfficialController.updatePassword);

router.post('/addVehicle', AuthController.isOfficerLoggedIn, OfficialController.addVehicle);

module.exports = router;