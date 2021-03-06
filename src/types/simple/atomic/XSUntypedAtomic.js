/*
 * XPath.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cXSUntypedAtomic(sValue) {
	this.value	= sValue;
};

cXSUntypedAtomic.prototype	= new cXSAnyAtomicType;
cXSUntypedAtomic.prototype.builtInKind	= cXSConstants.XT_UNTYPEDATOMIC_DT;

cXSUntypedAtomic.prototype.toString	= function() {
	return cString(this.value);
};

cXSUntypedAtomic.cast	= function(vValue) {
	if (vValue instanceof cXSUntypedAtomic)
		return vValue;

	return new cXSUntypedAtomic(cString(vValue));
	//
	throw new cException("XPTY0004"
//->Debug
			, "Casting value '" + vValue + "' to xs:untypedAtomic can never succeed"
//<-Debug
	);
};

//
fStaticContext_defineSystemDataType("untypedAtomic",	cXSUntypedAtomic);
