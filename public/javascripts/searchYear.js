$('#year_select select[name="year"]').change(function() {
	
	var payload = {};
	
	payload.year = $('#displayYear').val();
	payload.doc_status = "project";
	var posting = $.ajax({
        type : 'POST',
        url: "/vettingworksheet/displayYear",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload)
    });
    posting.done(function (xhr) {
        if(xhr.status == 200) {
           //success!
		   
		   var getYear;
		   var getDay;
		   var getMon;
		   
		   $('#project_table tbody > tr').remove();
		   var content = "<tbody>"
		   for(x=0; x<xhr.results.project.length; x++){
		   content += '<tr class="clickable-row" data-href="/view/' + xhr.results.project[x]._id +'">';
		   
		   content += '<td class="col-md-2"><a href="/view/' + xhr.results.project[x]._id + '">' + xhr.results.project[x].application.name.first + " " +
		   xhr.results.project[x].application.name.last + '</a></td><td class="col-md-2">' + xhr.results.project[x].updated + '</td><td class="col-md-2"><span class="text-danger">' 
		   + xhr.results.project[x].status + '</span></td><td class="col-md-2">' + xhr.results.project[x].signature.client_date + '</td><td class="col-md-2">' +
		   xhr.results.project[x].app_name + '</td></tr>';
		   }
		   content += '</tbody>';
		   $('#project_table').append(content);
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
	
$('#year_selectDeclined select[name="year"]').change(function() {
	var payload = {};
	
	payload.year = $('#displayYearDeclined').val();
	payload.doc_status = "unapproved";
	
	var posting = $.ajax({
        type : 'POST',
        url: "/vettingworksheet/displayYear",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload)
    });
    posting.done(function (xhr) {
        if(xhr.status == 200) {
           //success!
		  
		   var getYear;
		   var getDay;
		   var getMon;
		   
		   $('#unapproved_table tbody > tr').remove();
		   var content = "<tbody>"
		   for(x=0; x<xhr.results.unapproved.length; x++){
			   if(xhr.results.unapproved[x].status == "declined") {
				   xhr.results.unapproved[x].status = "Declined";
			   }
			   else if(xhr.results.unapproved[x].status == "withdrawn") {
				   xhr.results.unapproved[x].status = "Withdrawn";
			   }
		   content += '<tr class="clickable-row" data-href="/view/' + xhr.results.unapproved[x]._id +'">';
		   
		   content += '<td class="col-md-2"><a href="/view/' + xhr.results.unapproved[x]._id + '">' + xhr.results.unapproved[x].application.name.first + " " +
		   xhr.results.unapproved[x].application.name.last + '</a></td><td class="col-md-2">' + xhr.results.unapproved[x].updated + '</td><td class="col-md-2"><span class="text-danger">' 
		   + xhr.results.unapproved[x].status + '</span></td><td class="col-md-2">' + xhr.results.unapproved[x].signature.client_date + '</td><td class="col-md-2">' +
		   xhr.results.unapproved[x].app_name + '</td></tr>';
		   }
		   content += '</tbody>';
		   $('#unapproved_table').append(content);
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
