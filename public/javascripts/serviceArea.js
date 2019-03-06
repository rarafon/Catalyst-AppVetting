//handles service area radio buttons
//$(document).ready(init);
$('#inline_content input[name="service_area"]').click(function() {
	
	var payload = {};
	payload.name = "service_area";
	payload.appId = $('#appId').val();
	if($('input:radio[name=service_area]:checked').val() == "true") {
		console.log("true");
		payload.value = true;
		
	}
	else {
		payload.value = false;
	}
	
	//post to database
	
	 var posting = $.ajax({
        type : 'POST',
        url: "/vettingworksheet/servicearea",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload)
    });
    posting.done(function (xhr) {
        if(xhr.status == 200) {
           //success!
        }
        else{
            console.log("API did not return 200 status for service area");
        }
        // If code is not 200 forward below to .fail()
	
	});
	 posting.fail(function (data)
    {
        console.log("Ajax POST failed");
    });
});

