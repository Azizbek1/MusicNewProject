const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const db2 = require("../cf/db");

module.exports = (passport) => {
  passport.use(
    new localStrategy((username, password, done) => {
      let a = { username: username };
      User.findOne(a, (err, user) => {
        if (err) console.log(err);
        if (!user) {
          done(null, false, { message: `Foydalanuvchi topilmadi` });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            done(null, user);
          } else {
            done(null, false, { message: "Notogri parol" });
          }
        });
      });
    })
  );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
        done(err, user);
        });
    });
    
};
