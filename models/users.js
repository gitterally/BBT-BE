const daoUser = require("../daos/users");
const utilSecurity = require("../util/security")

module.exports = {
    signup,
    loginDetails,
    loginUser,
    logoutUser
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
      user: user.name,
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