//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const _tel = "+213(7) 77-77-77-77";
const _password = "0000";
const _captcha = "0";
const _newUser = true;
const _userType = 'donor';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.render("index");
});
app.get("/userprofile.html", function (req, res) {
    res.render("userprofile");
});
app.get("/donorprofile.html", function (req, res) {
    res.render("donorprofile");
});
app.get("/getcode.html", function (req, res) {
    res.render("getcode");
});
app.get("/signin.html", function (req, res) {
    res.render("signin");
});
app.get("/contactus.html", function (req, res) {
    res.render("contactus");
});
app.get("/addrequest.html", function (req, res) {
    res.render("addrequest");
});

app.post("/", function (req, res) {
    let tel = req.body.tel;
    let password = req.body.password;
    let captcha = req.body.captcha;
    console.log(tel + ' ' + password + ' ' + captcha);

    if ((_tel === tel) && (_password === password) && (_captcha === captcha)) {

        if (_newUser) {
            console.log("new user");
            res.redirect('/userprofile.html');
        }
        else {
            if (_userType === 'donor') {
                console.log("donor login.");
                res.redirect('/donorprofile.html');
            }
            else {
                console.log("patient login.");
                res.redirect('/patientprofile.html');
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

