//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const getRndInteger = require('./functions.js').getRndInteger;
const sendSMS = require('./functions.js').sendSMS;

mongoose.connect('mongodb://localhost:27017/bloodDonationDB', {
   useNewUrlParser: true
});

let _phoneNumber = "";
let _code = "";
let _userType = 'S'; // P:patient , D:Donor , A:Admin
let _connected = false;
let _msg = "";
let _msgType = "0";

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
   date: {
      type: Date,
      default: Date.now
   },
   code: String
});
const Message = mongoose.model('Message', {
   message_name: String,
   date: {
      type: Date,
      default: Date.now
   },
   message_content: String
});
const Request = mongoose.model('Request', {
   phoneNumber: String,
   patientState: String,
   cityCode: String,
   bloodType: String,
   date: {
      type: Date,
      default: Date.now
   },
   adress: String
});
/* const UserHistory = mongoose.model('UserHistory', { userId: String,date:String,bloodType:String,cityCode:number,adress:String,code:Number });
 */

app.get("/", function (req, res) {
   res.render('login', {
      _connected: _connected,
      _userType: _userType,
      _msg: _msg,
      _msgType: _msgType,
      _active_page: "/"
   });
   _msgType = "0";

});
app.get("/userprofile", function (req, res) {
   if (_connected === false) {
      _msg = "الرجاء تسجيل دخولك .";
      _msgType = "error";
      res.redirect('/');

   } else {
      res.render("userprofile", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType,
         _msg: _msg,
         _msgType: _msgType,
         _active_page: "userprofile"
      });

   }
   _msgType = "0";
});
app.get("/donorstate", function (req, res) {
   if (_connected === false) {
      _msg = "الرجاء تسجيل دخولك .";
      _msgType = "error";
      res.redirect('/');
   } else {
      res.render("donorstate", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType,
         _msg: _msg,
         _msgType: _msgType,
         _active_page: "donorstate"
      });

   }
   _msgType = "0";
});
app.get("/getcode", function (req, res) {
   res.render("getcode", {
      _connected: _connected,
      _userType: _userType,
      _msg: _msg,
      _msgType: _msgType,
      _active_page: "getcode"
   });
   _msgType = "0";

});
app.get("/logout", function (req, res) {
   _connected = false;
   _msgType = "0";
   res.redirect("/");
});
app.get("/signin", function (req, res) {

   res.render("signin", {
      _connected: _connected,
      _userType: _userType,
      _msg: _msg,
      _msgType: _msgType,
      _active_page: "signin"
   });
   _msgType = "0";

});
app.get("/contactus", function (req, res) {
   res.render("contactus", {
      _connected: _connected,
      _userType: _userType,
      _msg: _msg,
      _msgType: _msgType,
      _active_page: "contactus"
   });
   _msgType = "0";
});

app.get("/addrequest", function (req, res) {
   if (_connected === false) {

      _msg = "الرجاء تسجيل دخولك .";
      _msgType = "error";
      res.redirect('/');

   } else {
      res.render("addrequest", {
         _connected: _connected,
         _phoneNumber: _phoneNumber,
         _userType: _userType,
         _msg: _msg,
         _msgType: _msgType,
         _active_page: "addrequest"
      });
      _msgType = "ff";
   }
   _msgType = "0";
});

/************************    404 ERROR   ********************************* */
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
   _msg = "صفحة غير موجودة";
   _msgType = "error";
   res.status(404).redirect("/");
   _msgType = "0";
});
/************************    POST LOGIN   ********************************* */
app.post("/", function (req, res) {
   _phoneNumber = req.body.tel;
   _code = req.body.code;

   User.findOne({
      phoneNumber: _phoneNumber,
      code: _code
   }, function (err, user) {

      if (err) {
         console.log('error');
      } else if (user) {
         //user authenticated
         _connected = true;
         _userType = user.userType;
         console.log('user.userType :' + _userType);
         if (_userType === 'u') {
            console.log("new user");
            res.redirect('/userprofile');
         } else
         if (_userType === 'd') {
            console.log("donor login.");
            res.redirect('/donorstate');
         } else if (_userType === 'p') {
            console.log("patient login.");
            res.redirect('/addrequest');
         } else {
            console.log("unknow login.");
            res.redirect('/userprofile');
         }

      } else {
         //no user found 
         _msg = "رقم الهاتف غير موجود او رمز الدخول خاطئ.";
         _msgType = "error";
         res.redirect("/");

      }
   });

});

