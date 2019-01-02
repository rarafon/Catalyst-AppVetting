//This is the FORM HANDLER for the application form called appForm in the applicationform.hbs view.
//This form, upon submit, creates jsonToSend by calling getApplicationFormJSON,
//which is a function that appends (extends) a JSON object by calling
//the get*****Data() functions below...



	
$(document).ready(init)

function init() {
	
	
	/****** Bootstrap datepicker************/
	var date_input=$('input[name="dob"]'); //our date input has the name "dob"
    //var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        //container: container,
		defaultViewDate: { year: 1977, month: 01, day: 01 },
        todayHighlight: false,
    };
	date_input.datepicker(options);
	
	var date_input=$('input[name="client_date"]'); //our date input has the name "client_date"
    //var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options2={
		//container: container,
		format: 'mm/dd/yyyy',
		todayBtn: "linked",
		orientation: "top auto",
    };
    date_input.datepicker(options2);
	  
	$('#appForm').submit(function (event) {
		event.preventDefault();

		
		
		if (validateForm() === false) { return }
		
	  
/*		var checkBirthDate = getVal('input[name="dob"]');
		if (isValidDate(checkBirthDate) === false {
			alert("Please check the Date of Birth format (mm/dd/yyyy).");
			return
		}
		
		var checkSigDate = getVal('input[name="client_date"]')
		if (isValidDate(checkSigDate) === false {
			alert("Please check the Signature Date format (mm/dd/yyyy).");
			return
		}
*/


		var jsonToSend = getApplicationFormJSON();  //stringified in that function
		console.log(jsonToSend);

		//POST the data to the database
		var posting = $.ajax({
			type : 'POST',
			url: "/application/add",
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			data: jsonToSend
		});

		//upon return, check for 200, then redirect so success page
		posting.done(function (xhr) {
			if(xhr.status == 200) {
				window.location.replace("/application/success");
			}
			else{
				console.log("Whoops, something went wrong");
			}
			// If code is not 200 forward below to .fail()
		});

		posting.fail(function (data)
		{
			console.log("Whoops, something went wrong");
			// The save failed, just do nothing and leave the form without losing their typed data
		});
	});

	//THIS is the function that calls all the other functions that piece together (extend)
	//all of the JSON in proper API format.
	function getApplicationFormJSON() {
		var data = {};

		$.extend(data, getAdvocateData());   //these should be self-explanetory
		$.extend(data, getApplicationData());
		$.extend(data, getFinanceData());
		$.extend(data, getPropertyData());
		$.extend(data, getRecruitmentData());
		$.extend(data, getSignatureData());


		return JSON.stringify(data);
	}

/// FIRST, we need to make some Helper Functions in order to
/// grab some specific items and turn them into
/// data variables we can use in the above function calls.

	//this function figures out and returns the Language
	function getLanguage() {
		var data;
		if (getVal('input[name="language"]:checked') == "English") {
			data = "English";
		}
		else if (getVal('input[name="language"]:checked') == "Other") {
			data = getVal('input[name="language_other"]');
		}
		return data;
	}

	//this function figures out and returns the Home Type {} object
	function getHomeType() {
		var data = {};
		if (getVal('input[name="propertyType"]:checked') == "Other") {
			data = getVal('input[name="propertyType_other"]');
		}
		else {
			data = getVal('input[name="propertyType"]:checked');
		}
		return data;
	}

