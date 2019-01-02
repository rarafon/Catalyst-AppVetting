//form handler for new user form

$(document).ready(init)

function init() {
	$('#userRegistration').submit(function (event) {
		event.preventDefault();
		var jsonToSend = getUserFormJSON();
		console.log(jsonToSend);
		
		//post to database
		var posting = $.ajax({
			type : 'POST',
			url : "/user/register",
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			data : jsonToSend
		});
		
		//check for error
		posting.done(function (xhr) {
			if(xhr.status == 200) {
				window.location.replace("/user/userSuccess");
			}
			else {
				console.log("Error Occured");
			}
		});
		
		posting.fail(function (data) {
			console.log("Data not saved");
		});
	});
	
	function getUserFormJSON() {
		var data = {};
		
		$.extend(data, getApplicationData());
		$.extend(data, getContactInfo());
		$.extend(data, getDocumentInfo());
		
		return JSON.stringify(data);
	}
	
	function getApplicationData() {
		var data = {}; 
		
		//data.user_status: getVal('input[name="status"]'),
		data.user_status = getVal('input[name="contact_info.user_name.user_first"]'),
		//data.user_created =  {type: Date, default: Date.now},
		//data.user_updated =  {type: Date, default: Date.now},
		data.user_role =  getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="userRole"]'),
		data.user_activity = getVal('input[name="contact_info.user_name.user_first"]') //getVal('input[name="userAct"]')
		
		return data;
	}
	
	function getContactInfo () {
		
		var data = {};
		data.contact_info = {
			user_name: {
				user_first: getVal('input[name="contact_info.user_name.user_first"]'),
				user_middle: getVal('input[name="contact_info.user_name.user_middle"]'),
				user_last: getVal('input[name="contact_info.user_name.user_last"]'),
				user_preferred: getVal('input[name="contact_info.user_name.user_first"]') //getVal('input[name="preferredName"]')
			},
			user_dob: {
				dob_date: getVal('input[name="contact_info.user_dob.dob_date"]')
			},
			
			user_phone: {
				user_pref: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="pPhone"]'),
				user_ophone: getVal('input[name="contact_info.user_name.user_first"]') //getVal('input[name="oPhone"]')
			},
			user_email: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="emailaddy"]'),
			user_address: {
				u_line1: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="add1"]'),
				u_line2: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="add2"]'),
				u_city: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="city"]'),
				u_state: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="state"]'),
				u_zip: getVal('input[name="contact_info.user_name.user_first"]') //getVal('input[name="zip"]')
			},
			user_emergency: {
				uec_name: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="eContactName"]'),
				uec_relationship: getVal('input[name="contact_info.user_name.user_first"]'), //getVal('input[name="ecRelationship"]'),
				uec_phone: getVal('input[name="contact_info.user_name.user_first"]')  //getVal('input[name="ecPhone"]')
			}
		};
		
		return data;
	}
	
	function getDocumentInfo() {
		var data = {}
		data.user_documents = {
			waiver_signed: true, //getVal('input[name="waiver"]:checked'),
			background_check: true, //getVal('input[name="backcheck"]:checked'),
			ID_badge: true, //getVal('input[name="IDbadge"]:checked'),
			ID_date: getVal('input[name="contact_info.user_name.user_first"]') //getVal('input[name="IDdate"]')
		};
		return data;
		
	}
	
	//helper function to get data values
	function getVal(selector) {
		return $(selector).val();
	}
}