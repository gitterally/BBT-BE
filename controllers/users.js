const { create } = require("../daos/orders");
const product = require("../daos/product");
const Users = require("../models/users");

module.exports = {
    signup,
    loginDetails,
    loginUser,
    checkLogin,
    checkPermission,
    logoutUser,
    createOrder,
    orderDetails,
    updateOrder,
    productDetails,
    createProduct,
    allProductDetails,
    allOrderDetails,
    updateProduct
}

async function signup(req, res) {
    try {
      const user = await Users.signup(req.body);
      // Always redirect after CUDing data
      // We'll refactor to redirect to the movies index after we implement it
      // res.redirect('/movies/new'); SKIP old code
      res.json(user)
    } catch (err) {
      // Typically some sort of validation error
      console.log(err);
      // res.render('movies/new', { errorMsg: err.message }); SKIP old code
      res.status(500).json({ err });
    }
  }

  async function loginDetails(req, res) {
    try {
      const user = await Users.loginDetails(req.query);
      // Always redirect after CUDing data
      // We'll refactor to redirect to the movies index after we implement it
      // res.redirect('/movies/new'); SKIP old code
      res.json(user)
    } catch (err) {
      // Typically some sort of validation error
      console.log(err);
      // res.render('movies/new', { errorMsg: err.message }); SKIP old code
      res.status(500).json({ err });
    }
  }

  async function loginUser(req, res) {
    try {
        const token = await Users.loginUser(req.body);
        console.log(token);
        if (!token.success) {
          res.status(400).json({errorMsg: token.error})
          return 
        }
        res.json(token.data)
    } catch (err) {
        res.status(500).json({ errorMsg: err.message });
    }
  }

  function checkLogin(req, res) {
    res.json({user: req.user});
  }

  function checkPermission(req, res) {
    res.json({user: req.user, body: req.body.email});
  }

  async function logoutUser(req, res) {
    try {
        const result = await Users.logoutUser(req.body);
        if (!result.success) {
          res.status(400).json({errorMsg: result.error})
          return 
        }
        res.json(result.data)
    } catch (err) {
        res.status(500).json({ errorMsg: err.message });
    }
  }

  async function createOrder(req, res) {
    try {
      // Access the authenticated user information
      const userEmail = req.user.payload.email;
      
      // Combine user information with order data
      const orderData = {
        ...req.body,
        userEmail: userEmail
      };
  
      const order = await Users.createOrder(orderData);
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }

  async function updateOrder(req, res) {

    const { orderId } = req.params;
    const updateData = req.body;

    try {
       const result = await Users.updateOrder(orderId, updateData);
       res.json(result);
     } catch (err) {
       console.log(err);
       res.status(500).json({ error: err.message });
     }
  }

  // async function orderDetails(req, res) {
  //   try {
  //     const order = await Users.orderDetails(req.query);
  //     // Always redirect after CUDing data
  //     // We'll refactor to redirect to the movies index after we implement it
  //     // res.redirect('/movies/new'); SKIP old code
  //     res.json(order)
  //   } catch (err) {
  //     // Typically some sort of validation error
  //     console.log(err);
  //     // res.render('movies/new', { errorMsg: err.message }); SKIP old code
  //     res.status(500).json({ err });
  //   }
  // }

  async function orderDetails(req, res) {
    try {
      // Extract user email from the authenticated user object
      const userEmail = req.user.payload.email;
  
      // Call the orderDetails function with query parameters and user email
      const result = await Users.orderDetails(req.query, userEmail);
  
      // Check the result and send appropriate response
      if (result.success) {
        res.json(result);
      } else {
        // If the order wasn't found or doesn't belong to the user, send a 404 status
        res.status(404).json(result);
      }
    } catch (err) {
      console.error('Error in orderDetails controller:', err);
      res.status(500).json({ 
        success: false, 
        error: 'An error occurred while retrieving order details'
      });
    }
  }
  

  async function productDetails(req, res) {
    try {
      const product = await Users.productDetails(req.query);

      res.json(product)
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
        }
      }


      async function createProduct(req, res) {
        try {
          const product = await daoProduct.create(req.body);
          res.json(product);
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: err.message });
        }
    }

  async function allProductDetails(req, res) {
    try {
      const product = await Users.allProductDetails(req.query);

      res.json(product)
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
        }
      }


  async function allOrderDetails(req, res) {
    try {
      const orders = await Users.allOrderDetails(req.query);

      res.json(orders)
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
        }
      }
    

      async function updateProduct(req, res) {
        try {
          const productId = req.params.productId;
          const updateData = req.body;
          const updatedProduct = await daoProduct.update(productId, updateData);
          res.json(updatedProduct);
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: err.message });
        }
      }