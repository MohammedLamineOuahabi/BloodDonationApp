/***** phone number mask *****************/

$(window).load(function () {
   var phones = [{
      "mask": "+213-*##-###-###"
   }];
   $('#tel').inputmask({
      mask: phones,
      greedy: false,
      definitions: {
         '#': {
            validator: "[0-9]",
            cardinality: 1
         },
         '*': {
            validator: "[5-7]",
            cardinality: 1
         }
      }
   });
});