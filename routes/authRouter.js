var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const refreshController = require('../controllers/refreshTokenController');

//router.get('/login', mainController.login);
router.post('/login', authController.handleLogin);
//router.get('/register', mainController.registerform);
router.post('/register', authController.handleRegister);
router.get('/refresh', refreshController);
router.get('/logout', authController.handleLogout);

module.exports = router;