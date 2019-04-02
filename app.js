//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const getRndInteger = require('./functions.js').getRndInteger;

mongoose.connect('mongodb://localhost:27017/bloodDonationDB', {
   useNewUrlParser: true
});

let _phoneNumber = "";
let _code = "";
let _newUser = true;
let _userType = 'S'; // P:patient , D:Donor , A:Admin
let _connected = false;
let _msg = "الرجاء تسجيل دخولك .";
let _msgType = "offline";

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

const User = mongoose.model('User', {
   phoneNumber: String,
   userType: String,
   bloodType: String,
   cityCode: String,
   adress: String,
   code: String
});
/* const UserHistory = mongoose.model('UserHistory', { userId: String,date:String,bloodType:String,cityCode:number,adress:String,code:Number });
 */

app.get("/", function (req, res) {
   res.render('login', {
      _connected: _connected,
      _userType: _userType
   });
});
app.get("/userprofile", function (req, res) {
   if (_connected === false) {
      res.render("login", {
         _connected: _connected,
         _userType: _userType
      });
   } else {
      res.render("userprofile", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType
      });
   }
});
app.get("/donorstate", function (req, res) {
   if (_connected === false) {
      res.render("login", {
         _connected: _connected,
         _userType: _userType
      });
   } else {
      res.render("donorstate", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType
      });
   }
});
app.get("/getcode", function (req, res) {
   res.render("getcode", {
      _connected: _connected,
      _userType: _userType
   });

});
app.get("/logout", function (req, res) {
   _connected = false;
   res.redirect("/");
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
app.get("/message", function (req, res) {
   res.render("message", {
      _connected: _connected,
      _userType: _userType,
      _msg: _msg,
      _msgType: _msgType
   });
});
app.get("/addrequest", function (req, res) {
   if (_connected === false) {
      res.render("login", {
         _connected: false,
         _userType: _userType
      });
   } else {
      res.render("addrequest", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType
      });
   }
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
   /*    res.status(404).render('404_error_template', {
         title: "Sorry, page not found"
      }); */

   _msg = "صفحة غير موجودة";
   _msgType = "error";
   res.status(404).redirect("/message");
});

app.post("/userprofile", function (req, res) {
   _userType = req.body.userType;
   _bloodType = req.body.bloodType;
   _cityCode = req.body.city;
   console.log(_userType + ' ' + _bloodType + ' ' + _cityCode);

   User.update({
      phoneNumber: _phoneNumber
   }, {
      userType: _userType,
      bloodType: _bloodType,
      cityCode: _cityCode
   }, function (err, affected, resp) {
      console.log(resp);
   })

   if (_userType === 'p') {
      console.log('patient request');
      res.redirect("/addrequest");

   } else if (_userType === 'd') {
      console.log('donor request');
      res.redirect("/donorstate");
   } else {
      /**admin */
      console.log('admin request');
      res.redirect("/");
   }

});
app.post("/signin", function (req, res) {
   _phoneNumber = req.body.tel;
   console.log(_phoneNumber);
   User.find({
      phoneNumber: _phoneNumber
   }, function (err, phoneNumbers) {

      if (err) {
         console.log('find error');
      }
      if (!phoneNumbers.length) {
         // no phone numbers founed

         //generate random number 
         let _code = getRndInteger(1000, 9999);
         console.log("random number:" + _code);

         //create a user account
         const user = new User({
            phoneNumber: _phoneNumber,
            code: _code,
            userType: 'u'
         });

         user.save().then(() => console.log('user added successfully!'));
         //send the code
         _msg = "we send you a code,use it to access";
         _msgType = "success";
         res.redirect("/message");
         //** */
      } else {
         //user existe 
         _msg = "user phone number exist!";
         _msgType = "error";
         res.redirect("/message");

      }
   })

});
app.post("/addrequest", function (req, res) {
   //_regTel = req.body.tel;
   //console.log(_phoneNumber);
   _msg = "لقد تم استقبال طلبكم بنجاح";
   _msgType = "success";
   res.redirect("/message");
});

app.post("/", function (req, res) {
   _phoneNumber = req.body.tel;
   _code = req.body.password;

   User.findOne({
      phoneNumber: _phoneNumber,
      code: _code
   }, function (err, user) {

      if (err) {
         console.log('error');
      } else if (user) {
         //user authenticated
         _connected = true;
         console.log('user.userType :' + user.userType);
         if (user.userType === 'u') {
            console.log("new user");
            res.redirect('/userprofile');
         } else
         if (user.userType === 'd') {
            console.log("donor login.");
            res.redirect('/donorstate');
         } else if (user.userType === 'p') {
            console.log("patient login.");
            res.redirect('/addrequest');
         } else {
            console.log("unknow login.");
            res.redirect('/userprofile');
         }

      } else {
         //no user found 
         console.log(_phoneNumber + '  ' + _code);
         console.log(user.phoneNumber + '  ' + user.code);

         _msg = "user phone number not exist!";
         _msgType = "error";
         res.redirect("/message");

      }
   });

});

app.listen(3000, function (req, res) {
   console.log('Server Starting at port 3000');

});