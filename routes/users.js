const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// User kiritamiz MODEL
const User = require("../model/User");

// Registr qismi
router.get("/registr", (req, res) => {
  res.render("register", { title: "Registrasiya sahifasi" });
});

// Registr qismi
router.post("/registr", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody("name", "isim kiritilishi kerak Shart!!").notEmpty();
  req.checkBody("email", "email kiritilishi kerak Shart!!").notEmpty();
  req.checkBody("email", "email Email bolishi shart!!").notEmpty();
  req
    .checkBody("username", "Foydalanuvchi Ismi kiritilishi kerak Shart!!")
    .notEmpty();
  req.checkBody("password", "parol kiritilishi kerak Shart!!").notEmpty();
  req.checkBody("password2", "parol Nogri kelmadi!!").equals(req.body.password);

  //bcrypt js qoshishimiz kerak
  const errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors,
    });
  } else {
    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    bcrypt.genSalt(10, (err, pass) => {
      bcrypt.hash(newUser.password, pass, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            console.log(err);
          } else {
            req.flash("success", "Muofiqatli royhatan otingiz");
            res.redirect("/login");
          }
        });
      });
    });
  }
});

// Registr qismi
router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login sahifasi" });
});



// login qismi  PASSPORT ULAYMIZ
router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",     //  Muofiqatli o'tsak asosiy betga o'tqaz 
        failureRedirect: "/login", // parol noto'g'ri bo'lsa
        failureFlash: true,
    })(req, res, next);

});


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Muafiqatli tizimdan chiqdingiz');
    res.redirect('/login')
})



module.exports = router;
