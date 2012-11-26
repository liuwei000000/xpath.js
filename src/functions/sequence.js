/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

/*
	15.1 General Functions and Operators on Sequences
		boolean
		index-of
		empty
		exists
		distinct-values
		insert-before
		remove
		reverse
		subsequence
		unordered

	15.2 Functions That Test the Cardinality of Sequences
		zero-or-one
		one-or-more
		exactly-one

	15.3 Equals, Union, Intersection and Except
		deep-equal

	15.4 Aggregate Functions
		count
		avg
		max
		min
		sum

	15.5 Functions and Operators that Generate Sequences
		id
		idref
		doc
		doc-available
		collection
		element-with-id

*/

// 15.1 General Functions and Operators on Sequences
// fn:boolean($arg as item()*) as xs:boolean
fStaticContext_defineSystemFunction("boolean",	[[cXTItem, '*']],	function(oSequence1) {
	return new cXSBoolean(fFunction_sequence_toEBV(oSequence1, this));
});

// fn:index-of($seqParam as xs:anyAtomicType*, $srchParam as xs:anyAtomicType) as xs:integer*
// fn:index-of($seqParam as xs:anyAtomicType*, $srchParam as xs:anyAtomicType, $collation as xs:string) as xs:integer*
fStaticContext_defineSystemFunction("index-of",	[[cXSAnyAtomicType, '*'], [cXSAnyAtomicType], [cXSString, '', true]],	function(oSequence1, oSequence2, oSequence3) {
	if (!oSequence1.items.length || !oSequence2.items.length)
		return new cSequence;

	// TODO: Implement collation

	var oSequence	= new cSequence;
	for (var nIndex = 0, nLength = oSequence1.items.length, vValue = oSequence2.items[0].valueOf(); nIndex < nLength; nIndex++)
		if (oSequence1.items[nIndex].valueOf() === vValue)
			oSequence.items.push(new cXSInteger(nIndex + 1));

	return oSequence;
});

// fn:empty($arg as item()*) as xs:boolean
fStaticContext_defineSystemFunction("empty",	[[cXTItem, '*']],	function(oSequence1) {
	return new cXSBoolean(!oSequence1.items.length);
});

// fn:exists($arg as item()*) as xs:boolean
fStaticContext_defineSystemFunction("exists",	[[cXTItem, '*']],	function(oSequence1) {
	return new cXSBoolean(!!oSequence1.items.length);
});

// fn:distinct-values($arg as xs:anyAtomicType*) as xs:anyAtomicType*
// fn:distinct-values($arg as xs:anyAtomicType*, $collation as xs:string) as xs:anyAtomicType*
fStaticContext_defineSystemFunction("distinct-values",	[[cXSAnyAtomicType, '*'], [cXSString, '', true]],	function(oSequence1, oSequence2) {
	if (!oSequence1.items.length)
		return null;

	var oSequence	= new cSequence;
	for (var nIndex = 0, nLength = oSequence1.items.length, vValue; nIndex < nLength; nIndex++) {
		vValue = oSequence1.items[nIndex].valueOf();
		for (var nRightIndex = 0, nRightLength = oSequence.items.length, bFound = false; (nRightIndex < nRightLength) &&!bFound; nRightIndex++)
			if (oSequence.items[nRightIndex].valueOf() === vValue)
				bFound	= true;
		if (!bFound)
			oSequence.items.push(oSequence1.items[nIndex]);
	}

	return oSequence;
});

// fn:insert-before($target as item()*, $position as xs:integer, $inserts as item()*) as item()*
fStaticContext_defineSystemFunction("insert-before",	[[cXTItem, '*'], [cXSInteger], [cXTItem, '*']],	function(oSequence1, oSequence2, oSequence3) {
	if (!oSequence1.items.length)
		return oSequence3;
	if (!oSequence3.items.length)
		return oSequence1;

	var nLength 	= oSequence1.items.length,
		nPosition	= oSequence2.items[0].valueOf();
	if (nPosition < 1)
		nPosition	= 1;
	else
	if (nPosition > nLength)
		nPosition	= nLength + 1;

	var oSequence	=  new cSequence;
	for (var nIndex = 0; nIndex < nLength; nIndex++) {
		if (nPosition == nIndex + 1)
			oSequence.add(oSequence3);
		oSequence.items.push(oSequence1.items[nIndex]);
	}
	if (nPosition == nIndex + 1)
		oSequence.add(oSequence3);

	return oSequence;
});