///Okay, so NOW we can call the rest of the functions listed in getApplicationFormJSON().

	//This function handles the data that goes into "advocate:"
	//section of the documentPackage.js
	function getAdvocateData() {
		var data = {};

		//start by setting variables to false
		var ind_bool = false;
		var npo_bool = false;
		var gov_bool = false;
		var advocate_bool = false;

		//check for different advocate types, set proper variables to true
		if (getVal('input[name="advocate"]:checked') == "adv_npo") {
			npo_bool = true;
			advocate_bool = true;
		}

		if (getVal('input[name="advocate"]:checked') == "adv_gov") {
			gov_bool = true;
			advocate_bool = true;
		}
		if (getVal('input[name="advocate"]:checked') == "adv_individual") {
			ind_bool = true;
			advocate_bool = true;
		}

		// create the JSON data object
		data.advocate = {
			is_advocate: advocate_bool,
			individual: ind_bool,
			npo: npo_bool,
			gov: gov_bool,
			name: getVal('input[name="advocate_name"]'),
			phone: getVal('input[name="advocate_phone"]'),
			email: getVal('input[name="advocate_email"]'),
			relationship: getVal('input[name="advocate_individual_relationship"]'),
			organization_name: getVal('input[name="advocate_npo_organization"]')
		};
		return data;
	}


	//This function handles MOST of the data that goes into "application:"
	//section of the documentPackage.js (as well as status, which will
	//send "new" from a hidden field)

	function getApplicationData() {
		var data = {};

		data.status = getVal('input[name="status"]');
		//data.created is created on the back end
		//data.updated is created on the back end

		data.application = {
			owns_home: getVal('input[name="owns_home"]:checked'),
			marital: {
				status: getVal('input[name="mStatus"]:checked'),
				spouse: getVal('input[name="spouse"]')
			},
			email: getVal('input[name="emailaddy"]'),
			veteran: getVal('input[name="military"]:checked'),
			language: getLanguage(),  //from helper function above
			heard_about: jQuery("textarea#hearAboutCatalyst").val(),
			name: {
				first: getVal('input[name="firstName"]'),
				middle: getVal('input[name="middleName"]'),
				last: getVal('input[name="lastName"]'),
				preferred: getVal('input[name="preferredName"]')
			},
			phone: {
				preferred: getVal('input[name="pPhone"]'),
				other: getVal('input[name="oPhone"]')
			},
			address: {
				line_1: getVal('input[name="add1"]'),
				line_2: getVal('input[name="add2"]'),
				city: getVal('input[name="city"]'),
				state: getVal('input[name="state"]'),
				zip: getVal('input[name="zip"]')
			},
			emergency_contact: {
				name: getVal('input[name="eContactName"]'),
				relationship: getVal('input[name="ecRelationship"]'),
				phone: getVal('input[name="ecPhone"]'),
				email: getVal('input[name="ecEmail"]')
			},
			dob: {
				date: getVal('input[name="dob"]')
			},
			other_residents: {
				name: [
						getVal('input[name="additional_1"]'),
						getVal('input[name="additional_2"]'),
						getVal('input[name="additional_3"]'),
						getVal('input[name="additional_4"]'),
						getVal('input[name="additional_5"]'),
						getVal('input[name="additional_6"]'),
						getVal('input[name="additional_7"]'),
						getVal('input[name="additional_8"]')
					],
				age: [
						getVal('input[name="a1age"]'),
						getVal('input[name="a2age"]'),
						getVal('input[name="a3age"]'),
						getVal('input[name="a4age"]'),
						getVal('input[name="a5age"]'),
						getVal('input[name="a6age"]'),
						getVal('input[name="a7age"]'),
						getVal('input[name="a8age"]')
					],
				relationship: [
						getVal('input[name="a1relationship"]'),
						getVal('input[name="a2relationship"]'),
						getVal('input[name="a3relationship"]'),
						getVal('input[name="a4relationship"]'),
						getVal('input[name="a5relationship"]'),
						getVal('input[name="a6relationship"]'),
						getVal('input[name="a7relationship"]'),
						getVal('input[name="a8relationship"]')
					]
			},
			driver_license: {
				number: getVal('input[name="driversLicense"]')
			},
			special_circumstances: {
				note: jQuery("textarea#otherCircumstances").val()
			}
		};

		console.log("residents");
		console.log(data.application.other_residents);
		//count how many financial packages will need added
		var count = 0;
		for(var x=0; x<=data.application.other_residents.name.length-1; x++) {

			if(data.application.other_residents.name[x] != "") {
				count++

			}
		}
		data.count = count;


		return data;
	}


	//This function handles the data that goes into "finance:"
	//section of the documentPackage.js
	function getFinanceData() {
		var data = {};
		data.finance = {
			mortgage: {
				payment: getVal('input[name="monthlyMortgage"]'),
				up_to_date: getVal('input[name="mortgage_up_to_date"]:checked')
			},
			income: {
				amount: getVal('input[name="annualIncome"]')
			},
			assets: {
				name: [
					getVal('input[name="assets1"]'),
					getVal('input[name="assets2"]'),
					getVal('input[name="assets3"]'),
					getVal('input[name="assets4"]'),
					getVal('input[name="assets5"]')
				],
				value: [
					getVal('input[name="assets1_value"]'),
					getVal('input[name="assets2_value"]'),
					getVal('input[name="assets3_value"]'),
					getVal('input[name="assets4_value"]'),
					getVal('input[name="assets5_value"]')
				]
			},
			client_can_contribute: {
				value: getVal('input[name="contribute"]:checked'),
				amount: jQuery("textarea#contribute_amount").val()
			},
			associates_can_contribute: {
				value: getVal('input[name="relativeContribute"]:checked'),
				description: jQuery("textarea#relativeContribute_provide").val()
			},
			requested_other_help: {
				value: getVal('input[name="otherHelp"]:checked'),
				description: jQuery("textarea#otherHelp_provide").val()
			}
		}
		return data;
	}


	//This function handles the data that goes into "property:"
	//section of the documentPackage.js
	function getPropertyData() {
		var data = {};

		data.property = {
			home_type: getHomeType(),   //from helper function above
			ownership_length: getVal('input[name="timePropertyOwned"]'),
			year_constructed: getVal('input[name="yearPropertyBuilt"]'),
			requested_repairs: jQuery("textarea#repairsNeeded").val(),
			client_can_contribute: {
				value: getVal('input[name="laborHelp"]:checked'),
				description: jQuery("textarea#laborHelp_personal").val()
			},
			associates_can_contribute: {
				value: getVal('input[name="othersLaborHelp"]:checked'),
				description: jQuery("textarea#others_laborHelp").val()
			}
		};
		return data;
	}


	//This function handles the data that goes into "recruitment:"
	//section of the documentPackage.js
	function getRecruitmentData() {
		var data = {};

		data.recruitment = {
			fbo_help: getVal('input[name="fbo_help"]:checked'),
			fbo_name: getVal('input[name="fbo_name"]')
		};
		return data;
	}

	//This function handles the data that goes into the "signature: "
	//section of documentPackage.js
	function getSignatureData() {
		var data = {};

		data.signature = {
			client_terms: getVal('input[name="tac-yes"]:checked'),
			client_sig: getVal('input[name="signature"]'),
			client_date: getVal('input[name="client_date"]')
		};
		return data;
	}


	//This is a helper function so you can getVal on an input from the form
	function getVal(selector) {
		return $(selector).val();
	}

	// validations -- object containing validation tests
	var validations = [
		{
			fields: [
				'firstName', 'lastName', 'dob', 'driversLicense', 'mStatus', 'pPhone',
				'add1', 'city', 'state', 'zip', 'eContactName', 'ecRelationship',
				'ecPhone', 'monthlyMortgage', 'annualIncome', 'timePropertyOwned',
				'yearPropertyBuilt', 'repairsNeeded', 'signature', 'client_date'
			],
			isValid: function(node) { return node.val().length > 0 }
		},
		{
			fields: [
				'mStatus', 'military', 'language', 'contribute', 'relativeContribute',
				'otherHelp', 'propertyType', 'laborHelp', 'othersLaborHelp', 'fbo_help',
			],
			isValid: function(node) {
				// At least one is selected...
				var oneSelected = false
				node.each(function(idx) {
					if (this.checked === true) { oneSelected = true }
				})

				return oneSelected
			}
		}
	]

	// validateForm -- Runs through validations and returns true if the form
	// is valid, false otherwise.
	function validateForm() {
		var result = true

		$('.hasError').removeClass('hasError')
		$('#applicationErrors').css('display', 'none')

		validations.forEach(function(rule) {
			rule.fields.forEach(function(fieldName) {
				var inputField = $('[name=' + fieldName + ']')
				var fieldResult = rule.isValid(inputField)

				if (fieldResult === false) {
					result = false
					$(inputField.parent()).addClass('hasError')
				}
			})
		})

		if (result === false) {
			$('#applicationErrors').css('display', 'inherit')
		}

		return result
	}
	
/*	// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
	function isValidDate(dateString)
	{
		// First check for the pattern
		if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
			return false;

		// Parse the date parts to integers
		var parts = dateString.split("/");
		var day = parseInt(parts[1], 10);
		var month = parseInt(parts[0], 10);
		var year = parseInt(parts[2], 10);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month == 0 || month > 12)
			return false;

		var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
			monthLength[1] = 29;

		// Check the range of the day
		return day > 0 && day <= monthLength[month - 1];
	};
	*/
}




//DATA EXTRACTION WORK PARTS
// for most inputs... (change name to id when necessary)
//: getVal('input[name=""]'),

//for text areas
//jQuery("textarea#otherCircumstances").val()
