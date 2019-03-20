//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");

let _tel = "+213-777-777-777";
let _password = "0000";
let _newUser = true;
let _userType = 'P'; // P:patient , D:Donor , A:Admin
let _connected = false;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
   res.render('login', {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/userprofile", function (req, res) {
   res.render("userprofile", {
      _connected: _connected,
      _tel: _tel,
      _userType: _userType
   });
});
app.get("/donorstate", function (req, res) {
   res.render("donorstate", {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/getcode", function (req, res) {
   res.render("getcode", {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/signin", function (req, res) {
   res.render("signin", {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/contactus", function (req, res) {
   res.render("contactus", {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/addrequest", function (req, res) {
   res.render("addrequest", {
      _connected: _connected,
      _tel: _tel,
      _userType: _userType
   });
});

app.post("/userprofile", function (req, res) {
   _userType = req.body.userType;
   _bloodType = req.body.bloodType;
   _wilaya = req.body.wilaya;
   console.log(_userType + ' ' + _bloodType + ' ' + _wilaya);

   /*userType: D
   bloodType: A
   wilaya: 01*/
   if (_userType === 'P') {
      console.log('patient request');
      res.redirect("/addrequest");

   } else if (_userType === 'D') {
      console.log('donor request');
      res.redirect("/donorstate");
   } else {
      /**admin */
      console.log('admin request');
   }

});

app.post("/", function (req, res) {
   let tel = req.body.tel;
   let password = req.body.password;
   console.log(tel + ' ' + password);

   if ((_tel === tel) && (_password === password)) {

      _connected = true;
      if (_newUser) {
         console.log("new user");
         res.redirect('/userprofile');
      } else {
         if (_userType === 'donor') {
            console.log("donor login.");
            res.redirect('/donorstate');
         } else {
            console.log("patient login.");
            res.redirect('/addrequest');
         }
      }

   } else {
      console.log("error.");
      res.redirect("/");
   }

});

app.listen(3000, function (req, res) {
   console.log('Server Starting at port 3000');

});