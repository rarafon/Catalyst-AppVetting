$(document).ready(init)

function init() {
	// Add event listeners to buttons
	$('#user_roles').selectpicker();
	$('.bootstrap-select').click(function(e)
	{
	$(this).addClass('open');
	//console.log('hit');
	e.stopPropagation();
	});
	console.log("123");
	
	$('#userRegistration').submit(function (event) {
		event.preventDefault();

		// Validation
		var validationRules = [
			{
				fields: [
					'contact_info.user_email', 'contact_info.user_name.user_first',
					'contact_info.user_name.user_last', 'contact_info.user_dob.dob_date',
					'contact_info.user_address.u_line1', 'contact_info.user_address.u_city',
					'contact_info.user_address.u_zip', 'contact_info.user_emergency.uec_name',
					'contact_info.user_emergency.uec_phone'
				],
				rule: function (d) { return d && d.length > 0 ? true : false },
				message: 'Some required fields are not complete'
			},
			{
				fields: [ 'password' ],
				rule: function(d) { return d === $('[name="password-confirm"]').val() },
				message: 'Password fields must match'
			}
		]

		var validationResult = validateFormData($(this), validationRules)
		if (validationResult === false) return

		var jsonToSend = getFormData($(this));

		jsonToSend.user_created = new Date().getTime()


		var vals = [];
  		var $sel = $('#user_roles').find('option:selected');
  		console.log($sel);
    	for(var i=0; i < $sel.length; i++) {
      	vals[i]= $sel.eq(i).val();
  		}
		
		 jsonToSend.user_roles = vals ;
		 jsonToSend.user_role = "";
		jsonToSend = JSON.stringify(jsonToSend);

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
				alert('User created!')
				clearFormData($('#userRegistration'))
			}
			else {
				console.log("Error Occured");
			}
		});

		posting.fail(function (data) {
			console.log("Data not saved");
		});
	});

  function getFormData(form) {
    var formData = {}
    var inputFields = $('input, select', form)
    inputFields.each(function(idx) {
			var objectType = this.type
      var objectPath = this.name
      var objectPieces = objectPath.split('.')
      var currentObjectPlace = formData
      objectPieces.forEach(function(p, i) {
        if (i < (objectPieces.length-1)) {
          if (!currentObjectPlace[p]) currentObjectPlace[p] = {}
          currentObjectPlace = currentObjectPlace[p]
        } else {
					if (this.type === 'date') {
						currentObjectPlace[p] = this.value ? new Date(this.value) : null
					} else if (this.type === 'checkbox') {
						currentObjectPlace[p] = this.checked
					} else {
						currentObjectPlace[p] = this.value
					}
        }
      }.bind(this))
    })

    return formData
  }

	function getFormJsonString(form) {
		return JSON.stringify(getFormData(form))
	}

	function validateFormData(form, rules) {
		var formValid = true
		var formErrors = []

		// Clear previous form errors
		$('.form_errors', form).empty()
		$('.has-danger', form).each(function(idx) {
			$(this).removeClass('has-danger')
		})

		rules.forEach(function(rule) {
			var ruleFailed = false
			rule.fields.forEach(function(f) {
				var field = $('[name="'+f+'"]', form)
				if (field.length < 1) {
					console.error('Unable to find and validate field "' + f + '"')
					return
				}

				var fieldValue = field.val()

				// If rule fails...
				if (rule.rule(fieldValue) === false) {
					// Form is not valid
					formValid = false

					// Set the style of the form groups
					var container = field
					while (!container.hasClass('form-group')) {
						if (!container[0]) debugger
						container = $(container[0].parentNode)
					}
					container.addClass('has-danger')

					// Only add rule message if the rule hasn't failed yet
					if (ruleFailed === false) {
						formErrors.push(rule.message)
						ruleFailed = true
					}
				}
			})
		})

		// If form errors, add them
		if (formErrors.length > 0) {
			var errorList = $('.form_errors', form)
			errorList.append(
				'<div class="alert alert-danger" role="alert"><h5>There were problems '
				+ 'submitting this form:</h5><ul></ul></div>'
			)

			errorList = $('ul', errorList)
			formErrors.forEach(function(err) {	errorList.append('<li>' + err + '</li>') })
		}

		return formValid
	}

	function clearFormData(form) {
		var inputFields = $('input', form)
    inputFields.each(function(idx) {
			if (this.type === 'checkbox') { this.checked = false }
			else { this.value = '' }
		})

		$('.btn-primary', '#role-selector')
		.toggleClass('btn-primary')
		.toggleClass('btn-secondary')
	}

}
