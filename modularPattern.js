/**
	Provides a namespace function for WL
**/
var WL = WL || {};

WL.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
	parent = WL,
	i;

	if (parts[0] === "WL") {
		parts = parts.slice(1);
	}

	for (i = 0; i < parts.length; i += 1) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}

	return parent;
};

WL.namespace('WL.module');
/**
Module
@private
**/
WL.module = (function(){

	/**
		CONSTANTS / GLOBALS
	*/
	var variable = 0;

	/**
		PRIVATE FUNCTIONS
	*/
	var myFunction = function(){

	};

	//public api
	return {

	};

})(); //end WL.module
