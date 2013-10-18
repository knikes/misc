$(document).ready(function () {
  $("#unitTests").hide();
  $("#viewUsers").hide();
});

$("#requestCertNav").click(function(){
	$(".contentDiv").hide();
	$("#requestCertificate").show();
});

$("#viewUsersNav").click(function(){
	$(".contentDiv").hide();
	$("#viewUsers").show();
	fetchUsers();
});

$("#unitTestsNav").click(function(){
	$(".contentDiv").hide();
	$("#unitTests").show();
});

// $("#submitCertRequest").click(function(){
// 	var subject = { 
// 		"country_code": $("#country_code").val(), 
// 		"state_or_province": $("#state_or_province").val(), 
// 		"locality_name": $("#locality").val(), 
// 		"organization": $("#organization").val(), 
// 		"common_name": $("#common_name").val()
// 	};

// 	var data = { certreq: {"subject": subject } };

// 	enrollUser(data, subject.common_name).then(function(response){
// 		$("#generatedCertificate").val(response.X509Cert);
// 	});
// });


$("#submitCertRequestCSR").click(function(){
	var common_name = $("#common_name").val();
	var csr = $("#csr").val();

	var data = { certreq: {"csr": csr } };

	if(!common_name  || !csr){
		alert("You must have a common name and a csr!");
		return;
	}

	enrollUser(data, common_name).then(function(response){
		$("#generatedCertificate").val(response.X509Cert);
	});
});



function fetchUsers(){
	
}

function addUser(){
	var certificate = "ABCDEFG";

	var table = $("#usersTable");
	var tableRow = $("<tr/>", {});
	var subjectName = $("<td/>", {text: "Jeremy"});
	var serialNumber = $("<td/>", {text: "ABCDEFGHIJK"});
	var viewCertifiate = $("<td/>", {html: "<button onclick='alert(\""+ certificate +"\")'>View Certificate</button>"});

	subjectName.appendTo(tableRow);
	serialNumber.appendTo(tableRow);
	viewCertifiate.appendTo(tableRow);
	tableRow.appendTo(table);
}
