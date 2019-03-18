/***** phone number mask *****************/

$(window).load(function () {
    var phones = [{ "mask": "+\\2\\13(*) ##-##-##-##" }, { "mask": "+213(*) ##-##-##-##" }];
    $('#tel').inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1 }, '*': { validator: "[5-7]", cardinality: 1 } }
    });
});

/*****************************************/
var currentValue = "";
function handleClick(myRadio) {
    //alert('Old value: ' + currentValue);
    //alert('New value: ' + myRadio.value);
    currentValue = myRadio.value;
}

/************* captcha *******************/
var captcha;

function generateCaptcha() {
    var a = Math.floor((Math.random() * 10));
    var b = Math.floor((Math.random() * 10));
    var c = Math.floor((Math.random() * 10));
    var d = Math.floor((Math.random() * 10));

    captcha = a.toString() + b.toString() + c.toString() + d.toString();

    document.getElementById("captcha").value = captcha;
}

function check() {
    var input = document.getElementById("inputText").value;

    if (input == captcha) {
        alert("Equal");
    }
    else {
        alert("Not Equal");
    }
}
/*************************************** */