window.onload = function() {
  var app_id = $("#applicant_id_div").text();
  console.log("HI");

  $.ajax({
    type: "GET",
      url: "/carenetwork/application/" + app_id,
      success: function(data, textStatus, xhr) {
        if (xhr.status == 200) {
          console.log(data);

          fill_app_data(data)
        }
      },
      error: function(xhr, ajaxOptions, err) {
      }
  });
};

// Fill out the inputs with data
function fill_app_data(data) {
  var field,
      app_data = data.application;
  for (field in app_data) {
    if (field == "address") { // Set address
      for (field in app_data.address) {
        $(`input[name=${field}]`).val(app_data.address[field]);
      }
    } else if (field == "contacts") {
      for (field in app_data.contacts[0]) {
        $(`input[name=contact_${field}]`).val(app_data.contacts[0][field]);
      }
    } else if (field == "dob") {
      var regex = /(\d{4}-\d{2}-\d{2})/g
      var result = app_data[field].match(regex);
      if (result)
        $(`input[name=${field}]`).val(result[0]);
    } else if (field == "marital_status") {
      $(`:radio[value=${app_data[field]}]`,).prop('checked', true);
    } else {
      $(`input[name=${field}]`, ).val(app_data[field]);
      // Set text area for some fields
      $(`textarea[name=${field}]`, ).val(app_data[field]);
    }
  }
}