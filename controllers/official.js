const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const connection = require("../connection");

const dotenv = require("dotenv");
dotenv.config({path: './config.env'})

require('../connection');

module.exports = {
    assignCard: async(req, res, next) => {
        try{
            const {uid, card_no} = req.body;
            await connection.query('SELECT `card_no` from `passenger` WHERE `card_no` = ?', card_no, async (err, rows) => {
                if (rows.length > 0) {
                    return res.render('assign_card', {
                        user: req.user,
                        message: 'Card already exists.',
                        type: 'error'
                    })
                }else{
                    connection.query('UPDATE `passenger` SET ? WHERE `user_id` = ?', 
                        [{card_no: card_no, status: "1" }, uid], (err, rows) => {
                        connection.query('INSERT INTO `wallet` SET ?', {card_no: card_no, 
                            trans_type: "Opened", amount: "0", balance: "0", status: "1", user_id: uid}, (err, rows) => {
                            if (err) throw err;
                            return res.redirect('/officer/activePass');
                        })
                        if (err) throw err;
                    })
                }
            })
        }catch (err){
            console.log(err);
            return next();
        }
    },
    addPassProfile: async(req, res, next) => {
        try{
            const { f_name, m_name, l_name, email, dob, pob, pincode, address, id_type, id_num, phone, uid, password, passwordConfirm } = req.body;
            await connection.query('SELECT * from `passenger` WHERE email = ? OR user_id = ? OR id_num = ?', [email, uid, id_num], async (err, rows) => {
                if (rows.length > 0) {
                    return res.render('passenger_finder', {
                        user: req.user,
                        passengers : rows
                    })
                } else if (password != passwordConfirm) {
                    res.render('addPass', {
                        user: req.user,
                        message : "Passwords does not match."
                    })
                }else{
                    const name = f_name+" "+m_name+" "+l_name;
                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);
                    connection.query('INSERT INTO `passenger` SET ?', { name: name, 
                        user_id: uid, dob: dob, pob: pob, address: address, pincode: pincode, 
                        id_type: id_type, id_num: id_num, email: email, contact: phone, 
                        rto_id: req.user.rto_id, password: hashedPassword }, (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else {
                                return res.redirect('/officer/freshPass');
                            }
                    })
                }
            })
        }catch (err) {
            return next();
        }
    },
    editPassProfile: async (req, res)=>{
        try{
            const {field, data} = req.body;
            connection.query("SELECT user_id FROM passenger WHERE ?? = ?", [field, data], (err, rows) => {
                if(err) throw err;
                if(rows.length >0){
                    res.redirect("/officer/editPass/"+rows[0].user_id)
                }else{
                    res.render("select_edit_passenger",{
                            user : req.user,
                            message: 'Email or User ID does not exist',
                            type: 'error'
                    })
                }
            })
        }catch(err) {
            console.log("Error Occured.");
            return next();
        }
    },
    updatePassProfile: async (req, res)=>{
        try{

        }catch(err) {
            return next();
        }
    },
    updatePassword: async (req, res, next) => {
        try{
            const {password, passwordConfirm} = req.body;
            await connection.query('SELECT * from `officer` WHERE user_id = ?', req.user.user_id, async (err, rows) => {
                if (rows.length > 0 && password == passwordConfirm) {
                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);
                    await connection.query('UPDATE `officer` SET password = ? WHERE user_id = ?', 
                            [hashedPassword, req.user.user_id],  (err, rows) => {
                            if (err) throw err;
                            else{
                                res.redirect('/auth/logout');
                                // .alert("Password Updated Successfully.");
                            }
                    })
                }else {
                    var message= "Enter Passwords Correctly";
                    return res.render('/officer/updatePassword').flash(message);
                }
            })
        }catch (err){
            console.log(err);
            return next();
        }
    },
    addVehicle: async(req, res, next) => {
        try{
            const {vehicle_num, mcu_num, owner_name, driver_name, owner_contact, driver_contact} = req.body;
            let sql = 'SELECT vehicle_no, board_mac_no from `vehicle` WHERE vehicle_no = ? OR board_mac_no = ?';
            await connection.query(sql, [vehicle_num, mcu_num], async (err, rows) => {
                if (rows.length > 0) {
                    console.log(rows);
                    res.render('add_vehicle', {
                        user : req.user,
                        message: 'User with same Email/User ID already exists. <br/> Please Login.',
                        type: 'error'
                    })
                } else{
                    connection.query('INSERT INTO `vehicle` SET ?', { vehicle_no: vehicle_num, 
                        board_mac_no: mcu_num, rto_id: req.user.rto_id, owner_name: owner_name, owner_contact: owner_contact, 
                        driver_name: driver_name, driver_contact: driver_contact}, (err, rows) => {
                            if (err) throw err;
                            return res.redirect('/officer/registeredVehicle')
                    })
                }
            })
        }catch (err){
            return next();
        }
    }
}