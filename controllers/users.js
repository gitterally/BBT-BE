const Users = require("../models/users");

module.exports = {
    signup,
    loginDetails,
    loginUser,
    checkLogin,
    checkPermission,
    logoutUser
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
  