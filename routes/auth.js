const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

module.exports = router;
