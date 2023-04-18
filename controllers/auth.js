// const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const router = require("../routes/pages");

const connection = require('../connection');
const passenger = require("./passenger");

module.exports = {
    login: async (req, res, next) => {
        try {
            const { role, field, data, password } = req.body;
            console.log(req.body);
            if (!field || !data || !password) {
                return res.status(400).render('login', {
                    message: "Please Fill all Fields Correctly.",
                    type: 'error'
                })
            }
            await connection.query('SELECT * FROM ?? WHERE ?? = ?', [role, field, data], async (err, rows) => {
                // await connection.query('SELECT * FROM passenger WHERE email = ? OR `User_ID`= ?', [email, user_id], async (err, rows) => {
                if(err) throw err;
                console.log(rows);
                let hashedPassword = await bcrypt.hash(password, 8);
                console.log(hashedPassword);
                if (!rows || !await bcrypt.compare(password, rows[0].password)) {
                    res.status(401).render('login', {
                        message: 'Email or Password is incorrect',
                        type: 'error'
                    })
                } else {
                    const id = rows[0].id_no;
                    const name = rows[0].name;
                    const role = req.body.role;
                    const designation = rows[0].designation;
                    const rto = rows[0].rto;
                    const card = rows[0].card_no;
    
                    const token = jwt.sign({ role, id, name, designation, rto, card }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
    
                    console.log("the token is " + token);
    
                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('userSave', token, cookieOptions);
                    if(role == "passenger"){
                        res.status(200).redirect('/passenger/profile')
                    }else if(role == "officer"){
                        res.status(400).redirect('/officer/profile')
                    }
                }
            })
        } catch(err) {
            console.log(err);
            next(err);
        }
    },

    register: async (req, res, next)=>{
        try{
            // console.log(req.body);
            const { f_name, m_name, l_name, email, dob, pob, pincode, address, id_type, id_num, phone, rto, uid, password, passwordConfirm } = req.body;
            await connection.query('SELECT email, user_id from passenger WHERE email = ? OR user_id = ?', [email, uid], async (err, rows) => {
                if (rows.length > 0) {
                    res.render('login', {
                        message: 'User with same Email/User ID already exists. <br/> Please Login.',
                        type: 'error'
                    })
                } else if (password != passwordConfirm) {
                    res.redirect('/register?message=Fill Password Carefully');
                }else{
                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);
                    const name = f_name +" "+ m_name+" "+l_name;

                    connection.query('INSERT INTO `passenger` SET ?', { name: name, 
                        user_id: uid, dob: dob, pob: pob, address: address, pincode: pincode, 
                        id_type: id_type, id_num: id_num, email: email, contact: phone, 
                        password: hashedPassword }, (err, rows) => {
                            if (err) {
                                console.log(err);
                            } else {
                                return res.render("login", {
                                    message: 'User registered Successfully. <br/>Login Now',
                                    type: 'success'
                                });
                            }
                    })
                }
            })
        }catch(err){
            next(err);
        }
    },

    isOfficerLoggedIn: async (req, res, next) => {
        // console.log("Auth/Controller called");
        // console.log(req.cookies.userSave);
        if (req.cookies.userSave) {
            try {
                // 1. Verify the token
                const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                    process.env.JWT_SECRET
                );
                // console.log(decoded);
                if(decoded.role == "officer"){
                    // 2. Check if the user still exist
                    connection.query('SELECT * FROM `officer` WHERE id_no = ?', [decoded.id], (err, rows) => {
                        // console.log(rows);
                        if (!rows) {
                            return next();
                        }
                        req.user = rows[0];
                        req.user.role = "officer";
                        return next();
                    });
                }
            } catch (err) {
                console.log(err)
                return res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    },

    isPassengerLoggedIn: async (req, res, next) => {
        // console.log("Auth/Controller called");
        // console.log(req.cookies.userSave);
        if (req.cookies.userSave) {
            try {
                // 1. Verify the token
                const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                    process.env.JWT_SECRET
                );
                // console.log(decoded);
                if(decoded.role == "passenger"){
                    // 2. Check if the user still exist
                    connection.query('SELECT * FROM passenger WHERE id_no = ?', [decoded.id], (err, rows) => {
                        // console.log(rows);
                        if (!rows) {
                            return next();
                        }
                        req.cookie = decoded;
                        req.user = rows[0];
                        req.user.role = "passenger";
                        return next();
                        // decoded.name, decoded.id
                    });
                }
            } catch (err) {
                console.log(err)
                return res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    },

    logout: (req, res) => {
        res.cookie('userSave', 'logout', {
            expires: new Date(Date.now() + 2 * 1000),
            httpOnly: true
        });
        res.status(200).redirect("/");
    },
}