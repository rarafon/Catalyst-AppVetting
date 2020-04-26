// Check the form, in case html required doesn't work
var application_helper = {
  check_waiver() {
    return ($('input[name=waiver-radio]:checked').val() == "1");
  },
  check_inputs() {
    var filled_out = true;

    function check_element(index, element) {
      if ($(this).val().length <= 0) {
        $(this).css("border-color", "red");
        filled_out = false;
      }
    }
    
    $('input[notrequired]').each(check_element);
    $('textarea[notrequired]').each(check_element);
    $('radio[notrequired]').each(check_element);
    return filled_out;
  },
  check_marital() {
    return ($('input[name=marital_status]:checked').val() !== undefined);
  },
};