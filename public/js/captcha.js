// captcha initial setup
var allowSubmit = false;
var myCaptcha = new jCaptcha({

    // set callback function
    callback: function (response, $captchaInputElement) {

        if (response == 'success') {

            $captchaInputElement[0].classList.remove('error');
            $captchaInputElement[0].classList.add('success');
            $captchaInputElement[0].placeholder = 'Submit successful!';
            allowSubmit = true;

        }

        if (response == 'error') {

            $captchaInputElement[0].classList.remove('success');
            $captchaInputElement[0].classList.add('error');
            $captchaInputElement[0].placeholder = 'خطأ,حاول مجددا';

        }

    }

});

// captcha validate on form submit
document.querySelector('form').addEventListener('submit', function (e) {



    // captcha validate
    myCaptcha.validate(); if (allowSubmit === false) e.preventDefault();

});

