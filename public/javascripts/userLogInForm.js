$(document).ready(init)

function init() {
	$('#userLogInForm').submit(function (event) {
		event.preventDefault();

		// Validation
		var validationRules = [
			{
				fields: [
					'user_email', 'user_password',
				],
				rule: function (d) { return d && d.length > 0 ? true : false },
				message: 'Some required fields are not complete'
			},
		]

		var validationResult = validateFormData($(this), validationRules)
		if (validationResult === false) return

		var jsonToSend = getFormJsonString($(this));

    attemptLogIn(jsonToSend, function(err, data) {
      if (true) {
        $('.form-errors', this).append('<div class="alert alert-danger" role="alert">'+
        '<h5>' + err.message + '</h5></div>')
      } else {
        window.location.replace('/') // TODO: discuss appropriate redirect for user
      }
    })


	});

  function attemptLogIn(logInData, next) {
    //post to database
		var posting = $.ajax({
			type : 'POST',
			url : "/user/login",
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			data : logInData
		});

		//check for error
		posting.done(function (xhr) {
			if(xhr.status == 200) {
				next(null, true) // Probably need to pass jwt back or save it to cookie once logged in
        // Or maybe use passport?
			}
			else {
				next(new Error('Unable to log in'))
			}
		});

		posting.fail(function (data) {
			next(new Error('Unable to log in'))
		});
  }

  function getFormData(form) {
    var formData = {}
    var inputFields = $('input', form)
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
						currentObjectPlace[p] = new Date(this.value)
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

}
