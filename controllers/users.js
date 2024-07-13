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
    updateUser,
    deleteUser,
    createOrder,
    orderDetails,
    productDetails,
    createProduct,
    allProductDetails,
    deleteOrder
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

  // Function to delete a user
async function deleteUser(req, res) {
  try {
    const { email } = req.params; // Assuming email is passed as a URL parameter
    await deleteUserByEmail(email);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

// Function to update a user
async function updateUser(req, res) {
  try {
    const { email } = req.params; // Assuming email is passed as a URL parameter
    const updateData = req.body; // Assuming the new user data is passed in the request body
    await updateUserByEmail(email, updateData);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
      const product = await Users.createProduct(req.body);
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

async function deleteOrder(req, res) {
  try {
    const userEmail = req.user.payload.email; // Assuming req.user contains authenticated user info
    const orderId = req.params.orderId; // Assuming the order ID is passed as a URL parameter

    const result = await Users.deleteOrder(orderId, userEmail);
    res.json(result);
  } catch (err) {
    console.error('Error in deleteOrder controller:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}