/************************    POST SIGN-IN  ********************************* */

app.post("/signin", function (req, res) {
   _phoneNumber = req.body.tel;
   console.log(_phoneNumber);
   User.find({
      phoneNumber: _phoneNumber
   }, function (err, phoneNumbers) {

      if (err) {
         console.log('find error');
         _msg = "خطأ داخلي ,الرجاء المحاولة لاحقا. ";
         _msgType = "error";
         res.redirect("/signin");
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
         _msg = "لقد تم ارسال رمز الدخول عبر SMS" + _code;
         _msgType = "success";
         res.redirect("/");
         //** */
      } else {
         //user existe 
         _msg = "رقم الهاتف غير موجود ";
         _msgType = "error";
         res.redirect("/signin");

      }
   })

});

/************************    POST GET CODE   ********************************* */
app.post("/getcode", function (req, res) {
   var _phoneNumber = req.body.phoneNumber;
   console.log(_phoneNumber);
   User.findOne({
      phoneNumber: _phoneNumber
   }, function (err, phoneNumber) {

      if (err) {
         console.log('find error');
         _msg = "خطأ داخلي ,الرجاء المحاولة لاحقا. ";
         _msgType = "error";
         res.redirect("/getcode");
      }
      if (!phoneNumber) {
         // no phone numbers founed
         _msg = "رقم الهاتف غير موجود ";
         _msgType = "error";
         res.redirect("/getcode");
         //** */
      } else {
         //user existe 
         sendSMS(_phoneNumber, phoneNumber.code);
         //send the code
         _msg = "لقد تم ارسال رمز الدخول عبر SMS";
         _msgType = "success";
         res.redirect("/");

      }
   })

});
/************************    POST ADD REQUEST   ********************************* */
app.post("/addrequest", function (req, res) {
   let _patientState = req.body.PatientState;
   let _adress = req.body.adress;
   let _cityCode = req.body.cityCode;
   let _bloodType = req.body.bloodType;

   console.log(_patientState + ' ' + _adress + ' ' + _cityCode + ' ' + _bloodType + ' ' + _phoneNumber);
   //create a user account
   const pRequest = new Request({
      patientState: _patientState,
      adress: _adress,
      cityCode: _cityCode,
      bloodType: _bloodType,
      phoneNumber: _phoneNumber
   });

   pRequest.save().then(() => console.log('patient request added successfully!'));
   //send the code
   _msg = "لقد تم اضافة طلبكم بنجاح";
   _msgType = "success";
   res.redirect("/addrequest");

});

/************************   POST USER PROFILE  ********************************* */
app.post("/userprofile", function (req, res) {
   _userType = req.body.userType;
   _bloodType = req.body.bloodType;
   _cityCode = req.body.cityCode;
   console.log(_userType + ' ' + _bloodType + ' ' + _cityCode);

   User.update({
      phoneNumber: _phoneNumber
   }, {
      userType: _userType,
      bloodType: _bloodType,
      cityCode: _cityCode
   }, function (err, affected, resp) {
      if (err) {
         _msg = "خطأ اثنا التحديث";
         _msgType = "error";
         res.redirect("/userprofile");
      } else {
         _msg = "تم التعديل بنجاح.";
         _msgType = "success";

         if (_userType === 'p') {
            console.log('patient request');
            res.redirect("/addrequest");

         } else if (_userType === 'd') {
            console.log('donor request');
            res.redirect("/donorstate");
         } else if (_userType === 'a') {
            console.log('admin request');
            res.redirect("/admin");
         } else {
            /**admin */
            console.log('err request');
            res.redirect("/");
         }

      }
   });

});

/************************    POST CONTACT-US   ********************************* */

app.post("/contactus", function (req, res) {
   _message_name = req.body.name;
   _message_content = req.body.content;
   console.log(_message_name + ' ' + _message_content);
   //create a user account
   const message = new Message({
      message_name: _message_name,
      message_content: _message_content
   });

   message.save().then(() => console.log('message  added successfully!'));
   //send the code
   _msg = "شكرا لتواصلك معنا";
   _msgType = "success";
   res.redirect("/");

});
/************************    LISTEN   ********************************* */

app.listen(process.env.PORT || 3000, function (req, res) {
   console.log('Server Starting at port 3000');
});