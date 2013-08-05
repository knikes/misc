/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Supported brokers:

	ActiveMQ
 	
 	WebsphereMQ
 	
 	Liberty to WAS SIBUS
 	
 	Liberty 8.5.5 ND built in JMS
 	
 	WAS SIBUS / MDB / EJB
 	
*/

var brokers = {
	ACTIVE_MQ: 1,
	WEBSPHERE_MQ: 2,
	LIBERTY_SIBUS: 3,
	LIBERTY_BUILT_IN: 4,
	WAS_SIBUS: 5
};

var tests = {
	NORMAL: 1,
	REQUEST_REPLY: 2,
	OTHER: 3
};


function beginTests(broker, test){
	var Q_DESTINATION = "";
	var T_DESTINATION = "";
	
	if(broker == brokers.ACTIVE_MQ){
		Q_DESTINATION = "dynamicQueues/worklightQueue";
		T_DESTINATION = "dynamicTopics/worklightTopic";
	}if(broker == brokers.WEBSPHERE_MQ){
		Q_DESTINATION = "JMS1";
		T_DESTINATION = null;
	}if(broker == brokers.LIBERTY_SIBUS){
		Q_DESTINATION = "myQ";
		T_DESTINATION = null;
	}if(broker == brokers.LIBERTY_BUILT_IN){
		Q_DESTINATION = "jms/libertyQue";
		T_DESTINATION = null;
	}if(broker == brokers.WAS_SIBUS){
		Q_DESTINATION = "jms/Q.Test";
		T_DESTINATION = null;
	}
	
	//return testReadWithFilters(Q_DESTINATION);
	
	if(test == tests.NORMAL){
		return runTests(Q_DESTINATION, Q_DESTINATION);
	}
	else if(test == tests.REQUEST_REPLY){
		return runRequestReplyTests(Q_DESTINATION);
	}else if(test == tests.OTHER){
		return runNonTextMessageTests(Q_DESTINATION);
	}
}

function runTests(q_destination, t_destination){
	var tests = [];
	
	readAllMessages(q_destination, 60);
	
	tests.push(testWriteMessage(q_destination));
	tests.push(testReadMessage(q_destination));
	tests.push(testReadAllMessages(q_destination));
	tests.push(testReadTimeouts(q_destination));
	tests.push(testWriteWithUserProperties(q_destination));
	tests.push(testReadEmptyMessage(q_destination));
	//tests.push(testReadWithFilters(q_destination));

	if(t_destination != null){
		tests.push(testWriteMessage(t_destination));
		tests.push(testWriteWithUserProperties(t_destination));
	}
	
	readAllMessages(q_destination, 60);
	
	return {results: tests};
}

function runRequestReplyTests(destination){
	
	var tests = [];
	tests.push(testRequestReply(destination));
	tests.push(testTimeoutsRequestReply(destination));
	
	return {results: tests};
}

function runNonTextMessageTests(destination){
	var tests = [];
	tests.push(readNonTextMessage(destination, 100));
	//tests.push(requestReplyNonTextMessage(destination, 100));
	
	return {results: tests};
}

/******************************************************************************
							TESTS
******************************************************************************/