// fn:remove($target as item()*, $position as xs:integer) as item()*
fStaticContext_defineSystemFunction("remove",	[[cXTItem, '*'], [cXSInteger]],	function(oSequence1, oSequence2) {
	var oSequence	= new cSequence;
	if (!oSequence1.items.length)
		return oSequence;

	var nLength 	= oSequence1.items.length,
		nPosition	= oSequence2.items[0].valueOf();

	if (nPosition < 1 || nPosition > nLength)
		return oSequence1;

	var oSequence	=  new cSequence;
	for (var nIndex = 0; nIndex < nLength; nIndex++)
		if (nPosition != nIndex + 1)
			oSequence.items.push(oSequence1.items[nIndex]);

	return oSequence;
});

// fn:reverse($arg as item()*) as item()*
fStaticContext_defineSystemFunction("reverse",	[[cXTItem, '*']],	function(oSequence1) {
	oSequence1.items.reverse();

	return oSequence1;
});

// fn:subsequence($sourceSeq as item()*, $startingLoc as xs:double) as item()*
// fn:subsequence($sourceSeq as item()*, $startingLoc as xs:double, $length as xs:double) as item()*
fStaticContext_defineSystemFunction("subsequence",	[[cXTItem, '*'], [cXSDouble, ''], [cXSDouble, '', true]],	function(oSequence1, oSequence2, oSequence3) {
	var nPosition	= cMath.round(oSequence2.items[0]),
		nLength		= arguments.length > 2 ? cMath.round(oSequence3.items[0]) : oSequence1.items.length - nPosition + 1;

	// TODO: Handle out-of-range position and length values
	var oSequence	= new cSequence(oSequence1);
	oSequence.items	= oSequence.items.slice(nPosition - 1, nPosition - 1 + nLength);

	return oSequence;
});

// fn:unordered($sourceSeq as item()*) as item()*
fStaticContext_defineSystemFunction("unordered",	[[cXTItem, '*']],	function(oSequence1) {
	return oSequence1;
});


// 15.2 Functions That Test the Cardinality of Sequences
// fn:zero-or-one($arg as item()*) as item()?
fStaticContext_defineSystemFunction("zero-or-one",	[[cXTItem, '*']],	function(oSequence1) {
	if (oSequence1.items.length > 1)
		throw new cException("FORG0003");

	return oSequence1;
});

// fn:one-or-more($arg as item()*) as item()+
fStaticContext_defineSystemFunction("one-or-more",	[[cXTItem, '*']],	function(oSequence1) {
	if (!oSequence1.items.length)
		throw new cException("FORG0004");

	return oSequence1;
});

// fn:exactly-one($arg as item()*) as item()
fStaticContext_defineSystemFunction("exactly-one",	[[cXTItem, '*']],	function(oSequence1) {
	if (oSequence1.items.length != 1)
		throw new cException("FORG0005");

	return oSequence1;
});


// 15.3 Equals, Union, Intersection and Except
// fn:deep-equal($parameter1 as item()*, $parameter2 as item()*) as xs:boolean
// fn:deep-equal($parameter1 as item()*, $parameter2 as item()*, $collation as string) as xs:boolean
fStaticContext_defineSystemFunction("deep-equal",	[[cXTItem, '*'], [cXTItem, '*'], [cXSString, '', true]],	function(oSequence1, oSequence2, oSequence3) {
	throw "Function '" + "deep-equal" + "' not implemented";
});


// 15.4 Aggregate Functions
// fn:count($arg as item()*) as xs:integer
fStaticContext_defineSystemFunction("count",	[[cXTItem, '*']],	function(oSequence1) {
	return new cXSInteger(oSequence1.items.length);
});

// fn:avg($arg as xs:anyAtomicType*) as xs:anyAtomicType?
fStaticContext_defineSystemFunction("avg",	[[cXSAnyAtomicType, '*']],	function(oSequence1) {
	if (!oSequence1.items.length)
		return null;

	//
	try {
		var vValue	= oSequence1.items[0];
		if (vValue instanceof cXSUntypedAtomic)
			vValue	= cXSDouble.cast(vValue);
		for (var nIndex = 1, nLength = oSequence1.items.length, vRight; nIndex < nLength; nIndex++) {
			vRight	= oSequence1.items[nIndex];
			if (vRight instanceof cXSUntypedAtomic)
				vRight	= cXSDouble.cast(vRight);
			vValue	= hAdditiveExpr_operators['+'](vValue, vRight, this);
		}
		return hMultiplicativeExpr_operators['div'](vValue, new cXSInteger(nLength), this);
	}
	catch (e) {
		// XPTY0004: Arithmetic operator is not defined for provided arguments
		throw e.code != "XPTY0004" ? e : new cException("FORG0006"
//->Debug
				, "Input to avg() contains a mix of types"
//<-Debug
		);
	}
});

