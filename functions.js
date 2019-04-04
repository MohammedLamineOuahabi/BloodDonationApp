const BudgetSMSAPI = require("budgetsms-node");

exports.getRndInteger = function (min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

exports.sendSMS = function (phoneNumber, msg) {
   console.log('Sending SMS To phoneNumber : ' + phoneNumber + ' ' + 'msg :' + msg);
   const BudgetSMS = new BudgetSMSAPI({
      username: process.env.BUDGET_SMS_USERNAME,
      userid: process.env.BUDGET_SMS_USER_ID,
      handle: process.env.BUDGET_SMS_HANDLE
   });
   BudgetSMS.from('TABARA3')
      .to(phoneNumber)
      .message(msg)
      .test()
      //.send()
      .then(json => console.log(json))
      .catch(error => console.error(error));
   return 0;
}