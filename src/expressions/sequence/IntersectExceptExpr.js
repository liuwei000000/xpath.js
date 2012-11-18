/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cIntersectExceptExpr(oExpr) {
	this.left	= oExpr;
	this.items	= [];
};

cIntersectExceptExpr.prototype.left		= null;
cIntersectExceptExpr.prototype.items	= null;

//
cIntersectExceptExpr.operators	={};

// Operator mappings
cIntersectExceptExpr.operators["intersect"]	= function(oLeft, oRight, oContext) {
	return hXPath2StaticContext_operators["intersect"].call(oContext, oLeft, oRight);
};
cIntersectExceptExpr.operators["except"]	= function(oLeft, oRight, oContext) {
	return hXPath2StaticContext_operators["except"].call(oContext, oLeft, oRight);
};

// Static members
cIntersectExceptExpr.parse	= function (oLexer, oStaticContext) {
	var oExpr;
	if (oLexer.eof() ||!(oExpr = cInstanceofExpr.parse(oLexer, oStaticContext)))
		return;
	if (!(oLexer.peek() in cIntersectExceptExpr.operators))
		return oExpr;

	// IntersectExcept expression
	var oIntersectExceptExpr	= new cIntersectExceptExpr(oExpr),
		sOperator;
	while ((sOperator = oLexer.peek()) in cIntersectExceptExpr.operators) {
		oLexer.next();
		if (oLexer.eof() ||!(oExpr = cInstanceofExpr.parse(oLexer, oStaticContext)))
			throw new cXPath2Error("XPST0003"
//->Debug
					, "Expected right operand in " + sOperator + " expression"
//<-Debug
			);
		oIntersectExceptExpr.items.push([sOperator, oExpr]);
	}
	return oIntersectExceptExpr;
};

// Public members
cIntersectExceptExpr.prototype.evaluate	= function (oContext) {
	var oSequence	= this.left.evaluate(oContext);
	for (var nIndex = 0, nLength = this.items.length, oItem; nIndex < nLength; nIndex++)
		oSequence	= cIntersectExceptExpr.operators[(oItem = this.items[nIndex])[0]](oSequence, oItem[1].evaluate(oContext), oContext);
	return oSequence;
};