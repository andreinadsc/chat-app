const express = require('express');

const userValidator = require('../validators/user');
const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/signup', userValidator.signup, userController.postSignup);

router.post('/login', userValidator.login, userController.postLogin);

router.post('/logout', userController.postLogout);

router.post('/password', userValidator.resetPassword, userController.resetPassword);

router.get('/', isAuth, userController.getAllUsers);

router.put('/update', isAuth, userController.updateUser);

module.exports = router;