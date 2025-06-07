const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res,next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  if (res.locals.redirecturl) {
    return res.redirect(res.locals.redirecturl);
  }
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "you are logout");
    res.redirect("/listings");
  });
};
