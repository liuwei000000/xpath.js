/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cXSGMonth() {

};

cXSGMonth.prototype	= new cXSAnyAtomicType;
cXSGMonth.prototype.builtInKind		= cXSConstants.GMONTH_DT;
cXSGMonth.prototype.primitiveKind	= cXSAnySimpleType.PRIMITIVE_GMONTH;
