//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require('path');

const _tel = "+213(7) 77-77-77-77";
const _password = "0000";
const _captcha = "0";
const _newUser = false;
const _userType = 'patient';
let _connected = false;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.render('index', { _connected: _connected, _userType: _userType });
});
app.get("/userprofile.html", function (req, res) {
    res.render("userprofile", { _connected: _connected, _userType: _userType });
});
app.get("/donorstate.html", function (req, res) {
    res.render("donorstate", { _connected: _connected, _userType: _userType });
});
app.get("/getcode.html", function (req, res) {
    res.render("getcode", { _connected: _connected, _userType: _userType });
});
app.get("/signin.html", function (req, res) {
    res.render("signin", { _connected: _connected, _userType: _userType });
});
app.get("/contactus.html", function (req, res) {
    res.render("contactus", { _connected: _connected, _userType: _userType });
});
app.get("/addrequest.html", function (req, res) {
    res.render("addrequest", { _connected: _connected, _userType: _userType });
});

app.post("/", function (req, res) {
    let tel = req.body.tel;
    let password = req.body.password;
    let captcha = req.body.captcha;
    console.log(tel + ' ' + password + ' ' + captcha);

    if ((_tel === tel) && (_password === password)) {

        /**************************** * /


        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({ "responseError": "Please select captcha first" });
        }
        const secretKey = "6LcDZpgUAAAAAE9L-G2KGIqAaqcGuP6kVKE9KKFt";

        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

        request(verificationURL, function (error, response, body) {
            body = JSON.parse(body);

            if (body.success !== undefined && !body.success) {
                return res.json({ "responseError": "Failed captcha verification" });
            }
            res.json({ "responseSuccess": "Sucess" });
        });
        /**************************** */


        _connected = true;
        if (_newUser) {
            console.log("new user");
            res.redirect('/userprofile.html');
        }
        else {
            if (_userType === 'donor') {
                console.log("donor login.");
                res.redirect('/donorstate.html');
            }
            else {
                console.log("patient login.");
                res.redirect('/addrequest.html');
            }
        }
    } else {
        console.log("error.");
        res.redirect("/");
    }


    app.post('/', function (req, res) {

    });




});

app.listen(3000, function (req, res) {
    console.log('Server Starting at port 3000');

});

