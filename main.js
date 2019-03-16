/***** phone number mask *****************/

$(window).load(function () {
    var phones = [{ "mask": "+\\2\\13(*) ##-##-##-##" }, { "mask": "+213(*) ##-##-##-##" }];
    $('#tel').inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1 },'*': { validator: "[5-7]", cardinality: 1 } }
    });
});

/*****************************************/
var currentValue = "";
function handleClick(myRadio) {
    //alert('Old value: ' + currentValue);
    //alert('New value: ' + myRadio.value);
    currentValue = myRadio.value;
}