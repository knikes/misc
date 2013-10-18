/**************************************************************
					UTILITIES
***************************************************************/

function enrollUser(data, common_name){
	var def = new $.Deferred();
	
	$.ajax({
		type: "PUT",
		url: "/Certificates/" + common_name,
		data: data,
		dataType: 'json',
	}).then(function(response){
		def.resolve(response);
	});

	return def;
}

function getUserCertificate(serialNumber){
	var def = new $.Deferred();
	
	$.ajax({
		type: "GET",
		url: "/Certificates/" + serialNumber,
		dataType: 'json'
	}).then(function(response){
		def.resolve(response);
	}).fail(function(jqXHR){
		def.resolve(jqXHR.status);
	});;

	return def;
}

function verifyCertificate(serialNumber){
	var def = new $.Deferred();
	
	$.ajax({
		type: "HEAD",
		url: "/Certificates/" + serialNumber,
		dataType: 'json',
	}).then(function(x,y,jqXHR){
		def.resolve(jqXHR.status);
	}).fail(function(jqXHR){
		def.resolve(jqXHR.status);
	});

	return def;
}

function clean(){
	var def = new $.Deferred();
	
	$.ajax({
		type: "GET",
		url: "/clean",
	}).then(function(response){
		def.resolve(response);
	}).fail(function(jqXHR){
		def.resolve(jqXHR.status);
	});;

	return def;
}