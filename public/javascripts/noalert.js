/************************************************
** This file handles the alert boxes that pop up 
** If someone clicks NO on the mortgage up to date
** or own their home checkboxes at the top of the 
** application form.
**************************************************/
$(document).ready(init)

function init() {

	$('#alertOwn').on('click', alertOwnFunction);
	$('#alertMortgage').on('click', alertMortgageFunction);

	function alertOwnFunction() {
		if (getVal('input[name="owns_home"]:checked')) {
            $('#owns_home_modal').modal();
		}
	}

	function alertMortgageFunction() {
		if (getVal('input[name="mortgage_up_to_date"]:checked')) {
            $('#mortgage_modal').modal();
		}
	}

	function getVal(selector) {
			return $(selector).val();
	}
}