// fn:max($arg as xs:anyAtomicType*) as xs:anyAtomicType?
// fn:max($arg as xs:anyAtomicType*, $collation as string) as xs:anyAtomicType?
fStaticContext_defineSystemFunction("max",	[[cXSAnyAtomicType, '*'], [cXSString, '', true]],	function(oSequence1, oSequence2) {
	if (!oSequence1.items.length)
		return null;

	// TODO: Implement collation

	//
	try {
		var vValue	= oSequence1.items[0];
		for (var nIndex = 1, nLength = oSequence1.items.length; nIndex < nLength; nIndex++)
			if (hComparisonExpr_ValueComp_operators['ge'](oSequence1.items[nIndex], vValue, this).valueOf())
				vValue	= oSequence1.items[nIndex];
		return vValue;
	}
	catch (e) {
		// XPTY0004: Cannot compare {type1} with {type2}
		throw e.code != "XPTY0004" ? e : new cException("FORG0006"
//->Debug
				, "Input to max() contains a mix of not comparable values"
//<-Debug
		);
	}
});

// fn:min($arg as xs:anyAtomicType*) as xs:anyAtomicType?
// fn:min($arg as xs:anyAtomicType*, $collation as string) as xs:anyAtomicType?
fStaticContext_defineSystemFunction("min",	[[cXSAnyAtomicType, '*'], [cXSString, '', true]],	function(oSequence1, oSequence2) {
	if (!oSequence1.items.length)
		return null;

	// TODO: Implement collation

	//
	try {
		var vValue	= oSequence1.items[0];
		for (var nIndex = 1, nLength = oSequence1.items.length; nIndex < nLength; nIndex++)
			if (hComparisonExpr_ValueComp_operators['le'](oSequence1.items[nIndex], vValue, this).valueOf())
				vValue	= oSequence1.items[nIndex];
		return vValue;
	}
	catch (e) {
		// Cannot compare {type1} with {type2}
		throw e.code != "XPTY0004" ? e : new cException("FORG0006"
//->Debug
				, "Input to min() contains a mix of not comparable values"
//<-Debug
		);
	}
});

// fn:sum($arg as xs:anyAtomicType*) as xs:anyAtomicType
// fn:sum($arg as xs:anyAtomicType*, $zero as xs:anyAtomicType?) as xs:anyAtomicType?
fStaticContext_defineSystemFunction("sum",	[[cXSAnyAtomicType, '*'], [cXSAnyAtomicType, '?', true]],	function(oSequence1, oSequence2) {
	if (!oSequence1.items.length) {
		if (arguments.length > 1) {
			if (oSequence2.items.length)
				return oSequence2.items[0];
		}
		else
			return new cXSDouble(0);

		return null;
	}

	// TODO: Implement collation

	//
	try {
		var vValue	= oSequence1.items[0];
		if (vValue instanceof cXSUntypedAtomic)
			vValue	= cXSDouble.cast(vValue);
		for (var nIndex = 1, nLength = oSequence1.items.length, vRight; nIndex < nLength; nIndex++) {
			vRight	= oSequence1.items[nIndex];
			if (vRight instanceof cXSUntypedAtomic)
				vRight	= cXSDouble.cast(vRight);
			vValue	= hAdditiveExpr_operators['+'](vValue, vRight, this);
		}
		return vValue;
	}
	catch (e) {
		// XPTY0004: Arithmetic operator is not defined for provided arguments
		throw e.code != "XPTY0004" ? e : new cException("FORG0006"
//->Debug
				, "Input to sum() contains a mix of types"
//<-Debug
		);
	}
});


