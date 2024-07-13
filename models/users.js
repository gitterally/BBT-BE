const daoUser = require("../daos/users");
const utilSecurity = require("../util/security");
const daoOrder = require("../daos/orders");
const daoProduct = require("../daos/product");
const crypto = require("crypto");

module.exports = {
  signup,
  loginDetails,
  loginUser,
  logoutUser,
  deleteUserByEmail,
  updateUserByEmail,
  createOrder,
  orderDetails,
  productDetails,
  createProduct,
  allProductDetails,
  deleteOrder,
};

// [a,b,c] vs {a:a, b:b, c:c}
// => list.filter(a) // go through all
// object.find(a) // only check the a drawer
// usertypes ("admin", "normal")
// admin -> list of admins

function generateUniqueOrderID() {
  const date = new Date();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const SSS = String(date.getMilliseconds()).padStart(3, "0");

  const formattedDate = `${MM}${DD}${SSS}`;
  const randomString = crypto.randomBytes(2).toString("hex"); // Generates a 4-character hex string
  return `${formattedDate}${randomString}`;
}

async function signup(body) {
  //
  const user = await daoUser.findOne({ email: body.email });
  console.log(user);
  if (user) {
    return { success: false, error: "user already exist" };
  }
  const newUser = await daoUser.create(body);
  return { success: true, data: newUser };
}

async function loginDetails(body) {
  //
  const loginDetailsSchema = {
    email: 1,
    salt: 1,
    iterations: 1,
  };
  console.log(body.email);
  const user = await daoUser.findOne({ email: body.email }, loginDetailsSchema);

  console.log(user);
  return { success: true, data: user };
}

async function loginUser(body) {
  if (!body.hasOwnProperty("email")) {
    return { success: false, error: "missing email" };
  }
  if (!body.hasOwnProperty("password")) {
    return { success: false, error: "missing password" };
  }

  const user = await daoUser.findOne({
    email: body.email,
    password: body.password,
  });
  if (user == null || Object.keys(user).length == 0) {
    return { success: false, error: "Invalid email/password" };
  }

  const jwtPayload = {
    user: user.firstName,
    email: user.email,
    is_admin: user.is_admin,
  };
  const token = utilSecurity.createJWT(jwtPayload);
  const expiry = utilSecurity.getExpiry(token);
  await daoUser.updateOne(
    { email: body.email },
    { token: token, expire_at: expiry }
  );
  return { success: true, data: token };
}

async function logoutUser(body) {
  if (!body.hasOwnProperty("email")) {
    return { success: false, error: "missing email" };
  }
  await daoUser.updateOne(
    { email: body.email },
    { token: null, expire_at: null }
  );
  return { success: true, data: "logout successful!" };
}

async function deleteUserByEmail(email) {
  const result = await daoUser.deleteOne({ email: email });
  return result;
}

async function updateUserByEmail(email, updateData) {
  const result = await daoUser.updateOne({ email: email }, { $set: updateData });
  return result;
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

    // Generate a unique order ID
    orderDetails.orderID = await generateUniqueOrderID();
    console.log(orderDetails);

    // Check if the order already exists
    // const existingOrder = await daoOrder.findOne({ orderID: orderDetails.orderID });

    // if (existingOrder) {
    //   throw new Error('Order already exists');
    // }

    // Create the order
    const newOrder = await daoOrder.create(orderDetails);

    // Find the user by email
    const user = await daoUser.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    // Attach the created order's ID to the user and update the user
    user.order.push(newOrder._id);
    await user.save();

    // Return the new order
    return { success: true, data: newOrder };
  } catch (err) {
    console.error("Error creating order:", err);
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
    orderID: 1,
    comment: 1,
    total: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
    created_at: 1,
    expire_at: 1,
    is_paid: 1,
    "drinks.mainProduct": 1,
    "drinks.quantity": 1,
    "drinks.toppings.topping": 1,
    "drinks.toppings.quantity": 1,
    "drinks.comment": 1,
  };

  try {
    // First, find the user by email
    const user = await daoUser.findOne({ email: userEmail });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the order that belongs to the user
    const order = await daoOrder
      .find(
        {
          _id: { $in: user.order }, // Assuming user.order is an array of order IDs
        },
        orderDetailsSchema
      )
      .populate({
        path: "drinks.mainProduct",
        select: "name category price inStock",
        options: { strictPopulate: false },
      })
      .populate({
        path: "drinks.toppings.topping",
        select: "name category price inStock",
        options: { strictPopulate: false },
      });

    if (!order) {
      return {
        success: false,
        error: "Order not found or does not belong to the user",
      };
    }

    return { success: true, data: order };
  } catch (err) {
    console.error("Error retrieving order details:", err);
    return {
      success: false,
      error: "An error occurred while retrieving order details",
    };
  }
}

async function deleteOrder(orderId, userEmail) {
  try {
    // Assuming there's a way to check if a user is an admin
    const user = await daoUser.findOne({ email: userEmail });
    if (!user || !user.isAdmin) {
      throw new Error('Unauthorized: Only admin users can delete orders');
    }

    return await daoOrder.deleteOrderById(orderId);
  } catch (err) {
    console.error('Error deleting order:', err);
    return { success: false, error: err.message };
  }
}

async function createProduct(body) {
  const product = await daoProduct.findOne({ name: body.name });
  if (product) {
    return { success: false, error: "product already exist" };
  }
  const newProduct = await daoProduct.create(body);
  return { success: true, data: newProduct };
}

async function productDetails(body) {
  const productDetailsSchema = {
    name: 1,
    price: 1,
    category: 1,
    inStock: 1,
  };
  const product = await daoProduct.findOne(
    { name: body.name },
    productDetailsSchema
  );
  if (!product) {
    return { success: false, error: "Product not found" };
  }
  return { success: true, data: product };
}

async function allProductDetails() {
  const productDetailsSchema = {
    name: 1,
    price: 1,
    category: 1,
    inStock: 1,
  };

  const products = await daoProduct.find({}, productDetailsSchema);

  if (!products || products.length === 0) {
    return { success: false, error: "No products found" };
  }

  return { success: true, data: products };
}

