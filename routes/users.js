var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users');
var securityMiddleware = require('../middlewares/security');

const { deleteUser, updateUser } = require('../controllers/users.js');
const { checkAdminPermission } = require('../middlewares/security.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST signup users */ 
router.post('/signup', usersCtrl.signup)

/* GET login details */
router.get('/login', usersCtrl.loginDetails)
router.post("/login", usersCtrl.loginUser);

// Delete user route
router.delete('/user/:email', checkAdminPermission, deleteUser);

// Update user route
router.put('/user/:email', checkAdminPermission, updateUser);

/* GET order details */

router.get('/order', securityMiddleware.checkPermission, usersCtrl.orderDetails)
router.post("/order", securityMiddleware.checkPermission,usersCtrl.createOrder);
/* delete order */
router.delete('/order/:orderId', usersCtrl.deleteOrder);

/* Update order details */
router.patch("/order/:orderId", securityMiddleware.checkAdminPermission,usersCtrl.updateOrder);

// router.put('/order/:orderId', securityMiddleware.checkAdminPermission, usersCtrl.replaceOrder);

/* GET all orders details */

router.post('/orders', securityMiddleware.checkAdminPermission, usersCtrl.allOrderDetails)

/* GET product details */

router.get('/product', usersCtrl.productDetails) //by query
router.get('/products', usersCtrl.allProductDetails) //by query
// router.get('/product/:category', usersCtrl.productDetailsByCategory);
router.post("/product", securityMiddleware.checkAdminPermission,usersCtrl.createProduct);

// router.put('/product', securityMiddleware.checkAdminPermission, usersCtrl.updateProduct);




router.post('/checklogin', securityMiddleware.checkLogin, usersCtrl.checkLogin)
router.post('/checkpermission', securityMiddleware.checkPermission, usersCtrl.checkPermission)

router.post('/edituser', securityMiddleware.checkPermission, usersCtrl.editUser)
router.post('/deleteuser', securityMiddleware.checkPermission, usersCtrl.deleteUser)

router.post('/logout', securityMiddleware.checkPermission, usersCtrl.logoutUser);


module.exports = router;
