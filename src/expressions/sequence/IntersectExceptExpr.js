/*
 * XPath.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
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

// Static members
function fIntersectExceptExpr_parse (oLexer, oStaticContext) {
	var oExpr,
		sOperator;
	if (oLexer.eof() ||!(oExpr = fInstanceofExpr_parse(oLexer, oStaticContext)))
		return;
	if (!((sOperator = oLexer.peek()) == "intersect" || sOperator == "except"))
		return oExpr;

	// IntersectExcept expression
	var oIntersectExceptExpr	= new cIntersectExceptExpr(oExpr);
	while ((sOperator = oLexer.peek()) == "intersect" || sOperator == "except") {
		oLexer.next();
		if (oLexer.eof() ||!(oExpr = fInstanceofExpr_parse(oLexer, oStaticContext)))
			throw new cException("XPST0003"
//->Debug
					, "Expected second operand in " + sOperator + " expression"
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
		oSequence	= hStaticContext_operators[(oItem = this.items[nIndex])[0]].call(oContext, oSequence, oItem[1].evaluate(oContext));
	return oSequence;
};