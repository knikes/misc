function startTests(){
	testEnrollUserWithSubject().then(function(result){
		console.log(result);
		return testEnrollUserWithCSR();
	}).then(function(result){
		console.log(result);
		return testVerifyNonExistentCertificate();
	}).then(function(result){
		console.log(result);
		return testGetNonExistentCertificate();
	}).then(function(result){
		console.log(result);
		clean();
	});
}

/**************************************************************
					BASIC TESTS
***************************************************************/

function testEnrollUserWithSubject(){
	var def = new $.Deferred();

	var subject = { "country_code": "US", "state_or_province": "Texas", "locality_name": "Austin", "organization": "IBM", "common_name": "www.example.com"};
	var data = { certreq: {"subject": subject } };

	var enrolledCert = null;
	var retrievedCert = null;

	clean().then(function(){
		return enrollUser(data)
	}).then(function(resp){
		enrolledCert = resp.X509Cert;
		return getUserCertificate(resp.serial_number);
	}).then(function(resp){
		retrievedCert = resp.X509Cert;
		var result = (retrievedCert == enrolledCert);
		def.resolve(result);
	});

	return def;
}

function testEnrollUserWithCSR(){
	var def = new $.Deferred();

	var csr = "-----BEGIN CERTIFICATE REQUEST-----\nMIIBwTCCASoCAQAwgYAxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJUWDEPMA0GA1UE\nBxMGQXVzdGluMQ8wDQYDVQQKEwZDbGllbnQxDzANBgNVBAsTBkNsaWVudDEPMA0G\nA1UEAxMGQ2xpZW50MSAwHgYJKoZIhvcNAQkBFhFjbGllbnRAY2xpZW50LmNvbTCB\nnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEArKSvhevlQhDJ0FCyqKu0wcvmXCNB\nKitnXhJuNdUd2fyIEjz77Zg9xMAoxiXoJVC8P0G7hY4RIM5XMu9JCePPPlbY/xEv\nAyiyPpinJx3/Z9vYkGir4KpyuLpe9m7h+JdkV4ruspC39/nbCCTmmz2xXwS/FzXu\nn5n+appuKYVHFBMCAwEAAaAAMA0GCSqGSIb3DQEBBQUAA4GBACO/BUAX9TcQ2fiz\nVu+7PA024hz2eGHBvWlhFTQk3FmX6GrQLo3KZO2nkyPNmbcLMdOsTg7nrzr83UVF\nr9iW6ws/lSgsZ4j92kGnsdwkrs4Mc38pSY/hvWPxrHI4hF46JD2R0OzRxdEmsKx1\n2W/UaxnBgVDqExC5JQBEaf8/1DbK\n-----END CERTIFICATE REQUEST-----";
	var data = { certreq: {"csr": csr } };

	var enrolledCert = null;
	var retrievedCert = null;

	clean().then(function(){
		return enrollUser(data)
	}).then(function(resp){
		enrolledCert = resp.X509Cert;
		return getUserCertificate(resp.serial_number);
	}).then(function(resp){
		retrievedCert = resp.X509Cert;
		var result = (retrievedCert == enrolledCert);
		def.resolve(result);
	});

	return def;
}


/**************************************************************
					CORNER CASES
***************************************************************/

function testGetCertificateRevoked(){

}

function testValidateCertificateRevoked(){
	
}

/**************************************************************
					ERROR CASES
***************************************************************/

function testVerifyNonExistentCertificate(){
	var def = new $.Deferred();

	clean().then(function(resp){
		return verifyCertificate("ABCD12300000")
	}).then(function(response){
		var result = response == 404;
		def.resolve(result);
	});

	return def;
}

function testGetNonExistentCertificate(){
	var def = new $.Deferred();

	clean().then(function(resp){
		return getUserCertificate("KKKKKKKKKKKKK")
	}).then(function(response){
		var result = response == 404;
		def.resolve(result);
	});

	return def;
}


/**************************************************************
					INVALID INPUT
***************************************************************/