// 15.5 Functions and Operators that Generate Sequences
// fn:id($arg as xs:string*) as element()*
// fn:id($arg as xs:string*, $node as node()) as element()*
fStaticContext_defineSystemFunction("id",	[[cXSString, '*'], [cXTNode, '', true]],	function(oSequence1, oSequence2) {
	if (arguments.length < 2) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "id() function called when the context item is not a node"
//<-Debug
			);
		oSequence2	= new cSequence(this.item);
	}

	// Get context item
	var oNode	= oSequence2.items[0];

	// Get root node and check if it is Document
	var oDocument	= hStaticContext_functions["root"].call(this, new cSequence(oNode));
	if (this.DOMAdapter.getProperty(oDocument, "nodeType") != 9)
		throw new cException("FODC0001");

	// Search for elements
	var oSequence	= new cSequence;
	for (var nIndex = 0; nIndex < oSequence1.items.length; nIndex++)
		for (var nRightIndex = 0, aValue = fString_trim(oSequence1.items[nIndex]).split(/\s+/), nRightLength = aValue.length; nRightIndex < nRightLength; nRightIndex++)
			if ((oNode = this.DOMAdapter.getElementById(oDocument, aValue[nRightIndex])) && fArray_indexOf(oSequence.items, oNode) ==-1)
				oSequence.items.push(oNode);
	//
	return fFunction_sequence_order(oSequence, this);
});

// fn:idref($arg as xs:string*) as node()*
// fn:idref($arg as xs:string*, $node as node()) as node()*
fStaticContext_defineSystemFunction("idref",	[[cXSString, '*'], [cXTNode, '', true]],	function(oSequence1, oSequence2) {
	throw "Function '" + "idref" + "' not implemented";
});

// fn:doc($uri as xs:string?) as document-node()?
fStaticContext_defineSystemFunction("doc",			[[cXSString, '?', true]],	function(oSequence1) {
	throw "Function '" + "doc" + "' not implemented";
});

// fn:doc-available($uri as xs:string?) as xs:boolean
fStaticContext_defineSystemFunction("doc-available",	[[cXSString, '?', true]],	function(oSequence1) {
	throw "Function '" + "doc-available" + "' not implemented";
});

// fn:collection() as node()*
// fn:collection($arg as xs:string?) as node()*
fStaticContext_defineSystemFunction("collection",	[[cXSString, '?', true]],	function(oSequence1) {
	throw "Function '" + "collection" + "' not implemented";
});

// fn:element-with-id($arg as xs:string*) as element()*
// fn:element-with-id($arg as xs:string*, $node as node()) as element()*
fStaticContext_defineSystemFunction("element-with-id",	[[cXSString, '*'], [cXTNode, '', true]],	function(oSequence1, oSequence2) {
	throw "Function '" + "element-with-id" + "' not implemented";
});

// EBV calculation
function fFunction_sequence_toEBV(oSequence1, oContext) {
	if (!oSequence1.items.length)
		return false;

	var oItem	= oSequence1.items[0];
	if (oContext.DOMAdapter.isNode(oItem))
		return true;

	if (oSequence1.items.length == 1) {
		if (oItem instanceof cXSBoolean)
			return oItem.value.valueOf();
		if (oItem instanceof cXSString)
			return !!oItem.valueOf().length;
		if (fXSAnyAtomicType_isNumeric(oItem))
			return !(fIsNaN(oItem.valueOf()) || oItem.valueOf() == 0);

		throw new cException("FORG0006"
//->Debug
				, "Effective boolean value is defined only for sequences containing booleans, strings, numbers, URIs, or nodes"
//<-Debug
		);
	}

	throw new cException("FORG0006"
//->Debug
			, "Effective boolean value is not defined for a sequence of two or more items"
//<-Debug
	);
};

function fFunction_sequence_atomize(oSequence1, oContext) {
	var oSequence	= new cSequence;
	for (var nIndex = 0, nLength = oSequence1.items.length, vValue; nIndex < nLength; nIndex++)
		if ((vValue = fXTItem_atomize(oSequence1.items[nIndex], oContext)) != null)
			oSequence.items.push(vValue);
	return oSequence;
};

// Orders items in sequence in document order
function fFunction_sequence_order(oSequence1, oContext) {
	var oSequence	= new cSequence(oSequence1);
	oSequence.items.sort(function(oNode, oNode2) {
		var nPosition	= oContext.DOMAdapter.compareDocumentPosition(oNode, oNode2);
		return nPosition & 2 ? 1 : nPosition & 4 ?-1 : 0;
	});
	return oSequence;
};