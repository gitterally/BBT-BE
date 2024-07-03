var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users');
var securityMiddleware = require('../middlewares/security');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST signup users */ 
router.post('/signup', usersCtrl.signup)

/* GET login details */
router.get('/login', usersCtrl.loginDetails)
router.post("/login", usersCtrl.loginUser);

router.post('/checklogin', securityMiddleware.checkLogin, usersCtrl.checkLogin)
router.post('/checkpermission', securityMiddleware.checkPermission, usersCtrl.checkPermission)

router.post('/logout', securityMiddleware.checkPermission, usersCtrl.logoutUser);

module.exports = router;
