const daoUser = require("../daos/users");
const utilSecurity = require("../util/security")
const daoOrder = require("../daos/orders");
const daoProduct =  require("../daos/product");

module.exports = {
    signup,
    loginDetails,
    loginUser,
    logoutUser,
    createOrder,
    orderDetails,
}

// [a,b,c] vs {a:a, b:b, c:c} 
// => list.filter(a) // go through all 
// object.find(a) // only check the a drawer
// usertypes ("admin", "normal")
// admin -> list of admins

async function signup(body) {
    //
    const user = await daoUser.findOne({"email": body.email});
    console.log(user);
    if (user) {
      return {success: false, error: "user already exist"};
    }
    const newUser = await daoUser.create(body);
    return {success: true, data: newUser};
  }

async function loginDetails(body) {
    //
    const loginDetailsSchema = {
      "email": 1,
      "salt": 1,
      "iterations": 1
    }
    console.log(body.email)
    const user = await daoUser.findOne({"email": body.email}, loginDetailsSchema);

    console.log(user);
    return {success: true, data: user};
  }

  async function loginUser(body) {
    if (!body.hasOwnProperty("email")) {
      return {success: false, error: "missing email"};
    }
    if (!body.hasOwnProperty("password")) {
      return {success: false, error: "missing password"};
    }
  
    const user = await daoUser.findOne({"email": body.email, "password": body.password});
    if (user == null || Object.keys(user).length == 0) {
      return {success: false, error: "Invalid email/password"};
    }

    const jwtPayload = {
      user: user.firstName,
      email: user.email,
      is_admin: user.is_admin
    };
    const token = utilSecurity.createJWT(jwtPayload);
    const expiry = utilSecurity.getExpiry(token);
    await daoUser.updateOne({"email": body.email}, {token: token, expire_at: expiry})
    return {success: true, data: token}
  }

  async function logoutUser(body) {
    if (!body.hasOwnProperty('email')) {
      return {success: false, error: "missing email"};
    }
    await daoUser.updateOne({"email": body.email}, {token: null, expire_at: null})
    return {success: true, data: "logout successful!"}
  }

  // async function createOrder(body) {
  //   const order = await daoOrder.findOne({"order": body.orderID});
  //   console.log(order);
  //   if (order) {
  //     return {success: false, error: "order already exist"};
  //   }
  //   const newOrder = await daoOrder.create(body);
  //   return {success: true, data: newOrder};
  // }

  async function createOrder(orderData) {
    try {
      console.log(orderData);
      const { userEmail, ...orderDetails } = orderData;

  
      // Check if the order already exists
      const existingOrder = await daoOrder.findOne({ orderID: orderDetails.orderID });
  
      if (existingOrder) {
        throw new Error('Order already exists');
      }
  
      // Create the order
      const newOrder = await daoOrder.create(orderDetails);
  
      // Find the user by email
      const user = await daoUser.findOne({ email: userEmail });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Attach the created order's ID to the user and update the user
      user.order.push(newOrder._id);
      await user.save();
  
      // Return the new order
      return { success: true, data: newOrder };
    } catch (err) {
      console.error('Error creating order:', err);
      return { success: false, error: err.message };
    }
  }


// Function to get order details
// async function orderDetails(body) {
//   const orderDetailsSchema = {
//       "order": 1,
//       "comment": 1,
//   };

//   const order = await daoOrder.findOne({ "order": body.order }, orderDetailsSchema).populate({
//       path: 'drinks.mainProduct',
//       select: 'name category price inStock'
//   }).populate({
//       path: 'drinks.toppings.topping',
//       select: 'name category price inStock'
//   });

//   if (!order) {
//       return { success: false, error: "Order not found" };
//   }

//   return { success: true, data: order };
// }

async function orderDetails(body, userEmail) {
  const orderDetailsSchema = {
    "orderID": 1,
    "comment": 1,
    "total": 1,
    "status": 1,
    "created_at": 1,
    "expire_at": 1,
    "is_paid": 1,
    "drinks.mainProduct": 1,
    "drinks.toppings.topping": 1,
    "drinks.toppings.quantity": 1,
  };

  try {
    // First, find the user by email
    const user = await daoUser.findOne({ email: userEmail });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the order that belongs to the user
    const order = await daoOrder.findOne({ 
      "order": body.order,
      "_id": { $in: user.order } // Assuming user.order is an array of order IDs
    }, orderDetailsSchema).populate({
      path: 'drinks.mainProduct',
      select: 'name category price inStock',
      options: { strictPopulate: false }
    }).populate({
      path: 'drinks.toppings.topping',
      select: 'name category price inStock',
      options: { strictPopulate: false }
    });

    if (!order) {
      return { success: false, error: "Order not found or does not belong to the user" };
    }

    return { success: true, data: order };
  } catch (err) {
    console.error('Error retrieving order details:', err);
    return { success: false, error: "An error occurred while retrieving order details" };
  }
}

