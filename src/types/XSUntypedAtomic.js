/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cXSUntypedAtomic(vValue) {
	this.value	= vValue;
};

cXSUntypedAtomic.prototype	= new cXSAnyAtomicType;

cXSUntypedAtomic.prototype.toString	= function() {
	return '' + this.value;
};

cXSString.cast	= function(vValue) {
	var cType	= cXSAnyAtomicType.typeOf(vValue);
	switch (cType) {
		case cXSUntypedAtomic:
			return vValue;

		case cXSString:
		//
		case cXSFloat:
		case cXSDouble:
		case cXSDecimal:
		case cXSInteger:
		//
		case cXSDuration:
		case cXSYearMonthDuration:
		case cXSDayTimeDuration:
		//
		case cXSDateTime:
		case cXSTime:
		case cXSDate:
		// TODO: Gregorian
		//
		// TODO: Binary
		// TODO: anyURI
		//
		case cXSQName:
			//
			return cFunctionCall.dataTypes["untypedAtomic"](cString(vValue));
	}
	throw new cXPath2Error("XPTY0004", "Casting from " + cType + " to xs:untypedAtomic can never succeed");
};
//
cFunctionCall.dataTypes["untypedAtomic"]	= function(sValue) {
	return sValue;
};