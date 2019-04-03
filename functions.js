exports.getRndInteger = function (min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

exports.sendSMS = function (phoneNumber, msg) {
   console.log('Sending SMS To phoneNumber : ' + phoneNumber + ' ' + 'msg :' + msg);
   return 0;
}