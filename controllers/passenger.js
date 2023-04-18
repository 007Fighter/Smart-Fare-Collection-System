const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const dotenv = require("dotenv");
dotenv.config({path: './config.env'})

const connection = require('../connection');

module.exports = {
    updatePassProfile: async (req, res, next)=>{
        try{
            var { name, address, pincode, email, phone, rto, uid} = req.body;
            const user = req.user;
            console.log(req.body);            
            if(name == null || name == ""){
                name = user.name;
            }if(address == null || address == ""){
                address = user.address;  
            }if(pincode == null || pincode == ""){
                pincode = user.pincode;  
            }if(email == null || email == ""){
                email = user.email;  
            }if(phone == null || phone == ""){
                phone = user.contact;  
            }if(rto == null || rto == ""){
                rto = user.rto_id;  
            }if(uid == null || uid == ""){
                uid = user.user_id;  
            }
            await connection.query('UPDATE `passenger` SET ? WHERE id_no = ?', [{ name: name, 
                address: address, pincode: pincode, email: email, 
                contact: phone, rto_id: rto, user_id: uid }, user.id_no],  (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return res.redirect("/passenger/profile");
                    }
            })
        }catch(err) {
            console.log(err);
            return next();
        }
    },
    updatePassword: async (req, res, next) => {
        try{
            const {password, passwordConfirm} = req.body;
            await connection.query('SELECT * from `passenger` WHERE user_id = ?', req.user.user_id, async (err, rows) => {
                if (rows.length > 0 && password == passwordConfirm) {
                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);
                    await connection.query('UPDATE `passenger` SET password = ? WHERE user_id = ?', 
                            [hashedPassword, req.user.user_id],  (err, rows) => {
                            if (err) throw err;
                            else{
                                res.redirect('/auth/logout');
                                // .alert("Password Updated Successfully.");
                            }
                    })
                }else {
                    var message= "Your Wallet is Currently Inactive.";
                    return res.redirect('/passenger/addToken').flash(message);
                }
            })
        }catch (err){
            console.log(err);
            return next();
        }
    },
    addToken: async (req, res, next)=>{
        try{
            const uid = req.user.user_id;
            const tokens = Number(req.body.tokens);
            await connection.query('SELECT * from `wallet` WHERE passengeruser_id = ? ORDER BY time DESC', uid, async (err, rows) => {
                if (rows.length > 0 && rows[0].status == 1) {
                    var balance = Number(rows[0].balance) + tokens;
                    await connection.query('INSERT INTO `wallet` SET ?', { trans_type: "Deposited", 
                        amount: tokens, balance: balance, status: rows[0].status, passengeruser_id: uid, 
                        passengeremail: req.user.email, card_no: req.user.card_no },  (err, rows) => {
                            if (err) throw err;
                            else{
                                res.redirect('/passenger/wallet');
                            }
                    })
                }else {
                    var message= "Your Wallet is Currently Inactive.";
                    return res.redirect('/passenger/addToken');
                    // .flash(message);
                }
            })
        }catch(err) {
            console.log(err);
            return next();
        }
    },
}