//Test read message to queue
function testReadEmptyMessage(destination){
	var testName = "Read empty message";
	var success = false;
	var timeout = 60;
	var error = "";
	
	try{
		readAllMessages(destination, timeout);
		result = readMessage(destination, timeout);	
		if(typeof result.message === "undefined") success = true;
		else success = false;
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test write message to queue
function testReadWithFilters(destination){
	var testName = "Read message with filters";
	var success = false;
	var timeout = 1000;
	var error = "";
	
	var filterMessage = {
		body: "correctmsg",
		properties:{
			JMSCorrelationID: "dgdgwg123",
			filterproperty: "filterme"
		}
	};
	
	var message = {body: "custom user properties"};
	var filters = "JMSCorrelationID = 'dgdgwg123'";
	
	try{
		writeMessage(destination, message);
		writeMessage(destination, filterMessage);
		writeMessage(destination, message);
		
		result = readMessage(destination, timeout, filters);
		if(result.message.properties.JMSCorrelationID == "dgdgwg123" &&
		   result.message.properties.filterproperty == "filterme" &&
		   result.message.body == "correctmsg") success = true;
		else success = false;
		return result;
	}catch(err){
		success = false;
		error = err;
	}
	
	readAllMessages(destination, timeout);
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

function readNonTextMessage(destination){
	return readMessage(destination, 0);
}

function requestReplyNonTextMessage(destination){
	var message = {
		body: "bytes",
		properties:{
			JMSCorrelationID: "efefefefe",
		}
	};
	
	return requestReply(destination, message, 0);
}

// Test write message to queue
function testWriteMessage(destination){
	var testName = "Write single message";
	var success = false;
	var message = { body:"writeMessage" };
	var timeout = 60;
	var error = "";
	
	try{
		result = writeMessage(destination, message);
		if(typeof result.JMSMessageID === "string") success = true;
		else success = false;
		
		readMessage(destination, timeout);
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test read message to queue
function testReadMessage(destination){
	var testName = "Read single message";
	var success = false;
	var message = { body:"readMessage" };
	var timeout = 60;
	var error = "";
	
	try{
		writeMessage(destination, message);
		result = readMessage(destination, timeout);	
		if(typeof result.message.body === "string") success = true;
		else success = false;
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

// Test read all messages from queue
function testReadAllMessages(destination){
	var testName = "Read all messages";
	var success = false;
	var timeout = 60;
	var error = "";
	var message = { body:"readAllMessages" };
	
	try{
		addMessages(3, destination, message);
		var result = readAllMessages(destination, timeout);
		if(result.messages.length == 4) success = true;
		else {
			success = false;
			error = "Did not recieve 4 messages. Received: " + result.messages.length + " messages.";
		}
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test timeout for read message
function testReadTimeouts(destination){
	var testName = "Timeout for read message";
	var success = false;
	var error = "";
	var message = { body:"readMessage timeout" };
	
	try{	
		addMessages(6, destination, message);
		var messages = [];
		//readMessage(destination, -1);
		//readMessage(destination, -5.0);
		messages.push(readMessage(destination, 0));
		messages.push(readMessage(destination, 0.0));
		messages.push(readMessage(destination, 5));
		messages.push(readMessage(destination, 3.241));
		
		success = true;
		for(var i=0; i<messages.length; i++){
			if(typeof messages[i].message.body != "string"){
				success = false;
				error = "One of the messages was not received " + JSON.stringify(messages[i]);
			}
		}
		
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test write message to queue
function testWriteWithUserProperties(destination){
	var testName = "Write single message with user properties";
	var success = false;
	var timeout = 100;
	var error = "";
	
	var message = {
		body: "custom user properties",
		properties:{
			JMSCorrelationID: "1234",
			mycustomproperty: "moo",
			anothercustomproperty: "hello"
		}
	};
	
	try{
		readAllMessages(destination, timeout);
		writeMessage(destination, message);
		result = readMessage(destination, timeout);
		
		if(result.message.properties.JMSCorrelationID == "1234" &&
		   result.message.properties.mycustomproperty == "moo" &&
		   result.message.properties.anothercustomproperty == "hello") success = true;
		else success = false;
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test request reply
function testRequestReply(destination){
	var testName = "Request reply";
	var success = false;
	var timeout = 60;
	var error = "";
	
	var message = {
		body: "request reply",
		properties:{
			JMSCorrelationID: "fn23if2pof",
		}
	};
	
	try{
		result = requestReply(destination, message, timeout);
		if(result.message.properties.JMSCorrelationID == "fn23if2pof") success = true;
		else success = false;
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

//Test request reply with timeout
function testTimeoutsRequestReply(destination){
	var testName = "Request reply";
	var success = false;
	var error = "";
	
	var message = {
		body: "request reply",
		properties:{
			JMSCorrelationID: "fn23if2pof",
		}
	};
	
	try{
		var messages = [];
		//requestReply(destination, message, -1);
		//requestReply(destination, message, -5.0);
		messages.push(requestReply(destination, message, 0));
		messages.push(requestReply(destination, message, 0.0));
		messages.push(requestReply(destination, message, 5));
		messages.push(requestReply(destination, message, 3.241));
		
		success = true;
		for(var i=0; i<messages.length; i++){
			if(typeof messages[i].message.body != "string"){
				success = false;
				error = "One of the messages was not received " + JSON.stringify(messages[i]);
			}
		}
		
		if(result.message.properties.JMSCorrelationID == "fn23if2pof") success = true;
		else success = false;
	}catch(err){
		success = false;
		error = err;
	}
	
	return {TEST: testName, SUCCESS: success, ERROR: error};
}

 

/******************************************************************************
							UTILITY
******************************************************************************/


function writeMessage(destination, message) {
		
	var result = WL.Server.writeJMSMessage({
		destination: destination,
		message: message
	});

    return result;
}

function readMessage(destination, timeout, filters) {
	var result = WL.Server.readSingleJMSMessage({
    	destination: destination,
    	timeout: timeout,
    	filter: filters
    });
   
    return result;
}

function readAllMessages(destination, timeout) {
	var result = WL.Server.readAllJMSMessages({
    	destination: destination,
    	timeout: timeout
    });
   
    return result;
}


function requestReply(destination, message, timeout) {
	var result = WL.Server.requestReplyJMSMessage({
    	destination: destination,
    	message: message,
    	timeout: timeout
    });
   
    return result;
}

function addMessages(numMessages, destination, message){
	for(var i=0; i<numMessages; i++){
		writeMessage(destination, message);
	}
}


// Uncomment timeouts

// read empty message
