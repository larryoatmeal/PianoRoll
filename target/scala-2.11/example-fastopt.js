(function(){
'use strict';
/* Scala.js runtime support
 * Copyright 2013 LAMP/EPFL
 * Author: Sébastien Doeraene
 */

/* ---------------------------------- *
 * The top-level Scala.js environment *
 * ---------------------------------- */





// Get the environment info
var $env = (typeof __ScalaJSEnv === "object" && __ScalaJSEnv) ? __ScalaJSEnv : {};

// Global scope
var $g =
  (typeof $env["global"] === "object" && $env["global"])
    ? $env["global"]
    : ((typeof global === "object" && global && global["Object"] === Object) ? global : this);
$env["global"] = $g;

// Where to send exports
var $e =
  (typeof $env["exportsNamespace"] === "object" && $env["exportsNamespace"])
    ? $env["exportsNamespace"] : $g;
$env["exportsNamespace"] = $e;

// Freeze the environment info
$g["Object"]["freeze"]($env);

// Linking info - must be in sync with scala.scalajs.runtime.LinkingInfo
var $linkingInfo = {
  "semantics": {




    "asInstanceOfs": 1,










    "moduleInit": 2,





    "strictFloats": false

  },



  "assumingES6": false

};
$g["Object"]["freeze"]($linkingInfo);
$g["Object"]["freeze"]($linkingInfo["semantics"]);

// Snapshots of builtins and polyfills





var $imul = $g["Math"]["imul"] || (function(a, b) {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
});

var $fround = $g["Math"]["fround"] ||









  (function(v) {
    return +v;
  });



// Other fields
















var $lastIDHash = 0; // last value attributed to an id hash code



var $idHashCodeMap = $g["WeakMap"] ? new $g["WeakMap"]() : null;



// Core mechanism

var $makeIsArrayOfPrimitive = function(primitiveData) {
  return function(obj, depth) {
    return !!(obj && obj.$classData &&
      (obj.$classData.arrayDepth === depth) &&
      (obj.$classData.arrayBase === primitiveData));
  }
};


var $makeAsArrayOfPrimitive = function(isInstanceOfFunction, arrayEncodedName) {
  return function(obj, depth) {
    if (isInstanceOfFunction(obj, depth) || (obj === null))
      return obj;
    else
      $throwArrayCastException(obj, arrayEncodedName, depth);
  }
};


/** Encode a property name for runtime manipulation
  *  Usage:
  *    env.propertyName({someProp:0})
  *  Returns:
  *    "someProp"
  *  Useful when the property is renamed by a global optimizer (like Closure)
  *  but we must still get hold of a string of that name for runtime
  * reflection.
  */
var $propertyName = function(obj) {
  for (var prop in obj)
    return prop;
};

// Runtime functions

var $isScalaJSObject = function(obj) {
  return !!(obj && obj.$classData);
};


var $throwClassCastException = function(instance, classFullName) {




  throw new $c_sjsr_UndefinedBehaviorError().init___jl_Throwable(
    new $c_jl_ClassCastException().init___T(
      instance + " is not an instance of " + classFullName));

};

var $throwArrayCastException = function(instance, classArrayEncodedName, depth) {
  for (; depth; --depth)
    classArrayEncodedName = "[" + classArrayEncodedName;
  $throwClassCastException(instance, classArrayEncodedName);
};


var $noIsInstance = function(instance) {
  throw new $g["TypeError"](
    "Cannot call isInstance() on a Class representing a raw JS trait/object");
};

var $makeNativeArrayWrapper = function(arrayClassData, nativeArray) {
  return new arrayClassData.constr(nativeArray);
};

var $newArrayObject = function(arrayClassData, lengths) {
  return $newArrayObjectInternal(arrayClassData, lengths, 0);
};

var $newArrayObjectInternal = function(arrayClassData, lengths, lengthIndex) {
  var result = new arrayClassData.constr(lengths[lengthIndex]);

  if (lengthIndex < lengths.length-1) {
    var subArrayClassData = arrayClassData.componentData;
    var subLengthIndex = lengthIndex+1;
    var underlying = result.u;
    for (var i = 0; i < underlying.length; i++) {
      underlying[i] = $newArrayObjectInternal(
        subArrayClassData, lengths, subLengthIndex);
    }
  }

  return result;
};

var $checkNonNull = function(obj) {
  return obj !== null ? obj : $throwNullPointerException();
};

var $throwNullPointerException = function() {
  throw new $c_jl_NullPointerException().init___();
};

var $objectToString = function(instance) {
  if (instance === void 0)
    return "undefined";
  else
    return instance.toString();
};

var $objectGetClass = function(instance) {
  switch (typeof instance) {
    case "string":
      return $d_T.getClassOf();
    case "number": {
      var v = instance | 0;
      if (v === instance) { // is the value integral?
        if ($isByte(v))
          return $d_jl_Byte.getClassOf();
        else if ($isShort(v))
          return $d_jl_Short.getClassOf();
        else
          return $d_jl_Integer.getClassOf();
      } else {
        if ($isFloat(instance))
          return $d_jl_Float.getClassOf();
        else
          return $d_jl_Double.getClassOf();
      }
    }
    case "boolean":
      return $d_jl_Boolean.getClassOf();
    case "undefined":
      return $d_sr_BoxedUnit.getClassOf();
    default:
      if (instance === null)
        $throwNullPointerException();
      else if ($is_sjsr_RuntimeLong(instance))
        return $d_jl_Long.getClassOf();
      else if ($isScalaJSObject(instance))
        return instance.$classData.getClassOf();
      else
        return null; // Exception?
  }
};

var $objectClone = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.clone__O();
  else
    throw new $c_jl_CloneNotSupportedException().init___();
};

var $objectNotify = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notify__V();
};

var $objectNotifyAll = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notifyAll__V();
};

var $objectFinalize = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    instance.finalize__V();
  // else no-op
};

var $objectEquals = function(instance, rhs) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.equals__O__Z(rhs);
  else if (typeof instance === "number")
    return typeof rhs === "number" && $numberEquals(instance, rhs);
  else
    return instance === rhs;
};

var $numberEquals = function(lhs, rhs) {
  return (lhs === rhs) ? (
    // 0.0.equals(-0.0) must be false
    lhs !== 0 || 1/lhs === 1/rhs
  ) : (
    // are they both NaN?
    (lhs !== lhs) && (rhs !== rhs)
  );
};

var $objectHashCode = function(instance) {
  switch (typeof instance) {
    case "string":
      return $m_sjsr_RuntimeString$().hashCode__T__I(instance);
    case "number":
      return $m_sjsr_Bits$().numberHashCode__D__I(instance);
    case "boolean":
      return instance ? 1231 : 1237;
    case "undefined":
      return 0;
    default:
      if ($isScalaJSObject(instance) || instance === null)
        return instance.hashCode__I();

      else if ($idHashCodeMap === null)
        return 42;

      else
        return $systemIdentityHashCode(instance);
  }
};

var $comparableCompareTo = function(instance, rhs) {
  switch (typeof instance) {
    case "string":

      $as_T(rhs);

      return instance === rhs ? 0 : (instance < rhs ? -1 : 1);
    case "number":

      $as_jl_Number(rhs);

      return $m_jl_Double$().compare__D__D__I(instance, rhs);
    case "boolean":

      $asBoolean(rhs);

      return instance - rhs; // yes, this gives the right result
    default:
      return instance.compareTo__O__I(rhs);
  }
};

var $charSequenceLength = function(instance) {
  if (typeof(instance) === "string")

    return $uI(instance["length"]);



  else
    return instance.length__I();
};

var $charSequenceCharAt = function(instance, index) {
  if (typeof(instance) === "string")

    return $uI(instance["charCodeAt"](index)) & 0xffff;



  else
    return instance.charAt__I__C(index);
};

var $charSequenceSubSequence = function(instance, start, end) {
  if (typeof(instance) === "string")

    return $as_T(instance["substring"](start, end));



  else
    return instance.subSequence__I__I__jl_CharSequence(start, end);
};

var $booleanBooleanValue = function(instance) {
  if (typeof instance === "boolean") return instance;
  else                               return instance.booleanValue__Z();
};

var $numberByteValue = function(instance) {
  if (typeof instance === "number") return (instance << 24) >> 24;
  else                              return instance.byteValue__B();
};
var $numberShortValue = function(instance) {
  if (typeof instance === "number") return (instance << 16) >> 16;
  else                              return instance.shortValue__S();
};
var $numberIntValue = function(instance) {
  if (typeof instance === "number") return instance | 0;
  else                              return instance.intValue__I();
};
var $numberLongValue = function(instance) {
  if (typeof instance === "number")
    return $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong(instance);
  else
    return instance.longValue__J();
};
var $numberFloatValue = function(instance) {
  if (typeof instance === "number") return $fround(instance);
  else                              return instance.floatValue__F();
};
var $numberDoubleValue = function(instance) {
  if (typeof instance === "number") return instance;
  else                              return instance.doubleValue__D();
};

var $isNaN = function(instance) {
  return instance !== instance;
};

var $isInfinite = function(instance) {
  return !$g["isFinite"](instance) && !$isNaN(instance);
};

var $doubleToInt = function(x) {
  return (x > 2147483647) ? (2147483647) : ((x < -2147483648) ? -2147483648 : (x | 0));
};

/** Instantiates a JS object with variadic arguments to the constructor. */
var $newJSObjectWithVarargs = function(ctor, args) {
  // This basically emulates the ECMAScript specification for 'new'.
  var instance = $g["Object"]["create"](ctor.prototype);
  var result = ctor["apply"](instance, args);
  switch (typeof result) {
    case "string": case "number": case "boolean": case "undefined": case "symbol":
      return instance;
    default:
      return result === null ? instance : result;
  }
};

var $resolveSuperRef = function(initialProto, propName) {
  var getPrototypeOf = $g["Object"]["getPrototypeOf"];
  var getOwnPropertyDescriptor = $g["Object"]["getOwnPropertyDescriptor"];

  var superProto = getPrototypeOf(initialProto);
  while (superProto !== null) {
    var desc = getOwnPropertyDescriptor(superProto, propName);
    if (desc !== void 0)
      return desc;
    superProto = getPrototypeOf(superProto);
  }

  return void 0;
};

var $superGet = function(initialProto, self, propName) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var getter = desc["get"];
    if (getter !== void 0)
      return getter["call"](self);
    else
      return desc["value"];
  }
  return void 0;
};

var $superSet = function(initialProto, self, propName, value) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var setter = desc["set"];
    if (setter !== void 0) {
      setter["call"](self, value);
      return void 0;
    }
  }
  throw new $g["TypeError"]("super has no setter '" + propName + "'.");
};

var $propertiesOf = function(obj) {
  var result = [];
  for (var prop in obj)
    result["push"](prop);
  return result;
};

var $systemArraycopy = function(src, srcPos, dest, destPos, length) {
  var srcu = src.u;
  var destu = dest.u;
  if (srcu !== destu || destPos < srcPos || srcPos + length < destPos) {
    for (var i = 0; i < length; i++)
      destu[destPos+i] = srcu[srcPos+i];
  } else {
    for (var i = length-1; i >= 0; i--)
      destu[destPos+i] = srcu[srcPos+i];
  }
};

var $systemIdentityHashCode =

  ($idHashCodeMap !== null) ?

  (function(obj) {
    switch (typeof obj) {
      case "string": case "number": case "boolean": case "undefined":
        return $objectHashCode(obj);
      default:
        if (obj === null) {
          return 0;
        } else {
          var hash = $idHashCodeMap["get"](obj);
          if (hash === void 0) {
            hash = ($lastIDHash + 1) | 0;
            $lastIDHash = hash;
            $idHashCodeMap["set"](obj, hash);
          }
          return hash;
        }
    }

  }) :
  (function(obj) {
    if ($isScalaJSObject(obj)) {
      var hash = obj["$idHashCode$0"];
      if (hash !== void 0) {
        return hash;
      } else if (!$g["Object"]["isSealed"](obj)) {
        hash = ($lastIDHash + 1) | 0;
        $lastIDHash = hash;
        obj["$idHashCode$0"] = hash;
        return hash;
      } else {
        return 42;
      }
    } else if (obj === null) {
      return 0;
    } else {
      return $objectHashCode(obj);
    }

  });

// is/as for hijacked boxed classes (the non-trivial ones)

var $isByte = function(v) {
  return (v << 24 >> 24) === v && 1/v !== 1/-0;
};

var $isShort = function(v) {
  return (v << 16 >> 16) === v && 1/v !== 1/-0;
};

var $isInt = function(v) {
  return (v | 0) === v && 1/v !== 1/-0;
};

var $isFloat = function(v) {



  return typeof v === "number";

};


var $asUnit = function(v) {
  if (v === void 0 || v === null)
    return v;
  else
    $throwClassCastException(v, "scala.runtime.BoxedUnit");
};

var $asBoolean = function(v) {
  if (typeof v === "boolean" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Boolean");
};

var $asByte = function(v) {
  if ($isByte(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Byte");
};

var $asShort = function(v) {
  if ($isShort(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Short");
};

var $asInt = function(v) {
  if ($isInt(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Integer");
};

var $asFloat = function(v) {
  if ($isFloat(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Float");
};

var $asDouble = function(v) {
  if (typeof v === "number" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Double");
};


// Unboxes


var $uZ = function(value) {
  return !!$asBoolean(value);
};
var $uB = function(value) {
  return $asByte(value) | 0;
};
var $uS = function(value) {
  return $asShort(value) | 0;
};
var $uI = function(value) {
  return $asInt(value) | 0;
};
var $uJ = function(value) {
  return null === value ? $m_sjsr_RuntimeLong$().Zero$1
                        : $as_sjsr_RuntimeLong(value);
};
var $uF = function(value) {
  /* Here, it is fine to use + instead of fround, because asFloat already
   * ensures that the result is either null or a float.
   */
  return +$asFloat(value);
};
var $uD = function(value) {
  return +$asDouble(value);
};






// TypeArray conversions

var $byteArray2TypedArray = function(value) { return new $g["Int8Array"](value.u); };
var $shortArray2TypedArray = function(value) { return new $g["Int16Array"](value.u); };
var $charArray2TypedArray = function(value) { return new $g["Uint16Array"](value.u); };
var $intArray2TypedArray = function(value) { return new $g["Int32Array"](value.u); };
var $floatArray2TypedArray = function(value) { return new $g["Float32Array"](value.u); };
var $doubleArray2TypedArray = function(value) { return new $g["Float64Array"](value.u); };

var $typedArray2ByteArray = function(value) {
  var arrayClassData = $d_B.getArrayOf();
  return new arrayClassData.constr(new $g["Int8Array"](value));
};
var $typedArray2ShortArray = function(value) {
  var arrayClassData = $d_S.getArrayOf();
  return new arrayClassData.constr(new $g["Int16Array"](value));
};
var $typedArray2CharArray = function(value) {
  var arrayClassData = $d_C.getArrayOf();
  return new arrayClassData.constr(new $g["Uint16Array"](value));
};
var $typedArray2IntArray = function(value) {
  var arrayClassData = $d_I.getArrayOf();
  return new arrayClassData.constr(new $g["Int32Array"](value));
};
var $typedArray2FloatArray = function(value) {
  var arrayClassData = $d_F.getArrayOf();
  return new arrayClassData.constr(new $g["Float32Array"](value));
};
var $typedArray2DoubleArray = function(value) {
  var arrayClassData = $d_D.getArrayOf();
  return new arrayClassData.constr(new $g["Float64Array"](value));
};

/* We have to force a non-elidable *read* of $e, otherwise Closure will
 * eliminate it altogether, along with all the exports, which is ... er ...
 * plain wrong.
 */
this["__ScalaJSExportsNamespace"] = $e;

// TypeData class


/** @constructor */
var $TypeData = function() {




  // Runtime support
  this.constr = void 0;
  this.parentData = void 0;
  this.ancestors = null;
  this.componentData = null;
  this.arrayBase = null;
  this.arrayDepth = 0;
  this.zero = null;
  this.arrayEncodedName = "";
  this._classOf = void 0;
  this._arrayOf = void 0;
  this.isArrayOf = void 0;

  // java.lang.Class support
  this["name"] = "";
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = false;
  this["isRawJSType"] = false;
  this["isInstance"] = void 0;
};


$TypeData.prototype.initPrim = function(



    zero, arrayEncodedName, displayName) {
  // Runtime support
  this.ancestors = {};
  this.componentData = null;
  this.zero = zero;
  this.arrayEncodedName = arrayEncodedName;
  this.isArrayOf = function(obj, depth) { return false; };

  // java.lang.Class support
  this["name"] = displayName;
  this["isPrimitive"] = true;
  this["isInstance"] = function(obj) { return false; };

  return this;
};


$TypeData.prototype.initClass = function(



    internalNameObj, isInterface, fullName,
    ancestors, isRawJSType, parentData, isInstance, isArrayOf) {
  var internalName = $propertyName(internalNameObj);

  isInstance = isInstance || function(obj) {
    return !!(obj && obj.$classData && obj.$classData.ancestors[internalName]);
  };

  isArrayOf = isArrayOf || function(obj, depth) {
    return !!(obj && obj.$classData && (obj.$classData.arrayDepth === depth)
      && obj.$classData.arrayBase.ancestors[internalName])
  };

  // Runtime support
  this.parentData = parentData;
  this.ancestors = ancestors;
  this.arrayEncodedName = "L"+fullName+";";
  this.isArrayOf = isArrayOf;

  // java.lang.Class support
  this["name"] = fullName;
  this["isInterface"] = isInterface;
  this["isRawJSType"] = !!isRawJSType;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.initArray = function(



    componentData) {
  // The constructor

  var componentZero0 = componentData.zero;

  // The zero for the Long runtime representation
  // is a special case here, since the class has not
  // been defined yet, when this file is read
  var componentZero = (componentZero0 == "longZero")
    ? $m_sjsr_RuntimeLong$().Zero$1
    : componentZero0;


  /** @constructor */
  var ArrayClass = function(arg) {
    if (typeof(arg) === "number") {
      // arg is the length of the array
      this.u = new Array(arg);
      for (var i = 0; i < arg; i++)
        this.u[i] = componentZero;
    } else {
      // arg is a native array that we wrap
      this.u = arg;
    }
  }
  ArrayClass.prototype = new $h_O;
  ArrayClass.prototype.constructor = ArrayClass;

  ArrayClass.prototype.clone__O = function() {
    if (this.u instanceof Array)
      return new ArrayClass(this.u["slice"](0));
    else
      // The underlying Array is a TypedArray
      return new ArrayClass(new this.u.constructor(this.u));
  };

























  ArrayClass.prototype.$classData = this;

  // Don't generate reflective call proxies. The compiler special cases
  // reflective calls to methods on scala.Array

  // The data

  var encodedName = "[" + componentData.arrayEncodedName;
  var componentBase = componentData.arrayBase || componentData;
  var arrayDepth = componentData.arrayDepth + 1;

  var isInstance = function(obj) {
    return componentBase.isArrayOf(obj, arrayDepth);
  }

  // Runtime support
  this.constr = ArrayClass;
  this.parentData = $d_O;
  this.ancestors = {O: 1};
  this.componentData = componentData;
  this.arrayBase = componentBase;
  this.arrayDepth = arrayDepth;
  this.zero = null;
  this.arrayEncodedName = encodedName;
  this._classOf = undefined;
  this._arrayOf = undefined;
  this.isArrayOf = undefined;

  // java.lang.Class support
  this["name"] = encodedName;
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = true;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.getClassOf = function() {



  if (!this._classOf)
    this._classOf = new $c_jl_Class().init___jl_ScalaJSClassData(this);
  return this._classOf;
};


$TypeData.prototype.getArrayOf = function() {



  if (!this._arrayOf)
    this._arrayOf = new $TypeData().initArray(this);
  return this._arrayOf;
};

// java.lang.Class support


$TypeData.prototype["getFakeInstance"] = function() {



  if (this === $d_T)
    return "some string";
  else if (this === $d_jl_Boolean)
    return false;
  else if (this === $d_jl_Byte ||
           this === $d_jl_Short ||
           this === $d_jl_Integer ||
           this === $d_jl_Float ||
           this === $d_jl_Double)
    return 0;
  else if (this === $d_jl_Long)
    return $m_sjsr_RuntimeLong$().Zero$1;
  else if (this === $d_sr_BoxedUnit)
    return void 0;
  else
    return {$classData: this};
};


$TypeData.prototype["getSuperclass"] = function() {



  return this.parentData ? this.parentData.getClassOf() : null;
};


$TypeData.prototype["getComponentType"] = function() {



  return this.componentData ? this.componentData.getClassOf() : null;
};


$TypeData.prototype["newArrayOfThisClass"] = function(lengths) {



  var arrayClassData = this;
  for (var i = 0; i < lengths.length; i++)
    arrayClassData = arrayClassData.getArrayOf();
  return $newArrayObject(arrayClassData, lengths);
};




// Create primitive types

var $d_V = new $TypeData().initPrim(undefined, "V", "void");
var $d_Z = new $TypeData().initPrim(false, "Z", "boolean");
var $d_C = new $TypeData().initPrim(0, "C", "char");
var $d_B = new $TypeData().initPrim(0, "B", "byte");
var $d_S = new $TypeData().initPrim(0, "S", "short");
var $d_I = new $TypeData().initPrim(0, "I", "int");
var $d_J = new $TypeData().initPrim("longZero", "J", "long");
var $d_F = new $TypeData().initPrim(0.0, "F", "float");
var $d_D = new $TypeData().initPrim(0.0, "D", "double");

// Instance tests for array of primitives

var $isArrayOf_Z = $makeIsArrayOfPrimitive($d_Z);
$d_Z.isArrayOf = $isArrayOf_Z;

var $isArrayOf_C = $makeIsArrayOfPrimitive($d_C);
$d_C.isArrayOf = $isArrayOf_C;

var $isArrayOf_B = $makeIsArrayOfPrimitive($d_B);
$d_B.isArrayOf = $isArrayOf_B;

var $isArrayOf_S = $makeIsArrayOfPrimitive($d_S);
$d_S.isArrayOf = $isArrayOf_S;

var $isArrayOf_I = $makeIsArrayOfPrimitive($d_I);
$d_I.isArrayOf = $isArrayOf_I;

var $isArrayOf_J = $makeIsArrayOfPrimitive($d_J);
$d_J.isArrayOf = $isArrayOf_J;

var $isArrayOf_F = $makeIsArrayOfPrimitive($d_F);
$d_F.isArrayOf = $isArrayOf_F;

var $isArrayOf_D = $makeIsArrayOfPrimitive($d_D);
$d_D.isArrayOf = $isArrayOf_D;


// asInstanceOfs for array of primitives
var $asArrayOf_Z = $makeAsArrayOfPrimitive($isArrayOf_Z, "Z");
var $asArrayOf_C = $makeAsArrayOfPrimitive($isArrayOf_C, "C");
var $asArrayOf_B = $makeAsArrayOfPrimitive($isArrayOf_B, "B");
var $asArrayOf_S = $makeAsArrayOfPrimitive($isArrayOf_S, "S");
var $asArrayOf_I = $makeAsArrayOfPrimitive($isArrayOf_I, "I");
var $asArrayOf_J = $makeAsArrayOfPrimitive($isArrayOf_J, "J");
var $asArrayOf_F = $makeAsArrayOfPrimitive($isArrayOf_F, "F");
var $asArrayOf_D = $makeAsArrayOfPrimitive($isArrayOf_D, "D");

function $is_F0(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.F0)))
}
function $as_F0(obj) {
  return (($is_F0(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Function0"))
}
function $isArrayOf_F0(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.F0)))
}
function $asArrayOf_F0(obj, depth) {
  return (($isArrayOf_F0(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Function0;", depth))
}
function $is_Lexample_PlayerListener(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_PlayerListener)))
}
function $as_Lexample_PlayerListener(obj) {
  return (($is_Lexample_PlayerListener(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.PlayerListener"))
}
function $isArrayOf_Lexample_PlayerListener(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_PlayerListener)))
}
function $asArrayOf_Lexample_PlayerListener(obj, depth) {
  return (($isArrayOf_Lexample_PlayerListener(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.PlayerListener;", depth))
}
function $is_Ljava_io_Closeable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_Closeable)))
}
function $as_Ljava_io_Closeable(obj) {
  return (($is_Ljava_io_Closeable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.Closeable"))
}
function $isArrayOf_Ljava_io_Closeable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_Closeable)))
}
function $asArrayOf_Ljava_io_Closeable(obj, depth) {
  return (($isArrayOf_Ljava_io_Closeable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.Closeable;", depth))
}
/** @constructor */
function $c_O() {
  /*<skip>*/
}
/** @constructor */
function $h_O() {
  /*<skip>*/
}
$h_O.prototype = $c_O.prototype;
$c_O.prototype.init___ = (function() {
  return this
});
$c_O.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_O.prototype.toString__T = (function() {
  var jsx$2 = $objectGetClass(this).getName__T();
  var i = this.hashCode__I();
  var x = $uD((i >>> 0));
  var jsx$1 = x["toString"](16);
  return ((jsx$2 + "@") + $as_T(jsx$1))
});
$c_O.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
$c_O.prototype["toString"] = (function() {
  return this.toString__T()
});
function $is_O(obj) {
  return (obj !== null)
}
function $as_O(obj) {
  return obj
}
function $isArrayOf_O(obj, depth) {
  var data = (obj && obj.$classData);
  if ((!data)) {
    return false
  } else {
    var arrayDepth = (data.arrayDepth || 0);
    return ((!(arrayDepth < depth)) && ((arrayDepth > depth) || (!data.arrayBase["isPrimitive"])))
  }
}
function $asArrayOf_O(obj, depth) {
  return (($isArrayOf_O(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Object;", depth))
}
var $d_O = new $TypeData().initClass({
  O: 0
}, false, "java.lang.Object", {
  O: 1
}, (void 0), (void 0), $is_O, $isArrayOf_O);
$c_O.prototype.$classData = $d_O;
function $is_jl_CharSequence(obj) {
  return (!(!(((obj && obj.$classData) && obj.$classData.ancestors.jl_CharSequence) || ((typeof obj) === "string"))))
}
function $as_jl_CharSequence(obj) {
  return (($is_jl_CharSequence(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.CharSequence"))
}
function $isArrayOf_jl_CharSequence(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_CharSequence)))
}
function $asArrayOf_jl_CharSequence(obj, depth) {
  return (($isArrayOf_jl_CharSequence(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.CharSequence;", depth))
}
function $is_ju_Formattable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.ju_Formattable)))
}
function $as_ju_Formattable(obj) {
  return (($is_ju_Formattable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.util.Formattable"))
}
function $isArrayOf_ju_Formattable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.ju_Formattable)))
}
function $asArrayOf_ju_Formattable(obj, depth) {
  return (($isArrayOf_ju_Formattable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.util.Formattable;", depth))
}
function $is_sc_GenTraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversableOnce)))
}
function $as_sc_GenTraversableOnce(obj) {
  return (($is_sc_GenTraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversableOnce"))
}
function $isArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversableOnce)))
}
function $asArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (($isArrayOf_sc_GenTraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversableOnce;", depth))
}
/** @constructor */
function $c_Lexample_HTML5InputManager() {
  $c_O.call(this);
  this.canvas$1 = null;
  this.inputProcessor$1 = null;
  this.boundingRect$1 = null
}
$c_Lexample_HTML5InputManager.prototype = new $h_O();
$c_Lexample_HTML5InputManager.prototype.constructor = $c_Lexample_HTML5InputManager;
/** @constructor */
function $h_Lexample_HTML5InputManager() {
  /*<skip>*/
}
$h_Lexample_HTML5InputManager.prototype = $c_Lexample_HTML5InputManager.prototype;
$c_Lexample_HTML5InputManager.prototype.init___Lorg_scalajs_dom_raw_HTMLCanvasElement = (function(canvas) {
  this.canvas$1 = canvas;
  this.inputProcessor$1 = null;
  this.boundingRect$1 = canvas["getBoundingClientRect"]();
  canvas["setAttribute"]("tabIndex", "0");
  canvas["focus"]();
  this.registerEventHandlers__p1__V();
  return this
});
$c_Lexample_HTML5InputManager.prototype.example$HTML5InputManager$$getRelativeY__Lorg_scalajs_dom_raw_MouseEvent__D = (function(e) {
  return ($uD(e["clientY"]) - $uD(this.boundingRect$1["top"]))
});
$c_Lexample_HTML5InputManager.prototype.example$HTML5InputManager$$getRelativeX__Lorg_scalajs_dom_raw_MouseEvent__D = (function(e) {
  return ($uD(e["clientX"]) - $uD(this.boundingRect$1["left"]))
});
$c_Lexample_HTML5InputManager.prototype.registerEventHandlers__p1__V = (function() {
  $m_Lexample_Logger$().verbose__T__jl_Class__V("Registering event handlers", $objectGetClass(this));
  this.canvas$1["onmousedown"] = (function(arg$outer) {
    return (function(e$2) {
      if ((arg$outer.inputProcessor$1 !== null)) {
        arg$outer.inputProcessor$1.onMouseDown__D__D__V(arg$outer.example$HTML5InputManager$$getRelativeX__Lorg_scalajs_dom_raw_MouseEvent__D(e$2), arg$outer.example$HTML5InputManager$$getRelativeY__Lorg_scalajs_dom_raw_MouseEvent__D(e$2))
      }
    })
  })(this);
  this.canvas$1["onmousemove"] = (function(arg$outer$1) {
    return (function(e$2$1) {
      if ((arg$outer$1.inputProcessor$1 !== null)) {
        var this$1 = arg$outer$1.inputProcessor$1;
        var x = arg$outer$1.example$HTML5InputManager$$getRelativeX__Lorg_scalajs_dom_raw_MouseEvent__D(e$2$1);
        var y = arg$outer$1.example$HTML5InputManager$$getRelativeY__Lorg_scalajs_dom_raw_MouseEvent__D(e$2$1);
        $s_Lexample_InputProcessor$class__onMouseMove__Lexample_InputProcessor__D__D__V(this$1, x, y)
      }
    })
  })(this);
  this.canvas$1["onmouseup"] = (function(arg$outer$2) {
    return (function(e$2$2) {
      if ((arg$outer$2.inputProcessor$1 !== null)) {
        var this$2 = arg$outer$2.inputProcessor$1;
        arg$outer$2.example$HTML5InputManager$$getRelativeX__Lorg_scalajs_dom_raw_MouseEvent__D(e$2$2);
        arg$outer$2.example$HTML5InputManager$$getRelativeY__Lorg_scalajs_dom_raw_MouseEvent__D(e$2$2);
        this$2.example$InputProcessor$$mouseDown$1 = false
      }
    })
  })(this);
  this.canvas$1["onkeydown"] = (function(arg$outer$3) {
    return (function(e$2$3) {
      if ((arg$outer$3.inputProcessor$1 !== null)) {
        if ($uZ(e$2$3["shiftKey"])) {
          arg$outer$3.inputProcessor$1.onKeyWithShift__I__V($uI(e$2$3["keyCode"]))
        } else {
          if (($uI(e$2$3["keyCode"]) === $m_Lexample_KeyCode$().BACKSPACE$1)) {
            e$2$3["preventDefault"]()
          };
          arg$outer$3.inputProcessor$1.onKey__I__V($uI(e$2$3["keyCode"]))
        }
      }
    })
  })(this);
  this.canvas$1["onmousewheel"] = (function(e$2$4) {
    e$2$4["preventDefault"]()
  })
});
var $d_Lexample_HTML5InputManager = new $TypeData().initClass({
  Lexample_HTML5InputManager: 0
}, false, "example.HTML5InputManager", {
  Lexample_HTML5InputManager: 1,
  O: 1
});
$c_Lexample_HTML5InputManager.prototype.$classData = $d_Lexample_HTML5InputManager;
function $s_Lexample_InputProcessor$class__onMouseDown__Lexample_InputProcessor__D__D__V($$this, x, y) {
  $$this.example$InputProcessor$$mouseDown$1 = true;
  $$this.example$InputProcessor$$mouseDownX$1 = x;
  $$this.example$InputProcessor$$mouseDownY$1 = y
}
function $s_Lexample_InputProcessor$class__$$init$__Lexample_InputProcessor__V($$this) {
  $$this.example$InputProcessor$$mouseDown$1 = false;
  $$this.example$InputProcessor$$mouseDownX$1 = (-1.0);
  $$this.example$InputProcessor$$mouseDownY$1 = (-1.0)
}
function $s_Lexample_InputProcessor$class__onMouseMove__Lexample_InputProcessor__D__D__V($$this, x, y) {
  if ($$this.example$InputProcessor$$mouseDown$1) {
    $$this.onDrag__D__D__D__D__V(x, y, $$this.example$InputProcessor$$mouseDownX$1, $$this.example$InputProcessor$$mouseDownY$1)
  }
}
/** @constructor */
function $c_Lexample_KeyCode$() {
  $c_O.call(this);
  this.DOWN$1 = 0;
  this.UP$1 = 0;
  this.LEFT$1 = 0;
  this.RIGHT$1 = 0;
  this.A$1 = 0;
  this.B$1 = 0;
  this.C$1 = 0;
  this.D$1 = 0;
  this.E$1 = 0;
  this.F$1 = 0;
  this.G$1 = 0;
  this.H$1 = 0;
  this.I$1 = 0;
  this.J$1 = 0;
  this.K$1 = 0;
  this.L$1 = 0;
  this.M$1 = 0;
  this.N$1 = 0;
  this.O$1 = 0;
  this.P$1 = 0;
  this.Q$1 = 0;
  this.R$1 = 0;
  this.S$1 = 0;
  this.T$1 = 0;
  this.U$1 = 0;
  this.V$1 = 0;
  this.W$1 = 0;
  this.X$1 = 0;
  this.Y$1 = 0;
  this.Z$1 = 0;
  this.BACKSPACE$1 = 0;
  this.SPACE$1 = 0
}
$c_Lexample_KeyCode$.prototype = new $h_O();
$c_Lexample_KeyCode$.prototype.constructor = $c_Lexample_KeyCode$;
/** @constructor */
function $h_Lexample_KeyCode$() {
  /*<skip>*/
}
$h_Lexample_KeyCode$.prototype = $c_Lexample_KeyCode$.prototype;
$c_Lexample_KeyCode$.prototype.init___ = (function() {
  $n_Lexample_KeyCode$ = this;
  this.DOWN$1 = 40;
  this.UP$1 = 38;
  this.LEFT$1 = 37;
  this.RIGHT$1 = 39;
  this.A$1 = 65;
  this.B$1 = 66;
  this.C$1 = 67;
  this.D$1 = 68;
  this.E$1 = 69;
  this.F$1 = 70;
  this.G$1 = 71;
  this.H$1 = 72;
  this.I$1 = 73;
  this.J$1 = 74;
  this.K$1 = 75;
  this.L$1 = 76;
  this.M$1 = 77;
  this.N$1 = 78;
  this.O$1 = 79;
  this.P$1 = 80;
  this.Q$1 = 81;
  this.R$1 = 82;
  this.S$1 = 83;
  this.T$1 = 84;
  this.U$1 = 85;
  this.V$1 = 86;
  this.W$1 = 87;
  this.X$1 = 88;
  this.Y$1 = 90;
  this.Z$1 = 91;
  this.BACKSPACE$1 = 8;
  this.SPACE$1 = 32;
  return this
});
var $d_Lexample_KeyCode$ = new $TypeData().initClass({
  Lexample_KeyCode$: 0
}, false, "example.KeyCode$", {
  Lexample_KeyCode$: 1,
  O: 1
});
$c_Lexample_KeyCode$.prototype.$classData = $d_Lexample_KeyCode$;
var $n_Lexample_KeyCode$ = (void 0);
function $m_Lexample_KeyCode$() {
  if ((!$n_Lexample_KeyCode$)) {
    $n_Lexample_KeyCode$ = new $c_Lexample_KeyCode$().init___()
  };
  return $n_Lexample_KeyCode$
}
/** @constructor */
function $c_Lexample_Logger() {
  $c_O.call(this);
  this.clazz$1 = null
}
$c_Lexample_Logger.prototype = new $h_O();
$c_Lexample_Logger.prototype.constructor = $c_Lexample_Logger;
/** @constructor */
function $h_Lexample_Logger() {
  /*<skip>*/
}
$h_Lexample_Logger.prototype = $c_Lexample_Logger.prototype;
$c_Lexample_Logger.prototype.apply__T__V = (function(msg) {
  $m_Lexample_Logger$().debug__T__jl_Class__V(msg, this.clazz$1)
});
$c_Lexample_Logger.prototype.init___O = (function(thing) {
  $c_Lexample_Logger.prototype.init___jl_Class.call(this, $objectGetClass(thing));
  return this
});
$c_Lexample_Logger.prototype.init___jl_Class = (function(clazz) {
  this.clazz$1 = clazz;
  return this
});
var $d_Lexample_Logger = new $TypeData().initClass({
  Lexample_Logger: 0
}, false, "example.Logger", {
  Lexample_Logger: 1,
  O: 1
});
$c_Lexample_Logger.prototype.$classData = $d_Lexample_Logger;
/** @constructor */
function $c_Lexample_Logger$() {
  $c_O.call(this)
}
$c_Lexample_Logger$.prototype = new $h_O();
$c_Lexample_Logger$.prototype.constructor = $c_Lexample_Logger$;
/** @constructor */
function $h_Lexample_Logger$() {
  /*<skip>*/
}
$h_Lexample_Logger$.prototype = $c_Lexample_Logger$.prototype;
$c_Lexample_Logger$.prototype.debug__T__jl_Class__V = (function(msg, clazz) {
  var x = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["DEBUG:", " - ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([clazz.getName__T(), msg]));
  var this$2 = $m_s_Console$();
  var this$3 = this$2.outVar$2;
  $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V(x)
});
$c_Lexample_Logger$.prototype.warn__T__jl_Class__V = (function(msg, clazz) {
  var x = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["WARN:", " - ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([clazz.getName__T(), msg]));
  var this$2 = $m_s_Console$();
  var this$3 = this$2.outVar$2;
  $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V(x)
});
$c_Lexample_Logger$.prototype.verbose__T__jl_Class__V = (function(msg, clazz) {
  var x = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["VERBOSE:", " - ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([clazz.getName__T(), msg]));
  var this$2 = $m_s_Console$();
  var this$3 = this$2.outVar$2;
  $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V(x)
});
var $d_Lexample_Logger$ = new $TypeData().initClass({
  Lexample_Logger$: 0
}, false, "example.Logger$", {
  Lexample_Logger$: 1,
  O: 1
});
$c_Lexample_Logger$.prototype.$classData = $d_Lexample_Logger$;
var $n_Lexample_Logger$ = (void 0);
function $m_Lexample_Logger$() {
  if ((!$n_Lexample_Logger$)) {
    $n_Lexample_Logger$ = new $c_Lexample_Logger$().init___()
  };
  return $n_Lexample_Logger$
}
/** @constructor */
function $c_Lexample_MenuRenderer() {
  $c_O.call(this);
  this.ctx$1 = null;
  this.rect$1 = null;
  this.example$MenuRenderer$$messageQueue$f = null;
  this.playButton$1 = null;
  this.stopButton$1 = null;
  this.pauseButton$1 = null;
  this.endButton$1 = null;
  this.beginButton$1 = null;
  this.playPauseButton$1 = null;
  this.playbackPanel$1 = null;
  this.pencilButtonInactive$1 = null;
  this.pencilButtonActive$1 = null;
  this.pencilButton$1 = null;
  this.selectButtonInactive$1 = null;
  this.selectButtonActive$1 = null;
  this.selectButton$1 = null;
  this.toolPanel$1 = null;
  this.helpButton$1 = null;
  this.masterContainer$1 = null
}
$c_Lexample_MenuRenderer.prototype = new $h_O();
$c_Lexample_MenuRenderer.prototype.constructor = $c_Lexample_MenuRenderer;
/** @constructor */
function $h_Lexample_MenuRenderer() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer.prototype = $c_Lexample_MenuRenderer.prototype;
$c_Lexample_MenuRenderer.prototype.selectToolExternal__I__V = (function(toolMessage) {
  this.resetToolPanel__V();
  if (($m_Lexample_MessageQueue$().TOOL$undPENCIL$1 === toolMessage)) {
    var this$1 = this.pencilButton$1;
    this$1.isActive$2 = true
  } else if (($m_Lexample_MessageQueue$().TOOL$undSELECT$1 === toolMessage)) {
    var this$2 = this.selectButton$1;
    this$2.isActive$2 = true
  } else {
    throw new $c_s_MatchError().init___O(toolMessage)
  }
});
$c_Lexample_MenuRenderer.prototype.resetToolPanel__V = (function() {
  var this$1 = this.toolPanel$1;
  var this$2 = this$1.iterator__sci_VectorIterator();
  while (this$2.$$undhasNext$2) {
    var arg1 = this$2.next__O();
    var x$1 = $as_Lexample_ActiveInactiveImage(arg1);
    x$1.isActive$2 = false
  }
});
$c_Lexample_MenuRenderer.prototype.init___Lorg_scalajs_dom_raw_CanvasRenderingContext2D__Lexample_Rectangle__Lexample_MessageQueue = (function(ctx, rect, messageQueue) {
  this.ctx$1 = ctx;
  this.rect$1 = rect;
  this.example$MenuRenderer$$messageQueue$f = messageQueue;
  this.playButton$1 = new $c_Lexample_MenuRenderer$$anon$1().init___Lexample_MenuRenderer(this);
  this.stopButton$1 = new $c_Lexample_MenuRenderer$$anon$2().init___Lexample_MenuRenderer(this);
  this.pauseButton$1 = new $c_Lexample_MenuRenderer$$anon$3().init___Lexample_MenuRenderer(this);
  this.endButton$1 = new $c_Lexample_MenuRenderer$$anon$4().init___Lexample_MenuRenderer(this);
  this.beginButton$1 = new $c_Lexample_MenuRenderer$$anon$5().init___Lexample_MenuRenderer(this);
  this.playPauseButton$1 = new $c_Lexample_ToggleImage().init___Lexample_SmartImage__Lexample_SmartImage(this.playButton$1, this.pauseButton$1);
  var this$1 = $m_s_package$().Vector$1;
  var array = [this.playPauseButton$1];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$1.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  this.playbackPanel$1 = jsx$1;
  this.pencilButtonInactive$1 = new $c_Lexample_SmartImage().init___T("images/pencil.png");
  this.pencilButtonActive$1 = new $c_Lexample_SmartImage().init___T("images/pencilGreen.png");
  this.pencilButton$1 = new $c_Lexample_ActiveInactiveImage().init___Lexample_RenderObject__Lexample_RenderObject__F2(this.pencilButtonActive$1, this.pencilButtonInactive$1, new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(arg$outer) {
    return (function(x$2, y$2) {
      $uD(x$2);
      $uD(y$2);
      arg$outer.resetToolPanel__V();
      arg$outer.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().TOOL$undPENCIL$1)
    })
  })(this)));
  this.selectButtonInactive$1 = new $c_Lexample_SmartImage().init___T("images/select.png");
  this.selectButtonActive$1 = new $c_Lexample_SmartImage().init___T("images/selectGreen.png");
  this.selectButton$1 = new $c_Lexample_ActiveInactiveImage().init___Lexample_RenderObject__Lexample_RenderObject__F2(this.selectButtonActive$1, this.selectButtonInactive$1, new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(arg$outer$1) {
    return (function(x$2$1, y$2$1) {
      $uD(x$2$1);
      $uD(y$2$1);
      arg$outer$1.resetToolPanel__V();
      arg$outer$1.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().TOOL$undSELECT$1)
    })
  })(this)));
  var this$2 = $m_s_package$().Vector$1;
  var array$1 = [this.selectButton$1, this.pencilButton$1];
  if (($uI(array$1["length"]) === 0)) {
    var jsx$2 = this$2.NIL$6
  } else {
    var b$1 = new $c_sci_VectorBuilder().init___();
    var i$1 = 0;
    var len$1 = $uI(array$1["length"]);
    while ((i$1 < len$1)) {
      var index$1 = i$1;
      var arg1$1 = array$1[index$1];
      b$1.$$plus$eq__O__sci_VectorBuilder(arg1$1);
      i$1 = ((1 + i$1) | 0)
    };
    var jsx$2 = b$1.result__sci_Vector()
  };
  this.toolPanel$1 = jsx$2;
  this.helpButton$1 = new $c_Lexample_MenuRenderer$$anon$6().init___Lexample_MenuRenderer(this);
  this.masterContainer$1 = new $c_Lexample_LinearContainer().init___();
  this.masterContainer$1.bulkAdd__sc_Seq__D__D__D__V(this.playbackPanel$1, 0.05, 0.8, 0.01);
  var jsx$5 = this.masterContainer$1;
  var jsx$4 = this.toolPanel$1;
  var this$3 = $m_s_package$().Vector$1;
  var array$2 = [this.helpButton$1];
  if (($uI(array$2["length"]) === 0)) {
    var jsx$3 = this$3.NIL$6
  } else {
    var b$2 = new $c_sci_VectorBuilder().init___();
    var i$2 = 0;
    var len$2 = $uI(array$2["length"]);
    while ((i$2 < len$2)) {
      var index$2 = i$2;
      var arg1$2 = array$2[index$2];
      b$2.$$plus$eq__O__sci_VectorBuilder(arg1$2);
      i$2 = ((1 + i$2) | 0)
    };
    var jsx$3 = b$2.result__sci_Vector()
  };
  jsx$5.bulkAdd__sc_Seq__D__D__D__D__V($as_sc_Seq(jsx$4.$$plus$plus__sc_GenTraversableOnce__scg_CanBuildFrom__O(jsx$3, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6))), 0.05, 0.8, 0.01, 0.8);
  return this
});
$c_Lexample_MenuRenderer.prototype.draw__V = (function() {
  this.ctx$1["fillStyle"] = "#FAFAD2";
  this.ctx$1["fillRect"](this.rect$1.x$1, this.rect$1.y$1, this.rect$1.width$1, this.rect$1.height$1);
  this.masterContainer$1.render__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(this.rect$1.x$1, this.rect$1.y$1, this.rect$1.width$1, this.rect$1.height$1, this.ctx$1)
});
var $d_Lexample_MenuRenderer = new $TypeData().initClass({
  Lexample_MenuRenderer: 0
}, false, "example.MenuRenderer", {
  Lexample_MenuRenderer: 1,
  O: 1
});
$c_Lexample_MenuRenderer.prototype.$classData = $d_Lexample_MenuRenderer;
/** @constructor */
function $c_Lexample_MessageQueue() {
  $c_O.call(this);
  this.messages$1 = null
}
$c_Lexample_MessageQueue.prototype = new $h_O();
$c_Lexample_MessageQueue.prototype.constructor = $c_Lexample_MessageQueue;
/** @constructor */
function $h_Lexample_MessageQueue() {
  /*<skip>*/
}
$h_Lexample_MessageQueue.prototype = $c_Lexample_MessageQueue.prototype;
$c_Lexample_MessageQueue.prototype.init___ = (function() {
  this.messages$1 = new $c_scm_Queue().init___();
  return this
});
$c_Lexample_MessageQueue.prototype.send__I__V = (function(code) {
  var this$1 = this.messages$1;
  var array = [code];
  var i = 0;
  var len = $uI(array["length"]);
  while ((i < len)) {
    var index = i;
    var arg1 = array[index];
    this$1.$$plus$eq__O__scm_MutableList(arg1);
    i = ((1 + i) | 0)
  }
});
var $d_Lexample_MessageQueue = new $TypeData().initClass({
  Lexample_MessageQueue: 0
}, false, "example.MessageQueue", {
  Lexample_MessageQueue: 1,
  O: 1
});
$c_Lexample_MessageQueue.prototype.$classData = $d_Lexample_MessageQueue;
/** @constructor */
function $c_Lexample_MessageQueue$() {
  $c_O.call(this);
  this.PLAY$1 = 0;
  this.STOP$1 = 0;
  this.PAUSE$1 = 0;
  this.TOOL$undSELECT$1 = 0;
  this.TOOL$undPENCIL$1 = 0;
  this.HELP$1 = 0
}
$c_Lexample_MessageQueue$.prototype = new $h_O();
$c_Lexample_MessageQueue$.prototype.constructor = $c_Lexample_MessageQueue$;
/** @constructor */
function $h_Lexample_MessageQueue$() {
  /*<skip>*/
}
$h_Lexample_MessageQueue$.prototype = $c_Lexample_MessageQueue$.prototype;
$c_Lexample_MessageQueue$.prototype.init___ = (function() {
  $n_Lexample_MessageQueue$ = this;
  this.PLAY$1 = 0;
  this.STOP$1 = 1;
  this.PAUSE$1 = 2;
  this.TOOL$undSELECT$1 = 3;
  this.TOOL$undPENCIL$1 = 4;
  this.HELP$1 = 5;
  return this
});
var $d_Lexample_MessageQueue$ = new $TypeData().initClass({
  Lexample_MessageQueue$: 0
}, false, "example.MessageQueue$", {
  Lexample_MessageQueue$: 1,
  O: 1
});
$c_Lexample_MessageQueue$.prototype.$classData = $d_Lexample_MessageQueue$;
var $n_Lexample_MessageQueue$ = (void 0);
function $m_Lexample_MessageQueue$() {
  if ((!$n_Lexample_MessageQueue$)) {
    $n_Lexample_MessageQueue$ = new $c_Lexample_MessageQueue$().init___()
  };
  return $n_Lexample_MessageQueue$
}
/** @constructor */
function $c_Lexample_MyMath$() {
  $c_O.call(this)
}
$c_Lexample_MyMath$.prototype = new $h_O();
$c_Lexample_MyMath$.prototype.constructor = $c_Lexample_MyMath$;
/** @constructor */
function $h_Lexample_MyMath$() {
  /*<skip>*/
}
$h_Lexample_MyMath$.prototype = $c_Lexample_MyMath$.prototype;
$c_Lexample_MyMath$.prototype.powerOfTwoAbove__I__I = (function(a) {
  if ((a <= 0)) {
    return 1
  } else {
    var x = a;
    x = (((-1) + x) | 0);
    x = (x | (x >> 1));
    x = (x | (x >> 2));
    x = (x | (x >> 4));
    x = (x | (x >> 8));
    x = (x | (x >> 16));
    return ((1 + x) | 0)
  }
});
$c_Lexample_MyMath$.prototype.within__D__D__D__Z = (function(x, min, max) {
  return ((x >= min) && (x <= max))
});
$c_Lexample_MyMath$.prototype.doubleEqual__D__D__Z = (function(a, b) {
  var a$1 = (a - b);
  return ($uD($g["Math"]["abs"](a$1)) < 1.0E-7)
});
$c_Lexample_MyMath$.prototype.ceil__I__I__I = (function(a, b) {
  return (((((-1) + ((a + b) | 0)) | 0) / b) | 0)
});
$c_Lexample_MyMath$.prototype.clamp__I__I__I__I = (function(a, low, high) {
  var $$this = ((a > low) ? a : low);
  return (($$this < high) ? $$this : high)
});
var $d_Lexample_MyMath$ = new $TypeData().initClass({
  Lexample_MyMath$: 0
}, false, "example.MyMath$", {
  Lexample_MyMath$: 1,
  O: 1
});
$c_Lexample_MyMath$.prototype.$classData = $d_Lexample_MyMath$;
var $n_Lexample_MyMath$ = (void 0);
function $m_Lexample_MyMath$() {
  if ((!$n_Lexample_MyMath$)) {
    $n_Lexample_MyMath$ = new $c_Lexample_MyMath$().init___()
  };
  return $n_Lexample_MyMath$
}
/** @constructor */
function $c_Lexample_Note() {
  $c_O.call(this);
  this.midi$1 = 0;
  this.beatPosition$1 = 0.0;
  this.lengthInBeats$1 = 0.0;
  this.endBeat$1 = 0.0
}
$c_Lexample_Note.prototype = new $h_O();
$c_Lexample_Note.prototype.constructor = $c_Lexample_Note;
/** @constructor */
function $h_Lexample_Note() {
  /*<skip>*/
}
$h_Lexample_Note.prototype = $c_Lexample_Note.prototype;
$c_Lexample_Note.prototype.toString__T = (function() {
  return new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Note(midi: ", ", beatPosition: ", ", lengthInBeats: ", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.midi$1, this.beatPosition$1, this.lengthInBeats$1]))
});
$c_Lexample_Note.prototype.init___I__D__D = (function(midi, beatPosition, lengthInBeats) {
  this.midi$1 = midi;
  this.beatPosition$1 = beatPosition;
  this.lengthInBeats$1 = lengthInBeats;
  this.endBeat$1 = (lengthInBeats + beatPosition);
  return this
});
function $is_Lexample_Note(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_Note)))
}
function $as_Lexample_Note(obj) {
  return (($is_Lexample_Note(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.Note"))
}
function $isArrayOf_Lexample_Note(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_Note)))
}
function $asArrayOf_Lexample_Note(obj, depth) {
  return (($isArrayOf_Lexample_Note(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.Note;", depth))
}
var $d_Lexample_Note = new $TypeData().initClass({
  Lexample_Note: 0
}, false, "example.Note", {
  Lexample_Note: 1,
  O: 1
});
$c_Lexample_Note.prototype.$classData = $d_Lexample_Note;
/** @constructor */
function $c_Lexample_Note$() {
  $c_O.call(this);
  this.orderingByStart$1 = null;
  this.baseMidiToLetterMap$1 = null;
  this.baseMidiBlackNotes$1 = null;
  this.floatThresh$1 = 0.0
}
$c_Lexample_Note$.prototype = new $h_O();
$c_Lexample_Note$.prototype.constructor = $c_Lexample_Note$;
/** @constructor */
function $h_Lexample_Note$() {
  /*<skip>*/
}
$h_Lexample_Note$.prototype = $c_Lexample_Note$.prototype;
$c_Lexample_Note$.prototype.init___ = (function() {
  $n_Lexample_Note$ = this;
  this.orderingByStart$1 = $m_s_package$().Ordering$1.by__F1__s_math_Ordering__s_math_Ordering(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(note$2) {
    var note = $as_Lexample_Note(note$2);
    return note.beatPosition$1
  })), $m_s_math_Ordering$Double$());
  var array = [new $c_T2().init___O__O(0, "C"), new $c_T2().init___O__O(1, "Db"), new $c_T2().init___O__O(2, "D"), new $c_T2().init___O__O(3, "Eb"), new $c_T2().init___O__O(4, "E"), new $c_T2().init___O__O(5, "F"), new $c_T2().init___O__O(6, "Gb"), new $c_T2().init___O__O(7, "G"), new $c_T2().init___O__O(8, "Ab"), new $c_T2().init___O__O(9, "A"), new $c_T2().init___O__O(10, "Bb"), new $c_T2().init___O__O(11, "B")];
  var this$26 = new $c_scm_MapBuilder().init___sc_GenMap($m_sci_Map$EmptyMap$());
  var i = 0;
  var len = $uI(array["length"]);
  while ((i < len)) {
    var index = i;
    var arg1 = array[index];
    this$26.$$plus$eq__T2__scm_MapBuilder($as_T2(arg1));
    i = ((1 + i) | 0)
  };
  this.baseMidiToLetterMap$1 = $as_sci_Map(this$26.elems$1);
  var array$1 = [1, 3, 6, 8, 10];
  if (($uI(array$1["length"]) === 0)) {
    var jsx$1 = $m_sci_Set$EmptySet$()
  } else {
    var b = new $c_scm_SetBuilder().init___sc_Set($m_sci_Set$EmptySet$());
    var i$1 = 0;
    var len$1 = $uI(array$1["length"]);
    while ((i$1 < len$1)) {
      var index$1 = i$1;
      var arg1$1 = array$1[index$1];
      b.$$plus$eq__O__scm_SetBuilder(arg1$1);
      i$1 = ((1 + i$1) | 0)
    };
    var jsx$1 = b.elems$1
  };
  this.baseMidiBlackNotes$1 = $as_sci_Set(jsx$1);
  this.floatThresh$1 = 1.0E-6;
  return this
});
$c_Lexample_Note$.prototype.inNote__I__D__Lexample_Note__Z = (function(midi, beat, note) {
  return (((midi === note.midi$1) && (beat >= note.beatPosition$1)) && (beat <= note.endBeat$1))
});
$c_Lexample_Note$.prototype.isEqual__Lexample_Note__Lexample_Note__Z = (function(note1, note2) {
  return (((note1.midi$1 === note2.midi$1) && $m_Lexample_MyMath$().doubleEqual__D__D__Z(note1.beatPosition$1, note2.beatPosition$1)) && $m_Lexample_MyMath$().doubleEqual__D__D__Z(note1.lengthInBeats$1, note2.lengthInBeats$1))
});
$c_Lexample_Note$.prototype.isBlackNote__I__Z = (function(midi) {
  return this.baseMidiBlackNotes$1.contains__O__Z((midi % 12))
});
$c_Lexample_Note$.prototype.getLetter__I__T = (function(midi) {
  return $as_T(this.baseMidiToLetterMap$1.apply__O__O((midi % 12)))
});
var $d_Lexample_Note$ = new $TypeData().initClass({
  Lexample_Note$: 0
}, false, "example.Note$", {
  Lexample_Note$: 1,
  O: 1
});
$c_Lexample_Note$.prototype.$classData = $d_Lexample_Note$;
var $n_Lexample_Note$ = (void 0);
function $m_Lexample_Note$() {
  if ((!$n_Lexample_Note$)) {
    $n_Lexample_Note$ = new $c_Lexample_Note$().init___()
  };
  return $n_Lexample_Note$
}
/** @constructor */
function $c_Lexample_NoteTimeCalculator$() {
  $c_O.call(this);
  this.magicFactor$1 = 0.0
}
$c_Lexample_NoteTimeCalculator$.prototype = new $h_O();
$c_Lexample_NoteTimeCalculator$.prototype.constructor = $c_Lexample_NoteTimeCalculator$;
/** @constructor */
function $h_Lexample_NoteTimeCalculator$() {
  /*<skip>*/
}
$h_Lexample_NoteTimeCalculator$.prototype = $c_Lexample_NoteTimeCalculator$.prototype;
$c_Lexample_NoteTimeCalculator$.prototype.init___ = (function() {
  $n_Lexample_NoteTimeCalculator$ = this;
  this.magicFactor$1 = (60.0 / $m_Lexample_PianoRollConfig$().BeatsInQuarter$1);
  return this
});
$c_Lexample_NoteTimeCalculator$.prototype.iterator__D__Lexample_Song__Lexample_NotesDataStructure__sc_Iterator = (function(startBeat, song, notes) {
  var bpmIterator = song.cumulativeBpmMarkers$1.iterator__sc_Iterator();
  var p = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(startBeat$1) {
    return (function(marker$2) {
      var marker = $as_Lexample_BPMMarker(marker$2);
      return (marker.beatEnd$1 < startBeat$1)
    })
  })(startBeat));
  $s_sc_Iterator$class__dropWhile__sc_Iterator__F1__sc_Iterator(bpmIterator, p);
  var elem = $as_Lexample_BPMMarker(bpmIterator.next__O());
  var currentBPM = new $c_sr_ObjectRef().init___O(elem);
  var this$2 = notes.iteratorStart__D__sc_Iterator(startBeat);
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(bpmIterator$1, currentBPM$1) {
    return (function(note$2) {
      var note = $as_Lexample_Note(note$2);
      if ((note.beatPosition$1 >= $as_Lexample_BPMMarker(currentBPM$1.elem$1).beatEnd$1)) {
        currentBPM$1.elem$1 = $as_Lexample_BPMMarker(bpmIterator$1.next__O())
      };
      var beatsSinceChange = (note.beatPosition$1 - $as_Lexample_BPMMarker(currentBPM$1.elem$1).beatStart$1);
      var timeSinceChange = $m_Lexample_NoteTimeCalculator$().deltaBeatsToDeltaTime__D__D__D($as_Lexample_BPMMarker(currentBPM$1.elem$1).bpm$1, beatsSinceChange);
      return new $c_T2().init___O__O(note, (timeSinceChange + $as_Lexample_BPMMarker(currentBPM$1.elem$1).startTime$1))
    })
  })(bpmIterator, currentBPM));
  return new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$2, f)
});
$c_Lexample_NoteTimeCalculator$.prototype.deltaBeatsToDeltaTime__D__D__D = (function(bpm, deltaBeat) {
  return ((deltaBeat / bpm) * this.magicFactor$1)
});
$c_Lexample_NoteTimeCalculator$.prototype.getBeatOfTime__D__Lexample_Song__D = (function(time, song) {
  var index = song.cumulativeBpmMarkers$1.lastIndexWhere__F1__I(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(time$1) {
    return (function(x$2$2) {
      var x$2 = $as_Lexample_BPMMarker(x$2$2);
      return (time$1 > x$2.startTime$1)
    })
  })(time)));
  if ((index !== (-1))) {
    var bpmMarker = $as_Lexample_BPMMarker(song.cumulativeBpmMarkers$1.apply__I__O(index));
    return (bpmMarker.beatStart$1 + this.deltaTimeToDeltaBeats__D__D__D(bpmMarker.bpm$1, (time - bpmMarker.startTime$1)))
  } else {
    return 0.0
  }
});
$c_Lexample_NoteTimeCalculator$.prototype.deltaTimeToDeltaBeats__D__D__D = (function(bpm, deltaTime) {
  return ((deltaTime * bpm) / this.magicFactor$1)
});
$c_Lexample_NoteTimeCalculator$.prototype.getTimeOfBeat__D__Lexample_Song__D = (function(beat, song) {
  var this$1 = song.cumulativeBpmMarkers$1.find__F1__s_Option(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(beat$1) {
    return (function(x$1$2) {
      var x$1 = $as_Lexample_BPMMarker(x$1$2);
      return (beat$1 < x$1.beatEnd$1)
    })
  })(beat)));
  var bpmMarker = $as_Lexample_BPMMarker((this$1.isEmpty__Z() ? $as_Lexample_BPMMarker(song.cumulativeBpmMarkers$1.last__O()) : this$1.get__O()));
  return (bpmMarker.startTime$1 + this.deltaBeatsToDeltaTime__D__D__D(bpmMarker.bpm$1, (beat - bpmMarker.beatStart$1)))
});
var $d_Lexample_NoteTimeCalculator$ = new $TypeData().initClass({
  Lexample_NoteTimeCalculator$: 0
}, false, "example.NoteTimeCalculator$", {
  Lexample_NoteTimeCalculator$: 1,
  O: 1
});
$c_Lexample_NoteTimeCalculator$.prototype.$classData = $d_Lexample_NoteTimeCalculator$;
var $n_Lexample_NoteTimeCalculator$ = (void 0);
function $m_Lexample_NoteTimeCalculator$() {
  if ((!$n_Lexample_NoteTimeCalculator$)) {
    $n_Lexample_NoteTimeCalculator$ = new $c_Lexample_NoteTimeCalculator$().init___()
  };
  return $n_Lexample_NoteTimeCalculator$
}
/** @constructor */
function $c_Lexample_NotesDataStructure() {
  $c_O.call(this);
  this.log$1 = null;
  this.BeatsPerBucket$1 = 0;
  this.numBuckets$1 = 0;
  this.dataStructure$1 = null
}
$c_Lexample_NotesDataStructure.prototype = new $h_O();
$c_Lexample_NotesDataStructure.prototype.constructor = $c_Lexample_NotesDataStructure;
/** @constructor */
function $h_Lexample_NotesDataStructure() {
  /*<skip>*/
}
$h_Lexample_NotesDataStructure.prototype = $c_Lexample_NotesDataStructure.prototype;
$c_Lexample_NotesDataStructure.prototype.add__Lexample_Note__V = (function(note) {
  var bucketIndex = $doubleToInt((note.beatPosition$1 / this.BeatsPerBucket$1));
  var this$1 = $as_scm_BufferLike(this.dataStructure$1.apply__I__O(bucketIndex));
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([note]);
  this$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(elems)
});
$c_Lexample_NotesDataStructure.prototype.iteratorStart__D__sc_Iterator = (function(startBeat) {
  return this.iterator__D__D__sc_Iterator(startBeat, (((-1) + $imul(this.numBuckets$1, this.BeatsPerBucket$1)) | 0))
});
$c_Lexample_NotesDataStructure.prototype.toString__T = (function() {
  var this$2 = this.dataStructure$1;
  $m_sci_Vector$();
  var bf = $m_sc_IndexedSeq$().ReusableCBF$6;
  var b = $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder(this$2, bf);
  var this$3 = this$2.iterator__sci_VectorIterator();
  while (this$3.$$undhasNext$2) {
    var arg1 = this$3.next__O();
    var bucket = $as_scm_ArrayBuffer(arg1);
    var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(note$2) {
      var note = $as_Lexample_Note(note$2);
      return note.beatPosition$1
    }));
    var this$4 = $m_scm_ArrayBuffer$();
    var bf$1 = this$4.ReusableCBFInstance$2;
    b.$$plus$eq__O__scm_Builder($as_sc_TraversableOnce($s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(bucket, f, bf$1)).mkString__T__T__T__T("[", ",", "]"))
  };
  return $as_sc_TraversableOnce(b.result__O()).mkString__T__T(":")
});
$c_Lexample_NotesDataStructure.prototype.empty__V = (function() {
  var this$1 = this.dataStructure$1;
  var this$2 = this$1.iterator__sci_VectorIterator();
  while (this$2.$$undhasNext$2) {
    var arg1 = this$2.next__O();
    var x0$1 = $as_scm_ArrayBuffer(arg1);
    if ((x0$1 !== null)) {
      $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V(x0$1, 0)
    } else {
      throw new $c_s_MatchError().init___O(x0$1)
    }
  }
});
$c_Lexample_NotesDataStructure.prototype.sort__V = (function() {
  var this$1 = this.dataStructure$1;
  var this$2 = this$1.iterator__sci_VectorIterator();
  while (this$2.$$undhasNext$2) {
    var arg1 = this$2.next__O();
    var arrayBuffer = $as_scm_ArrayBuffer(arg1);
    this.insertionSort__scm_ArrayBuffer__V(arrayBuffer)
  }
});
$c_Lexample_NotesDataStructure.prototype.iterator__D__D__sc_Iterator = (function(startBeat, endBeat) {
  var startBucketIndex = $doubleToInt((startBeat / this.BeatsPerBucket$1));
  var endBucket = $doubleToInt((endBeat / this.BeatsPerBucket$1));
  $m_s_package$();
  var end = ((1 + endBucket) | 0);
  var this$2 = new $c_sc_Iterator$$anon$6().init___I__I__I(startBucketIndex, end, 1);
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(bucket$2) {
      var bucket = $uI(bucket$2);
      return $as_sc_IndexedSeqLike(arg$outer.dataStructure$1.apply__I__O(bucket)).iterator__sc_Iterator()
    })
  })(this));
  var this$3 = new $c_sc_Iterator$$anon$12().init___sc_Iterator__F1(this$2, f);
  var p = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(startBeat$1, endBeat$2) {
    return (function(note$2) {
      var note = $as_Lexample_Note(note$2);
      return ((note.beatPosition$1 >= startBeat$1) && (note.beatPosition$1 < endBeat$2))
    })
  })(startBeat, endBeat));
  return new $c_sc_Iterator$$anon$13().init___sc_Iterator__F1(this$3, p)
});
$c_Lexample_NotesDataStructure.prototype.init___I__sci_Vector = (function(totalBeats, initialNotes) {
  this.log$1 = new $c_Lexample_Logger().init___jl_Class($objectGetClass(this));
  this.BeatsPerBucket$1 = $imul(2, $m_Lexample_PianoRollConfig$().BeatResolution$1);
  this.numBuckets$1 = $m_Lexample_MyMath$().ceil__I__I__I(totalBeats, this.BeatsPerBucket$1);
  $m_s_package$();
  var n = this.numBuckets$1;
  var b = new $c_sci_VectorBuilder().init___();
  var i = 0;
  while ((i < n)) {
    var elem = new $c_scm_ArrayBuffer().init___();
    b.$$plus$eq__O__sci_VectorBuilder(elem);
    i = ((1 + i) | 0)
  };
  this.dataStructure$1 = b.result__sci_Vector();
  var this$2 = initialNotes.iterator__sci_VectorIterator();
  while (this$2.$$undhasNext$2) {
    var arg1 = this$2.next__O();
    var note = $as_Lexample_Note(arg1);
    this.add__Lexample_Note__V(note)
  };
  return this
});
$c_Lexample_NotesDataStructure.prototype.$delete__Lexample_Note__V = (function(note) {
  var bucketIndex = $doubleToInt((note.beatPosition$1 / this.BeatsPerBucket$1));
  var bucket = $as_scm_ArrayBuffer(this.dataStructure$1.apply__I__O(bucketIndex));
  var len = bucket.size0$6;
  var i = 0;
  while (true) {
    if ((i < len)) {
      var idx = i;
      var arg1 = $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(bucket, idx);
      var x$1 = $as_Lexample_Note(arg1);
      var jsx$1 = (!$m_Lexample_Note$().isEqual__Lexample_Note__Lexample_Note__Z(x$1, note))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      i = ((1 + i) | 0)
    } else {
      break
    }
  };
  var index = $s_sc_IndexedSeqOptimized$class__negLength__p0__sc_IndexedSeqOptimized__I__I(bucket, i);
  if ((index !== (-1))) {
    bucket.remove__I__O(index)
  } else {
    $m_Lexample_Logger$().warn__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Could not delete note ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([note])), $objectGetClass(this))
  }
});
$c_Lexample_NotesDataStructure.prototype.insertionSort__scm_ArrayBuffer__V = (function(arrayBuffer) {
  var length = arrayBuffer.size0$6;
  if ((length > 1)) {
    var i = 1;
    while ((i < length)) {
      var idx = i;
      var candidateNote = $as_Lexample_Note($s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(arrayBuffer, idx));
      var j = i;
      while (true) {
        if ((j > 0)) {
          var idx$1 = (((-1) + j) | 0);
          var jsx$1 = ($as_Lexample_Note($s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(arrayBuffer, idx$1)).beatPosition$1 > candidateNote.beatPosition$1)
        } else {
          var jsx$1 = false
        };
        if (jsx$1) {
          var idx$3 = j;
          var idx$2 = (((-1) + j) | 0);
          var elem = $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(arrayBuffer, idx$2);
          $s_scm_ResizableArray$class__update__scm_ResizableArray__I__O__V(arrayBuffer, idx$3, elem);
          j = (((-1) + j) | 0)
        } else {
          break
        }
      };
      var idx$4 = j;
      $s_scm_ResizableArray$class__update__scm_ResizableArray__I__O__V(arrayBuffer, idx$4, candidateNote);
      i = ((1 + i) | 0)
    }
  }
});
var $d_Lexample_NotesDataStructure = new $TypeData().initClass({
  Lexample_NotesDataStructure: 0
}, false, "example.NotesDataStructure", {
  Lexample_NotesDataStructure: 1,
  O: 1
});
$c_Lexample_NotesDataStructure.prototype.$classData = $d_Lexample_NotesDataStructure;
/** @constructor */
function $c_Lexample_PianoRollConfig$() {
  $c_O.call(this);
  this.Quarter$1 = 0;
  this.Eighth$1 = 0;
  this.Sixteenth$1 = 0;
  this.BeatResolution$1 = 0;
  this.BeatsInQuarter$1 = 0;
  this.BeatsInEighth$1 = 0;
  this.BeatsInSixteenth$1 = 0;
  this.DefaultWidth$1 = 0;
  this.MaxMeasureTicksShownInRuler$1 = 0
}
$c_Lexample_PianoRollConfig$.prototype = new $h_O();
$c_Lexample_PianoRollConfig$.prototype.constructor = $c_Lexample_PianoRollConfig$;
/** @constructor */
function $h_Lexample_PianoRollConfig$() {
  /*<skip>*/
}
$h_Lexample_PianoRollConfig$.prototype = $c_Lexample_PianoRollConfig$.prototype;
$c_Lexample_PianoRollConfig$.prototype.init___ = (function() {
  $n_Lexample_PianoRollConfig$ = this;
  this.Quarter$1 = 4;
  this.Eighth$1 = 8;
  this.Sixteenth$1 = 16;
  this.BeatResolution$1 = this.Sixteenth$1;
  this.BeatsInQuarter$1 = ((this.BeatResolution$1 / 4) | 0);
  this.BeatsInEighth$1 = ((this.BeatResolution$1 / 8) | 0);
  this.BeatsInSixteenth$1 = ((this.BeatResolution$1 / 16) | 0);
  this.DefaultWidth$1 = $imul(4, $m_Lexample_PianoRollConfig$().BeatResolution$1);
  this.MaxMeasureTicksShownInRuler$1 = 8;
  return this
});
var $d_Lexample_PianoRollConfig$ = new $TypeData().initClass({
  Lexample_PianoRollConfig$: 0
}, false, "example.PianoRollConfig$", {
  Lexample_PianoRollConfig$: 1,
  O: 1
});
$c_Lexample_PianoRollConfig$.prototype.$classData = $d_Lexample_PianoRollConfig$;
var $n_Lexample_PianoRollConfig$ = (void 0);
function $m_Lexample_PianoRollConfig$() {
  if ((!$n_Lexample_PianoRollConfig$)) {
    $n_Lexample_PianoRollConfig$ = new $c_Lexample_PianoRollConfig$().init___()
  };
  return $n_Lexample_PianoRollConfig$
}
/** @constructor */
function $c_Lexample_PianoRollController$() {
  $c_O.call(this);
  this.HorizontalStepSize$1 = 0;
  this.Zoom$1 = 0.0;
  this.LocatorFollowOffset$1 = 0.0
}
$c_Lexample_PianoRollController$.prototype = new $h_O();
$c_Lexample_PianoRollController$.prototype.constructor = $c_Lexample_PianoRollController$;
/** @constructor */
function $h_Lexample_PianoRollController$() {
  /*<skip>*/
}
$h_Lexample_PianoRollController$.prototype = $c_Lexample_PianoRollController$.prototype;
$c_Lexample_PianoRollController$.prototype.init___ = (function() {
  $n_Lexample_PianoRollController$ = this;
  this.HorizontalStepSize$1 = (($m_Lexample_PianoRollConfig$().BeatResolution$1 / 4) | 0);
  this.Zoom$1 = 1.5;
  this.LocatorFollowOffset$1 = ($m_Lexample_PianoRollConfig$().BeatResolution$1 / 16.0);
  return this
});
var $d_Lexample_PianoRollController$ = new $TypeData().initClass({
  Lexample_PianoRollController$: 0
}, false, "example.PianoRollController$", {
  Lexample_PianoRollController$: 1,
  O: 1
});
$c_Lexample_PianoRollController$.prototype.$classData = $d_Lexample_PianoRollController$;
var $n_Lexample_PianoRollController$ = (void 0);
function $m_Lexample_PianoRollController$() {
  if ((!$n_Lexample_PianoRollController$)) {
    $n_Lexample_PianoRollController$ = new $c_Lexample_PianoRollController$().init___()
  };
  return $n_Lexample_PianoRollController$
}
/** @constructor */
function $c_Lexample_PianoRollRenderer() {
  $c_O.call(this);
  this.example$PianoRollRenderer$$pRollWorld$f = null;
  this.canvas$1 = null;
  this.log$1 = null;
  this.menuRect$1 = null;
  this.rulerRect$1 = null;
  this.gridRect$1 = null;
  this.playAreaRect$1 = null;
  this.ctx$1 = null;
  this.menuRenderer$1 = null
}
$c_Lexample_PianoRollRenderer.prototype = new $h_O();
$c_Lexample_PianoRollRenderer.prototype.constructor = $c_Lexample_PianoRollRenderer;
/** @constructor */
function $h_Lexample_PianoRollRenderer() {
  /*<skip>*/
}
$h_Lexample_PianoRollRenderer.prototype = $c_Lexample_PianoRollRenderer.prototype;
$c_Lexample_PianoRollRenderer.prototype.init__V = (function() {
  var x = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Setup ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([$uI(this.canvas$1["height"])]));
  var this$2 = $m_s_Console$();
  var this$3 = this$2.outVar$2;
  $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V(x);
  this.canvas$1["height"] = $uI(this.canvas$1["parentElement"]["clientHeight"]);
  this.canvas$1["width"] = $uI(this.canvas$1["parentElement"]["clientWidth"]);
  this.ctx$1["fillStyle"] = "#f3a342";
  this.ctx$1["fillRect"](0.0, 0.0, $uI(this.canvas$1["width"]), $uI(this.canvas$1["height"]));
  this.ctx$1["font"] = "48px serif"
});
$c_Lexample_PianoRollRenderer.prototype.init___Lexample_PianoRollWorld__Lorg_scalajs_dom_raw_HTMLCanvasElement__Lexample_Rectangle = (function(pRollWorld, canvas, rect) {
  this.example$PianoRollRenderer$$pRollWorld$f = pRollWorld;
  this.canvas$1 = canvas;
  this.log$1 = new $c_Lexample_Logger().init___jl_Class($objectGetClass(this));
  this.menuRect$1 = new $c_Lexample_Rectangle().init___D__D__D__D(rect.x$1, rect.y$1, rect.width$1, (rect.height$1 / 10));
  this.rulerRect$1 = new $c_Lexample_Rectangle().init___D__D__D__D(rect.x$1, (rect.y$1 + this.menuRect$1.height$1), rect.width$1, (rect.height$1 / 10));
  this.gridRect$1 = new $c_Lexample_Rectangle().init___D__D__D__D(rect.x$1, ((rect.y$1 + this.rulerRect$1.height$1) + this.menuRect$1.height$1), this.rulerRect$1.width$1, ((rect.height$1 - this.rulerRect$1.height$1) - this.menuRect$1.height$1));
  this.playAreaRect$1 = new $c_Lexample_Rectangle().init___D__D__D__D(this.rulerRect$1.x$1, this.rulerRect$1.y$1, this.rulerRect$1.width$1, (this.rulerRect$1.height$1 + this.gridRect$1.height$1));
  this.ctx$1 = canvas["getContext"]("2d");
  this.menuRenderer$1 = new $c_Lexample_MenuRenderer().init___Lorg_scalajs_dom_raw_CanvasRenderingContext2D__Lexample_Rectangle__Lexample_MessageQueue(this.ctx$1, this.menuRect$1, pRollWorld.messageQueue$1);
  this.menuRenderer$1.selectToolExternal__I__V($m_Lexample_MessageQueue$().TOOL$undSELECT$1);
  this.init__V();
  $m_Lexample_Logger$().debug__T__jl_Class__V($m_sr_ScalaRunTime$().$$undtoString__s_Product__T(rect), $objectGetClass(this));
  var jsx$1 = $m_Lexample_Logger$();
  var this$1 = this.rulerRect$1;
  jsx$1.debug__T__jl_Class__V($m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this$1), $objectGetClass(this));
  return this
});
$c_Lexample_PianoRollRenderer.prototype.renderRollHorizontalLines__V = (function() {
  var jsx$1 = this.ctx$1;
  var s = $m_Lexample_PianoRollRenderer$().PianoRollHorizontalRowColor$1;
  jsx$1["strokeStyle"] = s;
  var numberOfNotes = this.example$PianoRollRenderer$$pRollWorld$f.rollRange$1;
  $m_Lexample_MyMath$().ceil__I__I__I(numberOfNotes, 30);
  $m_s_package$();
  var start = this.example$PianoRollRenderer$$pRollWorld$f.rollLowNote$1;
  var end = ((this.example$PianoRollRenderer$$pRollWorld$f.rollLowNote$1 + numberOfNotes) | 0);
  var this$3 = new $c_sc_Iterator$$anon$6().init___I__I__I(start, end, 1);
  while (this$3.hasNext__Z()) {
    var arg1 = this$3.next__I();
    var y = ((this.heightPercentForNote__I__I__I__D(arg1, this.heightPercentForNote$default$2__I(), this.heightPercentForNote$default$3__I()) * this.gridRect$1.height$1) + this.gridRect$1.y$1);
    if ($m_Lexample_Note$().isBlackNote__I__Z(arg1)) {
      var jsx$2 = this.ctx$1;
      var s$1 = $m_Lexample_PianoRollRenderer$().PianoRollAltRowFillColor$1;
      jsx$2["fillStyle"] = s$1;
      this.ctx$1["fillRect"](this.gridRect$1.x$1, y, this.gridRect$1.width$1, (this.gridRect$1.height$1 / numberOfNotes))
    };
    this.ctx$1["fillStyle"] = "#AABBCC";
    this.ctx$1["font"] = "10pt Calibri";
    this.ctx$1["fillText"]($m_Lexample_Note$().getLetter__I__T(arg1), this.gridRect$1.x$1, (y + (this.gridRect$1.height$1 / numberOfNotes)));
    this.ctx$1["beginPath"]();
    this.ctx$1["moveTo"](this.gridRect$1.x$1, y);
    this.ctx$1["lineTo"](this.gridRect$1.rightX$1, y);
    this.ctx$1["stroke"]()
  }
});
$c_Lexample_PianoRollRenderer.prototype.heightPercentForNote$default$2__I = (function() {
  return this.example$PianoRollRenderer$$pRollWorld$f.rollLowNote$1
});
$c_Lexample_PianoRollRenderer.prototype.heightPercentForNote__I__I__I__D = (function(midi, rollLow, rollRange) {
  return (((rollRange - ((midi - rollLow) | 0)) | 0) / rollRange)
});
$c_Lexample_PianoRollRenderer.prototype.render__Lexample_Rectangle__V = (function(rect) {
  this.ctx$1["clearRect"](rect.x$1, rect.y$1, rect.width$1, rect.height$1);
  this.renderRollHorizontalLines__V();
  var this$1 = this.example$PianoRollRenderer$$pRollWorld$f.tickLogic$1.getTickMarkers__I__I__I__I__sc_Iterator(this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1, this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1, 100, 30);
  while (this$1.hasNext__Z()) {
    var arg1 = this$1.next__O();
    var tickMarker = $as_Lexample_TickMarker(arg1);
    this.renderRuler__Lexample_TickMarker__V(tickMarker);
    this.renderRollVerticalLines__Lexample_TickMarker__V(tickMarker)
  };
  this.renderNotes__V();
  this.renderLocator__V();
  this.menuRenderer$1.draw__V()
});
$c_Lexample_PianoRollRenderer.prototype.renderRuler__Lexample_TickMarker__V = (function(tickMarker) {
  var x1 = tickMarker.symbol$1;
  if (($m_Lexample_TickMarker$().QuarterTick$1 === x1)) {
    var _2 = (this.rulerRect$1.height$1 / 2);
    var x1$2_$_$$und1$f = "#00FF00";
    var x1$2_$_$$und2$f = _2
  } else if (($m_Lexample_TickMarker$().EightTick$1 === x1)) {
    var _2$1 = (this.rulerRect$1.height$1 / 3);
    var x1$2_$_$$und1$f = "#0000FF";
    var x1$2_$_$$und2$f = _2$1
  } else if (($m_Lexample_TickMarker$().SixteenthTick$1 === x1)) {
    var _2$2 = (this.rulerRect$1.height$1 / 4);
    var x1$2_$_$$und1$f = "#00FFFF";
    var x1$2_$_$$und2$f = _2$2
  } else {
    var _2$3 = this.rulerRect$1.height$1;
    var x1$2_$_$$und1$f = "#66E066";
    var x1$2_$_$$und2$f = _2$3
  };
  var color = $as_T(x1$2_$_$$und1$f);
  var height = $uD(x1$2_$_$$und2$f);
  this.ctx$1["strokeStyle"] = color;
  this.ctx$1["beginPath"]();
  var x = (((((tickMarker.beat$1 - this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1) | 0) / this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) * this.rulerRect$1.width$1) + this.rulerRect$1.x$1);
  this.ctx$1["moveTo"](x, this.rulerRect$1.y$1);
  this.ctx$1["lineTo"](x, (this.rulerRect$1.y$1 + height));
  this.ctx$1["stroke"]();
  this.ctx$1["fillStyle"] = "#000000";
  this.ctx$1["font"] = "12pt Calibri";
  if ((tickMarker.symbol$1 > 0)) {
    var jsx$1 = this.ctx$1;
    var this$3 = ((1 + tickMarker.symbol$1) | 0);
    jsx$1["fillText"](("" + this$3), x, (this.rulerRect$1.y$1 + ((4 * this.rulerRect$1.height$1) / 5)))
  }
});
$c_Lexample_PianoRollRenderer.prototype.renderLocator__V = (function() {
  if ($m_Lexample_MyMath$().within__D__D__D__Z(this.example$PianoRollRenderer$$pRollWorld$f.locatorBeat$1, this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1, ((this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1 + this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) | 0))) {
    var x = this.getStartXForNote__D__D(this.example$PianoRollRenderer$$pRollWorld$f.locatorBeat$1);
    var jsx$1 = this.ctx$1;
    var s = $m_Lexample_PianoRollRenderer$().PianoRollLocatorColor$1;
    jsx$1["strokeStyle"] = s;
    this.ctx$1["beginPath"]();
    this.ctx$1["moveTo"](x, this.playAreaRect$1.y$1);
    this.ctx$1["lineTo"](x, this.playAreaRect$1.bottomY$1);
    this.ctx$1["stroke"]()
  }
});
$c_Lexample_PianoRollRenderer.prototype.getMidiAndBeatAtMouseClick__D__D__T2 = (function(x, y) {
  var rollLow = this.example$PianoRollRenderer$$pRollWorld$f.rollLowNote$1;
  var rollRange = this.example$PianoRollRenderer$$pRollWorld$f.rollRange$1;
  var yPercent = (1 - ((y - this.gridRect$1.y$1) / this.gridRect$1.height$1));
  var a = ((yPercent * rollRange) + rollLow);
  var midi = $doubleToInt($uD($g["Math"]["ceil"](a)));
  var beat = ((((x - this.gridRect$1.x$1) / this.gridRect$1.width$1) * this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) + this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1);
  return new $c_s_Tuple2$mcID$sp().init___I__D(midi, beat)
});
$c_Lexample_PianoRollRenderer.prototype.renderRollVerticalLines__Lexample_TickMarker__V = (function(tickMarker) {
  var x1 = tickMarker.symbol$1;
  var color = (($m_Lexample_TickMarker$().QuarterTick$1 === x1) ? "#444444" : (($m_Lexample_TickMarker$().EightTick$1 === x1) ? "#888888" : (($m_Lexample_TickMarker$().SixteenthTick$1 === x1) ? "#AAAAAA" : "#000000")));
  this.ctx$1["strokeStyle"] = color;
  var x = (((((tickMarker.beat$1 - this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1) | 0) / this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) * this.gridRect$1.width$1) + this.gridRect$1.x$1);
  this.ctx$1["beginPath"]();
  this.ctx$1["moveTo"](x, this.gridRect$1.y$1);
  this.ctx$1["lineTo"](x, this.gridRect$1.bottomY$1);
  this.ctx$1["stroke"]()
});
$c_Lexample_PianoRollRenderer.prototype.renderNotes__V = (function() {
  var widthBeats = this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1;
  var startBeat = this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1;
  var endBeat = (((-1) + ((startBeat + widthBeats) | 0)) | 0);
  var jsx$1 = this.ctx$1;
  var s = $m_Lexample_PianoRollRenderer$().PianoRollNoteColor$1;
  jsx$1["fillStyle"] = s;
  var this$2 = this.example$PianoRollRenderer$$pRollWorld$f.notes$1.iterator__D__D__sc_Iterator(this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1, endBeat);
  while (this$2.hasNext__Z()) {
    var arg1 = this$2.next__O();
    var note = $as_Lexample_Note(arg1);
    this.renderNote__Lexample_Note__V(note)
  };
  var jsx$2 = this.ctx$1;
  var s$1 = $m_Lexample_PianoRollRenderer$().PianoRollEditingNoteColor$1;
  jsx$2["fillStyle"] = s$1;
  if (this.example$PianoRollRenderer$$pRollWorld$f.dirtyNote$1.isDefined__Z()) {
    this.renderNote__Lexample_Note__V($as_Lexample_Note(this.example$PianoRollRenderer$$pRollWorld$f.dirtyNote$1.get__O()))
  }
});
$c_Lexample_PianoRollRenderer.prototype.renderNote__Lexample_Note__V = (function(note) {
  if (((note.midi$1 <= this.example$PianoRollRenderer$$pRollWorld$f.rollHighNote__I()) && (note.midi$1 >= ((this.example$PianoRollRenderer$$pRollWorld$f.rollHighNote__I() - this.example$PianoRollRenderer$$pRollWorld$f.rollRange$1) | 0)))) {
    var xStart = ((((note.beatPosition$1 - this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1) / this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) * this.gridRect$1.width$1) + this.gridRect$1.x$1);
    var xWidth = ((note.lengthInBeats$1 / this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) * this.gridRect$1.width$1);
    var yStart = ((this.heightPercentForNote__I__I__I__D(note.midi$1, this.heightPercentForNote$default$2__I(), this.heightPercentForNote$default$3__I()) * this.gridRect$1.height$1) + this.gridRect$1.y$1);
    var yHeight = (this.gridRect$1.height$1 / this.example$PianoRollRenderer$$pRollWorld$f.rollRange$1);
    this.ctx$1["fillRect"](xStart, yStart, xWidth, yHeight)
  }
});
$c_Lexample_PianoRollRenderer.prototype.heightPercentForNote$default$3__I = (function() {
  return this.example$PianoRollRenderer$$pRollWorld$f.rollRange$1
});
$c_Lexample_PianoRollRenderer.prototype.getBeatAtMouseClick__D__D = (function(x) {
  return ((((x - this.gridRect$1.x$1) / this.gridRect$1.width$1) * this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) + this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1)
});
$c_Lexample_PianoRollRenderer.prototype.getStartXForNote__D__D = (function(beat) {
  return ((((beat - this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1) / this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) * this.gridRect$1.width$1) + this.gridRect$1.x$1)
});
$c_Lexample_PianoRollRenderer.prototype.getNoteAtMouseClick__D__D__s_Option = (function(x, y) {
  var x1 = this.getMidiAndBeatAtMouseClick__D__D__T2(x, y);
  if ((x1 !== null)) {
    var midi = x1.$$und1$mcI$sp__I();
    var beat = x1.$$und2$mcD$sp__D();
    var x$2_$_$$und1$f = null;
    var x$2_$_$$und2$f = null;
    var x$2_$_$$und1$mcI$sp$f = midi;
    var x$2_$_$$und2$mcD$sp$f = beat
  } else {
    var x$2_$_$$und1$f;
    var x$2_$_$$und2$f;
    var x$2_$_$$und1$mcI$sp$f;
    var x$2_$_$$und2$mcD$sp$f;
    throw new $c_s_MatchError().init___O(x1)
  };
  var midi$2 = x$2_$_$$und1$mcI$sp$f;
  var beat$2 = x$2_$_$$und2$mcD$sp$f;
  $m_Lexample_Logger$().debug__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Midi ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([midi$2])), $objectGetClass(this));
  $m_Lexample_Logger$().debug__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Beat ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([beat$2])), $objectGetClass(this));
  var noteIterator = this.example$PianoRollRenderer$$pRollWorld$f.notes$1.iterator__D__D__sc_Iterator(this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1, ((this.example$PianoRollRenderer$$pRollWorld$f.startBeat$1 + this.example$PianoRollRenderer$$pRollWorld$f.widthBeats$1) | 0));
  var modifiedIterator = (this.example$PianoRollRenderer$$pRollWorld$f.dirtyNote$1.isDefined__Z() ? noteIterator.$$plus$plus__F0__sc_Iterator(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(arg$outer) {
    return (function() {
      return $as_sc_Iterable($m_s_package$().Iterable$1.apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array([$as_Lexample_Note(arg$outer.example$PianoRollRenderer$$pRollWorld$f.dirtyNote$1.get__O())])))
    })
  })(this))) : noteIterator);
  var res = $m_s_None$();
  while ((res.isEmpty__Z() && modifiedIterator.hasNext__Z())) {
    var e = modifiedIterator.next__O();
    var x$3 = $as_Lexample_Note(e);
    if ($m_Lexample_Note$().inNote__I__D__Lexample_Note__Z(midi$2, beat$2, x$3)) {
      res = new $c_s_Some().init___O(e)
    }
  };
  return res
});
var $d_Lexample_PianoRollRenderer = new $TypeData().initClass({
  Lexample_PianoRollRenderer: 0
}, false, "example.PianoRollRenderer", {
  Lexample_PianoRollRenderer: 1,
  O: 1
});
$c_Lexample_PianoRollRenderer.prototype.$classData = $d_Lexample_PianoRollRenderer;
/** @constructor */
function $c_Lexample_PianoRollRenderer$() {
  $c_O.call(this);
  this.GridHorizontalLineThreshold$1 = 0;
  this.PianoRollAltRowFillColor$1 = null;
  this.PianoRollHorizontalRowColor$1 = null;
  this.PianoRollNoteColor$1 = null;
  this.PianoRollEditingNoteColor$1 = null;
  this.PianoRollSettingsBackgroundColor$1 = null;
  this.PianoRollLocatorColor$1 = null
}
$c_Lexample_PianoRollRenderer$.prototype = new $h_O();
$c_Lexample_PianoRollRenderer$.prototype.constructor = $c_Lexample_PianoRollRenderer$;
/** @constructor */
function $h_Lexample_PianoRollRenderer$() {
  /*<skip>*/
}
$h_Lexample_PianoRollRenderer$.prototype = $c_Lexample_PianoRollRenderer$.prototype;
$c_Lexample_PianoRollRenderer$.prototype.init___ = (function() {
  $n_Lexample_PianoRollRenderer$ = this;
  this.GridHorizontalLineThreshold$1 = 50;
  this.PianoRollAltRowFillColor$1 = "#E3F3F8";
  this.PianoRollHorizontalRowColor$1 = "#77FF98";
  this.PianoRollNoteColor$1 = "#FFA500";
  this.PianoRollEditingNoteColor$1 = "#890034";
  this.PianoRollSettingsBackgroundColor$1 = "#D3D3D3";
  this.PianoRollLocatorColor$1 = "#33CCFF";
  return this
});
var $d_Lexample_PianoRollRenderer$ = new $TypeData().initClass({
  Lexample_PianoRollRenderer$: 0
}, false, "example.PianoRollRenderer$", {
  Lexample_PianoRollRenderer$: 1,
  O: 1
});
$c_Lexample_PianoRollRenderer$.prototype.$classData = $d_Lexample_PianoRollRenderer$;
var $n_Lexample_PianoRollRenderer$ = (void 0);
function $m_Lexample_PianoRollRenderer$() {
  if ((!$n_Lexample_PianoRollRenderer$)) {
    $n_Lexample_PianoRollRenderer$ = new $c_Lexample_PianoRollRenderer$().init___()
  };
  return $n_Lexample_PianoRollRenderer$
}
/** @constructor */
function $c_Lexample_PianoRollSettings() {
  $c_O.call(this);
  this.state$1 = 0;
  this.snapEnabled$1 = false;
  this.snapBeats$1 = 0.0;
  this.locatorFollow$1 = false;
  this.vars$1 = null
}
$c_Lexample_PianoRollSettings.prototype = new $h_O();
$c_Lexample_PianoRollSettings.prototype.constructor = $c_Lexample_PianoRollSettings;
/** @constructor */
function $h_Lexample_PianoRollSettings() {
  /*<skip>*/
}
$h_Lexample_PianoRollSettings.prototype = $c_Lexample_PianoRollSettings.prototype;
$c_Lexample_PianoRollSettings.prototype.init___ = (function() {
  this.state$1 = $m_Lexample_PianoRollSettings$().StateSelect$1;
  this.snapEnabled$1 = false;
  this.snapBeats$1 = $m_Lexample_PianoRollConfig$().BeatsInEighth$1;
  this.locatorFollow$1 = true;
  var this$1 = $m_s_package$().Vector$1;
  var array = [new $c_Lexample_BooleanVar().init___Z__T(this.snapEnabled$1, "Snap"), new $c_Lexample_SelectVar().init___O__T__sc_Seq(this.snapBeats$1, "Quant", $m_Lexample_PianoRollSettings$().QuantizationOptions$1), new $c_Lexample_BooleanVar().init___Z__T(this.locatorFollow$1, "Follow"), new $c_Lexample_SelectVar().init___O__T__sc_Seq(this.state$1, "State", $m_Lexample_PianoRollSettings$().AllStates$1)];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$1.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  this.vars$1 = jsx$1;
  return this
});
var $d_Lexample_PianoRollSettings = new $TypeData().initClass({
  Lexample_PianoRollSettings: 0
}, false, "example.PianoRollSettings", {
  Lexample_PianoRollSettings: 1,
  O: 1
});
$c_Lexample_PianoRollSettings.prototype.$classData = $d_Lexample_PianoRollSettings;
/** @constructor */
function $c_Lexample_PianoRollSettings$() {
  $c_O.call(this);
  this.StateSelect$1 = 0;
  this.StatePencil$1 = 0;
  this.AllStates$1 = null;
  this.Quarter$1 = 0;
  this.Eighth$1 = 0;
  this.Sixteenth$1 = 0;
  this.QuarterTriplet$1 = 0.0;
  this.EightTriplet$1 = 0.0;
  this.SixteenthTriplet$1 = 0.0;
  this.QuantizationOptions$1 = null
}
$c_Lexample_PianoRollSettings$.prototype = new $h_O();
$c_Lexample_PianoRollSettings$.prototype.constructor = $c_Lexample_PianoRollSettings$;
/** @constructor */
function $h_Lexample_PianoRollSettings$() {
  /*<skip>*/
}
$h_Lexample_PianoRollSettings$.prototype = $c_Lexample_PianoRollSettings$.prototype;
$c_Lexample_PianoRollSettings$.prototype.init___ = (function() {
  $n_Lexample_PianoRollSettings$ = this;
  this.StateSelect$1 = 0;
  this.StatePencil$1 = 2;
  var this$1 = $m_s_package$().Vector$1;
  var array = [this.StateSelect$1, this.StatePencil$1];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$1.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  this.AllStates$1 = jsx$1;
  this.Quarter$1 = $m_Lexample_PianoRollConfig$().BeatsInQuarter$1;
  this.Eighth$1 = $m_Lexample_PianoRollConfig$().BeatsInEighth$1;
  this.Sixteenth$1 = $m_Lexample_PianoRollConfig$().BeatsInSixteenth$1;
  this.QuarterTriplet$1 = ($m_Lexample_PianoRollConfig$().BeatResolution$1 / 3.0);
  this.EightTriplet$1 = ($m_Lexample_PianoRollConfig$().BeatsInQuarter$1 / 3.0);
  this.SixteenthTriplet$1 = ($m_Lexample_PianoRollConfig$().BeatsInEighth$1 / 3.0);
  var this$2 = $m_s_package$().Vector$1;
  var array$1 = [this.Quarter$1, this.Eighth$1, this.Sixteenth$1, this.QuarterTriplet$1, this.EightTriplet$1, this.SixteenthTriplet$1];
  if (($uI(array$1["length"]) === 0)) {
    var jsx$2 = this$2.NIL$6
  } else {
    var b$1 = new $c_sci_VectorBuilder().init___();
    var i$1 = 0;
    var len$1 = $uI(array$1["length"]);
    while ((i$1 < len$1)) {
      var index$1 = i$1;
      var arg1$1 = array$1[index$1];
      b$1.$$plus$eq__O__sci_VectorBuilder(arg1$1);
      i$1 = ((1 + i$1) | 0)
    };
    var jsx$2 = b$1.result__sci_Vector()
  };
  this.QuantizationOptions$1 = jsx$2;
  return this
});
var $d_Lexample_PianoRollSettings$ = new $TypeData().initClass({
  Lexample_PianoRollSettings$: 0
}, false, "example.PianoRollSettings$", {
  Lexample_PianoRollSettings$: 1,
  O: 1
});
$c_Lexample_PianoRollSettings$.prototype.$classData = $d_Lexample_PianoRollSettings$;
var $n_Lexample_PianoRollSettings$ = (void 0);
function $m_Lexample_PianoRollSettings$() {
  if ((!$n_Lexample_PianoRollSettings$)) {
    $n_Lexample_PianoRollSettings$ = new $c_Lexample_PianoRollSettings$().init___()
  };
  return $n_Lexample_PianoRollSettings$
}
/** @constructor */
function $c_Lexample_PianoRollWorld() {
  $c_O.call(this);
  this.dirtyNote$1 = null;
  this.locatorBeat$1 = 0.0;
  this.startBeat$1 = 0;
  this.widthBeats$1 = 0;
  this.maxTicks$1 = 0;
  this.maxMeasures$1 = 0;
  this.startMeasure$1 = 0;
  this.rollLowNote$1 = 0;
  this.rollRange$1 = 0;
  this.settings$1 = null;
  this.messageQueue$1 = null;
  this.song$1 = null;
  this.notes$1 = null;
  this.tickLogic$1 = null;
  this.STEP$undRATIO$1 = 0;
  this.maxNote$1 = 0;
  this.minNote$1 = 0;
  this.minRollRange$1 = 0
}
$c_Lexample_PianoRollWorld.prototype = new $h_O();
$c_Lexample_PianoRollWorld.prototype.constructor = $c_Lexample_PianoRollWorld;
/** @constructor */
function $h_Lexample_PianoRollWorld() {
  /*<skip>*/
}
$h_Lexample_PianoRollWorld.prototype = $c_Lexample_PianoRollWorld.prototype;
$c_Lexample_PianoRollWorld.prototype.zoomIn__D__V = (function(factor) {
  var $$this = (this.widthBeats$1 / factor);
  var that = $m_Lexample_PianoRollConfig$().BeatResolution$1;
  this.widthBeats$1 = $doubleToInt($uD($g["Math"]["max"]($$this, that)))
});
$c_Lexample_PianoRollWorld.prototype.init___ = (function() {
  this.dirtyNote$1 = $m_s_None$();
  this.locatorBeat$1 = 0.0;
  this.startBeat$1 = 0;
  this.widthBeats$1 = 100;
  this.maxTicks$1 = 100;
  this.maxMeasures$1 = ((this.maxTicks$1 / 10) | 0);
  this.startMeasure$1 = 0;
  this.rollLowNote$1 = 50;
  this.rollRange$1 = 40;
  this.settings$1 = new $c_Lexample_PianoRollSettings().init___();
  this.messageQueue$1 = new $c_Lexample_MessageQueue().init___();
  this.song$1 = $m_Lexample_Song$().demoSong2$1;
  this.notes$1 = new $c_Lexample_NotesDataStructure().init___I__sci_Vector($imul(this.song$1.measures$1, $m_Lexample_PianoRollConfig$().BeatResolution$1), this.song$1.initNotes$1);
  this.tickLogic$1 = new $c_Lexample_TickRenderLogic().init___Lexample_Song(this.song$1);
  this.STEP$undRATIO$1 = 20;
  this.maxNote$1 = 127;
  this.minNote$1 = 0;
  this.minRollRange$1 = 6;
  return this
});
$c_Lexample_PianoRollWorld.prototype.endBeat__I = (function() {
  return ((this.startBeat$1 + this.widthBeats$1) | 0)
});
$c_Lexample_PianoRollWorld.prototype.zoomInRoll__D__V = (function(factor) {
  var $$this = (this.rollRange$1 / factor);
  var that = this.minRollRange$1;
  this.rollRange$1 = $doubleToInt($uD($g["Math"]["max"]($$this, that)))
});
$c_Lexample_PianoRollWorld.prototype.shiftBeat__Z__V = (function(right) {
  var magnitude = $m_Lexample_MyMath$().ceil__I__I__I(this.widthBeats$1, this.STEP$undRATIO$1);
  var deltaBeat = (right ? magnitude : ((-magnitude) | 0));
  this.startBeat$1 = $m_Lexample_MyMath$().clamp__I__I__I__I(((this.startBeat$1 + deltaBeat) | 0), 0, ((this.song$1.totalBeats$1 - this.widthBeats$1) | 0))
});
$c_Lexample_PianoRollWorld.prototype.safeSetBeat__D__V = (function(beat) {
  var b = ((this.song$1.totalBeats$1 - this.widthBeats$1) | 0);
  this.startBeat$1 = $doubleToInt($uD($g["Math"]["min"](beat, b)))
});
$c_Lexample_PianoRollWorld.prototype.zoomOut__D__V = (function(factor) {
  var $$this = (this.widthBeats$1 * factor);
  var that = ((this.song$1.totalBeats$1 - this.startBeat$1) | 0);
  this.widthBeats$1 = $doubleToInt($uD($g["Math"]["min"]($$this, that)))
});
$c_Lexample_PianoRollWorld.prototype.rollHighNote__I = (function() {
  return ((this.rollLowNote$1 + this.rollRange$1) | 0)
});
$c_Lexample_PianoRollWorld.prototype.zoomOutRoll__D__V = (function(factor) {
  var $$this = (this.rollRange$1 * factor);
  var that = ((this.maxNote$1 - this.rollLowNote$1) | 0);
  this.rollRange$1 = $doubleToInt($uD($g["Math"]["min"]($$this, that)))
});
$c_Lexample_PianoRollWorld.prototype.shiftRoll__Z__V = (function(up) {
  var magnitude = $m_Lexample_MyMath$().ceil__I__I__I(this.rollRange$1, 20);
  var delta = (up ? magnitude : ((-magnitude) | 0));
  this.rollLowNote$1 = $m_Lexample_MyMath$().clamp__I__I__I__I(((this.rollLowNote$1 + delta) | 0), this.minNote$1, ((this.maxNote$1 - this.rollRange$1) | 0))
});
var $d_Lexample_PianoRollWorld = new $TypeData().initClass({
  Lexample_PianoRollWorld: 0
}, false, "example.PianoRollWorld", {
  Lexample_PianoRollWorld: 1,
  O: 1
});
$c_Lexample_PianoRollWorld.prototype.$classData = $d_Lexample_PianoRollWorld;
/** @constructor */
function $c_Lexample_RenderObject() {
  $c_O.call(this);
  this.x$1 = 0.0;
  this.y$1 = 0.0;
  this.w$1 = 0.0;
  this.h$1 = 0.0
}
$c_Lexample_RenderObject.prototype = new $h_O();
$c_Lexample_RenderObject.prototype.constructor = $c_Lexample_RenderObject;
/** @constructor */
function $h_Lexample_RenderObject() {
  /*<skip>*/
}
$h_Lexample_RenderObject.prototype = $c_Lexample_RenderObject.prototype;
$c_Lexample_RenderObject.prototype.init___ = (function() {
  this.x$1 = 0.0;
  this.y$1 = 0.0;
  this.w$1 = 100.0;
  this.h$1 = 100.0;
  return this
});
$c_Lexample_RenderObject.prototype.containsPoint__D__D__Z = (function(x, y) {
  return ((((x >= this.x$1) && (x <= (this.x$1 + this.w$1))) && (y >= this.y$1)) && (y <= (this.y$1 + this.h$1)))
});
$c_Lexample_RenderObject.prototype.onClick__D__D__V = (function(x, y) {
  /*<skip>*/
});
$c_Lexample_RenderObject.prototype.render__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V = (function(x, y, width, height, ctx) {
  this.x$1 = x;
  this.y$1 = y;
  this.w$1 = width;
  this.h$1 = height;
  this.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(x, y, width, height, ctx)
});
$c_Lexample_RenderObject.prototype.probeClick__D__D__V = (function(x, y) {
  if (this.containsPoint__D__D__Z(x, y)) {
    this.onClick__D__D__V(x, y)
  }
});
function $is_Lexample_RenderObject(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_RenderObject)))
}
function $as_Lexample_RenderObject(obj) {
  return (($is_Lexample_RenderObject(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.RenderObject"))
}
function $isArrayOf_Lexample_RenderObject(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_RenderObject)))
}
function $asArrayOf_Lexample_RenderObject(obj, depth) {
  return (($isArrayOf_Lexample_RenderObject(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.RenderObject;", depth))
}
/** @constructor */
function $c_Lexample_ScalaJSExample$() {
  $c_O.call(this);
  this.log$1 = null;
  this.inputManager$1 = null;
  this.container$1 = null;
  this.controller$1 = null;
  this.renderer$1 = null;
  this.pianoRollBounds$1 = null;
  this.counter$1 = 0;
  this.prevTimStamp$1 = 0.0;
  this.frames$1 = 0
}
$c_Lexample_ScalaJSExample$.prototype = new $h_O();
$c_Lexample_ScalaJSExample$.prototype.constructor = $c_Lexample_ScalaJSExample$;
/** @constructor */
function $h_Lexample_ScalaJSExample$() {
  /*<skip>*/
}
$h_Lexample_ScalaJSExample$.prototype = $c_Lexample_ScalaJSExample$.prototype;
$c_Lexample_ScalaJSExample$.prototype.init___ = (function() {
  $n_Lexample_ScalaJSExample$ = this;
  this.log$1 = new $c_Lexample_Logger().init___jl_Class($objectGetClass(this));
  this.inputManager$1 = null;
  this.container$1 = null;
  this.controller$1 = null;
  this.renderer$1 = null;
  this.pianoRollBounds$1 = null;
  this.counter$1 = 0;
  this.prevTimStamp$1 = 0.0;
  this.frames$1 = 100;
  return this
});
$c_Lexample_ScalaJSExample$.prototype.main__Lorg_scalajs_dom_raw_HTMLCanvasElement__V = (function(canvas) {
  this.inputManager$1 = new $c_Lexample_HTML5InputManager().init___Lorg_scalajs_dom_raw_HTMLCanvasElement(canvas);
  this.container$1 = new $c_Lexample_PianoRollWorld().init___();
  canvas["width"] = $uI(canvas["parentElement"]["clientWidth"]);
  canvas["height"] = $uI(canvas["parentElement"]["clientHeight"]);
  this.pianoRollBounds$1 = new $c_Lexample_Rectangle().init___D__D__D__D(0.0, 0.0, $uI(canvas["width"]), $uI(canvas["height"]));
  this.renderer$1 = new $c_Lexample_PianoRollRenderer().init___Lexample_PianoRollWorld__Lorg_scalajs_dom_raw_HTMLCanvasElement__Lexample_Rectangle(this.container$1, canvas, this.pianoRollBounds$1);
  this.controller$1 = new $c_Lexample_PianoRollController().init___Lexample_PianoRollWorld__Lexample_PianoRollRenderer(this.container$1, this.renderer$1);
  var this$1 = this.inputManager$1;
  var inputProcessor = this.controller$1;
  this$1.inputProcessor$1 = inputProcessor;
  $g["requestAnimationFrame"]((function(timeStamp$2) {
    var timeStamp = $uD(timeStamp$2);
    $m_Lexample_ScalaJSExample$().render__D__V(timeStamp)
  }))
});
$c_Lexample_ScalaJSExample$.prototype.$$js$exported$meth$main__Lorg_scalajs_dom_raw_HTMLCanvasElement__O = (function(canvas) {
  this.main__Lorg_scalajs_dom_raw_HTMLCanvasElement__V(canvas)
});
$c_Lexample_ScalaJSExample$.prototype.render__D__V = (function(timeStamp) {
  if (((this.counter$1 % this.frames$1) === 0)) {
    var elapsedTime = (timeStamp - this.prevTimStamp$1);
    var fps = ($imul(1000, this.frames$1) / elapsedTime);
    this.log$1.apply__T__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["FPS ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([fps])));
    this.counter$1 = 0;
    this.prevTimStamp$1 = timeStamp
  };
  this.counter$1 = ((1 + this.counter$1) | 0);
  this.renderer$1.render__Lexample_Rectangle__V(this.pianoRollBounds$1);
  this.controller$1.processMessages__V();
  $g["requestAnimationFrame"]((function(timeStamp$2) {
    var timeStamp$1 = $uD(timeStamp$2);
    $m_Lexample_ScalaJSExample$().render__D__V(timeStamp$1)
  }))
});
$c_Lexample_ScalaJSExample$.prototype["main"] = (function(arg$1) {
  var prep0 = arg$1;
  return this.$$js$exported$meth$main__Lorg_scalajs_dom_raw_HTMLCanvasElement__O(prep0)
});
var $d_Lexample_ScalaJSExample$ = new $TypeData().initClass({
  Lexample_ScalaJSExample$: 0
}, false, "example.ScalaJSExample$", {
  Lexample_ScalaJSExample$: 1,
  O: 1
});
$c_Lexample_ScalaJSExample$.prototype.$classData = $d_Lexample_ScalaJSExample$;
var $n_Lexample_ScalaJSExample$ = (void 0);
function $m_Lexample_ScalaJSExample$() {
  if ((!$n_Lexample_ScalaJSExample$)) {
    $n_Lexample_ScalaJSExample$ = new $c_Lexample_ScalaJSExample$().init___()
  };
  return $n_Lexample_ScalaJSExample$
}
$e["example"] = ($e["example"] || {});
$e["example"]["ScalaJSExample"] = $m_Lexample_ScalaJSExample$;
/** @constructor */
function $c_Lexample_TickRenderLogic() {
  $c_O.call(this);
  this.example$TickRenderLogic$$song$f = null
}
$c_Lexample_TickRenderLogic.prototype = new $h_O();
$c_Lexample_TickRenderLogic.prototype.constructor = $c_Lexample_TickRenderLogic;
/** @constructor */
function $h_Lexample_TickRenderLogic() {
  /*<skip>*/
}
$h_Lexample_TickRenderLogic.prototype = $c_Lexample_TickRenderLogic.prototype;
$c_Lexample_TickRenderLogic.prototype.init___Lexample_Song = (function(song) {
  this.example$TickRenderLogic$$song$f = song;
  return this
});
$c_Lexample_TickRenderLogic.prototype.getTickMarkers__I__I__I__I__sc_Iterator = (function(startBeat, widthBeat, maxTicksPerWindow, subdivideMeasuresThresh) {
  var startMeasure = this.example$TickRenderLogic$$song$f.getMeasureClosestToBeat__I__Z__I(startBeat, false);
  var endBeat = ((startBeat + widthBeat) | 0);
  var endMeasure = this.example$TickRenderLogic$$song$f.getMeasureClosestToBeat__I__Z__I(endBeat, false);
  var widthMeasures = ((endMeasure - startMeasure) | 0);
  if ((widthBeat > $imul(30, $m_Lexample_PianoRollConfig$().BeatResolution$1))) {
    var stepSize = $m_Lexample_MyMath$().ceil__I__I__I(widthMeasures, 30);
    var adjustedStartMeasure = $imul(((startMeasure / stepSize) | 0), stepSize);
    var adjustedStartMeasureV2 = (($uI(this.example$TickRenderLogic$$song$f.MeasureToBeatMap$1.apply__I__O(adjustedStartMeasure)) < startBeat) ? ((adjustedStartMeasure + stepSize) | 0) : adjustedStartMeasure);
    $m_s_package$();
    var this$2 = new $c_sc_Iterator$$anon$6().init___I__I__I(adjustedStartMeasureV2, endMeasure, stepSize);
    var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
      return (function(measure$2) {
        var measure = $uI(measure$2);
        return new $c_Lexample_TickMarker().init___I__I($uI(arg$outer.example$TickRenderLogic$$song$f.MeasureToBeatMap$1.apply__I__O(measure)), measure)
      })
    })(this));
    return new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$2, f)
  } else {
    var tickSize = $m_Lexample_MyMath$().powerOfTwoAbove__I__I(((widthBeat / maxTicksPerWindow) | 0));
    $m_s_package$();
    var end = ((1 + endMeasure) | 0);
    var this$4 = new $c_sc_Iterator$$anon$6().init___I__I__I(startMeasure, end, 1);
    var f$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer$1) {
      return (function(measure$2$1) {
        var measure$1 = $uI(measure$2$1);
        var startBeatOfMeasure = $uI(arg$outer$1.example$TickRenderLogic$$song$f.MeasureToBeatMap$1.apply__I__O(measure$1));
        return new $c_s_Tuple2$mcII$sp().init___I__I(measure$1, startBeatOfMeasure)
      })
    })(this));
    var this$5 = new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$4, f$1);
    var f$2 = new $c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3().init___Lexample_TickRenderLogic__I__I__I(this, startBeat, endBeat, tickSize);
    return new $c_sc_Iterator$$anon$12().init___sc_Iterator__F1(this$5, f$2)
  }
});
$c_Lexample_TickRenderLogic.prototype.getTickSymbol__I__I__I = (function(beat, startBeatOfMeasure) {
  var deltaBeat = ((beat - startBeatOfMeasure) | 0);
  return (((deltaBeat % $m_Lexample_PianoRollConfig$().BeatsInQuarter$1) === 0) ? $m_Lexample_TickMarker$().QuarterTick$1 : (((deltaBeat % $m_Lexample_PianoRollConfig$().BeatsInEighth$1) === 0) ? $m_Lexample_TickMarker$().EightTick$1 : $m_Lexample_TickMarker$().SixteenthTick$1))
});
var $d_Lexample_TickRenderLogic = new $TypeData().initClass({
  Lexample_TickRenderLogic: 0
}, false, "example.TickRenderLogic", {
  Lexample_TickRenderLogic: 1,
  O: 1
});
$c_Lexample_TickRenderLogic.prototype.$classData = $d_Lexample_TickRenderLogic;
/** @constructor */
function $c_Lexample_audio_AudioManager$() {
  $c_O.call(this);
  this.audio$1 = null
}
$c_Lexample_audio_AudioManager$.prototype = new $h_O();
$c_Lexample_audio_AudioManager$.prototype.constructor = $c_Lexample_audio_AudioManager$;
/** @constructor */
function $h_Lexample_audio_AudioManager$() {
  /*<skip>*/
}
$h_Lexample_audio_AudioManager$.prototype = $c_Lexample_audio_AudioManager$.prototype;
$c_Lexample_audio_AudioManager$.prototype.init___ = (function() {
  $n_Lexample_audio_AudioManager$ = this;
  this.audio$1 = new $g["AudioContext"]();
  return this
});
var $d_Lexample_audio_AudioManager$ = new $TypeData().initClass({
  Lexample_audio_AudioManager$: 0
}, false, "example.audio.AudioManager$", {
  Lexample_audio_AudioManager$: 1,
  O: 1
});
$c_Lexample_audio_AudioManager$.prototype.$classData = $d_Lexample_audio_AudioManager$;
var $n_Lexample_audio_AudioManager$ = (void 0);
function $m_Lexample_audio_AudioManager$() {
  if ((!$n_Lexample_audio_AudioManager$)) {
    $n_Lexample_audio_AudioManager$ = new $c_Lexample_audio_AudioManager$().init___()
  };
  return $n_Lexample_audio_AudioManager$
}
/** @constructor */
function $c_Lexample_audio_NotePlayer() {
  $c_O.call(this);
  this.pRollWorld$1 = null;
  this.song$1 = null;
  this.notes$1 = null;
  this.log$1 = null;
  this.synth$1 = null;
  this.playerListeners$1 = null;
  this.songStartPositionTime$1 = 0.0;
  this.absStartTime$1 = 0.0;
  this.StartOffsetTime$1 = 0.0;
  this.noteIterator$1 = null;
  this.noteIteratorDirty$1 = null;
  this.IntervalTimeMs$1 = 0;
  this.LookAheadSeconds$1 = 0.0;
  this.intervalHandle$1 = 0
}
$c_Lexample_audio_NotePlayer.prototype = new $h_O();
$c_Lexample_audio_NotePlayer.prototype.constructor = $c_Lexample_audio_NotePlayer;
/** @constructor */
function $h_Lexample_audio_NotePlayer() {
  /*<skip>*/
}
$h_Lexample_audio_NotePlayer.prototype = $c_Lexample_audio_NotePlayer.prototype;
$c_Lexample_audio_NotePlayer.prototype.playNote__Lexample_Note__D__V = (function(note, time) {
  this.synth$1.polyphonicPlay__Lexample_Note__D__D__V(note, time, (($m_Lexample_NoteTimeCalculator$().getTimeOfBeat__D__Lexample_Song__D(note.endBeat$1, this.song$1) - this.songStartPositionTime$1) + this.absStartTime$1))
});
$c_Lexample_audio_NotePlayer.prototype.registerPlayerListener__Lexample_PlayerListener__V = (function(playerListener) {
  var this$1 = this.playerListeners$1;
  var array = [playerListener];
  var n = $uI(array["length"]);
  var n$1 = ((this$1.size0$6 + n) | 0);
  $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this$1, n$1);
  var xs = this$1.array$6;
  var start = this$1.size0$6;
  var i = 0;
  var j = start;
  var $$this = $uI(array["length"]);
  var $$this$1 = (($$this < n) ? $$this : n);
  var that = ((xs.u["length"] - start) | 0);
  var end = (($$this$1 < that) ? $$this$1 : that);
  while ((i < end)) {
    var jsx$1 = j;
    var index = i;
    xs.u[jsx$1] = array[index];
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  };
  this$1.size0$6 = ((this$1.size0$6 + n) | 0)
});
$c_Lexample_audio_NotePlayer.prototype.isPlaying__Z = (function() {
  return (this.intervalHandle$1 !== (-1))
});
$c_Lexample_audio_NotePlayer.prototype.init___Lexample_PianoRollWorld = (function(pRollWorld) {
  this.pRollWorld$1 = pRollWorld;
  this.song$1 = pRollWorld.song$1;
  this.notes$1 = pRollWorld.notes$1;
  this.log$1 = new $c_Lexample_Logger().init___O(this);
  this.synth$1 = new $c_Lexample_audio_Synth().init___();
  this.playerListeners$1 = new $c_scm_ArrayBuffer().init___();
  this.songStartPositionTime$1 = 0.0;
  this.absStartTime$1 = 0.0;
  this.StartOffsetTime$1 = 0.01;
  this.noteIterator$1 = null;
  this.noteIteratorDirty$1 = null;
  this.IntervalTimeMs$1 = 25;
  this.LookAheadSeconds$1 = 0.1;
  this.intervalHandle$1 = (-1);
  return this
});
$c_Lexample_audio_NotePlayer.prototype.stop__V = (function() {
  this.log$1.apply__T__V("Stopping interval handle");
  if ((this.intervalHandle$1 !== (-1))) {
    $g["clearInterval"](this.intervalHandle$1)
  };
  this.intervalHandle$1 = (-1);
  this.synth$1.polyphonicStop__V()
});
$c_Lexample_audio_NotePlayer.prototype.scheduleNextBatch__V = (function() {
  var this$1 = this.noteIterator$1;
  if ($s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this$1)) {
    if ((this.noteIteratorDirty$1 !== null)) {
      this.playNote__Lexample_Note__D__V($as_Lexample_Note(this.noteIteratorDirty$1.$$und1__O()), ((this.absStartTime$1 + this.noteIteratorDirty$1.$$und2$mcD$sp__D()) - this.songStartPositionTime$1));
      this.noteIteratorDirty$1 = null
    }
  } else {
    while ((this.noteIterator$1.hasNext__Z() && (($uD($m_Lexample_audio_AudioManager$().audio$1["currentTime"]) + this.LookAheadSeconds$1) > ((this.absStartTime$1 + this.noteIteratorDirty$1.$$und2$mcD$sp__D()) - this.songStartPositionTime$1)))) {
      this.playNote__Lexample_Note__D__V($as_Lexample_Note(this.noteIteratorDirty$1.$$und1__O()), ((this.absStartTime$1 + this.noteIteratorDirty$1.$$und2$mcD$sp__D()) - this.songStartPositionTime$1));
      this.noteIteratorDirty$1 = $as_T2(this.noteIterator$1.next__O())
    }
  };
  var beat = $m_Lexample_NoteTimeCalculator$().getBeatOfTime__D__Lexample_Song__D((($uD($m_Lexample_audio_AudioManager$().audio$1["currentTime"]) - this.absStartTime$1) + this.songStartPositionTime$1), this.song$1);
  if ((this.pRollWorld$1.locatorBeat$1 > this.song$1.totalBeats$1)) {
    this.stop__V();
    var this$2 = this.playerListeners$1;
    var i = 0;
    var top = this$2.size0$6;
    while ((i < top)) {
      var arg1 = this$2.array$6.u[i];
      var x$1 = $as_Lexample_PlayerListener(arg1);
      x$1.onEnd__V();
      i = ((1 + i) | 0)
    }
  };
  var this$3 = this.playerListeners$1;
  var i$1 = 0;
  var top$1 = this$3.size0$6;
  while ((i$1 < top$1)) {
    var arg1$1 = this$3.array$6.u[i$1];
    var listener = $as_Lexample_PlayerListener(arg1$1);
    listener.onBeatChanged__D__V(beat);
    i$1 = ((1 + i$1) | 0)
  }
});
$c_Lexample_audio_NotePlayer.prototype.setPlayPoint__D__D__V = (function(beat, absTime) {
  this.stop__V();
  this.absStartTime$1 = (absTime + this.StartOffsetTime$1);
  this.songStartPositionTime$1 = $m_Lexample_NoteTimeCalculator$().getTimeOfBeat__D__Lexample_Song__D(beat, this.song$1);
  this.log$1.apply__T__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Songstartposition ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.songStartPositionTime$1])));
  this.noteIterator$1 = $m_Lexample_NoteTimeCalculator$().iterator__D__Lexample_Song__Lexample_NotesDataStructure__sc_Iterator(beat, this.song$1, this.notes$1);
  if (this.noteIterator$1.hasNext__Z()) {
    this.noteIteratorDirty$1 = $as_T2(this.noteIterator$1.next__O());
    this.intervalHandle$1 = $uI($g["setInterval"]((function(arg$outer) {
      return (function() {
        arg$outer.scheduleNextBatch__V()
      })
    })(this), this.IntervalTimeMs$1))
  }
});
var $d_Lexample_audio_NotePlayer = new $TypeData().initClass({
  Lexample_audio_NotePlayer: 0
}, false, "example.audio.NotePlayer", {
  Lexample_audio_NotePlayer: 1,
  O: 1
});
$c_Lexample_audio_NotePlayer.prototype.$classData = $d_Lexample_audio_NotePlayer;
/** @constructor */
function $c_Lexample_audio_Synth() {
  $c_O.call(this);
  this.log$1 = null;
  this.gainNode$1 = null;
  this.oscillator$1 = null;
  this.polyphony$1 = 0;
  this.oscillators$1 = null
}
$c_Lexample_audio_Synth.prototype = new $h_O();
$c_Lexample_audio_Synth.prototype.constructor = $c_Lexample_audio_Synth;
/** @constructor */
function $h_Lexample_audio_Synth() {
  /*<skip>*/
}
$h_Lexample_audio_Synth.prototype = $c_Lexample_audio_Synth.prototype;
$c_Lexample_audio_Synth.prototype.polyphonicStop__V = (function() {
  this.oscillators$1.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(osc$2) {
    var osc = $as_T3(osc$2);
    osc.$$und2$1["gain"]["value"] = 0.0
  })))
});
$c_Lexample_audio_Synth.prototype.init___ = (function() {
  this.log$1 = new $c_Lexample_Logger().init___O(this);
  this.gainNode$1 = $m_Lexample_audio_AudioManager$().audio$1["createGain"]();
  this.oscillator$1 = $m_Lexample_audio_AudioManager$().audio$1["createOscillator"]();
  this.oscillator$1["connect"](this.gainNode$1);
  this.oscillator$1["type"] = "triangle";
  this.gainNode$1["connect"]($m_Lexample_audio_AudioManager$().audio$1["destination"]);
  this.polyphony$1 = 32;
  $m_sci_IndexedSeq$();
  $m_sc_IndexedSeq$();
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  var b$1 = new $c_sci_VectorBuilder().init___();
  var i = 1;
  var count = 0;
  while ((i !== 6)) {
    var arg1 = i;
    var gainNode = $m_Lexample_audio_AudioManager$().audio$1["createGain"]();
    var oscillator = $m_Lexample_audio_AudioManager$().audio$1["createOscillator"]();
    oscillator["connect"](gainNode);
    oscillator["type"] = "triangle";
    gainNode["connect"]($m_Lexample_audio_AudioManager$().audio$1["destination"]);
    oscillator["start"]();
    gainNode["gain"]["value"] = 0.0;
    var elem = new $c_T3().init___O__O__O(oscillator, gainNode, new $c_Lexample_audio_BooleanWrapper().init___Z(true));
    b$1.$$plus$eq__O__sci_VectorBuilder(elem);
    count = ((1 + count) | 0);
    i = ((1 + i) | 0)
  };
  this.oscillators$1 = b$1.result__sci_Vector();
  return this
});
$c_Lexample_audio_Synth.prototype.polyphonicPlay__Lexample_Note__D__D__V = (function(note, start, end) {
  var i = 0;
  var $continue = true;
  if (((start > 0) && (end > 0))) {
    while (((i < this.oscillators$1.length__I()) && $continue)) {
      var x1 = $as_T3(this.oscillators$1.apply__I__O(i));
      if ((x1 !== null)) {
        var oscillator = x1.$$und1$1;
        var gainNode = x1.$$und2$1;
        var free = $as_Lexample_audio_BooleanWrapper(x1.$$und3$1);
        var x$1_$_$$und1$1 = oscillator;
        var x$1_$_$$und2$1 = gainNode;
        var x$1_$_$$und3$1 = free
      } else {
        var x$1_$_$$und1$1;
        var x$1_$_$$und2$1;
        var x$1_$_$$und3$1;
        throw new $c_s_MatchError().init___O(x1)
      };
      var oscillator$2 = x$1_$_$$und1$1;
      var gainNode$2 = x$1_$_$$und2$1;
      var free$2 = $as_Lexample_audio_BooleanWrapper(x$1_$_$$und3$1);
      if (free$2.isTrue$1) {
        this.log$1.apply__T__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Voice ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([i])));
        var jsx$1 = oscillator$2["frequency"];
        var b = ((((-69) + note.midi$1) | 0) / 12.0);
        jsx$1["setValueAtTime"]((440.0 * $uD($g["Math"]["pow"](2.0, b))), start);
        gainNode$2["gain"]["setTargetAtTime"](0.5, start, 0.01);
        gainNode$2["gain"]["setTargetAtTime"](0.0, end, 0.01);
        free$2.isTrue$1 = false;
        $g["setTimeout"]((function(free$1) {
          return (function() {
            free$1.isTrue$1 = true
          })
        })(free$2), (1000 * (end - start)));
        $continue = false
      };
      i = ((1 + i) | 0)
    }
  }
});
var $d_Lexample_audio_Synth = new $TypeData().initClass({
  Lexample_audio_Synth: 0
}, false, "example.audio.Synth", {
  Lexample_audio_Synth: 1,
  O: 1
});
$c_Lexample_audio_Synth.prototype.$classData = $d_Lexample_audio_Synth;
/** @constructor */
function $c_jl_Character$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = 0;
  this.MAX$undVALUE$1 = 0;
  this.SIZE$1 = 0;
  this.MIN$undRADIX$1 = 0;
  this.MAX$undRADIX$1 = 0;
  this.MIN$undHIGH$undSURROGATE$1 = 0;
  this.MAX$undHIGH$undSURROGATE$1 = 0;
  this.MIN$undLOW$undSURROGATE$1 = 0;
  this.MAX$undLOW$undSURROGATE$1 = 0;
  this.MIN$undSURROGATE$1 = 0;
  this.MAX$undSURROGATE$1 = 0;
  this.MIN$undCODE$undPOINT$1 = 0;
  this.MAX$undCODE$undPOINT$1 = 0;
  this.MIN$undSUPPLEMENTARY$undCODE$undPOINT$1 = 0;
  this.HighSurrogateMask$1 = 0;
  this.HighSurrogateID$1 = 0;
  this.LowSurrogateMask$1 = 0;
  this.LowSurrogateID$1 = 0;
  this.SurrogateUsefulPartMask$1 = 0;
  this.java$lang$Character$$charTypesFirst256$1 = null;
  this.charTypeIndices$1 = null;
  this.charTypes$1 = null;
  this.isMirroredIndices$1 = null;
  this.bitmap$0$1 = 0
}
$c_jl_Character$.prototype = new $h_O();
$c_jl_Character$.prototype.constructor = $c_jl_Character$;
/** @constructor */
function $h_jl_Character$() {
  /*<skip>*/
}
$h_jl_Character$.prototype = $c_jl_Character$.prototype;
$c_jl_Character$.prototype.charTypeIndices__p1__AI = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.charTypeIndices$lzycompute__p1__AI() : this.charTypeIndices$1)
});
$c_jl_Character$.prototype.getType__I__I = (function(codePoint) {
  return ((codePoint < 0) ? 0 : ((codePoint < 256) ? this.java$lang$Character$$charTypesFirst256__AB().u[codePoint] : this.getTypeGE256__p1__I__B(codePoint)))
});
$c_jl_Character$.prototype.charTypeIndices$lzycompute__p1__AI = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([257, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 3, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 2, 2, 1, 1, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 2, 1, 2, 2, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 69, 1, 27, 18, 4, 12, 14, 5, 7, 1, 1, 1, 17, 112, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 5, 2, 1, 1, 3, 1, 1, 1, 2, 1, 17, 1, 9, 35, 1, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 2, 2, 51, 48, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 38, 2, 1, 6, 1, 39, 1, 1, 1, 4, 1, 1, 45, 1, 1, 1, 2, 1, 2, 1, 1, 8, 27, 5, 3, 2, 11, 5, 1, 3, 2, 1, 2, 2, 11, 1, 2, 2, 32, 1, 10, 21, 10, 4, 2, 1, 99, 1, 1, 7, 1, 1, 6, 2, 2, 1, 4, 2, 10, 3, 2, 1, 14, 1, 1, 1, 1, 30, 27, 2, 89, 11, 1, 14, 10, 33, 9, 2, 1, 3, 1, 5, 22, 4, 1, 9, 1, 3, 1, 5, 2, 15, 1, 25, 3, 2, 1, 65, 1, 1, 11, 55, 27, 1, 3, 1, 54, 1, 1, 1, 1, 3, 8, 4, 1, 2, 1, 7, 10, 2, 2, 10, 1, 1, 6, 1, 7, 1, 1, 2, 1, 8, 2, 2, 2, 22, 1, 7, 1, 1, 3, 4, 2, 1, 1, 3, 4, 2, 2, 2, 2, 1, 1, 8, 1, 4, 2, 1, 3, 2, 2, 10, 2, 2, 6, 1, 1, 5, 2, 1, 1, 6, 4, 2, 2, 22, 1, 7, 1, 2, 1, 2, 1, 2, 2, 1, 1, 3, 2, 4, 2, 2, 3, 3, 1, 7, 4, 1, 1, 7, 10, 2, 3, 1, 11, 2, 1, 1, 9, 1, 3, 1, 22, 1, 7, 1, 2, 1, 5, 2, 1, 1, 3, 5, 1, 2, 1, 1, 2, 1, 2, 1, 15, 2, 2, 2, 10, 1, 1, 15, 1, 2, 1, 8, 2, 2, 2, 22, 1, 7, 1, 2, 1, 5, 2, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 1, 8, 1, 1, 4, 2, 1, 3, 2, 2, 10, 1, 1, 6, 10, 1, 1, 1, 6, 3, 3, 1, 4, 3, 2, 1, 1, 1, 2, 3, 2, 3, 3, 3, 12, 4, 2, 1, 2, 3, 3, 1, 3, 1, 2, 1, 6, 1, 14, 10, 3, 6, 1, 1, 6, 3, 1, 8, 1, 3, 1, 23, 1, 10, 1, 5, 3, 1, 3, 4, 1, 3, 1, 4, 7, 2, 1, 2, 6, 2, 2, 2, 10, 8, 7, 1, 2, 2, 1, 8, 1, 3, 1, 23, 1, 10, 1, 5, 2, 1, 1, 1, 1, 5, 1, 1, 2, 1, 2, 2, 7, 2, 7, 1, 1, 2, 2, 2, 10, 1, 2, 15, 2, 1, 8, 1, 3, 1, 41, 2, 1, 3, 4, 1, 3, 1, 3, 1, 1, 8, 1, 8, 2, 2, 2, 10, 6, 3, 1, 6, 2, 2, 1, 18, 3, 24, 1, 9, 1, 1, 2, 7, 3, 1, 4, 3, 3, 1, 1, 1, 8, 18, 2, 1, 12, 48, 1, 2, 7, 4, 1, 6, 1, 8, 1, 10, 2, 37, 2, 1, 1, 2, 2, 1, 1, 2, 1, 6, 4, 1, 7, 1, 3, 1, 1, 1, 1, 2, 2, 1, 4, 1, 2, 6, 1, 2, 1, 2, 5, 1, 1, 1, 6, 2, 10, 2, 4, 32, 1, 3, 15, 1, 1, 3, 2, 6, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 8, 1, 36, 4, 14, 1, 5, 1, 2, 5, 11, 1, 36, 1, 8, 1, 6, 1, 2, 5, 4, 2, 37, 43, 2, 4, 1, 6, 1, 2, 2, 2, 1, 10, 6, 6, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 2, 2, 6, 1, 1, 1, 10, 3, 1, 2, 38, 1, 1, 5, 1, 2, 43, 1, 1, 332, 1, 4, 2, 7, 1, 1, 1, 4, 2, 41, 1, 4, 2, 33, 1, 4, 2, 7, 1, 1, 1, 4, 2, 15, 1, 57, 1, 4, 2, 67, 2, 3, 9, 20, 3, 16, 10, 6, 85, 11, 1, 620, 2, 17, 1, 26, 1, 1, 3, 75, 3, 3, 15, 13, 1, 4, 3, 11, 18, 3, 2, 9, 18, 2, 12, 13, 1, 3, 1, 2, 12, 52, 2, 1, 7, 8, 1, 2, 11, 3, 1, 3, 1, 1, 1, 2, 10, 6, 10, 6, 6, 1, 4, 3, 1, 1, 10, 6, 35, 1, 52, 8, 41, 1, 1, 5, 70, 10, 29, 3, 3, 4, 2, 3, 4, 2, 1, 6, 3, 4, 1, 3, 2, 10, 30, 2, 5, 11, 44, 4, 17, 7, 2, 6, 10, 1, 3, 34, 23, 2, 3, 2, 2, 53, 1, 1, 1, 7, 1, 1, 1, 1, 2, 8, 6, 10, 2, 1, 10, 6, 10, 6, 7, 1, 6, 82, 4, 1, 47, 1, 1, 5, 1, 1, 5, 1, 2, 7, 4, 10, 7, 10, 9, 9, 3, 2, 1, 30, 1, 4, 2, 2, 1, 1, 2, 2, 10, 44, 1, 1, 2, 3, 1, 1, 3, 2, 8, 4, 36, 8, 8, 2, 2, 3, 5, 10, 3, 3, 10, 30, 6, 2, 64, 8, 8, 3, 1, 13, 1, 7, 4, 1, 4, 2, 1, 2, 9, 44, 63, 13, 1, 34, 37, 39, 21, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 8, 6, 2, 6, 2, 8, 8, 8, 8, 6, 2, 6, 2, 8, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 14, 2, 8, 8, 8, 8, 8, 8, 5, 1, 2, 4, 1, 1, 1, 3, 3, 1, 2, 4, 1, 3, 4, 2, 2, 4, 1, 3, 8, 5, 3, 2, 3, 1, 2, 4, 1, 2, 1, 11, 5, 6, 2, 1, 1, 1, 2, 1, 1, 1, 8, 1, 1, 5, 1, 9, 1, 1, 4, 2, 3, 1, 1, 1, 11, 1, 1, 1, 10, 1, 5, 5, 6, 1, 1, 2, 6, 3, 1, 1, 1, 10, 3, 1, 1, 1, 13, 3, 27, 21, 13, 4, 1, 3, 12, 15, 2, 1, 4, 1, 2, 1, 3, 2, 3, 1, 1, 1, 2, 1, 5, 6, 1, 1, 1, 1, 1, 1, 4, 1, 1, 4, 1, 4, 1, 2, 2, 2, 5, 1, 4, 1, 1, 2, 1, 1, 16, 35, 1, 1, 4, 1, 6, 5, 5, 2, 4, 1, 2, 1, 2, 1, 7, 1, 31, 2, 2, 1, 1, 1, 31, 268, 8, 4, 20, 2, 7, 1, 1, 81, 1, 30, 25, 40, 6, 18, 12, 39, 25, 11, 21, 60, 78, 22, 183, 1, 9, 1, 54, 8, 111, 1, 144, 1, 103, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 44, 5, 1, 1, 31, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 256, 131, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 63, 1, 1, 1, 1, 32, 1, 1, 258, 48, 21, 2, 6, 3, 10, 166, 47, 1, 47, 1, 1, 1, 3, 2, 1, 1, 1, 1, 1, 1, 4, 1, 1, 2, 1, 6, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 6, 1, 1, 1, 1, 3, 1, 1, 5, 4, 1, 2, 38, 1, 1, 5, 1, 2, 56, 7, 1, 1, 14, 1, 23, 9, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 32, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 9, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 10, 2, 68, 26, 1, 89, 12, 214, 26, 12, 4, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 9, 4, 2, 1, 5, 2, 3, 1, 1, 1, 2, 1, 86, 2, 2, 2, 2, 1, 1, 90, 1, 3, 1, 5, 41, 3, 94, 1, 2, 4, 10, 27, 5, 36, 12, 16, 31, 1, 10, 30, 8, 1, 15, 32, 10, 39, 15, 63, 1, 256, 6582, 10, 64, 20941, 51, 21, 1, 1143, 3, 55, 9, 40, 6, 2, 268, 1, 3, 16, 10, 2, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 1, 70, 10, 2, 6, 8, 23, 9, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 77, 2, 1, 7, 1, 3, 1, 4, 1, 23, 2, 2, 1, 4, 4, 6, 2, 1, 1, 6, 52, 4, 8, 2, 50, 16, 1, 9, 2, 10, 6, 18, 6, 3, 1, 4, 10, 28, 8, 2, 23, 11, 2, 11, 1, 29, 3, 3, 1, 47, 1, 2, 4, 2, 1, 4, 13, 1, 1, 10, 4, 2, 32, 41, 6, 2, 2, 2, 2, 9, 3, 1, 8, 1, 1, 2, 10, 2, 4, 16, 1, 6, 3, 1, 1, 4, 48, 1, 1, 3, 2, 2, 5, 2, 1, 1, 1, 24, 2, 1, 2, 11, 1, 2, 2, 2, 1, 2, 1, 1, 10, 6, 2, 6, 2, 6, 9, 7, 1, 7, 145, 35, 2, 1, 2, 1, 2, 1, 1, 1, 2, 10, 6, 11172, 12, 23, 4, 49, 4, 2048, 6400, 366, 2, 106, 38, 7, 12, 5, 5, 1, 1, 10, 1, 13, 1, 5, 1, 1, 1, 2, 1, 2, 1, 108, 16, 17, 363, 1, 1, 16, 64, 2, 54, 40, 12, 1, 1, 2, 16, 7, 1, 1, 1, 6, 7, 9, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 4, 3, 3, 1, 4, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 2, 4, 5, 1, 135, 2, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 2, 10, 2, 3, 2, 26, 1, 1, 1, 1, 1, 1, 26, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 10, 1, 45, 2, 31, 3, 6, 2, 6, 2, 6, 2, 3, 3, 2, 1, 1, 1, 2, 1, 1, 4, 2, 10, 3, 2, 2, 12, 1, 26, 1, 19, 1, 2, 1, 15, 2, 14, 34, 123, 5, 3, 4, 45, 3, 9, 53, 4, 17, 1, 5, 12, 52, 45, 1, 130, 29, 3, 49, 47, 31, 1, 4, 12, 17, 1, 8, 1, 53, 30, 1, 1, 36, 4, 8, 1, 5, 42, 40, 40, 78, 2, 10, 854, 6, 2, 1, 1, 44, 1, 2, 3, 1, 2, 23, 1, 1, 8, 160, 22, 6, 3, 1, 26, 5, 1, 64, 56, 6, 2, 64, 1, 3, 1, 2, 5, 4, 4, 1, 3, 1, 27, 4, 3, 4, 1, 8, 8, 9, 7, 29, 2, 1, 128, 54, 3, 7, 22, 2, 8, 19, 5, 8, 128, 73, 535, 31, 385, 1, 1, 1, 53, 15, 7, 4, 20, 10, 16, 2, 1, 45, 3, 4, 2, 2, 2, 1, 4, 14, 25, 7, 10, 6, 3, 36, 5, 1, 8, 1, 10, 4, 60, 2, 1, 48, 3, 9, 2, 4, 4, 7, 10, 1190, 43, 1, 1, 1, 2, 6, 1, 1, 8, 10, 2358, 879, 145, 99, 13, 4, 2956, 1071, 13265, 569, 1223, 69, 11, 1, 46, 16, 4, 13, 16480, 2, 8190, 246, 10, 39, 2, 60, 2, 3, 3, 6, 8, 8, 2, 7, 30, 4, 48, 34, 66, 3, 1, 186, 87, 9, 18, 142, 26, 26, 26, 7, 1, 18, 26, 26, 1, 1, 2, 2, 1, 2, 2, 2, 4, 1, 8, 4, 1, 1, 1, 7, 1, 11, 26, 26, 2, 1, 4, 2, 8, 1, 7, 1, 26, 2, 1, 4, 1, 5, 1, 1, 3, 7, 1, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 28, 2, 25, 1, 25, 1, 6, 25, 1, 25, 1, 6, 25, 1, 25, 1, 6, 25, 1, 25, 1, 6, 25, 1, 25, 1, 6, 1, 1, 2, 50, 5632, 4, 1, 27, 1, 2, 1, 1, 2, 1, 1, 10, 1, 4, 1, 1, 1, 1, 6, 1, 4, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 4, 1, 7, 1, 4, 1, 4, 1, 1, 1, 10, 1, 17, 5, 3, 1, 5, 1, 17, 52, 2, 270, 44, 4, 100, 12, 15, 2, 14, 2, 15, 1, 15, 32, 11, 5, 31, 1, 60, 4, 43, 75, 29, 13, 43, 5, 9, 7, 2, 174, 33, 15, 6, 1, 70, 3, 20, 12, 37, 1, 5, 21, 17, 15, 63, 1, 1, 1, 182, 1, 4, 3, 62, 2, 4, 12, 24, 147, 70, 4, 11, 48, 70, 58, 116, 2188, 42711, 41, 4149, 11, 222, 16354, 542, 722403, 1, 30, 96, 128, 240, 65040, 65534, 2, 65534]);
    var len = $uI(xs.array$6["length"]);
    var array = $newArrayObject($d_I.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$5 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6["length"]));
    while (this$5.hasNext__Z()) {
      var arg1 = this$5.next__O();
      array.u[elem$1] = $uI(arg1);
      elem$1 = ((1 + elem$1) | 0)
    };
    this.charTypeIndices$1 = this.uncompressDeltas__p1__AI__AI(array);
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.charTypeIndices$1
});
$c_jl_Character$.prototype.digit__C__I__I = (function(c, radix) {
  return (((radix > 36) || (radix < 2)) ? (-1) : ((((c >= 48) && (c <= 57)) && ((((-48) + c) | 0) < radix)) ? (((-48) + c) | 0) : ((((c >= 65) && (c <= 90)) && ((((-65) + c) | 0) < (((-10) + radix) | 0))) ? (((-55) + c) | 0) : ((((c >= 97) && (c <= 122)) && ((((-97) + c) | 0) < (((-10) + radix) | 0))) ? (((-87) + c) | 0) : ((((c >= 65313) && (c <= 65338)) && ((((-65313) + c) | 0) < (((-10) + radix) | 0))) ? (((-65303) + c) | 0) : ((((c >= 65345) && (c <= 65370)) && ((((-65345) + c) | 0) < (((-10) + radix) | 0))) ? (((-65303) + c) | 0) : (-1)))))))
});
$c_jl_Character$.prototype.charTypes$lzycompute__p1__AB = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 5, 1, 2, 5, 1, 3, 2, 1, 3, 2, 1, 3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 4, 27, 4, 27, 4, 27, 4, 27, 4, 27, 6, 1, 2, 1, 2, 4, 27, 1, 2, 0, 4, 2, 24, 0, 27, 1, 24, 1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 25, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 28, 6, 7, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 1, 0, 4, 24, 0, 2, 0, 24, 20, 0, 26, 0, 6, 20, 6, 24, 6, 24, 6, 24, 6, 0, 5, 0, 5, 24, 0, 16, 0, 25, 24, 26, 24, 28, 6, 24, 0, 24, 5, 4, 5, 6, 9, 24, 5, 6, 5, 24, 5, 6, 16, 28, 6, 4, 6, 28, 6, 5, 9, 5, 28, 5, 24, 0, 16, 5, 6, 5, 6, 0, 5, 6, 5, 0, 9, 5, 6, 4, 28, 24, 4, 0, 5, 6, 4, 6, 4, 6, 4, 6, 0, 24, 0, 5, 6, 0, 24, 0, 5, 0, 5, 0, 6, 0, 6, 8, 5, 6, 8, 6, 5, 8, 6, 8, 6, 8, 5, 6, 5, 6, 24, 9, 24, 4, 5, 0, 5, 0, 6, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 5, 8, 6, 0, 8, 0, 8, 6, 5, 0, 8, 0, 5, 0, 5, 6, 0, 9, 5, 26, 11, 28, 26, 0, 6, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 0, 8, 6, 0, 6, 0, 6, 0, 6, 0, 5, 0, 5, 0, 9, 6, 5, 6, 0, 6, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 5, 8, 6, 0, 6, 8, 0, 8, 6, 0, 5, 0, 5, 6, 0, 9, 24, 26, 0, 6, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 5, 8, 6, 8, 6, 0, 8, 0, 8, 6, 0, 6, 8, 0, 5, 0, 5, 6, 0, 9, 28, 5, 11, 0, 6, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 8, 6, 8, 0, 8, 0, 8, 6, 0, 5, 0, 8, 0, 9, 11, 28, 26, 28, 0, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 6, 8, 0, 6, 0, 6, 0, 6, 0, 5, 0, 5, 6, 0, 9, 0, 11, 28, 0, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 5, 8, 6, 8, 0, 6, 8, 0, 8, 6, 0, 8, 0, 5, 0, 5, 6, 0, 9, 0, 5, 0, 8, 0, 5, 0, 5, 0, 5, 0, 5, 8, 6, 0, 8, 0, 8, 6, 5, 0, 8, 0, 5, 6, 0, 9, 11, 0, 28, 5, 0, 8, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 0, 8, 6, 0, 6, 0, 8, 0, 8, 24, 0, 5, 6, 5, 6, 0, 26, 5, 4, 6, 24, 9, 24, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 6, 5, 6, 0, 6, 5, 0, 5, 0, 4, 0, 6, 0, 9, 0, 5, 0, 5, 28, 24, 28, 24, 28, 6, 28, 9, 11, 28, 6, 28, 6, 28, 6, 21, 22, 21, 22, 8, 5, 0, 5, 0, 6, 8, 6, 24, 6, 5, 6, 0, 6, 0, 28, 6, 28, 0, 28, 24, 28, 24, 0, 5, 8, 6, 8, 6, 8, 6, 8, 6, 5, 9, 24, 5, 8, 6, 5, 6, 5, 8, 5, 8, 5, 6, 5, 6, 8, 6, 8, 6, 5, 8, 9, 8, 6, 28, 1, 0, 1, 0, 1, 0, 5, 24, 4, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 24, 11, 0, 5, 28, 0, 5, 0, 20, 5, 24, 5, 12, 5, 21, 22, 0, 5, 24, 10, 0, 5, 0, 5, 6, 0, 5, 6, 24, 0, 5, 6, 0, 5, 0, 5, 0, 6, 0, 5, 6, 8, 6, 8, 6, 8, 6, 24, 4, 24, 26, 5, 6, 0, 9, 0, 11, 0, 24, 20, 24, 6, 12, 0, 9, 0, 5, 4, 5, 0, 5, 6, 5, 0, 5, 0, 5, 0, 6, 8, 6, 8, 0, 8, 6, 8, 6, 0, 28, 0, 24, 9, 5, 0, 5, 0, 5, 0, 8, 5, 8, 0, 9, 11, 0, 28, 5, 6, 8, 0, 24, 5, 8, 6, 8, 6, 0, 6, 8, 6, 8, 6, 8, 6, 0, 6, 9, 0, 9, 0, 24, 4, 24, 0, 6, 8, 5, 6, 8, 6, 8, 6, 8, 6, 8, 5, 0, 9, 24, 28, 6, 28, 0, 6, 8, 5, 8, 6, 8, 6, 8, 6, 8, 5, 9, 5, 6, 8, 6, 8, 6, 8, 6, 8, 0, 24, 5, 8, 6, 8, 6, 0, 24, 9, 0, 5, 9, 5, 4, 24, 0, 24, 0, 6, 24, 6, 8, 6, 5, 6, 5, 8, 6, 5, 0, 2, 4, 2, 4, 2, 4, 6, 0, 6, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 1, 0, 2, 1, 2, 1, 2, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2, 0, 2, 3, 2, 3, 2, 3, 2, 0, 2, 1, 3, 27, 2, 27, 2, 0, 2, 1, 3, 27, 2, 0, 2, 1, 0, 27, 2, 1, 27, 0, 2, 0, 2, 1, 3, 27, 0, 12, 16, 20, 24, 29, 30, 21, 29, 30, 21, 29, 24, 13, 14, 16, 12, 24, 29, 30, 24, 23, 24, 25, 21, 22, 24, 25, 24, 23, 24, 12, 16, 0, 16, 11, 4, 0, 11, 25, 21, 22, 4, 11, 25, 21, 22, 0, 4, 0, 26, 0, 6, 7, 6, 7, 6, 0, 28, 1, 28, 1, 28, 2, 1, 2, 1, 2, 28, 1, 28, 25, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 2, 1, 2, 5, 2, 28, 2, 1, 25, 1, 2, 28, 25, 28, 2, 28, 11, 10, 1, 2, 10, 11, 0, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 25, 28, 21, 22, 28, 25, 28, 25, 28, 25, 28, 0, 28, 0, 28, 0, 11, 28, 11, 28, 25, 28, 25, 28, 25, 28, 25, 28, 0, 28, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 11, 28, 25, 21, 22, 25, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 25, 28, 25, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 25, 21, 22, 21, 22, 25, 21, 22, 25, 28, 25, 28, 25, 0, 28, 0, 1, 0, 2, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 28, 1, 2, 1, 2, 6, 1, 2, 0, 24, 11, 24, 2, 0, 2, 0, 2, 0, 5, 0, 4, 24, 0, 6, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 6, 24, 29, 30, 29, 30, 24, 29, 30, 24, 29, 30, 24, 20, 24, 20, 24, 29, 30, 24, 29, 30, 21, 22, 21, 22, 21, 22, 21, 22, 24, 4, 24, 20, 0, 28, 0, 28, 0, 28, 0, 28, 0, 12, 24, 28, 4, 5, 10, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 28, 21, 22, 21, 22, 21, 22, 21, 22, 20, 21, 22, 28, 10, 6, 8, 20, 4, 28, 10, 4, 5, 24, 28, 0, 5, 0, 6, 27, 4, 5, 20, 5, 24, 4, 5, 0, 5, 0, 5, 0, 28, 11, 28, 5, 0, 28, 0, 5, 28, 0, 11, 28, 11, 28, 11, 28, 11, 28, 11, 28, 0, 28, 5, 0, 28, 5, 0, 5, 4, 5, 0, 28, 0, 5, 4, 24, 5, 4, 24, 5, 9, 5, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 5, 6, 7, 24, 6, 24, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 6, 5, 10, 6, 24, 0, 27, 4, 27, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 4, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 4, 27, 1, 2, 1, 2, 0, 1, 2, 1, 2, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 4, 2, 5, 6, 5, 6, 5, 6, 5, 8, 6, 8, 28, 0, 11, 28, 26, 28, 0, 5, 24, 0, 8, 5, 8, 6, 0, 24, 9, 0, 6, 5, 24, 5, 0, 9, 5, 6, 24, 5, 6, 8, 0, 24, 5, 0, 6, 8, 5, 6, 8, 6, 8, 6, 8, 24, 0, 4, 9, 0, 24, 0, 5, 6, 8, 6, 8, 6, 0, 5, 6, 5, 6, 8, 0, 9, 0, 24, 5, 4, 5, 28, 5, 8, 0, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 0, 5, 4, 24, 5, 8, 6, 8, 24, 5, 4, 8, 6, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 8, 6, 8, 6, 8, 24, 8, 6, 0, 9, 0, 5, 0, 5, 0, 5, 0, 19, 18, 5, 0, 5, 0, 2, 0, 2, 0, 5, 6, 5, 25, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 27, 0, 5, 21, 22, 0, 5, 0, 5, 0, 5, 26, 28, 0, 6, 24, 21, 22, 24, 0, 6, 0, 24, 20, 23, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 21, 22, 24, 21, 22, 24, 23, 24, 0, 24, 20, 21, 22, 21, 22, 21, 22, 24, 25, 20, 25, 0, 24, 26, 24, 0, 5, 0, 5, 0, 16, 0, 24, 26, 24, 21, 22, 24, 25, 24, 20, 24, 9, 24, 25, 24, 1, 21, 24, 22, 27, 23, 27, 2, 21, 25, 22, 25, 21, 22, 24, 21, 22, 24, 5, 4, 5, 4, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 26, 25, 27, 28, 26, 0, 28, 25, 28, 0, 16, 28, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 24, 0, 11, 0, 28, 10, 11, 28, 11, 0, 28, 0, 28, 6, 0, 5, 0, 5, 0, 5, 0, 11, 0, 5, 10, 5, 10, 0, 5, 0, 24, 5, 0, 5, 24, 10, 0, 1, 2, 5, 0, 9, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 24, 11, 0, 5, 11, 0, 24, 5, 0, 24, 0, 5, 0, 5, 0, 5, 6, 0, 6, 0, 6, 5, 0, 5, 0, 5, 0, 6, 0, 6, 11, 0, 24, 0, 5, 11, 24, 0, 5, 0, 24, 5, 0, 11, 5, 0, 11, 0, 5, 0, 11, 0, 8, 6, 8, 5, 6, 24, 0, 11, 9, 0, 6, 8, 5, 8, 6, 8, 6, 24, 16, 24, 0, 5, 0, 9, 0, 6, 5, 6, 8, 6, 0, 9, 24, 0, 6, 8, 5, 8, 6, 8, 5, 24, 0, 9, 0, 5, 6, 8, 6, 8, 6, 8, 6, 0, 9, 0, 5, 0, 10, 0, 24, 0, 5, 0, 5, 0, 5, 0, 5, 8, 0, 6, 4, 0, 5, 0, 28, 0, 28, 0, 28, 8, 6, 28, 8, 16, 6, 28, 6, 28, 6, 28, 0, 28, 6, 28, 0, 28, 0, 11, 0, 1, 2, 1, 2, 0, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 0, 2, 0, 2, 0, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 1, 25, 2, 25, 2, 1, 25, 2, 25, 2, 1, 25, 2, 25, 2, 1, 25, 2, 25, 2, 1, 25, 2, 25, 2, 1, 2, 0, 9, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 25, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 11, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 28, 0, 5, 0, 5, 0, 5, 0, 5, 0, 16, 0, 16, 0, 6, 0, 18, 0, 18, 0]);
    var len = $uI(xs.array$6["length"]);
    var array = $newArrayObject($d_B.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$5 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6["length"]));
    while (this$5.hasNext__Z()) {
      var arg1 = this$5.next__O();
      array.u[elem$1] = $uB(arg1);
      elem$1 = ((1 + elem$1) | 0)
    };
    this.charTypes$1 = array;
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.charTypes$1
});
$c_jl_Character$.prototype.getTypeGE256__p1__I__B = (function(codePoint) {
  var idx = ((1 + $m_ju_Arrays$().binarySearch__AI__I__I(this.charTypeIndices__p1__AI(), codePoint)) | 0);
  return this.charTypes__p1__AB().u[((idx < 0) ? ((-idx) | 0) : idx)]
});
$c_jl_Character$.prototype.charTypes__p1__AB = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.charTypes$lzycompute__p1__AB() : this.charTypes$1)
});
$c_jl_Character$.prototype.java$lang$Character$$charTypesFirst256__AB = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.java$lang$Character$$charTypesFirst256$lzycompute__p1__AB() : this.java$lang$Character$$charTypesFirst256$1)
});
$c_jl_Character$.prototype.isUpperCase__I__Z = (function(c) {
  return ((((c >= 8544) && (c <= 8559)) || ((c >= 9398) && (c <= 9423))) || (this.getType__I__I(c) === 1))
});
$c_jl_Character$.prototype.java$lang$Character$$charTypesFirst256$lzycompute__p1__AB = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 12, 24, 24, 24, 26, 24, 24, 24, 21, 22, 24, 25, 24, 20, 24, 24, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 24, 24, 25, 25, 25, 24, 24, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 24, 22, 27, 23, 27, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 21, 25, 22, 25, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 12, 24, 26, 26, 26, 26, 28, 24, 27, 28, 5, 29, 25, 16, 28, 27, 28, 25, 11, 11, 27, 2, 24, 24, 27, 11, 5, 30, 11, 11, 11, 24, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 25, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 25, 2, 2, 2, 2, 2, 2, 2, 2]);
    var len = $uI(xs.array$6["length"]);
    var array = $newArrayObject($d_B.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$5 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6["length"]));
    while (this$5.hasNext__Z()) {
      var arg1 = this$5.next__O();
      array.u[elem$1] = $uB(arg1);
      elem$1 = ((1 + elem$1) | 0)
    };
    this.java$lang$Character$$charTypesFirst256$1 = array;
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.java$lang$Character$$charTypesFirst256$1
});
$c_jl_Character$.prototype.uncompressDeltas__p1__AI__AI = (function(deltas) {
  var end = deltas.u["length"];
  var isEmpty$4 = (end <= 1);
  var numRangeElements$4 = (isEmpty$4 ? 0 : (((-1) + end) | 0));
  var lastElement$4 = (isEmpty$4 ? 0 : (((-1) + end) | 0));
  var terminalElement$4 = ((1 + lastElement$4) | 0);
  if ((numRangeElements$4 < 0)) {
    $m_sci_Range$().scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$(1, end, 1, false)
  };
  var i = 1;
  var count = 0;
  while ((i !== terminalElement$4)) {
    var v1 = i;
    deltas.u[v1] = ((deltas.u[v1] + deltas.u[(((-1) + v1) | 0)]) | 0);
    count = ((1 + count) | 0);
    i = ((1 + i) | 0)
  };
  return deltas
});
var $d_jl_Character$ = new $TypeData().initClass({
  jl_Character$: 0
}, false, "java.lang.Character$", {
  jl_Character$: 1,
  O: 1
});
$c_jl_Character$.prototype.$classData = $d_jl_Character$;
var $n_jl_Character$ = (void 0);
function $m_jl_Character$() {
  if ((!$n_jl_Character$)) {
    $n_jl_Character$ = new $c_jl_Character$().init___()
  };
  return $n_jl_Character$
}
/** @constructor */
function $c_jl_Class() {
  $c_O.call(this);
  this.data$1 = null
}
$c_jl_Class.prototype = new $h_O();
$c_jl_Class.prototype.constructor = $c_jl_Class;
/** @constructor */
function $h_jl_Class() {
  /*<skip>*/
}
$h_jl_Class.prototype = $c_jl_Class.prototype;
$c_jl_Class.prototype.getName__T = (function() {
  return $as_T(this.data$1["name"])
});
$c_jl_Class.prototype.isPrimitive__Z = (function() {
  return $uZ(this.data$1["isPrimitive"])
});
$c_jl_Class.prototype.toString__T = (function() {
  return ((this.isInterface__Z() ? "interface " : (this.isPrimitive__Z() ? "" : "class ")) + this.getName__T())
});
$c_jl_Class.prototype.isAssignableFrom__jl_Class__Z = (function(that) {
  return ((this.isPrimitive__Z() || that.isPrimitive__Z()) ? ((this === that) || ((this === $d_S.getClassOf()) ? (that === $d_B.getClassOf()) : ((this === $d_I.getClassOf()) ? ((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) : ((this === $d_F.getClassOf()) ? (((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) : ((this === $d_D.getClassOf()) && ((((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) || (that === $d_F.getClassOf()))))))) : this.isInstance__O__Z(that.getFakeInstance__p1__O()))
});
$c_jl_Class.prototype.isInstance__O__Z = (function(obj) {
  return $uZ(this.data$1["isInstance"](obj))
});
$c_jl_Class.prototype.init___jl_ScalaJSClassData = (function(data) {
  this.data$1 = data;
  return this
});
$c_jl_Class.prototype.getFakeInstance__p1__O = (function() {
  return this.data$1["getFakeInstance"]()
});
$c_jl_Class.prototype.isArray__Z = (function() {
  return $uZ(this.data$1["isArrayClass"])
});
$c_jl_Class.prototype.isInterface__Z = (function() {
  return $uZ(this.data$1["isInterface"])
});
var $d_jl_Class = new $TypeData().initClass({
  jl_Class: 0
}, false, "java.lang.Class", {
  jl_Class: 1,
  O: 1
});
$c_jl_Class.prototype.$classData = $d_jl_Class;
/** @constructor */
function $c_jl_Double$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.POSITIVE$undINFINITY$1 = 0.0;
  this.NEGATIVE$undINFINITY$1 = 0.0;
  this.NaN$1 = 0.0;
  this.MAX$undVALUE$1 = 0.0;
  this.MIN$undVALUE$1 = 0.0;
  this.MAX$undEXPONENT$1 = 0;
  this.MIN$undEXPONENT$1 = 0;
  this.SIZE$1 = 0;
  this.doubleStrPat$1 = null;
  this.bitmap$0$1 = false
}
$c_jl_Double$.prototype = new $h_O();
$c_jl_Double$.prototype.constructor = $c_jl_Double$;
/** @constructor */
function $h_jl_Double$() {
  /*<skip>*/
}
$h_jl_Double$.prototype = $c_jl_Double$.prototype;
$c_jl_Double$.prototype.compare__D__D__I = (function(a, b) {
  if ((a !== a)) {
    return ((b !== b) ? 0 : 1)
  } else if ((b !== b)) {
    return (-1)
  } else if ((a === b)) {
    if ((a === 0.0)) {
      var ainf = (1.0 / a);
      return ((ainf === (1.0 / b)) ? 0 : ((ainf < 0) ? (-1) : 1))
    } else {
      return 0
    }
  } else {
    return ((a < b) ? (-1) : 1)
  }
});
var $d_jl_Double$ = new $TypeData().initClass({
  jl_Double$: 0
}, false, "java.lang.Double$", {
  jl_Double$: 1,
  O: 1
});
$c_jl_Double$.prototype.$classData = $d_jl_Double$;
var $n_jl_Double$ = (void 0);
function $m_jl_Double$() {
  if ((!$n_jl_Double$)) {
    $n_jl_Double$ = new $c_jl_Double$().init___()
  };
  return $n_jl_Double$
}
/** @constructor */
function $c_jl_Integer$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = 0;
  this.MAX$undVALUE$1 = 0;
  this.SIZE$1 = 0;
  this.BYTES$1 = 0
}
$c_jl_Integer$.prototype = new $h_O();
$c_jl_Integer$.prototype.constructor = $c_jl_Integer$;
/** @constructor */
function $h_jl_Integer$() {
  /*<skip>*/
}
$h_jl_Integer$.prototype = $c_jl_Integer$.prototype;
$c_jl_Integer$.prototype.fail$1__p1__T__sr_Nothing$ = (function(s$1) {
  throw new $c_jl_NumberFormatException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["For input string: \"", "\""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([s$1])))
});
$c_jl_Integer$.prototype.parseInt__T__I__I = (function(s, radix) {
  if ((s === null)) {
    var jsx$1 = true
  } else {
    var this$2 = new $c_sci_StringOps().init___T(s);
    var $$this = this$2.repr$1;
    var jsx$1 = ($uI($$this["length"]) === 0)
  };
  if (((jsx$1 || (radix < 2)) || (radix > 36))) {
    this.fail$1__p1__T__sr_Nothing$(s)
  } else {
    var i = ((((65535 & $uI(s["charCodeAt"](0))) === 45) || ((65535 & $uI(s["charCodeAt"](0))) === 43)) ? 1 : 0);
    var this$12 = new $c_sci_StringOps().init___T(s);
    var $$this$1 = this$12.repr$1;
    if (($uI($$this$1["length"]) <= i)) {
      this.fail$1__p1__T__sr_Nothing$(s)
    } else {
      while (true) {
        var jsx$2 = i;
        var this$16 = new $c_sci_StringOps().init___T(s);
        var $$this$2 = this$16.repr$1;
        if ((jsx$2 < $uI($$this$2["length"]))) {
          var jsx$3 = $m_jl_Character$();
          var index = i;
          if ((jsx$3.digit__C__I__I((65535 & $uI(s["charCodeAt"](index))), radix) < 0)) {
            this.fail$1__p1__T__sr_Nothing$(s)
          };
          i = ((1 + i) | 0)
        } else {
          break
        }
      };
      var res = $uD($g["parseInt"](s, radix));
      return (((res !== res) || ((res > 2147483647) || (res < (-2147483648)))) ? this.fail$1__p1__T__sr_Nothing$(s) : $doubleToInt(res))
    }
  }
});
$c_jl_Integer$.prototype.rotateLeft__I__I__I = (function(i, distance) {
  return ((i << distance) | ((i >>> ((-distance) | 0)) | 0))
});
$c_jl_Integer$.prototype.bitCount__I__I = (function(i) {
  var t1 = ((i - (1431655765 & (i >> 1))) | 0);
  var t2 = (((858993459 & t1) + (858993459 & (t1 >> 2))) | 0);
  return ($imul(16843009, (252645135 & ((t2 + (t2 >> 4)) | 0))) >> 24)
});
$c_jl_Integer$.prototype.reverseBytes__I__I = (function(i) {
  var byte3 = ((i >>> 24) | 0);
  var byte2 = (65280 & ((i >>> 8) | 0));
  var byte1 = (16711680 & (i << 8));
  var byte0 = (i << 24);
  return (((byte0 | byte1) | byte2) | byte3)
});
$c_jl_Integer$.prototype.numberOfLeadingZeros__I__I = (function(i) {
  var x = i;
  x = (x | ((x >>> 1) | 0));
  x = (x | ((x >>> 2) | 0));
  x = (x | ((x >>> 4) | 0));
  x = (x | ((x >>> 8) | 0));
  x = (x | ((x >>> 16) | 0));
  return ((32 - this.bitCount__I__I(x)) | 0)
});
$c_jl_Integer$.prototype.numberOfTrailingZeros__I__I = (function(i) {
  return this.bitCount__I__I((((-1) + (i & ((-i) | 0))) | 0))
});
var $d_jl_Integer$ = new $TypeData().initClass({
  jl_Integer$: 0
}, false, "java.lang.Integer$", {
  jl_Integer$: 1,
  O: 1
});
$c_jl_Integer$.prototype.$classData = $d_jl_Integer$;
var $n_jl_Integer$ = (void 0);
function $m_jl_Integer$() {
  if ((!$n_jl_Integer$)) {
    $n_jl_Integer$ = new $c_jl_Integer$().init___()
  };
  return $n_jl_Integer$
}
/** @constructor */
function $c_jl_Number() {
  $c_O.call(this)
}
$c_jl_Number.prototype = new $h_O();
$c_jl_Number.prototype.constructor = $c_jl_Number;
/** @constructor */
function $h_jl_Number() {
  /*<skip>*/
}
$h_jl_Number.prototype = $c_jl_Number.prototype;
function $is_jl_Number(obj) {
  return (!(!(((obj && obj.$classData) && obj.$classData.ancestors.jl_Number) || ((typeof obj) === "number"))))
}
function $as_jl_Number(obj) {
  return (($is_jl_Number(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Number"))
}
function $isArrayOf_jl_Number(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Number)))
}
function $asArrayOf_jl_Number(obj, depth) {
  return (($isArrayOf_jl_Number(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Number;", depth))
}
/** @constructor */
function $c_jl_System$() {
  $c_O.call(this);
  this.out$1 = null;
  this.err$1 = null;
  this.in$1 = null;
  this.getHighPrecisionTime$1 = null
}
$c_jl_System$.prototype = new $h_O();
$c_jl_System$.prototype.constructor = $c_jl_System$;
/** @constructor */
function $h_jl_System$() {
  /*<skip>*/
}
$h_jl_System$.prototype = $c_jl_System$.prototype;
$c_jl_System$.prototype.init___ = (function() {
  $n_jl_System$ = this;
  this.out$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(false);
  this.err$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(true);
  this.in$1 = null;
  var x = $g["performance"];
  if ($uZ((!(!x)))) {
    var x$1 = $g["performance"]["now"];
    if ($uZ((!(!x$1)))) {
      var jsx$1 = (function() {
        return $uD($g["performance"]["now"]())
      })
    } else {
      var x$2 = $g["performance"]["webkitNow"];
      if ($uZ((!(!x$2)))) {
        var jsx$1 = (function() {
          return $uD($g["performance"]["webkitNow"]())
        })
      } else {
        var jsx$1 = (function() {
          return $uD(new $g["Date"]()["getTime"]())
        })
      }
    }
  } else {
    var jsx$1 = (function() {
      return $uD(new $g["Date"]()["getTime"]())
    })
  };
  this.getHighPrecisionTime$1 = jsx$1;
  return this
});
var $d_jl_System$ = new $TypeData().initClass({
  jl_System$: 0
}, false, "java.lang.System$", {
  jl_System$: 1,
  O: 1
});
$c_jl_System$.prototype.$classData = $d_jl_System$;
var $n_jl_System$ = (void 0);
function $m_jl_System$() {
  if ((!$n_jl_System$)) {
    $n_jl_System$ = new $c_jl_System$().init___()
  };
  return $n_jl_System$
}
/** @constructor */
function $c_jl_ThreadLocal() {
  $c_O.call(this);
  this.hasValue$1 = null;
  this.v$1 = null
}
$c_jl_ThreadLocal.prototype = new $h_O();
$c_jl_ThreadLocal.prototype.constructor = $c_jl_ThreadLocal;
/** @constructor */
function $h_jl_ThreadLocal() {
  /*<skip>*/
}
$h_jl_ThreadLocal.prototype = $c_jl_ThreadLocal.prototype;
$c_jl_ThreadLocal.prototype.init___ = (function() {
  this.hasValue$1 = false;
  return this
});
$c_jl_ThreadLocal.prototype.get__O = (function() {
  var x = this.hasValue$1;
  if ((!$uZ(x))) {
    this.set__O__V(this.initialValue__O())
  };
  return this.v$1
});
$c_jl_ThreadLocal.prototype.set__O__V = (function(o) {
  this.v$1 = o;
  this.hasValue$1 = true
});
/** @constructor */
function $c_ju_Arrays$() {
  $c_O.call(this);
  this.qSortThreshold$1 = 0
}
$c_ju_Arrays$.prototype = new $h_O();
$c_ju_Arrays$.prototype.constructor = $c_ju_Arrays$;
/** @constructor */
function $h_ju_Arrays$() {
  /*<skip>*/
}
$h_ju_Arrays$.prototype = $c_ju_Arrays$.prototype;
$c_ju_Arrays$.prototype.binarySearch__AI__I__I = (function(a, key) {
  var startIndex = 0;
  var endIndex = a.u["length"];
  _binarySearchImpl: while (true) {
    if ((startIndex === endIndex)) {
      return (((-1) - startIndex) | 0)
    } else {
      var mid = ((((startIndex + endIndex) | 0) >>> 1) | 0);
      var elem = a.u[mid];
      if ((key < elem)) {
        endIndex = mid;
        continue _binarySearchImpl
      } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, elem)) {
        return mid
      } else {
        startIndex = ((1 + mid) | 0);
        continue _binarySearchImpl
      }
    }
  }
});
$c_ju_Arrays$.prototype.fill__AI__I__V = (function(a, value) {
  var toIndex = a.u["length"];
  var i = 0;
  while ((i !== toIndex)) {
    a.u[i] = value;
    i = ((1 + i) | 0)
  }
});
var $d_ju_Arrays$ = new $TypeData().initClass({
  ju_Arrays$: 0
}, false, "java.util.Arrays$", {
  ju_Arrays$: 1,
  O: 1
});
$c_ju_Arrays$.prototype.$classData = $d_ju_Arrays$;
var $n_ju_Arrays$ = (void 0);
function $m_ju_Arrays$() {
  if ((!$n_ju_Arrays$)) {
    $n_ju_Arrays$ = new $c_ju_Arrays$().init___()
  };
  return $n_ju_Arrays$
}
/** @constructor */
function $c_ju_Formatter$() {
  $c_O.call(this);
  this.java$util$Formatter$$RegularChunk$1 = null;
  this.java$util$Formatter$$DoublePercent$1 = null;
  this.java$util$Formatter$$EOLChunk$1 = null;
  this.java$util$Formatter$$FormattedChunk$1 = null
}
$c_ju_Formatter$.prototype = new $h_O();
$c_ju_Formatter$.prototype.constructor = $c_ju_Formatter$;
/** @constructor */
function $h_ju_Formatter$() {
  /*<skip>*/
}
$h_ju_Formatter$.prototype = $c_ju_Formatter$.prototype;
$c_ju_Formatter$.prototype.init___ = (function() {
  $n_ju_Formatter$ = this;
  this.java$util$Formatter$$RegularChunk$1 = new $c_ju_Formatter$RegExpExtractor().init___sjs_js_RegExp(new $g["RegExp"]("^[^\\x25]+"));
  this.java$util$Formatter$$DoublePercent$1 = new $c_ju_Formatter$RegExpExtractor().init___sjs_js_RegExp(new $g["RegExp"]("^\\x25{2}"));
  this.java$util$Formatter$$EOLChunk$1 = new $c_ju_Formatter$RegExpExtractor().init___sjs_js_RegExp(new $g["RegExp"]("^\\x25n"));
  this.java$util$Formatter$$FormattedChunk$1 = new $c_ju_Formatter$RegExpExtractor().init___sjs_js_RegExp(new $g["RegExp"]("^\\x25(?:([1-9]\\d*)\\$)?([-#+ 0,\\(<]*)(\\d*)(?:\\.(\\d+))?([A-Za-z])"));
  return this
});
var $d_ju_Formatter$ = new $TypeData().initClass({
  ju_Formatter$: 0
}, false, "java.util.Formatter$", {
  ju_Formatter$: 1,
  O: 1
});
$c_ju_Formatter$.prototype.$classData = $d_ju_Formatter$;
var $n_ju_Formatter$ = (void 0);
function $m_ju_Formatter$() {
  if ((!$n_ju_Formatter$)) {
    $n_ju_Formatter$ = new $c_ju_Formatter$().init___()
  };
  return $n_ju_Formatter$
}
/** @constructor */
function $c_ju_Formatter$RegExpExtractor() {
  $c_O.call(this);
  this.regexp$1 = null
}
$c_ju_Formatter$RegExpExtractor.prototype = new $h_O();
$c_ju_Formatter$RegExpExtractor.prototype.constructor = $c_ju_Formatter$RegExpExtractor;
/** @constructor */
function $h_ju_Formatter$RegExpExtractor() {
  /*<skip>*/
}
$h_ju_Formatter$RegExpExtractor.prototype = $c_ju_Formatter$RegExpExtractor.prototype;
$c_ju_Formatter$RegExpExtractor.prototype.unapply__T__s_Option = (function(str) {
  return $m_s_Option$().apply__O__s_Option(this.regexp$1["exec"](str))
});
$c_ju_Formatter$RegExpExtractor.prototype.init___sjs_js_RegExp = (function(regexp) {
  this.regexp$1 = regexp;
  return this
});
var $d_ju_Formatter$RegExpExtractor = new $TypeData().initClass({
  ju_Formatter$RegExpExtractor: 0
}, false, "java.util.Formatter$RegExpExtractor", {
  ju_Formatter$RegExpExtractor: 1,
  O: 1
});
$c_ju_Formatter$RegExpExtractor.prototype.$classData = $d_ju_Formatter$RegExpExtractor;
/** @constructor */
function $c_s_DeprecatedConsole() {
  $c_O.call(this)
}
$c_s_DeprecatedConsole.prototype = new $h_O();
$c_s_DeprecatedConsole.prototype.constructor = $c_s_DeprecatedConsole;
/** @constructor */
function $h_s_DeprecatedConsole() {
  /*<skip>*/
}
$h_s_DeprecatedConsole.prototype = $c_s_DeprecatedConsole.prototype;
/** @constructor */
function $c_s_FallbackArrayBuilding() {
  $c_O.call(this)
}
$c_s_FallbackArrayBuilding.prototype = new $h_O();
$c_s_FallbackArrayBuilding.prototype.constructor = $c_s_FallbackArrayBuilding;
/** @constructor */
function $h_s_FallbackArrayBuilding() {
  /*<skip>*/
}
$h_s_FallbackArrayBuilding.prototype = $c_s_FallbackArrayBuilding.prototype;
/** @constructor */
function $c_s_LowPriorityImplicits() {
  $c_O.call(this)
}
$c_s_LowPriorityImplicits.prototype = new $h_O();
$c_s_LowPriorityImplicits.prototype.constructor = $c_s_LowPriorityImplicits;
/** @constructor */
function $h_s_LowPriorityImplicits() {
  /*<skip>*/
}
$h_s_LowPriorityImplicits.prototype = $c_s_LowPriorityImplicits.prototype;
$c_s_LowPriorityImplicits.prototype.unwrapString__sci_WrappedString__T = (function(ws) {
  return ((ws !== null) ? ws.self$4 : null)
});
/** @constructor */
function $c_s_Predef$any2stringadd$() {
  $c_O.call(this)
}
$c_s_Predef$any2stringadd$.prototype = new $h_O();
$c_s_Predef$any2stringadd$.prototype.constructor = $c_s_Predef$any2stringadd$;
/** @constructor */
function $h_s_Predef$any2stringadd$() {
  /*<skip>*/
}
$h_s_Predef$any2stringadd$.prototype = $c_s_Predef$any2stringadd$.prototype;
$c_s_Predef$any2stringadd$.prototype.$$plus$extension__O__T__T = (function($$this, other) {
  return (("" + $m_sjsr_RuntimeString$().valueOf__O__T($$this)) + other)
});
var $d_s_Predef$any2stringadd$ = new $TypeData().initClass({
  s_Predef$any2stringadd$: 0
}, false, "scala.Predef$any2stringadd$", {
  s_Predef$any2stringadd$: 1,
  O: 1
});
$c_s_Predef$any2stringadd$.prototype.$classData = $d_s_Predef$any2stringadd$;
var $n_s_Predef$any2stringadd$ = (void 0);
function $m_s_Predef$any2stringadd$() {
  if ((!$n_s_Predef$any2stringadd$)) {
    $n_s_Predef$any2stringadd$ = new $c_s_Predef$any2stringadd$().init___()
  };
  return $n_s_Predef$any2stringadd$
}
function $s_s_Product2$class__productElement__s_Product2__I__O($$this, n) {
  switch (n) {
    case 0: {
      return $$this.$$und1__O();
      break
    }
    case 1: {
      return $$this.$$und2__O();
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $s_s_Product3$class__productElement__s_Product3__I__O($$this, n) {
  switch (n) {
    case 0: {
      return $$this.$$und1$1;
      break
    }
    case 1: {
      return $$this.$$und2$1;
      break
    }
    case 2: {
      return $$this.$$und3$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $s_s_Proxy$class__toString__s_Proxy__T($$this) {
  return ("" + $$this.self$1)
}
function $s_s_Proxy$class__equals__s_Proxy__O__Z($$this, that) {
  return ((that !== null) && (((that === $$this) || (that === $$this.self$1)) || $objectEquals(that, $$this.self$1)))
}
function $s_s_math_Numeric$ByteIsIntegral$class__fromInt__s_math_Numeric$ByteIsIntegral__I__B($$this, x) {
  return ((x << 24) >> 24)
}
function $s_s_math_Numeric$ByteIsIntegral$class__plus__s_math_Numeric$ByteIsIntegral__B__B__B($$this, x, y) {
  return ((((x + y) | 0) << 24) >> 24)
}
function $s_s_math_Numeric$ByteIsIntegral$class__minus__s_math_Numeric$ByteIsIntegral__B__B__B($$this, x, y) {
  return ((((x - y) | 0) << 24) >> 24)
}
function $s_s_math_Numeric$ByteIsIntegral$class__times__s_math_Numeric$ByteIsIntegral__B__B__B($$this, x, y) {
  return (($imul(x, y) << 24) >> 24)
}
function $s_s_math_Numeric$ByteIsIntegral$class__quot__s_math_Numeric$ByteIsIntegral__B__B__B($$this, x, y) {
  return ((((x / y) | 0) << 24) >> 24)
}
function $s_s_math_Numeric$CharIsIntegral$class__plus__s_math_Numeric$CharIsIntegral__C__C__C($$this, x, y) {
  return (65535 & ((x + y) | 0))
}
function $s_s_math_Numeric$CharIsIntegral$class__minus__s_math_Numeric$CharIsIntegral__C__C__C($$this, x, y) {
  return (65535 & ((x - y) | 0))
}
function $s_s_math_Numeric$CharIsIntegral$class__times__s_math_Numeric$CharIsIntegral__C__C__C($$this, x, y) {
  return (65535 & $imul(x, y))
}
function $s_s_math_Numeric$CharIsIntegral$class__quot__s_math_Numeric$CharIsIntegral__C__C__C($$this, x, y) {
  return (65535 & ((x / y) | 0))
}
function $s_s_math_Numeric$CharIsIntegral$class__fromInt__s_math_Numeric$CharIsIntegral__I__C($$this, x) {
  return (65535 & x)
}
function $s_s_math_Numeric$IntIsIntegral$class__minus__s_math_Numeric$IntIsIntegral__I__I__I($$this, x, y) {
  return ((x - y) | 0)
}
function $s_s_math_Numeric$IntIsIntegral$class__quot__s_math_Numeric$IntIsIntegral__I__I__I($$this, x, y) {
  return ((x / y) | 0)
}
function $s_s_math_Numeric$IntIsIntegral$class__times__s_math_Numeric$IntIsIntegral__I__I__I($$this, x, y) {
  return $imul(x, y)
}
function $s_s_math_Numeric$IntIsIntegral$class__plus__s_math_Numeric$IntIsIntegral__I__I__I($$this, x, y) {
  return ((x + y) | 0)
}
function $s_s_math_Numeric$LongIsIntegral$class__quot__s_math_Numeric$LongIsIntegral__J__J__J($$this, x, y) {
  return x.$$div__sjsr_RuntimeLong__sjsr_RuntimeLong(y)
}
function $s_s_math_Numeric$LongIsIntegral$class__toInt__s_math_Numeric$LongIsIntegral__J__I($$this, x) {
  return x.toInt__I()
}
function $s_s_math_Numeric$LongIsIntegral$class__fromInt__s_math_Numeric$LongIsIntegral__I__J($$this, x) {
  return new $c_sjsr_RuntimeLong().init___I(x)
}
function $s_s_math_Numeric$LongIsIntegral$class__plus__s_math_Numeric$LongIsIntegral__J__J__J($$this, x, y) {
  return x.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y)
}
function $s_s_math_Numeric$LongIsIntegral$class__minus__s_math_Numeric$LongIsIntegral__J__J__J($$this, x, y) {
  return x.$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(y)
}
function $s_s_math_Numeric$LongIsIntegral$class__times__s_math_Numeric$LongIsIntegral__J__J__J($$this, x, y) {
  return x.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(y)
}
/** @constructor */
function $c_s_math_Numeric$Ops() {
  $c_O.call(this);
  this.lhs$1 = null;
  this.$$outer$f = null
}
$c_s_math_Numeric$Ops.prototype = new $h_O();
$c_s_math_Numeric$Ops.prototype.constructor = $c_s_math_Numeric$Ops;
/** @constructor */
function $h_s_math_Numeric$Ops() {
  /*<skip>*/
}
$h_s_math_Numeric$Ops.prototype = $c_s_math_Numeric$Ops.prototype;
$c_s_math_Numeric$Ops.prototype.$$plus__O__O = (function(rhs) {
  return this.$$outer$f.plus__O__O__O(this.lhs$1, rhs)
});
$c_s_math_Numeric$Ops.prototype.init___s_math_Numeric__O = (function($$outer, lhs) {
  this.lhs$1 = lhs;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
function $s_s_math_Numeric$ShortIsIntegral$class__quot__s_math_Numeric$ShortIsIntegral__S__S__S($$this, x, y) {
  return ((((x / y) | 0) << 16) >> 16)
}
function $s_s_math_Numeric$ShortIsIntegral$class__plus__s_math_Numeric$ShortIsIntegral__S__S__S($$this, x, y) {
  return ((((x + y) | 0) << 16) >> 16)
}
function $s_s_math_Numeric$ShortIsIntegral$class__fromInt__s_math_Numeric$ShortIsIntegral__I__S($$this, x) {
  return ((x << 16) >> 16)
}
function $s_s_math_Numeric$ShortIsIntegral$class__times__s_math_Numeric$ShortIsIntegral__S__S__S($$this, x, y) {
  return (($imul(x, y) << 16) >> 16)
}
function $s_s_math_Numeric$ShortIsIntegral$class__minus__s_math_Numeric$ShortIsIntegral__S__S__S($$this, x, y) {
  return ((((x - y) | 0) << 16) >> 16)
}
function $s_s_math_Numeric$class__signum__s_math_Numeric__O__I($$this, x) {
  var y = $$this.fromInt__I__O(0);
  if ($s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z($$this, x, y)) {
    return (-1)
  } else {
    var y$1 = $$this.fromInt__I__O(0);
    if ($s_s_math_Ordering$class__gt__s_math_Ordering__O__O__Z($$this, x, y$1)) {
      return 1
    } else {
      return 0
    }
  }
}
/** @constructor */
function $c_s_math_Ordered$() {
  $c_O.call(this)
}
$c_s_math_Ordered$.prototype = new $h_O();
$c_s_math_Ordered$.prototype.constructor = $c_s_math_Ordered$;
/** @constructor */
function $h_s_math_Ordered$() {
  /*<skip>*/
}
$h_s_math_Ordered$.prototype = $c_s_math_Ordered$.prototype;
var $d_s_math_Ordered$ = new $TypeData().initClass({
  s_math_Ordered$: 0
}, false, "scala.math.Ordered$", {
  s_math_Ordered$: 1,
  O: 1
});
$c_s_math_Ordered$.prototype.$classData = $d_s_math_Ordered$;
var $n_s_math_Ordered$ = (void 0);
function $m_s_math_Ordered$() {
  if ((!$n_s_math_Ordered$)) {
    $n_s_math_Ordered$ = new $c_s_math_Ordered$().init___()
  };
  return $n_s_math_Ordered$
}
function $s_s_math_Ordering$ByteOrdering$class__compare__s_math_Ordering$ByteOrdering__B__B__I($$this, x, y) {
  return ((x - y) | 0)
}
function $s_s_math_Ordering$CharOrdering$class__compare__s_math_Ordering$CharOrdering__C__C__I($$this, x, y) {
  return ((x - y) | 0)
}
function $s_s_math_Ordering$DoubleOrdering$class__lteq__s_math_Ordering$DoubleOrdering__D__D__Z($$this, x, y) {
  return (x <= y)
}
function $s_s_math_Ordering$DoubleOrdering$class__lt__s_math_Ordering$DoubleOrdering__D__D__Z($$this, x, y) {
  return (x < y)
}
function $s_s_math_Ordering$IntOrdering$class__compare__s_math_Ordering$IntOrdering__I__I__I($$this, x, y) {
  return ((x < y) ? (-1) : ((x === y) ? 0 : 1))
}
function $s_s_math_Ordering$LongOrdering$class__compare__s_math_Ordering$LongOrdering__J__J__I($$this, x, y) {
  return (x.$$less__sjsr_RuntimeLong__Z(y) ? (-1) : (x.equals__sjsr_RuntimeLong__Z(y) ? 0 : 1))
}
/** @constructor */
function $c_s_math_Ordering$Ops() {
  $c_O.call(this);
  this.lhs$1 = null;
  this.$$outer$f = null
}
$c_s_math_Ordering$Ops.prototype = new $h_O();
$c_s_math_Ordering$Ops.prototype.constructor = $c_s_math_Ordering$Ops;
/** @constructor */
function $h_s_math_Ordering$Ops() {
  /*<skip>*/
}
$h_s_math_Ordering$Ops.prototype = $c_s_math_Ordering$Ops.prototype;
$c_s_math_Ordering$Ops.prototype.$$less__O__Z = (function(rhs) {
  return this.$$outer$f.lt__O__O__Z(this.lhs$1, rhs)
});
$c_s_math_Ordering$Ops.prototype.init___s_math_Ordering__O = (function($$outer, lhs) {
  this.lhs$1 = lhs;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_s_math_Ordering$Ops.prototype.$$less$eq__O__Z = (function(rhs) {
  return this.$$outer$f.lteq__O__O__Z(this.lhs$1, rhs)
});
var $d_s_math_Ordering$Ops = new $TypeData().initClass({
  s_math_Ordering$Ops: 0
}, false, "scala.math.Ordering$Ops", {
  s_math_Ordering$Ops: 1,
  O: 1
});
$c_s_math_Ordering$Ops.prototype.$classData = $d_s_math_Ordering$Ops;
function $s_s_math_Ordering$ShortOrdering$class__compare__s_math_Ordering$ShortOrdering__S__S__I($$this, x, y) {
  return ((x - y) | 0)
}
function $s_s_math_Ordering$class__gt__s_math_Ordering__O__O__Z($$this, x, y) {
  return ($$this.compare__O__O__I(x, y) > 0)
}
function $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z($$this, x, y) {
  return ($$this.compare__O__O__I(x, y) < 0)
}
function $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z($$this, x, y) {
  return ($$this.compare__O__O__I(x, y) <= 0)
}
/** @constructor */
function $c_s_package$() {
  $c_O.call(this);
  this.AnyRef$1 = null;
  this.Traversable$1 = null;
  this.Iterable$1 = null;
  this.Seq$1 = null;
  this.IndexedSeq$1 = null;
  this.Iterator$1 = null;
  this.List$1 = null;
  this.Nil$1 = null;
  this.$$colon$colon$1 = null;
  this.$$plus$colon$1 = null;
  this.$$colon$plus$1 = null;
  this.Stream$1 = null;
  this.$$hash$colon$colon$1 = null;
  this.Vector$1 = null;
  this.StringBuilder$1 = null;
  this.Range$1 = null;
  this.BigDecimal$1 = null;
  this.BigInt$1 = null;
  this.Equiv$1 = null;
  this.Fractional$1 = null;
  this.Integral$1 = null;
  this.Numeric$1 = null;
  this.Ordered$1 = null;
  this.Ordering$1 = null;
  this.Either$1 = null;
  this.Left$1 = null;
  this.Right$1 = null;
  this.bitmap$0$1 = 0
}
$c_s_package$.prototype = new $h_O();
$c_s_package$.prototype.constructor = $c_s_package$;
/** @constructor */
function $h_s_package$() {
  /*<skip>*/
}
$h_s_package$.prototype = $c_s_package$.prototype;
$c_s_package$.prototype.init___ = (function() {
  $n_s_package$ = this;
  this.AnyRef$1 = new $c_s_package$$anon$1().init___();
  this.Traversable$1 = $m_sc_Traversable$();
  this.Iterable$1 = $m_sc_Iterable$();
  this.Seq$1 = $m_sc_Seq$();
  this.IndexedSeq$1 = $m_sc_IndexedSeq$();
  this.Iterator$1 = $m_sc_Iterator$();
  this.List$1 = $m_sci_List$();
  this.Nil$1 = $m_sci_Nil$();
  this.$$colon$colon$1 = $m_sci_$colon$colon$();
  this.$$plus$colon$1 = $m_sc_$plus$colon$();
  this.$$colon$plus$1 = $m_sc_$colon$plus$();
  this.Stream$1 = $m_sci_Stream$();
  this.$$hash$colon$colon$1 = $m_sci_Stream$$hash$colon$colon$();
  this.Vector$1 = $m_sci_Vector$();
  this.StringBuilder$1 = $m_scm_StringBuilder$();
  this.Range$1 = $m_sci_Range$();
  this.Equiv$1 = $m_s_math_Equiv$();
  this.Fractional$1 = $m_s_math_Fractional$();
  this.Integral$1 = $m_s_math_Integral$();
  this.Numeric$1 = $m_s_math_Numeric$();
  this.Ordered$1 = $m_s_math_Ordered$();
  this.Ordering$1 = $m_s_math_Ordering$();
  this.Either$1 = $m_s_util_Either$();
  this.Left$1 = $m_s_util_Left$();
  this.Right$1 = $m_s_util_Right$();
  return this
});
var $d_s_package$ = new $TypeData().initClass({
  s_package$: 0
}, false, "scala.package$", {
  s_package$: 1,
  O: 1
});
$c_s_package$.prototype.$classData = $d_s_package$;
var $n_s_package$ = (void 0);
function $m_s_package$() {
  if ((!$n_s_package$)) {
    $n_s_package$ = new $c_s_package$().init___()
  };
  return $n_s_package$
}
/** @constructor */
function $c_s_reflect_ClassManifestFactory$() {
  $c_O.call(this);
  this.Byte$1 = null;
  this.Short$1 = null;
  this.Char$1 = null;
  this.Int$1 = null;
  this.Long$1 = null;
  this.Float$1 = null;
  this.Double$1 = null;
  this.Boolean$1 = null;
  this.Unit$1 = null;
  this.Any$1 = null;
  this.Object$1 = null;
  this.AnyVal$1 = null;
  this.Nothing$1 = null;
  this.Null$1 = null
}
$c_s_reflect_ClassManifestFactory$.prototype = new $h_O();
$c_s_reflect_ClassManifestFactory$.prototype.constructor = $c_s_reflect_ClassManifestFactory$;
/** @constructor */
function $h_s_reflect_ClassManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ClassManifestFactory$.prototype = $c_s_reflect_ClassManifestFactory$.prototype;
$c_s_reflect_ClassManifestFactory$.prototype.init___ = (function() {
  $n_s_reflect_ClassManifestFactory$ = this;
  this.Byte$1 = $m_s_reflect_ManifestFactory$ByteManifest$();
  this.Short$1 = $m_s_reflect_ManifestFactory$ShortManifest$();
  this.Char$1 = $m_s_reflect_ManifestFactory$CharManifest$();
  this.Int$1 = $m_s_reflect_ManifestFactory$IntManifest$();
  this.Long$1 = $m_s_reflect_ManifestFactory$LongManifest$();
  this.Float$1 = $m_s_reflect_ManifestFactory$FloatManifest$();
  this.Double$1 = $m_s_reflect_ManifestFactory$DoubleManifest$();
  this.Boolean$1 = $m_s_reflect_ManifestFactory$BooleanManifest$();
  this.Unit$1 = $m_s_reflect_ManifestFactory$UnitManifest$();
  this.Any$1 = $m_s_reflect_ManifestFactory$AnyManifest$();
  this.Object$1 = $m_s_reflect_ManifestFactory$ObjectManifest$();
  this.AnyVal$1 = $m_s_reflect_ManifestFactory$AnyValManifest$();
  this.Nothing$1 = $m_s_reflect_ManifestFactory$NothingManifest$();
  this.Null$1 = $m_s_reflect_ManifestFactory$NullManifest$();
  return this
});
var $d_s_reflect_ClassManifestFactory$ = new $TypeData().initClass({
  s_reflect_ClassManifestFactory$: 0
}, false, "scala.reflect.ClassManifestFactory$", {
  s_reflect_ClassManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ClassManifestFactory$.prototype.$classData = $d_s_reflect_ClassManifestFactory$;
var $n_s_reflect_ClassManifestFactory$ = (void 0);
function $m_s_reflect_ClassManifestFactory$() {
  if ((!$n_s_reflect_ClassManifestFactory$)) {
    $n_s_reflect_ClassManifestFactory$ = new $c_s_reflect_ClassManifestFactory$().init___()
  };
  return $n_s_reflect_ClassManifestFactory$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$() {
  $c_O.call(this)
}
$c_s_reflect_ManifestFactory$.prototype = new $h_O();
$c_s_reflect_ManifestFactory$.prototype.constructor = $c_s_reflect_ManifestFactory$;
/** @constructor */
function $h_s_reflect_ManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$.prototype = $c_s_reflect_ManifestFactory$.prototype;
var $d_s_reflect_ManifestFactory$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$: 0
}, false, "scala.reflect.ManifestFactory$", {
  s_reflect_ManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ManifestFactory$.prototype.$classData = $d_s_reflect_ManifestFactory$;
var $n_s_reflect_ManifestFactory$ = (void 0);
function $m_s_reflect_ManifestFactory$() {
  if ((!$n_s_reflect_ManifestFactory$)) {
    $n_s_reflect_ManifestFactory$ = new $c_s_reflect_ManifestFactory$().init___()
  };
  return $n_s_reflect_ManifestFactory$
}
/** @constructor */
function $c_s_reflect_package$() {
  $c_O.call(this);
  this.ClassManifest$1 = null;
  this.Manifest$1 = null
}
$c_s_reflect_package$.prototype = new $h_O();
$c_s_reflect_package$.prototype.constructor = $c_s_reflect_package$;
/** @constructor */
function $h_s_reflect_package$() {
  /*<skip>*/
}
$h_s_reflect_package$.prototype = $c_s_reflect_package$.prototype;
$c_s_reflect_package$.prototype.init___ = (function() {
  $n_s_reflect_package$ = this;
  this.ClassManifest$1 = $m_s_reflect_ClassManifestFactory$();
  this.Manifest$1 = $m_s_reflect_ManifestFactory$();
  return this
});
var $d_s_reflect_package$ = new $TypeData().initClass({
  s_reflect_package$: 0
}, false, "scala.reflect.package$", {
  s_reflect_package$: 1,
  O: 1
});
$c_s_reflect_package$.prototype.$classData = $d_s_reflect_package$;
var $n_s_reflect_package$ = (void 0);
function $m_s_reflect_package$() {
  if ((!$n_s_reflect_package$)) {
    $n_s_reflect_package$ = new $c_s_reflect_package$().init___()
  };
  return $n_s_reflect_package$
}
/** @constructor */
function $c_s_util_DynamicVariable() {
  $c_O.call(this);
  this.scala$util$DynamicVariable$$init$f = null;
  this.tl$1 = null
}
$c_s_util_DynamicVariable.prototype = new $h_O();
$c_s_util_DynamicVariable.prototype.constructor = $c_s_util_DynamicVariable;
/** @constructor */
function $h_s_util_DynamicVariable() {
  /*<skip>*/
}
$h_s_util_DynamicVariable.prototype = $c_s_util_DynamicVariable.prototype;
$c_s_util_DynamicVariable.prototype.toString__T = (function() {
  return (("DynamicVariable(" + this.tl$1.get__O()) + ")")
});
$c_s_util_DynamicVariable.prototype.init___O = (function(init) {
  this.scala$util$DynamicVariable$$init$f = init;
  this.tl$1 = new $c_s_util_DynamicVariable$$anon$1().init___s_util_DynamicVariable(this);
  return this
});
var $d_s_util_DynamicVariable = new $TypeData().initClass({
  s_util_DynamicVariable: 0
}, false, "scala.util.DynamicVariable", {
  s_util_DynamicVariable: 1,
  O: 1
});
$c_s_util_DynamicVariable.prototype.$classData = $d_s_util_DynamicVariable;
/** @constructor */
function $c_s_util_Either$() {
  $c_O.call(this)
}
$c_s_util_Either$.prototype = new $h_O();
$c_s_util_Either$.prototype.constructor = $c_s_util_Either$;
/** @constructor */
function $h_s_util_Either$() {
  /*<skip>*/
}
$h_s_util_Either$.prototype = $c_s_util_Either$.prototype;
var $d_s_util_Either$ = new $TypeData().initClass({
  s_util_Either$: 0
}, false, "scala.util.Either$", {
  s_util_Either$: 1,
  O: 1
});
$c_s_util_Either$.prototype.$classData = $d_s_util_Either$;
var $n_s_util_Either$ = (void 0);
function $m_s_util_Either$() {
  if ((!$n_s_util_Either$)) {
    $n_s_util_Either$ = new $c_s_util_Either$().init___()
  };
  return $n_s_util_Either$
}
/** @constructor */
function $c_s_util_control_Breaks() {
  $c_O.call(this);
  this.scala$util$control$Breaks$$breakException$1 = null
}
$c_s_util_control_Breaks.prototype = new $h_O();
$c_s_util_control_Breaks.prototype.constructor = $c_s_util_control_Breaks;
/** @constructor */
function $h_s_util_control_Breaks() {
  /*<skip>*/
}
$h_s_util_control_Breaks.prototype = $c_s_util_control_Breaks.prototype;
$c_s_util_control_Breaks.prototype.init___ = (function() {
  this.scala$util$control$Breaks$$breakException$1 = new $c_s_util_control_BreakControl().init___();
  return this
});
var $d_s_util_control_Breaks = new $TypeData().initClass({
  s_util_control_Breaks: 0
}, false, "scala.util.control.Breaks", {
  s_util_control_Breaks: 1,
  O: 1
});
$c_s_util_control_Breaks.prototype.$classData = $d_s_util_control_Breaks;
function $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable($$this) {
  var this$1 = $m_s_util_control_NoStackTrace$();
  if (this$1.$$undnoSuppression$1) {
    return $$this.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable()
  } else {
    return $as_jl_Throwable($$this)
  }
}
/** @constructor */
function $c_s_util_hashing_MurmurHash3() {
  $c_O.call(this)
}
$c_s_util_hashing_MurmurHash3.prototype = new $h_O();
$c_s_util_hashing_MurmurHash3.prototype.constructor = $c_s_util_hashing_MurmurHash3;
/** @constructor */
function $h_s_util_hashing_MurmurHash3() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3.prototype = $c_s_util_hashing_MurmurHash3.prototype;
$c_s_util_hashing_MurmurHash3.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  k = $m_jl_Integer$().rotateLeft__I__I__I(k, 15);
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_s_util_hashing_MurmurHash3.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  h = $m_jl_Integer$().rotateLeft__I__I__I(h, 13);
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_s_util_hashing_MurmurHash3.prototype.avalanche__p1__I__I = (function(hash) {
  var h = hash;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_s_util_hashing_MurmurHash3.prototype.unorderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var a = new $c_sr_IntRef().init___I(0);
  var b = new $c_sr_IntRef().init___I(0);
  var n = new $c_sr_IntRef().init___I(0);
  var c = new $c_sr_IntRef().init___I(1);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, a$1, b$1, n$1, c$1) {
    return (function(x$2) {
      var h = $m_sr_ScalaRunTime$().hash__O__I(x$2);
      a$1.elem$1 = ((a$1.elem$1 + h) | 0);
      b$1.elem$1 = (b$1.elem$1 ^ h);
      if ((h !== 0)) {
        c$1.elem$1 = $imul(c$1.elem$1, h)
      };
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, a, b, n, c)));
  var h$1 = seed;
  h$1 = this.mix__I__I__I(h$1, a.elem$1);
  h$1 = this.mix__I__I__I(h$1, b.elem$1);
  h$1 = this.mixLast__I__I__I(h$1, c.elem$1);
  return this.finalizeHash__I__I__I(h$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.productHash__s_Product__I__I = (function(x, seed) {
  var arr = x.productArity__I();
  if ((arr === 0)) {
    var this$1 = x.productPrefix__T();
    return $m_sjsr_RuntimeString$().hashCode__T__I(this$1)
  } else {
    var h = seed;
    var i = 0;
    while ((i < arr)) {
      h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(x.productElement__I__O(i)));
      i = ((1 + i) | 0)
    };
    return this.finalizeHash__I__I__I(h, arr)
  }
});
$c_s_util_hashing_MurmurHash3.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__p1__I__I((hash ^ length))
});
$c_s_util_hashing_MurmurHash3.prototype.orderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var n = new $c_sr_IntRef().init___I(0);
  var h = new $c_sr_IntRef().init___I(seed);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, n$1, h$1) {
    return (function(x$2) {
      h$1.elem$1 = $this.mix__I__I__I(h$1.elem$1, $m_sr_ScalaRunTime$().hash__O__I(x$2));
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, n, h)));
  return this.finalizeHash__I__I__I(h.elem$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.listHash__sci_List__I__I = (function(xs, seed) {
  var n = 0;
  var h = seed;
  var elems = xs;
  while ((!elems.isEmpty__Z())) {
    var head = elems.head__O();
    var tail = $as_sci_List(elems.tail__O());
    h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(head));
    n = ((1 + n) | 0);
    elems = tail
  };
  return this.finalizeHash__I__I__I(h, n)
});
/** @constructor */
function $c_s_util_hashing_package$() {
  $c_O.call(this)
}
$c_s_util_hashing_package$.prototype = new $h_O();
$c_s_util_hashing_package$.prototype.constructor = $c_s_util_hashing_package$;
/** @constructor */
function $h_s_util_hashing_package$() {
  /*<skip>*/
}
$h_s_util_hashing_package$.prototype = $c_s_util_hashing_package$.prototype;
$c_s_util_hashing_package$.prototype.byteswap32__I__I = (function(v) {
  var hc = $imul((-1640532531), v);
  hc = $m_jl_Integer$().reverseBytes__I__I(hc);
  return $imul((-1640532531), hc)
});
var $d_s_util_hashing_package$ = new $TypeData().initClass({
  s_util_hashing_package$: 0
}, false, "scala.util.hashing.package$", {
  s_util_hashing_package$: 1,
  O: 1
});
$c_s_util_hashing_package$.prototype.$classData = $d_s_util_hashing_package$;
var $n_s_util_hashing_package$ = (void 0);
function $m_s_util_hashing_package$() {
  if ((!$n_s_util_hashing_package$)) {
    $n_s_util_hashing_package$ = new $c_s_util_hashing_package$().init___()
  };
  return $n_s_util_hashing_package$
}
/** @constructor */
function $c_sc_$colon$plus$() {
  $c_O.call(this)
}
$c_sc_$colon$plus$.prototype = new $h_O();
$c_sc_$colon$plus$.prototype.constructor = $c_sc_$colon$plus$;
/** @constructor */
function $h_sc_$colon$plus$() {
  /*<skip>*/
}
$h_sc_$colon$plus$.prototype = $c_sc_$colon$plus$.prototype;
var $d_sc_$colon$plus$ = new $TypeData().initClass({
  sc_$colon$plus$: 0
}, false, "scala.collection.$colon$plus$", {
  sc_$colon$plus$: 1,
  O: 1
});
$c_sc_$colon$plus$.prototype.$classData = $d_sc_$colon$plus$;
var $n_sc_$colon$plus$ = (void 0);
function $m_sc_$colon$plus$() {
  if ((!$n_sc_$colon$plus$)) {
    $n_sc_$colon$plus$ = new $c_sc_$colon$plus$().init___()
  };
  return $n_sc_$colon$plus$
}
/** @constructor */
function $c_sc_$plus$colon$() {
  $c_O.call(this)
}
$c_sc_$plus$colon$.prototype = new $h_O();
$c_sc_$plus$colon$.prototype.constructor = $c_sc_$plus$colon$;
/** @constructor */
function $h_sc_$plus$colon$() {
  /*<skip>*/
}
$h_sc_$plus$colon$.prototype = $c_sc_$plus$colon$.prototype;
var $d_sc_$plus$colon$ = new $TypeData().initClass({
  sc_$plus$colon$: 0
}, false, "scala.collection.$plus$colon$", {
  sc_$plus$colon$: 1,
  O: 1
});
$c_sc_$plus$colon$.prototype.$classData = $d_sc_$plus$colon$;
var $n_sc_$plus$colon$ = (void 0);
function $m_sc_$plus$colon$() {
  if ((!$n_sc_$plus$colon$)) {
    $n_sc_$plus$colon$ = new $c_sc_$plus$colon$().init___()
  };
  return $n_sc_$plus$colon$
}
function $s_sc_GenMapLike$class__liftedTree1$1__p0__sc_GenMapLike__sc_GenMap__Z($$this, x2$1) {
  try {
    var this$1 = $$this.iterator__sc_Iterator();
    var res = true;
    while ((res && this$1.hasNext__Z())) {
      var arg1 = this$1.next__O();
      var x0$1 = $as_T2(arg1);
      if ((x0$1 !== null)) {
        var k = x0$1.$$und1__O();
        var v = x0$1.$$und2__O();
        var x1$2 = x2$1.get__O__s_Option(k);
        matchEnd6: {
          if ($is_s_Some(x1$2)) {
            var x2 = $as_s_Some(x1$2);
            var p3 = x2.x$2;
            if ($m_sr_BoxesRunTime$().equals__O__O__Z(v, p3)) {
              res = true;
              break matchEnd6
            }
          };
          res = false;
          break matchEnd6
        }
      } else {
        throw new $c_s_MatchError().init___O(x0$1)
      }
    };
    return res
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      var this$3 = $m_s_Console$();
      var this$4 = this$3.outVar$2;
      $as_Ljava_io_PrintStream(this$4.tl$1.get__O()).println__O__V("class cast ");
      return false
    } else {
      throw e
    }
  }
}
function $s_sc_GenMapLike$class__equals__sc_GenMapLike__O__Z($$this, that) {
  if ($is_sc_GenMap(that)) {
    var x2 = $as_sc_GenMap(that);
    return (($$this === x2) || (($$this.size__I() === x2.size__I()) && $s_sc_GenMapLike$class__liftedTree1$1__p0__sc_GenMapLike__sc_GenMap__Z($$this, x2)))
  } else {
    return false
  }
}
function $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z($$this, that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return $$this.sameElements__sc_GenIterable__Z(x2)
  } else {
    return false
  }
}
function $s_sc_GenSeqLike$class__lastIndexWhere__sc_GenSeqLike__F1__I($$this, p) {
  return $$this.lastIndexWhere__F1__I__I(p, (((-1) + $$this.length__I()) | 0))
}
function $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2$1) {
  try {
    return $$this.subsetOf__sc_GenSet__Z(x2$1)
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      return false
    } else {
      throw e
    }
  }
}
function $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z($$this, that) {
  if ($is_sc_GenSet(that)) {
    var x2 = $as_sc_GenSet(that);
    return (($$this === x2) || (($$this.size__I() === x2.size__I()) && $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2)))
  } else {
    return false
  }
}
function $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I($$this, len) {
  return (($$this.length__I() - len) | 0)
}
function $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O($$this) {
  return (($$this.length__I() > 0) ? $$this.apply__I__O((((-1) + $$this.length__I()) | 0)) : $s_sc_TraversableLike$class__last__sc_TraversableLike__O($$this))
}
function $s_sc_IndexedSeqOptimized$class__find__sc_IndexedSeqOptimized__F1__s_Option($$this, p) {
  var len = $$this.length__I();
  var i = 0;
  while (true) {
    if ((i < len)) {
      var arg1 = $$this.apply__I__O(i);
      var jsx$1 = (!$uZ(p.apply__O__O(arg1)))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      i = ((1 + i) | 0)
    } else {
      break
    }
  };
  var i$1 = i;
  return ((i$1 < $$this.length__I()) ? new $c_s_Some().init___O($$this.apply__I__O(i$1)) : $m_s_None$())
}
function $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O($$this, from, until) {
  var lo = ((from > 0) ? from : 0);
  var x = ((until > 0) ? until : 0);
  var y = $$this.length__I();
  var hi = ((x < y) ? x : y);
  var x$1 = ((hi - lo) | 0);
  var elems = ((x$1 > 0) ? x$1 : 0);
  var b = $$this.newBuilder__scm_Builder();
  b.sizeHint__I__V(elems);
  var i = lo;
  while ((i < hi)) {
    b.$$plus$eq__O__scm_Builder($$this.apply__I__O(i));
    i = ((1 + i) | 0)
  };
  return b.result__O()
}
function $s_sc_IndexedSeqOptimized$class__negLength__p0__sc_IndexedSeqOptimized__I__I($$this, n) {
  return ((n >= $$this.length__I()) ? (-1) : n)
}
function $s_sc_IndexedSeqOptimized$class__zipWithIndex__sc_IndexedSeqOptimized__scg_CanBuildFrom__O($$this, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  var len = $$this.length__I();
  b.sizeHint__I__V(len);
  var i = 0;
  while ((i < len)) {
    b.$$plus$eq__O__scm_Builder(new $c_T2().init___O__O($$this.apply__I__O(i), i));
    i = ((1 + i) | 0)
  };
  return b.result__O()
}
function $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V($$this, xs, start, len) {
  var i = 0;
  var j = start;
  var $$this$1 = $$this.length__I();
  var $$this$2 = (($$this$1 < len) ? $$this$1 : len);
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = (($$this$2 < that) ? $$this$2 : that);
  while ((i < end)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, j, $$this.apply__I__O(i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_IndexedSeq(that)) {
    var x2 = $as_sc_IndexedSeq(that);
    var len = $$this.length__I();
    if ((len === x2.length__I())) {
      var i = 0;
      while (((i < len) && $m_sr_BoxesRunTime$().equals__O__O__Z($$this.apply__I__O(i), x2.apply__I__O(i)))) {
        i = ((1 + i) | 0)
      };
      return (i === len)
    } else {
      return false
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V($$this, f) {
  var i = 0;
  var len = $$this.length__I();
  while ((i < len)) {
    f.apply__O__O($$this.apply__I__O(i));
    i = ((1 + i) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__reverse__sc_IndexedSeqOptimized__O($$this) {
  var b = $$this.newBuilder__scm_Builder();
  b.sizeHint__I__V($$this.length__I());
  var i = $$this.length__I();
  while ((i > 0)) {
    i = (((-1) + i) | 0);
    b.$$plus$eq__O__scm_Builder($$this.apply__I__O(i))
  };
  return b.result__O()
}
function $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O($$this) {
  return ($s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) ? $s_sc_TraversableLike$class__tail__sc_TraversableLike__O($$this) : $$this.slice__I__I__O(1, $$this.length__I()))
}
function $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I($$this, p, end) {
  var y = (((-1) + $$this.length__I()) | 0);
  var i = ((end < y) ? end : y);
  while (((i >= 0) && (!$uZ(p.apply__O__O($$this.apply__I__O(i)))))) {
    i = (((-1) + i) | 0)
  };
  return i
}
function $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) {
  return ($$this.length__I() === 0)
}
function $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O($$this) {
  return ($s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) ? new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I($$this, 0, $$this.length__I()).next__O() : $$this.apply__I__O(0))
}
function $s_sc_IterableLike$class__drop__sc_IterableLike__I__O($$this, n) {
  var b = $$this.newBuilder__scm_Builder();
  var lo = ((n < 0) ? 0 : n);
  var delta = ((-lo) | 0);
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V(b, $$this, delta);
  var i = 0;
  var it = $$this.iterator__sc_Iterator();
  while (((i < n) && it.hasNext__Z())) {
    it.next__O();
    i = ((1 + i) | 0)
  };
  return $as_scm_Builder(b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(it)).result__O()
}
function $s_sc_IterableLike$class__zip__sc_IterableLike__sc_GenIterable__scg_CanBuildFrom__O($$this, that, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  var these = $$this.iterator__sc_Iterator();
  var those = that.iterator__sc_Iterator();
  while ((these.hasNext__Z() && those.hasNext__Z())) {
    b.$$plus$eq__O__scm_Builder(new $c_T2().init___O__O(these.next__O(), those.next__O()))
  };
  return b.result__O()
}
function $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V($$this, xs, start, len) {
  var i = start;
  var $$this$1 = ((start + len) | 0);
  var that = $m_sr_ScalaRunTime$().array$undlength__O__I(xs);
  var end = (($$this$1 < that) ? $$this$1 : that);
  var it = $$this.iterator__sc_Iterator();
  while (((i < end) && it.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, it.next__O());
    i = ((1 + i) | 0)
  }
}
function $s_sc_IterableLike$class__take__sc_IterableLike__I__O($$this, n) {
  var b = $$this.newBuilder__scm_Builder();
  if ((n <= 0)) {
    return b.result__O()
  } else {
    b.sizeHintBounded__I__sc_TraversableLike__V(n, $$this);
    var i = 0;
    var it = $$this.iterator__sc_Iterator();
    while (((i < n) && it.hasNext__Z())) {
      b.$$plus$eq__O__scm_Builder(it.next__O());
      i = ((1 + i) | 0)
    };
    return b.result__O()
  }
}
function $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that) {
  var these = $$this.iterator__sc_Iterator();
  var those = that.iterator__sc_Iterator();
  while ((these.hasNext__Z() && those.hasNext__Z())) {
    if ((!$m_sr_BoxesRunTime$().equals__O__O__Z(these.next__O(), those.next__O()))) {
      return false
    }
  };
  return ((!these.hasNext__Z()) && (!those.hasNext__Z()))
}
function $s_sc_IterableLike$class__zipWithIndex__sc_IterableLike__scg_CanBuildFrom__O($$this, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  var i = new $c_sr_IntRef().init___I(0);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, b$1, i$1) {
    return (function(x$2) {
      b$1.$$plus$eq__O__scm_Builder(new $c_T2().init___O__O(x$2, i$1.elem$1));
      i$1.elem$1 = ((1 + i$1.elem$1) | 0)
    })
  })($$this, b, i)));
  return b.result__O()
}
/** @constructor */
function $c_sc_Iterator$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_sc_Iterator$.prototype = new $h_O();
$c_sc_Iterator$.prototype.constructor = $c_sc_Iterator$;
/** @constructor */
function $h_sc_Iterator$() {
  /*<skip>*/
}
$h_sc_Iterator$.prototype = $c_sc_Iterator$.prototype;
$c_sc_Iterator$.prototype.init___ = (function() {
  $n_sc_Iterator$ = this;
  this.empty$1 = new $c_sc_Iterator$$anon$2().init___();
  return this
});
var $d_sc_Iterator$ = new $TypeData().initClass({
  sc_Iterator$: 0
}, false, "scala.collection.Iterator$", {
  sc_Iterator$: 1,
  O: 1
});
$c_sc_Iterator$.prototype.$classData = $d_sc_Iterator$;
var $n_sc_Iterator$ = (void 0);
function $m_sc_Iterator$() {
  if ((!$n_sc_Iterator$)) {
    $n_sc_Iterator$ = new $c_sc_Iterator$().init___()
  };
  return $n_sc_Iterator$
}
function $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream($$this) {
  if ($$this.hasNext__Z()) {
    var hd = $$this.next__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($$this$1) {
      return (function() {
        return $$this$1.toStream__sci_Stream()
      })
    })($$this));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  } else {
    $m_sci_Stream$();
    return $m_sci_Stream$Empty$()
  }
}
function $s_sc_Iterator$class__isEmpty__sc_Iterator__Z($$this) {
  return (!$$this.hasNext__Z())
}
function $s_sc_Iterator$class__toString__sc_Iterator__T($$this) {
  return (($$this.hasNext__Z() ? "non-empty" : "empty") + " iterator")
}
function $s_sc_Iterator$class__foreach__sc_Iterator__F1__V($$this, f) {
  while ($$this.hasNext__Z()) {
    f.apply__O__O($$this.next__O())
  }
}
function $s_sc_Iterator$class__dropWhile__sc_Iterator__F1__sc_Iterator($$this, p) {
  var self = $$this.buffered__sc_BufferedIterator();
  return new $c_sc_Iterator$$anon$18().init___sc_Iterator__sc_BufferedIterator__F1($$this, self, p)
}
function $s_sc_Iterator$class__find__sc_Iterator__F1__s_Option($$this, p) {
  var res = $m_s_None$();
  while ((res.isEmpty__Z() && $$this.hasNext__Z())) {
    var e = $$this.next__O();
    if ($uZ(p.apply__O__O(e))) {
      res = new $c_s_Some().init___O(e)
    }
  };
  return res
}
function $s_sc_Iterator$class__forall__sc_Iterator__F1__Z($$this, p) {
  var res = true;
  while ((res && $$this.hasNext__Z())) {
    res = $uZ(p.apply__O__O($$this.next__O()))
  };
  return res
}
function $s_sc_LinearSeqOptimized$class__foreach__sc_LinearSeqOptimized__F1__V($$this, f) {
  var these = $$this;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  }
}
function $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I($$this, len) {
  return ((len < 0) ? 1 : $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, 0, $$this, len))
}
function $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O($$this, n) {
  var rest = $$this.drop__I__sc_LinearSeqOptimized(n);
  if (((n < 0) || rest.isEmpty__Z())) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  return rest.head__O()
}
function $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, i, xs, len$1) {
  _loop: while (true) {
    if ((i === len$1)) {
      return (xs.isEmpty__Z() ? 0 : 1)
    } else if (xs.isEmpty__Z()) {
      return (-1)
    } else {
      var temp$i = ((1 + i) | 0);
      var temp$xs = $as_sc_LinearSeqOptimized(xs.tail__O());
      i = temp$i;
      xs = temp$xs;
      continue _loop
    }
  }
}
function $s_sc_LinearSeqOptimized$class__lastIndexWhere__sc_LinearSeqOptimized__F1__I__I($$this, p, end) {
  var i = 0;
  var these = $$this;
  var last = (-1);
  while (((!these.isEmpty__Z()) && (i <= end))) {
    if ($uZ(p.apply__O__O(these.head__O()))) {
      last = i
    };
    these = $as_sc_LinearSeqOptimized(these.tail__O());
    i = ((1 + i) | 0)
  };
  return last
}
function $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I($$this) {
  var these = $$this;
  var len = 0;
  while ((!these.isEmpty__Z())) {
    len = ((1 + len) | 0);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return len
}
function $s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O($$this) {
  if ($$this.isEmpty__Z()) {
    throw new $c_ju_NoSuchElementException().init___()
  };
  var these = $$this;
  var nx = $as_sc_LinearSeqOptimized(these.tail__O());
  while ((!nx.isEmpty__Z())) {
    these = nx;
    nx = $as_sc_LinearSeqOptimized(nx.tail__O())
  };
  return these.head__O()
}
function $s_sc_LinearSeqOptimized$class__find__sc_LinearSeqOptimized__F1__s_Option($$this, p) {
  var these = $$this;
  while ((!these.isEmpty__Z())) {
    if ($uZ(p.apply__O__O(these.head__O()))) {
      return new $c_s_Some().init___O(these.head__O())
    };
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return $m_s_None$()
}
function $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_LinearSeq(that)) {
    var x2 = $as_sc_LinearSeq(that);
    if (($$this === x2)) {
      return true
    } else {
      var these = $$this;
      var those = x2;
      while ((((!these.isEmpty__Z()) && (!those.isEmpty__Z())) && $m_sr_BoxesRunTime$().equals__O__O__Z(these.head__O(), those.head__O()))) {
        these = $as_sc_LinearSeqOptimized(these.tail__O());
        those = $as_sc_LinearSeq(those.tail__O())
      };
      return (these.isEmpty__Z() && those.isEmpty__Z())
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_LinearSeqOptimized$class__drop__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized($$this, n) {
  var these = $$this;
  var count = n;
  while (((!these.isEmpty__Z()) && (count > 0))) {
    these = $as_sc_LinearSeqOptimized(these.tail__O());
    count = (((-1) + count) | 0)
  };
  return these
}
function $s_sc_MapLike$class__addString__sc_MapLike__scm_StringBuilder__T__T__T__scm_StringBuilder($$this, b, start, sep, end) {
  var this$2 = $$this.iterator__sc_Iterator();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1) {
    return (function(x0$1$2) {
      var x0$1 = $as_T2(x0$1$2);
      if ((x0$1 !== null)) {
        var k = x0$1.$$und1__O();
        var v = x0$1.$$und2__O();
        return (("" + $m_s_Predef$any2stringadd$().$$plus$extension__O__T__T(k, " -> ")) + v)
      } else {
        throw new $c_s_MatchError().init___O(x0$1)
      }
    })
  })($$this));
  var this$3 = new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$2, f);
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this$3, b, start, sep, end)
}
function $s_sc_MapLike$class__apply__sc_MapLike__O__O($$this, key) {
  var x1 = $$this.get__O__s_Option(key);
  var x = $m_s_None$();
  if ((x === x1)) {
    return $s_sc_MapLike$class__$default__sc_MapLike__O__O($$this, key)
  } else if ($is_s_Some(x1)) {
    var x2 = $as_s_Some(x1);
    var value = x2.x$2;
    return value
  } else {
    throw new $c_s_MatchError().init___O(x1)
  }
}
function $s_sc_MapLike$class__isEmpty__sc_MapLike__Z($$this) {
  return ($$this.size__I() === 0)
}
function $s_sc_MapLike$class__contains__sc_MapLike__O__Z($$this, key) {
  return $$this.get__O__s_Option(key).isDefined__Z()
}
function $s_sc_MapLike$class__$default__sc_MapLike__O__O($$this, key) {
  throw new $c_ju_NoSuchElementException().init___T(("key not found: " + key))
}
function $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z($$this) {
  return ($$this.lengthCompare__I__I(0) === 0)
}
function $s_sc_SeqLike$class__$$plus$colon__sc_SeqLike__O__scg_CanBuildFrom__O($$this, elem, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  b.$$plus$eq__O__scm_Builder(elem);
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Seq());
  return b.result__O()
}
function $s_sc_SeqLike$class__reverse__sc_SeqLike__O($$this) {
  var elem = $m_sci_Nil$();
  var xs = new $c_sr_ObjectRef().init___O(elem);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, xs$1) {
    return (function(x$2) {
      var this$2 = $as_sci_List(xs$1.elem$1);
      xs$1.elem$1 = new $c_sci_$colon$colon().init___O__sci_List(x$2, this$2)
    })
  })($$this, xs)));
  var b = $$this.newBuilder__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  var this$3 = $as_sci_List(xs.elem$1);
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    b.$$plus$eq__O__scm_Builder(arg1);
    these = $as_sci_List(these.tail__O())
  };
  return b.result__O()
}
function $s_sc_SeqLike$class__lastIndexWhere__sc_SeqLike__F1__I__I($$this, p, end) {
  var i = (((-1) + $$this.length__I()) | 0);
  var it = $$this.reverseIterator__sc_Iterator();
  while (true) {
    if (it.hasNext__Z()) {
      var elem = it.next__O();
      var jsx$1 = ((i > end) || (!$uZ(p.apply__O__O(elem))))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      i = (((-1) + i) | 0)
    } else {
      break
    }
  };
  return i
}
function $s_sc_SeqLike$class__reverseIterator__sc_SeqLike__sc_Iterator($$this) {
  return $$this.toCollection__O__sc_Seq($$this.reverse__O()).iterator__sc_Iterator()
}
function $s_sc_SeqLike$class__$$colon$plus__sc_SeqLike__O__scg_CanBuildFrom__O($$this, elem, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Seq());
  b.$$plus$eq__O__scm_Builder(elem);
  return b.result__O()
}
function $s_sc_SeqLike$class__lengthCompare__sc_SeqLike__I__I($$this, len) {
  if ((len < 0)) {
    return 1
  } else {
    var i = 0;
    var it = $$this.iterator__sc_Iterator();
    while (it.hasNext__Z()) {
      if ((i === len)) {
        return (it.hasNext__Z() ? 1 : 0)
      };
      it.next__O();
      i = ((1 + i) | 0)
    };
    return ((i - len) | 0)
  }
}
function $s_sc_SetLike$class__isEmpty__sc_SetLike__Z($$this) {
  return ($$this.size__I() === 0)
}
function $s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O($$this, cbf) {
  var b = cbf.apply__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Traversable());
  return b.result__O()
}
function $s_sc_TraversableLike$class__toString__sc_TraversableLike__T($$this) {
  return $$this.mkString__T__T__T__T(($$this.stringPrefix__T() + "("), ", ", ")")
}
function $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O($$this, f, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, b$1, f$1) {
    return (function(x$2) {
      return $as_scm_Builder(b$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($as_sc_GenTraversableOnce(f$1.apply__O__O(x$2)).seq__sc_TraversableOnce()))
    })
  })($$this, b, f)));
  return b.result__O()
}
function $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O($$this, f, bf) {
  var b = $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder($$this, bf);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, b$1, f$1) {
    return (function(x$2) {
      return b$1.$$plus$eq__O__scm_Builder(f$1.apply__O__O(x$2))
    })
  })($$this, b, f)));
  return b.result__O()
}
function $s_sc_TraversableLike$class__tail__sc_TraversableLike__O($$this) {
  if ($$this.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.tail")
  };
  return $$this.drop__I__O(1)
}
function $s_sc_TraversableLike$class__$$plus$plus__sc_TraversableLike__sc_GenTraversableOnce__scg_CanBuildFrom__O($$this, that, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  if ($is_sc_IndexedSeqLike(that)) {
    var delta = that.seq__sc_TraversableOnce().size__I();
    $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V(b, $$this, delta)
  };
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Traversable());
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(that.seq__sc_TraversableOnce());
  return b.result__O()
}
function $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder($$this, bf$1) {
  var b = bf$1.apply__O__scm_Builder($$this.repr__O());
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  return b
}
function $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T($$this) {
  var string = $objectGetClass($$this.repr__O()).getName__T();
  var idx1 = $m_sjsr_RuntimeString$().lastIndexOf__T__I__I(string, 46);
  if ((idx1 !== (-1))) {
    var thiz = string;
    var beginIndex = ((1 + idx1) | 0);
    string = $as_T(thiz["substring"](beginIndex))
  };
  var idx2 = $m_sjsr_RuntimeString$().indexOf__T__I__I(string, 36);
  if ((idx2 !== (-1))) {
    var thiz$1 = string;
    string = $as_T(thiz$1["substring"](0, idx2))
  };
  return string
}
function $s_sc_TraversableLike$class__last__sc_TraversableLike__O($$this) {
  var elem = $$this.head__O();
  var lst = new $c_sr_ObjectRef().init___O(elem);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, lst$1) {
    return (function(x$2) {
      lst$1.elem$1 = x$2
    })
  })($$this, lst)));
  return lst.elem$1
}
function $is_sc_TraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableOnce)))
}
function $as_sc_TraversableOnce(obj) {
  return (($is_sc_TraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableOnce"))
}
function $isArrayOf_sc_TraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableOnce)))
}
function $asArrayOf_sc_TraversableOnce(obj, depth) {
  return (($isArrayOf_sc_TraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableOnce;", depth))
}
function $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder($$this, b, start, sep, end) {
  var first = new $c_sr_BooleanRef().init___Z(true);
  b.append__T__scm_StringBuilder(start);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, first$1, b$1, sep$1) {
    return (function(x$2) {
      if (first$1.elem$1) {
        b$1.append__O__scm_StringBuilder(x$2);
        first$1.elem$1 = false;
        return (void 0)
      } else {
        b$1.append__T__scm_StringBuilder(sep$1);
        return b$1.append__O__scm_StringBuilder(x$2)
      }
    })
  })($$this, first, b, sep)));
  b.append__T__scm_StringBuilder(end);
  return b
}
function $s_sc_TraversableOnce$class__to__sc_TraversableOnce__scg_CanBuildFrom__O($$this, cbf) {
  var b = cbf.apply__scm_Builder();
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.seq__sc_TraversableOnce());
  return b.result__O()
}
function $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T($$this, start, sep, end) {
  var this$1 = $$this.addString__scm_StringBuilder__T__T__T__scm_StringBuilder(new $c_scm_StringBuilder().init___(), start, sep, end);
  var this$2 = this$1.underlying$5;
  return this$2.content$1
}
function $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z($$this) {
  return (!$$this.isEmpty__Z())
}
function $s_sc_TraversableOnce$class__size__sc_TraversableOnce__I($$this) {
  var result = new $c_sr_IntRef().init___I(0);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, result$1) {
    return (function(x$2) {
      result$1.elem$1 = ((1 + result$1.elem$1) | 0)
    })
  })($$this, result)));
  return result.elem$1
}
/** @constructor */
function $c_scg_GenMapFactory() {
  $c_O.call(this)
}
$c_scg_GenMapFactory.prototype = new $h_O();
$c_scg_GenMapFactory.prototype.constructor = $c_scg_GenMapFactory;
/** @constructor */
function $h_scg_GenMapFactory() {
  /*<skip>*/
}
$h_scg_GenMapFactory.prototype = $c_scg_GenMapFactory.prototype;
/** @constructor */
function $c_scg_GenericCompanion() {
  $c_O.call(this)
}
$c_scg_GenericCompanion.prototype = new $h_O();
$c_scg_GenericCompanion.prototype.constructor = $c_scg_GenericCompanion;
/** @constructor */
function $h_scg_GenericCompanion() {
  /*<skip>*/
}
$h_scg_GenericCompanion.prototype = $c_scg_GenericCompanion.prototype;
$c_scg_GenericCompanion.prototype.apply__sc_Seq__sc_GenTraversable = (function(elems) {
  if (elems.isEmpty__Z()) {
    return this.empty__sc_GenTraversable()
  } else {
    var b = this.newBuilder__scm_Builder();
    b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(elems);
    return $as_sc_GenTraversable(b.result__O())
  }
});
$c_scg_GenericCompanion.prototype.empty__sc_GenTraversable = (function() {
  return $as_sc_GenTraversable(this.newBuilder__scm_Builder().result__O())
});
function $is_scg_Growable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scg_Growable)))
}
function $as_scg_Growable(obj) {
  return (($is_scg_Growable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.generic.Growable"))
}
function $isArrayOf_scg_Growable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scg_Growable)))
}
function $asArrayOf_scg_Growable(obj, depth) {
  return (($isArrayOf_scg_Growable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.generic.Growable;", depth))
}
function $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, xs) {
  x: {
    _loop: while (true) {
      var this$1 = xs;
      if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
        $$this.$$plus$eq__O__scg_Growable(xs.head__O());
        xs = $as_sc_LinearSeq(xs.tail__O());
        continue _loop
      };
      break x
    }
  }
}
function $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable($$this, xs) {
  if ($is_sc_LinearSeq(xs)) {
    var x2 = $as_sc_LinearSeq(xs);
    $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, x2)
  } else {
    xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1) {
      return (function(elem$2) {
        return $$this$1.$$plus$eq__O__scg_Growable(elem$2)
      })
    })($$this)))
  };
  return $$this
}
/** @constructor */
function $c_sci_HashMap$Merger() {
  $c_O.call(this)
}
$c_sci_HashMap$Merger.prototype = new $h_O();
$c_sci_HashMap$Merger.prototype.constructor = $c_sci_HashMap$Merger;
/** @constructor */
function $h_sci_HashMap$Merger() {
  /*<skip>*/
}
$h_sci_HashMap$Merger.prototype = $c_sci_HashMap$Merger.prototype;
/** @constructor */
function $c_sci_Stream$$hash$colon$colon$() {
  $c_O.call(this)
}
$c_sci_Stream$$hash$colon$colon$.prototype = new $h_O();
$c_sci_Stream$$hash$colon$colon$.prototype.constructor = $c_sci_Stream$$hash$colon$colon$;
/** @constructor */
function $h_sci_Stream$$hash$colon$colon$() {
  /*<skip>*/
}
$h_sci_Stream$$hash$colon$colon$.prototype = $c_sci_Stream$$hash$colon$colon$.prototype;
var $d_sci_Stream$$hash$colon$colon$ = new $TypeData().initClass({
  sci_Stream$$hash$colon$colon$: 0
}, false, "scala.collection.immutable.Stream$$hash$colon$colon$", {
  sci_Stream$$hash$colon$colon$: 1,
  O: 1
});
$c_sci_Stream$$hash$colon$colon$.prototype.$classData = $d_sci_Stream$$hash$colon$colon$;
var $n_sci_Stream$$hash$colon$colon$ = (void 0);
function $m_sci_Stream$$hash$colon$colon$() {
  if ((!$n_sci_Stream$$hash$colon$colon$)) {
    $n_sci_Stream$$hash$colon$colon$ = new $c_sci_Stream$$hash$colon$colon$().init___()
  };
  return $n_sci_Stream$$hash$colon$colon$
}
/** @constructor */
function $c_sci_Stream$ConsWrapper() {
  $c_O.call(this);
  this.tl$1 = null
}
$c_sci_Stream$ConsWrapper.prototype = new $h_O();
$c_sci_Stream$ConsWrapper.prototype.constructor = $c_sci_Stream$ConsWrapper;
/** @constructor */
function $h_sci_Stream$ConsWrapper() {
  /*<skip>*/
}
$h_sci_Stream$ConsWrapper.prototype = $c_sci_Stream$ConsWrapper.prototype;
$c_sci_Stream$ConsWrapper.prototype.init___F0 = (function(tl) {
  this.tl$1 = tl;
  return this
});
$c_sci_Stream$ConsWrapper.prototype.$$hash$colon$colon__O__sci_Stream = (function(hd) {
  var tl = this.tl$1;
  return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
});
var $d_sci_Stream$ConsWrapper = new $TypeData().initClass({
  sci_Stream$ConsWrapper: 0
}, false, "scala.collection.immutable.Stream$ConsWrapper", {
  sci_Stream$ConsWrapper: 1,
  O: 1
});
$c_sci_Stream$ConsWrapper.prototype.$classData = $d_sci_Stream$ConsWrapper;
/** @constructor */
function $c_sci_StreamIterator$LazyCell() {
  $c_O.call(this);
  this.st$1 = null;
  this.v$1 = null;
  this.$$outer$f = null;
  this.bitmap$0$1 = false
}
$c_sci_StreamIterator$LazyCell.prototype = new $h_O();
$c_sci_StreamIterator$LazyCell.prototype.constructor = $c_sci_StreamIterator$LazyCell;
/** @constructor */
function $h_sci_StreamIterator$LazyCell() {
  /*<skip>*/
}
$h_sci_StreamIterator$LazyCell.prototype = $c_sci_StreamIterator$LazyCell.prototype;
$c_sci_StreamIterator$LazyCell.prototype.init___sci_StreamIterator__F0 = (function($$outer, st) {
  this.st$1 = st;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_StreamIterator$LazyCell.prototype.v$lzycompute__p1__sci_Stream = (function() {
  if ((!this.bitmap$0$1)) {
    this.v$1 = $as_sci_Stream(this.st$1.apply__O());
    this.bitmap$0$1 = true
  };
  this.st$1 = null;
  return this.v$1
});
$c_sci_StreamIterator$LazyCell.prototype.v__sci_Stream = (function() {
  return ((!this.bitmap$0$1) ? this.v$lzycompute__p1__sci_Stream() : this.v$1)
});
var $d_sci_StreamIterator$LazyCell = new $TypeData().initClass({
  sci_StreamIterator$LazyCell: 0
}, false, "scala.collection.immutable.StreamIterator$LazyCell", {
  sci_StreamIterator$LazyCell: 1,
  O: 1
});
$c_sci_StreamIterator$LazyCell.prototype.$classData = $d_sci_StreamIterator$LazyCell;
function $s_sci_StringLike$class__unwrapArg__p0__sci_StringLike__O__O($$this, arg) {
  if ($is_s_math_ScalaNumber(arg)) {
    var x2 = $as_s_math_ScalaNumber(arg);
    return x2.underlying__O()
  } else {
    return arg
  }
}
function $s_sci_StringLike$class__slice__sci_StringLike__I__I__O($$this, from, until) {
  var start = ((from > 0) ? from : 0);
  var that = $$this.length__I();
  var end = ((until < that) ? until : that);
  if ((start >= end)) {
    return $$this.newBuilder__scm_Builder().result__O()
  } else {
    var jsx$1 = $$this.newBuilder__scm_Builder();
    var thiz = $$this.toString__T();
    return $as_scm_Builder(jsx$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(new $c_sci_StringOps().init___T($as_T(thiz["substring"](start, end))))).result__O()
  }
}
/** @constructor */
function $c_sci_StringOps$() {
  $c_O.call(this)
}
$c_sci_StringOps$.prototype = new $h_O();
$c_sci_StringOps$.prototype.constructor = $c_sci_StringOps$;
/** @constructor */
function $h_sci_StringOps$() {
  /*<skip>*/
}
$h_sci_StringOps$.prototype = $c_sci_StringOps$.prototype;
$c_sci_StringOps$.prototype.equals$extension__T__O__Z = (function($$this, x$1) {
  if ($is_sci_StringOps(x$1)) {
    var StringOps$1 = ((x$1 === null) ? null : $as_sci_StringOps(x$1).repr$1);
    return ($$this === StringOps$1)
  } else {
    return false
  }
});
$c_sci_StringOps$.prototype.slice$extension__T__I__I__T = (function($$this, from, until) {
  var start = ((from < 0) ? 0 : from);
  if (((until <= start) || (start >= $uI($$this["length"])))) {
    return ""
  };
  var end = ((until > $uI($$this["length"])) ? $uI($$this["length"]) : until);
  return $as_T($$this["substring"](start, end))
});
var $d_sci_StringOps$ = new $TypeData().initClass({
  sci_StringOps$: 0
}, false, "scala.collection.immutable.StringOps$", {
  sci_StringOps$: 1,
  O: 1
});
$c_sci_StringOps$.prototype.$classData = $d_sci_StringOps$;
var $n_sci_StringOps$ = (void 0);
function $m_sci_StringOps$() {
  if ((!$n_sci_StringOps$)) {
    $n_sci_StringOps$ = new $c_sci_StringOps$().init___()
  };
  return $n_sci_StringOps$
}
function $s_sci_VectorPointer$class__gotoFreshPosWritable1__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V($$this, oldIndex);
  $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor)
}
function $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O($$this, index, xor) {
  if ((xor < 32)) {
    return $$this.display0__AO().u[(31 & index)]
  } else if ((xor < 1024)) {
    return $asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 32768)) {
    return $asArrayOf_O($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1048576)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 33554432)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1073741824)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1).u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    if (($$this.depth__I() === 1)) {
      $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display1__AO().u[0] = $$this.display0__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO()
  } else if ((xor < 32768)) {
    if (($$this.depth__I() === 2)) {
      $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display2__AO().u[0] = $$this.display1__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO()
  } else if ((xor < 1048576)) {
    if (($$this.depth__I() === 3)) {
      $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display3__AO().u[0] = $$this.display2__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO()
  } else if ((xor < 33554432)) {
    if (($$this.depth__I() === 4)) {
      $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display4__AO().u[0] = $$this.display3__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO()
  } else if ((xor < 1073741824)) {
    if (($$this.depth__I() === 5)) {
      $$this.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display5__AO().u[0] = $$this.display4__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO()
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V($$this, newIndex, xor) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var array = $$this.display5__AO();
      var index = (31 & (newIndex >> 25));
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index));
      var array$1 = $$this.display4__AO();
      var index$1 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
      var array$2 = $$this.display3__AO();
      var index$2 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2));
      var array$3 = $$this.display2__AO();
      var index$3 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
      var array$4 = $$this.display1__AO();
      var index$4 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
      break
    }
    case 4: {
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var array$5 = $$this.display4__AO();
      var index$5 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5));
      var array$6 = $$this.display3__AO();
      var index$6 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
      var array$7 = $$this.display2__AO();
      var index$7 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
      var array$8 = $$this.display1__AO();
      var index$8 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
      break
    }
    case 3: {
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var array$9 = $$this.display3__AO();
      var index$9 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9));
      var array$10 = $$this.display2__AO();
      var index$10 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
      var array$11 = $$this.display1__AO();
      var index$11 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
      break
    }
    case 2: {
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var array$12 = $$this.display2__AO();
      var index$12 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
      var array$13 = $$this.display1__AO();
      var index$13 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
      break
    }
    case 1: {
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      var array$14 = $$this.display1__AO();
      var index$14 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14));
      break
    }
    case 0: {
      var a$5 = $$this.display0__AO();
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__debug__sci_VectorPointer__V($$this) {
  return (void 0)
}
function $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V($$this, index) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO();
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 4: {
      var a$5 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      var a$6 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
      var a$7 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
      var a$8 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 3: {
      var a$9 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
      var a$10 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
      var a$11 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 2: {
      var a$12 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
      var a$13 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 1: {
      var a$14 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 0: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index) {
  var x = array.u[index];
  array.u[index] = null;
  var a = $asArrayOf_O(x, 1);
  return $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a)
}
function $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V($$this, that, depth) {
  $$this.depth$und$eq__I__V(depth);
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case (-1): {
      break
    }
    case 0: {
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 1: {
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 2: {
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 3: {
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 4: {
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 5: {
      $$this.display5$und$eq__AO__V(that.display5__AO());
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
  } else if ((xor < 32768)) {
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1048576)) {
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 33554432)) {
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1073741824)) {
    $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[0], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 32768)) {
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1048576)) {
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 33554432)) {
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1073741824)) {
      $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
function $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a) {
  if ((a === null)) {
    var this$2 = $m_s_Console$();
    var this$3 = this$2.outVar$2;
    $as_Ljava_io_PrintStream(this$3.tl$1.get__O()).println__O__V("NULL")
  };
  var b = $newArrayObject($d_O.getArrayOf(), [a.u["length"]]);
  var length = a.u["length"];
  $systemArraycopy(a, 0, b, 0, length);
  return b
}
function $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  if ((xor < 32)) {
    var a = $$this.display0__AO();
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a))
  } else if ((xor < 1024)) {
    var a$1 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    var array = $$this.display1__AO();
    var index = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index))
  } else if ((xor < 32768)) {
    var a$2 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
    var a$3 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    var array$1 = $$this.display2__AO();
    var index$1 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
    var array$2 = $$this.display1__AO();
    var index$2 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2))
  } else if ((xor < 1048576)) {
    var a$4 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
    var a$5 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
    var a$6 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    var array$3 = $$this.display3__AO();
    var index$3 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
    var array$4 = $$this.display2__AO();
    var index$4 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
    var array$5 = $$this.display1__AO();
    var index$5 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5))
  } else if ((xor < 33554432)) {
    var a$7 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
    var a$8 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
    var a$9 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
    var a$10 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    var array$6 = $$this.display4__AO();
    var index$6 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
    var array$7 = $$this.display3__AO();
    var index$7 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
    var array$8 = $$this.display2__AO();
    var index$8 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
    var array$9 = $$this.display1__AO();
    var index$9 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9))
  } else if ((xor < 1073741824)) {
    var a$11 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
    var a$12 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
    var a$13 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
    var a$14 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
    var a$15 = $$this.display5__AO();
    $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$15));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (oldIndex >> 25))] = $$this.display4__AO();
    var array$10 = $$this.display5__AO();
    var index$10 = (31 & (newIndex >> 25));
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
    var array$11 = $$this.display4__AO();
    var index$11 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
    var array$12 = $$this.display3__AO();
    var index$12 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
    var array$13 = $$this.display2__AO();
    var index$13 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
    var array$14 = $$this.display1__AO();
    var index$14 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO($$this, array, oldLeft, newLeft) {
  var elems = $newArrayObject($d_O.getArrayOf(), [32]);
  var length = ((32 - ((newLeft > oldLeft) ? newLeft : oldLeft)) | 0);
  $systemArraycopy(array, oldLeft, elems, newLeft, length);
  return elems
}
function $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      if (($$this.depth__I() === 1)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 32768)) {
      if (($$this.depth__I() === 2)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 1048576)) {
      if (($$this.depth__I() === 3)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 33554432)) {
      if (($$this.depth__I() === 4)) {
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display3__AO() === null)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else if ((xor < 1073741824)) {
      if (($$this.depth__I() === 5)) {
        $$this.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display5__AO().u[(31 & (oldIndex >> 25))] = $$this.display4__AO();
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
        $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
      };
      $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display4__AO() === null)) {
        $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (newIndex >> 20))], 1));
      if (($$this.display3__AO() === null)) {
        $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (newIndex >> 15))], 1));
      if (($$this.display2__AO() === null)) {
        $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (newIndex >> 10))], 1));
      if (($$this.display1__AO() === null)) {
        $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
      };
      $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
/** @constructor */
function $c_sci_WrappedString$() {
  $c_O.call(this)
}
$c_sci_WrappedString$.prototype = new $h_O();
$c_sci_WrappedString$.prototype.constructor = $c_sci_WrappedString$;
/** @constructor */
function $h_sci_WrappedString$() {
  /*<skip>*/
}
$h_sci_WrappedString$.prototype = $c_sci_WrappedString$.prototype;
$c_sci_WrappedString$.prototype.newBuilder__scm_Builder = (function() {
  var this$2 = new $c_scm_StringBuilder().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$2) {
      var x = $as_T(x$2);
      return new $c_sci_WrappedString().init___T(x)
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$2, f)
});
var $d_sci_WrappedString$ = new $TypeData().initClass({
  sci_WrappedString$: 0
}, false, "scala.collection.immutable.WrappedString$", {
  sci_WrappedString$: 1,
  O: 1
});
$c_sci_WrappedString$.prototype.$classData = $d_sci_WrappedString$;
var $n_sci_WrappedString$ = (void 0);
function $m_sci_WrappedString$() {
  if ((!$n_sci_WrappedString$)) {
    $n_sci_WrappedString$ = new $c_sci_WrappedString$().init___()
  };
  return $n_sci_WrappedString$
}
function $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V($$this, coll) {
  if ($is_sc_IndexedSeqLike(coll)) {
    $$this.sizeHint__I__V(coll.size__I())
  }
}
function $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V($$this, coll, delta) {
  if ($is_sc_IndexedSeqLike(coll)) {
    $$this.sizeHint__I__V(((coll.size__I() + delta) | 0))
  }
}
function $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V($$this, size, boundingColl) {
  if ($is_sc_IndexedSeqLike(boundingColl)) {
    var that = boundingColl.size__I();
    $$this.sizeHint__I__V(((size < that) ? size : that))
  }
}
/** @constructor */
function $c_scm_FlatHashTable$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$.prototype = new $h_O();
$c_scm_FlatHashTable$.prototype.constructor = $c_scm_FlatHashTable$;
/** @constructor */
function $h_scm_FlatHashTable$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$.prototype = $c_scm_FlatHashTable$.prototype;
$c_scm_FlatHashTable$.prototype.newThreshold__I__I__I = (function(_loadFactor, size) {
  var assertion = (_loadFactor < 500);
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O(("assertion failed: " + "loadFactor too large; must be < 0.5"))
  };
  return new $c_sjsr_RuntimeLong().init___I(size).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(_loadFactor)).$$div__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(1000, 0, 0)).toInt__I()
});
var $d_scm_FlatHashTable$ = new $TypeData().initClass({
  scm_FlatHashTable$: 0
}, false, "scala.collection.mutable.FlatHashTable$", {
  scm_FlatHashTable$: 1,
  O: 1
});
$c_scm_FlatHashTable$.prototype.$classData = $d_scm_FlatHashTable$;
var $n_scm_FlatHashTable$ = (void 0);
function $m_scm_FlatHashTable$() {
  if ((!$n_scm_FlatHashTable$)) {
    $n_scm_FlatHashTable$ = new $c_scm_FlatHashTable$().init___()
  };
  return $n_scm_FlatHashTable$
}
function $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed) {
  var improved = $m_s_util_hashing_package$().byteswap32__I__I(hcode);
  var rotation = (seed % 32);
  var rotated = (((improved >>> rotation) | 0) | (improved << ((32 - rotation) | 0)));
  return rotated
}
function $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O($$this, entry) {
  return ((entry === $m_scm_FlatHashTable$NullSentinel$()) ? null : entry)
}
function $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem) {
  return ((elem === null) ? $m_scm_FlatHashTable$NullSentinel$() : elem)
}
/** @constructor */
function $c_scm_FlatHashTable$NullSentinel$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$NullSentinel$.prototype = new $h_O();
$c_scm_FlatHashTable$NullSentinel$.prototype.constructor = $c_scm_FlatHashTable$NullSentinel$;
/** @constructor */
function $h_scm_FlatHashTable$NullSentinel$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$NullSentinel$.prototype = $c_scm_FlatHashTable$NullSentinel$.prototype;
$c_scm_FlatHashTable$NullSentinel$.prototype.toString__T = (function() {
  return "NullSentinel"
});
$c_scm_FlatHashTable$NullSentinel$.prototype.hashCode__I = (function() {
  return 0
});
var $d_scm_FlatHashTable$NullSentinel$ = new $TypeData().initClass({
  scm_FlatHashTable$NullSentinel$: 0
}, false, "scala.collection.mutable.FlatHashTable$NullSentinel$", {
  scm_FlatHashTable$NullSentinel$: 1,
  O: 1
});
$c_scm_FlatHashTable$NullSentinel$.prototype.$classData = $d_scm_FlatHashTable$NullSentinel$;
var $n_scm_FlatHashTable$NullSentinel$ = (void 0);
function $m_scm_FlatHashTable$NullSentinel$() {
  if ((!$n_scm_FlatHashTable$NullSentinel$)) {
    $n_scm_FlatHashTable$NullSentinel$ = new $c_scm_FlatHashTable$NullSentinel$().init___()
  };
  return $n_scm_FlatHashTable$NullSentinel$
}
function $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this) {
  var oldtable = $$this.table$5;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [$imul(2, $$this.table$5.u["length"])]);
  $$this.tableSize$5 = 0;
  var tableLength = $$this.table$5.u["length"];
  $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength);
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this);
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $$this.table$5.u["length"]);
  var i = 0;
  while ((i < oldtable.u["length"])) {
    var entry = oldtable.u[i];
    if ((entry !== null)) {
      $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, entry)
    };
    i = ((1 + i) | 0)
  }
}
function $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength) {
  return ((1 + (tableLength >> 5)) | 0)
}
function $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h) {
  if (($$this.sizemap$5 !== null)) {
    var p = (h >> 5);
    var ev$1 = $$this.sizemap$5;
    ev$1.u[p] = ((1 + ev$1.u[p]) | 0)
  }
}
function $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V($$this) {
  $$this.$$undloadFactor$5 = 450;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [$s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32)]);
  $$this.tableSize$5 = 0;
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32));
  $$this.sizemap$5 = null;
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this)
}
function $s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) {
  var searchEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  var hcode = $objectHashCode(searchEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while (((curEntry !== null) && (!$m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, searchEntry)))) {
    h = (((1 + h) | 0) % $$this.table$5.u["length"]);
    curEntry = $$this.table$5.u[h]
  };
  return curEntry
}
function $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry) {
  var hcode = $objectHashCode(newEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while ((curEntry !== null)) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, newEntry)) {
      return false
    };
    h = (((1 + h) | 0) % $$this.table$5.u["length"]);
    curEntry = $$this.table$5.u[h]
  };
  $$this.table$5.u[h] = newEntry;
  $$this.tableSize$5 = ((1 + $$this.tableSize$5) | 0);
  var h$1 = h;
  $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h$1);
  if (($$this.tableSize$5 >= $$this.threshold$5)) {
    $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this)
  };
  return true
}
function $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z($$this, elem) {
  var newEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  return $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry)
}
function $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode) {
  var seed = $$this.seedvalue$5;
  var improved = $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed);
  var ones = (((-1) + $$this.table$5.u["length"]) | 0);
  return (((improved >>> ((32 - $m_jl_Integer$().bitCount__I__I(ones)) | 0)) | 0) & ones)
}
function $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, expectedSize) {
  return ((expectedSize === 0) ? 1 : $m_scm_HashTable$().powerOfTwo__I__I(expectedSize))
}
function $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this) {
  return $m_jl_Integer$().bitCount__I__I((((-1) + $$this.table$5.u["length"]) | 0))
}
function $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength) {
  if (($$this.sizemap$5 !== null)) {
    var nsize = $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength);
    if (($$this.sizemap$5.u["length"] !== nsize)) {
      $$this.sizemap$5 = $newArrayObject($d_I.getArrayOf(), [nsize])
    } else {
      $m_ju_Arrays$().fill__AI__I__V($$this.sizemap$5, 0)
    }
  }
}
function $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V($$this, c) {
  if ((c !== null)) {
    $$this.$$undloadFactor$5 = c.loadFactor__I();
    $$this.table$5 = c.table__AO();
    $$this.tableSize$5 = c.tableSize__I();
    $$this.threshold$5 = c.threshold__I();
    $$this.seedvalue$5 = c.seedvalue__I();
    $$this.sizemap$5 = c.sizemap__AI()
  }
}
function $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z($$this, elem) {
  return ($s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) !== null)
}
/** @constructor */
function $c_scm_HashTable$() {
  $c_O.call(this)
}
$c_scm_HashTable$.prototype = new $h_O();
$c_scm_HashTable$.prototype.constructor = $c_scm_HashTable$;
/** @constructor */
function $h_scm_HashTable$() {
  /*<skip>*/
}
$h_scm_HashTable$.prototype = $c_scm_HashTable$.prototype;
$c_scm_HashTable$.prototype.powerOfTwo__I__I = (function(target) {
  var c = (((-1) + target) | 0);
  c = (c | ((c >>> 1) | 0));
  c = (c | ((c >>> 2) | 0));
  c = (c | ((c >>> 4) | 0));
  c = (c | ((c >>> 8) | 0));
  c = (c | ((c >>> 16) | 0));
  return ((1 + c) | 0)
});
var $d_scm_HashTable$ = new $TypeData().initClass({
  scm_HashTable$: 0
}, false, "scala.collection.mutable.HashTable$", {
  scm_HashTable$: 1,
  O: 1
});
$c_scm_HashTable$.prototype.$classData = $d_scm_HashTable$;
var $n_scm_HashTable$ = (void 0);
function $m_scm_HashTable$() {
  if ((!$n_scm_HashTable$)) {
    $n_scm_HashTable$ = new $c_scm_HashTable$().init___()
  };
  return $n_scm_HashTable$
}
function $s_scm_LinkedListLike$class__isEmpty__scm_LinkedListLike__Z($$this) {
  return ($$this.next$5 === $$this)
}
function $s_scm_LinkedListLike$class__apply__scm_LinkedListLike__I__O($$this, n) {
  var loc = $s_scm_LinkedListLike$class__drop__scm_LinkedListLike__I__scm_Seq($$this, n);
  if (loc.nonEmpty__Z()) {
    return $as_scm_LinkedListLike(loc).elem$5
  } else {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  }
}
function $s_scm_LinkedListLike$class__length0__p0__scm_LinkedListLike__scm_Seq__I__I($$this, elem, acc) {
  _length0: while (true) {
    var this$1 = $as_scm_LinkedListLike(elem);
    if ($s_scm_LinkedListLike$class__isEmpty__scm_LinkedListLike__Z(this$1)) {
      return acc
    } else {
      var temp$elem = $as_scm_LinkedListLike(elem).next$5;
      var temp$acc = ((1 + acc) | 0);
      elem = temp$elem;
      acc = temp$acc;
      continue _length0
    }
  }
}
function $s_scm_LinkedListLike$class__tail__scm_LinkedListLike__scm_Seq($$this) {
  var requirement = $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z($$this);
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T(("requirement failed: " + "tail of empty list"))
  };
  return $$this.next$5
}
function $s_scm_LinkedListLike$class__drop__scm_LinkedListLike__I__scm_Seq($$this, n) {
  var i = 0;
  var these = $as_scm_Seq($$this);
  while (true) {
    if ((i < n)) {
      var this$1 = $as_scm_LinkedListLike(these);
      var jsx$1 = (!$s_scm_LinkedListLike$class__isEmpty__scm_LinkedListLike__Z(this$1))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      these = $as_scm_LinkedListLike(these).next$5;
      i = ((1 + i) | 0)
    } else {
      break
    }
  };
  return these
}
function $s_scm_LinkedListLike$class__foreach__scm_LinkedListLike__F1__V($$this, f) {
  var these = $$this;
  while (true) {
    var this$1 = these;
    if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
      f.apply__O__O(these.elem$5);
      these = $as_scm_LinkedListLike(these.next$5)
    } else {
      break
    }
  }
}
function $s_scm_LinkedListLike$class__head__scm_LinkedListLike__O($$this) {
  if ($s_scm_LinkedListLike$class__isEmpty__scm_LinkedListLike__Z($$this)) {
    throw new $c_ju_NoSuchElementException().init___()
  } else {
    return $$this.elem$5
  }
}
function $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V($$this, xs, start, len) {
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var $$this$1 = ((len < that) ? len : that);
  var that$1 = $$this.size0$6;
  var len1 = (($$this$1 < that$1) ? $$this$1 : that$1);
  $m_s_Array$().copy__O__I__O__I__I__V($$this.array$6, 0, xs, start, len1)
}
function $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V($$this, n) {
  var x = $$this.array$6.u["length"];
  var arrayLength = new $c_sjsr_RuntimeLong().init___I(x);
  if (new $c_sjsr_RuntimeLong().init___I(n).$$greater__sjsr_RuntimeLong__Z(arrayLength)) {
    var newSize = new $c_sjsr_RuntimeLong().init___I__I__I(2, 0, 0).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(arrayLength);
    while (new $c_sjsr_RuntimeLong().init___I(n).$$greater__sjsr_RuntimeLong__Z(newSize)) {
      newSize = new $c_sjsr_RuntimeLong().init___I__I__I(2, 0, 0).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(newSize)
    };
    if (newSize.$$greater__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0))) {
      newSize = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0)
    };
    var newArray = $newArrayObject($d_O.getArrayOf(), [newSize.toInt__I()]);
    var src = $$this.array$6;
    var length = $$this.size0$6;
    $systemArraycopy(src, 0, newArray, 0, length);
    $$this.array$6 = newArray
  }
}
function $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V($$this, f) {
  var i = 0;
  var top = $$this.size0$6;
  while ((i < top)) {
    f.apply__O__O($$this.array$6.u[i]);
    i = ((1 + i) | 0)
  }
}
function $s_scm_ResizableArray$class__update__scm_ResizableArray__I__O__V($$this, idx, elem) {
  if ((idx >= $$this.size0$6)) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  };
  $$this.array$6.u[idx] = elem
}
function $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O($$this, idx) {
  if ((idx >= $$this.size0$6)) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  };
  return $$this.array$6.u[idx]
}
function $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V($$this, sz) {
  $m_s_Predef$().require__Z__V((sz <= $$this.size0$6));
  while (($$this.size0$6 > sz)) {
    $$this.size0$6 = (((-1) + $$this.size0$6) | 0);
    $$this.array$6.u[$$this.size0$6] = null
  }
}
function $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V($$this) {
  var x = $$this.initialSize$6;
  $$this.array$6 = $newArrayObject($d_O.getArrayOf(), [((x > 1) ? x : 1)]);
  $$this.size0$6 = 0
}
/** @constructor */
function $c_sjsr_Bits$() {
  $c_O.call(this);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = false;
  this.arrayBuffer$1 = null;
  this.int32Array$1 = null;
  this.float32Array$1 = null;
  this.float64Array$1 = null;
  this.areTypedArraysBigEndian$1 = false;
  this.highOffset$1 = 0;
  this.lowOffset$1 = 0
}
$c_sjsr_Bits$.prototype = new $h_O();
$c_sjsr_Bits$.prototype.constructor = $c_sjsr_Bits$;
/** @constructor */
function $h_sjsr_Bits$() {
  /*<skip>*/
}
$h_sjsr_Bits$.prototype = $c_sjsr_Bits$.prototype;
$c_sjsr_Bits$.prototype.init___ = (function() {
  $n_sjsr_Bits$ = this;
  var x = ((($g["ArrayBuffer"] && $g["Int32Array"]) && $g["Float32Array"]) && $g["Float64Array"]);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = $uZ((!(!x)));
  this.arrayBuffer$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["ArrayBuffer"](8) : null);
  this.int32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Int32Array"](this.arrayBuffer$1, 0, 2) : null);
  this.float32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Float32Array"](this.arrayBuffer$1, 0, 2) : null);
  this.float64Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g["Float64Array"](this.arrayBuffer$1, 0, 1) : null);
  if ((!this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f)) {
    var jsx$1 = true
  } else {
    this.int32Array$1[0] = 16909060;
    var jsx$1 = ($uB(new $g["Int8Array"](this.arrayBuffer$1, 0, 8)[0]) === 1)
  };
  this.areTypedArraysBigEndian$1 = jsx$1;
  this.highOffset$1 = (this.areTypedArraysBigEndian$1 ? 0 : 1);
  this.lowOffset$1 = (this.areTypedArraysBigEndian$1 ? 1 : 0);
  return this
});
$c_sjsr_Bits$.prototype.numberHashCode__D__I = (function(value) {
  var iv = $uI((value | 0));
  if (((iv === value) && ((1.0 / value) !== (-Infinity)))) {
    return iv
  } else {
    var this$1 = this.doubleToLongBits__D__J(value);
    return this$1.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(this$1.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I()
  }
});
$c_sjsr_Bits$.prototype.doubleToLongBitsPolyfill__p1__D__J = (function(value) {
  if ((value !== value)) {
    var _3 = $uD($g["Math"]["pow"](2.0, 51));
    var x1_$_$$und1$1 = false;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = _3
  } else if (((value === Infinity) || (value === (-Infinity)))) {
    var _1 = (value < 0);
    var x1_$_$$und1$1 = _1;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = 0.0
  } else if ((value === 0.0)) {
    var _1$1 = ((1 / value) === (-Infinity));
    var x1_$_$$und1$1 = _1$1;
    var x1_$_$$und2$1 = 0;
    var x1_$_$$und3$1 = 0.0
  } else {
    var s = (value < 0);
    var av = (s ? (-value) : value);
    if ((av >= $uD($g["Math"]["pow"](2.0, (-1022))))) {
      var twoPowFbits = $uD($g["Math"]["pow"](2.0, 52));
      var a = ($uD($g["Math"]["log"](av)) / 0.6931471805599453);
      var x = $uD($g["Math"]["floor"](a));
      var a$1 = $uI((x | 0));
      var e = ((a$1 < 1023) ? a$1 : 1023);
      var b = e;
      var n = ((av / $uD($g["Math"]["pow"](2.0, b))) * twoPowFbits);
      var w = $uD($g["Math"]["floor"](n));
      var f = (n - w);
      var f$1 = ((f < 0.5) ? w : ((f > 0.5) ? (1 + w) : (((w % 2) !== 0) ? (1 + w) : w)));
      if (((f$1 / twoPowFbits) >= 2)) {
        e = ((1 + e) | 0);
        f$1 = 1.0
      };
      if ((e > 1023)) {
        e = 2047;
        f$1 = 0.0
      } else {
        e = ((1023 + e) | 0);
        f$1 = (f$1 - twoPowFbits)
      };
      var _2 = e;
      var _3$1 = f$1;
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = _2;
      var x1_$_$$und3$1 = _3$1
    } else {
      var n$1 = (av / $uD($g["Math"]["pow"](2.0, (-1074))));
      var w$1 = $uD($g["Math"]["floor"](n$1));
      var f$2 = (n$1 - w$1);
      var _3$2 = ((f$2 < 0.5) ? w$1 : ((f$2 > 0.5) ? (1 + w$1) : (((w$1 % 2) !== 0) ? (1 + w$1) : w$1)));
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = 0;
      var x1_$_$$und3$1 = _3$2
    }
  };
  var s$1 = $uZ(x1_$_$$und1$1);
  var e$1 = $uI(x1_$_$$und2$1);
  var f$3 = $uD(x1_$_$$und3$1);
  var x$1 = (f$3 / 4.294967296E9);
  var hif = $uI((x$1 | 0));
  var hi = (((s$1 ? (-2147483648) : 0) | (e$1 << 20)) | hif);
  var lo = $uI((f$3 | 0));
  return new $c_sjsr_RuntimeLong().init___I(hi).$$less$less__I__sjsr_RuntimeLong(32).$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 1023, 0).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(lo)))
});
$c_sjsr_Bits$.prototype.doubleToLongBits__D__J = (function(value) {
  if (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f) {
    this.float64Array$1[0] = value;
    return new $c_sjsr_RuntimeLong().init___I($uI(this.int32Array$1[this.highOffset$1])).$$less$less__I__sjsr_RuntimeLong(32).$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 1023, 0).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I($uI(this.int32Array$1[this.lowOffset$1]))))
  } else {
    return this.doubleToLongBitsPolyfill__p1__D__J(value)
  }
});
var $d_sjsr_Bits$ = new $TypeData().initClass({
  sjsr_Bits$: 0
}, false, "scala.scalajs.runtime.Bits$", {
  sjsr_Bits$: 1,
  O: 1
});
$c_sjsr_Bits$.prototype.$classData = $d_sjsr_Bits$;
var $n_sjsr_Bits$ = (void 0);
function $m_sjsr_Bits$() {
  if ((!$n_sjsr_Bits$)) {
    $n_sjsr_Bits$ = new $c_sjsr_Bits$().init___()
  };
  return $n_sjsr_Bits$
}
/** @constructor */
function $c_sjsr_RuntimeString$() {
  $c_O.call(this);
  this.CASE$undINSENSITIVE$undORDER$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_RuntimeString$.prototype = new $h_O();
$c_sjsr_RuntimeString$.prototype.constructor = $c_sjsr_RuntimeString$;
/** @constructor */
function $h_sjsr_RuntimeString$() {
  /*<skip>*/
}
$h_sjsr_RuntimeString$.prototype = $c_sjsr_RuntimeString$.prototype;
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I__I = (function(thiz, ch, fromIndex) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["indexOf"](str, fromIndex))
});
$c_sjsr_RuntimeString$.prototype.valueOf__C__T = (function(value) {
  return $as_T($g["String"]["fromCharCode"](value))
});
$c_sjsr_RuntimeString$.prototype.valueOf__O__T = (function(value) {
  return ((value === null) ? "null" : $objectToString(value))
});
$c_sjsr_RuntimeString$.prototype.lastIndexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["lastIndexOf"](str))
});
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz["indexOf"](str))
});
$c_sjsr_RuntimeString$.prototype.hashCode__T__I = (function(thiz) {
  var res = 0;
  var mul = 1;
  var i = (((-1) + $uI(thiz["length"])) | 0);
  while ((i >= 0)) {
    var jsx$1 = res;
    var index = i;
    res = ((jsx$1 + $imul((65535 & $uI(thiz["charCodeAt"](index))), mul)) | 0);
    mul = $imul(31, mul);
    i = (((-1) + i) | 0)
  };
  return res
});
$c_sjsr_RuntimeString$.prototype.fromCodePoint__p1__I__T = (function(codePoint) {
  if ((((-65536) & codePoint) === 0)) {
    var array = [codePoint];
    var jsx$2 = $g["String"];
    var jsx$1 = jsx$2["fromCharCode"]["apply"](jsx$2, array);
    return $as_T(jsx$1)
  } else if (((codePoint < 0) || (codePoint > 1114111))) {
    throw new $c_jl_IllegalArgumentException().init___()
  } else {
    var offsetCp = (((-65536) + codePoint) | 0);
    var array$1 = [(55296 | (offsetCp >> 10)), (56320 | (1023 & offsetCp))];
    var jsx$4 = $g["String"];
    var jsx$3 = jsx$4["fromCharCode"]["apply"](jsx$4, array$1);
    return $as_T(jsx$3)
  }
});
$c_sjsr_RuntimeString$.prototype.format__T__AO__T = (function(format, args) {
  var frm = new $c_ju_Formatter().init___();
  var this$1 = frm.format__T__AO__ju_Formatter(format, args);
  var res = this$1.out__jl_Appendable().toString__T();
  frm.close__V();
  return res
});
var $d_sjsr_RuntimeString$ = new $TypeData().initClass({
  sjsr_RuntimeString$: 0
}, false, "scala.scalajs.runtime.RuntimeString$", {
  sjsr_RuntimeString$: 1,
  O: 1
});
$c_sjsr_RuntimeString$.prototype.$classData = $d_sjsr_RuntimeString$;
var $n_sjsr_RuntimeString$ = (void 0);
function $m_sjsr_RuntimeString$() {
  if ((!$n_sjsr_RuntimeString$)) {
    $n_sjsr_RuntimeString$ = new $c_sjsr_RuntimeString$().init___()
  };
  return $n_sjsr_RuntimeString$
}
/** @constructor */
function $c_sjsr_StackTrace$() {
  $c_O.call(this);
  this.isRhino$1 = false;
  this.decompressedClasses$1 = null;
  this.decompressedPrefixes$1 = null;
  this.compressedPrefixes$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_StackTrace$.prototype = new $h_O();
$c_sjsr_StackTrace$.prototype.constructor = $c_sjsr_StackTrace$;
/** @constructor */
function $h_sjsr_StackTrace$() {
  /*<skip>*/
}
$h_sjsr_StackTrace$.prototype = $c_sjsr_StackTrace$.prototype;
$c_sjsr_StackTrace$.prototype.init___ = (function() {
  $n_sjsr_StackTrace$ = this;
  var dict = {
    "O": "java_lang_Object",
    "T": "java_lang_String",
    "V": "scala_Unit",
    "Z": "scala_Boolean",
    "C": "scala_Char",
    "B": "scala_Byte",
    "S": "scala_Short",
    "I": "scala_Int",
    "J": "scala_Long",
    "F": "scala_Float",
    "D": "scala_Double"
  };
  var index = 0;
  while ((index <= 22)) {
    if ((index >= 2)) {
      dict[("T" + index)] = ("scala_Tuple" + index)
    };
    dict[("F" + index)] = ("scala_Function" + index);
    index = ((1 + index) | 0)
  };
  this.decompressedClasses$1 = dict;
  this.decompressedPrefixes$1 = {
    "sjsr_": "scala_scalajs_runtime_",
    "sjs_": "scala_scalajs_",
    "sci_": "scala_collection_immutable_",
    "scm_": "scala_collection_mutable_",
    "scg_": "scala_collection_generic_",
    "sc_": "scala_collection_",
    "sr_": "scala_runtime_",
    "s_": "scala_",
    "jl_": "java_lang_",
    "ju_": "java_util_"
  };
  this.compressedPrefixes$1 = $g["Object"]["keys"](this.decompressedPrefixes$1);
  return this
});
$c_sjsr_StackTrace$.prototype.createException__p1__O = (function() {
  try {
    return this["undef"]()
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      if ($is_sjs_js_JavaScriptException(e$2)) {
        var x5 = $as_sjs_js_JavaScriptException(e$2);
        var e$3 = x5.exception$4;
        return e$3
      } else {
        throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
      }
    } else {
      throw e
    }
  }
});
$c_sjsr_StackTrace$.prototype.captureState__jl_Throwable__O__V = (function(throwable, e) {
  throwable["stackdata"] = e
});
var $d_sjsr_StackTrace$ = new $TypeData().initClass({
  sjsr_StackTrace$: 0
}, false, "scala.scalajs.runtime.StackTrace$", {
  sjsr_StackTrace$: 1,
  O: 1
});
$c_sjsr_StackTrace$.prototype.$classData = $d_sjsr_StackTrace$;
var $n_sjsr_StackTrace$ = (void 0);
function $m_sjsr_StackTrace$() {
  if ((!$n_sjsr_StackTrace$)) {
    $n_sjsr_StackTrace$ = new $c_sjsr_StackTrace$().init___()
  };
  return $n_sjsr_StackTrace$
}
/** @constructor */
function $c_sjsr_package$() {
  $c_O.call(this)
}
$c_sjsr_package$.prototype = new $h_O();
$c_sjsr_package$.prototype.constructor = $c_sjsr_package$;
/** @constructor */
function $h_sjsr_package$() {
  /*<skip>*/
}
$h_sjsr_package$.prototype = $c_sjsr_package$.prototype;
$c_sjsr_package$.prototype.unwrapJavaScriptException__jl_Throwable__O = (function(th) {
  if ($is_sjs_js_JavaScriptException(th)) {
    var x2 = $as_sjs_js_JavaScriptException(th);
    var e = x2.exception$4;
    return e
  } else {
    return th
  }
});
$c_sjsr_package$.prototype.wrapJavaScriptException__O__jl_Throwable = (function(e) {
  if ($is_jl_Throwable(e)) {
    var x2 = $as_jl_Throwable(e);
    return x2
  } else {
    return new $c_sjs_js_JavaScriptException().init___O(e)
  }
});
var $d_sjsr_package$ = new $TypeData().initClass({
  sjsr_package$: 0
}, false, "scala.scalajs.runtime.package$", {
  sjsr_package$: 1,
  O: 1
});
$c_sjsr_package$.prototype.$classData = $d_sjsr_package$;
var $n_sjsr_package$ = (void 0);
function $m_sjsr_package$() {
  if ((!$n_sjsr_package$)) {
    $n_sjsr_package$ = new $c_sjsr_package$().init___()
  };
  return $n_sjsr_package$
}
function $isArrayOf_sr_BoxedUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_BoxedUnit)))
}
function $asArrayOf_sr_BoxedUnit(obj, depth) {
  return (($isArrayOf_sr_BoxedUnit(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.BoxedUnit;", depth))
}
var $d_sr_BoxedUnit = new $TypeData().initClass({
  sr_BoxedUnit: 0
}, false, "scala.runtime.BoxedUnit", {
  sr_BoxedUnit: 1,
  O: 1
}, (void 0), (void 0), (function(x) {
  return (x === (void 0))
}));
/** @constructor */
function $c_sr_BoxesRunTime$() {
  $c_O.call(this)
}
$c_sr_BoxesRunTime$.prototype = new $h_O();
$c_sr_BoxesRunTime$.prototype.constructor = $c_sr_BoxesRunTime$;
/** @constructor */
function $h_sr_BoxesRunTime$() {
  /*<skip>*/
}
$h_sr_BoxesRunTime$.prototype = $c_sr_BoxesRunTime$.prototype;
$c_sr_BoxesRunTime$.prototype.equalsCharObject__jl_Character__O__Z = (function(xc, y) {
  if ($is_jl_Character(y)) {
    var x2 = $as_jl_Character(y);
    return (xc.value$1 === x2.value$1)
  } else if ($is_jl_Number(y)) {
    var x3 = $as_jl_Number(y);
    if (((typeof x3) === "number")) {
      var x2$1 = $uD(x3);
      return (x2$1 === xc.value$1)
    } else if ($is_sjsr_RuntimeLong(x3)) {
      var x3$1 = $uJ(x3);
      return x3$1.equals__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I(xc.value$1))
    } else {
      return ((x3 === null) ? (xc === null) : $objectEquals(x3, xc))
    }
  } else {
    return ((xc === null) && (y === null))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumObject__jl_Number__O__Z = (function(xn, y) {
  if ($is_jl_Number(y)) {
    var x2 = $as_jl_Number(y);
    return this.equalsNumNum__jl_Number__jl_Number__Z(xn, x2)
  } else if ($is_jl_Character(y)) {
    var x3 = $as_jl_Character(y);
    if (((typeof xn) === "number")) {
      var x2$1 = $uD(xn);
      return (x2$1 === x3.value$1)
    } else if ($is_sjsr_RuntimeLong(xn)) {
      var x3$1 = $uJ(xn);
      return x3$1.equals__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I(x3.value$1))
    } else {
      return ((xn === null) ? (x3 === null) : $objectEquals(xn, x3))
    }
  } else {
    return ((xn === null) ? (y === null) : $objectEquals(xn, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equals__O__O__Z = (function(x, y) {
  if ((x === y)) {
    return true
  } else if ($is_jl_Number(x)) {
    var x2 = $as_jl_Number(x);
    return this.equalsNumObject__jl_Number__O__Z(x2, y)
  } else if ($is_jl_Character(x)) {
    var x3 = $as_jl_Character(x);
    return this.equalsCharObject__jl_Character__O__Z(x3, y)
  } else {
    return ((x === null) ? (y === null) : $objectEquals(x, y))
  }
});
$c_sr_BoxesRunTime$.prototype.hashFromLong__jl_Long__I = (function(n) {
  var iv = $uJ(n).toInt__I();
  return (new $c_sjsr_RuntimeLong().init___I(iv).equals__sjsr_RuntimeLong__Z($uJ(n)) ? iv : $uJ(n).$$up__sjsr_RuntimeLong__sjsr_RuntimeLong($uJ(n).$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I())
});
$c_sr_BoxesRunTime$.prototype.hashFromNumber__jl_Number__I = (function(n) {
  if ($isInt(n)) {
    var x2 = $uI(n);
    return x2
  } else if ($is_sjsr_RuntimeLong(n)) {
    var x3 = $as_sjsr_RuntimeLong(n);
    return this.hashFromLong__jl_Long__I(x3)
  } else if (((typeof n) === "number")) {
    var x4 = $asDouble(n);
    return this.hashFromDouble__jl_Double__I(x4)
  } else {
    return $objectHashCode(n)
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumNum__jl_Number__jl_Number__Z = (function(xn, yn) {
  if (((typeof xn) === "number")) {
    var x2 = $uD(xn);
    if (((typeof yn) === "number")) {
      var x2$2 = $uD(yn);
      return (x2 === x2$2)
    } else if ($is_sjsr_RuntimeLong(yn)) {
      var x3 = $uJ(yn);
      return (x2 === x3.toDouble__D())
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4 = $as_s_math_ScalaNumber(yn);
      return x4.equals__O__Z(x2)
    } else {
      return false
    }
  } else if ($is_sjsr_RuntimeLong(xn)) {
    var x3$2 = $uJ(xn);
    if ($is_sjsr_RuntimeLong(yn)) {
      var x2$3 = $uJ(yn);
      return x3$2.equals__sjsr_RuntimeLong__Z(x2$3)
    } else if (((typeof yn) === "number")) {
      var x3$3 = $uD(yn);
      return (x3$2.toDouble__D() === x3$3)
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4$2 = $as_s_math_ScalaNumber(yn);
      return x4$2.equals__O__Z(x3$2)
    } else {
      return false
    }
  } else {
    return ((xn === null) ? (yn === null) : $objectEquals(xn, yn))
  }
});
$c_sr_BoxesRunTime$.prototype.hashFromDouble__jl_Double__I = (function(n) {
  var iv = $doubleToInt($uD(n));
  var dv = $uD(n);
  if ((iv === dv)) {
    return iv
  } else {
    var lv = $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong($uD(n));
    return ((lv.toDouble__D() === dv) ? lv.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(lv.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I() : $m_sjsr_Bits$().numberHashCode__D__I($uD(n)))
  }
});
var $d_sr_BoxesRunTime$ = new $TypeData().initClass({
  sr_BoxesRunTime$: 0
}, false, "scala.runtime.BoxesRunTime$", {
  sr_BoxesRunTime$: 1,
  O: 1
});
$c_sr_BoxesRunTime$.prototype.$classData = $d_sr_BoxesRunTime$;
var $n_sr_BoxesRunTime$ = (void 0);
function $m_sr_BoxesRunTime$() {
  if ((!$n_sr_BoxesRunTime$)) {
    $n_sr_BoxesRunTime$ = new $c_sr_BoxesRunTime$().init___()
  };
  return $n_sr_BoxesRunTime$
}
var $d_sr_Null$ = new $TypeData().initClass({
  sr_Null$: 0
}, false, "scala.runtime.Null$", {
  sr_Null$: 1,
  O: 1
});
/** @constructor */
function $c_sr_ScalaRunTime$() {
  $c_O.call(this)
}
$c_sr_ScalaRunTime$.prototype = new $h_O();
$c_sr_ScalaRunTime$.prototype.constructor = $c_sr_ScalaRunTime$;
/** @constructor */
function $h_sr_ScalaRunTime$() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$.prototype = $c_sr_ScalaRunTime$.prototype;
$c_sr_ScalaRunTime$.prototype.array$undlength__O__I = (function(xs) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u["length"]
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u["length"]
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u["length"]
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u["length"]
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u["length"]
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    return x7.u["length"]
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u["length"]
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u["length"]
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u["length"]
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u["length"]
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.hash__O__I = (function(x) {
  return ((x === null) ? 0 : ($is_jl_Number(x) ? $m_sr_BoxesRunTime$().hashFromNumber__jl_Number__I($as_jl_Number(x)) : $objectHashCode(x)))
});
$c_sr_ScalaRunTime$.prototype.array$undupdate__O__I__O__V = (function(xs, idx, value) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    x2.u[idx] = value
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    x3.u[idx] = $uI(value)
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    x4.u[idx] = $uD(value)
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    x5.u[idx] = $uJ(value)
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    x6.u[idx] = $uF(value)
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    if ((value === null)) {
      var jsx$1 = 0
    } else {
      var this$2 = $as_jl_Character(value);
      var jsx$1 = this$2.value$1
    };
    x7.u[idx] = jsx$1
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    x8.u[idx] = $uB(value)
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    x9.u[idx] = $uS(value)
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    x10.u[idx] = $uZ(value)
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    x11.u[idx] = $asUnit(value)
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.$$undtoString__s_Product__T = (function(x) {
  var this$1 = x.productIterator__sc_Iterator();
  var start = (x.productPrefix__T() + "(");
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, ",", ")")
});
$c_sr_ScalaRunTime$.prototype.array$undapply__O__I__O = (function(xs, idx) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u[idx]
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u[idx]
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u[idx]
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u[idx]
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u[idx]
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    var c = x7.u[idx];
    return new $c_jl_Character().init___C(c)
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u[idx]
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u[idx]
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u[idx]
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u[idx]
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
var $d_sr_ScalaRunTime$ = new $TypeData().initClass({
  sr_ScalaRunTime$: 0
}, false, "scala.runtime.ScalaRunTime$", {
  sr_ScalaRunTime$: 1,
  O: 1
});
$c_sr_ScalaRunTime$.prototype.$classData = $d_sr_ScalaRunTime$;
var $n_sr_ScalaRunTime$ = (void 0);
function $m_sr_ScalaRunTime$() {
  if ((!$n_sr_ScalaRunTime$)) {
    $n_sr_ScalaRunTime$ = new $c_sr_ScalaRunTime$().init___()
  };
  return $n_sr_ScalaRunTime$
}
/** @constructor */
function $c_sr_Statics$() {
  $c_O.call(this)
}
$c_sr_Statics$.prototype = new $h_O();
$c_sr_Statics$.prototype.constructor = $c_sr_Statics$;
/** @constructor */
function $h_sr_Statics$() {
  /*<skip>*/
}
$h_sr_Statics$.prototype = $c_sr_Statics$.prototype;
$c_sr_Statics$.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  k = $m_jl_Integer$().rotateLeft__I__I__I(k, 15);
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_sr_Statics$.prototype.floatHash__F__I = (function(fv) {
  return $doubleToInt(fv)
});
$c_sr_Statics$.prototype.doubleHash__D__I = (function(dv) {
  return $doubleToInt(dv)
});
$c_sr_Statics$.prototype.anyHash__O__I = (function(x) {
  if ((x === null)) {
    return 0
  } else if ($is_sjsr_RuntimeLong(x)) {
    var x3 = $uJ(x);
    return this.longHash__J__I(x3)
  } else if (((typeof x) === "number")) {
    var x4 = $uD(x);
    return this.doubleHash__D__I(x4)
  } else if ($isFloat(x)) {
    var x5 = $uF(x);
    return this.floatHash__F__I(x5)
  } else {
    return $objectHashCode(x)
  }
});
$c_sr_Statics$.prototype.avalanche__I__I = (function(h0) {
  var h = h0;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_sr_Statics$.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  h = $m_jl_Integer$().rotateLeft__I__I__I(h, 13);
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_sr_Statics$.prototype.longHash__J__I = (function(lv) {
  return lv.toInt__I()
});
$c_sr_Statics$.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__I__I((hash ^ length))
});
var $d_sr_Statics$ = new $TypeData().initClass({
  sr_Statics$: 0
}, false, "scala.runtime.Statics$", {
  sr_Statics$: 1,
  O: 1
});
$c_sr_Statics$.prototype.$classData = $d_sr_Statics$;
var $n_sr_Statics$ = (void 0);
function $m_sr_Statics$() {
  if ((!$n_sr_Statics$)) {
    $n_sr_Statics$ = new $c_sr_Statics$().init___()
  };
  return $n_sr_Statics$
}
/** @constructor */
function $c_Lexample_ActiveInactiveImage() {
  $c_Lexample_RenderObject.call(this);
  this.active$2 = null;
  this.inactive$2 = null;
  this.click$2 = null;
  this.isActive$2 = false
}
$c_Lexample_ActiveInactiveImage.prototype = new $h_Lexample_RenderObject();
$c_Lexample_ActiveInactiveImage.prototype.constructor = $c_Lexample_ActiveInactiveImage;
/** @constructor */
function $h_Lexample_ActiveInactiveImage() {
  /*<skip>*/
}
$h_Lexample_ActiveInactiveImage.prototype = $c_Lexample_ActiveInactiveImage.prototype;
$c_Lexample_ActiveInactiveImage.prototype.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V = (function(x, y, width, height, ctx) {
  if (this.isActive$2) {
    this.active$2.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(x, y, width, height, ctx)
  } else {
    this.inactive$2.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(x, y, width, height, ctx)
  }
});
$c_Lexample_ActiveInactiveImage.prototype.onClick__D__D__V = (function(x, y) {
  if ((!this.isActive$2)) {
    var this$1 = this.click$2;
    this$1.apply__O__O__O(x, y);
    this.isActive$2 = true
  }
});
$c_Lexample_ActiveInactiveImage.prototype.init___Lexample_RenderObject__Lexample_RenderObject__F2 = (function(active, inactive, click) {
  this.active$2 = active;
  this.inactive$2 = inactive;
  this.click$2 = click;
  $c_Lexample_RenderObject.prototype.init___.call(this);
  this.isActive$2 = false;
  return this
});
function $is_Lexample_ActiveInactiveImage(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_ActiveInactiveImage)))
}
function $as_Lexample_ActiveInactiveImage(obj) {
  return (($is_Lexample_ActiveInactiveImage(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.ActiveInactiveImage"))
}
function $isArrayOf_Lexample_ActiveInactiveImage(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_ActiveInactiveImage)))
}
function $asArrayOf_Lexample_ActiveInactiveImage(obj, depth) {
  return (($isArrayOf_Lexample_ActiveInactiveImage(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.ActiveInactiveImage;", depth))
}
var $d_Lexample_ActiveInactiveImage = new $TypeData().initClass({
  Lexample_ActiveInactiveImage: 0
}, false, "example.ActiveInactiveImage", {
  Lexample_ActiveInactiveImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_ActiveInactiveImage.prototype.$classData = $d_Lexample_ActiveInactiveImage;
/** @constructor */
function $c_Lexample_Container() {
  $c_Lexample_RenderObject.call(this);
  this.log$2 = null;
  this.children$2 = null
}
$c_Lexample_Container.prototype = new $h_Lexample_RenderObject();
$c_Lexample_Container.prototype.constructor = $c_Lexample_Container;
/** @constructor */
function $h_Lexample_Container() {
  /*<skip>*/
}
$h_Lexample_Container.prototype = $c_Lexample_Container.prototype;
$c_Lexample_Container.prototype.init___ = (function() {
  $c_Lexample_RenderObject.prototype.init___.call(this);
  this.log$2 = new $c_Lexample_Logger().init___O(this);
  this.children$2 = new $c_scm_ArrayBuffer().init___();
  return this
});
$c_Lexample_Container.prototype.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V = (function(x, y, width, height, ctx) {
  var this$1 = this.children$2;
  var i = 0;
  var top = this$1.size0$6;
  while ((i < top)) {
    var arg1 = this$1.array$6.u[i];
    var child = $as_Lexample_ChildObject(arg1);
    var nX = ((child.pX$1 * width) + x);
    var nY = ((child.pY$1 * height) + y);
    var nW = (child.pW$1 * width);
    var nH = (child.pH$1 * height);
    child.renderObject$1.render__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(nX, nY, nW, nH, ctx);
    i = ((1 + i) | 0)
  };
  ctx["stroke"]()
});
$c_Lexample_Container.prototype.onClick__D__D__V = (function(x, y) {
  var this$1 = this.children$2;
  var i = 0;
  var top = this$1.size0$6;
  while ((i < top)) {
    var arg1 = this$1.array$6.u[i];
    var child = $as_Lexample_ChildObject(arg1);
    child.renderObject$1.probeClick__D__D__V(x, y);
    i = ((1 + i) | 0)
  }
});
$c_Lexample_Container.prototype.addChild__Lexample_ChildObject__V = (function(childObject) {
  var this$1 = this.children$2;
  var array = [childObject];
  var n = $uI(array["length"]);
  var n$1 = ((this$1.size0$6 + n) | 0);
  $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this$1, n$1);
  var xs = this$1.array$6;
  var start = this$1.size0$6;
  var i = 0;
  var j = start;
  var $$this = $uI(array["length"]);
  var $$this$1 = (($$this < n) ? $$this : n);
  var that = ((xs.u["length"] - start) | 0);
  var end = (($$this$1 < that) ? $$this$1 : that);
  while ((i < end)) {
    var jsx$1 = j;
    var index = i;
    xs.u[jsx$1] = array[index];
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  };
  this$1.size0$6 = ((this$1.size0$6 + n) | 0)
});
/** @constructor */
function $c_Lexample_SmartImage() {
  $c_Lexample_RenderObject.call(this);
  this.log$2 = null;
  this.maintainRatio$2 = false;
  this.img$2 = null;
  this.loaded$2 = false;
  this.altHeight$2 = 0.0;
  this.altWidth$2 = 0.0
}
$c_Lexample_SmartImage.prototype = new $h_Lexample_RenderObject();
$c_Lexample_SmartImage.prototype.constructor = $c_Lexample_SmartImage;
/** @constructor */
function $h_Lexample_SmartImage() {
  /*<skip>*/
}
$h_Lexample_SmartImage.prototype = $c_Lexample_SmartImage.prototype;
$c_Lexample_SmartImage.prototype.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V = (function(x, y, width, height, ctx) {
  if (this.loaded$2) {
    if (this.maintainRatio$2) {
      var horizontalStretch = (width / $uI(this.img$2["width"]));
      var verticalStretch = (height / $uI(this.img$2["height"]));
      if ((horizontalStretch < verticalStretch)) {
        this.altWidth$2 = width;
        this.altHeight$2 = ($uI(this.img$2["height"]) * horizontalStretch)
      } else {
        this.altWidth$2 = ($uI(this.img$2["width"]) * verticalStretch);
        this.altHeight$2 = height
      };
      ctx["drawImage"](this.img$2, x, y, this.altWidth$2, this.altHeight$2)
    } else {
      ctx["drawImage"](this.img$2, x, y, width, height)
    }
  } else {
    ctx["fillText"]("Loading", x, y)
  }
});
$c_Lexample_SmartImage.prototype.containsPoint__D__D__Z = (function(x, y) {
  return (this.maintainRatio$2 ? ((((x >= this.x$1) && (x <= (this.x$1 + this.altWidth$2))) && (y >= this.y$1)) && (y <= (this.y$1 + this.altHeight$2))) : $c_Lexample_RenderObject.prototype.containsPoint__D__D__Z.call(this, x, y))
});
$c_Lexample_SmartImage.prototype.init___T = (function(src) {
  $c_Lexample_RenderObject.prototype.init___.call(this);
  this.log$2 = new $c_Lexample_Logger().init___O(this);
  this.maintainRatio$2 = true;
  this.img$2 = new $g["Image"]();
  this.loaded$2 = false;
  this.img$2["src"] = src;
  this.img$2["addEventListener"]("load", (function(arg$outer) {
    return (function(e$2) {
      arg$outer.loaded$2 = true
    })
  })(this));
  this.altHeight$2 = 0.0;
  this.altWidth$2 = 0.0;
  return this
});
var $d_Lexample_SmartImage = new $TypeData().initClass({
  Lexample_SmartImage: 0
}, false, "example.SmartImage", {
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_SmartImage.prototype.$classData = $d_Lexample_SmartImage;
/** @constructor */
function $c_Lexample_ToggleImage() {
  $c_Lexample_RenderObject.call(this);
  this.imageA$2 = null;
  this.imageB$2 = null;
  this.onA$2 = false
}
$c_Lexample_ToggleImage.prototype = new $h_Lexample_RenderObject();
$c_Lexample_ToggleImage.prototype.constructor = $c_Lexample_ToggleImage;
/** @constructor */
function $h_Lexample_ToggleImage() {
  /*<skip>*/
}
$h_Lexample_ToggleImage.prototype = $c_Lexample_ToggleImage.prototype;
$c_Lexample_ToggleImage.prototype.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V = (function(x, y, width, height, ctx) {
  if (this.onA$2) {
    this.imageA$2.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(x, y, width, height, ctx)
  } else {
    this.imageB$2.draw__D__D__D__D__Lorg_scalajs_dom_raw_CanvasRenderingContext2D__V(x, y, width, height, ctx)
  }
});
$c_Lexample_ToggleImage.prototype.onClick__D__D__V = (function(x, y) {
  if (this.onA$2) {
    this.imageA$2.onClick__D__D__V(x, y);
    this.onA$2 = false
  } else {
    this.imageB$2.onClick__D__D__V(x, y);
    this.onA$2 = true
  }
});
$c_Lexample_ToggleImage.prototype.toggle__V = (function() {
  this.onA$2 = (!this.onA$2)
});
$c_Lexample_ToggleImage.prototype.init___Lexample_SmartImage__Lexample_SmartImage = (function(imageA, imageB) {
  this.imageA$2 = imageA;
  this.imageB$2 = imageB;
  $c_Lexample_RenderObject.prototype.init___.call(this);
  this.onA$2 = true;
  return this
});
var $d_Lexample_ToggleImage = new $TypeData().initClass({
  Lexample_ToggleImage: 0
}, false, "example.ToggleImage", {
  Lexample_ToggleImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_ToggleImage.prototype.$classData = $d_Lexample_ToggleImage;
function $isArrayOf_jl_Boolean(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Boolean)))
}
function $asArrayOf_jl_Boolean(obj, depth) {
  return (($isArrayOf_jl_Boolean(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Boolean;", depth))
}
var $d_jl_Boolean = new $TypeData().initClass({
  jl_Boolean: 0
}, false, "java.lang.Boolean", {
  jl_Boolean: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "boolean")
}));
/** @constructor */
function $c_jl_Character() {
  $c_O.call(this);
  this.value$1 = 0
}
$c_jl_Character.prototype = new $h_O();
$c_jl_Character.prototype.constructor = $c_jl_Character;
/** @constructor */
function $h_jl_Character() {
  /*<skip>*/
}
$h_jl_Character.prototype = $c_jl_Character.prototype;
$c_jl_Character.prototype.equals__O__Z = (function(that) {
  if ($is_jl_Character(that)) {
    var jsx$1 = this.value$1;
    var this$1 = $as_jl_Character(that);
    return (jsx$1 === this$1.value$1)
  } else {
    return false
  }
});
$c_jl_Character.prototype.toString__T = (function() {
  var c = this.value$1;
  return $as_T($g["String"]["fromCharCode"](c))
});
$c_jl_Character.prototype.init___C = (function(value) {
  this.value$1 = value;
  return this
});
$c_jl_Character.prototype.hashCode__I = (function() {
  return this.value$1
});
function $is_jl_Character(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Character)))
}
function $as_jl_Character(obj) {
  return (($is_jl_Character(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Character"))
}
function $isArrayOf_jl_Character(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Character)))
}
function $asArrayOf_jl_Character(obj, depth) {
  return (($isArrayOf_jl_Character(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Character;", depth))
}
var $d_jl_Character = new $TypeData().initClass({
  jl_Character: 0
}, false, "java.lang.Character", {
  jl_Character: 1,
  O: 1,
  jl_Comparable: 1
});
$c_jl_Character.prototype.$classData = $d_jl_Character;
/** @constructor */
function $c_jl_InheritableThreadLocal() {
  $c_jl_ThreadLocal.call(this)
}
$c_jl_InheritableThreadLocal.prototype = new $h_jl_ThreadLocal();
$c_jl_InheritableThreadLocal.prototype.constructor = $c_jl_InheritableThreadLocal;
/** @constructor */
function $h_jl_InheritableThreadLocal() {
  /*<skip>*/
}
$h_jl_InheritableThreadLocal.prototype = $c_jl_InheritableThreadLocal.prototype;
/** @constructor */
function $c_jl_Throwable() {
  $c_O.call(this);
  this.s$1 = null;
  this.e$1 = null;
  this.stackTrace$1 = null
}
$c_jl_Throwable.prototype = new $h_O();
$c_jl_Throwable.prototype.constructor = $c_jl_Throwable;
/** @constructor */
function $h_jl_Throwable() {
  /*<skip>*/
}
$h_jl_Throwable.prototype = $c_jl_Throwable.prototype;
$c_jl_Throwable.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable = (function() {
  var this$1 = $m_sjsr_StackTrace$();
  this$1.captureState__jl_Throwable__O__V(this, this$1.createException__p1__O());
  return this
});
$c_jl_Throwable.prototype.getMessage__T = (function() {
  return this.s$1
});
$c_jl_Throwable.prototype.toString__T = (function() {
  var className = $objectGetClass(this).getName__T();
  var message = this.getMessage__T();
  return ((message === null) ? className : ((className + ": ") + message))
});
$c_jl_Throwable.prototype.init___T__jl_Throwable = (function(s, e) {
  this.s$1 = s;
  this.e$1 = e;
  this.fillInStackTrace__jl_Throwable();
  return this
});
function $is_jl_Throwable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Throwable)))
}
function $as_jl_Throwable(obj) {
  return (($is_jl_Throwable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Throwable"))
}
function $isArrayOf_jl_Throwable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Throwable)))
}
function $asArrayOf_jl_Throwable(obj, depth) {
  return (($isArrayOf_jl_Throwable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Throwable;", depth))
}
/** @constructor */
function $c_ju_Random() {
  $c_O.call(this);
  this.seedHi$1 = 0;
  this.seedLo$1 = 0;
  this.nextNextGaussian$1 = 0.0;
  this.haveNextNextGaussian$1 = false
}
$c_ju_Random.prototype = new $h_O();
$c_ju_Random.prototype.constructor = $c_ju_Random;
/** @constructor */
function $h_ju_Random() {
  /*<skip>*/
}
$h_ju_Random.prototype = $c_ju_Random.prototype;
$c_ju_Random.prototype.init___ = (function() {
  $c_ju_Random.prototype.init___J.call(this, $m_ju_Random$().java$util$Random$$randomSeed__J());
  return this
});
$c_ju_Random.prototype.init___J = (function(seed_in) {
  this.haveNextNextGaussian$1 = false;
  this.setSeed__J__V(seed_in);
  return this
});
$c_ju_Random.prototype.nextInt__I__I = (function(n) {
  if ((n <= 0)) {
    throw new $c_jl_IllegalArgumentException().init___T("n must be positive")
  };
  return (((n & ((-n) | 0)) === n) ? new $c_sjsr_RuntimeLong().init___I(n).$$times__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(this.next__I__I(31))).$$greater$greater__I__sjsr_RuntimeLong(31).toInt__I() : this.loop$1__p1__I__I(n))
});
$c_ju_Random.prototype.next__I__I = (function(bits) {
  var oldSeedHi = this.seedHi$1;
  var oldSeedLo = this.seedLo$1;
  var loProd = (11 + (15525485 * oldSeedLo));
  var hiProd = ((1502 * oldSeedLo) + (15525485 * oldSeedHi));
  var x = (loProd / 16777216);
  var newSeedHi = (16777215 & (($uI((x | 0)) + (16777215 & $uI((hiProd | 0)))) | 0));
  var newSeedLo = (16777215 & $uI((loProd | 0)));
  this.seedHi$1 = newSeedHi;
  this.seedLo$1 = newSeedLo;
  var result32 = ((newSeedHi << 8) | (newSeedLo >> 16));
  return ((result32 >>> ((32 - bits) | 0)) | 0)
});
$c_ju_Random.prototype.loop$1__p1__I__I = (function(n$1) {
  _loop: while (true) {
    var bits = this.next__I__I(31);
    var value = (bits % n$1);
    if ((((((bits - value) | 0) + (((-1) + n$1) | 0)) | 0) < 0)) {
      continue _loop
    } else {
      return value
    }
  }
});
$c_ju_Random.prototype.setSeed__J__V = (function(seed_in) {
  var seed = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 4194303, 15).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(2942573, 6011, 0).$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(seed_in));
  this.seedHi$1 = seed.$$greater$greater$greater__I__sjsr_RuntimeLong(24).toInt__I();
  this.seedLo$1 = (16777215 & seed.toInt__I());
  this.haveNextNextGaussian$1 = false
});
var $d_ju_Random = new $TypeData().initClass({
  ju_Random: 0
}, false, "java.util.Random", {
  ju_Random: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Random.prototype.$classData = $d_ju_Random;
/** @constructor */
function $c_s_Predef$$anon$3() {
  $c_O.call(this)
}
$c_s_Predef$$anon$3.prototype = new $h_O();
$c_s_Predef$$anon$3.prototype.constructor = $c_s_Predef$$anon$3;
/** @constructor */
function $h_s_Predef$$anon$3() {
  /*<skip>*/
}
$h_s_Predef$$anon$3.prototype = $c_s_Predef$$anon$3.prototype;
$c_s_Predef$$anon$3.prototype.apply__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_s_Predef$$anon$3.prototype.apply__O__scm_Builder = (function(from) {
  $as_T(from);
  return new $c_scm_StringBuilder().init___()
});
var $d_s_Predef$$anon$3 = new $TypeData().initClass({
  s_Predef$$anon$3: 0
}, false, "scala.Predef$$anon$3", {
  s_Predef$$anon$3: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_s_Predef$$anon$3.prototype.$classData = $d_s_Predef$$anon$3;
/** @constructor */
function $c_s_math_Integral$IntegralOps() {
  $c_s_math_Numeric$Ops.call(this);
  this.lhs$2 = null
}
$c_s_math_Integral$IntegralOps.prototype = new $h_s_math_Numeric$Ops();
$c_s_math_Integral$IntegralOps.prototype.constructor = $c_s_math_Integral$IntegralOps;
/** @constructor */
function $h_s_math_Integral$IntegralOps() {
  /*<skip>*/
}
$h_s_math_Integral$IntegralOps.prototype = $c_s_math_Integral$IntegralOps.prototype;
$c_s_math_Integral$IntegralOps.prototype.init___s_math_Integral__O = (function($$outer, lhs) {
  this.lhs$2 = lhs;
  $c_s_math_Numeric$Ops.prototype.init___s_math_Numeric__O.call(this, $$outer, lhs);
  return this
});
var $d_s_math_Integral$IntegralOps = new $TypeData().initClass({
  s_math_Integral$IntegralOps: 0
}, false, "scala.math.Integral$IntegralOps", {
  s_math_Integral$IntegralOps: 1,
  s_math_Numeric$Ops: 1,
  O: 1
});
$c_s_math_Integral$IntegralOps.prototype.$classData = $d_s_math_Integral$IntegralOps;
function $is_s_math_ScalaNumber(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_math_ScalaNumber)))
}
function $as_s_math_ScalaNumber(obj) {
  return (($is_s_math_ScalaNumber(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.math.ScalaNumber"))
}
function $isArrayOf_s_math_ScalaNumber(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_math_ScalaNumber)))
}
function $asArrayOf_s_math_ScalaNumber(obj, depth) {
  return (($isArrayOf_s_math_ScalaNumber(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.math.ScalaNumber;", depth))
}
/** @constructor */
function $c_s_package$$anon$1() {
  $c_O.call(this)
}
$c_s_package$$anon$1.prototype = new $h_O();
$c_s_package$$anon$1.prototype.constructor = $c_s_package$$anon$1;
/** @constructor */
function $h_s_package$$anon$1() {
  /*<skip>*/
}
$h_s_package$$anon$1.prototype = $c_s_package$$anon$1.prototype;
$c_s_package$$anon$1.prototype.toString__T = (function() {
  return "object AnyRef"
});
var $d_s_package$$anon$1 = new $TypeData().initClass({
  s_package$$anon$1: 0
}, false, "scala.package$$anon$1", {
  s_package$$anon$1: 1,
  O: 1,
  s_Specializable: 1
});
$c_s_package$$anon$1.prototype.$classData = $d_s_package$$anon$1;
/** @constructor */
function $c_s_util_hashing_MurmurHash3$() {
  $c_s_util_hashing_MurmurHash3.call(this);
  this.arraySeed$2 = 0;
  this.stringSeed$2 = 0;
  this.productSeed$2 = 0;
  this.symmetricSeed$2 = 0;
  this.traversableSeed$2 = 0;
  this.seqSeed$2 = 0;
  this.mapSeed$2 = 0;
  this.setSeed$2 = 0
}
$c_s_util_hashing_MurmurHash3$.prototype = new $h_s_util_hashing_MurmurHash3();
$c_s_util_hashing_MurmurHash3$.prototype.constructor = $c_s_util_hashing_MurmurHash3$;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3$.prototype = $c_s_util_hashing_MurmurHash3$.prototype;
$c_s_util_hashing_MurmurHash3$.prototype.init___ = (function() {
  $n_s_util_hashing_MurmurHash3$ = this;
  this.seqSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Seq");
  this.mapSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Map");
  this.setSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Set");
  return this
});
$c_s_util_hashing_MurmurHash3$.prototype.seqHash__sc_Seq__I = (function(xs) {
  if ($is_sci_List(xs)) {
    var x2 = $as_sci_List(xs);
    return this.listHash__sci_List__I__I(x2, this.seqSeed$2)
  } else {
    return this.orderedHash__sc_TraversableOnce__I__I(xs, this.seqSeed$2)
  }
});
var $d_s_util_hashing_MurmurHash3$ = new $TypeData().initClass({
  s_util_hashing_MurmurHash3$: 0
}, false, "scala.util.hashing.MurmurHash3$", {
  s_util_hashing_MurmurHash3$: 1,
  s_util_hashing_MurmurHash3: 1,
  O: 1
});
$c_s_util_hashing_MurmurHash3$.prototype.$classData = $d_s_util_hashing_MurmurHash3$;
var $n_s_util_hashing_MurmurHash3$ = (void 0);
function $m_s_util_hashing_MurmurHash3$() {
  if ((!$n_s_util_hashing_MurmurHash3$)) {
    $n_s_util_hashing_MurmurHash3$ = new $c_s_util_hashing_MurmurHash3$().init___()
  };
  return $n_s_util_hashing_MurmurHash3$
}
function $is_sc_Iterator(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Iterator)))
}
function $as_sc_Iterator(obj) {
  return (($is_sc_Iterator(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Iterator"))
}
function $isArrayOf_sc_Iterator(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Iterator)))
}
function $asArrayOf_sc_Iterator(obj, depth) {
  return (($isArrayOf_sc_Iterator(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Iterator;", depth))
}
/** @constructor */
function $c_scg_GenMapFactory$MapCanBuildFrom() {
  $c_O.call(this);
  this.$$outer$f = null
}
$c_scg_GenMapFactory$MapCanBuildFrom.prototype = new $h_O();
$c_scg_GenMapFactory$MapCanBuildFrom.prototype.constructor = $c_scg_GenMapFactory$MapCanBuildFrom;
/** @constructor */
function $h_scg_GenMapFactory$MapCanBuildFrom() {
  /*<skip>*/
}
$h_scg_GenMapFactory$MapCanBuildFrom.prototype = $c_scg_GenMapFactory$MapCanBuildFrom.prototype;
$c_scg_GenMapFactory$MapCanBuildFrom.prototype.apply__scm_Builder = (function() {
  var this$1 = this.$$outer$f;
  return new $c_scm_MapBuilder().init___sc_GenMap(this$1.empty__sc_GenMap())
});
$c_scg_GenMapFactory$MapCanBuildFrom.prototype.apply__O__scm_Builder = (function(from) {
  $as_sc_GenMap(from);
  var this$1 = this.$$outer$f;
  return new $c_scm_MapBuilder().init___sc_GenMap(this$1.empty__sc_GenMap())
});
$c_scg_GenMapFactory$MapCanBuildFrom.prototype.init___scg_GenMapFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
var $d_scg_GenMapFactory$MapCanBuildFrom = new $TypeData().initClass({
  scg_GenMapFactory$MapCanBuildFrom: 0
}, false, "scala.collection.generic.GenMapFactory$MapCanBuildFrom", {
  scg_GenMapFactory$MapCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_scg_GenMapFactory$MapCanBuildFrom.prototype.$classData = $d_scg_GenMapFactory$MapCanBuildFrom;
/** @constructor */
function $c_scg_GenSetFactory() {
  $c_scg_GenericCompanion.call(this)
}
$c_scg_GenSetFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenSetFactory.prototype.constructor = $c_scg_GenSetFactory;
/** @constructor */
function $h_scg_GenSetFactory() {
  /*<skip>*/
}
$h_scg_GenSetFactory.prototype = $c_scg_GenSetFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory() {
  $c_scg_GenericCompanion.call(this);
  this.ReusableCBFInstance$2 = null
}
$c_scg_GenTraversableFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenTraversableFactory.prototype.constructor = $c_scg_GenTraversableFactory;
/** @constructor */
function $h_scg_GenTraversableFactory() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory.prototype = $c_scg_GenTraversableFactory.prototype;
$c_scg_GenTraversableFactory.prototype.init___ = (function() {
  this.ReusableCBFInstance$2 = new $c_scg_GenTraversableFactory$$anon$1().init___scg_GenTraversableFactory(this);
  return this
});
$c_scg_GenTraversableFactory.prototype.range__O__O__O__s_math_Integral__sc_GenTraversable = (function(start, end, step, evidence$2) {
  if ($m_sr_BoxesRunTime$().equals__O__O__Z(step, evidence$2.fromInt__I__O(0))) {
    throw new $c_jl_IllegalArgumentException().init___T("zero step")
  };
  var b = this.newBuilder__scm_Builder();
  b.sizeHint__I__V($m_sci_NumericRange$().count__O__O__O__Z__s_math_Integral__I(start, end, step, false, evidence$2));
  var i = start;
  while (true) {
    if (new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$2, step).$$less__O__Z(evidence$2.fromInt__I__O(0))) {
      var jsx$1 = new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$2, end).$$less__O__Z(i)
    } else {
      var lhs = i;
      var jsx$1 = new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$2, lhs).$$less__O__Z(end)
    };
    if (jsx$1) {
      b.$$plus$eq__O__scm_Builder(i);
      var lhs$1 = i;
      i = new $c_s_math_Integral$IntegralOps().init___s_math_Integral__O(evidence$2, lhs$1).$$plus__O__O(step)
    } else {
      break
    }
  };
  return $as_sc_GenTraversable(b.result__O())
});
$c_scg_GenTraversableFactory.prototype.range__O__O__s_math_Integral__sc_GenTraversable = (function(start, end, evidence$1) {
  return this.range__O__O__O__s_math_Integral__sc_GenTraversable(start, end, evidence$1.fromInt__I__O(1), evidence$1)
});
/** @constructor */
function $c_scg_GenTraversableFactory$GenericCanBuildFrom() {
  $c_O.call(this);
  this.$$outer$f = null
}
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = new $h_O();
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.constructor = $c_scg_GenTraversableFactory$GenericCanBuildFrom;
/** @constructor */
function $h_scg_GenTraversableFactory$GenericCanBuildFrom() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype;
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__scm_Builder = (function() {
  return this.$$outer$f.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__O__scm_Builder = (function(from) {
  var from$1 = $as_sc_GenTraversable(from);
  return from$1.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
/** @constructor */
function $c_scg_MapFactory() {
  $c_scg_GenMapFactory.call(this)
}
$c_scg_MapFactory.prototype = new $h_scg_GenMapFactory();
$c_scg_MapFactory.prototype.constructor = $c_scg_MapFactory;
/** @constructor */
function $h_scg_MapFactory() {
  /*<skip>*/
}
$h_scg_MapFactory.prototype = $c_scg_MapFactory.prototype;
/** @constructor */
function $c_sci_HashMap$$anon$2() {
  $c_sci_HashMap$Merger.call(this);
  this.invert$2 = null;
  this.mergef$1$f = null
}
$c_sci_HashMap$$anon$2.prototype = new $h_sci_HashMap$Merger();
$c_sci_HashMap$$anon$2.prototype.constructor = $c_sci_HashMap$$anon$2;
/** @constructor */
function $h_sci_HashMap$$anon$2() {
  /*<skip>*/
}
$h_sci_HashMap$$anon$2.prototype = $c_sci_HashMap$$anon$2.prototype;
$c_sci_HashMap$$anon$2.prototype.init___F2 = (function(mergef$1) {
  this.mergef$1$f = mergef$1;
  this.invert$2 = new $c_sci_HashMap$$anon$2$$anon$3().init___sci_HashMap$$anon$2(this);
  return this
});
$c_sci_HashMap$$anon$2.prototype.apply__T2__T2__T2 = (function(kv1, kv2) {
  return $as_T2(this.mergef$1$f.apply__O__O__O(kv1, kv2))
});
var $d_sci_HashMap$$anon$2 = new $TypeData().initClass({
  sci_HashMap$$anon$2: 0
}, false, "scala.collection.immutable.HashMap$$anon$2", {
  sci_HashMap$$anon$2: 1,
  sci_HashMap$Merger: 1,
  O: 1
});
$c_sci_HashMap$$anon$2.prototype.$classData = $d_sci_HashMap$$anon$2;
/** @constructor */
function $c_sci_HashMap$$anon$2$$anon$3() {
  $c_sci_HashMap$Merger.call(this);
  this.$$outer$2 = null
}
$c_sci_HashMap$$anon$2$$anon$3.prototype = new $h_sci_HashMap$Merger();
$c_sci_HashMap$$anon$2$$anon$3.prototype.constructor = $c_sci_HashMap$$anon$2$$anon$3;
/** @constructor */
function $h_sci_HashMap$$anon$2$$anon$3() {
  /*<skip>*/
}
$h_sci_HashMap$$anon$2$$anon$3.prototype = $c_sci_HashMap$$anon$2$$anon$3.prototype;
$c_sci_HashMap$$anon$2$$anon$3.prototype.apply__T2__T2__T2 = (function(kv1, kv2) {
  return $as_T2(this.$$outer$2.mergef$1$f.apply__O__O__O(kv2, kv1))
});
$c_sci_HashMap$$anon$2$$anon$3.prototype.init___sci_HashMap$$anon$2 = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_sci_HashMap$$anon$2$$anon$3 = new $TypeData().initClass({
  sci_HashMap$$anon$2$$anon$3: 0
}, false, "scala.collection.immutable.HashMap$$anon$2$$anon$3", {
  sci_HashMap$$anon$2$$anon$3: 1,
  sci_HashMap$Merger: 1,
  O: 1
});
$c_sci_HashMap$$anon$2$$anon$3.prototype.$classData = $d_sci_HashMap$$anon$2$$anon$3;
/** @constructor */
function $c_sci_List$$anon$1() {
  $c_O.call(this)
}
$c_sci_List$$anon$1.prototype = new $h_O();
$c_sci_List$$anon$1.prototype.constructor = $c_sci_List$$anon$1;
/** @constructor */
function $h_sci_List$$anon$1() {
  /*<skip>*/
}
$h_sci_List$$anon$1.prototype = $c_sci_List$$anon$1.prototype;
$c_sci_List$$anon$1.prototype.init___ = (function() {
  return this
});
$c_sci_List$$anon$1.prototype.apply__O__O = (function(x) {
  return this
});
$c_sci_List$$anon$1.prototype.toString__T = (function() {
  return "<function1>"
});
var $d_sci_List$$anon$1 = new $TypeData().initClass({
  sci_List$$anon$1: 0
}, false, "scala.collection.immutable.List$$anon$1", {
  sci_List$$anon$1: 1,
  O: 1,
  F1: 1
});
$c_sci_List$$anon$1.prototype.$classData = $d_sci_List$$anon$1;
function $is_scm_Builder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Builder)))
}
function $as_scm_Builder(obj) {
  return (($is_scm_Builder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Builder"))
}
function $isArrayOf_scm_Builder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Builder)))
}
function $asArrayOf_scm_Builder(obj, depth) {
  return (($isArrayOf_scm_Builder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Builder;", depth))
}
/** @constructor */
function $c_sr_AbstractFunction0() {
  $c_O.call(this)
}
$c_sr_AbstractFunction0.prototype = new $h_O();
$c_sr_AbstractFunction0.prototype.constructor = $c_sr_AbstractFunction0;
/** @constructor */
function $h_sr_AbstractFunction0() {
  /*<skip>*/
}
$h_sr_AbstractFunction0.prototype = $c_sr_AbstractFunction0.prototype;
$c_sr_AbstractFunction0.prototype.toString__T = (function() {
  return "<function0>"
});
/** @constructor */
function $c_sr_AbstractFunction1() {
  $c_O.call(this)
}
$c_sr_AbstractFunction1.prototype = new $h_O();
$c_sr_AbstractFunction1.prototype.constructor = $c_sr_AbstractFunction1;
/** @constructor */
function $h_sr_AbstractFunction1() {
  /*<skip>*/
}
$h_sr_AbstractFunction1.prototype = $c_sr_AbstractFunction1.prototype;
$c_sr_AbstractFunction1.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_sr_AbstractFunction2() {
  $c_O.call(this)
}
$c_sr_AbstractFunction2.prototype = new $h_O();
$c_sr_AbstractFunction2.prototype.constructor = $c_sr_AbstractFunction2;
/** @constructor */
function $h_sr_AbstractFunction2() {
  /*<skip>*/
}
$h_sr_AbstractFunction2.prototype = $c_sr_AbstractFunction2.prototype;
$c_sr_AbstractFunction2.prototype.toString__T = (function() {
  return "<function2>"
});
/** @constructor */
function $c_sr_BooleanRef() {
  $c_O.call(this);
  this.elem$1 = false
}
$c_sr_BooleanRef.prototype = new $h_O();
$c_sr_BooleanRef.prototype.constructor = $c_sr_BooleanRef;
/** @constructor */
function $h_sr_BooleanRef() {
  /*<skip>*/
}
$h_sr_BooleanRef.prototype = $c_sr_BooleanRef.prototype;
$c_sr_BooleanRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_BooleanRef.prototype.init___Z = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_BooleanRef = new $TypeData().initClass({
  sr_BooleanRef: 0
}, false, "scala.runtime.BooleanRef", {
  sr_BooleanRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_BooleanRef.prototype.$classData = $d_sr_BooleanRef;
/** @constructor */
function $c_sr_IntRef() {
  $c_O.call(this);
  this.elem$1 = 0
}
$c_sr_IntRef.prototype = new $h_O();
$c_sr_IntRef.prototype.constructor = $c_sr_IntRef;
/** @constructor */
function $h_sr_IntRef() {
  /*<skip>*/
}
$h_sr_IntRef.prototype = $c_sr_IntRef.prototype;
$c_sr_IntRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_IntRef.prototype.init___I = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_IntRef = new $TypeData().initClass({
  sr_IntRef: 0
}, false, "scala.runtime.IntRef", {
  sr_IntRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_IntRef.prototype.$classData = $d_sr_IntRef;
/** @constructor */
function $c_sr_ObjectRef() {
  $c_O.call(this);
  this.elem$1 = null
}
$c_sr_ObjectRef.prototype = new $h_O();
$c_sr_ObjectRef.prototype.constructor = $c_sr_ObjectRef;
/** @constructor */
function $h_sr_ObjectRef() {
  /*<skip>*/
}
$h_sr_ObjectRef.prototype = $c_sr_ObjectRef.prototype;
$c_sr_ObjectRef.prototype.toString__T = (function() {
  return $m_sjsr_RuntimeString$().valueOf__O__T(this.elem$1)
});
$c_sr_ObjectRef.prototype.init___O = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_ObjectRef = new $TypeData().initClass({
  sr_ObjectRef: 0
}, false, "scala.runtime.ObjectRef", {
  sr_ObjectRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_ObjectRef.prototype.$classData = $d_sr_ObjectRef;
/** @constructor */
function $c_Lexample_LinearContainer() {
  $c_Lexample_Container.call(this)
}
$c_Lexample_LinearContainer.prototype = new $h_Lexample_Container();
$c_Lexample_LinearContainer.prototype.constructor = $c_Lexample_LinearContainer;
/** @constructor */
function $h_Lexample_LinearContainer() {
  /*<skip>*/
}
$h_Lexample_LinearContainer.prototype = $c_Lexample_LinearContainer.prototype;
$c_Lexample_LinearContainer.prototype.bulkAdd__sc_Seq__D__D__D__D__V = (function(renderables, pW, pH, pMargin, pXStart) {
  var this$1 = $m_sc_Seq$();
  $as_sc_IterableLike(renderables.zipWithIndex__scg_CanBuildFrom__O(this$1.ReusableCBFInstance$2)).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, pW$2, pH$2, pMargin$2, pXStart$1) {
    return (function(tuple$2) {
      var tuple = $as_T2(tuple$2);
      var renderable = $as_Lexample_RenderObject(tuple.$$und1__O());
      var index = tuple.$$und2$mcI$sp__I();
      var pX = (pXStart$1 + (index * (pW$2 + pMargin$2)));
      arg$outer.addChild__Lexample_ChildObject__V(new $c_Lexample_ChildObject().init___D__D__D__D__Lexample_RenderObject(pX, pMargin$2, pW$2, pH$2, renderable))
    })
  })(this, pW, pH, pMargin, pXStart)))
});
$c_Lexample_LinearContainer.prototype.bulkAdd__sc_Seq__D__D__D__V = (function(renderables, pW, pH, pMargin) {
  var this$1 = $m_sc_Seq$();
  $as_sc_IterableLike(renderables.zipWithIndex__scg_CanBuildFrom__O(this$1.ReusableCBFInstance$2)).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer, pW$1, pH$1, pMargin$1) {
    return (function(tuple$2) {
      var tuple = $as_T2(tuple$2);
      var renderable = $as_Lexample_RenderObject(tuple.$$und1__O());
      var index = tuple.$$und2$mcI$sp__I();
      var pX = (index * (pW$1 + pMargin$1));
      arg$outer.addChild__Lexample_ChildObject__V(new $c_Lexample_ChildObject().init___D__D__D__D__Lexample_RenderObject(pX, pMargin$1, pW$1, pH$1, renderable))
    })
  })(this, pW, pH, pMargin)))
});
var $d_Lexample_LinearContainer = new $TypeData().initClass({
  Lexample_LinearContainer: 0
}, false, "example.LinearContainer", {
  Lexample_LinearContainer: 1,
  Lexample_Container: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_LinearContainer.prototype.$classData = $d_Lexample_LinearContainer;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$1() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$1.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$1.prototype.constructor = $c_Lexample_MenuRenderer$$anon$1;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$1() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$1.prototype = $c_Lexample_MenuRenderer$$anon$1.prototype;
$c_Lexample_MenuRenderer$$anon$1.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/play.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$1.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().PLAY$1)
});
var $d_Lexample_MenuRenderer$$anon$1 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$1: 0
}, false, "example.MenuRenderer$$anon$1", {
  Lexample_MenuRenderer$$anon$1: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$1.prototype.$classData = $d_Lexample_MenuRenderer$$anon$1;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$2() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$2.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$2.prototype.constructor = $c_Lexample_MenuRenderer$$anon$2;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$2() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$2.prototype = $c_Lexample_MenuRenderer$$anon$2.prototype;
$c_Lexample_MenuRenderer$$anon$2.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/stop.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$2.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().STOP$1)
});
var $d_Lexample_MenuRenderer$$anon$2 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$2: 0
}, false, "example.MenuRenderer$$anon$2", {
  Lexample_MenuRenderer$$anon$2: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$2.prototype.$classData = $d_Lexample_MenuRenderer$$anon$2;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$3() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$3.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$3.prototype.constructor = $c_Lexample_MenuRenderer$$anon$3;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$3() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$3.prototype = $c_Lexample_MenuRenderer$$anon$3.prototype;
$c_Lexample_MenuRenderer$$anon$3.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/pause.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$3.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().STOP$1)
});
var $d_Lexample_MenuRenderer$$anon$3 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$3: 0
}, false, "example.MenuRenderer$$anon$3", {
  Lexample_MenuRenderer$$anon$3: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$3.prototype.$classData = $d_Lexample_MenuRenderer$$anon$3;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$4() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$4.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$4.prototype.constructor = $c_Lexample_MenuRenderer$$anon$4;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$4() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$4.prototype = $c_Lexample_MenuRenderer$$anon$4.prototype;
$c_Lexample_MenuRenderer$$anon$4.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/play.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$4.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().PLAY$1)
});
var $d_Lexample_MenuRenderer$$anon$4 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$4: 0
}, false, "example.MenuRenderer$$anon$4", {
  Lexample_MenuRenderer$$anon$4: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$4.prototype.$classData = $d_Lexample_MenuRenderer$$anon$4;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$5() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$5.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$5.prototype.constructor = $c_Lexample_MenuRenderer$$anon$5;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$5() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$5.prototype = $c_Lexample_MenuRenderer$$anon$5.prototype;
$c_Lexample_MenuRenderer$$anon$5.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/play.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$5.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().PLAY$1)
});
var $d_Lexample_MenuRenderer$$anon$5 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$5: 0
}, false, "example.MenuRenderer$$anon$5", {
  Lexample_MenuRenderer$$anon$5: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$5.prototype.$classData = $d_Lexample_MenuRenderer$$anon$5;
/** @constructor */
function $c_Lexample_MenuRenderer$$anon$6() {
  $c_Lexample_SmartImage.call(this);
  this.$$outer$3 = null
}
$c_Lexample_MenuRenderer$$anon$6.prototype = new $h_Lexample_SmartImage();
$c_Lexample_MenuRenderer$$anon$6.prototype.constructor = $c_Lexample_MenuRenderer$$anon$6;
/** @constructor */
function $h_Lexample_MenuRenderer$$anon$6() {
  /*<skip>*/
}
$h_Lexample_MenuRenderer$$anon$6.prototype = $c_Lexample_MenuRenderer$$anon$6.prototype;
$c_Lexample_MenuRenderer$$anon$6.prototype.init___Lexample_MenuRenderer = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_Lexample_SmartImage.prototype.init___T.call(this, "images/question.png");
  return this
});
$c_Lexample_MenuRenderer$$anon$6.prototype.onClick__D__D__V = (function(x, y) {
  this.$$outer$3.example$MenuRenderer$$messageQueue$f.send__I__V($m_Lexample_MessageQueue$().HELP$1)
});
var $d_Lexample_MenuRenderer$$anon$6 = new $TypeData().initClass({
  Lexample_MenuRenderer$$anon$6: 0
}, false, "example.MenuRenderer$$anon$6", {
  Lexample_MenuRenderer$$anon$6: 1,
  Lexample_SmartImage: 1,
  Lexample_RenderObject: 1,
  O: 1
});
$c_Lexample_MenuRenderer$$anon$6.prototype.$classData = $d_Lexample_MenuRenderer$$anon$6;
/** @constructor */
function $c_Lexample_PianoRollController() {
  $c_O.call(this);
  this.example$PianoRollController$$pianoRollWorld$f = null;
  this.pianoRollRenderer$1 = null;
  this.noteOffsetFromStartX$1 = 0.0;
  this.notePlayer$1 = null;
  this.settings$1 = null;
  this.log$1 = null;
  this.messageQueue$1 = null;
  this.example$InputProcessor$$mouseDown$1 = false;
  this.example$InputProcessor$$mouseDownX$1 = 0.0;
  this.example$InputProcessor$$mouseDownY$1 = 0.0
}
$c_Lexample_PianoRollController.prototype = new $h_O();
$c_Lexample_PianoRollController.prototype.constructor = $c_Lexample_PianoRollController;
/** @constructor */
function $h_Lexample_PianoRollController() {
  /*<skip>*/
}
$h_Lexample_PianoRollController.prototype = $c_Lexample_PianoRollController.prototype;
$c_Lexample_PianoRollController.prototype.stopMusic__V = (function() {
  this.log$1.apply__T__V("Stop music");
  this.notePlayer$1.stop__V()
});
$c_Lexample_PianoRollController.prototype.writeBackDirtyNote__V = (function() {
  var this$1 = this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1;
  if ((!this$1.isEmpty__Z())) {
    var arg1 = this$1.get__O();
    var note = $as_Lexample_Note(arg1);
    var this$2 = this.example$PianoRollController$$pianoRollWorld$f;
    this$2.notes$1.add__Lexample_Note__V(note)
  };
  this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1 = $m_s_None$()
});
$c_Lexample_PianoRollController.prototype.onMouseDown__D__D__V = (function(x, y) {
  $s_Lexample_InputProcessor$class__onMouseDown__Lexample_InputProcessor__D__D__V(this, x, y);
  if (this.pianoRollRenderer$1.gridRect$1.containsPoint__D__D__Z(x, y)) {
    $m_Lexample_Logger$().verbose__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Piano grid touched ", ", ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([x, y])), $objectGetClass(this));
    var state = this.settings$1.state$1;
    this.writeBackDirtyNote__V();
    var note = this.pianoRollRenderer$1.getNoteAtMouseClick__D__D__s_Option(x, y);
    if (note.isDefined__Z()) {
      this.noteOffsetFromStartX$1 = (x - this.pianoRollRenderer$1.getStartXForNote__D__D($as_Lexample_Note(note.get__O()).beatPosition$1));
      $m_Lexample_Logger$().debug__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Offset ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.noteOffsetFromStartX$1])), $objectGetClass(this));
      var this$1 = this.example$PianoRollController$$pianoRollWorld$f;
      var note$1 = $as_Lexample_Note(note.get__O());
      this$1.notes$1.$delete__Lexample_Note__V(note$1);
      this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1 = note
    } else if ((state === $m_Lexample_PianoRollSettings$().StatePencil$1)) {
      var x1 = this.pianoRollRenderer$1.getMidiAndBeatAtMouseClick__D__D__T2(x, y);
      if ((x1 !== null)) {
        var midi = x1.$$und1$mcI$sp__I();
        var beat = x1.$$und2$mcD$sp__D();
        var x$1_$_$$und1$f = null;
        var x$1_$_$$und2$f = null;
        var x$1_$_$$und1$mcI$sp$f = midi;
        var x$1_$_$$und2$mcD$sp$f = beat
      } else {
        var x$1_$_$$und1$f;
        var x$1_$_$$und2$f;
        var x$1_$_$$und1$mcI$sp$f;
        var x$1_$_$$und2$mcD$sp$f;
        throw new $c_s_MatchError().init___O(x1)
      };
      var midi$2 = x$1_$_$$und1$mcI$sp$f;
      var beat$2 = x$1_$_$$und2$mcD$sp$f;
      var newNote = new $c_Lexample_Note().init___I__D__D(midi$2, beat$2, 0.1);
      this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1 = new $c_s_Some().init___O(newNote)
    }
  } else if (this.pianoRollRenderer$1.rulerRect$1.containsPoint__D__D__Z(x, y)) {
    $m_Lexample_Logger$().verbose__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Piano ruler touched ", ", ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([x, y])), $objectGetClass(this));
    this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1 = this.pianoRollRenderer$1.getBeatAtMouseClick__D__D(x);
    this.log$1.apply__T__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Locator beat: ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1])));
    if (this.notePlayer$1.isPlaying__Z()) {
      this.notePlayer$1.setPlayPoint__D__D__V(this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1, $uD($m_Lexample_audio_AudioManager$().audio$1["currentTime"]))
    }
  } else {
    $m_Lexample_Logger$().verbose__T__jl_Class__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Untouchable region touched ", ", ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([x, y])), $objectGetClass(this))
  };
  if (this.pianoRollRenderer$1.menuRect$1.containsPoint__D__D__Z(x, y)) {
    var this$2 = this.pianoRollRenderer$1.menuRenderer$1;
    this$2.masterContainer$1.onClick__D__D__V(x, y)
  }
});
$c_Lexample_PianoRollController.prototype.onDrag__D__D__D__D__V = (function(x, y, mouseDownX, mouseDownY) {
  if (this.pianoRollRenderer$1.gridRect$1.containsPoint__D__D__Z(x, y)) {
    if ((this.settings$1.state$1 === $m_Lexample_PianoRollSettings$().StateSelect$1)) {
      var adjustedX = (x - this.noteOffsetFromStartX$1);
      var x1 = this.pianoRollRenderer$1.getMidiAndBeatAtMouseClick__D__D__T2(adjustedX, y);
      if ((x1 !== null)) {
        var midi = x1.$$und1$mcI$sp__I();
        var beat = x1.$$und2$mcD$sp__D();
        var x$2_$_$$und1$f = null;
        var x$2_$_$$und2$f = null;
        var x$2_$_$$und1$mcI$sp$f = midi;
        var x$2_$_$$und2$mcD$sp$f = beat
      } else {
        var x$2_$_$$und1$f;
        var x$2_$_$$und2$f;
        var x$2_$_$$und1$mcI$sp$f;
        var x$2_$_$$und2$mcD$sp$f;
        throw new $c_s_MatchError().init___O(x1)
      };
      var midi$2 = x$2_$_$$und1$mcI$sp$f;
      var beat$2 = x$2_$_$$und2$mcD$sp$f;
      var jsx$2 = this.example$PianoRollController$$pianoRollWorld$f;
      var this$1 = this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1;
      if (this$1.isEmpty__Z()) {
        var jsx$1 = $m_s_None$()
      } else {
        var arg1 = this$1.get__O();
        var note = $as_Lexample_Note(arg1);
        var jsx$1 = new $c_s_Some().init___O(new $c_Lexample_Note().init___I__D__D(midi$2, beat$2, note.lengthInBeats$1))
      };
      jsx$2.dirtyNote$1 = jsx$1
    } else if ((this.settings$1.state$1 === $m_Lexample_PianoRollSettings$().StatePencil$1)) {
      var x1$2 = this.pianoRollRenderer$1.getMidiAndBeatAtMouseClick__D__D__T2(x, y);
      if ((x1$2 !== null)) {
        var midi$3 = x1$2.$$und1$mcI$sp__I();
        var beat$3 = x1$2.$$und2$mcD$sp__D();
        var x$3_$_$$und1$f = null;
        var x$3_$_$$und2$f = null;
        var x$3_$_$$und1$mcI$sp$f = midi$3;
        var x$3_$_$$und2$mcD$sp$f = beat$3
      } else {
        var x$3_$_$$und1$f;
        var x$3_$_$$und2$f;
        var x$3_$_$$und1$mcI$sp$f;
        var x$3_$_$$und2$mcD$sp$f;
        throw new $c_s_MatchError().init___O(x1$2)
      };
      var beat$4 = x$3_$_$$und2$mcD$sp$f;
      var jsx$4 = this.example$PianoRollController$$pianoRollWorld$f;
      var this$2 = this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1;
      if (this$2.isEmpty__Z()) {
        var jsx$3 = $m_s_None$()
      } else {
        var arg1$1 = this$2.get__O();
        var note$1 = $as_Lexample_Note(arg1$1);
        var a = (beat$4 - note$1.beatPosition$1);
        var newDuration = $uD($g["Math"]["max"](a, 0.001));
        var jsx$3 = new $c_s_Some().init___O(new $c_Lexample_Note().init___I__D__D(note$1.midi$1, note$1.beatPosition$1, newDuration))
      };
      jsx$4.dirtyNote$1 = jsx$3
    }
  }
});
$c_Lexample_PianoRollController.prototype.onBeatChanged__D__V = (function(beat) {
  this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1 = beat;
  if ((this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1 > this.example$PianoRollController$$pianoRollWorld$f.endBeat__I())) {
    this.example$PianoRollController$$pianoRollWorld$f.safeSetBeat__D__V((this.example$PianoRollController$$pianoRollWorld$f.endBeat__I() - $m_Lexample_PianoRollController$().LocatorFollowOffset$1))
  }
});
$c_Lexample_PianoRollController.prototype.playMusic__V = (function() {
  this.log$1.apply__T__V("Start music");
  var this$1 = this.notePlayer$1;
  this$1.notes$1.sort__V();
  this.notePlayer$1.setPlayPoint__D__D__V(this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1, $uD($m_Lexample_audio_AudioManager$().audio$1["currentTime"]))
});
$c_Lexample_PianoRollController.prototype.onKey__I__V = (function(keyCode) {
  if (($m_Lexample_KeyCode$().LEFT$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.shiftBeat__Z__V(false)
  } else if (($m_Lexample_KeyCode$().RIGHT$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.shiftBeat__Z__V(true)
  } else if (($m_Lexample_KeyCode$().UP$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.shiftRoll__Z__V(true)
  } else if (($m_Lexample_KeyCode$().DOWN$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.shiftRoll__Z__V(false)
  } else if (($m_Lexample_KeyCode$().X$1 === keyCode)) {
    if ((this.settings$1.state$1 === $m_Lexample_PianoRollSettings$().StateSelect$1)) {
      var this$1 = this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1;
      if ((!this$1.isEmpty__Z())) {
        var arg1 = this$1.get__O();
        var note = $as_Lexample_Note(arg1);
        var this$2 = this.example$PianoRollController$$pianoRollWorld$f;
        this$2.notes$1.$delete__Lexample_Note__V(note)
      };
      this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1 = $m_s_None$()
    }
  } else if (($m_Lexample_KeyCode$().S$1 === keyCode)) {
    this.settings$1.state$1 = $m_Lexample_PianoRollSettings$().StateSelect$1;
    this.writeBackDirtyNote__V();
    this.pianoRollRenderer$1.menuRenderer$1.selectToolExternal__I__V($m_Lexample_MessageQueue$().TOOL$undSELECT$1)
  } else if (($m_Lexample_KeyCode$().P$1 === keyCode)) {
    this.settings$1.state$1 = $m_Lexample_PianoRollSettings$().StatePencil$1;
    this.writeBackDirtyNote__V();
    this.pianoRollRenderer$1.menuRenderer$1.selectToolExternal__I__V($m_Lexample_MessageQueue$().TOOL$undPENCIL$1)
  } else if (($m_Lexample_KeyCode$().C$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.notes$1.empty__V()
  } else if (($m_Lexample_KeyCode$().SPACE$1 === keyCode)) {
    if (this.notePlayer$1.isPlaying__Z()) {
      this.stopMusic__V();
      this.pianoRollRenderer$1.menuRenderer$1.playPauseButton$1.toggle__V()
    } else {
      this.playMusic__V();
      this.pianoRollRenderer$1.menuRenderer$1.playPauseButton$1.toggle__V()
    }
  } else if (($m_Lexample_KeyCode$().BACKSPACE$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.dirtyNote$1 = $m_s_None$()
  }
});
$c_Lexample_PianoRollController.prototype.onKeyWithShift__I__V = (function(keyCode) {
  if (($m_Lexample_KeyCode$().LEFT$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.zoomOut__D__V($m_Lexample_PianoRollController$().Zoom$1)
  } else if (($m_Lexample_KeyCode$().RIGHT$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.zoomIn__D__V($m_Lexample_PianoRollController$().Zoom$1)
  } else if (($m_Lexample_KeyCode$().UP$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.zoomInRoll__D__V($m_Lexample_PianoRollController$().Zoom$1)
  } else if (($m_Lexample_KeyCode$().DOWN$1 === keyCode)) {
    this.example$PianoRollController$$pianoRollWorld$f.zoomOutRoll__D__V($m_Lexample_PianoRollController$().Zoom$1)
  } else if (($m_Lexample_KeyCode$().P$1 === keyCode)) {
    this.stopMusic__V()
  }
});
$c_Lexample_PianoRollController.prototype.init___Lexample_PianoRollWorld__Lexample_PianoRollRenderer = (function(pianoRollWorld, pianoRollRenderer) {
  this.example$PianoRollController$$pianoRollWorld$f = pianoRollWorld;
  this.pianoRollRenderer$1 = pianoRollRenderer;
  $s_Lexample_InputProcessor$class__$$init$__Lexample_InputProcessor__V(this);
  this.noteOffsetFromStartX$1 = (-1.0);
  this.notePlayer$1 = new $c_Lexample_audio_NotePlayer().init___Lexample_PianoRollWorld(pianoRollWorld);
  this.notePlayer$1.registerPlayerListener__Lexample_PlayerListener__V(this);
  this.settings$1 = pianoRollWorld.settings$1;
  this.log$1 = new $c_Lexample_Logger().init___jl_Class($objectGetClass(this));
  this.messageQueue$1 = pianoRollWorld.messageQueue$1;
  return this
});
$c_Lexample_PianoRollController.prototype.processMessages__V = (function() {
  while (true) {
    var this$1 = this.messageQueue$1;
    if ((!this$1.messages$1.isEmpty__Z())) {
      var this$2 = this.messageQueue$1;
      var message = $uI(this$2.messages$1.dequeue__O());
      this.log$1.apply__T__V(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Message ", " received"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message])));
      if (($m_Lexample_MessageQueue$().PLAY$1 === message)) {
        this.playMusic__V()
      } else if (($m_Lexample_MessageQueue$().STOP$1 === message)) {
        this.stopMusic__V()
      } else if (($m_Lexample_MessageQueue$().TOOL$undPENCIL$1 === message)) {
        this.settings$1.state$1 = $m_Lexample_PianoRollSettings$().StatePencil$1;
        this.writeBackDirtyNote__V()
      } else if (($m_Lexample_MessageQueue$().TOOL$undSELECT$1 === message)) {
        this.settings$1.state$1 = $m_Lexample_PianoRollSettings$().StateSelect$1;
        this.writeBackDirtyNote__V()
      } else if (($m_Lexample_MessageQueue$().HELP$1 === message)) {
        $g["showHelpModal"]()
      }
    } else {
      break
    }
  }
});
$c_Lexample_PianoRollController.prototype.onEnd__V = (function() {
  this.example$PianoRollController$$pianoRollWorld$f.locatorBeat$1 = 0.0
});
var $d_Lexample_PianoRollController = new $TypeData().initClass({
  Lexample_PianoRollController: 0
}, false, "example.PianoRollController", {
  Lexample_PianoRollController: 1,
  O: 1,
  Lexample_InputProcessor: 1,
  Lexample_PlayerListener: 1
});
$c_Lexample_PianoRollController.prototype.$classData = $d_Lexample_PianoRollController;
/** @constructor */
function $c_Lexample_Song$() {
  $c_O.call(this);
  this.demoOneNumMeasures$1 = 0;
  this.demoOneNotes$1 = null;
  this.arpeggio$1 = null;
  this.demoOneBPMChanges$1 = null;
  this.demoOneMeterChanges$1 = null;
  this.demoTwoMeterChanges$1 = null;
  this.demoSong$1 = null;
  this.demoSong2$1 = null
}
$c_Lexample_Song$.prototype = new $h_O();
$c_Lexample_Song$.prototype.constructor = $c_Lexample_Song$;
/** @constructor */
function $h_Lexample_Song$() {
  /*<skip>*/
}
$h_Lexample_Song$.prototype = $c_Lexample_Song$.prototype;
$c_Lexample_Song$.prototype.init___ = (function() {
  $n_Lexample_Song$ = this;
  this.demoOneNumMeasures$1 = 256;
  this.demoOneNotes$1 = $as_sci_Vector($as_sc_TraversableLike($m_s_package$().Vector$1.range__O__O__s_math_Integral__sc_GenTraversable(0, 500, $m_s_math_Numeric$IntIsIntegral$())).map__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$2$2) {
    $uI(x$2$2);
    return $m_Lexample_Song$().randomNote__Lexample_Note()
  })), ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)));
  this.arpeggio$1 = $as_sci_Vector($as_sc_TraversableLike($m_s_package$().Vector$1.range__O__O__s_math_Integral__sc_GenTraversable(0, 1600, $m_s_math_Numeric$IntIsIntegral$())).map__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$3$2) {
    var x$3 = $uI(x$3$2);
    var this$2 = $m_s_util_Random$();
    return new $c_Lexample_Note().init___I__D__D(((50 + this$2.self$1.nextInt__I__I(20)) | 0), x$3, 0.5)
  })), ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)));
  var this$4 = $m_s_package$().Vector$1;
  var array = [new $c_Lexample_BPMChange().init___D__D(0.0, 180.0), new $c_Lexample_BPMChange().init___D__D(480.0, 200.0), new $c_Lexample_BPMChange().init___D__D(2080.0, 91.0)];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$4.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  this.demoOneBPMChanges$1 = jsx$1;
  var this$5 = $m_s_package$().Vector$1;
  var array$1 = [new $c_Lexample_MeterChange().init___I__I(0, $m_Lexample_PianoRollConfig$().BeatResolution$1)];
  if (($uI(array$1["length"]) === 0)) {
    var jsx$2 = this$5.NIL$6
  } else {
    var b$1 = new $c_sci_VectorBuilder().init___();
    var i$1 = 0;
    var len$1 = $uI(array$1["length"]);
    while ((i$1 < len$1)) {
      var index$1 = i$1;
      var arg1$1 = array$1[index$1];
      b$1.$$plus$eq__O__sci_VectorBuilder(arg1$1);
      i$1 = ((1 + i$1) | 0)
    };
    var jsx$2 = b$1.result__sci_Vector()
  };
  this.demoOneMeterChanges$1 = jsx$2;
  var this$6 = $m_s_package$().Vector$1;
  var array$2 = [new $c_Lexample_MeterChange().init___I__I(0, $m_Lexample_PianoRollConfig$().BeatResolution$1), new $c_Lexample_MeterChange().init___I__I(2, (($imul(3, $m_Lexample_PianoRollConfig$().BeatResolution$1) / 8) | 0)), new $c_Lexample_MeterChange().init___I__I(4, (($imul(3, $m_Lexample_PianoRollConfig$().BeatResolution$1) / 4) | 0)), new $c_Lexample_MeterChange().init___I__I(10, (($imul(2, $m_Lexample_PianoRollConfig$().BeatResolution$1) / 4) | 0)), new $c_Lexample_MeterChange().init___I__I(25, $m_Lexample_PianoRollConfig$().BeatResolution$1)];
  if (($uI(array$2["length"]) === 0)) {
    var jsx$3 = this$6.NIL$6
  } else {
    var b$2 = new $c_sci_VectorBuilder().init___();
    var i$2 = 0;
    var len$2 = $uI(array$2["length"]);
    while ((i$2 < len$2)) {
      var index$2 = i$2;
      var arg1$2 = array$2[index$2];
      b$2.$$plus$eq__O__sci_VectorBuilder(arg1$2);
      i$2 = ((1 + i$2) | 0)
    };
    var jsx$3 = b$2.result__sci_Vector()
  };
  this.demoTwoMeterChanges$1 = jsx$3;
  var jsx$6 = this.demoOneNumMeasures$1;
  var jsx$5 = this.arpeggio$1;
  var this$7 = $m_s_package$().Vector$1;
  var array$3 = [new $c_Lexample_BPMChange().init___D__D(0.0, 120.0)];
  if (($uI(array$3["length"]) === 0)) {
    var jsx$4 = this$7.NIL$6
  } else {
    var b$3 = new $c_sci_VectorBuilder().init___();
    var i$3 = 0;
    var len$3 = $uI(array$3["length"]);
    while ((i$3 < len$3)) {
      var index$3 = i$3;
      var arg1$3 = array$3[index$3];
      b$3.$$plus$eq__O__sci_VectorBuilder(arg1$3);
      i$3 = ((1 + i$3) | 0)
    };
    var jsx$4 = b$3.result__sci_Vector()
  };
  this.demoSong$1 = new $c_Lexample_Song().init___I__sci_Vector__sci_Vector__sci_Vector(jsx$6, jsx$5, jsx$4, this.demoOneMeterChanges$1);
  this.demoSong2$1 = this.demoSong$1;
  return this
});
$c_Lexample_Song$.prototype.randomNote__Lexample_Note = (function() {
  var this$1 = $m_s_util_Random$();
  var jsx$1 = this$1.self$1.nextInt__I__I(20);
  var this$2 = $m_s_util_Random$();
  return new $c_Lexample_Note().init___I__D__D(((50 + jsx$1) | 0), $imul(4, ((this$2.self$1.nextInt__I__I(3200) / 4) | 0)), 8.0)
});
var $d_Lexample_Song$ = new $TypeData().initClass({
  Lexample_Song$: 0
}, false, "example.Song$", {
  Lexample_Song$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_Song$.prototype.$classData = $d_Lexample_Song$;
var $n_Lexample_Song$ = (void 0);
function $m_Lexample_Song$() {
  if ((!$n_Lexample_Song$)) {
    $n_Lexample_Song$ = new $c_Lexample_Song$().init___()
  };
  return $n_Lexample_Song$
}
/** @constructor */
function $c_Lexample_TickMarker$() {
  $c_O.call(this);
  this.MeasureTick$1 = 0;
  this.QuarterTick$1 = 0;
  this.EightTick$1 = 0;
  this.SixteenthTick$1 = 0;
  this.ThirtySecondTick$1 = 0
}
$c_Lexample_TickMarker$.prototype = new $h_O();
$c_Lexample_TickMarker$.prototype.constructor = $c_Lexample_TickMarker$;
/** @constructor */
function $h_Lexample_TickMarker$() {
  /*<skip>*/
}
$h_Lexample_TickMarker$.prototype = $c_Lexample_TickMarker$.prototype;
$c_Lexample_TickMarker$.prototype.init___ = (function() {
  $n_Lexample_TickMarker$ = this;
  this.MeasureTick$1 = (-1);
  this.QuarterTick$1 = (-2);
  this.EightTick$1 = (-3);
  this.SixteenthTick$1 = (-4);
  this.ThirtySecondTick$1 = (-5);
  return this
});
var $d_Lexample_TickMarker$ = new $TypeData().initClass({
  Lexample_TickMarker$: 0
}, false, "example.TickMarker$", {
  Lexample_TickMarker$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_TickMarker$.prototype.$classData = $d_Lexample_TickMarker$;
var $n_Lexample_TickMarker$ = (void 0);
function $m_Lexample_TickMarker$() {
  if ((!$n_Lexample_TickMarker$)) {
    $n_Lexample_TickMarker$ = new $c_Lexample_TickMarker$().init___()
  };
  return $n_Lexample_TickMarker$
}
/** @constructor */
function $c_Ljava_io_OutputStream() {
  $c_O.call(this)
}
$c_Ljava_io_OutputStream.prototype = new $h_O();
$c_Ljava_io_OutputStream.prototype.constructor = $c_Ljava_io_OutputStream;
/** @constructor */
function $h_Ljava_io_OutputStream() {
  /*<skip>*/
}
$h_Ljava_io_OutputStream.prototype = $c_Ljava_io_OutputStream.prototype;
$c_Ljava_io_OutputStream.prototype.close__V = (function() {
  /*<skip>*/
});
var $d_jl_Byte = new $TypeData().initClass({
  jl_Byte: 0
}, false, "java.lang.Byte", {
  jl_Byte: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isByte(x)
}));
function $isArrayOf_jl_Double(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Double)))
}
function $asArrayOf_jl_Double(obj, depth) {
  return (($isArrayOf_jl_Double(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Double;", depth))
}
var $d_jl_Double = new $TypeData().initClass({
  jl_Double: 0
}, false, "java.lang.Double", {
  jl_Double: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "number")
}));
/** @constructor */
function $c_jl_Error() {
  $c_jl_Throwable.call(this)
}
$c_jl_Error.prototype = new $h_jl_Throwable();
$c_jl_Error.prototype.constructor = $c_jl_Error;
/** @constructor */
function $h_jl_Error() {
  /*<skip>*/
}
$h_jl_Error.prototype = $c_jl_Error.prototype;
$c_jl_Error.prototype.init___T = (function(s) {
  $c_jl_Error.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
/** @constructor */
function $c_jl_Exception() {
  $c_jl_Throwable.call(this)
}
$c_jl_Exception.prototype = new $h_jl_Throwable();
$c_jl_Exception.prototype.constructor = $c_jl_Exception;
/** @constructor */
function $h_jl_Exception() {
  /*<skip>*/
}
$h_jl_Exception.prototype = $c_jl_Exception.prototype;
$c_jl_Exception.prototype.init___T = (function(s) {
  $c_jl_Exception.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
function $isArrayOf_jl_Float(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Float)))
}
function $asArrayOf_jl_Float(obj, depth) {
  return (($isArrayOf_jl_Float(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Float;", depth))
}
var $d_jl_Float = new $TypeData().initClass({
  jl_Float: 0
}, false, "java.lang.Float", {
  jl_Float: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isFloat(x)
}));
function $isArrayOf_jl_Integer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Integer)))
}
function $asArrayOf_jl_Integer(obj, depth) {
  return (($isArrayOf_jl_Integer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Integer;", depth))
}
var $d_jl_Integer = new $TypeData().initClass({
  jl_Integer: 0
}, false, "java.lang.Integer", {
  jl_Integer: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isInt(x)
}));
function $isArrayOf_jl_Long(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Long)))
}
function $asArrayOf_jl_Long(obj, depth) {
  return (($isArrayOf_jl_Long(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Long;", depth))
}
var $d_jl_Long = new $TypeData().initClass({
  jl_Long: 0
}, false, "java.lang.Long", {
  jl_Long: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $is_sjsr_RuntimeLong(x)
}));
var $d_jl_Short = new $TypeData().initClass({
  jl_Short: 0
}, false, "java.lang.Short", {
  jl_Short: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isShort(x)
}));
/** @constructor */
function $c_ju_Formatter() {
  $c_O.call(this);
  this.java$util$Formatter$$dest$1 = null;
  this.closed$1 = false
}
$c_ju_Formatter.prototype = new $h_O();
$c_ju_Formatter.prototype.constructor = $c_ju_Formatter;
/** @constructor */
function $h_ju_Formatter() {
  /*<skip>*/
}
$h_ju_Formatter.prototype = $c_ju_Formatter.prototype;
$c_ju_Formatter.prototype.init___ = (function() {
  $c_ju_Formatter.prototype.init___jl_Appendable.call(this, new $c_jl_StringBuilder().init___());
  return this
});
$c_ju_Formatter.prototype.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable = (function(argStr, prefix, preventZero, flags$1, width$1, conversion$1) {
  var prePadLen = (($uI(argStr["length"]) + $uI(prefix["length"])) | 0);
  if ((width$1 <= prePadLen)) {
    var padStr = (("" + prefix) + argStr)
  } else {
    var padRight = this.hasFlag$1__p1__T__T__Z("-", flags$1);
    var padZero = (this.hasFlag$1__p1__T__T__Z("0", flags$1) && (!$uZ(preventZero)));
    var padLength = ((width$1 - prePadLen) | 0);
    var padChar = (padZero ? "0" : " ");
    var padding = this.strRepeat$1__p1__T__I__T(padChar, padLength);
    if ((padZero && padRight)) {
      var padStr;
      throw new $c_ju_IllegalFormatFlagsException().init___T(flags$1)
    } else {
      var padStr = (padRight ? ((("" + prefix) + argStr) + padding) : (padZero ? ((("" + prefix) + padding) + argStr) : ((("" + padding) + prefix) + argStr)))
    }
  };
  var this$6 = $m_jl_Character$();
  if (this$6.isUpperCase__I__Z(conversion$1)) {
    var casedStr = $as_T(padStr["toUpperCase"]())
  } else {
    var casedStr = padStr
  };
  return this.java$util$Formatter$$dest$1.append__jl_CharSequence__jl_Appendable(casedStr)
});
$c_ju_Formatter.prototype.toString__T = (function() {
  return this.out__jl_Appendable().toString__T()
});
$c_ju_Formatter.prototype.init___jl_Appendable = (function(dest) {
  this.java$util$Formatter$$dest$1 = dest;
  this.closed$1 = false;
  return this
});
$c_ju_Formatter.prototype.padCaptureSign$1__p1__T__T__T__I__C__jl_Appendable = (function(argStr, prefix, flags$1, width$1, conversion$1) {
  var firstChar = (65535 & $uI(argStr["charCodeAt"](0)));
  return (((firstChar === 43) || (firstChar === 45)) ? this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable($as_T(argStr["substring"](1)), (("" + new $c_jl_Character().init___C(firstChar)) + prefix), false, flags$1, width$1, conversion$1) : this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(argStr, prefix, false, flags$1, width$1, conversion$1))
});
$c_ju_Formatter.prototype.hasFlag$1__p1__T__T__Z = (function(flag, flags$1) {
  return ($uI(flags$1["indexOf"](flag)) >= 0)
});
$c_ju_Formatter.prototype.out__jl_Appendable = (function() {
  return (this.closed$1 ? this.java$util$Formatter$$throwClosedException__sr_Nothing$() : this.java$util$Formatter$$dest$1)
});
$c_ju_Formatter.prototype.format__T__AO__ju_Formatter = (function(format_in, args) {
  if (this.closed$1) {
    this.java$util$Formatter$$throwClosedException__sr_Nothing$()
  } else {
    var fmt = format_in;
    var lastImplicitIndex = 0;
    var lastIndex = 0;
    while (true) {
      var thiz = fmt;
      if ((thiz === null)) {
        var jsx$1;
        throw new $c_jl_NullPointerException().init___()
      } else {
        var jsx$1 = thiz
      };
      if ((!(jsx$1 === ""))) {
        var x1 = fmt;
        matchEnd9: {
          var o12 = $m_ju_Formatter$().java$util$Formatter$$RegularChunk$1.unapply__T__s_Option(x1);
          if ((!o12.isEmpty__Z())) {
            var matchResult = o12.get__O();
            var thiz$2 = fmt;
            var $$this = matchResult[0];
            if (($$this === (void 0))) {
              var jsx$2;
              throw new $c_ju_NoSuchElementException().init___T("undefined.get")
            } else {
              var jsx$2 = $$this
            };
            var thiz$1 = $as_T(jsx$2);
            var beginIndex = $uI(thiz$1["length"]);
            fmt = $as_T(thiz$2["substring"](beginIndex));
            var jsx$4 = this.java$util$Formatter$$dest$1;
            var $$this$1 = matchResult[0];
            if (($$this$1 === (void 0))) {
              var jsx$3;
              throw new $c_ju_NoSuchElementException().init___T("undefined.get")
            } else {
              var jsx$3 = $$this$1
            };
            jsx$4.append__jl_CharSequence__jl_Appendable($as_jl_CharSequence(jsx$3));
            break matchEnd9
          };
          var o14 = $m_ju_Formatter$().java$util$Formatter$$DoublePercent$1.unapply__T__s_Option(x1);
          if ((!o14.isEmpty__Z())) {
            var thiz$3 = fmt;
            fmt = $as_T(thiz$3["substring"](2));
            this.java$util$Formatter$$dest$1.append__C__jl_Appendable(37);
            break matchEnd9
          };
          var o16 = $m_ju_Formatter$().java$util$Formatter$$EOLChunk$1.unapply__T__s_Option(x1);
          if ((!o16.isEmpty__Z())) {
            var thiz$4 = fmt;
            fmt = $as_T(thiz$4["substring"](2));
            this.java$util$Formatter$$dest$1.append__C__jl_Appendable(10);
            break matchEnd9
          };
          var o18 = $m_ju_Formatter$().java$util$Formatter$$FormattedChunk$1.unapply__T__s_Option(x1);
          if ((!o18.isEmpty__Z())) {
            var matchResult$2 = o18.get__O();
            var thiz$6 = fmt;
            var $$this$2 = matchResult$2[0];
            if (($$this$2 === (void 0))) {
              var jsx$5;
              throw new $c_ju_NoSuchElementException().init___T("undefined.get")
            } else {
              var jsx$5 = $$this$2
            };
            var thiz$5 = $as_T(jsx$5);
            var beginIndex$1 = $uI(thiz$5["length"]);
            fmt = $as_T(thiz$6["substring"](beginIndex$1));
            var $$this$3 = matchResult$2[2];
            if (($$this$3 === (void 0))) {
              var jsx$6;
              throw new $c_ju_NoSuchElementException().init___T("undefined.get")
            } else {
              var jsx$6 = $$this$3
            };
            var flags = $as_T(jsx$6);
            var $$this$4 = matchResult$2[1];
            var indexStr = $as_T((($$this$4 === (void 0)) ? "" : $$this$4));
            if ((indexStr === null)) {
              var jsx$7;
              throw new $c_jl_NullPointerException().init___()
            } else {
              var jsx$7 = indexStr
            };
            if ((jsx$7 !== "")) {
              var this$28 = $m_jl_Integer$();
              var index = this$28.parseInt__T__I__I(indexStr, 10)
            } else if (this.hasFlag$1__p1__T__T__Z("<", flags)) {
              var index = lastIndex
            } else {
              lastImplicitIndex = ((1 + lastImplicitIndex) | 0);
              var index = lastImplicitIndex
            };
            lastIndex = index;
            if (((index <= 0) || (index > args.u["length"]))) {
              var $$this$5 = matchResult$2[5];
              if (($$this$5 === (void 0))) {
                var jsx$8;
                throw new $c_ju_NoSuchElementException().init___T("undefined.get")
              } else {
                var jsx$8 = $$this$5
              };
              throw new $c_ju_MissingFormatArgumentException().init___T($as_T(jsx$8))
            };
            var arg = args.u[(((-1) + index) | 0)];
            var $$this$6 = matchResult$2[3];
            var widthStr = $as_T((($$this$6 === (void 0)) ? "" : $$this$6));
            if ((widthStr === null)) {
              var jsx$9;
              throw new $c_jl_NullPointerException().init___()
            } else {
              var jsx$9 = widthStr
            };
            var hasWidth = (jsx$9 !== "");
            if (hasWidth) {
              var this$36 = $m_jl_Integer$();
              var width = this$36.parseInt__T__I__I(widthStr, 10)
            } else {
              var width = 0
            };
            var $$this$7 = matchResult$2[4];
            var precisionStr = $as_T((($$this$7 === (void 0)) ? "" : $$this$7));
            if ((precisionStr === null)) {
              var jsx$10;
              throw new $c_jl_NullPointerException().init___()
            } else {
              var jsx$10 = precisionStr
            };
            var hasPrecision = (jsx$10 !== "");
            if (hasPrecision) {
              var this$41 = $m_jl_Integer$();
              var precision = this$41.parseInt__T__I__I(precisionStr, 10)
            } else {
              var precision = 0
            };
            var $$this$8 = matchResult$2[5];
            if (($$this$8 === (void 0))) {
              var jsx$11;
              throw new $c_ju_NoSuchElementException().init___T("undefined.get")
            } else {
              var jsx$11 = $$this$8
            };
            var thiz$7 = $as_T(jsx$11);
            var conversion = (65535 & $uI(thiz$7["charCodeAt"](0)));
            switch (conversion) {
              case 98:
              case 66: {
                if ((arg === null)) {
                  var jsx$12 = "false"
                } else if (((typeof arg) === "boolean")) {
                  var x3 = $asBoolean(arg);
                  var jsx$12 = $m_sjsr_RuntimeString$().valueOf__O__T(x3)
                } else {
                  var jsx$12 = "true"
                };
                this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(jsx$12, "", false, flags, width, conversion);
                break
              }
              case 104:
              case 72: {
                if ((arg === null)) {
                  var jsx$13 = "null"
                } else {
                  var i = $objectHashCode(arg);
                  var x = $uD((i >>> 0));
                  var jsx$14 = x["toString"](16);
                  var jsx$13 = $as_T(jsx$14)
                };
                this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(jsx$13, "", false, flags, width, conversion);
                break
              }
              case 115:
              case 83: {
                matchEnd6: {
                  if ((arg === null)) {
                    if ((!this.hasFlag$1__p1__T__T__Z("#", flags))) {
                      this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable("null", "", false, flags, width, conversion);
                      break matchEnd6
                    }
                  };
                  if ($is_ju_Formattable(arg)) {
                    var x3$2 = $as_ju_Formattable(arg);
                    var jsx$16 = (this.hasFlag$1__p1__T__T__Z("-", flags) ? 1 : 0);
                    var jsx$15 = (this.hasFlag$1__p1__T__T__Z("#", flags) ? 4 : 0);
                    var this$58 = $m_jl_Character$();
                    var flags$2 = ((jsx$16 | jsx$15) | (this$58.isUpperCase__I__Z(conversion) ? 2 : 0));
                    x3$2.formatTo__ju_Formatter__I__I__I__V(this, flags$2, (hasWidth ? width : (-1)), (hasPrecision ? precision : (-1)));
                    $m_s_None$();
                    break matchEnd6
                  };
                  if ((arg !== null)) {
                    if ((!this.hasFlag$1__p1__T__T__Z("#", flags))) {
                      this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable($objectToString(arg), "", false, flags, width, conversion);
                      break matchEnd6
                    }
                  };
                  throw new $c_ju_FormatFlagsConversionMismatchException().init___T__C("#", 115)
                };
                break
              }
              case 99:
              case 67: {
                var c = (65535 & this.intArg$1__p1__O__I(arg));
                this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable($as_T($g["String"]["fromCharCode"](c)), "", false, flags, width, conversion);
                break
              }
              case 100: {
                var this$68 = this.numberArg$1__p1__O__D(arg);
                this.with$und$plus$1__p1__T__Z__T__I__C__jl_Appendable(("" + this$68), false, flags, width, conversion);
                break
              }
              case 111: {
                if ($isInt(arg)) {
                  var x2 = $uI(arg);
                  var x$1 = $uD((x2 >>> 0));
                  var jsx$17 = x$1["toString"](8);
                  var str = $as_T(jsx$17)
                } else if ($is_sjsr_RuntimeLong(arg)) {
                  var x3$3 = $uJ(arg);
                  var str = $as_sjsr_RuntimeLong(x3$3).toOctalString__T()
                } else {
                  var str;
                  throw new $c_s_MatchError().init___O(arg)
                };
                this.padCaptureSign$1__p1__T__T__T__I__C__jl_Appendable(str, (this.hasFlag$1__p1__T__T__Z("#", flags) ? "0" : ""), flags, width, conversion);
                break
              }
              case 120:
              case 88: {
                if ($isInt(arg)) {
                  var x2$2 = $uI(arg);
                  var x$2 = $uD((x2$2 >>> 0));
                  var jsx$18 = x$2["toString"](16);
                  var str$2 = $as_T(jsx$18)
                } else if ($is_sjsr_RuntimeLong(arg)) {
                  var x3$4 = $uJ(arg);
                  var str$2 = $as_sjsr_RuntimeLong(x3$4).toHexString__T()
                } else {
                  var str$2;
                  throw new $c_s_MatchError().init___O(arg)
                };
                this.padCaptureSign$1__p1__T__T__T__I__C__jl_Appendable(str$2, (this.hasFlag$1__p1__T__T__Z("#", flags) ? "0x" : ""), flags, width, conversion);
                break
              }
              case 101:
              case 69: {
                this.sciNotation$1__p1__I__T__O__I__C__jl_Appendable((hasPrecision ? precision : 6), flags, arg, width, conversion);
                break
              }
              case 103:
              case 71: {
                var a = this.numberArg$1__p1__O__D(arg);
                var m = $uD($g["Math"]["abs"](a));
                var p = ((!hasPrecision) ? 6 : ((precision === 0) ? 1 : precision));
                if (((m >= 1.0E-4) && (m < $uD($g["Math"]["pow"](10.0, p))))) {
                  var a$1 = ($uD($g["Math"]["log"](m)) / 2.302585092994046);
                  var sig = $doubleToInt($uD($g["Math"]["ceil"](a$1)));
                  var x$3 = this.numberArg$1__p1__O__D(arg);
                  var a$2 = ((p - sig) | 0);
                  var jsx$19 = x$3["toFixed"](((a$2 > 0) ? a$2 : 0));
                  this.with$und$plus$1__p1__T__Z__T__I__C__jl_Appendable($as_T(jsx$19), false, flags, width, conversion)
                } else {
                  this.sciNotation$1__p1__I__T__O__I__C__jl_Appendable((((-1) + p) | 0), flags, arg, width, conversion)
                };
                break
              }
              case 102: {
                var x$4 = this.numberArg$1__p1__O__D(arg);
                var jsx$22 = x$4["toFixed"]((hasPrecision ? precision : 6));
                var jsx$21 = $as_T(jsx$22);
                var this$87 = this.numberArg$1__p1__O__D(arg);
                if ((this$87 !== this$87)) {
                  var jsx$20 = true
                } else {
                  var this$91 = this.numberArg$1__p1__O__D(arg);
                  var jsx$20 = ((this$91 === Infinity) || (this$91 === (-Infinity)))
                };
                this.with$und$plus$1__p1__T__Z__T__I__C__jl_Appendable(jsx$21, jsx$20, flags, width, conversion);
                break
              }
              default: {
                throw new $c_s_MatchError().init___O(new $c_jl_Character().init___C(conversion))
              }
            };
            break matchEnd9
          };
          throw new $c_s_MatchError().init___O(x1)
        }
      } else {
        break
      }
    };
    return this
  }
});
$c_ju_Formatter.prototype.strRepeat$1__p1__T__I__T = (function(s, times) {
  var result = "";
  var i = times;
  while ((i > 0)) {
    result = (("" + result) + s);
    i = (((-1) + i) | 0)
  };
  return result
});
$c_ju_Formatter.prototype.sciNotation$1__p1__I__T__O__I__C__jl_Appendable = (function(precision, flags$1, arg$1, width$1, conversion$1) {
  var x = this.numberArg$1__p1__O__D(arg$1);
  var jsx$1 = x["toExponential"](precision);
  var exp = $as_T(jsx$1);
  var index = (((-3) + $uI(exp["length"])) | 0);
  if (((65535 & $uI(exp["charCodeAt"](index))) === 101)) {
    var endIndex = (((-1) + $uI(exp["length"])) | 0);
    var jsx$4 = $as_T(exp["substring"](0, endIndex));
    var index$1 = (((-1) + $uI(exp["length"])) | 0);
    var c = (65535 & $uI(exp["charCodeAt"](index$1)));
    var jsx$3 = ((jsx$4 + "0") + new $c_jl_Character().init___C(c))
  } else {
    var jsx$3 = exp
  };
  var this$13 = this.numberArg$1__p1__O__D(arg$1);
  if ((this$13 !== this$13)) {
    var jsx$2 = true
  } else {
    var this$17 = this.numberArg$1__p1__O__D(arg$1);
    var jsx$2 = ((this$17 === Infinity) || (this$17 === (-Infinity)))
  };
  return this.with$und$plus$1__p1__T__Z__T__I__C__jl_Appendable(jsx$3, jsx$2, flags$1, width$1, conversion$1)
});
$c_ju_Formatter.prototype.intArg$1__p1__O__I = (function(arg$1) {
  if ($isInt(arg$1)) {
    var x2 = $uI(arg$1);
    return x2
  } else if ($is_jl_Character(arg$1)) {
    if ((arg$1 === null)) {
      var x3 = 0
    } else {
      var this$2 = $as_jl_Character(arg$1);
      var x3 = this$2.value$1
    };
    return x3
  } else {
    throw new $c_s_MatchError().init___O(arg$1)
  }
});
$c_ju_Formatter.prototype.java$util$Formatter$$throwClosedException__sr_Nothing$ = (function() {
  throw new $c_ju_FormatterClosedException().init___()
});
$c_ju_Formatter.prototype.close__V = (function() {
  if ((!this.closed$1)) {
    var x1 = this.java$util$Formatter$$dest$1;
    if ($is_Ljava_io_Closeable(x1)) {
      $as_Ljava_io_Closeable(x1).close__V()
    }
  };
  this.closed$1 = true
});
$c_ju_Formatter.prototype.with$und$plus$1__p1__T__Z__T__I__C__jl_Appendable = (function(s, preventZero, flags$1, width$1, conversion$1) {
  return (((65535 & $uI(s["charCodeAt"](0))) !== 45) ? (this.hasFlag$1__p1__T__T__Z("+", flags$1) ? this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(s, "+", preventZero, flags$1, width$1, conversion$1) : (this.hasFlag$1__p1__T__T__Z(" ", flags$1) ? this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(s, " ", preventZero, flags$1, width$1, conversion$1) : this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(s, "", preventZero, flags$1, width$1, conversion$1))) : (this.hasFlag$1__p1__T__T__Z("(", flags$1) ? this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable(($as_T(s["substring"](1)) + ")"), "(", preventZero, flags$1, width$1, conversion$1) : this.pad$1__p1__T__T__jl_Boolean__T__I__C__jl_Appendable($as_T(s["substring"](1)), "-", preventZero, flags$1, width$1, conversion$1)))
});
$c_ju_Formatter.prototype.numberArg$1__p1__O__D = (function(arg$1) {
  if ($is_jl_Number(arg$1)) {
    var x2 = $as_jl_Number(arg$1);
    return $numberDoubleValue(x2)
  } else if ($is_jl_Character(arg$1)) {
    if ((arg$1 === null)) {
      var x3 = 0
    } else {
      var this$2 = $as_jl_Character(arg$1);
      var x3 = this$2.value$1
    };
    return x3
  } else {
    throw new $c_s_MatchError().init___O(arg$1)
  }
});
var $d_ju_Formatter = new $TypeData().initClass({
  ju_Formatter: 0
}, false, "java.util.Formatter", {
  ju_Formatter: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1
});
$c_ju_Formatter.prototype.$classData = $d_ju_Formatter;
/** @constructor */
function $c_ju_Random$() {
  $c_O.call(this)
}
$c_ju_Random$.prototype = new $h_O();
$c_ju_Random$.prototype.constructor = $c_ju_Random$;
/** @constructor */
function $h_ju_Random$() {
  /*<skip>*/
}
$h_ju_Random$.prototype = $c_ju_Random$.prototype;
$c_ju_Random$.prototype.java$util$Random$$randomSeed__J = (function() {
  return new $c_sjsr_RuntimeLong().init___I(this.randomInt__p1__I()).$$less$less__I__sjsr_RuntimeLong(32).$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 1023, 0).$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(this.randomInt__p1__I())))
});
$c_ju_Random$.prototype.randomInt__p1__I = (function() {
  var a = (4.294967296E9 * $uD($g["Math"]["random"]()));
  return $doubleToInt(((-2.147483648E9) + $uD($g["Math"]["floor"](a))))
});
var $d_ju_Random$ = new $TypeData().initClass({
  ju_Random$: 0
}, false, "java.util.Random$", {
  ju_Random$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Random$.prototype.$classData = $d_ju_Random$;
var $n_ju_Random$ = (void 0);
function $m_ju_Random$() {
  if ((!$n_ju_Random$)) {
    $n_ju_Random$ = new $c_ju_Random$().init___()
  };
  return $n_ju_Random$
}
/** @constructor */
function $c_s_Console$() {
  $c_s_DeprecatedConsole.call(this);
  this.outVar$2 = null;
  this.errVar$2 = null;
  this.inVar$2 = null
}
$c_s_Console$.prototype = new $h_s_DeprecatedConsole();
$c_s_Console$.prototype.constructor = $c_s_Console$;
/** @constructor */
function $h_s_Console$() {
  /*<skip>*/
}
$h_s_Console$.prototype = $c_s_Console$.prototype;
$c_s_Console$.prototype.init___ = (function() {
  $n_s_Console$ = this;
  this.outVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().out$1);
  this.errVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().err$1);
  this.inVar$2 = new $c_s_util_DynamicVariable().init___O(null);
  return this
});
var $d_s_Console$ = new $TypeData().initClass({
  s_Console$: 0
}, false, "scala.Console$", {
  s_Console$: 1,
  s_DeprecatedConsole: 1,
  O: 1,
  s_io_AnsiColor: 1
});
$c_s_Console$.prototype.$classData = $d_s_Console$;
var $n_s_Console$ = (void 0);
function $m_s_Console$() {
  if ((!$n_s_Console$)) {
    $n_s_Console$ = new $c_s_Console$().init___()
  };
  return $n_s_Console$
}
/** @constructor */
function $c_s_Option$() {
  $c_O.call(this)
}
$c_s_Option$.prototype = new $h_O();
$c_s_Option$.prototype.constructor = $c_s_Option$;
/** @constructor */
function $h_s_Option$() {
  /*<skip>*/
}
$h_s_Option$.prototype = $c_s_Option$.prototype;
$c_s_Option$.prototype.apply__O__s_Option = (function(x) {
  return ((x === null) ? $m_s_None$() : new $c_s_Some().init___O(x))
});
var $d_s_Option$ = new $TypeData().initClass({
  s_Option$: 0
}, false, "scala.Option$", {
  s_Option$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Option$.prototype.$classData = $d_s_Option$;
var $n_s_Option$ = (void 0);
function $m_s_Option$() {
  if ((!$n_s_Option$)) {
    $n_s_Option$ = new $c_s_Option$().init___()
  };
  return $n_s_Option$
}
/** @constructor */
function $c_s_Predef$() {
  $c_s_LowPriorityImplicits.call(this);
  this.Map$2 = null;
  this.Set$2 = null;
  this.ClassManifest$2 = null;
  this.Manifest$2 = null;
  this.NoManifest$2 = null;
  this.StringCanBuildFrom$2 = null;
  this.singleton$und$less$colon$less$2 = null;
  this.scala$Predef$$singleton$und$eq$colon$eq$f = null
}
$c_s_Predef$.prototype = new $h_s_LowPriorityImplicits();
$c_s_Predef$.prototype.constructor = $c_s_Predef$;
/** @constructor */
function $h_s_Predef$() {
  /*<skip>*/
}
$h_s_Predef$.prototype = $c_s_Predef$.prototype;
$c_s_Predef$.prototype.init___ = (function() {
  $n_s_Predef$ = this;
  $m_s_package$();
  $m_sci_List$();
  this.Map$2 = $m_sci_Map$();
  this.Set$2 = $m_sci_Set$();
  this.ClassManifest$2 = $m_s_reflect_package$().ClassManifest$1;
  this.Manifest$2 = $m_s_reflect_package$().Manifest$1;
  this.NoManifest$2 = $m_s_reflect_NoManifest$();
  this.StringCanBuildFrom$2 = new $c_s_Predef$$anon$3().init___();
  this.singleton$und$less$colon$less$2 = new $c_s_Predef$$anon$1().init___();
  this.scala$Predef$$singleton$und$eq$colon$eq$f = new $c_s_Predef$$anon$2().init___();
  return this
});
$c_s_Predef$.prototype.assert__Z__V = (function(assertion) {
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O("assertion failed")
  }
});
$c_s_Predef$.prototype.require__Z__V = (function(requirement) {
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T("requirement failed")
  }
});
var $d_s_Predef$ = new $TypeData().initClass({
  s_Predef$: 0
}, false, "scala.Predef$", {
  s_Predef$: 1,
  s_LowPriorityImplicits: 1,
  O: 1,
  s_DeprecatedPredef: 1
});
$c_s_Predef$.prototype.$classData = $d_s_Predef$;
var $n_s_Predef$ = (void 0);
function $m_s_Predef$() {
  if ((!$n_s_Predef$)) {
    $n_s_Predef$ = new $c_s_Predef$().init___()
  };
  return $n_s_Predef$
}
/** @constructor */
function $c_s_StringContext$() {
  $c_O.call(this)
}
$c_s_StringContext$.prototype = new $h_O();
$c_s_StringContext$.prototype.constructor = $c_s_StringContext$;
/** @constructor */
function $h_s_StringContext$() {
  /*<skip>*/
}
$h_s_StringContext$.prototype = $c_s_StringContext$.prototype;
$c_s_StringContext$.prototype.treatEscapes0__p1__T__Z__T = (function(str, strict) {
  var len = $uI(str["length"]);
  var x1 = $m_sjsr_RuntimeString$().indexOf__T__I__I(str, 92);
  switch (x1) {
    case (-1): {
      return str;
      break
    }
    default: {
      return this.replace$1__p1__I__T__Z__I__T(x1, str, strict, len)
    }
  }
});
$c_s_StringContext$.prototype.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T = (function(i, next, str$1, strict$1, len$1, b$1) {
  _loop: while (true) {
    if ((next >= 0)) {
      if ((next > i)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, next)
      };
      var idx = ((1 + next) | 0);
      if ((idx >= len$1)) {
        throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
      };
      var index = idx;
      var x1 = (65535 & $uI(str$1["charCodeAt"](index)));
      switch (x1) {
        case 98: {
          var c = 8;
          break
        }
        case 116: {
          var c = 9;
          break
        }
        case 110: {
          var c = 10;
          break
        }
        case 102: {
          var c = 12;
          break
        }
        case 114: {
          var c = 13;
          break
        }
        case 34: {
          var c = 34;
          break
        }
        case 39: {
          var c = 39;
          break
        }
        case 92: {
          var c = 92;
          break
        }
        default: {
          if (((x1 >= 48) && (x1 <= 55))) {
            if (strict$1) {
              throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
            };
            var index$1 = idx;
            var leadch = (65535 & $uI(str$1["charCodeAt"](index$1)));
            var oct = (((-48) + leadch) | 0);
            idx = ((1 + idx) | 0);
            if ((idx < len$1)) {
              var index$2 = idx;
              var jsx$2 = ((65535 & $uI(str$1["charCodeAt"](index$2))) >= 48)
            } else {
              var jsx$2 = false
            };
            if (jsx$2) {
              var index$3 = idx;
              var jsx$1 = ((65535 & $uI(str$1["charCodeAt"](index$3))) <= 55)
            } else {
              var jsx$1 = false
            };
            if (jsx$1) {
              var jsx$3 = oct;
              var index$4 = idx;
              oct = (((-48) + (($imul(8, jsx$3) + (65535 & $uI(str$1["charCodeAt"](index$4)))) | 0)) | 0);
              idx = ((1 + idx) | 0);
              if (((idx < len$1) && (leadch <= 51))) {
                var index$5 = idx;
                var jsx$5 = ((65535 & $uI(str$1["charCodeAt"](index$5))) >= 48)
              } else {
                var jsx$5 = false
              };
              if (jsx$5) {
                var index$6 = idx;
                var jsx$4 = ((65535 & $uI(str$1["charCodeAt"](index$6))) <= 55)
              } else {
                var jsx$4 = false
              };
              if (jsx$4) {
                var jsx$6 = oct;
                var index$7 = idx;
                oct = (((-48) + (($imul(8, jsx$6) + (65535 & $uI(str$1["charCodeAt"](index$7)))) | 0)) | 0);
                idx = ((1 + idx) | 0)
              }
            };
            idx = (((-1) + idx) | 0);
            var c = (65535 & oct)
          } else {
            var c;
            throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
          }
        }
      };
      idx = ((1 + idx) | 0);
      b$1.append__C__jl_StringBuilder(c);
      var temp$i = idx;
      var temp$next = $m_sjsr_RuntimeString$().indexOf__T__I__I__I(str$1, 92, idx);
      i = temp$i;
      next = temp$next;
      continue _loop
    } else {
      if ((i < len$1)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, len$1)
      };
      return b$1.content$1
    }
  }
});
$c_s_StringContext$.prototype.replace$1__p1__I__T__Z__I__T = (function(first, str$1, strict$1, len$1) {
  var b = new $c_jl_StringBuilder().init___();
  return this.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T(0, first, str$1, strict$1, len$1, b)
});
var $d_s_StringContext$ = new $TypeData().initClass({
  s_StringContext$: 0
}, false, "scala.StringContext$", {
  s_StringContext$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$.prototype.$classData = $d_s_StringContext$;
var $n_s_StringContext$ = (void 0);
function $m_s_StringContext$() {
  if ((!$n_s_StringContext$)) {
    $n_s_StringContext$ = new $c_s_StringContext$().init___()
  };
  return $n_s_StringContext$
}
/** @constructor */
function $c_s_math_Fractional$() {
  $c_O.call(this)
}
$c_s_math_Fractional$.prototype = new $h_O();
$c_s_math_Fractional$.prototype.constructor = $c_s_math_Fractional$;
/** @constructor */
function $h_s_math_Fractional$() {
  /*<skip>*/
}
$h_s_math_Fractional$.prototype = $c_s_math_Fractional$.prototype;
var $d_s_math_Fractional$ = new $TypeData().initClass({
  s_math_Fractional$: 0
}, false, "scala.math.Fractional$", {
  s_math_Fractional$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Fractional$.prototype.$classData = $d_s_math_Fractional$;
var $n_s_math_Fractional$ = (void 0);
function $m_s_math_Fractional$() {
  if ((!$n_s_math_Fractional$)) {
    $n_s_math_Fractional$ = new $c_s_math_Fractional$().init___()
  };
  return $n_s_math_Fractional$
}
/** @constructor */
function $c_s_math_Integral$() {
  $c_O.call(this)
}
$c_s_math_Integral$.prototype = new $h_O();
$c_s_math_Integral$.prototype.constructor = $c_s_math_Integral$;
/** @constructor */
function $h_s_math_Integral$() {
  /*<skip>*/
}
$h_s_math_Integral$.prototype = $c_s_math_Integral$.prototype;
var $d_s_math_Integral$ = new $TypeData().initClass({
  s_math_Integral$: 0
}, false, "scala.math.Integral$", {
  s_math_Integral$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Integral$.prototype.$classData = $d_s_math_Integral$;
var $n_s_math_Integral$ = (void 0);
function $m_s_math_Integral$() {
  if ((!$n_s_math_Integral$)) {
    $n_s_math_Integral$ = new $c_s_math_Integral$().init___()
  };
  return $n_s_math_Integral$
}
/** @constructor */
function $c_s_math_Numeric$() {
  $c_O.call(this)
}
$c_s_math_Numeric$.prototype = new $h_O();
$c_s_math_Numeric$.prototype.constructor = $c_s_math_Numeric$;
/** @constructor */
function $h_s_math_Numeric$() {
  /*<skip>*/
}
$h_s_math_Numeric$.prototype = $c_s_math_Numeric$.prototype;
var $d_s_math_Numeric$ = new $TypeData().initClass({
  s_math_Numeric$: 0
}, false, "scala.math.Numeric$", {
  s_math_Numeric$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Numeric$.prototype.$classData = $d_s_math_Numeric$;
var $n_s_math_Numeric$ = (void 0);
function $m_s_math_Numeric$() {
  if ((!$n_s_math_Numeric$)) {
    $n_s_math_Numeric$ = new $c_s_math_Numeric$().init___()
  };
  return $n_s_math_Numeric$
}
/** @constructor */
function $c_s_util_DynamicVariable$$anon$1() {
  $c_jl_InheritableThreadLocal.call(this);
  this.$$outer$3 = null
}
$c_s_util_DynamicVariable$$anon$1.prototype = new $h_jl_InheritableThreadLocal();
$c_s_util_DynamicVariable$$anon$1.prototype.constructor = $c_s_util_DynamicVariable$$anon$1;
/** @constructor */
function $h_s_util_DynamicVariable$$anon$1() {
  /*<skip>*/
}
$h_s_util_DynamicVariable$$anon$1.prototype = $c_s_util_DynamicVariable$$anon$1.prototype;
$c_s_util_DynamicVariable$$anon$1.prototype.init___s_util_DynamicVariable = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$3 = $$outer
  };
  $c_jl_InheritableThreadLocal.prototype.init___.call(this);
  return this
});
$c_s_util_DynamicVariable$$anon$1.prototype.initialValue__O = (function() {
  return this.$$outer$3.scala$util$DynamicVariable$$init$f
});
var $d_s_util_DynamicVariable$$anon$1 = new $TypeData().initClass({
  s_util_DynamicVariable$$anon$1: 0
}, false, "scala.util.DynamicVariable$$anon$1", {
  s_util_DynamicVariable$$anon$1: 1,
  jl_InheritableThreadLocal: 1,
  jl_ThreadLocal: 1,
  O: 1
});
$c_s_util_DynamicVariable$$anon$1.prototype.$classData = $d_s_util_DynamicVariable$$anon$1;
/** @constructor */
function $c_s_util_Left$() {
  $c_O.call(this)
}
$c_s_util_Left$.prototype = new $h_O();
$c_s_util_Left$.prototype.constructor = $c_s_util_Left$;
/** @constructor */
function $h_s_util_Left$() {
  /*<skip>*/
}
$h_s_util_Left$.prototype = $c_s_util_Left$.prototype;
$c_s_util_Left$.prototype.toString__T = (function() {
  return "Left"
});
var $d_s_util_Left$ = new $TypeData().initClass({
  s_util_Left$: 0
}, false, "scala.util.Left$", {
  s_util_Left$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Left$.prototype.$classData = $d_s_util_Left$;
var $n_s_util_Left$ = (void 0);
function $m_s_util_Left$() {
  if ((!$n_s_util_Left$)) {
    $n_s_util_Left$ = new $c_s_util_Left$().init___()
  };
  return $n_s_util_Left$
}
/** @constructor */
function $c_s_util_Random() {
  $c_O.call(this);
  this.self$1 = null
}
$c_s_util_Random.prototype = new $h_O();
$c_s_util_Random.prototype.constructor = $c_s_util_Random;
/** @constructor */
function $h_s_util_Random() {
  /*<skip>*/
}
$h_s_util_Random.prototype = $c_s_util_Random.prototype;
$c_s_util_Random.prototype.init___ = (function() {
  $c_s_util_Random.prototype.init___ju_Random.call(this, new $c_ju_Random().init___());
  return this
});
$c_s_util_Random.prototype.init___ju_Random = (function(self) {
  this.self$1 = self;
  return this
});
/** @constructor */
function $c_s_util_Right$() {
  $c_O.call(this)
}
$c_s_util_Right$.prototype = new $h_O();
$c_s_util_Right$.prototype.constructor = $c_s_util_Right$;
/** @constructor */
function $h_s_util_Right$() {
  /*<skip>*/
}
$h_s_util_Right$.prototype = $c_s_util_Right$.prototype;
$c_s_util_Right$.prototype.toString__T = (function() {
  return "Right"
});
var $d_s_util_Right$ = new $TypeData().initClass({
  s_util_Right$: 0
}, false, "scala.util.Right$", {
  s_util_Right$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Right$.prototype.$classData = $d_s_util_Right$;
var $n_s_util_Right$ = (void 0);
function $m_s_util_Right$() {
  if ((!$n_s_util_Right$)) {
    $n_s_util_Right$ = new $c_s_util_Right$().init___()
  };
  return $n_s_util_Right$
}
/** @constructor */
function $c_s_util_control_NoStackTrace$() {
  $c_O.call(this);
  this.$$undnoSuppression$1 = false
}
$c_s_util_control_NoStackTrace$.prototype = new $h_O();
$c_s_util_control_NoStackTrace$.prototype.constructor = $c_s_util_control_NoStackTrace$;
/** @constructor */
function $h_s_util_control_NoStackTrace$() {
  /*<skip>*/
}
$h_s_util_control_NoStackTrace$.prototype = $c_s_util_control_NoStackTrace$.prototype;
$c_s_util_control_NoStackTrace$.prototype.init___ = (function() {
  $n_s_util_control_NoStackTrace$ = this;
  this.$$undnoSuppression$1 = false;
  return this
});
var $d_s_util_control_NoStackTrace$ = new $TypeData().initClass({
  s_util_control_NoStackTrace$: 0
}, false, "scala.util.control.NoStackTrace$", {
  s_util_control_NoStackTrace$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_control_NoStackTrace$.prototype.$classData = $d_s_util_control_NoStackTrace$;
var $n_s_util_control_NoStackTrace$ = (void 0);
function $m_s_util_control_NoStackTrace$() {
  if ((!$n_s_util_control_NoStackTrace$)) {
    $n_s_util_control_NoStackTrace$ = new $c_s_util_control_NoStackTrace$().init___()
  };
  return $n_s_util_control_NoStackTrace$
}
/** @constructor */
function $c_sc_IndexedSeq$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sc_IndexedSeq$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sc_IndexedSeq$$anon$1.prototype.constructor = $c_sc_IndexedSeq$$anon$1;
/** @constructor */
function $h_sc_IndexedSeq$$anon$1() {
  /*<skip>*/
}
$h_sc_IndexedSeq$$anon$1.prototype = $c_sc_IndexedSeq$$anon$1.prototype;
$c_sc_IndexedSeq$$anon$1.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sc_IndexedSeq$());
  return this
});
$c_sc_IndexedSeq$$anon$1.prototype.apply__scm_Builder = (function() {
  $m_sc_IndexedSeq$();
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$$anon$1 = new $TypeData().initClass({
  sc_IndexedSeq$$anon$1: 0
}, false, "scala.collection.IndexedSeq$$anon$1", {
  sc_IndexedSeq$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sc_IndexedSeq$$anon$1.prototype.$classData = $d_sc_IndexedSeq$$anon$1;
/** @constructor */
function $c_scg_GenSeqFactory() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scg_GenSeqFactory.prototype = new $h_scg_GenTraversableFactory();
$c_scg_GenSeqFactory.prototype.constructor = $c_scg_GenSeqFactory;
/** @constructor */
function $h_scg_GenSeqFactory() {
  /*<skip>*/
}
$h_scg_GenSeqFactory.prototype = $c_scg_GenSeqFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this);
  this.$$outer$2 = null
}
$c_scg_GenTraversableFactory$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_scg_GenTraversableFactory$$anon$1.prototype.constructor = $c_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $h_scg_GenTraversableFactory$$anon$1() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$$anon$1.prototype = $c_scg_GenTraversableFactory$$anon$1.prototype;
$c_scg_GenTraversableFactory$$anon$1.prototype.apply__scm_Builder = (function() {
  return this.$$outer$2.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$$anon$1.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $$outer);
  return this
});
var $d_scg_GenTraversableFactory$$anon$1 = new $TypeData().initClass({
  scg_GenTraversableFactory$$anon$1: 0
}, false, "scala.collection.generic.GenTraversableFactory$$anon$1", {
  scg_GenTraversableFactory$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_scg_GenTraversableFactory$$anon$1.prototype.$classData = $d_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $c_scg_ImmutableMapFactory() {
  $c_scg_MapFactory.call(this)
}
$c_scg_ImmutableMapFactory.prototype = new $h_scg_MapFactory();
$c_scg_ImmutableMapFactory.prototype.constructor = $c_scg_ImmutableMapFactory;
/** @constructor */
function $h_scg_ImmutableMapFactory() {
  /*<skip>*/
}
$h_scg_ImmutableMapFactory.prototype = $c_scg_ImmutableMapFactory.prototype;
/** @constructor */
function $c_sci_$colon$colon$() {
  $c_O.call(this)
}
$c_sci_$colon$colon$.prototype = new $h_O();
$c_sci_$colon$colon$.prototype.constructor = $c_sci_$colon$colon$;
/** @constructor */
function $h_sci_$colon$colon$() {
  /*<skip>*/
}
$h_sci_$colon$colon$.prototype = $c_sci_$colon$colon$.prototype;
$c_sci_$colon$colon$.prototype.toString__T = (function() {
  return "::"
});
var $d_sci_$colon$colon$ = new $TypeData().initClass({
  sci_$colon$colon$: 0
}, false, "scala.collection.immutable.$colon$colon$", {
  sci_$colon$colon$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_$colon$colon$.prototype.$classData = $d_sci_$colon$colon$;
var $n_sci_$colon$colon$ = (void 0);
function $m_sci_$colon$colon$() {
  if ((!$n_sci_$colon$colon$)) {
    $n_sci_$colon$colon$ = new $c_sci_$colon$colon$().init___()
  };
  return $n_sci_$colon$colon$
}
/** @constructor */
function $c_sci_NumericRange$() {
  $c_O.call(this);
  this.defaultOrdering$1 = null
}
$c_sci_NumericRange$.prototype = new $h_O();
$c_sci_NumericRange$.prototype.constructor = $c_sci_NumericRange$;
/** @constructor */
function $h_sci_NumericRange$() {
  /*<skip>*/
}
$h_sci_NumericRange$.prototype = $c_sci_NumericRange$.prototype;
$c_sci_NumericRange$.prototype.init___ = (function() {
  $n_sci_NumericRange$ = this;
  var $$this = $m_s_math_Numeric$IntIsIntegral$();
  var y = $m_s_math_Ordering$Int$();
  var jsx$4 = new $c_T2().init___O__O($$this, y);
  var $$this$1 = $m_s_math_Numeric$ShortIsIntegral$();
  var y$1 = $m_s_math_Ordering$Short$();
  var jsx$3 = new $c_T2().init___O__O($$this$1, y$1);
  var $$this$2 = $m_s_math_Numeric$ByteIsIntegral$();
  var y$2 = $m_s_math_Ordering$Byte$();
  var jsx$2 = new $c_T2().init___O__O($$this$2, y$2);
  var $$this$3 = $m_s_math_Numeric$CharIsIntegral$();
  var y$3 = $m_s_math_Ordering$Char$();
  var jsx$1 = new $c_T2().init___O__O($$this$3, y$3);
  var $$this$4 = $m_s_math_Numeric$LongIsIntegral$();
  var y$4 = $m_s_math_Ordering$Long$();
  var array = [jsx$4, jsx$3, jsx$2, jsx$1, new $c_T2().init___O__O($$this$4, y$4)];
  var this$12 = new $c_scm_MapBuilder().init___sc_GenMap($m_sci_Map$EmptyMap$());
  var i = 0;
  var len = $uI(array["length"]);
  while ((i < len)) {
    var index = i;
    var arg1 = array[index];
    this$12.$$plus$eq__T2__scm_MapBuilder($as_T2(arg1));
    i = ((1 + i) | 0)
  };
  this.defaultOrdering$1 = $as_sci_Map(this$12.elems$1);
  return this
});
$c_sci_NumericRange$.prototype.check$1__p1__O__s_math_Integral__O__O = (function(t, num$1, limit$1) {
  if ($s_s_math_Ordering$class__gt__s_math_Ordering__O__O__Z(num$1, t, limit$1)) {
    throw new $c_jl_IllegalArgumentException().init___T("More than Int.MaxValue elements.")
  } else {
    return t
  }
});
$c_sci_NumericRange$.prototype.count__O__O__O__Z__s_math_Integral__I = (function(start, end, step, isInclusive, num) {
  var zero = num.fromInt__I__O(0);
  var upward = $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(num, start, end);
  var posStep = $s_s_math_Ordering$class__gt__s_math_Ordering__O__O__Z(num, step, zero);
  if ($m_sr_BoxesRunTime$().equals__O__O__Z(step, zero)) {
    throw new $c_jl_IllegalArgumentException().init___T("step cannot be 0.")
  } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(start, end)) {
    return (isInclusive ? 1 : 0)
  } else if ((upward !== posStep)) {
    return 0
  } else {
    var startint = num.toInt__O__I(start);
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(start, num.fromInt__I__O(startint))) {
      var endint = num.toInt__O__I(end);
      if ($m_sr_BoxesRunTime$().equals__O__O__Z(end, num.fromInt__I__O(endint))) {
        var stepint = num.toInt__O__I(step);
        if ($m_sr_BoxesRunTime$().equals__O__O__Z(step, num.fromInt__I__O(stepint))) {
          if (isInclusive) {
            var isEmpty$4 = (((startint > endint) && (stepint > 0)) || ((startint < endint) && (stepint < 0)));
            if ((stepint === 0)) {
              var numRangeElements$4;
              throw new $c_jl_IllegalArgumentException().init___T("step cannot be 0.")
            } else if (isEmpty$4) {
              var numRangeElements$4 = 0
            } else {
              var len = new $c_sjsr_RuntimeLong().init___I__I__I(1, 0, 0).$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(endint).$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(startint)).$$div__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(stepint)));
              var numRangeElements$4 = (len.$$greater__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0)) ? (-1) : len.toInt__I())
            };
            if (isEmpty$4) {
              var lastElement$4 = ((startint - stepint) | 0)
            } else {
              switch (stepint) {
                case 1: {
                  var lastElement$4 = endint;
                  break
                }
                case (-1): {
                  var lastElement$4 = endint;
                  break
                }
                default: {
                  var remainder = new $c_sjsr_RuntimeLong().init___I(endint).$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(startint)).$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(stepint)).toInt__I();
                  var lastElement$4 = ((remainder !== 0) ? ((endint - remainder) | 0) : endint)
                }
              }
            };
            var terminalElement$4 = ((lastElement$4 + stepint) | 0);
            return ((numRangeElements$4 < 0) ? $m_sci_Range$().scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$(startint, endint, stepint, true) : numRangeElements$4)
          } else {
            var isEmpty$4$1 = ((((startint > endint) && (stepint > 0)) || ((startint < endint) && (stepint < 0))) || (startint === endint));
            if ((stepint === 0)) {
              var numRangeElements$4$1;
              throw new $c_jl_IllegalArgumentException().init___T("step cannot be 0.")
            } else if (isEmpty$4$1) {
              var numRangeElements$4$1 = 0
            } else {
              var len$1 = new $c_sjsr_RuntimeLong().init___I(endint).$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(startint)).$$div__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(stepint)).$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I((new $c_sjsr_RuntimeLong().init___I(endint).$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(startint)).$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(stepint)).notEquals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().Zero__sjsr_RuntimeLong()) ? 1 : 0)));
              var numRangeElements$4$1 = (len$1.$$greater__sjsr_RuntimeLong__Z(new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 511, 0)) ? (-1) : len$1.toInt__I())
            };
            if (isEmpty$4$1) {
              var lastElement$4$1 = ((startint - stepint) | 0)
            } else {
              switch (stepint) {
                case 1: {
                  var lastElement$4$1 = (((-1) + endint) | 0);
                  break
                }
                case (-1): {
                  var lastElement$4$1 = ((1 + endint) | 0);
                  break
                }
                default: {
                  var remainder$1 = new $c_sjsr_RuntimeLong().init___I(endint).$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(startint)).$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong(new $c_sjsr_RuntimeLong().init___I(stepint)).toInt__I();
                  var lastElement$4$1 = ((remainder$1 !== 0) ? ((endint - remainder$1) | 0) : ((endint - stepint) | 0))
                }
              }
            };
            var terminalElement$4$1 = ((lastElement$4$1 + stepint) | 0);
            return ((numRangeElements$4$1 < 0) ? $m_sci_Range$().scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$(startint, endint, stepint, false) : numRangeElements$4$1)
          }
        }
      }
    };
    var one = num.fromInt__I__O(1);
    var limit = num.fromInt__I__O(2147483647);
    var startside = $s_s_math_Numeric$class__signum__s_math_Numeric__O__I(num, start);
    var endside = $s_s_math_Numeric$class__signum__s_math_Numeric__O__I(num, end);
    if (($imul(startside, endside) >= 0)) {
      var diff = num.minus__O__O__O(end, start);
      var quotient = this.check$1__p1__O__s_math_Integral__O__O(num.quot__O__O__O(diff, step), num, limit);
      var remainder$2 = num.minus__O__O__O(diff, num.times__O__O__O(quotient, step));
      var jsx$1 = (((!isInclusive) && $m_sr_BoxesRunTime$().equals__O__O__Z(zero, remainder$2)) ? quotient : this.check$1__p1__O__s_math_Integral__O__O(num.plus__O__O__O(quotient, one), num, limit))
    } else {
      var negone = num.fromInt__I__O((-1));
      var startlim = (posStep ? negone : one);
      var startdiff = num.minus__O__O__O(startlim, start);
      var startq = this.check$1__p1__O__s_math_Integral__O__O(num.quot__O__O__O(startdiff, step), num, limit);
      var waypointA = ($m_sr_BoxesRunTime$().equals__O__O__Z(startq, zero) ? start : num.plus__O__O__O(start, num.times__O__O__O(startq, step)));
      var waypointB = num.plus__O__O__O(waypointA, step);
      if (($s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(num, waypointB, end) !== upward)) {
        var jsx$2 = ((isInclusive && $m_sr_BoxesRunTime$().equals__O__O__Z(waypointB, end)) ? num.plus__O__O__O(startq, num.fromInt__I__O(2)) : num.plus__O__O__O(startq, one))
      } else {
        var enddiff = num.minus__O__O__O(end, waypointB);
        var endq = this.check$1__p1__O__s_math_Integral__O__O(num.quot__O__O__O(enddiff, step), num, limit);
        var last = ($m_sr_BoxesRunTime$().equals__O__O__Z(endq, zero) ? waypointB : num.plus__O__O__O(waypointB, num.times__O__O__O(endq, step)));
        var jsx$2 = num.plus__O__O__O(startq, num.plus__O__O__O(endq, (((!isInclusive) && $m_sr_BoxesRunTime$().equals__O__O__Z(last, end)) ? one : num.fromInt__I__O(2))))
      };
      var jsx$1 = this.check$1__p1__O__s_math_Integral__O__O(jsx$2, num, limit)
    };
    return num.toInt__O__I(jsx$1)
  }
});
var $d_sci_NumericRange$ = new $TypeData().initClass({
  sci_NumericRange$: 0
}, false, "scala.collection.immutable.NumericRange$", {
  sci_NumericRange$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_NumericRange$.prototype.$classData = $d_sci_NumericRange$;
var $n_sci_NumericRange$ = (void 0);
function $m_sci_NumericRange$() {
  if ((!$n_sci_NumericRange$)) {
    $n_sci_NumericRange$ = new $c_sci_NumericRange$().init___()
  };
  return $n_sci_NumericRange$
}
/** @constructor */
function $c_sci_Range$() {
  $c_O.call(this);
  this.MAX$undPRINT$1 = 0
}
$c_sci_Range$.prototype = new $h_O();
$c_sci_Range$.prototype.constructor = $c_sci_Range$;
/** @constructor */
function $h_sci_Range$() {
  /*<skip>*/
}
$h_sci_Range$.prototype = $c_sci_Range$.prototype;
$c_sci_Range$.prototype.init___ = (function() {
  $n_sci_Range$ = this;
  this.MAX$undPRINT$1 = 512;
  return this
});
$c_sci_Range$.prototype.description__p1__I__I__I__Z__T = (function(start, end, step, isInclusive) {
  var this$2 = new $c_sci_StringOps().init___T("%d %s %d by %s");
  var array = [start, (isInclusive ? "to" : "until"), end, step];
  var jsx$3 = $m_sjsr_RuntimeString$();
  var jsx$2 = this$2.repr$1;
  var this$4 = $m_sc_Seq$();
  $m_sjs_js_WrappedArray$();
  var array$1 = [];
  $uI(array["length"]);
  var i = 0;
  var len = $uI(array["length"]);
  while ((i < len)) {
    var index = i;
    var arg1 = array[index];
    var elem = $s_sci_StringLike$class__unwrapArg__p0__sci_StringLike__O__O(this$2, arg1);
    array$1["push"](elem);
    i = ((1 + i) | 0)
  };
  $m_s_reflect_ManifestFactory$ObjectManifest$();
  var len$1 = $uI(array$1["length"]);
  var result = $newArrayObject($d_O.getArrayOf(), [len$1]);
  var len$2 = result.u["length"];
  var i$1 = 0;
  var j = 0;
  var $$this$1 = $uI(array$1["length"]);
  var $$this$2 = (($$this$1 < len$2) ? $$this$1 : len$2);
  var that = result.u["length"];
  var end$1 = (($$this$2 < that) ? $$this$2 : that);
  while ((i$1 < end$1)) {
    var jsx$1 = j;
    var index$1 = i$1;
    result.u[jsx$1] = array$1[index$1];
    i$1 = ((1 + i$1) | 0);
    j = ((1 + j) | 0)
  };
  return jsx$3.format__T__AO__T(jsx$2, result)
});
$c_sci_Range$.prototype.scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$ = (function(start, end, step, isInclusive) {
  throw new $c_jl_IllegalArgumentException().init___T((this.description__p1__I__I__I__Z__T(start, end, step, isInclusive) + ": seqs cannot contain more than Int.MaxValue elements."))
});
var $d_sci_Range$ = new $TypeData().initClass({
  sci_Range$: 0
}, false, "scala.collection.immutable.Range$", {
  sci_Range$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range$.prototype.$classData = $d_sci_Range$;
var $n_sci_Range$ = (void 0);
function $m_sci_Range$() {
  if ((!$n_sci_Range$)) {
    $n_sci_Range$ = new $c_sci_Range$().init___()
  };
  return $n_sci_Range$
}
/** @constructor */
function $c_sci_Stream$StreamCanBuildFrom() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sci_Stream$StreamCanBuildFrom.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sci_Stream$StreamCanBuildFrom.prototype.constructor = $c_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $h_sci_Stream$StreamCanBuildFrom() {
  /*<skip>*/
}
$h_sci_Stream$StreamCanBuildFrom.prototype = $c_sci_Stream$StreamCanBuildFrom.prototype;
$c_sci_Stream$StreamCanBuildFrom.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sci_Stream$());
  return this
});
var $d_sci_Stream$StreamCanBuildFrom = new $TypeData().initClass({
  sci_Stream$StreamCanBuildFrom: 0
}, false, "scala.collection.immutable.Stream$StreamCanBuildFrom", {
  sci_Stream$StreamCanBuildFrom: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sci_Stream$StreamCanBuildFrom.prototype.$classData = $d_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $c_scm_StringBuilder$() {
  $c_O.call(this)
}
$c_scm_StringBuilder$.prototype = new $h_O();
$c_scm_StringBuilder$.prototype.constructor = $c_scm_StringBuilder$;
/** @constructor */
function $h_scm_StringBuilder$() {
  /*<skip>*/
}
$h_scm_StringBuilder$.prototype = $c_scm_StringBuilder$.prototype;
var $d_scm_StringBuilder$ = new $TypeData().initClass({
  scm_StringBuilder$: 0
}, false, "scala.collection.mutable.StringBuilder$", {
  scm_StringBuilder$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder$.prototype.$classData = $d_scm_StringBuilder$;
var $n_scm_StringBuilder$ = (void 0);
function $m_scm_StringBuilder$() {
  if ((!$n_scm_StringBuilder$)) {
    $n_scm_StringBuilder$ = new $c_scm_StringBuilder$().init___()
  };
  return $n_scm_StringBuilder$
}
/** @constructor */
function $c_sjsr_AnonFunction0() {
  $c_sr_AbstractFunction0.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction0.prototype = new $h_sr_AbstractFunction0();
$c_sjsr_AnonFunction0.prototype.constructor = $c_sjsr_AnonFunction0;
/** @constructor */
function $h_sjsr_AnonFunction0() {
  /*<skip>*/
}
$h_sjsr_AnonFunction0.prototype = $c_sjsr_AnonFunction0.prototype;
$c_sjsr_AnonFunction0.prototype.apply__O = (function() {
  return (0, this.f$2)()
});
$c_sjsr_AnonFunction0.prototype.init___sjs_js_Function0 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction0 = new $TypeData().initClass({
  sjsr_AnonFunction0: 0
}, false, "scala.scalajs.runtime.AnonFunction0", {
  sjsr_AnonFunction0: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1
});
$c_sjsr_AnonFunction0.prototype.$classData = $d_sjsr_AnonFunction0;
/** @constructor */
function $c_sjsr_AnonFunction1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction1.prototype = new $h_sr_AbstractFunction1();
$c_sjsr_AnonFunction1.prototype.constructor = $c_sjsr_AnonFunction1;
/** @constructor */
function $h_sjsr_AnonFunction1() {
  /*<skip>*/
}
$h_sjsr_AnonFunction1.prototype = $c_sjsr_AnonFunction1.prototype;
$c_sjsr_AnonFunction1.prototype.apply__O__O = (function(arg1) {
  return (0, this.f$2)(arg1)
});
$c_sjsr_AnonFunction1.prototype.init___sjs_js_Function1 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction1 = new $TypeData().initClass({
  sjsr_AnonFunction1: 0
}, false, "scala.scalajs.runtime.AnonFunction1", {
  sjsr_AnonFunction1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1
});
$c_sjsr_AnonFunction1.prototype.$classData = $d_sjsr_AnonFunction1;
/** @constructor */
function $c_sjsr_AnonFunction2() {
  $c_sr_AbstractFunction2.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction2.prototype = new $h_sr_AbstractFunction2();
$c_sjsr_AnonFunction2.prototype.constructor = $c_sjsr_AnonFunction2;
/** @constructor */
function $h_sjsr_AnonFunction2() {
  /*<skip>*/
}
$h_sjsr_AnonFunction2.prototype = $c_sjsr_AnonFunction2.prototype;
$c_sjsr_AnonFunction2.prototype.init___sjs_js_Function2 = (function(f) {
  this.f$2 = f;
  return this
});
$c_sjsr_AnonFunction2.prototype.apply__O__O__O = (function(arg1, arg2) {
  return (0, this.f$2)(arg1, arg2)
});
var $d_sjsr_AnonFunction2 = new $TypeData().initClass({
  sjsr_AnonFunction2: 0
}, false, "scala.scalajs.runtime.AnonFunction2", {
  sjsr_AnonFunction2: 1,
  sr_AbstractFunction2: 1,
  O: 1,
  F2: 1
});
$c_sjsr_AnonFunction2.prototype.$classData = $d_sjsr_AnonFunction2;
/** @constructor */
function $c_sjsr_RuntimeLong() {
  $c_jl_Number.call(this);
  this.l$2 = 0;
  this.m$2 = 0;
  this.h$2 = 0
}
$c_sjsr_RuntimeLong.prototype = new $h_jl_Number();
$c_sjsr_RuntimeLong.prototype.constructor = $c_sjsr_RuntimeLong;
/** @constructor */
function $h_sjsr_RuntimeLong() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong.prototype = $c_sjsr_RuntimeLong.prototype;
$c_sjsr_RuntimeLong.prototype.longValue__J = (function() {
  return $uJ(this)
});
$c_sjsr_RuntimeLong.prototype.powerOfTwo__p2__I = (function() {
  return (((((this.h$2 === 0) && (this.m$2 === 0)) && (this.l$2 !== 0)) && ((this.l$2 & (((-1) + this.l$2) | 0)) === 0)) ? $m_jl_Integer$().numberOfTrailingZeros__I__I(this.l$2) : (((((this.h$2 === 0) && (this.m$2 !== 0)) && (this.l$2 === 0)) && ((this.m$2 & (((-1) + this.m$2) | 0)) === 0)) ? ((22 + $m_jl_Integer$().numberOfTrailingZeros__I__I(this.m$2)) | 0) : (((((this.h$2 !== 0) && (this.m$2 === 0)) && (this.l$2 === 0)) && ((this.h$2 & (((-1) + this.h$2) | 0)) === 0)) ? ((44 + $m_jl_Integer$().numberOfTrailingZeros__I__I(this.h$2)) | 0) : (-1))))
});
$c_sjsr_RuntimeLong.prototype.$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 | y.l$2), (this.m$2 | y.m$2), (this.h$2 | y.h$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$eq__sjsr_RuntimeLong__Z = (function(y) {
  return (((524288 & this.h$2) === 0) ? (((((524288 & y.h$2) !== 0) || (this.h$2 > y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 > y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 >= y.l$2))) : (!(((((524288 & y.h$2) === 0) || (this.h$2 < y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 < y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 < y.l$2)))))
});
$c_sjsr_RuntimeLong.prototype.byteValue__B = (function() {
  return this.toByte__B()
});
$c_sjsr_RuntimeLong.prototype.toShort__S = (function() {
  return ((this.toInt__I() << 16) >> 16)
});
$c_sjsr_RuntimeLong.prototype.equals__O__Z = (function(that) {
  if ($is_sjsr_RuntimeLong(that)) {
    var x2 = $as_sjsr_RuntimeLong(that);
    return this.equals__sjsr_RuntimeLong__Z(x2)
  } else {
    return false
  }
});
$c_sjsr_RuntimeLong.prototype.$$less__sjsr_RuntimeLong__Z = (function(y) {
  return y.$$greater__sjsr_RuntimeLong__Z(this)
});
$c_sjsr_RuntimeLong.prototype.toHexString__T = (function() {
  var mp = (this.m$2 >> 2);
  var lp = (this.l$2 | ((3 & this.m$2) << 22));
  if ((this.h$2 !== 0)) {
    var i = this.h$2;
    var x = $uD((i >>> 0));
    var jsx$5 = x["toString"](16);
    var jsx$4 = $as_T(jsx$5);
    var x$1 = $uD((mp >>> 0));
    var jsx$2 = x$1["toString"](16);
    var s = $as_T(jsx$2);
    var beginIndex = ((1 + $uI(s["length"])) | 0);
    var jsx$3 = $as_T("000000"["substring"](beginIndex));
    var x$2 = $uD((lp >>> 0));
    var jsx$1 = x$2["toString"](16);
    var s$1 = $as_T(jsx$1);
    var beginIndex$1 = $uI(s$1["length"]);
    return ((jsx$4 + (("" + jsx$3) + s)) + (("" + $as_T("000000"["substring"](beginIndex$1))) + s$1))
  } else if ((mp !== 0)) {
    var x$3 = $uD((mp >>> 0));
    var jsx$8 = x$3["toString"](16);
    var jsx$7 = $as_T(jsx$8);
    var x$4 = $uD((lp >>> 0));
    var jsx$6 = x$4["toString"](16);
    var s$2 = $as_T(jsx$6);
    var beginIndex$2 = $uI(s$2["length"]);
    return (jsx$7 + (("" + $as_T("000000"["substring"](beginIndex$2))) + s$2))
  } else {
    var x$5 = $uD((lp >>> 0));
    var jsx$9 = x$5["toString"](16);
    return $as_T(jsx$9)
  }
});
$c_sjsr_RuntimeLong.prototype.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  var _1 = (8191 & this.l$2);
  var _2 = ((this.l$2 >> 13) | ((15 & this.m$2) << 9));
  var _3 = (8191 & (this.m$2 >> 4));
  var _4 = ((this.m$2 >> 17) | ((255 & this.h$2) << 5));
  var _5 = ((1048320 & this.h$2) >> 8);
  var _1$1 = (8191 & y.l$2);
  var _2$1 = ((y.l$2 >> 13) | ((15 & y.m$2) << 9));
  var _3$1 = (8191 & (y.m$2 >> 4));
  var _4$1 = ((y.m$2 >> 17) | ((255 & y.h$2) << 5));
  var _5$1 = ((1048320 & y.h$2) >> 8);
  var p0 = $imul(_1, _1$1);
  var p1 = $imul(_2, _1$1);
  var p2 = $imul(_3, _1$1);
  var p3 = $imul(_4, _1$1);
  var p4 = $imul(_5, _1$1);
  if ((_2$1 !== 0)) {
    p1 = ((p1 + $imul(_1, _2$1)) | 0);
    p2 = ((p2 + $imul(_2, _2$1)) | 0);
    p3 = ((p3 + $imul(_3, _2$1)) | 0);
    p4 = ((p4 + $imul(_4, _2$1)) | 0)
  };
  if ((_3$1 !== 0)) {
    p2 = ((p2 + $imul(_1, _3$1)) | 0);
    p3 = ((p3 + $imul(_2, _3$1)) | 0);
    p4 = ((p4 + $imul(_3, _3$1)) | 0)
  };
  if ((_4$1 !== 0)) {
    p3 = ((p3 + $imul(_1, _4$1)) | 0);
    p4 = ((p4 + $imul(_2, _4$1)) | 0)
  };
  if ((_5$1 !== 0)) {
    p4 = ((p4 + $imul(_1, _5$1)) | 0)
  };
  var c00 = (4194303 & p0);
  var c01 = ((511 & p1) << 13);
  var c0 = ((c00 + c01) | 0);
  var c10 = (p0 >> 22);
  var c11 = (p1 >> 9);
  var c12 = ((262143 & p2) << 4);
  var c13 = ((31 & p3) << 17);
  var c1 = ((((((c10 + c11) | 0) + c12) | 0) + c13) | 0);
  var c22 = (p2 >> 18);
  var c23 = (p3 >> 5);
  var c24 = ((4095 & p4) << 8);
  var c2 = ((((c22 + c23) | 0) + c24) | 0);
  var c1n = ((c1 + (c0 >> 22)) | 0);
  var h = ((c2 + (c1n >> 22)) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & c0), (4194303 & c1n), (1048575 & h))
});
$c_sjsr_RuntimeLong.prototype.init___I__I__I = (function(l, m, h) {
  this.l$2 = l;
  this.m$2 = m;
  this.h$2 = h;
  return this
});
$c_sjsr_RuntimeLong.prototype.$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return $as_sjsr_RuntimeLong(this.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(y)[1])
});
$c_sjsr_RuntimeLong.prototype.toString__T = (function() {
  if ((((this.l$2 === 0) && (this.m$2 === 0)) && (this.h$2 === 0))) {
    return "0"
  } else if (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1)) {
    return "-9223372036854775808"
  } else if (((524288 & this.h$2) !== 0)) {
    return ("-" + this.unary$und$minus__sjsr_RuntimeLong().toString__T())
  } else {
    var tenPow9 = $m_sjsr_RuntimeLong$().TenPow9$1;
    var v = this;
    var acc = "";
    _toString0: while (true) {
      var this$1 = v;
      if ((((this$1.l$2 === 0) && (this$1.m$2 === 0)) && (this$1.h$2 === 0))) {
        return acc
      } else {
        var quotRem = v.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(tenPow9);
        var quot = $as_sjsr_RuntimeLong(quotRem[0]);
        var rem = $as_sjsr_RuntimeLong(quotRem[1]);
        var this$2 = rem.toInt__I();
        var digits = ("" + this$2);
        if ((((quot.l$2 === 0) && (quot.m$2 === 0)) && (quot.h$2 === 0))) {
          var zeroPrefix = ""
        } else {
          var beginIndex = $uI(digits["length"]);
          var zeroPrefix = $as_T("000000000"["substring"](beginIndex))
        };
        var temp$acc = ((zeroPrefix + digits) + acc);
        v = quot;
        acc = temp$acc;
        continue _toString0
      }
    }
  }
});
$c_sjsr_RuntimeLong.prototype.$$less$eq__sjsr_RuntimeLong__Z = (function(y) {
  return y.$$greater$eq__sjsr_RuntimeLong__Z(this)
});
$c_sjsr_RuntimeLong.prototype.compareTo__O__I = (function(x$1) {
  var that = $as_sjsr_RuntimeLong(x$1);
  return this.compareTo__sjsr_RuntimeLong__I($as_sjsr_RuntimeLong(that))
});
$c_sjsr_RuntimeLong.prototype.scala$scalajs$runtime$RuntimeLong$$setBit__I__sjsr_RuntimeLong = (function(bit) {
  return ((bit < 22) ? new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 | (1 << bit)), this.m$2, this.h$2) : ((bit < 44) ? new $c_sjsr_RuntimeLong().init___I__I__I(this.l$2, (this.m$2 | (1 << (((-22) + bit) | 0))), this.h$2) : new $c_sjsr_RuntimeLong().init___I__I__I(this.l$2, this.m$2, (this.h$2 | (1 << (((-44) + bit) | 0))))))
});
$c_sjsr_RuntimeLong.prototype.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array = (function(y) {
  if ((((y.l$2 === 0) && (y.m$2 === 0)) && (y.h$2 === 0))) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  } else if ((((this.l$2 === 0) && (this.m$2 === 0)) && (this.h$2 === 0))) {
    return [$m_sjsr_RuntimeLong$().Zero$1, $m_sjsr_RuntimeLong$().Zero$1]
  } else if (y.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1)) {
    return (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1) ? [$m_sjsr_RuntimeLong$().One$1, $m_sjsr_RuntimeLong$().Zero$1] : [$m_sjsr_RuntimeLong$().Zero$1, this])
  } else {
    var xNegative = ((524288 & this.h$2) !== 0);
    var yNegative = ((524288 & y.h$2) !== 0);
    var xMinValue = this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1);
    var pow = y.powerOfTwo__p2__I();
    if ((pow >= 0)) {
      if (xMinValue) {
        var z = this.$$greater$greater__I__sjsr_RuntimeLong(pow);
        return [(yNegative ? z.unary$und$minus__sjsr_RuntimeLong() : z), $m_sjsr_RuntimeLong$().Zero$1]
      } else {
        var absX = (((524288 & this.h$2) !== 0) ? this.unary$und$minus__sjsr_RuntimeLong() : this);
        var absZ = absX.$$greater$greater__I__sjsr_RuntimeLong(pow);
        var z$2 = ((xNegative !== yNegative) ? absZ.unary$und$minus__sjsr_RuntimeLong() : absZ);
        var remAbs = ((pow <= 22) ? new $c_sjsr_RuntimeLong().init___I__I__I((absX.l$2 & (((-1) + (1 << pow)) | 0)), 0, 0) : ((pow <= 44) ? new $c_sjsr_RuntimeLong().init___I__I__I(absX.l$2, (absX.m$2 & (((-1) + (1 << (((-22) + pow) | 0))) | 0)), 0) : new $c_sjsr_RuntimeLong().init___I__I__I(absX.l$2, absX.m$2, (absX.h$2 & (((-1) + (1 << (((-44) + pow) | 0))) | 0)))));
        var rem = (xNegative ? remAbs.unary$und$minus__sjsr_RuntimeLong() : remAbs);
        return [z$2, rem]
      }
    } else {
      var absY = (((524288 & y.h$2) !== 0) ? y.unary$und$minus__sjsr_RuntimeLong() : y);
      if (xMinValue) {
        var newX = $m_sjsr_RuntimeLong$().MaxValue$1
      } else {
        var absX$2 = (((524288 & this.h$2) !== 0) ? this.unary$und$minus__sjsr_RuntimeLong() : this);
        if (absY.$$greater__sjsr_RuntimeLong__Z(absX$2)) {
          var newX;
          return [$m_sjsr_RuntimeLong$().Zero$1, this]
        } else {
          var newX = absX$2
        }
      };
      var shift = ((absY.numberOfLeadingZeros__I() - newX.numberOfLeadingZeros__I()) | 0);
      var yShift = absY.$$less$less__I__sjsr_RuntimeLong(shift);
      var shift$1 = shift;
      var yShift$1 = yShift;
      var curX = newX;
      var quot = $m_sjsr_RuntimeLong$().Zero$1;
      x: {
        var x1_$_$$und1$f;
        var x1_$_$$und2$f;
        _divide0: while (true) {
          if ((shift$1 < 0)) {
            var jsx$1 = true
          } else {
            var this$1 = curX;
            var jsx$1 = (((this$1.l$2 === 0) && (this$1.m$2 === 0)) && (this$1.h$2 === 0))
          };
          if (jsx$1) {
            var _1 = quot;
            var _2 = curX;
            var x1_$_$$und1$f = _1;
            var x1_$_$$und2$f = _2;
            break x
          } else {
            var this$2 = curX;
            var y$1 = yShift$1;
            var newX$1 = this$2.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y$1.unary$und$minus__sjsr_RuntimeLong());
            if (((524288 & newX$1.h$2) === 0)) {
              var temp$shift = (((-1) + shift$1) | 0);
              var temp$yShift = yShift$1.$$greater$greater__I__sjsr_RuntimeLong(1);
              var temp$quot = quot.scala$scalajs$runtime$RuntimeLong$$setBit__I__sjsr_RuntimeLong(shift$1);
              shift$1 = temp$shift;
              yShift$1 = temp$yShift;
              curX = newX$1;
              quot = temp$quot;
              continue _divide0
            } else {
              var temp$shift$2 = (((-1) + shift$1) | 0);
              var temp$yShift$2 = yShift$1.$$greater$greater__I__sjsr_RuntimeLong(1);
              shift$1 = temp$shift$2;
              yShift$1 = temp$yShift$2;
              continue _divide0
            }
          }
        }
      };
      var absQuot = $as_sjsr_RuntimeLong(x1_$_$$und1$f);
      var absRem = $as_sjsr_RuntimeLong(x1_$_$$und2$f);
      var quot$1 = ((xNegative !== yNegative) ? absQuot.unary$und$minus__sjsr_RuntimeLong() : absQuot);
      if ((xNegative && xMinValue)) {
        var this$3 = absRem.unary$und$minus__sjsr_RuntimeLong();
        var y$2 = $m_sjsr_RuntimeLong$().One$1;
        var rem$1 = this$3.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y$2.unary$und$minus__sjsr_RuntimeLong())
      } else {
        var rem$1 = (xNegative ? absRem.unary$und$minus__sjsr_RuntimeLong() : absRem)
      };
      return [quot$1, rem$1]
    }
  }
});
$c_sjsr_RuntimeLong.prototype.$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 & y.l$2), (this.m$2 & y.m$2), (this.h$2 & y.h$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater$greater__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = ((this.l$2 >> n) | (this.m$2 << remBits));
    var m = ((this.m$2 >> n) | (this.h$2 << remBits));
    var h = ((this.h$2 >>> n) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var l$1 = ((this.m$2 >> shfBits) | (this.h$2 << remBits$2));
    var m$1 = ((this.h$2 >>> shfBits) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$1), (4194303 & m$1), 0)
  } else {
    var l$2 = ((this.h$2 >>> (((-44) + n) | 0)) | 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$2), 0, 0)
  }
});
$c_sjsr_RuntimeLong.prototype.compareTo__sjsr_RuntimeLong__I = (function(that) {
  return (this.equals__sjsr_RuntimeLong__Z(that) ? 0 : (this.$$greater__sjsr_RuntimeLong__Z(that) ? 1 : (-1)))
});
$c_sjsr_RuntimeLong.prototype.$$greater__sjsr_RuntimeLong__Z = (function(y) {
  return (((524288 & this.h$2) === 0) ? (((((524288 & y.h$2) !== 0) || (this.h$2 > y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 > y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 > y.l$2))) : (!(((((524288 & y.h$2) === 0) || (this.h$2 < y.h$2)) || ((this.h$2 === y.h$2) && (this.m$2 < y.m$2))) || (((this.h$2 === y.h$2) && (this.m$2 === y.m$2)) && (this.l$2 <= y.l$2)))))
});
$c_sjsr_RuntimeLong.prototype.$$less$less__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = (this.l$2 << n);
    var m = ((this.m$2 << n) | (this.l$2 >> remBits));
    var h = ((this.h$2 << n) | (this.m$2 >> remBits));
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var m$1 = (this.l$2 << shfBits);
    var h$1 = ((this.m$2 << shfBits) | (this.l$2 >> remBits$2));
    return new $c_sjsr_RuntimeLong().init___I__I__I(0, (4194303 & m$1), (1048575 & h$1))
  } else {
    var h$2 = (this.l$2 << (((-44) + n) | 0));
    return new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, (1048575 & h$2))
  }
});
$c_sjsr_RuntimeLong.prototype.toInt__I = (function() {
  return (this.l$2 | (this.m$2 << 22))
});
$c_sjsr_RuntimeLong.prototype.init___I = (function(value) {
  $c_sjsr_RuntimeLong.prototype.init___I__I__I.call(this, (4194303 & value), (4194303 & (value >> 22)), ((value < 0) ? 1048575 : 0));
  return this
});
$c_sjsr_RuntimeLong.prototype.notEquals__sjsr_RuntimeLong__Z = (function(that) {
  return (!this.equals__sjsr_RuntimeLong__Z(that))
});
$c_sjsr_RuntimeLong.prototype.unary$und$minus__sjsr_RuntimeLong = (function() {
  var neg0 = (4194303 & ((1 + (~this.l$2)) | 0));
  var neg1 = (4194303 & (((~this.m$2) + ((neg0 === 0) ? 1 : 0)) | 0));
  var neg2 = (1048575 & (((~this.h$2) + (((neg0 === 0) && (neg1 === 0)) ? 1 : 0)) | 0));
  return new $c_sjsr_RuntimeLong().init___I__I__I(neg0, neg1, neg2)
});
$c_sjsr_RuntimeLong.prototype.shortValue__S = (function() {
  return this.toShort__S()
});
$c_sjsr_RuntimeLong.prototype.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  var sum0 = ((this.l$2 + y.l$2) | 0);
  var sum1 = ((((this.m$2 + y.m$2) | 0) + (sum0 >> 22)) | 0);
  var sum2 = ((((this.h$2 + y.h$2) | 0) + (sum1 >> 22)) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & sum0), (4194303 & sum1), (1048575 & sum2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater__I__sjsr_RuntimeLong = (function(n_in) {
  var n = (63 & n_in);
  var negative = ((524288 & this.h$2) !== 0);
  var xh = (negative ? ((-1048576) | this.h$2) : this.h$2);
  if ((n < 22)) {
    var remBits = ((22 - n) | 0);
    var l = ((this.l$2 >> n) | (this.m$2 << remBits));
    var m = ((this.m$2 >> n) | (xh << remBits));
    var h = (xh >> n);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
  } else if ((n < 44)) {
    var shfBits = (((-22) + n) | 0);
    var remBits$2 = ((44 - n) | 0);
    var l$1 = ((this.m$2 >> shfBits) | (xh << remBits$2));
    var m$1 = (xh >> shfBits);
    var h$1 = (negative ? 1048575 : 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$1), (4194303 & m$1), (1048575 & h$1))
  } else {
    var l$2 = (xh >> (((-44) + n) | 0));
    var m$2 = (negative ? 4194303 : 0);
    var h$2 = (negative ? 1048575 : 0);
    return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l$2), (4194303 & m$2), (1048575 & h$2))
  }
});
$c_sjsr_RuntimeLong.prototype.toDouble__D = (function() {
  return (this.equals__sjsr_RuntimeLong__Z($m_sjsr_RuntimeLong$().MinValue$1) ? (-9.223372036854776E18) : (((524288 & this.h$2) !== 0) ? (-this.unary$und$minus__sjsr_RuntimeLong().toDouble__D()) : ((this.l$2 + (4194304.0 * this.m$2)) + (1.7592186044416E13 * this.h$2))))
});
$c_sjsr_RuntimeLong.prototype.$$div__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return $as_sjsr_RuntimeLong(this.scala$scalajs$runtime$RuntimeLong$$divMod__sjsr_RuntimeLong__sjs_js_Array(y)[0])
});
$c_sjsr_RuntimeLong.prototype.numberOfLeadingZeros__I = (function() {
  return ((this.h$2 !== 0) ? (((-12) + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.h$2)) | 0) : ((this.m$2 !== 0) ? ((10 + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.m$2)) | 0) : ((32 + $m_jl_Integer$().numberOfLeadingZeros__I__I(this.l$2)) | 0)))
});
$c_sjsr_RuntimeLong.prototype.toByte__B = (function() {
  return ((this.toInt__I() << 24) >> 24)
});
$c_sjsr_RuntimeLong.prototype.doubleValue__D = (function() {
  return this.toDouble__D()
});
$c_sjsr_RuntimeLong.prototype.hashCode__I = (function() {
  return this.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong(this.$$greater$greater$greater__I__sjsr_RuntimeLong(32)).toInt__I()
});
$c_sjsr_RuntimeLong.prototype.toOctalString__T = (function() {
  var lp = (2097151 & this.l$2);
  var mp = (((1048575 & this.m$2) << 1) | (this.l$2 >> 21));
  var hp = ((this.h$2 << 2) | (this.m$2 >> 20));
  if ((hp !== 0)) {
    var x = $uD((hp >>> 0));
    var jsx$5 = x["toString"](8);
    var jsx$4 = $as_T(jsx$5);
    var x$1 = $uD((mp >>> 0));
    var jsx$2 = x$1["toString"](8);
    var s = $as_T(jsx$2);
    var beginIndex = $uI(s["length"]);
    var jsx$3 = $as_T("0000000"["substring"](beginIndex));
    var x$2 = $uD((lp >>> 0));
    var jsx$1 = x$2["toString"](8);
    var s$1 = $as_T(jsx$1);
    var beginIndex$1 = $uI(s$1["length"]);
    return ((jsx$4 + (("" + jsx$3) + s)) + (("" + $as_T("0000000"["substring"](beginIndex$1))) + s$1))
  } else if ((mp !== 0)) {
    var x$3 = $uD((mp >>> 0));
    var jsx$8 = x$3["toString"](8);
    var jsx$7 = $as_T(jsx$8);
    var x$4 = $uD((lp >>> 0));
    var jsx$6 = x$4["toString"](8);
    var s$2 = $as_T(jsx$6);
    var beginIndex$2 = $uI(s$2["length"]);
    return (jsx$7 + (("" + $as_T("0000000"["substring"](beginIndex$2))) + s$2))
  } else {
    var x$5 = $uD((lp >>> 0));
    var jsx$9 = x$5["toString"](8);
    return $as_T(jsx$9)
  }
});
$c_sjsr_RuntimeLong.prototype.intValue__I = (function() {
  return this.toInt__I()
});
$c_sjsr_RuntimeLong.prototype.unary$und$tilde__sjsr_RuntimeLong = (function() {
  var l = (~this.l$2);
  var m = (~this.m$2);
  var h = (~this.h$2);
  return new $c_sjsr_RuntimeLong().init___I__I__I((4194303 & l), (4194303 & m), (1048575 & h))
});
$c_sjsr_RuntimeLong.prototype.compareTo__jl_Long__I = (function(that) {
  return this.compareTo__sjsr_RuntimeLong__I($as_sjsr_RuntimeLong(that))
});
$c_sjsr_RuntimeLong.prototype.floatValue__F = (function() {
  return this.toFloat__F()
});
$c_sjsr_RuntimeLong.prototype.$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return this.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong(y.unary$und$minus__sjsr_RuntimeLong())
});
$c_sjsr_RuntimeLong.prototype.toFloat__F = (function() {
  return $fround(this.toDouble__D())
});
$c_sjsr_RuntimeLong.prototype.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(y) {
  return new $c_sjsr_RuntimeLong().init___I__I__I((this.l$2 ^ y.l$2), (this.m$2 ^ y.m$2), (this.h$2 ^ y.h$2))
});
$c_sjsr_RuntimeLong.prototype.equals__sjsr_RuntimeLong__Z = (function(y) {
  return (((this.l$2 === y.l$2) && (this.m$2 === y.m$2)) && (this.h$2 === y.h$2))
});
function $is_sjsr_RuntimeLong(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjsr_RuntimeLong)))
}
function $as_sjsr_RuntimeLong(obj) {
  return (($is_sjsr_RuntimeLong(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.runtime.RuntimeLong"))
}
function $isArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjsr_RuntimeLong)))
}
function $asArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (($isArrayOf_sjsr_RuntimeLong(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.runtime.RuntimeLong;", depth))
}
var $d_sjsr_RuntimeLong = new $TypeData().initClass({
  sjsr_RuntimeLong: 0
}, false, "scala.scalajs.runtime.RuntimeLong", {
  sjsr_RuntimeLong: 1,
  jl_Number: 1,
  O: 1,
  jl_Comparable: 1
});
$c_sjsr_RuntimeLong.prototype.$classData = $d_sjsr_RuntimeLong;
/** @constructor */
function $c_sjsr_RuntimeLong$() {
  $c_O.call(this);
  this.BITS$1 = 0;
  this.BITS01$1 = 0;
  this.BITS2$1 = 0;
  this.MASK$1 = 0;
  this.MASK$und2$1 = 0;
  this.SIGN$undBIT$1 = 0;
  this.SIGN$undBIT$undVALUE$1 = 0;
  this.TWO$undPWR$und15$undDBL$1 = 0.0;
  this.TWO$undPWR$und16$undDBL$1 = 0.0;
  this.TWO$undPWR$und22$undDBL$1 = 0.0;
  this.TWO$undPWR$und31$undDBL$1 = 0.0;
  this.TWO$undPWR$und32$undDBL$1 = 0.0;
  this.TWO$undPWR$und44$undDBL$1 = 0.0;
  this.TWO$undPWR$und63$undDBL$1 = 0.0;
  this.Zero$1 = null;
  this.One$1 = null;
  this.MinusOne$1 = null;
  this.MinValue$1 = null;
  this.MaxValue$1 = null;
  this.TenPow9$1 = null
}
$c_sjsr_RuntimeLong$.prototype = new $h_O();
$c_sjsr_RuntimeLong$.prototype.constructor = $c_sjsr_RuntimeLong$;
/** @constructor */
function $h_sjsr_RuntimeLong$() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong$.prototype = $c_sjsr_RuntimeLong$.prototype;
$c_sjsr_RuntimeLong$.prototype.init___ = (function() {
  $n_sjsr_RuntimeLong$ = this;
  this.Zero$1 = new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, 0);
  this.One$1 = new $c_sjsr_RuntimeLong().init___I__I__I(1, 0, 0);
  this.MinusOne$1 = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 4194303, 1048575);
  this.MinValue$1 = new $c_sjsr_RuntimeLong().init___I__I__I(0, 0, 524288);
  this.MaxValue$1 = new $c_sjsr_RuntimeLong().init___I__I__I(4194303, 4194303, 524287);
  this.TenPow9$1 = new $c_sjsr_RuntimeLong().init___I__I__I(1755648, 238, 0);
  return this
});
$c_sjsr_RuntimeLong$.prototype.Zero__sjsr_RuntimeLong = (function() {
  return this.Zero$1
});
$c_sjsr_RuntimeLong$.prototype.fromDouble__D__sjsr_RuntimeLong = (function(value) {
  if ((value !== value)) {
    return this.Zero$1
  } else if ((value < (-9.223372036854776E18))) {
    return this.MinValue$1
  } else if ((value >= 9.223372036854776E18)) {
    return this.MaxValue$1
  } else if ((value < 0)) {
    return this.fromDouble__D__sjsr_RuntimeLong((-value)).unary$und$minus__sjsr_RuntimeLong()
  } else {
    var acc = value;
    var a2 = ((acc >= 1.7592186044416E13) ? $doubleToInt((acc / 1.7592186044416E13)) : 0);
    acc = (acc - (1.7592186044416E13 * a2));
    var a1 = ((acc >= 4194304.0) ? $doubleToInt((acc / 4194304.0)) : 0);
    acc = (acc - (4194304.0 * a1));
    var a0 = $doubleToInt(acc);
    return new $c_sjsr_RuntimeLong().init___I__I__I(a0, a1, a2)
  }
});
var $d_sjsr_RuntimeLong$ = new $TypeData().initClass({
  sjsr_RuntimeLong$: 0
}, false, "scala.scalajs.runtime.RuntimeLong$", {
  sjsr_RuntimeLong$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sjsr_RuntimeLong$.prototype.$classData = $d_sjsr_RuntimeLong$;
var $n_sjsr_RuntimeLong$ = (void 0);
function $m_sjsr_RuntimeLong$() {
  if ((!$n_sjsr_RuntimeLong$)) {
    $n_sjsr_RuntimeLong$ = new $c_sjsr_RuntimeLong$().init___()
  };
  return $n_sjsr_RuntimeLong$
}
var $d_sr_Nothing$ = new $TypeData().initClass({
  sr_Nothing$: 0
}, false, "scala.runtime.Nothing$", {
  sr_Nothing$: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
/** @constructor */
function $c_Ljava_io_FilterOutputStream() {
  $c_Ljava_io_OutputStream.call(this);
  this.out$2 = null
}
$c_Ljava_io_FilterOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_Ljava_io_FilterOutputStream.prototype.constructor = $c_Ljava_io_FilterOutputStream;
/** @constructor */
function $h_Ljava_io_FilterOutputStream() {
  /*<skip>*/
}
$h_Ljava_io_FilterOutputStream.prototype = $c_Ljava_io_FilterOutputStream.prototype;
$c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  this.out$2 = out;
  return this
});
function $is_T(obj) {
  return ((typeof obj) === "string")
}
function $as_T(obj) {
  return (($is_T(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.String"))
}
function $isArrayOf_T(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T)))
}
function $asArrayOf_T(obj, depth) {
  return (($isArrayOf_T(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.String;", depth))
}
var $d_T = new $TypeData().initClass({
  T: 0
}, false, "java.lang.String", {
  T: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_CharSequence: 1,
  jl_Comparable: 1
}, (void 0), (void 0), $is_T);
/** @constructor */
function $c_jl_AssertionError() {
  $c_jl_Error.call(this)
}
$c_jl_AssertionError.prototype = new $h_jl_Error();
$c_jl_AssertionError.prototype.constructor = $c_jl_AssertionError;
/** @constructor */
function $h_jl_AssertionError() {
  /*<skip>*/
}
$h_jl_AssertionError.prototype = $c_jl_AssertionError.prototype;
$c_jl_AssertionError.prototype.init___O = (function(o) {
  $c_jl_AssertionError.prototype.init___T.call(this, $objectToString(o));
  return this
});
var $d_jl_AssertionError = new $TypeData().initClass({
  jl_AssertionError: 0
}, false, "java.lang.AssertionError", {
  jl_AssertionError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_AssertionError.prototype.$classData = $d_jl_AssertionError;
/** @constructor */
function $c_jl_CloneNotSupportedException() {
  $c_jl_Exception.call(this)
}
$c_jl_CloneNotSupportedException.prototype = new $h_jl_Exception();
$c_jl_CloneNotSupportedException.prototype.constructor = $c_jl_CloneNotSupportedException;
/** @constructor */
function $h_jl_CloneNotSupportedException() {
  /*<skip>*/
}
$h_jl_CloneNotSupportedException.prototype = $c_jl_CloneNotSupportedException.prototype;
$c_jl_CloneNotSupportedException.prototype.init___ = (function() {
  $c_jl_CloneNotSupportedException.prototype.init___T.call(this, null);
  return this
});
var $d_jl_CloneNotSupportedException = new $TypeData().initClass({
  jl_CloneNotSupportedException: 0
}, false, "java.lang.CloneNotSupportedException", {
  jl_CloneNotSupportedException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_CloneNotSupportedException.prototype.$classData = $d_jl_CloneNotSupportedException;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  $c_Ljava_io_OutputStream.call(this)
}
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype;
var $d_jl_JSConsoleBasedPrintStream$DummyOutputStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream$DummyOutputStream", {
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1
});
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $c_jl_RuntimeException() {
  $c_jl_Exception.call(this)
}
$c_jl_RuntimeException.prototype = new $h_jl_Exception();
$c_jl_RuntimeException.prototype.constructor = $c_jl_RuntimeException;
/** @constructor */
function $h_jl_RuntimeException() {
  /*<skip>*/
}
$h_jl_RuntimeException.prototype = $c_jl_RuntimeException.prototype;
$c_jl_RuntimeException.prototype.init___ = (function() {
  $c_jl_RuntimeException.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_RuntimeException.prototype.init___T = (function(s) {
  $c_jl_RuntimeException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
/** @constructor */
function $c_jl_StringBuilder() {
  $c_O.call(this);
  this.content$1 = null
}
$c_jl_StringBuilder.prototype = new $h_O();
$c_jl_StringBuilder.prototype.constructor = $c_jl_StringBuilder;
/** @constructor */
function $h_jl_StringBuilder() {
  /*<skip>*/
}
$h_jl_StringBuilder.prototype = $c_jl_StringBuilder.prototype;
$c_jl_StringBuilder.prototype.init___ = (function() {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__T__jl_StringBuilder = (function(s) {
  this.content$1 = (("" + this.content$1) + ((s === null) ? "null" : s));
  return this
});
$c_jl_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var thiz = this.content$1;
  return $as_T(thiz["substring"](start, end))
});
$c_jl_StringBuilder.prototype.toString__T = (function() {
  return this.content$1
});
$c_jl_StringBuilder.prototype.init___jl_CharSequence = (function(csq) {
  $c_jl_StringBuilder.prototype.init___T.call(this, $objectToString(csq));
  return this
});
$c_jl_StringBuilder.prototype.append__jl_CharSequence__jl_Appendable = (function(csq) {
  return this.append__O__jl_StringBuilder(csq)
});
$c_jl_StringBuilder.prototype.append__O__jl_StringBuilder = (function(obj) {
  return ((obj === null) ? this.append__T__jl_StringBuilder(null) : this.append__T__jl_StringBuilder($objectToString(obj)))
});
$c_jl_StringBuilder.prototype.init___I = (function(initialCapacity) {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__jl_CharSequence__I__I__jl_StringBuilder = (function(csq, start, end) {
  return ((csq === null) ? this.append__jl_CharSequence__I__I__jl_StringBuilder("null", start, end) : this.append__T__jl_StringBuilder($objectToString($charSequenceSubSequence(csq, start, end))))
});
$c_jl_StringBuilder.prototype.append__C__jl_StringBuilder = (function(c) {
  return this.append__T__jl_StringBuilder($as_T($g["String"]["fromCharCode"](c)))
});
$c_jl_StringBuilder.prototype.init___T = (function(content) {
  this.content$1 = content;
  return this
});
$c_jl_StringBuilder.prototype.append__C__jl_Appendable = (function(c) {
  return this.append__C__jl_StringBuilder(c)
});
$c_jl_StringBuilder.prototype.reverse__jl_StringBuilder = (function() {
  var original = this.content$1;
  var result = "";
  var i = 0;
  while ((i < $uI(original["length"]))) {
    var index = i;
    var c = (65535 & $uI(original["charCodeAt"](index)));
    if ((((64512 & c) === 55296) && (((1 + i) | 0) < $uI(original["length"])))) {
      var index$1 = ((1 + i) | 0);
      var c2 = (65535 & $uI(original["charCodeAt"](index$1)));
      if (((64512 & c2) === 56320)) {
        result = ((("" + $as_T($g["String"]["fromCharCode"](c))) + $as_T($g["String"]["fromCharCode"](c2))) + result);
        i = ((2 + i) | 0)
      } else {
        result = (("" + $as_T($g["String"]["fromCharCode"](c))) + result);
        i = ((1 + i) | 0)
      }
    } else {
      result = (("" + $as_T($g["String"]["fromCharCode"](c))) + result);
      i = ((1 + i) | 0)
    }
  };
  this.content$1 = result;
  return this
});
var $d_jl_StringBuilder = new $TypeData().initClass({
  jl_StringBuilder: 0
}, false, "java.lang.StringBuilder", {
  jl_StringBuilder: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuilder.prototype.$classData = $d_jl_StringBuilder;
/** @constructor */
function $c_s_Array$() {
  $c_s_FallbackArrayBuilding.call(this)
}
$c_s_Array$.prototype = new $h_s_FallbackArrayBuilding();
$c_s_Array$.prototype.constructor = $c_s_Array$;
/** @constructor */
function $h_s_Array$() {
  /*<skip>*/
}
$h_s_Array$.prototype = $c_s_Array$.prototype;
$c_s_Array$.prototype.slowcopy__p2__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var i = srcPos;
  var j = destPos;
  var srcUntil = ((srcPos + length) | 0);
  while ((i < srcUntil)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(dest, j, $m_sr_ScalaRunTime$().array$undapply__O__I__O(src, i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
});
$c_s_Array$.prototype.copy__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var srcClass = $objectGetClass(src);
  if ((srcClass.isArray__Z() && $objectGetClass(dest).isAssignableFrom__jl_Class__Z(srcClass))) {
    $systemArraycopy(src, srcPos, dest, destPos, length)
  } else {
    this.slowcopy__p2__O__I__O__I__I__V(src, srcPos, dest, destPos, length)
  }
});
var $d_s_Array$ = new $TypeData().initClass({
  s_Array$: 0
}, false, "scala.Array$", {
  s_Array$: 1,
  s_FallbackArrayBuilding: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Array$.prototype.$classData = $d_s_Array$;
var $n_s_Array$ = (void 0);
function $m_s_Array$() {
  if ((!$n_s_Array$)) {
    $n_s_Array$ = new $c_s_Array$().init___()
  };
  return $n_s_Array$
}
/** @constructor */
function $c_s_Predef$$eq$colon$eq() {
  $c_O.call(this)
}
$c_s_Predef$$eq$colon$eq.prototype = new $h_O();
$c_s_Predef$$eq$colon$eq.prototype.constructor = $c_s_Predef$$eq$colon$eq;
/** @constructor */
function $h_s_Predef$$eq$colon$eq() {
  /*<skip>*/
}
$h_s_Predef$$eq$colon$eq.prototype = $c_s_Predef$$eq$colon$eq.prototype;
$c_s_Predef$$eq$colon$eq.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$eq$colon$eq.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_Predef$$less$colon$less() {
  $c_O.call(this)
}
$c_s_Predef$$less$colon$less.prototype = new $h_O();
$c_s_Predef$$less$colon$less.prototype.constructor = $c_s_Predef$$less$colon$less;
/** @constructor */
function $h_s_Predef$$less$colon$less() {
  /*<skip>*/
}
$h_s_Predef$$less$colon$less.prototype = $c_s_Predef$$less$colon$less.prototype;
$c_s_Predef$$less$colon$less.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$less$colon$less.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_math_Equiv$() {
  $c_O.call(this)
}
$c_s_math_Equiv$.prototype = new $h_O();
$c_s_math_Equiv$.prototype.constructor = $c_s_math_Equiv$;
/** @constructor */
function $h_s_math_Equiv$() {
  /*<skip>*/
}
$h_s_math_Equiv$.prototype = $c_s_math_Equiv$.prototype;
$c_s_math_Equiv$.prototype.init___ = (function() {
  $n_s_math_Equiv$ = this;
  return this
});
var $d_s_math_Equiv$ = new $TypeData().initClass({
  s_math_Equiv$: 0
}, false, "scala.math.Equiv$", {
  s_math_Equiv$: 1,
  O: 1,
  s_math_LowPriorityEquiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Equiv$.prototype.$classData = $d_s_math_Equiv$;
var $n_s_math_Equiv$ = (void 0);
function $m_s_math_Equiv$() {
  if ((!$n_s_math_Equiv$)) {
    $n_s_math_Equiv$ = new $c_s_math_Equiv$().init___()
  };
  return $n_s_math_Equiv$
}
/** @constructor */
function $c_s_math_Ordering$() {
  $c_O.call(this)
}
$c_s_math_Ordering$.prototype = new $h_O();
$c_s_math_Ordering$.prototype.constructor = $c_s_math_Ordering$;
/** @constructor */
function $h_s_math_Ordering$() {
  /*<skip>*/
}
$h_s_math_Ordering$.prototype = $c_s_math_Ordering$.prototype;
$c_s_math_Ordering$.prototype.init___ = (function() {
  $n_s_math_Ordering$ = this;
  return this
});
$c_s_math_Ordering$.prototype.by__F1__s_math_Ordering__s_math_Ordering = (function(f, ord) {
  var cmp = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, f$1, ord$1) {
    return (function(x$2, y$2) {
      return ord$1.lt__O__O__Z(f$1.apply__O__O(x$2), f$1.apply__O__O(y$2))
    })
  })(this, f, ord));
  return new $c_s_math_Ordering$$anon$9().init___F2(cmp)
});
var $d_s_math_Ordering$ = new $TypeData().initClass({
  s_math_Ordering$: 0
}, false, "scala.math.Ordering$", {
  s_math_Ordering$: 1,
  O: 1,
  s_math_LowPriorityOrderingImplicits: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$.prototype.$classData = $d_s_math_Ordering$;
var $n_s_math_Ordering$ = (void 0);
function $m_s_math_Ordering$() {
  if ((!$n_s_math_Ordering$)) {
    $n_s_math_Ordering$ = new $c_s_math_Ordering$().init___()
  };
  return $n_s_math_Ordering$
}
/** @constructor */
function $c_s_reflect_NoManifest$() {
  $c_O.call(this)
}
$c_s_reflect_NoManifest$.prototype = new $h_O();
$c_s_reflect_NoManifest$.prototype.constructor = $c_s_reflect_NoManifest$;
/** @constructor */
function $h_s_reflect_NoManifest$() {
  /*<skip>*/
}
$h_s_reflect_NoManifest$.prototype = $c_s_reflect_NoManifest$.prototype;
$c_s_reflect_NoManifest$.prototype.toString__T = (function() {
  return "<?>"
});
var $d_s_reflect_NoManifest$ = new $TypeData().initClass({
  s_reflect_NoManifest$: 0
}, false, "scala.reflect.NoManifest$", {
  s_reflect_NoManifest$: 1,
  O: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_reflect_NoManifest$.prototype.$classData = $d_s_reflect_NoManifest$;
var $n_s_reflect_NoManifest$ = (void 0);
function $m_s_reflect_NoManifest$() {
  if ((!$n_s_reflect_NoManifest$)) {
    $n_s_reflect_NoManifest$ = new $c_s_reflect_NoManifest$().init___()
  };
  return $n_s_reflect_NoManifest$
}
/** @constructor */
function $c_s_util_Random$() {
  $c_s_util_Random.call(this)
}
$c_s_util_Random$.prototype = new $h_s_util_Random();
$c_s_util_Random$.prototype.constructor = $c_s_util_Random$;
/** @constructor */
function $h_s_util_Random$() {
  /*<skip>*/
}
$h_s_util_Random$.prototype = $c_s_util_Random$.prototype;
var $d_s_util_Random$ = new $TypeData().initClass({
  s_util_Random$: 0
}, false, "scala.util.Random$", {
  s_util_Random$: 1,
  s_util_Random: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Random$.prototype.$classData = $d_s_util_Random$;
var $n_s_util_Random$ = (void 0);
function $m_s_util_Random$() {
  if ((!$n_s_util_Random$)) {
    $n_s_util_Random$ = new $c_s_util_Random$().init___()
  };
  return $n_s_util_Random$
}
/** @constructor */
function $c_sc_AbstractIterator() {
  $c_O.call(this)
}
$c_sc_AbstractIterator.prototype = new $h_O();
$c_sc_AbstractIterator.prototype.constructor = $c_sc_AbstractIterator;
/** @constructor */
function $h_sc_AbstractIterator() {
  /*<skip>*/
}
$h_sc_AbstractIterator.prototype = $c_sc_AbstractIterator.prototype;
$c_sc_AbstractIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.init___ = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.buffered__sc_BufferedIterator = (function() {
  return new $c_sc_Iterator$$anon$1().init___sc_Iterator(this)
});
$c_sc_AbstractIterator.prototype.toIterator__sc_Iterator = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.isEmpty__Z = (function() {
  return $s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)
});
$c_sc_AbstractIterator.prototype.mkString__T__T = (function(sep) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, "", sep, "")
});
$c_sc_AbstractIterator.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractIterator.prototype.toString__T = (function() {
  return $s_sc_Iterator$class__toString__sc_Iterator__T(this)
});
$c_sc_AbstractIterator.prototype.foreach__F1__V = (function(f) {
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this, f)
});
$c_sc_AbstractIterator.prototype.toVector__sci_Vector = (function() {
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  return $as_sci_Vector($s_sc_TraversableOnce$class__to__sc_TraversableOnce__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_AbstractIterator.prototype.$$plus$plus__F0__sc_Iterator = (function(that) {
  return new $c_sc_Iterator$JoinIterator().init___sc_Iterator__F0(this, that)
});
$c_sc_AbstractIterator.prototype.size__I = (function() {
  return $s_sc_TraversableOnce$class__size__sc_TraversableOnce__I(this)
});
$c_sc_AbstractIterator.prototype.toStream__sci_Stream = (function() {
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this)
});
$c_sc_AbstractIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractIterator.prototype.isTraversableAgain__Z = (function() {
  return false
});
/** @constructor */
function $c_sc_Iterator$ConcatIterator() {
  $c_O.call(this);
  this.current$1 = null;
  this.queue$1 = null
}
$c_sc_Iterator$ConcatIterator.prototype = new $h_O();
$c_sc_Iterator$ConcatIterator.prototype.constructor = $c_sc_Iterator$ConcatIterator;
/** @constructor */
function $h_sc_Iterator$ConcatIterator() {
  /*<skip>*/
}
$h_sc_Iterator$ConcatIterator.prototype = $c_sc_Iterator$ConcatIterator.prototype;
$c_sc_Iterator$ConcatIterator.prototype.advance__p1__Z = (function() {
  _advance: while (true) {
    var this$1 = this.queue$1;
    if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this$1)) {
      this.current$1 = null;
      return false
    } else {
      this.current$1 = $as_sc_Iterator($as_F0(this.queue$1.head__O()).apply__O());
      this.queue$1 = this.queue$1.tail__sci_Vector();
      if (this.current$1.hasNext__Z()) {
        return true
      } else {
        continue _advance
      }
    }
  }
});
$c_sc_Iterator$ConcatIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_Iterator$ConcatIterator.prototype.next__O = (function() {
  return (this.hasNext__Z() ? this.current$1.next__O() : $m_sc_Iterator$().empty$1.next__O())
});
$c_sc_Iterator$ConcatIterator.prototype.buffered__sc_BufferedIterator = (function() {
  return new $c_sc_Iterator$$anon$1().init___sc_Iterator(this)
});
$c_sc_Iterator$ConcatIterator.prototype.toIterator__sc_Iterator = (function() {
  return this
});
$c_sc_Iterator$ConcatIterator.prototype.isEmpty__Z = (function() {
  return $s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)
});
$c_sc_Iterator$ConcatIterator.prototype.mkString__T__T = (function(sep) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, "", sep, "")
});
$c_sc_Iterator$ConcatIterator.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_Iterator$ConcatIterator.prototype.toString__T = (function() {
  return $s_sc_Iterator$class__toString__sc_Iterator__T(this)
});
$c_sc_Iterator$ConcatIterator.prototype.foreach__F1__V = (function(f) {
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this, f)
});
$c_sc_Iterator$ConcatIterator.prototype.toVector__sci_Vector = (function() {
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  return $as_sci_Vector($s_sc_TraversableOnce$class__to__sc_TraversableOnce__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_Iterator$ConcatIterator.prototype.$$plus$plus__F0__sc_Iterator = (function(that) {
  return new $c_sc_Iterator$ConcatIterator().init___sc_Iterator__sci_Vector(this.current$1, $as_sci_Vector(this.queue$1.$$colon$plus__O__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, that$1) {
    return (function() {
      return $as_sc_GenTraversableOnce(that$1.apply__O()).toIterator__sc_Iterator()
    })
  })(this, that)), ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6))))
});
$c_sc_Iterator$ConcatIterator.prototype.size__I = (function() {
  return $s_sc_TraversableOnce$class__size__sc_TraversableOnce__I(this)
});
$c_sc_Iterator$ConcatIterator.prototype.hasNext__Z = (function() {
  return ((this.current$1 !== null) && (this.current$1.hasNext__Z() || this.advance__p1__Z()))
});
$c_sc_Iterator$ConcatIterator.prototype.toStream__sci_Stream = (function() {
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this)
});
$c_sc_Iterator$ConcatIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_Iterator$ConcatIterator.prototype.isTraversableAgain__Z = (function() {
  return false
});
$c_sc_Iterator$ConcatIterator.prototype.init___sc_Iterator__sci_Vector = (function(current, initial) {
  this.current$1 = current;
  this.queue$1 = initial;
  return this
});
var $d_sc_Iterator$ConcatIterator = new $TypeData().initClass({
  sc_Iterator$ConcatIterator: 0
}, false, "scala.collection.Iterator$ConcatIterator", {
  sc_Iterator$ConcatIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$ConcatIterator.prototype.$classData = $d_sc_Iterator$ConcatIterator;
/** @constructor */
function $c_sc_Iterator$JoinIterator() {
  $c_O.call(this);
  this.lhs$1 = null;
  this.that$1 = null;
  this.rhs$1 = null;
  this.bitmap$0$1 = false
}
$c_sc_Iterator$JoinIterator.prototype = new $h_O();
$c_sc_Iterator$JoinIterator.prototype.constructor = $c_sc_Iterator$JoinIterator;
/** @constructor */
function $h_sc_Iterator$JoinIterator() {
  /*<skip>*/
}
$h_sc_Iterator$JoinIterator.prototype = $c_sc_Iterator$JoinIterator.prototype;
$c_sc_Iterator$JoinIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_Iterator$JoinIterator.prototype.next__O = (function() {
  return (this.lhs$1.hasNext__Z() ? this.lhs$1.next__O() : this.rhs__p1__sc_Iterator().next__O())
});
$c_sc_Iterator$JoinIterator.prototype.rhs$lzycompute__p1__sc_Iterator = (function() {
  if ((!this.bitmap$0$1)) {
    this.rhs$1 = $as_sc_GenTraversableOnce(this.that$1.apply__O()).toIterator__sc_Iterator();
    this.bitmap$0$1 = true
  };
  this.that$1 = null;
  return this.rhs$1
});
$c_sc_Iterator$JoinIterator.prototype.buffered__sc_BufferedIterator = (function() {
  return new $c_sc_Iterator$$anon$1().init___sc_Iterator(this)
});
$c_sc_Iterator$JoinIterator.prototype.toIterator__sc_Iterator = (function() {
  return this
});
$c_sc_Iterator$JoinIterator.prototype.isEmpty__Z = (function() {
  return $s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)
});
$c_sc_Iterator$JoinIterator.prototype.mkString__T__T = (function(sep) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, "", sep, "")
});
$c_sc_Iterator$JoinIterator.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_Iterator$JoinIterator.prototype.toString__T = (function() {
  return $s_sc_Iterator$class__toString__sc_Iterator__T(this)
});
$c_sc_Iterator$JoinIterator.prototype.foreach__F1__V = (function(f) {
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this, f)
});
$c_sc_Iterator$JoinIterator.prototype.toVector__sci_Vector = (function() {
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  return $as_sci_Vector($s_sc_TraversableOnce$class__to__sc_TraversableOnce__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_Iterator$JoinIterator.prototype.$$plus$plus__F0__sc_Iterator = (function(that) {
  return this.$$plus$plus__F0__sc_Iterator$ConcatIterator(that)
});
$c_sc_Iterator$JoinIterator.prototype.size__I = (function() {
  return $s_sc_TraversableOnce$class__size__sc_TraversableOnce__I(this)
});
$c_sc_Iterator$JoinIterator.prototype.hasNext__Z = (function() {
  return (this.lhs$1.hasNext__Z() || this.rhs__p1__sc_Iterator().hasNext__Z())
});
$c_sc_Iterator$JoinIterator.prototype.toStream__sci_Stream = (function() {
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this)
});
$c_sc_Iterator$JoinIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_Iterator$JoinIterator.prototype.isTraversableAgain__Z = (function() {
  return false
});
$c_sc_Iterator$JoinIterator.prototype.$$plus$plus__F0__sc_Iterator$ConcatIterator = (function(that) {
  var this$1 = $m_s_package$().Vector$1;
  var array = [new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, that$1) {
    return (function() {
      return $as_sc_GenTraversableOnce(that$1.apply__O()).toIterator__sc_Iterator()
    })
  })(this, that))];
  if (($uI(array["length"]) === 0)) {
    var jsx$1 = this$1.NIL$6
  } else {
    var b = new $c_sci_VectorBuilder().init___();
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__O__sci_VectorBuilder(arg1);
      i = ((1 + i) | 0)
    };
    var jsx$1 = b.result__sci_Vector()
  };
  return new $c_sc_Iterator$ConcatIterator().init___sc_Iterator__sci_Vector(this, jsx$1)
});
$c_sc_Iterator$JoinIterator.prototype.rhs__p1__sc_Iterator = (function() {
  return ((!this.bitmap$0$1) ? this.rhs$lzycompute__p1__sc_Iterator() : this.rhs$1)
});
$c_sc_Iterator$JoinIterator.prototype.init___sc_Iterator__F0 = (function(lhs, that) {
  this.lhs$1 = lhs;
  this.that$1 = that;
  return this
});
var $d_sc_Iterator$JoinIterator = new $TypeData().initClass({
  sc_Iterator$JoinIterator: 0
}, false, "scala.collection.Iterator$JoinIterator", {
  sc_Iterator$JoinIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$JoinIterator.prototype.$classData = $d_sc_Iterator$JoinIterator;
/** @constructor */
function $c_scg_SetFactory() {
  $c_scg_GenSetFactory.call(this)
}
$c_scg_SetFactory.prototype = new $h_scg_GenSetFactory();
$c_scg_SetFactory.prototype.constructor = $c_scg_SetFactory;
/** @constructor */
function $h_scg_SetFactory() {
  /*<skip>*/
}
$h_scg_SetFactory.prototype = $c_scg_SetFactory.prototype;
/** @constructor */
function $c_sci_ListSet$ListSetBuilder() {
  $c_O.call(this);
  this.elems$1 = null;
  this.seen$1 = null
}
$c_sci_ListSet$ListSetBuilder.prototype = new $h_O();
$c_sci_ListSet$ListSetBuilder.prototype.constructor = $c_sci_ListSet$ListSetBuilder;
/** @constructor */
function $h_sci_ListSet$ListSetBuilder() {
  /*<skip>*/
}
$h_sci_ListSet$ListSetBuilder.prototype = $c_sci_ListSet$ListSetBuilder.prototype;
$c_sci_ListSet$ListSetBuilder.prototype.result__sci_ListSet = (function() {
  var this$2 = this.elems$1;
  var z = $m_sci_ListSet$EmptyListSet$();
  var this$3 = this$2.scala$collection$mutable$ListBuffer$$start$6;
  var acc = z;
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = acc;
    var arg2 = these.head__O();
    var x$1 = $as_sci_ListSet(arg1);
    acc = new $c_sci_ListSet$Node().init___sci_ListSet__O(x$1, arg2);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return $as_sci_ListSet(acc)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___ = (function() {
  $c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet.call(this, $m_sci_ListSet$EmptyListSet$());
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet = (function(initial) {
  var this$1 = new $c_scm_ListBuffer().init___().$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(initial);
  this.elems$1 = $as_scm_ListBuffer($s_sc_SeqLike$class__reverse__sc_SeqLike__O(this$1));
  var this$2 = new $c_scm_HashSet().init___();
  this.seen$1 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$2, initial));
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.result__O = (function() {
  return this.result__sci_ListSet()
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__sci_ListSet$ListSetBuilder = (function(x) {
  var this$1 = this.seen$1;
  if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, x))) {
    this.elems$1.$$plus$eq__O__scm_ListBuffer(x);
    this.seen$1.$$plus$eq__O__scm_HashSet(x)
  };
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_sci_ListSet$ListSetBuilder = new $TypeData().initClass({
  sci_ListSet$ListSetBuilder: 0
}, false, "scala.collection.immutable.ListSet$ListSetBuilder", {
  sci_ListSet$ListSetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_ListSet$ListSetBuilder.prototype.$classData = $d_sci_ListSet$ListSetBuilder;
/** @constructor */
function $c_sci_Map$() {
  $c_scg_ImmutableMapFactory.call(this)
}
$c_sci_Map$.prototype = new $h_scg_ImmutableMapFactory();
$c_sci_Map$.prototype.constructor = $c_sci_Map$;
/** @constructor */
function $h_sci_Map$() {
  /*<skip>*/
}
$h_sci_Map$.prototype = $c_sci_Map$.prototype;
$c_sci_Map$.prototype.empty__sc_GenMap = (function() {
  return $m_sci_Map$EmptyMap$()
});
var $d_sci_Map$ = new $TypeData().initClass({
  sci_Map$: 0
}, false, "scala.collection.immutable.Map$", {
  sci_Map$: 1,
  scg_ImmutableMapFactory: 1,
  scg_MapFactory: 1,
  scg_GenMapFactory: 1,
  O: 1
});
$c_sci_Map$.prototype.$classData = $d_sci_Map$;
var $n_sci_Map$ = (void 0);
function $m_sci_Map$() {
  if ((!$n_sci_Map$)) {
    $n_sci_Map$ = new $c_sci_Map$().init___()
  };
  return $n_sci_Map$
}
/** @constructor */
function $c_scm_GrowingBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_GrowingBuilder.prototype = new $h_O();
$c_scm_GrowingBuilder.prototype.constructor = $c_scm_GrowingBuilder;
/** @constructor */
function $h_scm_GrowingBuilder() {
  /*<skip>*/
}
$h_scm_GrowingBuilder.prototype = $c_scm_GrowingBuilder.prototype;
$c_scm_GrowingBuilder.prototype.init___scg_Growable = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_GrowingBuilder = (function(x) {
  this.elems$1.$$plus$eq__O__scg_Growable(x);
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_GrowingBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_GrowingBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_GrowingBuilder = new $TypeData().initClass({
  scm_GrowingBuilder: 0
}, false, "scala.collection.mutable.GrowingBuilder", {
  scm_GrowingBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_GrowingBuilder.prototype.$classData = $d_scm_GrowingBuilder;
/** @constructor */
function $c_scm_LazyBuilder() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_scm_LazyBuilder.prototype = new $h_O();
$c_scm_LazyBuilder.prototype.constructor = $c_scm_LazyBuilder;
/** @constructor */
function $h_scm_LazyBuilder() {
  /*<skip>*/
}
$h_scm_LazyBuilder.prototype = $c_scm_LazyBuilder.prototype;
$c_scm_LazyBuilder.prototype.init___ = (function() {
  this.parts$1 = new $c_scm_ListBuffer().init___();
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder = (function(xs) {
  this.parts$1.$$plus$eq__O__scm_ListBuffer(xs);
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_LazyBuilder = (function(x) {
  var jsx$1 = this.parts$1;
  $m_sci_List$();
  var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([x]);
  var this$2 = $m_sci_List$();
  var cbf = this$2.ReusableCBFInstance$2;
  jsx$1.$$plus$eq__O__scm_ListBuffer($as_sci_List($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(xs, cbf)));
  return this
});
$c_scm_LazyBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder(xs)
});
/** @constructor */
function $c_scm_MapBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_MapBuilder.prototype = new $h_O();
$c_scm_MapBuilder.prototype.constructor = $c_scm_MapBuilder;
/** @constructor */
function $h_scm_MapBuilder() {
  /*<skip>*/
}
$h_scm_MapBuilder.prototype = $c_scm_MapBuilder.prototype;
$c_scm_MapBuilder.prototype.$$plus$eq__T2__scm_MapBuilder = (function(x) {
  this.elems$1 = this.elems$1.$$plus__T2__sc_GenMap(x);
  return this
});
$c_scm_MapBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__T2__scm_MapBuilder($as_T2(elem))
});
$c_scm_MapBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_MapBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_MapBuilder.prototype.init___sc_GenMap = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_MapBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__T2__scm_MapBuilder($as_T2(elem))
});
$c_scm_MapBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_MapBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_MapBuilder = new $TypeData().initClass({
  scm_MapBuilder: 0
}, false, "scala.collection.mutable.MapBuilder", {
  scm_MapBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_MapBuilder.prototype.$classData = $d_scm_MapBuilder;
/** @constructor */
function $c_scm_SetBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_SetBuilder.prototype = new $h_O();
$c_scm_SetBuilder.prototype.constructor = $c_scm_SetBuilder;
/** @constructor */
function $h_scm_SetBuilder() {
  /*<skip>*/
}
$h_scm_SetBuilder.prototype = $c_scm_SetBuilder.prototype;
$c_scm_SetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_SetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_SetBuilder = (function(x) {
  this.elems$1 = this.elems$1.$$plus__O__sc_Set(x);
  return this
});
$c_scm_SetBuilder.prototype.init___sc_Set = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_SetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_SetBuilder = new $TypeData().initClass({
  scm_SetBuilder: 0
}, false, "scala.collection.mutable.SetBuilder", {
  scm_SetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_SetBuilder.prototype.$classData = $d_scm_SetBuilder;
/** @constructor */
function $c_Lexample_BPMChange() {
  $c_O.call(this);
  this.beat$1 = 0.0;
  this.bpm$1 = 0.0
}
$c_Lexample_BPMChange.prototype = new $h_O();
$c_Lexample_BPMChange.prototype.constructor = $c_Lexample_BPMChange;
/** @constructor */
function $h_Lexample_BPMChange() {
  /*<skip>*/
}
$h_Lexample_BPMChange.prototype = $c_Lexample_BPMChange.prototype;
$c_Lexample_BPMChange.prototype.productPrefix__T = (function() {
  return "BPMChange"
});
$c_Lexample_BPMChange.prototype.productArity__I = (function() {
  return 2
});
$c_Lexample_BPMChange.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_BPMChange(x$1)) {
    var BPMChange$1 = $as_Lexample_BPMChange(x$1);
    return ((this.beat$1 === BPMChange$1.beat$1) && (this.bpm$1 === BPMChange$1.bpm$1))
  } else {
    return false
  }
});
$c_Lexample_BPMChange.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.beat$1;
      break
    }
    case 1: {
      return this.bpm$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_BPMChange.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_BPMChange.prototype.init___D__D = (function(beat, bpm) {
  this.beat$1 = beat;
  this.bpm$1 = bpm;
  return this
});
$c_Lexample_BPMChange.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.beat$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.bpm$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lexample_BPMChange.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_BPMChange(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_BPMChange)))
}
function $as_Lexample_BPMChange(obj) {
  return (($is_Lexample_BPMChange(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.BPMChange"))
}
function $isArrayOf_Lexample_BPMChange(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_BPMChange)))
}
function $asArrayOf_Lexample_BPMChange(obj, depth) {
  return (($isArrayOf_Lexample_BPMChange(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.BPMChange;", depth))
}
var $d_Lexample_BPMChange = new $TypeData().initClass({
  Lexample_BPMChange: 0
}, false, "example.BPMChange", {
  Lexample_BPMChange: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_BPMChange.prototype.$classData = $d_Lexample_BPMChange;
/** @constructor */
function $c_Lexample_BPMMarker() {
  $c_O.call(this);
  this.beatStart$1 = 0.0;
  this.beatEnd$1 = 0.0;
  this.bpm$1 = 0.0;
  this.startTime$1 = 0.0
}
$c_Lexample_BPMMarker.prototype = new $h_O();
$c_Lexample_BPMMarker.prototype.constructor = $c_Lexample_BPMMarker;
/** @constructor */
function $h_Lexample_BPMMarker() {
  /*<skip>*/
}
$h_Lexample_BPMMarker.prototype = $c_Lexample_BPMMarker.prototype;
$c_Lexample_BPMMarker.prototype.productPrefix__T = (function() {
  return "BPMMarker"
});
$c_Lexample_BPMMarker.prototype.init___D__D__D__D = (function(beatStart, beatEnd, bpm, startTime) {
  this.beatStart$1 = beatStart;
  this.beatEnd$1 = beatEnd;
  this.bpm$1 = bpm;
  this.startTime$1 = startTime;
  return this
});
$c_Lexample_BPMMarker.prototype.productArity__I = (function() {
  return 4
});
$c_Lexample_BPMMarker.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_BPMMarker(x$1)) {
    var BPMMarker$1 = $as_Lexample_BPMMarker(x$1);
    return ((((this.beatStart$1 === BPMMarker$1.beatStart$1) && (this.beatEnd$1 === BPMMarker$1.beatEnd$1)) && (this.bpm$1 === BPMMarker$1.bpm$1)) && (this.startTime$1 === BPMMarker$1.startTime$1))
  } else {
    return false
  }
});
$c_Lexample_BPMMarker.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.beatStart$1;
      break
    }
    case 1: {
      return this.beatEnd$1;
      break
    }
    case 2: {
      return this.bpm$1;
      break
    }
    case 3: {
      return this.startTime$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_BPMMarker.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_BPMMarker.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.beatStart$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.beatEnd$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.bpm$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.startTime$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 4)
});
$c_Lexample_BPMMarker.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_BPMMarker(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_BPMMarker)))
}
function $as_Lexample_BPMMarker(obj) {
  return (($is_Lexample_BPMMarker(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.BPMMarker"))
}
function $isArrayOf_Lexample_BPMMarker(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_BPMMarker)))
}
function $asArrayOf_Lexample_BPMMarker(obj, depth) {
  return (($isArrayOf_Lexample_BPMMarker(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.BPMMarker;", depth))
}
var $d_Lexample_BPMMarker = new $TypeData().initClass({
  Lexample_BPMMarker: 0
}, false, "example.BPMMarker", {
  Lexample_BPMMarker: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_BPMMarker.prototype.$classData = $d_Lexample_BPMMarker;
/** @constructor */
function $c_Lexample_ChildObject() {
  $c_O.call(this);
  this.pX$1 = 0.0;
  this.pY$1 = 0.0;
  this.pW$1 = 0.0;
  this.pH$1 = 0.0;
  this.renderObject$1 = null
}
$c_Lexample_ChildObject.prototype = new $h_O();
$c_Lexample_ChildObject.prototype.constructor = $c_Lexample_ChildObject;
/** @constructor */
function $h_Lexample_ChildObject() {
  /*<skip>*/
}
$h_Lexample_ChildObject.prototype = $c_Lexample_ChildObject.prototype;
$c_Lexample_ChildObject.prototype.productPrefix__T = (function() {
  return "ChildObject"
});
$c_Lexample_ChildObject.prototype.productArity__I = (function() {
  return 5
});
$c_Lexample_ChildObject.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_ChildObject(x$1)) {
    var ChildObject$1 = $as_Lexample_ChildObject(x$1);
    if (((((this.pX$1 === ChildObject$1.pX$1) && (this.pY$1 === ChildObject$1.pY$1)) && (this.pW$1 === ChildObject$1.pW$1)) && (this.pH$1 === ChildObject$1.pH$1))) {
      var x = this.renderObject$1;
      var x$2 = ChildObject$1.renderObject$1;
      return (x === x$2)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lexample_ChildObject.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.pX$1;
      break
    }
    case 1: {
      return this.pY$1;
      break
    }
    case 2: {
      return this.pW$1;
      break
    }
    case 3: {
      return this.pH$1;
      break
    }
    case 4: {
      return this.renderObject$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_ChildObject.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_ChildObject.prototype.init___D__D__D__D__Lexample_RenderObject = (function(pX, pY, pW, pH, renderObject) {
  this.pX$1 = pX;
  this.pY$1 = pY;
  this.pW$1 = pW;
  this.pH$1 = pH;
  this.renderObject$1 = renderObject;
  return this
});
$c_Lexample_ChildObject.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.pX$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.pY$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.pW$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.pH$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.renderObject$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 5)
});
$c_Lexample_ChildObject.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_ChildObject(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_ChildObject)))
}
function $as_Lexample_ChildObject(obj) {
  return (($is_Lexample_ChildObject(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.ChildObject"))
}
function $isArrayOf_Lexample_ChildObject(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_ChildObject)))
}
function $asArrayOf_Lexample_ChildObject(obj, depth) {
  return (($isArrayOf_Lexample_ChildObject(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.ChildObject;", depth))
}
var $d_Lexample_ChildObject = new $TypeData().initClass({
  Lexample_ChildObject: 0
}, false, "example.ChildObject", {
  Lexample_ChildObject: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_ChildObject.prototype.$classData = $d_Lexample_ChildObject;
/** @constructor */
function $c_Lexample_MeasureMarker() {
  $c_O.call(this);
  this.measure$1 = 0;
  this.beat$1 = 0;
  this.meter$1 = 0
}
$c_Lexample_MeasureMarker.prototype = new $h_O();
$c_Lexample_MeasureMarker.prototype.constructor = $c_Lexample_MeasureMarker;
/** @constructor */
function $h_Lexample_MeasureMarker() {
  /*<skip>*/
}
$h_Lexample_MeasureMarker.prototype = $c_Lexample_MeasureMarker.prototype;
$c_Lexample_MeasureMarker.prototype.productPrefix__T = (function() {
  return "MeasureMarker"
});
$c_Lexample_MeasureMarker.prototype.productArity__I = (function() {
  return 3
});
$c_Lexample_MeasureMarker.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_MeasureMarker(x$1)) {
    var MeasureMarker$1 = $as_Lexample_MeasureMarker(x$1);
    return (((this.measure$1 === MeasureMarker$1.measure$1) && (this.beat$1 === MeasureMarker$1.beat$1)) && (this.meter$1 === MeasureMarker$1.meter$1))
  } else {
    return false
  }
});
$c_Lexample_MeasureMarker.prototype.init___I__I__I = (function(measure, beat, meter) {
  this.measure$1 = measure;
  this.beat$1 = beat;
  this.meter$1 = meter;
  return this
});
$c_Lexample_MeasureMarker.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.measure$1;
      break
    }
    case 1: {
      return this.beat$1;
      break
    }
    case 2: {
      return this.meter$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_MeasureMarker.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_MeasureMarker.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.measure$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.beat$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.meter$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 3)
});
$c_Lexample_MeasureMarker.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_MeasureMarker(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_MeasureMarker)))
}
function $as_Lexample_MeasureMarker(obj) {
  return (($is_Lexample_MeasureMarker(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.MeasureMarker"))
}
function $isArrayOf_Lexample_MeasureMarker(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_MeasureMarker)))
}
function $asArrayOf_Lexample_MeasureMarker(obj, depth) {
  return (($isArrayOf_Lexample_MeasureMarker(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.MeasureMarker;", depth))
}
var $d_Lexample_MeasureMarker = new $TypeData().initClass({
  Lexample_MeasureMarker: 0
}, false, "example.MeasureMarker", {
  Lexample_MeasureMarker: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_MeasureMarker.prototype.$classData = $d_Lexample_MeasureMarker;
/** @constructor */
function $c_Lexample_MeterChange() {
  $c_O.call(this);
  this.measure$1 = 0;
  this.meter$1 = 0
}
$c_Lexample_MeterChange.prototype = new $h_O();
$c_Lexample_MeterChange.prototype.constructor = $c_Lexample_MeterChange;
/** @constructor */
function $h_Lexample_MeterChange() {
  /*<skip>*/
}
$h_Lexample_MeterChange.prototype = $c_Lexample_MeterChange.prototype;
$c_Lexample_MeterChange.prototype.productPrefix__T = (function() {
  return "MeterChange"
});
$c_Lexample_MeterChange.prototype.productArity__I = (function() {
  return 2
});
$c_Lexample_MeterChange.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_MeterChange(x$1)) {
    var MeterChange$1 = $as_Lexample_MeterChange(x$1);
    return ((this.measure$1 === MeterChange$1.measure$1) && (this.meter$1 === MeterChange$1.meter$1))
  } else {
    return false
  }
});
$c_Lexample_MeterChange.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.measure$1;
      break
    }
    case 1: {
      return this.meter$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_MeterChange.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_MeterChange.prototype.init___I__I = (function(measure, meter) {
  this.measure$1 = measure;
  this.meter$1 = meter;
  return this
});
$c_Lexample_MeterChange.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.measure$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.meter$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lexample_MeterChange.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_MeterChange(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_MeterChange)))
}
function $as_Lexample_MeterChange(obj) {
  return (($is_Lexample_MeterChange(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.MeterChange"))
}
function $isArrayOf_Lexample_MeterChange(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_MeterChange)))
}
function $asArrayOf_Lexample_MeterChange(obj, depth) {
  return (($isArrayOf_Lexample_MeterChange(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.MeterChange;", depth))
}
var $d_Lexample_MeterChange = new $TypeData().initClass({
  Lexample_MeterChange: 0
}, false, "example.MeterChange", {
  Lexample_MeterChange: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_MeterChange.prototype.$classData = $d_Lexample_MeterChange;
/** @constructor */
function $c_Lexample_Rectangle() {
  $c_O.call(this);
  this.x$1 = 0.0;
  this.y$1 = 0.0;
  this.width$1 = 0.0;
  this.height$1 = 0.0;
  this.bottomY$1 = 0.0;
  this.rightX$1 = 0.0
}
$c_Lexample_Rectangle.prototype = new $h_O();
$c_Lexample_Rectangle.prototype.constructor = $c_Lexample_Rectangle;
/** @constructor */
function $h_Lexample_Rectangle() {
  /*<skip>*/
}
$h_Lexample_Rectangle.prototype = $c_Lexample_Rectangle.prototype;
$c_Lexample_Rectangle.prototype.init___D__D__D__D = (function(x, y, width, height) {
  this.x$1 = x;
  this.y$1 = y;
  this.width$1 = width;
  this.height$1 = height;
  this.bottomY$1 = (height + y);
  this.rightX$1 = (width + x);
  return this
});
$c_Lexample_Rectangle.prototype.productPrefix__T = (function() {
  return "Rectangle"
});
$c_Lexample_Rectangle.prototype.productArity__I = (function() {
  return 4
});
$c_Lexample_Rectangle.prototype.containsPoint__D__D__Z = (function(pX, pY) {
  return ((((pX >= this.x$1) && (pX <= this.rightX$1)) && (pY >= this.y$1)) && (pY <= this.bottomY$1))
});
$c_Lexample_Rectangle.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_Rectangle(x$1)) {
    var Rectangle$1 = $as_Lexample_Rectangle(x$1);
    return ((((this.x$1 === Rectangle$1.x$1) && (this.y$1 === Rectangle$1.y$1)) && (this.width$1 === Rectangle$1.width$1)) && (this.height$1 === Rectangle$1.height$1))
  } else {
    return false
  }
});
$c_Lexample_Rectangle.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$1;
      break
    }
    case 1: {
      return this.y$1;
      break
    }
    case 2: {
      return this.width$1;
      break
    }
    case 3: {
      return this.height$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_Rectangle.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_Rectangle.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.x$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.y$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.width$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().doubleHash__D__I(this.height$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 4)
});
$c_Lexample_Rectangle.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_Rectangle(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_Rectangle)))
}
function $as_Lexample_Rectangle(obj) {
  return (($is_Lexample_Rectangle(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.Rectangle"))
}
function $isArrayOf_Lexample_Rectangle(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_Rectangle)))
}
function $asArrayOf_Lexample_Rectangle(obj, depth) {
  return (($isArrayOf_Lexample_Rectangle(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.Rectangle;", depth))
}
var $d_Lexample_Rectangle = new $TypeData().initClass({
  Lexample_Rectangle: 0
}, false, "example.Rectangle", {
  Lexample_Rectangle: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_Rectangle.prototype.$classData = $d_Lexample_Rectangle;
/** @constructor */
function $c_Lexample_Song() {
  $c_O.call(this);
  this.measures$1 = 0;
  this.initNotes$1 = null;
  this.bpmChanges$1 = null;
  this.meterChanges$1 = null;
  this.MeasureToBeatMap$1 = null;
  this.cumulativeMeasureMarker$1 = null;
  this.totalBeats$1 = 0;
  this.bpmChangesEndCapped$1 = null;
  this.cumulativeBpmMarkers$1 = null;
  this.bitmap$0$1 = false
}
$c_Lexample_Song.prototype = new $h_O();
$c_Lexample_Song.prototype.constructor = $c_Lexample_Song;
/** @constructor */
function $h_Lexample_Song() {
  /*<skip>*/
}
$h_Lexample_Song.prototype = $c_Lexample_Song.prototype;
$c_Lexample_Song.prototype.productPrefix__T = (function() {
  return "Song"
});
$c_Lexample_Song.prototype.productArity__I = (function() {
  return 4
});
$c_Lexample_Song.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_Song(x$1)) {
    var Song$1 = $as_Lexample_Song(x$1);
    if ((this.measures$1 === Song$1.measures$1)) {
      var x = this.initNotes$1;
      var x$2 = Song$1.initNotes$1;
      var jsx$2 = ((x === null) ? (x$2 === null) : $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(x, x$2))
    } else {
      var jsx$2 = false
    };
    if (jsx$2) {
      var x$3 = this.bpmChanges$1;
      var x$4 = Song$1.bpmChanges$1;
      var jsx$1 = ((x$3 === null) ? (x$4 === null) : $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(x$3, x$4))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$5 = this.meterChanges$1;
      var x$6 = Song$1.meterChanges$1;
      return ((x$5 === null) ? (x$6 === null) : $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(x$5, x$6))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lexample_Song.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.measures$1;
      break
    }
    case 1: {
      return this.initNotes$1;
      break
    }
    case 2: {
      return this.bpmChanges$1;
      break
    }
    case 3: {
      return this.meterChanges$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_Song.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_Song.prototype.example$Song$$getBeatAtMeasure__I__I = (function(measure) {
  var this$1 = this.cumulativeMeasureMarker__sci_Vector();
  var this$2 = this$1.iterator__sci_VectorIterator();
  var res = $m_s_None$();
  while ((res.isEmpty__Z() && this$2.$$undhasNext$2)) {
    var e = this$2.next__O();
    var measureMarker = $as_Lexample_MeasureMarker(e);
    if ((measureMarker.measure$1 > measure)) {
      res = new $c_s_Some().init___O(e)
    }
  };
  var this$3 = res;
  var endPost = $as_Lexample_MeasureMarker((this$3.isEmpty__Z() ? $as_Lexample_MeasureMarker(this.cumulativeMeasureMarker__sci_Vector().last__O()) : this$3.get__O()));
  var offsetFromEndPost = $imul(((endPost.measure$1 - measure) | 0), endPost.meter$1);
  return ((endPost.beat$1 - offsetFromEndPost) | 0)
});
$c_Lexample_Song.prototype.cumulativeMeasureMarker$lzycompute__p1__sci_Vector = (function() {
  if ((!this.bitmap$0$1)) {
    this.cumulativeMeasureMarker$1 = this.getCumulativeMeasureMarker__p1__sci_Vector();
    this.bitmap$0$1 = true
  };
  return this.cumulativeMeasureMarker$1
});
$c_Lexample_Song.prototype.getCumulativeMeasureMarker__p1__sci_Vector = (function() {
  var lastMeterChange = $as_Lexample_MeterChange(this.meterChanges$1.last__O());
  var measure = this.measures$1;
  var meter = lastMeterChange.meter$1;
  var endCapMeterChange = new $c_Lexample_MeterChange().init___I__I(measure, meter);
  var balancedMeterChanges = $as_sci_Vector(this.meterChanges$1.$$colon$plus__O__scg_CanBuildFrom__O(endCapMeterChange, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)));
  var _2 = balancedMeterChanges.drop__I__sci_Vector(1);
  $m_sci_Vector$();
  $m_sc_IndexedSeq$();
  var nonLocalReturnKey1 = new $c_O().init___();
  try {
    $m_sci_Vector$();
    var b = new $c_sci_VectorBuilder().init___();
    $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, balancedMeterChanges);
    var elems2 = _2.iterator__sci_VectorIterator();
    var this$7 = balancedMeterChanges.iterator__sci_VectorIterator();
    while (this$7.$$undhasNext$2) {
      var arg1 = this$7.next__O();
      if (elems2.$$undhasNext$2) {
        var arg2 = elems2.next__O();
        var first = $as_Lexample_MeterChange(arg1);
        var second = $as_Lexample_MeterChange(arg2);
        var elem = new $c_T3().init___O__O__O(((second.measure$1 - first.measure$1) | 0), first.meter$1, second.measure$1);
        b.$$plus$eq__O__sci_VectorBuilder(elem)
      } else {
        throw new $c_sr_NonLocalReturnControl().init___O__O(nonLocalReturnKey1, b.result__sci_Vector())
      }
    };
    var jsx$1 = b.result__sci_Vector()
  } catch (e) {
    if ($is_sr_NonLocalReturnControl(e)) {
      var ex = $as_sr_NonLocalReturnControl(e);
      if ((ex.key$2 === nonLocalReturnKey1)) {
        var jsx$1 = ex.value$f
      } else {
        var jsx$1;
        throw ex
      }
    } else {
      var jsx$1;
      throw e
    }
  };
  var deltaMeasures = $as_sci_Vector(jsx$1);
  var elem$1 = 0;
  elem$1 = 0;
  $m_sci_Vector$();
  var bf = $m_sc_IndexedSeq$().ReusableCBF$6;
  var b$1 = $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder(deltaMeasures, bf);
  var this$10 = deltaMeasures.iterator__sci_VectorIterator();
  while (this$10.$$undhasNext$2) {
    var arg1$1 = this$10.next__O();
    var d = $as_T3(arg1$1);
    if ((d !== null)) {
      var deltaMeasures$1 = $uI(d.$$und1$1);
      var meter$1 = $uI(d.$$und2$1);
      var measure$1 = $uI(d.$$und3$1);
      var x$1_$_$$und1$1 = deltaMeasures$1;
      var x$1_$_$$und2$1 = meter$1;
      var x$1_$_$$und3$1 = measure$1
    } else {
      var x$1_$_$$und1$1;
      var x$1_$_$$und2$1;
      var x$1_$_$$und3$1;
      throw new $c_s_MatchError().init___O(d)
    };
    var deltaMeasures$2 = $uI(x$1_$_$$und1$1);
    var meter$2 = $uI(x$1_$_$$und2$1);
    var measure$2 = $uI(x$1_$_$$und3$1);
    var deltaBeats = $imul(deltaMeasures$2, meter$2);
    elem$1 = ((elem$1 + deltaBeats) | 0);
    b$1.$$plus$eq__O__scm_Builder(new $c_Lexample_MeasureMarker().init___I__I__I(measure$2, elem$1, meter$2))
  };
  return $as_sci_Vector(b$1.result__O())
});
$c_Lexample_Song.prototype.cumulativeMeasureMarker__sci_Vector = (function() {
  return ((!this.bitmap$0$1) ? this.cumulativeMeasureMarker$lzycompute__p1__sci_Vector() : this.cumulativeMeasureMarker$1)
});
$c_Lexample_Song.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.measures$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.initNotes$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.bpmChanges$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.meterChanges$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 4)
});
$c_Lexample_Song.prototype.init___I__sci_Vector__sci_Vector__sci_Vector = (function(measures, initNotes, bpmChanges, meterChanges) {
  this.measures$1 = measures;
  this.initNotes$1 = initNotes;
  this.bpmChanges$1 = bpmChanges;
  this.meterChanges$1 = meterChanges;
  this.MeasureToBeatMap$1 = $as_sci_Vector($as_sc_TraversableLike($m_s_package$().Vector$1.range__O__O__s_math_Integral__sc_GenTraversable(0, measures, $m_s_math_Numeric$IntIsIntegral$())).map__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(measure$2) {
      var measure = $uI(measure$2);
      return arg$outer.example$Song$$getBeatAtMeasure__I__I(measure)
    })
  })(this)), ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)));
  this.totalBeats$1 = $as_Lexample_MeasureMarker(this.cumulativeMeasureMarker__sci_Vector().last__O()).beat$1;
  var qual$1 = $as_Lexample_BPMChange(bpmChanges.last__O());
  var x$4 = this.totalBeats$1;
  var x$5 = qual$1.bpm$1;
  this.bpmChangesEndCapped$1 = $as_sci_Vector(bpmChanges.$$colon$plus__O__scg_CanBuildFrom__O(new $c_Lexample_BPMChange().init___D__D(x$4, x$5), ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)));
  var l = this.bpmChangesEndCapped$1;
  var elem$1 = 0.0;
  elem$1 = 0.0;
  var _2 = l.drop__I__sci_Vector(1);
  var this$7 = $m_sc_Seq$();
  var nonLocalReturnKey1 = new $c_O().init___();
  try {
    $m_sci_Vector$();
    var b = new $c_sci_VectorBuilder().init___();
    $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, l);
    var elems2 = _2.iterator__sci_VectorIterator();
    var this$10 = l.iterator__sci_VectorIterator();
    while (this$10.$$undhasNext$2) {
      var arg1 = this$10.next__O();
      if (elems2.$$undhasNext$2) {
        var arg2 = elems2.next__O();
        var change1 = $as_Lexample_BPMChange(arg1);
        var change2 = $as_Lexample_BPMChange(arg2);
        var deltaBeat = (change2.beat$1 - change1.beat$1);
        var deltaSeconds = (60.0 * ((deltaBeat / $m_Lexample_PianoRollConfig$().BeatsInQuarter$1) / change1.bpm$1));
        var change1Time = elem$1;
        elem$1 = (elem$1 + deltaSeconds);
        var elem = new $c_Lexample_BPMMarker().init___D__D__D__D(change1.beat$1, change2.beat$1, change1.bpm$1, change1Time);
        b.$$plus$eq__O__sci_VectorBuilder(elem)
      } else {
        throw new $c_sr_NonLocalReturnControl().init___O__O(nonLocalReturnKey1, b.result__sci_Vector())
      }
    };
    var jsx$1 = b.result__sci_Vector()
  } catch (e) {
    if ($is_sr_NonLocalReturnControl(e)) {
      var ex = $as_sr_NonLocalReturnControl(e);
      if ((ex.key$2 === nonLocalReturnKey1)) {
        var jsx$1 = ex.value$f
      } else {
        var jsx$1;
        throw ex
      }
    } else {
      var jsx$1;
      throw e
    }
  };
  this.cumulativeBpmMarkers$1 = $as_sc_Seq(jsx$1);
  return this
});
$c_Lexample_Song.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lexample_Song.prototype.getMeasureClosestToBeat__I__Z__I = (function(desiredBeat, roundUp) {
  var this$1 = this.cumulativeMeasureMarker__sci_Vector();
  var this$2 = this$1.iterator__sci_VectorIterator();
  var res = $m_s_None$();
  while ((res.isEmpty__Z() && this$2.$$undhasNext$2)) {
    var e = this$2.next__O();
    var measureMarker = $as_Lexample_MeasureMarker(e);
    if ((measureMarker.beat$1 > desiredBeat)) {
      res = new $c_s_Some().init___O(e)
    }
  };
  var this$3 = res;
  var endPost = $as_Lexample_MeasureMarker((this$3.isEmpty__Z() ? $as_Lexample_MeasureMarker(this.cumulativeMeasureMarker__sci_Vector().last__O()) : this$3.get__O()));
  var deltaMeasure = (roundUp ? ((((endPost.beat$1 - desiredBeat) | 0) / endPost.meter$1) | 0) : $m_Lexample_MyMath$().ceil__I__I__I(((endPost.beat$1 - desiredBeat) | 0), endPost.meter$1));
  return ((endPost.measure$1 - deltaMeasure) | 0)
});
function $is_Lexample_Song(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_Song)))
}
function $as_Lexample_Song(obj) {
  return (($is_Lexample_Song(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.Song"))
}
function $isArrayOf_Lexample_Song(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_Song)))
}
function $asArrayOf_Lexample_Song(obj, depth) {
  return (($isArrayOf_Lexample_Song(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.Song;", depth))
}
var $d_Lexample_Song = new $TypeData().initClass({
  Lexample_Song: 0
}, false, "example.Song", {
  Lexample_Song: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_Song.prototype.$classData = $d_Lexample_Song;
/** @constructor */
function $c_Lexample_TickMarker() {
  $c_O.call(this);
  this.beat$1 = 0;
  this.symbol$1 = 0
}
$c_Lexample_TickMarker.prototype = new $h_O();
$c_Lexample_TickMarker.prototype.constructor = $c_Lexample_TickMarker;
/** @constructor */
function $h_Lexample_TickMarker() {
  /*<skip>*/
}
$h_Lexample_TickMarker.prototype = $c_Lexample_TickMarker.prototype;
$c_Lexample_TickMarker.prototype.productPrefix__T = (function() {
  return "TickMarker"
});
$c_Lexample_TickMarker.prototype.productArity__I = (function() {
  return 2
});
$c_Lexample_TickMarker.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_TickMarker(x$1)) {
    var TickMarker$1 = $as_Lexample_TickMarker(x$1);
    return ((this.beat$1 === TickMarker$1.beat$1) && (this.symbol$1 === TickMarker$1.symbol$1))
  } else {
    return false
  }
});
$c_Lexample_TickMarker.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.beat$1;
      break
    }
    case 1: {
      return this.symbol$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_TickMarker.prototype.init___I__I = (function(beat, symbol) {
  this.beat$1 = beat;
  this.symbol$1 = symbol;
  return this
});
$c_Lexample_TickMarker.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_TickMarker.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.beat$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.symbol$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lexample_TickMarker.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_TickMarker(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_TickMarker)))
}
function $as_Lexample_TickMarker(obj) {
  return (($is_Lexample_TickMarker(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.TickMarker"))
}
function $isArrayOf_Lexample_TickMarker(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_TickMarker)))
}
function $asArrayOf_Lexample_TickMarker(obj, depth) {
  return (($isArrayOf_Lexample_TickMarker(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.TickMarker;", depth))
}
var $d_Lexample_TickMarker = new $TypeData().initClass({
  Lexample_TickMarker: 0
}, false, "example.TickMarker", {
  Lexample_TickMarker: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_TickMarker.prototype.$classData = $d_Lexample_TickMarker;
/** @constructor */
function $c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null;
  this.startBeat$1$f = 0;
  this.endBeat$1$f = 0;
  this.tickSize$1$2 = 0
}
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype = new $h_sr_AbstractFunction1();
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype.constructor = $c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3;
/** @constructor */
function $h_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3() {
  /*<skip>*/
}
$h_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype = $c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype;
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype.apply__O__O = (function(v1) {
  return this.apply__T2__sc_GenTraversableOnce($as_T2(v1))
});
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype.apply__T2__sc_GenTraversableOnce = (function(x$1) {
  if ((x$1 !== null)) {
    var measure = x$1.$$und1$mcI$sp__I();
    var startBeatOfMeasure = x$1.$$und2$mcI$sp__I();
    $m_s_package$();
    var end = $uI(this.$$outer$2.example$TickRenderLogic$$song$f.MeasureToBeatMap$1.apply__I__O(((1 + measure) | 0)));
    var step = this.tickSize$1$2;
    var this$2 = new $c_sc_Iterator$$anon$6().init___I__I__I(startBeatOfMeasure, end, step);
    var p = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
      return (function(beat$2) {
        var beat = $uI(beat$2);
        return ((beat >= arg$outer.startBeat$1$f) && (beat < arg$outer.endBeat$1$f))
      })
    })(this));
    var this$3 = new $c_sc_Iterator$$anon$13().init___sc_Iterator__F1(this$2, p);
    var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer$1, measure$1, startBeatOfMeasure$1) {
      return (function(beat$2$1) {
        var beat$1 = $uI(beat$2$1);
        return new $c_Lexample_TickMarker().init___I__I(beat$1, ((beat$1 === startBeatOfMeasure$1) ? measure$1 : arg$outer$1.$$outer$2.getTickSymbol__I__I__I(beat$1, startBeatOfMeasure$1)))
      })
    })(this, measure, startBeatOfMeasure));
    return new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$3, f)
  } else {
    throw new $c_s_MatchError().init___O(x$1)
  }
});
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype.init___Lexample_TickRenderLogic__I__I__I = (function($$outer, startBeat$1, endBeat$1, tickSize$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.startBeat$1$f = startBeat$1;
  this.endBeat$1$f = endBeat$1;
  this.tickSize$1$2 = tickSize$1;
  return this
});
var $d_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3 = new $TypeData().initClass({
  Lexample_TickRenderLogic$$anonfun$getTickMarkers$3: 0
}, false, "example.TickRenderLogic$$anonfun$getTickMarkers$3", {
  Lexample_TickRenderLogic$$anonfun$getTickMarkers$3: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3.prototype.$classData = $d_Lexample_TickRenderLogic$$anonfun$getTickMarkers$3;
/** @constructor */
function $c_Lexample_audio_BooleanWrapper() {
  $c_O.call(this);
  this.isTrue$1 = false
}
$c_Lexample_audio_BooleanWrapper.prototype = new $h_O();
$c_Lexample_audio_BooleanWrapper.prototype.constructor = $c_Lexample_audio_BooleanWrapper;
/** @constructor */
function $h_Lexample_audio_BooleanWrapper() {
  /*<skip>*/
}
$h_Lexample_audio_BooleanWrapper.prototype = $c_Lexample_audio_BooleanWrapper.prototype;
$c_Lexample_audio_BooleanWrapper.prototype.productPrefix__T = (function() {
  return "BooleanWrapper"
});
$c_Lexample_audio_BooleanWrapper.prototype.productArity__I = (function() {
  return 1
});
$c_Lexample_audio_BooleanWrapper.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_audio_BooleanWrapper(x$1)) {
    var BooleanWrapper$1 = $as_Lexample_audio_BooleanWrapper(x$1);
    return (this.isTrue$1 === BooleanWrapper$1.isTrue$1)
  } else {
    return false
  }
});
$c_Lexample_audio_BooleanWrapper.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.isTrue$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_audio_BooleanWrapper.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_audio_BooleanWrapper.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.isTrue$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lexample_audio_BooleanWrapper.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lexample_audio_BooleanWrapper.prototype.init___Z = (function(isTrue) {
  this.isTrue$1 = isTrue;
  return this
});
function $is_Lexample_audio_BooleanWrapper(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_audio_BooleanWrapper)))
}
function $as_Lexample_audio_BooleanWrapper(obj) {
  return (($is_Lexample_audio_BooleanWrapper(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.audio.BooleanWrapper"))
}
function $isArrayOf_Lexample_audio_BooleanWrapper(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_audio_BooleanWrapper)))
}
function $asArrayOf_Lexample_audio_BooleanWrapper(obj, depth) {
  return (($isArrayOf_Lexample_audio_BooleanWrapper(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.audio.BooleanWrapper;", depth))
}
var $d_Lexample_audio_BooleanWrapper = new $TypeData().initClass({
  Lexample_audio_BooleanWrapper: 0
}, false, "example.audio.BooleanWrapper", {
  Lexample_audio_BooleanWrapper: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_audio_BooleanWrapper.prototype.$classData = $d_Lexample_audio_BooleanWrapper;
/** @constructor */
function $c_jl_ArithmeticException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ArithmeticException.prototype = new $h_jl_RuntimeException();
$c_jl_ArithmeticException.prototype.constructor = $c_jl_ArithmeticException;
/** @constructor */
function $h_jl_ArithmeticException() {
  /*<skip>*/
}
$h_jl_ArithmeticException.prototype = $c_jl_ArithmeticException.prototype;
var $d_jl_ArithmeticException = new $TypeData().initClass({
  jl_ArithmeticException: 0
}, false, "java.lang.ArithmeticException", {
  jl_ArithmeticException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ArithmeticException.prototype.$classData = $d_jl_ArithmeticException;
/** @constructor */
function $c_jl_ClassCastException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ClassCastException.prototype = new $h_jl_RuntimeException();
$c_jl_ClassCastException.prototype.constructor = $c_jl_ClassCastException;
/** @constructor */
function $h_jl_ClassCastException() {
  /*<skip>*/
}
$h_jl_ClassCastException.prototype = $c_jl_ClassCastException.prototype;
function $is_jl_ClassCastException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_ClassCastException)))
}
function $as_jl_ClassCastException(obj) {
  return (($is_jl_ClassCastException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.ClassCastException"))
}
function $isArrayOf_jl_ClassCastException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_ClassCastException)))
}
function $asArrayOf_jl_ClassCastException(obj, depth) {
  return (($isArrayOf_jl_ClassCastException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.ClassCastException;", depth))
}
var $d_jl_ClassCastException = new $TypeData().initClass({
  jl_ClassCastException: 0
}, false, "java.lang.ClassCastException", {
  jl_ClassCastException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ClassCastException.prototype.$classData = $d_jl_ClassCastException;
/** @constructor */
function $c_jl_IllegalArgumentException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalArgumentException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalArgumentException.prototype.constructor = $c_jl_IllegalArgumentException;
/** @constructor */
function $h_jl_IllegalArgumentException() {
  /*<skip>*/
}
$h_jl_IllegalArgumentException.prototype = $c_jl_IllegalArgumentException.prototype;
$c_jl_IllegalArgumentException.prototype.init___ = (function() {
  $c_jl_IllegalArgumentException.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_IllegalArgumentException.prototype.init___T = (function(s) {
  $c_jl_IllegalArgumentException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalArgumentException = new $TypeData().initClass({
  jl_IllegalArgumentException: 0
}, false, "java.lang.IllegalArgumentException", {
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalArgumentException.prototype.$classData = $d_jl_IllegalArgumentException;
/** @constructor */
function $c_jl_IllegalStateException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalStateException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalStateException.prototype.constructor = $c_jl_IllegalStateException;
/** @constructor */
function $h_jl_IllegalStateException() {
  /*<skip>*/
}
$h_jl_IllegalStateException.prototype = $c_jl_IllegalStateException.prototype;
$c_jl_IllegalStateException.prototype.init___ = (function() {
  $c_jl_IllegalStateException.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
/** @constructor */
function $c_jl_IndexOutOfBoundsException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IndexOutOfBoundsException.prototype = new $h_jl_RuntimeException();
$c_jl_IndexOutOfBoundsException.prototype.constructor = $c_jl_IndexOutOfBoundsException;
/** @constructor */
function $h_jl_IndexOutOfBoundsException() {
  /*<skip>*/
}
$h_jl_IndexOutOfBoundsException.prototype = $c_jl_IndexOutOfBoundsException.prototype;
var $d_jl_IndexOutOfBoundsException = new $TypeData().initClass({
  jl_IndexOutOfBoundsException: 0
}, false, "java.lang.IndexOutOfBoundsException", {
  jl_IndexOutOfBoundsException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IndexOutOfBoundsException.prototype.$classData = $d_jl_IndexOutOfBoundsException;
/** @constructor */
function $c_jl_NullPointerException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_NullPointerException.prototype = new $h_jl_RuntimeException();
$c_jl_NullPointerException.prototype.constructor = $c_jl_NullPointerException;
/** @constructor */
function $h_jl_NullPointerException() {
  /*<skip>*/
}
$h_jl_NullPointerException.prototype = $c_jl_NullPointerException.prototype;
$c_jl_NullPointerException.prototype.init___ = (function() {
  $c_jl_NullPointerException.prototype.init___T.call(this, null);
  return this
});
var $d_jl_NullPointerException = new $TypeData().initClass({
  jl_NullPointerException: 0
}, false, "java.lang.NullPointerException", {
  jl_NullPointerException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NullPointerException.prototype.$classData = $d_jl_NullPointerException;
/** @constructor */
function $c_jl_UnsupportedOperationException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_UnsupportedOperationException.prototype = new $h_jl_RuntimeException();
$c_jl_UnsupportedOperationException.prototype.constructor = $c_jl_UnsupportedOperationException;
/** @constructor */
function $h_jl_UnsupportedOperationException() {
  /*<skip>*/
}
$h_jl_UnsupportedOperationException.prototype = $c_jl_UnsupportedOperationException.prototype;
$c_jl_UnsupportedOperationException.prototype.init___T = (function(s) {
  $c_jl_UnsupportedOperationException.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_UnsupportedOperationException = new $TypeData().initClass({
  jl_UnsupportedOperationException: 0
}, false, "java.lang.UnsupportedOperationException", {
  jl_UnsupportedOperationException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_UnsupportedOperationException.prototype.$classData = $d_jl_UnsupportedOperationException;
/** @constructor */
function $c_ju_NoSuchElementException() {
  $c_jl_RuntimeException.call(this)
}
$c_ju_NoSuchElementException.prototype = new $h_jl_RuntimeException();
$c_ju_NoSuchElementException.prototype.constructor = $c_ju_NoSuchElementException;
/** @constructor */
function $h_ju_NoSuchElementException() {
  /*<skip>*/
}
$h_ju_NoSuchElementException.prototype = $c_ju_NoSuchElementException.prototype;
$c_ju_NoSuchElementException.prototype.init___ = (function() {
  $c_ju_NoSuchElementException.prototype.init___T.call(this, null);
  return this
});
var $d_ju_NoSuchElementException = new $TypeData().initClass({
  ju_NoSuchElementException: 0
}, false, "java.util.NoSuchElementException", {
  ju_NoSuchElementException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_NoSuchElementException.prototype.$classData = $d_ju_NoSuchElementException;
/** @constructor */
function $c_s_MatchError() {
  $c_jl_RuntimeException.call(this);
  this.obj$4 = null;
  this.objString$4 = null;
  this.bitmap$0$4 = false
}
$c_s_MatchError.prototype = new $h_jl_RuntimeException();
$c_s_MatchError.prototype.constructor = $c_s_MatchError;
/** @constructor */
function $h_s_MatchError() {
  /*<skip>*/
}
$h_s_MatchError.prototype = $c_s_MatchError.prototype;
$c_s_MatchError.prototype.objString$lzycompute__p4__T = (function() {
  if ((!this.bitmap$0$4)) {
    this.objString$4 = ((this.obj$4 === null) ? "null" : this.liftedTree1$1__p4__T());
    this.bitmap$0$4 = true
  };
  return this.objString$4
});
$c_s_MatchError.prototype.ofClass$1__p4__T = (function() {
  return ("of class " + $objectGetClass(this.obj$4).getName__T())
});
$c_s_MatchError.prototype.liftedTree1$1__p4__T = (function() {
  try {
    return ((($objectToString(this.obj$4) + " (") + this.ofClass$1__p4__T()) + ")")
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      return ("an instance " + this.ofClass$1__p4__T())
    } else {
      throw e
    }
  }
});
$c_s_MatchError.prototype.getMessage__T = (function() {
  return this.objString__p4__T()
});
$c_s_MatchError.prototype.objString__p4__T = (function() {
  return ((!this.bitmap$0$4) ? this.objString$lzycompute__p4__T() : this.objString$4)
});
$c_s_MatchError.prototype.init___O = (function(obj) {
  this.obj$4 = obj;
  $c_jl_RuntimeException.prototype.init___.call(this);
  return this
});
var $d_s_MatchError = new $TypeData().initClass({
  s_MatchError: 0
}, false, "scala.MatchError", {
  s_MatchError: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_MatchError.prototype.$classData = $d_s_MatchError;
/** @constructor */
function $c_s_Option() {
  $c_O.call(this)
}
$c_s_Option.prototype = new $h_O();
$c_s_Option.prototype.constructor = $c_s_Option;
/** @constructor */
function $h_s_Option() {
  /*<skip>*/
}
$h_s_Option.prototype = $c_s_Option.prototype;
$c_s_Option.prototype.init___ = (function() {
  return this
});
$c_s_Option.prototype.isDefined__Z = (function() {
  return (!this.isEmpty__Z())
});
/** @constructor */
function $c_s_Predef$$anon$1() {
  $c_s_Predef$$less$colon$less.call(this)
}
$c_s_Predef$$anon$1.prototype = new $h_s_Predef$$less$colon$less();
$c_s_Predef$$anon$1.prototype.constructor = $c_s_Predef$$anon$1;
/** @constructor */
function $h_s_Predef$$anon$1() {
  /*<skip>*/
}
$h_s_Predef$$anon$1.prototype = $c_s_Predef$$anon$1.prototype;
$c_s_Predef$$anon$1.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$1 = new $TypeData().initClass({
  s_Predef$$anon$1: 0
}, false, "scala.Predef$$anon$1", {
  s_Predef$$anon$1: 1,
  s_Predef$$less$colon$less: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$1.prototype.$classData = $d_s_Predef$$anon$1;
/** @constructor */
function $c_s_Predef$$anon$2() {
  $c_s_Predef$$eq$colon$eq.call(this)
}
$c_s_Predef$$anon$2.prototype = new $h_s_Predef$$eq$colon$eq();
$c_s_Predef$$anon$2.prototype.constructor = $c_s_Predef$$anon$2;
/** @constructor */
function $h_s_Predef$$anon$2() {
  /*<skip>*/
}
$h_s_Predef$$anon$2.prototype = $c_s_Predef$$anon$2.prototype;
$c_s_Predef$$anon$2.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$2 = new $TypeData().initClass({
  s_Predef$$anon$2: 0
}, false, "scala.Predef$$anon$2", {
  s_Predef$$anon$2: 1,
  s_Predef$$eq$colon$eq: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$2.prototype.$classData = $d_s_Predef$$anon$2;
/** @constructor */
function $c_s_StringContext() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_s_StringContext.prototype = new $h_O();
$c_s_StringContext.prototype.constructor = $c_s_StringContext;
/** @constructor */
function $h_s_StringContext() {
  /*<skip>*/
}
$h_s_StringContext.prototype = $c_s_StringContext.prototype;
$c_s_StringContext.prototype.productPrefix__T = (function() {
  return "StringContext"
});
$c_s_StringContext.prototype.productArity__I = (function() {
  return 1
});
$c_s_StringContext.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_StringContext(x$1)) {
    var StringContext$1 = $as_s_StringContext(x$1);
    var x = this.parts$1;
    var x$2 = StringContext$1.parts$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_s_StringContext.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parts$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_StringContext.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_StringContext.prototype.checkLengths__sc_Seq__V = (function(args) {
  if ((this.parts$1.length__I() !== ((1 + args.length__I()) | 0))) {
    throw new $c_jl_IllegalArgumentException().init___T((((("wrong number of arguments (" + args.length__I()) + ") for interpolated string with ") + this.parts$1.length__I()) + " parts"))
  }
});
$c_s_StringContext.prototype.s__sc_Seq__T = (function(args) {
  var f = (function($this) {
    return (function(str$2) {
      var str = $as_T(str$2);
      var this$1 = $m_s_StringContext$();
      return this$1.treatEscapes0__p1__T__Z__T(str, false)
    })
  })(this);
  this.checkLengths__sc_Seq__V(args);
  var pi = this.parts$1.iterator__sc_Iterator();
  var ai = args.iterator__sc_Iterator();
  var arg1 = pi.next__O();
  var bldr = new $c_jl_StringBuilder().init___T($as_T(f(arg1)));
  while (ai.hasNext__Z()) {
    bldr.append__O__jl_StringBuilder(ai.next__O());
    var arg1$1 = pi.next__O();
    bldr.append__T__jl_StringBuilder($as_T(f(arg1$1)))
  };
  return bldr.content$1
});
$c_s_StringContext.prototype.init___sc_Seq = (function(parts) {
  this.parts$1 = parts;
  return this
});
$c_s_StringContext.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_StringContext.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_StringContext(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_StringContext)))
}
function $as_s_StringContext(obj) {
  return (($is_s_StringContext(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.StringContext"))
}
function $isArrayOf_s_StringContext(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_StringContext)))
}
function $asArrayOf_s_StringContext(obj, depth) {
  return (($isArrayOf_s_StringContext(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.StringContext;", depth))
}
var $d_s_StringContext = new $TypeData().initClass({
  s_StringContext: 0
}, false, "scala.StringContext", {
  s_StringContext: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext.prototype.$classData = $d_s_StringContext;
/** @constructor */
function $c_s_util_control_BreakControl() {
  $c_jl_Throwable.call(this)
}
$c_s_util_control_BreakControl.prototype = new $h_jl_Throwable();
$c_s_util_control_BreakControl.prototype.constructor = $c_s_util_control_BreakControl;
/** @constructor */
function $h_s_util_control_BreakControl() {
  /*<skip>*/
}
$h_s_util_control_BreakControl.prototype = $c_s_util_control_BreakControl.prototype;
$c_s_util_control_BreakControl.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___.call(this);
  return this
});
$c_s_util_control_BreakControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable(this)
});
$c_s_util_control_BreakControl.prototype.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
var $d_s_util_control_BreakControl = new $TypeData().initClass({
  s_util_control_BreakControl: 0
}, false, "scala.util.control.BreakControl", {
  s_util_control_BreakControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_s_util_control_BreakControl.prototype.$classData = $d_s_util_control_BreakControl;
function $is_sc_GenTraversable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversable)))
}
function $as_sc_GenTraversable(obj) {
  return (($is_sc_GenTraversable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversable"))
}
function $isArrayOf_sc_GenTraversable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversable)))
}
function $asArrayOf_sc_GenTraversable(obj, depth) {
  return (($isArrayOf_sc_GenTraversable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversable;", depth))
}
/** @constructor */
function $c_sc_IndexedSeqOptimized$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.$$outer$2 = null
}
$c_sc_IndexedSeqOptimized$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_IndexedSeqOptimized$$anon$1.prototype.constructor = $c_sc_IndexedSeqOptimized$$anon$1;
/** @constructor */
function $h_sc_IndexedSeqOptimized$$anon$1() {
  /*<skip>*/
}
$h_sc_IndexedSeqOptimized$$anon$1.prototype = $c_sc_IndexedSeqOptimized$$anon$1.prototype;
$c_sc_IndexedSeqOptimized$$anon$1.prototype.next__O = (function() {
  if ((this.i$2 > 0)) {
    this.i$2 = (((-1) + this.i$2) | 0);
    return this.$$outer$2.apply__I__O(this.i$2)
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_IndexedSeqOptimized$$anon$1.prototype.hasNext__Z = (function() {
  return (this.i$2 > 0)
});
$c_sc_IndexedSeqOptimized$$anon$1.prototype.init___sc_IndexedSeqOptimized = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.i$2 = $$outer.length__I();
  return this
});
var $d_sc_IndexedSeqOptimized$$anon$1 = new $TypeData().initClass({
  sc_IndexedSeqOptimized$$anon$1: 0
}, false, "scala.collection.IndexedSeqOptimized$$anon$1", {
  sc_IndexedSeqOptimized$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_IndexedSeqOptimized$$anon$1.prototype.$classData = $d_sc_IndexedSeqOptimized$$anon$1;
/** @constructor */
function $c_sc_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sc_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Iterable$.prototype.constructor = $c_sc_Iterable$;
/** @constructor */
function $h_sc_Iterable$() {
  /*<skip>*/
}
$h_sc_Iterable$.prototype = $c_sc_Iterable$.prototype;
$c_sc_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Iterable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Iterable$ = new $TypeData().initClass({
  sc_Iterable$: 0
}, false, "scala.collection.Iterable$", {
  sc_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Iterable$.prototype.$classData = $d_sc_Iterable$;
var $n_sc_Iterable$ = (void 0);
function $m_sc_Iterable$() {
  if ((!$n_sc_Iterable$)) {
    $n_sc_Iterable$ = new $c_sc_Iterable$().init___()
  };
  return $n_sc_Iterable$
}
/** @constructor */
function $c_sc_Iterator$$anon$11() {
  $c_sc_AbstractIterator.call(this);
  this.$$outer$2 = null;
  this.f$3$2 = null
}
$c_sc_Iterator$$anon$11.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$11.prototype.constructor = $c_sc_Iterator$$anon$11;
/** @constructor */
function $h_sc_Iterator$$anon$11() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$11.prototype = $c_sc_Iterator$$anon$11.prototype;
$c_sc_Iterator$$anon$11.prototype.next__O = (function() {
  return this.f$3$2.apply__O__O(this.$$outer$2.next__O())
});
$c_sc_Iterator$$anon$11.prototype.init___sc_Iterator__F1 = (function($$outer, f$3) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$3$2 = f$3;
  return this
});
$c_sc_Iterator$$anon$11.prototype.hasNext__Z = (function() {
  return this.$$outer$2.hasNext__Z()
});
var $d_sc_Iterator$$anon$11 = new $TypeData().initClass({
  sc_Iterator$$anon$11: 0
}, false, "scala.collection.Iterator$$anon$11", {
  sc_Iterator$$anon$11: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$11.prototype.$classData = $d_sc_Iterator$$anon$11;
/** @constructor */
function $c_sc_Iterator$$anon$12() {
  $c_sc_AbstractIterator.call(this);
  this.cur$2 = null;
  this.$$outer$2 = null;
  this.f$4$2 = null
}
$c_sc_Iterator$$anon$12.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$12.prototype.constructor = $c_sc_Iterator$$anon$12;
/** @constructor */
function $h_sc_Iterator$$anon$12() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$12.prototype = $c_sc_Iterator$$anon$12.prototype;
$c_sc_Iterator$$anon$12.prototype.next__O = (function() {
  return (this.hasNext__Z() ? this.cur$2 : $m_sc_Iterator$().empty$1).next__O()
});
$c_sc_Iterator$$anon$12.prototype.init___sc_Iterator__F1 = (function($$outer, f$4) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$4$2 = f$4;
  this.cur$2 = $m_sc_Iterator$().empty$1;
  return this
});
$c_sc_Iterator$$anon$12.prototype.hasNext__Z = (function() {
  _hasNext: while (true) {
    if (this.cur$2.hasNext__Z()) {
      return true
    } else if (this.$$outer$2.hasNext__Z()) {
      this.cur$2 = $as_sc_GenTraversableOnce(this.f$4$2.apply__O__O(this.$$outer$2.next__O())).toIterator__sc_Iterator();
      continue _hasNext
    } else {
      return false
    }
  }
});
var $d_sc_Iterator$$anon$12 = new $TypeData().initClass({
  sc_Iterator$$anon$12: 0
}, false, "scala.collection.Iterator$$anon$12", {
  sc_Iterator$$anon$12: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$12.prototype.$classData = $d_sc_Iterator$$anon$12;
/** @constructor */
function $c_sc_Iterator$$anon$13() {
  $c_sc_AbstractIterator.call(this);
  this.hd$2 = null;
  this.hdDefined$2 = false;
  this.$$outer$2 = null;
  this.p$1$2 = null
}
$c_sc_Iterator$$anon$13.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$13.prototype.constructor = $c_sc_Iterator$$anon$13;
/** @constructor */
function $h_sc_Iterator$$anon$13() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$13.prototype = $c_sc_Iterator$$anon$13.prototype;
$c_sc_Iterator$$anon$13.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    this.hdDefined$2 = false;
    return this.hd$2
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_Iterator$$anon$13.prototype.init___sc_Iterator__F1 = (function($$outer, p$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.p$1$2 = p$1;
  this.hdDefined$2 = false;
  return this
});
$c_sc_Iterator$$anon$13.prototype.hasNext__Z = (function() {
  if (this.hdDefined$2) {
    return true
  } else {
    do {
      if ((!this.$$outer$2.hasNext__Z())) {
        return false
      };
      this.hd$2 = this.$$outer$2.next__O()
    } while ((!$uZ(this.p$1$2.apply__O__O(this.hd$2))));
    this.hdDefined$2 = true;
    return true
  }
});
var $d_sc_Iterator$$anon$13 = new $TypeData().initClass({
  sc_Iterator$$anon$13: 0
}, false, "scala.collection.Iterator$$anon$13", {
  sc_Iterator$$anon$13: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$13.prototype.$classData = $d_sc_Iterator$$anon$13;
/** @constructor */
function $c_sc_Iterator$$anon$18() {
  $c_sc_AbstractIterator.call(this);
  this.dropped$2 = false;
  this.self$4$2 = null;
  this.p$6$2 = null
}
$c_sc_Iterator$$anon$18.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$18.prototype.constructor = $c_sc_Iterator$$anon$18;
/** @constructor */
function $h_sc_Iterator$$anon$18() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$18.prototype = $c_sc_Iterator$$anon$18.prototype;
$c_sc_Iterator$$anon$18.prototype.next__O = (function() {
  this.skip__p2__V();
  return this.self$4$2.next__O()
});
$c_sc_Iterator$$anon$18.prototype.skip__p2__V = (function() {
  if ((!this.dropped$2)) {
    while ((this.self$4$2.hasNext__Z() && $uZ(this.p$6$2.apply__O__O(this.self$4$2.head__O())))) {
      this.self$4$2.next__O()
    };
    this.dropped$2 = true
  }
});
$c_sc_Iterator$$anon$18.prototype.hasNext__Z = (function() {
  this.skip__p2__V();
  return this.self$4$2.hasNext__Z()
});
$c_sc_Iterator$$anon$18.prototype.init___sc_Iterator__sc_BufferedIterator__F1 = (function($$outer, self$4, p$6) {
  this.self$4$2 = self$4;
  this.p$6$2 = p$6;
  this.dropped$2 = false;
  return this
});
var $d_sc_Iterator$$anon$18 = new $TypeData().initClass({
  sc_Iterator$$anon$18: 0
}, false, "scala.collection.Iterator$$anon$18", {
  sc_Iterator$$anon$18: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$18.prototype.$classData = $d_sc_Iterator$$anon$18;
/** @constructor */
function $c_sc_Iterator$$anon$2() {
  $c_sc_AbstractIterator.call(this)
}
$c_sc_Iterator$$anon$2.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$2.prototype.constructor = $c_sc_Iterator$$anon$2;
/** @constructor */
function $h_sc_Iterator$$anon$2() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$2.prototype = $c_sc_Iterator$$anon$2.prototype;
$c_sc_Iterator$$anon$2.prototype.next__O = (function() {
  this.next__sr_Nothing$()
});
$c_sc_Iterator$$anon$2.prototype.next__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
});
$c_sc_Iterator$$anon$2.prototype.hasNext__Z = (function() {
  return false
});
var $d_sc_Iterator$$anon$2 = new $TypeData().initClass({
  sc_Iterator$$anon$2: 0
}, false, "scala.collection.Iterator$$anon$2", {
  sc_Iterator$$anon$2: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$2.prototype.$classData = $d_sc_Iterator$$anon$2;
/** @constructor */
function $c_sc_Iterator$$anon$6() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.end$2$2 = 0;
  this.step$1$2 = 0
}
$c_sc_Iterator$$anon$6.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$6.prototype.constructor = $c_sc_Iterator$$anon$6;
/** @constructor */
function $h_sc_Iterator$$anon$6() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$6.prototype = $c_sc_Iterator$$anon$6.prototype;
$c_sc_Iterator$$anon$6.prototype.next__O = (function() {
  return this.next__I()
});
$c_sc_Iterator$$anon$6.prototype.next__I = (function() {
  if (this.hasNext__Z()) {
    var result = this.i$2;
    this.i$2 = ((this.i$2 + this.step$1$2) | 0);
    return result
  } else {
    return $uI($m_sc_Iterator$().empty$1.next__O())
  }
});
$c_sc_Iterator$$anon$6.prototype.init___I__I__I = (function(start$2, end$2, step$1) {
  this.end$2$2 = end$2;
  this.step$1$2 = step$1;
  if ((step$1 === 0)) {
    throw new $c_jl_IllegalArgumentException().init___T("zero step")
  };
  this.i$2 = start$2;
  return this
});
$c_sc_Iterator$$anon$6.prototype.hasNext__Z = (function() {
  return (((this.step$1$2 <= 0) || (this.i$2 < this.end$2$2)) && ((this.step$1$2 >= 0) || (this.i$2 > this.end$2$2)))
});
var $d_sc_Iterator$$anon$6 = new $TypeData().initClass({
  sc_Iterator$$anon$6: 0
}, false, "scala.collection.Iterator$$anon$6", {
  sc_Iterator$$anon$6: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$6.prototype.$classData = $d_sc_Iterator$$anon$6;
/** @constructor */
function $c_sc_LinearSeqLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sc_LinearSeqLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_LinearSeqLike$$anon$1.prototype.constructor = $c_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $h_sc_LinearSeqLike$$anon$1() {
  /*<skip>*/
}
$h_sc_LinearSeqLike$$anon$1.prototype = $c_sc_LinearSeqLike$$anon$1.prototype;
$c_sc_LinearSeqLike$$anon$1.prototype.init___sc_LinearSeqLike = (function($$outer) {
  this.these$2 = $$outer;
  return this
});
$c_sc_LinearSeqLike$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    var result = this.these$2.head__O();
    this.these$2 = $as_sc_LinearSeqLike(this.these$2.tail__O());
    return result
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_LinearSeqLike$$anon$1.prototype.hasNext__Z = (function() {
  return (!this.these$2.isEmpty__Z())
});
var $d_sc_LinearSeqLike$$anon$1 = new $TypeData().initClass({
  sc_LinearSeqLike$$anon$1: 0
}, false, "scala.collection.LinearSeqLike$$anon$1", {
  sc_LinearSeqLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_LinearSeqLike$$anon$1.prototype.$classData = $d_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $c_sc_Traversable$() {
  $c_scg_GenTraversableFactory.call(this);
  this.breaks$3 = null
}
$c_sc_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Traversable$.prototype.constructor = $c_sc_Traversable$;
/** @constructor */
function $h_sc_Traversable$() {
  /*<skip>*/
}
$h_sc_Traversable$.prototype = $c_sc_Traversable$.prototype;
$c_sc_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_Traversable$ = this;
  this.breaks$3 = new $c_s_util_control_Breaks().init___();
  return this
});
$c_sc_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Traversable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Traversable$ = new $TypeData().initClass({
  sc_Traversable$: 0
}, false, "scala.collection.Traversable$", {
  sc_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Traversable$.prototype.$classData = $d_sc_Traversable$;
var $n_sc_Traversable$ = (void 0);
function $m_sc_Traversable$() {
  if ((!$n_sc_Traversable$)) {
    $n_sc_Traversable$ = new $c_sc_Traversable$().init___()
  };
  return $n_sc_Traversable$
}
/** @constructor */
function $c_scg_ImmutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_ImmutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_ImmutableSetFactory.prototype.constructor = $c_scg_ImmutableSetFactory;
/** @constructor */
function $h_scg_ImmutableSetFactory() {
  /*<skip>*/
}
$h_scg_ImmutableSetFactory.prototype = $c_scg_ImmutableSetFactory.prototype;
$c_scg_ImmutableSetFactory.prototype.empty__sc_GenTraversable = (function() {
  return this.emptyInstance__sci_Set()
});
$c_scg_ImmutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.emptyInstance__sci_Set())
});
/** @constructor */
function $c_scg_MutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_MutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_MutableSetFactory.prototype.constructor = $c_scg_MutableSetFactory;
/** @constructor */
function $h_scg_MutableSetFactory() {
  /*<skip>*/
}
$h_scg_MutableSetFactory.prototype = $c_scg_MutableSetFactory.prototype;
$c_scg_MutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable($as_scg_Growable(this.empty__sc_GenTraversable()))
});
/** @constructor */
function $c_sci_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Iterable$.prototype.constructor = $c_sci_Iterable$;
/** @constructor */
function $h_sci_Iterable$() {
  /*<skip>*/
}
$h_sci_Iterable$.prototype = $c_sci_Iterable$.prototype;
$c_sci_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Iterable$ = new $TypeData().initClass({
  sci_Iterable$: 0
}, false, "scala.collection.immutable.Iterable$", {
  sci_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Iterable$.prototype.$classData = $d_sci_Iterable$;
var $n_sci_Iterable$ = (void 0);
function $m_sci_Iterable$() {
  if ((!$n_sci_Iterable$)) {
    $n_sci_Iterable$ = new $c_sci_Iterable$().init___()
  };
  return $n_sci_Iterable$
}
/** @constructor */
function $c_sci_ListMap$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.self$2 = null
}
$c_sci_ListMap$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_ListMap$$anon$1.prototype.constructor = $c_sci_ListMap$$anon$1;
/** @constructor */
function $h_sci_ListMap$$anon$1() {
  /*<skip>*/
}
$h_sci_ListMap$$anon$1.prototype = $c_sci_ListMap$$anon$1.prototype;
$c_sci_ListMap$$anon$1.prototype.next__O = (function() {
  return this.next__T2()
});
$c_sci_ListMap$$anon$1.prototype.init___sci_ListMap = (function($$outer) {
  this.self$2 = $$outer;
  return this
});
$c_sci_ListMap$$anon$1.prototype.next__T2 = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
  } else {
    var res = new $c_T2().init___O__O(this.self$2.key__O(), this.self$2.value__O());
    this.self$2 = this.self$2.next__sci_ListMap();
    return res
  }
});
$c_sci_ListMap$$anon$1.prototype.hasNext__Z = (function() {
  return (!this.self$2.isEmpty__Z())
});
var $d_sci_ListMap$$anon$1 = new $TypeData().initClass({
  sci_ListMap$$anon$1: 0
}, false, "scala.collection.immutable.ListMap$$anon$1", {
  sci_ListMap$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_ListMap$$anon$1.prototype.$classData = $d_sci_ListMap$$anon$1;
/** @constructor */
function $c_sci_ListSet$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.that$2 = null
}
$c_sci_ListSet$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_ListSet$$anon$1.prototype.constructor = $c_sci_ListSet$$anon$1;
/** @constructor */
function $h_sci_ListSet$$anon$1() {
  /*<skip>*/
}
$h_sci_ListSet$$anon$1.prototype = $c_sci_ListSet$$anon$1.prototype;
$c_sci_ListSet$$anon$1.prototype.next__O = (function() {
  var this$1 = this.that$2;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
    var res = this.that$2.head__O();
    this.that$2 = this.that$2.tail__sci_ListSet();
    return res
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sci_ListSet$$anon$1.prototype.init___sci_ListSet = (function($$outer) {
  this.that$2 = $$outer;
  return this
});
$c_sci_ListSet$$anon$1.prototype.hasNext__Z = (function() {
  var this$1 = this.that$2;
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
var $d_sci_ListSet$$anon$1 = new $TypeData().initClass({
  sci_ListSet$$anon$1: 0
}, false, "scala.collection.immutable.ListSet$$anon$1", {
  sci_ListSet$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_ListSet$$anon$1.prototype.$classData = $d_sci_ListSet$$anon$1;
/** @constructor */
function $c_sci_Stream$StreamBuilder() {
  $c_scm_LazyBuilder.call(this)
}
$c_sci_Stream$StreamBuilder.prototype = new $h_scm_LazyBuilder();
$c_sci_Stream$StreamBuilder.prototype.constructor = $c_sci_Stream$StreamBuilder;
/** @constructor */
function $h_sci_Stream$StreamBuilder() {
  /*<skip>*/
}
$h_sci_Stream$StreamBuilder.prototype = $c_sci_Stream$StreamBuilder.prototype;
$c_sci_Stream$StreamBuilder.prototype.result__O = (function() {
  return this.result__sci_Stream()
});
$c_sci_Stream$StreamBuilder.prototype.result__sci_Stream = (function() {
  var this$1 = this.parts$1;
  return $as_sci_Stream(this$1.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream().flatMap__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$5$2) {
      var x$5 = $as_sc_TraversableOnce(x$5$2);
      return x$5.toStream__sci_Stream()
    })
  })(this)), ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___())))
});
function $is_sci_Stream$StreamBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream$StreamBuilder)))
}
function $as_sci_Stream$StreamBuilder(obj) {
  return (($is_sci_Stream$StreamBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream$StreamBuilder"))
}
function $isArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream$StreamBuilder)))
}
function $asArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (($isArrayOf_sci_Stream$StreamBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream$StreamBuilder;", depth))
}
var $d_sci_Stream$StreamBuilder = new $TypeData().initClass({
  sci_Stream$StreamBuilder: 0
}, false, "scala.collection.immutable.Stream$StreamBuilder", {
  sci_Stream$StreamBuilder: 1,
  scm_LazyBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_Stream$StreamBuilder.prototype.$classData = $d_sci_Stream$StreamBuilder;
/** @constructor */
function $c_sci_StreamIterator() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sci_StreamIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_StreamIterator.prototype.constructor = $c_sci_StreamIterator;
/** @constructor */
function $h_sci_StreamIterator() {
  /*<skip>*/
}
$h_sci_StreamIterator.prototype = $c_sci_StreamIterator.prototype;
$c_sci_StreamIterator.prototype.next__O = (function() {
  if ($s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)) {
    return $m_sc_Iterator$().empty$1.next__O()
  } else {
    var cur = this.these$2.v__sci_Stream();
    var result = cur.head__O();
    this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, cur$1) {
      return (function() {
        return $as_sci_Stream(cur$1.tail__O())
      })
    })(this, cur)));
    return result
  }
});
$c_sci_StreamIterator.prototype.init___sci_Stream = (function(self) {
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, self$1) {
    return (function() {
      return self$1
    })
  })(this, self)));
  return this
});
$c_sci_StreamIterator.prototype.hasNext__Z = (function() {
  var this$1 = this.these$2.v__sci_Stream();
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
$c_sci_StreamIterator.prototype.toStream__sci_Stream = (function() {
  var result = this.these$2.v__sci_Stream();
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      $m_sci_Stream$();
      return $m_sci_Stream$Empty$()
    })
  })(this)));
  return result
});
var $d_sci_StreamIterator = new $TypeData().initClass({
  sci_StreamIterator: 0
}, false, "scala.collection.immutable.StreamIterator", {
  sci_StreamIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_StreamIterator.prototype.$classData = $d_sci_StreamIterator;
/** @constructor */
function $c_sci_Traversable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Traversable$.prototype.constructor = $c_sci_Traversable$;
/** @constructor */
function $h_sci_Traversable$() {
  /*<skip>*/
}
$h_sci_Traversable$.prototype = $c_sci_Traversable$.prototype;
$c_sci_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Traversable$ = new $TypeData().initClass({
  sci_Traversable$: 0
}, false, "scala.collection.immutable.Traversable$", {
  sci_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Traversable$.prototype.$classData = $d_sci_Traversable$;
var $n_sci_Traversable$ = (void 0);
function $m_sci_Traversable$() {
  if ((!$n_sci_Traversable$)) {
    $n_sci_Traversable$ = new $c_sci_Traversable$().init___()
  };
  return $n_sci_Traversable$
}
/** @constructor */
function $c_sci_TrieIterator() {
  $c_sc_AbstractIterator.call(this);
  this.elems$2 = null;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = null;
  this.scala$collection$immutable$TrieIterator$$posStack$f = null;
  this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null
}
$c_sci_TrieIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_TrieIterator.prototype.constructor = $c_sci_TrieIterator;
/** @constructor */
function $h_sci_TrieIterator() {
  /*<skip>*/
}
$h_sci_TrieIterator.prototype = $c_sci_TrieIterator.prototype;
$c_sci_TrieIterator.prototype.isContainer__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashMap1(x) || $is_sci_HashSet$HashSet1(x))
});
$c_sci_TrieIterator.prototype.next__O = (function() {
  if ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null)) {
    var el = this.scala$collection$immutable$TrieIterator$$subIter$f.next__O();
    if ((!this.scala$collection$immutable$TrieIterator$$subIter$f.hasNext__Z())) {
      this.scala$collection$immutable$TrieIterator$$subIter$f = null
    };
    return el
  } else {
    return this.next0__p2__Asci_Iterable__I__O(this.scala$collection$immutable$TrieIterator$$arrayD$f, this.scala$collection$immutable$TrieIterator$$posD$f)
  }
});
$c_sci_TrieIterator.prototype.initPosStack__AI = (function() {
  return $newArrayObject($d_I.getArrayOf(), [6])
});
$c_sci_TrieIterator.prototype.hasNext__Z = (function() {
  return ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null) || (this.scala$collection$immutable$TrieIterator$$depth$f >= 0))
});
$c_sci_TrieIterator.prototype.next0__p2__Asci_Iterable__I__O = (function(elems, i) {
  _next0: while (true) {
    if ((i === (((-1) + elems.u["length"]) | 0))) {
      this.scala$collection$immutable$TrieIterator$$depth$f = (((-1) + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$posD$f = this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = null
      } else {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
        this.scala$collection$immutable$TrieIterator$$posD$f = 0
      }
    } else {
      this.scala$collection$immutable$TrieIterator$$posD$f = ((1 + this.scala$collection$immutable$TrieIterator$$posD$f) | 0)
    };
    var m = elems.u[i];
    if (this.isContainer__p2__O__Z(m)) {
      return this.getElem__O__O(m)
    } else if (this.isTrie__p2__O__Z(m)) {
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$arrayD$f;
        this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$posD$f
      };
      this.scala$collection$immutable$TrieIterator$$depth$f = ((1 + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      this.scala$collection$immutable$TrieIterator$$arrayD$f = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      this.scala$collection$immutable$TrieIterator$$posD$f = 0;
      var temp$elems = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      elems = temp$elems;
      i = 0;
      continue _next0
    } else {
      this.scala$collection$immutable$TrieIterator$$subIter$f = m.iterator__sc_Iterator();
      return this.next__O()
    }
  }
});
$c_sci_TrieIterator.prototype.getElems__p2__sci_Iterable__Asci_Iterable = (function(x) {
  if ($is_sci_HashMap$HashTrieMap(x)) {
    var x2 = $as_sci_HashMap$HashTrieMap(x);
    var jsx$1 = x2.elems$6
  } else if ($is_sci_HashSet$HashTrieSet(x)) {
    var x3 = $as_sci_HashSet$HashTrieSet(x);
    var jsx$1 = x3.elems$5
  } else {
    var jsx$1;
    throw new $c_s_MatchError().init___O(x)
  };
  return $asArrayOf_sci_Iterable(jsx$1, 1)
});
$c_sci_TrieIterator.prototype.init___Asci_Iterable = (function(elems) {
  this.elems$2 = elems;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = this.initArrayStack__AAsci_Iterable();
  this.scala$collection$immutable$TrieIterator$$posStack$f = this.initPosStack__AI();
  this.scala$collection$immutable$TrieIterator$$arrayD$f = this.elems$2;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null;
  return this
});
$c_sci_TrieIterator.prototype.isTrie__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashTrieMap(x) || $is_sci_HashSet$HashTrieSet(x))
});
$c_sci_TrieIterator.prototype.initArrayStack__AAsci_Iterable = (function() {
  return $newArrayObject($d_sci_Iterable.getArrayOf().getArrayOf(), [6])
});
/** @constructor */
function $c_sci_Vector$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.$$outer$2 = null
}
$c_sci_Vector$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_Vector$$anon$1.prototype.constructor = $c_sci_Vector$$anon$1;
/** @constructor */
function $h_sci_Vector$$anon$1() {
  /*<skip>*/
}
$h_sci_Vector$$anon$1.prototype = $c_sci_Vector$$anon$1.prototype;
$c_sci_Vector$$anon$1.prototype.next__O = (function() {
  if ((this.i$2 > 0)) {
    this.i$2 = (((-1) + this.i$2) | 0);
    return this.$$outer$2.apply__I__O(this.i$2)
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sci_Vector$$anon$1.prototype.hasNext__Z = (function() {
  return (this.i$2 > 0)
});
$c_sci_Vector$$anon$1.prototype.init___sci_Vector = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.i$2 = $$outer.length__I();
  return this
});
var $d_sci_Vector$$anon$1 = new $TypeData().initClass({
  sci_Vector$$anon$1: 0
}, false, "scala.collection.immutable.Vector$$anon$1", {
  sci_Vector$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_Vector$$anon$1.prototype.$classData = $d_sci_Vector$$anon$1;
/** @constructor */
function $c_sci_VectorBuilder() {
  $c_O.call(this);
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  this.depth$1 = 0;
  this.display0$1 = null;
  this.display1$1 = null;
  this.display2$1 = null;
  this.display3$1 = null;
  this.display4$1 = null;
  this.display5$1 = null
}
$c_sci_VectorBuilder.prototype = new $h_O();
$c_sci_VectorBuilder.prototype.constructor = $c_sci_VectorBuilder;
/** @constructor */
function $h_sci_VectorBuilder() {
  /*<skip>*/
}
$h_sci_VectorBuilder.prototype = $c_sci_VectorBuilder.prototype;
$c_sci_VectorBuilder.prototype.display3__AO = (function() {
  return this.display3$1
});
$c_sci_VectorBuilder.prototype.init___ = (function() {
  this.display0$1 = $newArrayObject($d_O.getArrayOf(), [32]);
  this.depth$1 = 1;
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  return this
});
$c_sci_VectorBuilder.prototype.depth__I = (function() {
  return this.depth$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$1 = x$1
});
$c_sci_VectorBuilder.prototype.display0__AO = (function() {
  return this.display0$1
});
$c_sci_VectorBuilder.prototype.display4__AO = (function() {
  return this.display4$1
});
$c_sci_VectorBuilder.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__sci_VectorBuilder = (function(elem) {
  if ((this.lo$1 >= this.display0$1.u["length"])) {
    var newBlockIndex = ((32 + this.blockIndex$1) | 0);
    var xor = (this.blockIndex$1 ^ newBlockIndex);
    $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
    this.blockIndex$1 = newBlockIndex;
    this.lo$1 = 0
  };
  this.display0$1.u[this.lo$1] = elem;
  this.lo$1 = ((1 + this.lo$1) | 0);
  return this
});
$c_sci_VectorBuilder.prototype.result__O = (function() {
  return this.result__sci_Vector()
});
$c_sci_VectorBuilder.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$1 = x$1
});
$c_sci_VectorBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_VectorBuilder.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$1 = x$1
});
$c_sci_VectorBuilder.prototype.display1__AO = (function() {
  return this.display1$1
});
$c_sci_VectorBuilder.prototype.display5__AO = (function() {
  return this.display5$1
});
$c_sci_VectorBuilder.prototype.result__sci_Vector = (function() {
  var size = ((this.blockIndex$1 + this.lo$1) | 0);
  if ((size === 0)) {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  };
  var s = new $c_sci_Vector().init___I__I__I(0, size, 0);
  var depth = this.depth$1;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if ((this.depth$1 > 1)) {
    var xor = (((-1) + size) | 0);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, 0, xor)
  };
  return s
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_VectorBuilder.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$1 = x$1
});
$c_sci_VectorBuilder.prototype.display2__AO = (function() {
  return this.display2$1
});
$c_sci_VectorBuilder.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $as_sci_VectorBuilder($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
});
$c_sci_VectorBuilder.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$1 = x$1
});
function $is_sci_VectorBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_VectorBuilder)))
}
function $as_sci_VectorBuilder(obj) {
  return (($is_sci_VectorBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.VectorBuilder"))
}
function $isArrayOf_sci_VectorBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_VectorBuilder)))
}
function $asArrayOf_sci_VectorBuilder(obj, depth) {
  return (($isArrayOf_sci_VectorBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.VectorBuilder;", depth))
}
var $d_sci_VectorBuilder = new $TypeData().initClass({
  sci_VectorBuilder: 0
}, false, "scala.collection.immutable.VectorBuilder", {
  sci_VectorBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorBuilder.prototype.$classData = $d_sci_VectorBuilder;
/** @constructor */
function $c_scm_Builder$$anon$1() {
  $c_O.call(this);
  this.self$1 = null;
  this.f$1$1 = null
}
$c_scm_Builder$$anon$1.prototype = new $h_O();
$c_scm_Builder$$anon$1.prototype.constructor = $c_scm_Builder$$anon$1;
/** @constructor */
function $h_scm_Builder$$anon$1() {
  /*<skip>*/
}
$h_scm_Builder$$anon$1.prototype = $c_scm_Builder$$anon$1.prototype;
$c_scm_Builder$$anon$1.prototype.init___scm_Builder__F1 = (function($$outer, f$1) {
  this.f$1$1 = f$1;
  this.self$1 = $$outer;
  return this
});
$c_scm_Builder$$anon$1.prototype.equals__O__Z = (function(that) {
  return $s_s_Proxy$class__equals__s_Proxy__O__Z(this, that)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.toString__T = (function() {
  return $s_s_Proxy$class__toString__s_Proxy__T(this)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1 = (function(xs) {
  this.self$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(xs);
  return this
});
$c_scm_Builder$$anon$1.prototype.result__O = (function() {
  return this.f$1$1.apply__O__O(this.self$1.result__O())
});
$c_scm_Builder$$anon$1.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundColl) {
  this.self$1.sizeHintBounded__I__sc_TraversableLike__V(size, boundColl)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder$$anon$1 = (function(x) {
  this.self$1.$$plus$eq__O__scm_Builder(x);
  return this
});
$c_scm_Builder$$anon$1.prototype.hashCode__I = (function() {
  return this.self$1.hashCode__I()
});
$c_scm_Builder$$anon$1.prototype.sizeHint__I__V = (function(size) {
  this.self$1.sizeHint__I__V(size)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1(xs)
});
var $d_scm_Builder$$anon$1 = new $TypeData().initClass({
  scm_Builder$$anon$1: 0
}, false, "scala.collection.mutable.Builder$$anon$1", {
  scm_Builder$$anon$1: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Proxy: 1
});
$c_scm_Builder$$anon$1.prototype.$classData = $d_scm_Builder$$anon$1;
/** @constructor */
function $c_scm_FlatHashTable$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.$$outer$2 = null
}
$c_scm_FlatHashTable$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_FlatHashTable$$anon$1.prototype.constructor = $c_scm_FlatHashTable$$anon$1;
/** @constructor */
function $h_scm_FlatHashTable$$anon$1() {
  /*<skip>*/
}
$h_scm_FlatHashTable$$anon$1.prototype = $c_scm_FlatHashTable$$anon$1.prototype;
$c_scm_FlatHashTable$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    this.i$2 = ((1 + this.i$2) | 0);
    var this$1 = this.$$outer$2;
    var entry = this.$$outer$2.table$5.u[(((-1) + this.i$2) | 0)];
    return $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this$1, entry)
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_scm_FlatHashTable$$anon$1.prototype.init___scm_FlatHashTable = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.i$2 = 0;
  return this
});
$c_scm_FlatHashTable$$anon$1.prototype.hasNext__Z = (function() {
  while (((this.i$2 < this.$$outer$2.table$5.u["length"]) && (this.$$outer$2.table$5.u[this.i$2] === null))) {
    this.i$2 = ((1 + this.i$2) | 0)
  };
  return (this.i$2 < this.$$outer$2.table$5.u["length"])
});
var $d_scm_FlatHashTable$$anon$1 = new $TypeData().initClass({
  scm_FlatHashTable$$anon$1: 0
}, false, "scala.collection.mutable.FlatHashTable$$anon$1", {
  scm_FlatHashTable$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_FlatHashTable$$anon$1.prototype.$classData = $d_scm_FlatHashTable$$anon$1;
/** @constructor */
function $c_scm_LinkedListLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.elems$2 = null
}
$c_scm_LinkedListLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_LinkedListLike$$anon$1.prototype.constructor = $c_scm_LinkedListLike$$anon$1;
/** @constructor */
function $h_scm_LinkedListLike$$anon$1() {
  /*<skip>*/
}
$h_scm_LinkedListLike$$anon$1.prototype = $c_scm_LinkedListLike$$anon$1.prototype;
$c_scm_LinkedListLike$$anon$1.prototype.next__O = (function() {
  var res = this.elems$2.elem$5;
  this.elems$2 = $as_scm_LinkedListLike(this.elems$2.next$5);
  return res
});
$c_scm_LinkedListLike$$anon$1.prototype.hasNext__Z = (function() {
  var this$1 = this.elems$2;
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
$c_scm_LinkedListLike$$anon$1.prototype.init___scm_LinkedListLike = (function($$outer) {
  this.elems$2 = $$outer;
  return this
});
var $d_scm_LinkedListLike$$anon$1 = new $TypeData().initClass({
  scm_LinkedListLike$$anon$1: 0
}, false, "scala.collection.mutable.LinkedListLike$$anon$1", {
  scm_LinkedListLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_LinkedListLike$$anon$1.prototype.$classData = $d_scm_LinkedListLike$$anon$1;
/** @constructor */
function $c_scm_ListBuffer$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.cursor$2 = null
}
$c_scm_ListBuffer$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_ListBuffer$$anon$1.prototype.constructor = $c_scm_ListBuffer$$anon$1;
/** @constructor */
function $h_scm_ListBuffer$$anon$1() {
  /*<skip>*/
}
$h_scm_ListBuffer$$anon$1.prototype = $c_scm_ListBuffer$$anon$1.prototype;
$c_scm_ListBuffer$$anon$1.prototype.init___scm_ListBuffer = (function($$outer) {
  this.cursor$2 = ($$outer.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z() ? $m_sci_Nil$() : $$outer.scala$collection$mutable$ListBuffer$$start$6);
  return this
});
$c_scm_ListBuffer$$anon$1.prototype.next__O = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty Iterator")
  } else {
    var ans = this.cursor$2.head__O();
    this.cursor$2 = $as_sci_List(this.cursor$2.tail__O());
    return ans
  }
});
$c_scm_ListBuffer$$anon$1.prototype.hasNext__Z = (function() {
  return (this.cursor$2 !== $m_sci_Nil$())
});
var $d_scm_ListBuffer$$anon$1 = new $TypeData().initClass({
  scm_ListBuffer$$anon$1: 0
}, false, "scala.collection.mutable.ListBuffer$$anon$1", {
  scm_ListBuffer$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_ListBuffer$$anon$1.prototype.$classData = $d_scm_ListBuffer$$anon$1;
/** @constructor */
function $c_scm_MutableList$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.elems$2 = null;
  this.count$2 = 0
}
$c_scm_MutableList$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_MutableList$$anon$1.prototype.constructor = $c_scm_MutableList$$anon$1;
/** @constructor */
function $h_scm_MutableList$$anon$1() {
  /*<skip>*/
}
$h_scm_MutableList$$anon$1.prototype = $c_scm_MutableList$$anon$1.prototype;
$c_scm_MutableList$$anon$1.prototype.next__O = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___()
  };
  this.count$2 = (((-1) + this.count$2) | 0);
  var e = this.elems$2.elem$5;
  this.elems$2 = ((this.count$2 === 0) ? null : $as_scm_LinkedList(this.elems$2.next$5));
  return e
});
$c_scm_MutableList$$anon$1.prototype.init___scm_MutableList = (function($$outer) {
  this.elems$2 = $$outer.first0$5;
  this.count$2 = $$outer.len$5;
  return this
});
$c_scm_MutableList$$anon$1.prototype.hasNext__Z = (function() {
  if ((this.count$2 > 0)) {
    var this$1 = this.elems$2;
    return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
  } else {
    return false
  }
});
var $d_scm_MutableList$$anon$1 = new $TypeData().initClass({
  scm_MutableList$$anon$1: 0
}, false, "scala.collection.mutable.MutableList$$anon$1", {
  scm_MutableList$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_MutableList$$anon$1.prototype.$classData = $d_scm_MutableList$$anon$1;
/** @constructor */
function $c_sr_NonLocalReturnControl() {
  $c_jl_Throwable.call(this);
  this.key$2 = null;
  this.value$f = null
}
$c_sr_NonLocalReturnControl.prototype = new $h_jl_Throwable();
$c_sr_NonLocalReturnControl.prototype.constructor = $c_sr_NonLocalReturnControl;
/** @constructor */
function $h_sr_NonLocalReturnControl() {
  /*<skip>*/
}
$h_sr_NonLocalReturnControl.prototype = $c_sr_NonLocalReturnControl.prototype;
$c_sr_NonLocalReturnControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return this
});
$c_sr_NonLocalReturnControl.prototype.init___O__O = (function(key, value) {
  this.key$2 = key;
  this.value$f = value;
  $c_jl_Throwable.prototype.init___.call(this);
  return this
});
$c_sr_NonLocalReturnControl.prototype.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
function $is_sr_NonLocalReturnControl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sr_NonLocalReturnControl)))
}
function $as_sr_NonLocalReturnControl(obj) {
  return (($is_sr_NonLocalReturnControl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.runtime.NonLocalReturnControl"))
}
function $isArrayOf_sr_NonLocalReturnControl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_NonLocalReturnControl)))
}
function $asArrayOf_sr_NonLocalReturnControl(obj, depth) {
  return (($isArrayOf_sr_NonLocalReturnControl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.NonLocalReturnControl;", depth))
}
var $d_sr_NonLocalReturnControl = new $TypeData().initClass({
  sr_NonLocalReturnControl: 0
}, false, "scala.runtime.NonLocalReturnControl", {
  sr_NonLocalReturnControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sr_NonLocalReturnControl.prototype.$classData = $d_sr_NonLocalReturnControl;
/** @constructor */
function $c_sr_ScalaRunTime$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.c$2 = 0;
  this.cmax$2 = 0;
  this.x$2$2 = null
}
$c_sr_ScalaRunTime$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sr_ScalaRunTime$$anon$1.prototype.constructor = $c_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $h_sr_ScalaRunTime$$anon$1() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$$anon$1.prototype = $c_sr_ScalaRunTime$$anon$1.prototype;
$c_sr_ScalaRunTime$$anon$1.prototype.next__O = (function() {
  var result = this.x$2$2.productElement__I__O(this.c$2);
  this.c$2 = ((1 + this.c$2) | 0);
  return result
});
$c_sr_ScalaRunTime$$anon$1.prototype.init___s_Product = (function(x$2) {
  this.x$2$2 = x$2;
  this.c$2 = 0;
  this.cmax$2 = x$2.productArity__I();
  return this
});
$c_sr_ScalaRunTime$$anon$1.prototype.hasNext__Z = (function() {
  return (this.c$2 < this.cmax$2)
});
var $d_sr_ScalaRunTime$$anon$1 = new $TypeData().initClass({
  sr_ScalaRunTime$$anon$1: 0
}, false, "scala.runtime.ScalaRunTime$$anon$1", {
  sr_ScalaRunTime$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sr_ScalaRunTime$$anon$1.prototype.$classData = $d_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $c_Lexample_BooleanVar() {
  $c_O.call(this);
  this.setting$1 = false;
  this.name$1 = null
}
$c_Lexample_BooleanVar.prototype = new $h_O();
$c_Lexample_BooleanVar.prototype.constructor = $c_Lexample_BooleanVar;
/** @constructor */
function $h_Lexample_BooleanVar() {
  /*<skip>*/
}
$h_Lexample_BooleanVar.prototype = $c_Lexample_BooleanVar.prototype;
$c_Lexample_BooleanVar.prototype.init___Z__T = (function(setting, name) {
  this.setting$1 = setting;
  this.name$1 = name;
  return this
});
$c_Lexample_BooleanVar.prototype.productPrefix__T = (function() {
  return "BooleanVar"
});
$c_Lexample_BooleanVar.prototype.productArity__I = (function() {
  return 2
});
$c_Lexample_BooleanVar.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_BooleanVar(x$1)) {
    var BooleanVar$1 = $as_Lexample_BooleanVar(x$1);
    return ((this.setting$1 === BooleanVar$1.setting$1) && (this.name$1 === BooleanVar$1.name$1))
  } else {
    return false
  }
});
$c_Lexample_BooleanVar.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.setting$1;
      break
    }
    case 1: {
      return this.name$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_BooleanVar.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_BooleanVar.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.setting$1 ? 1231 : 1237));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.name$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lexample_BooleanVar.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_BooleanVar(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_BooleanVar)))
}
function $as_Lexample_BooleanVar(obj) {
  return (($is_Lexample_BooleanVar(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.BooleanVar"))
}
function $isArrayOf_Lexample_BooleanVar(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_BooleanVar)))
}
function $asArrayOf_Lexample_BooleanVar(obj, depth) {
  return (($isArrayOf_Lexample_BooleanVar(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.BooleanVar;", depth))
}
var $d_Lexample_BooleanVar = new $TypeData().initClass({
  Lexample_BooleanVar: 0
}, false, "example.BooleanVar", {
  Lexample_BooleanVar: 1,
  O: 1,
  Lexample_Setting: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_BooleanVar.prototype.$classData = $d_Lexample_BooleanVar;
/** @constructor */
function $c_Lexample_SelectVar() {
  $c_O.call(this);
  this.setting$1 = null;
  this.name$1 = null;
  this.options$1 = null
}
$c_Lexample_SelectVar.prototype = new $h_O();
$c_Lexample_SelectVar.prototype.constructor = $c_Lexample_SelectVar;
/** @constructor */
function $h_Lexample_SelectVar() {
  /*<skip>*/
}
$h_Lexample_SelectVar.prototype = $c_Lexample_SelectVar.prototype;
$c_Lexample_SelectVar.prototype.productPrefix__T = (function() {
  return "SelectVar"
});
$c_Lexample_SelectVar.prototype.productArity__I = (function() {
  return 3
});
$c_Lexample_SelectVar.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lexample_SelectVar(x$1)) {
    var SelectVar$1 = $as_Lexample_SelectVar(x$1);
    if (($m_sr_BoxesRunTime$().equals__O__O__Z(this.setting$1, SelectVar$1.setting$1) && (this.name$1 === SelectVar$1.name$1))) {
      var x = this.options$1;
      var x$2 = SelectVar$1.options$1;
      return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lexample_SelectVar.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.setting$1;
      break
    }
    case 1: {
      return this.name$1;
      break
    }
    case 2: {
      return this.options$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lexample_SelectVar.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lexample_SelectVar.prototype.init___O__T__sc_Seq = (function(setting, name, options) {
  this.setting$1 = setting;
  this.name$1 = name;
  this.options$1 = options;
  return this
});
$c_Lexample_SelectVar.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lexample_SelectVar.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lexample_SelectVar(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lexample_SelectVar)))
}
function $as_Lexample_SelectVar(obj) {
  return (($is_Lexample_SelectVar(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "example.SelectVar"))
}
function $isArrayOf_Lexample_SelectVar(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lexample_SelectVar)))
}
function $asArrayOf_Lexample_SelectVar(obj, depth) {
  return (($isArrayOf_Lexample_SelectVar(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lexample.SelectVar;", depth))
}
var $d_Lexample_SelectVar = new $TypeData().initClass({
  Lexample_SelectVar: 0
}, false, "example.SelectVar", {
  Lexample_SelectVar: 1,
  O: 1,
  Lexample_Setting: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lexample_SelectVar.prototype.$classData = $d_Lexample_SelectVar;
/** @constructor */
function $c_Ljava_io_PrintStream() {
  $c_Ljava_io_FilterOutputStream.call(this);
  this.java$io$PrintStream$$autoFlush$f = false;
  this.charset$3 = null;
  this.java$io$PrintStream$$encoder$3 = null;
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  this.bitmap$0$3 = false
}
$c_Ljava_io_PrintStream.prototype = new $h_Ljava_io_FilterOutputStream();
$c_Ljava_io_PrintStream.prototype.constructor = $c_Ljava_io_PrintStream;
/** @constructor */
function $h_Ljava_io_PrintStream() {
  /*<skip>*/
}
$h_Ljava_io_PrintStream.prototype = $c_Ljava_io_PrintStream.prototype;
$c_Ljava_io_PrintStream.prototype.append__jl_CharSequence__jl_Appendable = (function(x$1) {
  return this.append__jl_CharSequence__Ljava_io_PrintStream(x$1)
});
$c_Ljava_io_PrintStream.prototype.println__O__V = (function(obj) {
  this.print__O__V(obj);
  this.printString__p4__T__V("\n")
});
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset = (function(_out, autoFlush, charset) {
  this.java$io$PrintStream$$autoFlush$f = autoFlush;
  this.charset$3 = charset;
  $c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream.call(this, _out);
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  return this
});
$c_Ljava_io_PrintStream.prototype.append__jl_CharSequence__Ljava_io_PrintStream = (function(csq) {
  this.print__T__V(((csq === null) ? "null" : $objectToString(csq)));
  return this
});
$c_Ljava_io_PrintStream.prototype.append__C__jl_Appendable = (function(x$1) {
  return this.append__C__Ljava_io_PrintStream(x$1)
});
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset.call(this, out, false, null);
  return this
});
$c_Ljava_io_PrintStream.prototype.append__C__Ljava_io_PrintStream = (function(c) {
  this.print__C__V(c);
  return this
});
function $is_Ljava_io_PrintStream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_PrintStream)))
}
function $as_Ljava_io_PrintStream(obj) {
  return (($is_Ljava_io_PrintStream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.PrintStream"))
}
function $isArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_PrintStream)))
}
function $asArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (($isArrayOf_Ljava_io_PrintStream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.PrintStream;", depth))
}
/** @constructor */
function $c_T2() {
  $c_O.call(this);
  this.$$und1$f = null;
  this.$$und2$f = null
}
$c_T2.prototype = new $h_O();
$c_T2.prototype.constructor = $c_T2;
/** @constructor */
function $h_T2() {
  /*<skip>*/
}
$h_T2.prototype = $c_T2.prototype;
$c_T2.prototype.productPrefix__T = (function() {
  return "Tuple2"
});
$c_T2.prototype.$$und1$mcI$sp__I = (function() {
  return $uI(this.$$und1__O())
});
$c_T2.prototype.productArity__I = (function() {
  return 2
});
$c_T2.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T2(x$1)) {
    var Tuple2$1 = $as_T2(x$1);
    return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1__O(), Tuple2$1.$$und1__O()) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2__O(), Tuple2$1.$$und2__O()))
  } else {
    return false
  }
});
$c_T2.prototype.productElement__I__O = (function(n) {
  return $s_s_Product2$class__productElement__s_Product2__I__O(this, n)
});
$c_T2.prototype.init___O__O = (function(_1, _2) {
  this.$$und1$f = _1;
  this.$$und2$f = _2;
  return this
});
$c_T2.prototype.toString__T = (function() {
  return (((("(" + this.$$und1__O()) + ",") + this.$$und2__O()) + ")")
});
$c_T2.prototype.$$und2__O = (function() {
  return this.$$und2$f
});
$c_T2.prototype.$$und2$mcD$sp__D = (function() {
  return $uD(this.$$und2__O())
});
$c_T2.prototype.$$und2$mcI$sp__I = (function() {
  return $uI(this.$$und2__O())
});
$c_T2.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T2.prototype.$$und1__O = (function() {
  return this.$$und1$f
});
$c_T2.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T2(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T2)))
}
function $as_T2(obj) {
  return (($is_T2(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple2"))
}
function $isArrayOf_T2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T2)))
}
function $asArrayOf_T2(obj, depth) {
  return (($isArrayOf_T2(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple2;", depth))
}
var $d_T2 = new $TypeData().initClass({
  T2: 0
}, false, "scala.Tuple2", {
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T2.prototype.$classData = $d_T2;
/** @constructor */
function $c_T3() {
  $c_O.call(this);
  this.$$und1$1 = null;
  this.$$und2$1 = null;
  this.$$und3$1 = null
}
$c_T3.prototype = new $h_O();
$c_T3.prototype.constructor = $c_T3;
/** @constructor */
function $h_T3() {
  /*<skip>*/
}
$h_T3.prototype = $c_T3.prototype;
$c_T3.prototype.productPrefix__T = (function() {
  return "Tuple3"
});
$c_T3.prototype.productArity__I = (function() {
  return 3
});
$c_T3.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T3(x$1)) {
    var Tuple3$1 = $as_T3(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$1, Tuple3$1.$$und1$1) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$1, Tuple3$1.$$und2$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und3$1, Tuple3$1.$$und3$1))
  } else {
    return false
  }
});
$c_T3.prototype.productElement__I__O = (function(n) {
  return $s_s_Product3$class__productElement__s_Product3__I__O(this, n)
});
$c_T3.prototype.toString__T = (function() {
  return (((((("(" + this.$$und1$1) + ",") + this.$$und2$1) + ",") + this.$$und3$1) + ")")
});
$c_T3.prototype.init___O__O__O = (function(_1, _2, _3) {
  this.$$und1$1 = _1;
  this.$$und2$1 = _2;
  this.$$und3$1 = _3;
  return this
});
$c_T3.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T3.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T3(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T3)))
}
function $as_T3(obj) {
  return (($is_T3(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple3"))
}
function $isArrayOf_T3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T3)))
}
function $asArrayOf_T3(obj, depth) {
  return (($isArrayOf_T3(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple3;", depth))
}
var $d_T3 = new $TypeData().initClass({
  T3: 0
}, false, "scala.Tuple3", {
  T3: 1,
  O: 1,
  s_Product3: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T3.prototype.$classData = $d_T3;
/** @constructor */
function $c_jl_NumberFormatException() {
  $c_jl_IllegalArgumentException.call(this)
}
$c_jl_NumberFormatException.prototype = new $h_jl_IllegalArgumentException();
$c_jl_NumberFormatException.prototype.constructor = $c_jl_NumberFormatException;
/** @constructor */
function $h_jl_NumberFormatException() {
  /*<skip>*/
}
$h_jl_NumberFormatException.prototype = $c_jl_NumberFormatException.prototype;
var $d_jl_NumberFormatException = new $TypeData().initClass({
  jl_NumberFormatException: 0
}, false, "java.lang.NumberFormatException", {
  jl_NumberFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NumberFormatException.prototype.$classData = $d_jl_NumberFormatException;
/** @constructor */
function $c_ju_FormatterClosedException() {
  $c_jl_IllegalStateException.call(this)
}
$c_ju_FormatterClosedException.prototype = new $h_jl_IllegalStateException();
$c_ju_FormatterClosedException.prototype.constructor = $c_ju_FormatterClosedException;
/** @constructor */
function $h_ju_FormatterClosedException() {
  /*<skip>*/
}
$h_ju_FormatterClosedException.prototype = $c_ju_FormatterClosedException.prototype;
var $d_ju_FormatterClosedException = new $TypeData().initClass({
  ju_FormatterClosedException: 0
}, false, "java.util.FormatterClosedException", {
  ju_FormatterClosedException: 1,
  jl_IllegalStateException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_FormatterClosedException.prototype.$classData = $d_ju_FormatterClosedException;
/** @constructor */
function $c_ju_IllegalFormatException() {
  $c_jl_IllegalArgumentException.call(this)
}
$c_ju_IllegalFormatException.prototype = new $h_jl_IllegalArgumentException();
$c_ju_IllegalFormatException.prototype.constructor = $c_ju_IllegalFormatException;
/** @constructor */
function $h_ju_IllegalFormatException() {
  /*<skip>*/
}
$h_ju_IllegalFormatException.prototype = $c_ju_IllegalFormatException.prototype;
/** @constructor */
function $c_s_None$() {
  $c_s_Option.call(this)
}
$c_s_None$.prototype = new $h_s_Option();
$c_s_None$.prototype.constructor = $c_s_None$;
/** @constructor */
function $h_s_None$() {
  /*<skip>*/
}
$h_s_None$.prototype = $c_s_None$.prototype;
$c_s_None$.prototype.productPrefix__T = (function() {
  return "None"
});
$c_s_None$.prototype.productArity__I = (function() {
  return 0
});
$c_s_None$.prototype.isEmpty__Z = (function() {
  return true
});
$c_s_None$.prototype.get__O = (function() {
  this.get__sr_Nothing$()
});
$c_s_None$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_s_None$.prototype.toString__T = (function() {
  return "None"
});
$c_s_None$.prototype.get__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("None.get")
});
$c_s_None$.prototype.hashCode__I = (function() {
  return 2433880
});
$c_s_None$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_s_None$ = new $TypeData().initClass({
  s_None$: 0
}, false, "scala.None$", {
  s_None$: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_None$.prototype.$classData = $d_s_None$;
var $n_s_None$ = (void 0);
function $m_s_None$() {
  if ((!$n_s_None$)) {
    $n_s_None$ = new $c_s_None$().init___()
  };
  return $n_s_None$
}
/** @constructor */
function $c_s_Some() {
  $c_s_Option.call(this);
  this.x$2 = null
}
$c_s_Some.prototype = new $h_s_Option();
$c_s_Some.prototype.constructor = $c_s_Some;
/** @constructor */
function $h_s_Some() {
  /*<skip>*/
}
$h_s_Some.prototype = $c_s_Some.prototype;
$c_s_Some.prototype.productPrefix__T = (function() {
  return "Some"
});
$c_s_Some.prototype.productArity__I = (function() {
  return 1
});
$c_s_Some.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_Some(x$1)) {
    var Some$1 = $as_s_Some(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.x$2, Some$1.x$2)
  } else {
    return false
  }
});
$c_s_Some.prototype.isEmpty__Z = (function() {
  return false
});
$c_s_Some.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_Some.prototype.get__O = (function() {
  return this.x$2
});
$c_s_Some.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_Some.prototype.init___O = (function(x) {
  this.x$2 = x;
  return this
});
$c_s_Some.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_Some.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_Some(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Some)))
}
function $as_s_Some(obj) {
  return (($is_s_Some(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Some"))
}
function $isArrayOf_s_Some(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Some)))
}
function $asArrayOf_s_Some(obj, depth) {
  return (($isArrayOf_s_Some(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Some;", depth))
}
var $d_s_Some = new $TypeData().initClass({
  s_Some: 0
}, false, "scala.Some", {
  s_Some: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Some.prototype.$classData = $d_s_Some;
/** @constructor */
function $c_s_StringContext$InvalidEscapeException() {
  $c_jl_IllegalArgumentException.call(this);
  this.index$5 = 0
}
$c_s_StringContext$InvalidEscapeException.prototype = new $h_jl_IllegalArgumentException();
$c_s_StringContext$InvalidEscapeException.prototype.constructor = $c_s_StringContext$InvalidEscapeException;
/** @constructor */
function $h_s_StringContext$InvalidEscapeException() {
  /*<skip>*/
}
$h_s_StringContext$InvalidEscapeException.prototype = $c_s_StringContext$InvalidEscapeException.prototype;
$c_s_StringContext$InvalidEscapeException.prototype.init___T__I = (function(str, index) {
  this.index$5 = index;
  var jsx$3 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["invalid escape ", " index ", " in \"", "\". Use \\\\\\\\ for literal \\\\."]));
  $m_s_Predef$().require__Z__V(((index >= 0) && (index < $uI(str["length"]))));
  if ((index === (((-1) + $uI(str["length"])) | 0))) {
    var jsx$1 = "at terminal"
  } else {
    var jsx$2 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["'\\\\", "' not one of ", " at"]));
    var index$1 = ((1 + index) | 0);
    var c = (65535 & $uI(str["charCodeAt"](index$1)));
    var jsx$1 = jsx$2.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_jl_Character().init___C(c), "[\\b, \\t, \\n, \\f, \\r, \\\\, \\\", \\']"]))
  };
  $c_jl_IllegalArgumentException.prototype.init___T.call(this, jsx$3.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([jsx$1, index, str])));
  return this
});
var $d_s_StringContext$InvalidEscapeException = new $TypeData().initClass({
  s_StringContext$InvalidEscapeException: 0
}, false, "scala.StringContext$InvalidEscapeException", {
  s_StringContext$InvalidEscapeException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$InvalidEscapeException.prototype.$classData = $d_s_StringContext$InvalidEscapeException;
/** @constructor */
function $c_sc_Iterator$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.hd$2 = null;
  this.hdDefined$2 = false;
  this.$$outer$2 = null
}
$c_sc_Iterator$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$1.prototype.constructor = $c_sc_Iterator$$anon$1;
/** @constructor */
function $h_sc_Iterator$$anon$1() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$1.prototype = $c_sc_Iterator$$anon$1.prototype;
$c_sc_Iterator$$anon$1.prototype.next__O = (function() {
  if (this.hdDefined$2) {
    this.hdDefined$2 = false;
    return this.hd$2
  } else {
    return this.$$outer$2.next__O()
  }
});
$c_sc_Iterator$$anon$1.prototype.head__O = (function() {
  if ((!this.hdDefined$2)) {
    this.hd$2 = this.next__O();
    this.hdDefined$2 = true
  };
  return this.hd$2
});
$c_sc_Iterator$$anon$1.prototype.buffered__sc_BufferedIterator = (function() {
  return this
});
$c_sc_Iterator$$anon$1.prototype.hasNext__Z = (function() {
  return (this.hdDefined$2 || this.$$outer$2.hasNext__Z())
});
$c_sc_Iterator$$anon$1.prototype.init___sc_Iterator = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.hdDefined$2 = false;
  return this
});
var $d_sc_Iterator$$anon$1 = new $TypeData().initClass({
  sc_Iterator$$anon$1: 0
}, false, "scala.collection.Iterator$$anon$1", {
  sc_Iterator$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_BufferedIterator: 1
});
$c_sc_Iterator$$anon$1.prototype.$classData = $d_sc_Iterator$$anon$1;
function $is_sc_TraversableLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableLike)))
}
function $as_sc_TraversableLike(obj) {
  return (($is_sc_TraversableLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableLike"))
}
function $isArrayOf_sc_TraversableLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableLike)))
}
function $asArrayOf_sc_TraversableLike(obj, depth) {
  return (($isArrayOf_sc_TraversableLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableLike;", depth))
}
/** @constructor */
function $c_scg_SeqFactory() {
  $c_scg_GenSeqFactory.call(this)
}
$c_scg_SeqFactory.prototype = new $h_scg_GenSeqFactory();
$c_scg_SeqFactory.prototype.constructor = $c_scg_SeqFactory;
/** @constructor */
function $h_scg_SeqFactory() {
  /*<skip>*/
}
$h_scg_SeqFactory.prototype = $c_scg_SeqFactory.prototype;
/** @constructor */
function $c_sci_HashMap$HashTrieMap$$anon$1() {
  $c_sci_TrieIterator.call(this)
}
$c_sci_HashMap$HashTrieMap$$anon$1.prototype = new $h_sci_TrieIterator();
$c_sci_HashMap$HashTrieMap$$anon$1.prototype.constructor = $c_sci_HashMap$HashTrieMap$$anon$1;
/** @constructor */
function $h_sci_HashMap$HashTrieMap$$anon$1() {
  /*<skip>*/
}
$h_sci_HashMap$HashTrieMap$$anon$1.prototype = $c_sci_HashMap$HashTrieMap$$anon$1.prototype;
$c_sci_HashMap$HashTrieMap$$anon$1.prototype.init___sci_HashMap$HashTrieMap = (function($$outer) {
  $c_sci_TrieIterator.prototype.init___Asci_Iterable.call(this, $$outer.elems$6);
  return this
});
$c_sci_HashMap$HashTrieMap$$anon$1.prototype.getElem__O__O = (function(x) {
  return $as_sci_HashMap$HashMap1(x).ensurePair__T2()
});
var $d_sci_HashMap$HashTrieMap$$anon$1 = new $TypeData().initClass({
  sci_HashMap$HashTrieMap$$anon$1: 0
}, false, "scala.collection.immutable.HashMap$HashTrieMap$$anon$1", {
  sci_HashMap$HashTrieMap$$anon$1: 1,
  sci_TrieIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_HashMap$HashTrieMap$$anon$1.prototype.$classData = $d_sci_HashMap$HashTrieMap$$anon$1;
/** @constructor */
function $c_sci_HashSet$HashTrieSet$$anon$1() {
  $c_sci_TrieIterator.call(this)
}
$c_sci_HashSet$HashTrieSet$$anon$1.prototype = new $h_sci_TrieIterator();
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.constructor = $c_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $h_sci_HashSet$HashTrieSet$$anon$1() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet$$anon$1.prototype = $c_sci_HashSet$HashTrieSet$$anon$1.prototype;
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.init___sci_HashSet$HashTrieSet = (function($$outer) {
  $c_sci_TrieIterator.prototype.init___Asci_Iterable.call(this, $$outer.elems$5);
  return this
});
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.getElem__O__O = (function(cc) {
  return $as_sci_HashSet$HashSet1(cc).key$6
});
var $d_sci_HashSet$HashTrieSet$$anon$1 = new $TypeData().initClass({
  sci_HashSet$HashTrieSet$$anon$1: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet$$anon$1", {
  sci_HashSet$HashTrieSet$$anon$1: 1,
  sci_TrieIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.$classData = $d_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $c_sci_Set$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_Set$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_Set$.prototype.constructor = $c_sci_Set$;
/** @constructor */
function $h_sci_Set$() {
  /*<skip>*/
}
$h_sci_Set$.prototype = $c_sci_Set$.prototype;
$c_sci_Set$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
var $d_sci_Set$ = new $TypeData().initClass({
  sci_Set$: 0
}, false, "scala.collection.immutable.Set$", {
  sci_Set$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Set$.prototype.$classData = $d_sci_Set$;
var $n_sci_Set$ = (void 0);
function $m_sci_Set$() {
  if ((!$n_sci_Set$)) {
    $n_sci_Set$ = new $c_sci_Set$().init___()
  };
  return $n_sci_Set$
}
/** @constructor */
function $c_sci_VectorIterator() {
  $c_sc_AbstractIterator.call(this);
  this.endIndex$2 = 0;
  this.blockIndex$2 = 0;
  this.lo$2 = 0;
  this.endLo$2 = 0;
  this.$$undhasNext$2 = false;
  this.depth$2 = 0;
  this.display0$2 = null;
  this.display1$2 = null;
  this.display2$2 = null;
  this.display3$2 = null;
  this.display4$2 = null;
  this.display5$2 = null
}
$c_sci_VectorIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_VectorIterator.prototype.constructor = $c_sci_VectorIterator;
/** @constructor */
function $h_sci_VectorIterator() {
  /*<skip>*/
}
$h_sci_VectorIterator.prototype = $c_sci_VectorIterator.prototype;
$c_sci_VectorIterator.prototype.next__O = (function() {
  if ((!this.$$undhasNext$2)) {
    throw new $c_ju_NoSuchElementException().init___T("reached iterator end")
  };
  var res = this.display0$2.u[this.lo$2];
  this.lo$2 = ((1 + this.lo$2) | 0);
  if ((this.lo$2 === this.endLo$2)) {
    if ((((this.blockIndex$2 + this.lo$2) | 0) < this.endIndex$2)) {
      var newBlockIndex = ((32 + this.blockIndex$2) | 0);
      var xor = (this.blockIndex$2 ^ newBlockIndex);
      $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
      this.blockIndex$2 = newBlockIndex;
      var x = ((this.endIndex$2 - this.blockIndex$2) | 0);
      this.endLo$2 = ((x < 32) ? x : 32);
      this.lo$2 = 0
    } else {
      this.$$undhasNext$2 = false
    }
  };
  return res
});
$c_sci_VectorIterator.prototype.display3__AO = (function() {
  return this.display3$2
});
$c_sci_VectorIterator.prototype.depth__I = (function() {
  return this.depth$2
});
$c_sci_VectorIterator.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$2 = x$1
});
$c_sci_VectorIterator.prototype.init___I__I = (function(_startIndex, endIndex) {
  this.endIndex$2 = endIndex;
  this.blockIndex$2 = ((-32) & _startIndex);
  this.lo$2 = (31 & _startIndex);
  var x = ((endIndex - this.blockIndex$2) | 0);
  this.endLo$2 = ((x < 32) ? x : 32);
  this.$$undhasNext$2 = (((this.blockIndex$2 + this.lo$2) | 0) < endIndex);
  return this
});
$c_sci_VectorIterator.prototype.display0__AO = (function() {
  return this.display0$2
});
$c_sci_VectorIterator.prototype.display4__AO = (function() {
  return this.display4$2
});
$c_sci_VectorIterator.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$2 = x$1
});
$c_sci_VectorIterator.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$2 = x$1
});
$c_sci_VectorIterator.prototype.hasNext__Z = (function() {
  return this.$$undhasNext$2
});
$c_sci_VectorIterator.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$2 = x$1
});
$c_sci_VectorIterator.prototype.display1__AO = (function() {
  return this.display1$2
});
$c_sci_VectorIterator.prototype.display5__AO = (function() {
  return this.display5$2
});
$c_sci_VectorIterator.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$2 = x$1
});
$c_sci_VectorIterator.prototype.display2__AO = (function() {
  return this.display2$2
});
$c_sci_VectorIterator.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$2 = x$1
});
$c_sci_VectorIterator.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$2 = x$1
});
var $d_sci_VectorIterator = new $TypeData().initClass({
  sci_VectorIterator: 0
}, false, "scala.collection.immutable.VectorIterator", {
  sci_VectorIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorIterator.prototype.$classData = $d_sci_VectorIterator;
/** @constructor */
function $c_sjsr_UndefinedBehaviorError() {
  $c_jl_Error.call(this)
}
$c_sjsr_UndefinedBehaviorError.prototype = new $h_jl_Error();
$c_sjsr_UndefinedBehaviorError.prototype.constructor = $c_sjsr_UndefinedBehaviorError;
/** @constructor */
function $h_sjsr_UndefinedBehaviorError() {
  /*<skip>*/
}
$h_sjsr_UndefinedBehaviorError.prototype = $c_sjsr_UndefinedBehaviorError.prototype;
$c_sjsr_UndefinedBehaviorError.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.scala$util$control$NoStackTrace$$super$fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.init___jl_Throwable = (function(cause) {
  $c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable.call(this, ("An undefined behavior was detected" + ((cause === null) ? "" : (": " + cause.getMessage__T()))), cause);
  return this
});
$c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable = (function(message, cause) {
  $c_jl_Error.prototype.init___T__jl_Throwable.call(this, message, cause);
  return this
});
var $d_sjsr_UndefinedBehaviorError = new $TypeData().initClass({
  sjsr_UndefinedBehaviorError: 0
}, false, "scala.scalajs.runtime.UndefinedBehaviorError", {
  sjsr_UndefinedBehaviorError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sjsr_UndefinedBehaviorError.prototype.$classData = $d_sjsr_UndefinedBehaviorError;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream() {
  $c_Ljava_io_PrintStream.call(this);
  this.isErr$4 = null;
  this.flushed$4 = false;
  this.buffer$4 = null
}
$c_jl_JSConsoleBasedPrintStream.prototype = new $h_Ljava_io_PrintStream();
$c_jl_JSConsoleBasedPrintStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream.prototype = $c_jl_JSConsoleBasedPrintStream.prototype;
$c_jl_JSConsoleBasedPrintStream.prototype.init___jl_Boolean = (function(isErr) {
  this.isErr$4 = isErr;
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream.call(this, new $c_jl_JSConsoleBasedPrintStream$DummyOutputStream().init___());
  this.flushed$4 = true;
  this.buffer$4 = "";
  return this
});
$c_jl_JSConsoleBasedPrintStream.prototype.print__T__V = (function(s) {
  this.printString__p4__T__V(((s === null) ? "null" : s))
});
$c_jl_JSConsoleBasedPrintStream.prototype.doWriteLine__p4__T__V = (function(line) {
  var x = $g["console"];
  if ($uZ((!(!x)))) {
    var x$1 = this.isErr$4;
    if ($uZ(x$1)) {
      var x$2 = $g["console"]["error"];
      var jsx$1 = $uZ((!(!x$2)))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      $g["console"]["error"](line)
    } else {
      $g["console"]["log"](line)
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.print__O__V = (function(obj) {
  this.printString__p4__T__V($m_sjsr_RuntimeString$().valueOf__O__T(obj))
});
$c_jl_JSConsoleBasedPrintStream.prototype.print__C__V = (function(c) {
  this.printString__p4__T__V($m_sjsr_RuntimeString$().valueOf__C__T(c))
});
$c_jl_JSConsoleBasedPrintStream.prototype.printString__p4__T__V = (function(s) {
  var rest = s;
  while ((rest !== "")) {
    var thiz = rest;
    var nlPos = $uI(thiz["indexOf"]("\n"));
    if ((nlPos < 0)) {
      this.buffer$4 = (("" + this.buffer$4) + rest);
      this.flushed$4 = false;
      rest = ""
    } else {
      var jsx$1 = this.buffer$4;
      var thiz$1 = rest;
      this.doWriteLine__p4__T__V((("" + jsx$1) + $as_T(thiz$1["substring"](0, nlPos))));
      this.buffer$4 = "";
      this.flushed$4 = true;
      var thiz$2 = rest;
      var beginIndex = ((1 + nlPos) | 0);
      rest = $as_T(thiz$2["substring"](beginIndex))
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.close__V = (function() {
  /*<skip>*/
});
var $d_jl_JSConsoleBasedPrintStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream", {
  jl_JSConsoleBasedPrintStream: 1,
  Ljava_io_PrintStream: 1,
  Ljava_io_FilterOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1,
  jl_Appendable: 1
});
$c_jl_JSConsoleBasedPrintStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $c_ju_FormatFlagsConversionMismatchException() {
  $c_ju_IllegalFormatException.call(this);
  this.c$6 = 0;
  this.f$6 = null
}
$c_ju_FormatFlagsConversionMismatchException.prototype = new $h_ju_IllegalFormatException();
$c_ju_FormatFlagsConversionMismatchException.prototype.constructor = $c_ju_FormatFlagsConversionMismatchException;
/** @constructor */
function $h_ju_FormatFlagsConversionMismatchException() {
  /*<skip>*/
}
$h_ju_FormatFlagsConversionMismatchException.prototype = $c_ju_FormatFlagsConversionMismatchException.prototype;
$c_ju_FormatFlagsConversionMismatchException.prototype.getMessage__T = (function() {
  var c = this.c$6;
  return ((("Conversion = " + new $c_jl_Character().init___C(c)) + ", Flags = ") + this.f$6)
});
$c_ju_FormatFlagsConversionMismatchException.prototype.init___C = (function(c) {
  this.c$6 = c;
  $c_ju_IllegalFormatException.prototype.init___.call(this);
  this.f$6 = null;
  return this
});
$c_ju_FormatFlagsConversionMismatchException.prototype.init___T__C = (function(f, c) {
  $c_ju_FormatFlagsConversionMismatchException.prototype.init___C.call(this, c);
  if ((f === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  this.f$6 = f;
  return this
});
var $d_ju_FormatFlagsConversionMismatchException = new $TypeData().initClass({
  ju_FormatFlagsConversionMismatchException: 0
}, false, "java.util.FormatFlagsConversionMismatchException", {
  ju_FormatFlagsConversionMismatchException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_FormatFlagsConversionMismatchException.prototype.$classData = $d_ju_FormatFlagsConversionMismatchException;
/** @constructor */
function $c_ju_IllegalFormatFlagsException() {
  $c_ju_IllegalFormatException.call(this);
  this.flags$6 = null
}
$c_ju_IllegalFormatFlagsException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatFlagsException.prototype.constructor = $c_ju_IllegalFormatFlagsException;
/** @constructor */
function $h_ju_IllegalFormatFlagsException() {
  /*<skip>*/
}
$h_ju_IllegalFormatFlagsException.prototype = $c_ju_IllegalFormatFlagsException.prototype;
$c_ju_IllegalFormatFlagsException.prototype.init___ = (function() {
  $c_ju_IllegalFormatException.prototype.init___.call(this);
  this.flags$6 = null;
  return this
});
$c_ju_IllegalFormatFlagsException.prototype.getMessage__T = (function() {
  return (("Flags = '" + this.flags$6) + "'")
});
$c_ju_IllegalFormatFlagsException.prototype.init___T = (function(f) {
  $c_ju_IllegalFormatFlagsException.prototype.init___.call(this);
  if ((f === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  this.flags$6 = f;
  return this
});
var $d_ju_IllegalFormatFlagsException = new $TypeData().initClass({
  ju_IllegalFormatFlagsException: 0
}, false, "java.util.IllegalFormatFlagsException", {
  ju_IllegalFormatFlagsException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatFlagsException.prototype.$classData = $d_ju_IllegalFormatFlagsException;
/** @constructor */
function $c_ju_MissingFormatArgumentException() {
  $c_ju_IllegalFormatException.call(this);
  this.s$6 = null
}
$c_ju_MissingFormatArgumentException.prototype = new $h_ju_IllegalFormatException();
$c_ju_MissingFormatArgumentException.prototype.constructor = $c_ju_MissingFormatArgumentException;
/** @constructor */
function $h_ju_MissingFormatArgumentException() {
  /*<skip>*/
}
$h_ju_MissingFormatArgumentException.prototype = $c_ju_MissingFormatArgumentException.prototype;
$c_ju_MissingFormatArgumentException.prototype.init___ = (function() {
  $c_ju_IllegalFormatException.prototype.init___.call(this);
  this.s$6 = null;
  return this
});
$c_ju_MissingFormatArgumentException.prototype.getMessage__T = (function() {
  return (("Format specifier '" + this.s$6) + "'")
});
$c_ju_MissingFormatArgumentException.prototype.init___T = (function(s) {
  $c_ju_MissingFormatArgumentException.prototype.init___.call(this);
  if ((s === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  this.s$6 = s;
  return this
});
var $d_ju_MissingFormatArgumentException = new $TypeData().initClass({
  ju_MissingFormatArgumentException: 0
}, false, "java.util.MissingFormatArgumentException", {
  ju_MissingFormatArgumentException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_MissingFormatArgumentException.prototype.$classData = $d_ju_MissingFormatArgumentException;
/** @constructor */
function $c_s_math_Ordering$$anon$9() {
  $c_O.call(this);
  this.cmp$1$1 = null
}
$c_s_math_Ordering$$anon$9.prototype = new $h_O();
$c_s_math_Ordering$$anon$9.prototype.constructor = $c_s_math_Ordering$$anon$9;
/** @constructor */
function $h_s_math_Ordering$$anon$9() {
  /*<skip>*/
}
$h_s_math_Ordering$$anon$9.prototype = $c_s_math_Ordering$$anon$9.prototype;
$c_s_math_Ordering$$anon$9.prototype.init___F2 = (function(cmp$1) {
  this.cmp$1$1 = cmp$1;
  return this
});
$c_s_math_Ordering$$anon$9.prototype.lt__O__O__Z = (function(x, y) {
  return $uZ(this.cmp$1$1.apply__O__O__O(x, y))
});
$c_s_math_Ordering$$anon$9.prototype.compare__O__O__I = (function(x, y) {
  return ($uZ(this.cmp$1$1.apply__O__O__O(x, y)) ? (-1) : ($uZ(this.cmp$1$1.apply__O__O__O(y, x)) ? 1 : 0))
});
$c_s_math_Ordering$$anon$9.prototype.lteq__O__O__Z = (function(x, y) {
  return (!$uZ(this.cmp$1$1.apply__O__O__O(y, x)))
});
var $d_s_math_Ordering$$anon$9 = new $TypeData().initClass({
  s_math_Ordering$$anon$9: 0
}, false, "scala.math.Ordering$$anon$9", {
  s_math_Ordering$$anon$9: 1,
  O: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$$anon$9.prototype.$classData = $d_s_math_Ordering$$anon$9;
function $is_sc_GenIterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenIterable)))
}
function $as_sc_GenIterable(obj) {
  return (($is_sc_GenIterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenIterable"))
}
function $isArrayOf_sc_GenIterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenIterable)))
}
function $asArrayOf_sc_GenIterable(obj, depth) {
  return (($isArrayOf_sc_GenIterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenIterable;", depth))
}
/** @constructor */
function $c_sc_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sc_Seq$.prototype = new $h_scg_SeqFactory();
$c_sc_Seq$.prototype.constructor = $c_sc_Seq$;
/** @constructor */
function $h_sc_Seq$() {
  /*<skip>*/
}
$h_sc_Seq$.prototype = $c_sc_Seq$.prototype;
$c_sc_Seq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Seq$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Seq$ = new $TypeData().initClass({
  sc_Seq$: 0
}, false, "scala.collection.Seq$", {
  sc_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Seq$.prototype.$classData = $d_sc_Seq$;
var $n_sc_Seq$ = (void 0);
function $m_sc_Seq$() {
  if ((!$n_sc_Seq$)) {
    $n_sc_Seq$ = new $c_sc_Seq$().init___()
  };
  return $n_sc_Seq$
}
/** @constructor */
function $c_scg_IndexedSeqFactory() {
  $c_scg_SeqFactory.call(this)
}
$c_scg_IndexedSeqFactory.prototype = new $h_scg_SeqFactory();
$c_scg_IndexedSeqFactory.prototype.constructor = $c_scg_IndexedSeqFactory;
/** @constructor */
function $h_scg_IndexedSeqFactory() {
  /*<skip>*/
}
$h_scg_IndexedSeqFactory.prototype = $c_scg_IndexedSeqFactory.prototype;
/** @constructor */
function $c_sci_HashMap$() {
  $c_scg_ImmutableMapFactory.call(this);
  this.defaultMerger$4 = null
}
$c_sci_HashMap$.prototype = new $h_scg_ImmutableMapFactory();
$c_sci_HashMap$.prototype.constructor = $c_sci_HashMap$;
/** @constructor */
function $h_sci_HashMap$() {
  /*<skip>*/
}
$h_sci_HashMap$.prototype = $c_sci_HashMap$.prototype;
$c_sci_HashMap$.prototype.init___ = (function() {
  $n_sci_HashMap$ = this;
  var mergef = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(a$2, b$2) {
      var a = $as_T2(a$2);
      $as_T2(b$2);
      return a
    })
  })(this));
  this.defaultMerger$4 = new $c_sci_HashMap$$anon$2().init___F2(mergef);
  return this
});
$c_sci_HashMap$.prototype.scala$collection$immutable$HashMap$$makeHashTrieMap__I__sci_HashMap__I__sci_HashMap__I__I__sci_HashMap$HashTrieMap = (function(hash0, elem0, hash1, elem1, level, size) {
  var index0 = (31 & ((hash0 >>> level) | 0));
  var index1 = (31 & ((hash1 >>> level) | 0));
  if ((index0 !== index1)) {
    var bitmap = ((1 << index0) | (1 << index1));
    var elems = $newArrayObject($d_sci_HashMap.getArrayOf(), [2]);
    if ((index0 < index1)) {
      elems.u[0] = elem0;
      elems.u[1] = elem1
    } else {
      elems.u[0] = elem1;
      elems.u[1] = elem0
    };
    return new $c_sci_HashMap$HashTrieMap().init___I__Asci_HashMap__I(bitmap, elems, size)
  } else {
    var elems$2 = $newArrayObject($d_sci_HashMap.getArrayOf(), [1]);
    var bitmap$2 = (1 << index0);
    elems$2.u[0] = this.scala$collection$immutable$HashMap$$makeHashTrieMap__I__sci_HashMap__I__sci_HashMap__I__I__sci_HashMap$HashTrieMap(hash0, elem0, hash1, elem1, ((5 + level) | 0), size);
    return new $c_sci_HashMap$HashTrieMap().init___I__Asci_HashMap__I(bitmap$2, elems$2, size)
  }
});
$c_sci_HashMap$.prototype.empty__sc_GenMap = (function() {
  return $m_sci_HashMap$EmptyHashMap$()
});
var $d_sci_HashMap$ = new $TypeData().initClass({
  sci_HashMap$: 0
}, false, "scala.collection.immutable.HashMap$", {
  sci_HashMap$: 1,
  scg_ImmutableMapFactory: 1,
  scg_MapFactory: 1,
  scg_GenMapFactory: 1,
  O: 1,
  scg_BitOperations$Int: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashMap$.prototype.$classData = $d_sci_HashMap$;
var $n_sci_HashMap$ = (void 0);
function $m_sci_HashMap$() {
  if ((!$n_sci_HashMap$)) {
    $n_sci_HashMap$ = new $c_sci_HashMap$().init___()
  };
  return $n_sci_HashMap$
}
/** @constructor */
function $c_sci_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Seq$.prototype = new $h_scg_SeqFactory();
$c_sci_Seq$.prototype.constructor = $c_sci_Seq$;
/** @constructor */
function $h_sci_Seq$() {
  /*<skip>*/
}
$h_sci_Seq$.prototype = $c_sci_Seq$.prototype;
$c_sci_Seq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Seq$ = new $TypeData().initClass({
  sci_Seq$: 0
}, false, "scala.collection.immutable.Seq$", {
  sci_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Seq$.prototype.$classData = $d_sci_Seq$;
var $n_sci_Seq$ = (void 0);
function $m_sci_Seq$() {
  if ((!$n_sci_Seq$)) {
    $n_sci_Seq$ = new $c_sci_Seq$().init___()
  };
  return $n_sci_Seq$
}
/** @constructor */
function $c_scm_IndexedSeq$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_IndexedSeq$.prototype = new $h_scg_SeqFactory();
$c_scm_IndexedSeq$.prototype.constructor = $c_scm_IndexedSeq$;
/** @constructor */
function $h_scm_IndexedSeq$() {
  /*<skip>*/
}
$h_scm_IndexedSeq$.prototype = $c_scm_IndexedSeq$.prototype;
$c_scm_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_IndexedSeq$ = new $TypeData().initClass({
  scm_IndexedSeq$: 0
}, false, "scala.collection.mutable.IndexedSeq$", {
  scm_IndexedSeq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_IndexedSeq$.prototype.$classData = $d_scm_IndexedSeq$;
var $n_scm_IndexedSeq$ = (void 0);
function $m_scm_IndexedSeq$() {
  if ((!$n_scm_IndexedSeq$)) {
    $n_scm_IndexedSeq$ = new $c_scm_IndexedSeq$().init___()
  };
  return $n_scm_IndexedSeq$
}
/** @constructor */
function $c_sjs_js_WrappedArray$() {
  $c_scg_SeqFactory.call(this)
}
$c_sjs_js_WrappedArray$.prototype = new $h_scg_SeqFactory();
$c_sjs_js_WrappedArray$.prototype.constructor = $c_sjs_js_WrappedArray$;
/** @constructor */
function $h_sjs_js_WrappedArray$() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray$.prototype = $c_sjs_js_WrappedArray$.prototype;
$c_sjs_js_WrappedArray$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_WrappedArray().init___()
});
var $d_sjs_js_WrappedArray$ = new $TypeData().initClass({
  sjs_js_WrappedArray$: 0
}, false, "scala.scalajs.js.WrappedArray$", {
  sjs_js_WrappedArray$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sjs_js_WrappedArray$.prototype.$classData = $d_sjs_js_WrappedArray$;
var $n_sjs_js_WrappedArray$ = (void 0);
function $m_sjs_js_WrappedArray$() {
  if ((!$n_sjs_js_WrappedArray$)) {
    $n_sjs_js_WrappedArray$ = new $c_sjs_js_WrappedArray$().init___()
  };
  return $n_sjs_js_WrappedArray$
}
/** @constructor */
function $c_s_Tuple2$mcID$sp() {
  $c_T2.call(this);
  this.$$und1$mcI$sp$f = 0;
  this.$$und2$mcD$sp$f = 0.0
}
$c_s_Tuple2$mcID$sp.prototype = new $h_T2();
$c_s_Tuple2$mcID$sp.prototype.constructor = $c_s_Tuple2$mcID$sp;
/** @constructor */
function $h_s_Tuple2$mcID$sp() {
  /*<skip>*/
}
$h_s_Tuple2$mcID$sp.prototype = $c_s_Tuple2$mcID$sp.prototype;
$c_s_Tuple2$mcID$sp.prototype.$$und1$mcI$sp__I = (function() {
  return this.$$und1$mcI$sp$f
});
$c_s_Tuple2$mcID$sp.prototype.$$und2__O = (function() {
  return this.$$und2$mcD$sp$f
});
$c_s_Tuple2$mcID$sp.prototype.$$und2$mcD$sp__D = (function() {
  return this.$$und2$mcD$sp$f
});
$c_s_Tuple2$mcID$sp.prototype.$$und1__O = (function() {
  return this.$$und1$mcI$sp$f
});
$c_s_Tuple2$mcID$sp.prototype.init___I__D = (function(_1$mcI$sp, _2$mcD$sp) {
  this.$$und1$mcI$sp$f = _1$mcI$sp;
  this.$$und2$mcD$sp$f = _2$mcD$sp;
  $c_T2.prototype.init___O__O.call(this, null, null);
  return this
});
var $d_s_Tuple2$mcID$sp = new $TypeData().initClass({
  s_Tuple2$mcID$sp: 0
}, false, "scala.Tuple2$mcID$sp", {
  s_Tuple2$mcID$sp: 1,
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Product2$mcID$sp: 1
});
$c_s_Tuple2$mcID$sp.prototype.$classData = $d_s_Tuple2$mcID$sp;
/** @constructor */
function $c_s_Tuple2$mcII$sp() {
  $c_T2.call(this);
  this.$$und1$mcI$sp$f = 0;
  this.$$und2$mcI$sp$f = 0
}
$c_s_Tuple2$mcII$sp.prototype = new $h_T2();
$c_s_Tuple2$mcII$sp.prototype.constructor = $c_s_Tuple2$mcII$sp;
/** @constructor */
function $h_s_Tuple2$mcII$sp() {
  /*<skip>*/
}
$h_s_Tuple2$mcII$sp.prototype = $c_s_Tuple2$mcII$sp.prototype;
$c_s_Tuple2$mcII$sp.prototype.$$und1$mcI$sp__I = (function() {
  return this.$$und1$mcI$sp$f
});
$c_s_Tuple2$mcII$sp.prototype.init___I__I = (function(_1$mcI$sp, _2$mcI$sp) {
  this.$$und1$mcI$sp$f = _1$mcI$sp;
  this.$$und2$mcI$sp$f = _2$mcI$sp;
  $c_T2.prototype.init___O__O.call(this, null, null);
  return this
});
$c_s_Tuple2$mcII$sp.prototype.$$und2__O = (function() {
  return this.$$und2$mcI$sp$f
});
$c_s_Tuple2$mcII$sp.prototype.$$und2$mcI$sp__I = (function() {
  return this.$$und2$mcI$sp$f
});
$c_s_Tuple2$mcII$sp.prototype.$$und1__O = (function() {
  return this.$$und1$mcI$sp$f
});
var $d_s_Tuple2$mcII$sp = new $TypeData().initClass({
  s_Tuple2$mcII$sp: 0
}, false, "scala.Tuple2$mcII$sp", {
  s_Tuple2$mcII$sp: 1,
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Product2$mcII$sp: 1
});
$c_s_Tuple2$mcII$sp.prototype.$classData = $d_s_Tuple2$mcII$sp;
/** @constructor */
function $c_s_math_Ordering$Byte$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Byte$.prototype = new $h_O();
$c_s_math_Ordering$Byte$.prototype.constructor = $c_s_math_Ordering$Byte$;
/** @constructor */
function $h_s_math_Ordering$Byte$() {
  /*<skip>*/
}
$h_s_math_Ordering$Byte$.prototype = $c_s_math_Ordering$Byte$.prototype;
$c_s_math_Ordering$Byte$.prototype.init___ = (function() {
  $n_s_math_Ordering$Byte$ = this;
  return this
});
$c_s_math_Ordering$Byte$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Ordering$Byte$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Ordering$ByteOrdering$class__compare__s_math_Ordering$ByteOrdering__B__B__I(this, x$1, y$1)
});
$c_s_math_Ordering$Byte$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Ordering$Byte$ = new $TypeData().initClass({
  s_math_Ordering$Byte$: 0
}, false, "scala.math.Ordering$Byte$", {
  s_math_Ordering$Byte$: 1,
  O: 1,
  s_math_Ordering$ByteOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Byte$.prototype.$classData = $d_s_math_Ordering$Byte$;
var $n_s_math_Ordering$Byte$ = (void 0);
function $m_s_math_Ordering$Byte$() {
  if ((!$n_s_math_Ordering$Byte$)) {
    $n_s_math_Ordering$Byte$ = new $c_s_math_Ordering$Byte$().init___()
  };
  return $n_s_math_Ordering$Byte$
}
/** @constructor */
function $c_s_math_Ordering$Char$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Char$.prototype = new $h_O();
$c_s_math_Ordering$Char$.prototype.constructor = $c_s_math_Ordering$Char$;
/** @constructor */
function $h_s_math_Ordering$Char$() {
  /*<skip>*/
}
$h_s_math_Ordering$Char$.prototype = $c_s_math_Ordering$Char$.prototype;
$c_s_math_Ordering$Char$.prototype.init___ = (function() {
  $n_s_math_Ordering$Char$ = this;
  return this
});
$c_s_math_Ordering$Char$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Ordering$Char$.prototype.compare__O__O__I = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  return $s_s_math_Ordering$CharOrdering$class__compare__s_math_Ordering$CharOrdering__C__C__I(this, x$1, y$1)
});
$c_s_math_Ordering$Char$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Ordering$Char$ = new $TypeData().initClass({
  s_math_Ordering$Char$: 0
}, false, "scala.math.Ordering$Char$", {
  s_math_Ordering$Char$: 1,
  O: 1,
  s_math_Ordering$CharOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Char$.prototype.$classData = $d_s_math_Ordering$Char$;
var $n_s_math_Ordering$Char$ = (void 0);
function $m_s_math_Ordering$Char$() {
  if ((!$n_s_math_Ordering$Char$)) {
    $n_s_math_Ordering$Char$ = new $c_s_math_Ordering$Char$().init___()
  };
  return $n_s_math_Ordering$Char$
}
/** @constructor */
function $c_s_math_Ordering$Double$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Double$.prototype = new $h_O();
$c_s_math_Ordering$Double$.prototype.constructor = $c_s_math_Ordering$Double$;
/** @constructor */
function $h_s_math_Ordering$Double$() {
  /*<skip>*/
}
$h_s_math_Ordering$Double$.prototype = $c_s_math_Ordering$Double$.prototype;
$c_s_math_Ordering$Double$.prototype.init___ = (function() {
  $n_s_math_Ordering$Double$ = this;
  return this
});
$c_s_math_Ordering$Double$.prototype.lt__O__O__Z = (function(x, y) {
  var x$1 = $uD(x);
  var y$1 = $uD(y);
  return $s_s_math_Ordering$DoubleOrdering$class__lt__s_math_Ordering$DoubleOrdering__D__D__Z(this, x$1, y$1)
});
$c_s_math_Ordering$Double$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uD(x);
  var y$1 = $uD(y);
  return $m_jl_Double$().compare__D__D__I(x$1, y$1)
});
$c_s_math_Ordering$Double$.prototype.lteq__O__O__Z = (function(x, y) {
  var x$1 = $uD(x);
  var y$1 = $uD(y);
  return $s_s_math_Ordering$DoubleOrdering$class__lteq__s_math_Ordering$DoubleOrdering__D__D__Z(this, x$1, y$1)
});
var $d_s_math_Ordering$Double$ = new $TypeData().initClass({
  s_math_Ordering$Double$: 0
}, false, "scala.math.Ordering$Double$", {
  s_math_Ordering$Double$: 1,
  O: 1,
  s_math_Ordering$DoubleOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Double$.prototype.$classData = $d_s_math_Ordering$Double$;
var $n_s_math_Ordering$Double$ = (void 0);
function $m_s_math_Ordering$Double$() {
  if ((!$n_s_math_Ordering$Double$)) {
    $n_s_math_Ordering$Double$ = new $c_s_math_Ordering$Double$().init___()
  };
  return $n_s_math_Ordering$Double$
}
/** @constructor */
function $c_s_math_Ordering$Int$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Int$.prototype = new $h_O();
$c_s_math_Ordering$Int$.prototype.constructor = $c_s_math_Ordering$Int$;
/** @constructor */
function $h_s_math_Ordering$Int$() {
  /*<skip>*/
}
$h_s_math_Ordering$Int$.prototype = $c_s_math_Ordering$Int$.prototype;
$c_s_math_Ordering$Int$.prototype.init___ = (function() {
  $n_s_math_Ordering$Int$ = this;
  return this
});
$c_s_math_Ordering$Int$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Ordering$Int$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Ordering$IntOrdering$class__compare__s_math_Ordering$IntOrdering__I__I__I(this, x$1, y$1)
});
$c_s_math_Ordering$Int$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Ordering$Int$ = new $TypeData().initClass({
  s_math_Ordering$Int$: 0
}, false, "scala.math.Ordering$Int$", {
  s_math_Ordering$Int$: 1,
  O: 1,
  s_math_Ordering$IntOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Int$.prototype.$classData = $d_s_math_Ordering$Int$;
var $n_s_math_Ordering$Int$ = (void 0);
function $m_s_math_Ordering$Int$() {
  if ((!$n_s_math_Ordering$Int$)) {
    $n_s_math_Ordering$Int$ = new $c_s_math_Ordering$Int$().init___()
  };
  return $n_s_math_Ordering$Int$
}
/** @constructor */
function $c_s_math_Ordering$Long$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Long$.prototype = new $h_O();
$c_s_math_Ordering$Long$.prototype.constructor = $c_s_math_Ordering$Long$;
/** @constructor */
function $h_s_math_Ordering$Long$() {
  /*<skip>*/
}
$h_s_math_Ordering$Long$.prototype = $c_s_math_Ordering$Long$.prototype;
$c_s_math_Ordering$Long$.prototype.init___ = (function() {
  $n_s_math_Ordering$Long$ = this;
  return this
});
$c_s_math_Ordering$Long$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Ordering$Long$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Ordering$LongOrdering$class__compare__s_math_Ordering$LongOrdering__J__J__I(this, x$1, y$1)
});
$c_s_math_Ordering$Long$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Ordering$Long$ = new $TypeData().initClass({
  s_math_Ordering$Long$: 0
}, false, "scala.math.Ordering$Long$", {
  s_math_Ordering$Long$: 1,
  O: 1,
  s_math_Ordering$LongOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Long$.prototype.$classData = $d_s_math_Ordering$Long$;
var $n_s_math_Ordering$Long$ = (void 0);
function $m_s_math_Ordering$Long$() {
  if ((!$n_s_math_Ordering$Long$)) {
    $n_s_math_Ordering$Long$ = new $c_s_math_Ordering$Long$().init___()
  };
  return $n_s_math_Ordering$Long$
}
/** @constructor */
function $c_s_math_Ordering$Short$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Short$.prototype = new $h_O();
$c_s_math_Ordering$Short$.prototype.constructor = $c_s_math_Ordering$Short$;
/** @constructor */
function $h_s_math_Ordering$Short$() {
  /*<skip>*/
}
$h_s_math_Ordering$Short$.prototype = $c_s_math_Ordering$Short$.prototype;
$c_s_math_Ordering$Short$.prototype.init___ = (function() {
  $n_s_math_Ordering$Short$ = this;
  return this
});
$c_s_math_Ordering$Short$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Ordering$Short$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Ordering$ShortOrdering$class__compare__s_math_Ordering$ShortOrdering__S__S__I(this, x$1, y$1)
});
$c_s_math_Ordering$Short$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Ordering$Short$ = new $TypeData().initClass({
  s_math_Ordering$Short$: 0
}, false, "scala.math.Ordering$Short$", {
  s_math_Ordering$Short$: 1,
  O: 1,
  s_math_Ordering$ShortOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Short$.prototype.$classData = $d_s_math_Ordering$Short$;
var $n_s_math_Ordering$Short$ = (void 0);
function $m_s_math_Ordering$Short$() {
  if ((!$n_s_math_Ordering$Short$)) {
    $n_s_math_Ordering$Short$ = new $c_s_math_Ordering$Short$().init___()
  };
  return $n_s_math_Ordering$Short$
}
/** @constructor */
function $c_s_reflect_AnyValManifest() {
  $c_O.call(this);
  this.toString$1 = null
}
$c_s_reflect_AnyValManifest.prototype = new $h_O();
$c_s_reflect_AnyValManifest.prototype.constructor = $c_s_reflect_AnyValManifest;
/** @constructor */
function $h_s_reflect_AnyValManifest() {
  /*<skip>*/
}
$h_s_reflect_AnyValManifest.prototype = $c_s_reflect_AnyValManifest.prototype;
$c_s_reflect_AnyValManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_AnyValManifest.prototype.toString__T = (function() {
  return this.toString$1
});
$c_s_reflect_AnyValManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ClassTypeManifest() {
  $c_O.call(this);
  this.prefix$1 = null;
  this.runtimeClass1$1 = null;
  this.typeArguments$1 = null
}
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype = new $h_O();
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype.constructor = $c_s_reflect_ManifestFactory$ClassTypeManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ClassTypeManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ClassTypeManifest.prototype = $c_s_reflect_ManifestFactory$ClassTypeManifest.prototype;
/** @constructor */
function $c_sc_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.ReusableCBF$6 = null
}
$c_sc_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sc_IndexedSeq$.prototype.constructor = $c_sc_IndexedSeq$;
/** @constructor */
function $h_sc_IndexedSeq$() {
  /*<skip>*/
}
$h_sc_IndexedSeq$.prototype = $c_sc_IndexedSeq$.prototype;
$c_sc_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_IndexedSeqFactory.prototype.init___.call(this);
  $n_sc_IndexedSeq$ = this;
  this.ReusableCBF$6 = new $c_sc_IndexedSeq$$anon$1().init___();
  return this
});
$c_sc_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$ = new $TypeData().initClass({
  sc_IndexedSeq$: 0
}, false, "scala.collection.IndexedSeq$", {
  sc_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_IndexedSeq$.prototype.$classData = $d_sc_IndexedSeq$;
var $n_sc_IndexedSeq$ = (void 0);
function $m_sc_IndexedSeq$() {
  if ((!$n_sc_IndexedSeq$)) {
    $n_sc_IndexedSeq$ = new $c_sc_IndexedSeq$().init___()
  };
  return $n_sc_IndexedSeq$
}
/** @constructor */
function $c_sc_IndexedSeqLike$Elements() {
  $c_sc_AbstractIterator.call(this);
  this.end$2 = 0;
  this.index$2 = 0;
  this.$$outer$f = null
}
$c_sc_IndexedSeqLike$Elements.prototype = new $h_sc_AbstractIterator();
$c_sc_IndexedSeqLike$Elements.prototype.constructor = $c_sc_IndexedSeqLike$Elements;
/** @constructor */
function $h_sc_IndexedSeqLike$Elements() {
  /*<skip>*/
}
$h_sc_IndexedSeqLike$Elements.prototype = $c_sc_IndexedSeqLike$Elements.prototype;
$c_sc_IndexedSeqLike$Elements.prototype.head__O = (function() {
  if ((this.index$2 >= this.end$2)) {
    $m_sc_Iterator$().empty$1.next__O()
  };
  return this.$$outer$f.apply__I__O(this.index$2)
});
$c_sc_IndexedSeqLike$Elements.prototype.next__O = (function() {
  if ((this.index$2 >= this.end$2)) {
    $m_sc_Iterator$().empty$1.next__O()
  };
  var x = this.$$outer$f.apply__I__O(this.index$2);
  this.index$2 = ((1 + this.index$2) | 0);
  return x
});
$c_sc_IndexedSeqLike$Elements.prototype.buffered__sc_BufferedIterator = (function() {
  return this
});
$c_sc_IndexedSeqLike$Elements.prototype.init___sc_IndexedSeqLike__I__I = (function($$outer, start, end) {
  this.end$2 = end;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  this.index$2 = start;
  return this
});
$c_sc_IndexedSeqLike$Elements.prototype.hasNext__Z = (function() {
  return (this.index$2 < this.end$2)
});
var $d_sc_IndexedSeqLike$Elements = new $TypeData().initClass({
  sc_IndexedSeqLike$Elements: 0
}, false, "scala.collection.IndexedSeqLike$Elements", {
  sc_IndexedSeqLike$Elements: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_BufferedIterator: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sc_IndexedSeqLike$Elements.prototype.$classData = $d_sc_IndexedSeqLike$Elements;
/** @constructor */
function $c_sci_HashSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_HashSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_HashSet$.prototype.constructor = $c_sci_HashSet$;
/** @constructor */
function $h_sci_HashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$.prototype = $c_sci_HashSet$.prototype;
$c_sci_HashSet$.prototype.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet = (function(hash0, elem0, hash1, elem1, level) {
  var index0 = (31 & ((hash0 >>> level) | 0));
  var index1 = (31 & ((hash1 >>> level) | 0));
  if ((index0 !== index1)) {
    var bitmap = ((1 << index0) | (1 << index1));
    var elems = $newArrayObject($d_sci_HashSet.getArrayOf(), [2]);
    if ((index0 < index1)) {
      elems.u[0] = elem0;
      elems.u[1] = elem1
    } else {
      elems.u[0] = elem1;
      elems.u[1] = elem0
    };
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap, elems, ((elem0.size__I() + elem1.size__I()) | 0))
  } else {
    var elems$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [1]);
    var bitmap$2 = (1 << index0);
    var child = this.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(hash0, elem0, hash1, elem1, ((5 + level) | 0));
    elems$2.u[0] = child;
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap$2, elems$2, child.size0$5)
  }
});
$c_sci_HashSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
var $d_sci_HashSet$ = new $TypeData().initClass({
  sci_HashSet$: 0
}, false, "scala.collection.immutable.HashSet$", {
  sci_HashSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$.prototype.$classData = $d_sci_HashSet$;
var $n_sci_HashSet$ = (void 0);
function $m_sci_HashSet$() {
  if ((!$n_sci_HashSet$)) {
    $n_sci_HashSet$ = new $c_sci_HashSet$().init___()
  };
  return $n_sci_HashSet$
}
/** @constructor */
function $c_sci_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this)
}
$c_sci_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_IndexedSeq$.prototype.constructor = $c_sci_IndexedSeq$;
/** @constructor */
function $h_sci_IndexedSeq$() {
  /*<skip>*/
}
$h_sci_IndexedSeq$.prototype = $c_sci_IndexedSeq$.prototype;
$c_sci_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_IndexedSeq$ = new $TypeData().initClass({
  sci_IndexedSeq$: 0
}, false, "scala.collection.immutable.IndexedSeq$", {
  sci_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_IndexedSeq$.prototype.$classData = $d_sci_IndexedSeq$;
var $n_sci_IndexedSeq$ = (void 0);
function $m_sci_IndexedSeq$() {
  if ((!$n_sci_IndexedSeq$)) {
    $n_sci_IndexedSeq$ = new $c_sci_IndexedSeq$().init___()
  };
  return $n_sci_IndexedSeq$
}
/** @constructor */
function $c_sci_ListSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_ListSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_ListSet$.prototype.constructor = $c_sci_ListSet$;
/** @constructor */
function $h_sci_ListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$.prototype = $c_sci_ListSet$.prototype;
$c_sci_ListSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_ListSet$ListSetBuilder().init___()
});
var $d_sci_ListSet$ = new $TypeData().initClass({
  sci_ListSet$: 0
}, false, "scala.collection.immutable.ListSet$", {
  sci_ListSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$.prototype.$classData = $d_sci_ListSet$;
var $n_sci_ListSet$ = (void 0);
function $m_sci_ListSet$() {
  if ((!$n_sci_ListSet$)) {
    $n_sci_ListSet$ = new $c_sci_ListSet$().init___()
  };
  return $n_sci_ListSet$
}
/** @constructor */
function $c_scm_HashSet$() {
  $c_scg_MutableSetFactory.call(this)
}
$c_scm_HashSet$.prototype = new $h_scg_MutableSetFactory();
$c_scm_HashSet$.prototype.constructor = $c_scm_HashSet$;
/** @constructor */
function $h_scm_HashSet$() {
  /*<skip>*/
}
$h_scm_HashSet$.prototype = $c_scm_HashSet$.prototype;
$c_scm_HashSet$.prototype.empty__sc_GenTraversable = (function() {
  return new $c_scm_HashSet().init___()
});
var $d_scm_HashSet$ = new $TypeData().initClass({
  scm_HashSet$: 0
}, false, "scala.collection.mutable.HashSet$", {
  scm_HashSet$: 1,
  scg_MutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet$.prototype.$classData = $d_scm_HashSet$;
var $n_scm_HashSet$ = (void 0);
function $m_scm_HashSet$() {
  if ((!$n_scm_HashSet$)) {
    $n_scm_HashSet$ = new $c_scm_HashSet$().init___()
  };
  return $n_scm_HashSet$
}
/** @constructor */
function $c_sjs_js_JavaScriptException() {
  $c_jl_RuntimeException.call(this);
  this.exception$4 = null
}
$c_sjs_js_JavaScriptException.prototype = new $h_jl_RuntimeException();
$c_sjs_js_JavaScriptException.prototype.constructor = $c_sjs_js_JavaScriptException;
/** @constructor */
function $h_sjs_js_JavaScriptException() {
  /*<skip>*/
}
$h_sjs_js_JavaScriptException.prototype = $c_sjs_js_JavaScriptException.prototype;
$c_sjs_js_JavaScriptException.prototype.productPrefix__T = (function() {
  return "JavaScriptException"
});
$c_sjs_js_JavaScriptException.prototype.productArity__I = (function() {
  return 1
});
$c_sjs_js_JavaScriptException.prototype.fillInStackTrace__jl_Throwable = (function() {
  $m_sjsr_StackTrace$().captureState__jl_Throwable__O__V(this, this.exception$4);
  return this
});
$c_sjs_js_JavaScriptException.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_sjs_js_JavaScriptException(x$1)) {
    var JavaScriptException$1 = $as_sjs_js_JavaScriptException(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.exception$4, JavaScriptException$1.exception$4)
  } else {
    return false
  }
});
$c_sjs_js_JavaScriptException.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.exception$4;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sjs_js_JavaScriptException.prototype.toString__T = (function() {
  return $objectToString(this.exception$4)
});
$c_sjs_js_JavaScriptException.prototype.init___O = (function(exception) {
  this.exception$4 = exception;
  $c_jl_RuntimeException.prototype.init___.call(this);
  return this
});
$c_sjs_js_JavaScriptException.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_sjs_js_JavaScriptException.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_sjs_js_JavaScriptException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_JavaScriptException)))
}
function $as_sjs_js_JavaScriptException(obj) {
  return (($is_sjs_js_JavaScriptException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.JavaScriptException"))
}
function $isArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_JavaScriptException)))
}
function $asArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (($isArrayOf_sjs_js_JavaScriptException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.JavaScriptException;", depth))
}
var $d_sjs_js_JavaScriptException = new $TypeData().initClass({
  sjs_js_JavaScriptException: 0
}, false, "scala.scalajs.js.JavaScriptException", {
  sjs_js_JavaScriptException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1
});
$c_sjs_js_JavaScriptException.prototype.$classData = $d_sjs_js_JavaScriptException;
/** @constructor */
function $c_s_reflect_ManifestFactory$BooleanManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$BooleanManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$BooleanManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$BooleanManifest$.prototype = $c_s_reflect_ManifestFactory$BooleanManifest$.prototype;
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.init___ = (function() {
  this.toString$1 = "Boolean";
  $n_s_reflect_ManifestFactory$BooleanManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$BooleanManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$BooleanManifest$: 0
}, false, "scala.reflect.ManifestFactory$BooleanManifest$", {
  s_reflect_ManifestFactory$BooleanManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$BooleanManifest$;
var $n_s_reflect_ManifestFactory$BooleanManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$BooleanManifest$() {
  if ((!$n_s_reflect_ManifestFactory$BooleanManifest$)) {
    $n_s_reflect_ManifestFactory$BooleanManifest$ = new $c_s_reflect_ManifestFactory$BooleanManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$BooleanManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ByteManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ByteManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ByteManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ByteManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ByteManifest$.prototype = $c_s_reflect_ManifestFactory$ByteManifest$.prototype;
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.init___ = (function() {
  this.toString$1 = "Byte";
  $n_s_reflect_ManifestFactory$ByteManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ByteManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ByteManifest$: 0
}, false, "scala.reflect.ManifestFactory$ByteManifest$", {
  s_reflect_ManifestFactory$ByteManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ByteManifest$;
var $n_s_reflect_ManifestFactory$ByteManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ByteManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ByteManifest$)) {
    $n_s_reflect_ManifestFactory$ByteManifest$ = new $c_s_reflect_ManifestFactory$ByteManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ByteManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$CharManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$CharManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$CharManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$CharManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$CharManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$CharManifest$.prototype = $c_s_reflect_ManifestFactory$CharManifest$.prototype;
$c_s_reflect_ManifestFactory$CharManifest$.prototype.init___ = (function() {
  this.toString$1 = "Char";
  $n_s_reflect_ManifestFactory$CharManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$CharManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$CharManifest$: 0
}, false, "scala.reflect.ManifestFactory$CharManifest$", {
  s_reflect_ManifestFactory$CharManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$CharManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$CharManifest$;
var $n_s_reflect_ManifestFactory$CharManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$CharManifest$() {
  if ((!$n_s_reflect_ManifestFactory$CharManifest$)) {
    $n_s_reflect_ManifestFactory$CharManifest$ = new $c_s_reflect_ManifestFactory$CharManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$CharManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$DoubleManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$DoubleManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$DoubleManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$DoubleManifest$.prototype = $c_s_reflect_ManifestFactory$DoubleManifest$.prototype;
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.init___ = (function() {
  this.toString$1 = "Double";
  $n_s_reflect_ManifestFactory$DoubleManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$DoubleManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$DoubleManifest$: 0
}, false, "scala.reflect.ManifestFactory$DoubleManifest$", {
  s_reflect_ManifestFactory$DoubleManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$DoubleManifest$;
var $n_s_reflect_ManifestFactory$DoubleManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$DoubleManifest$() {
  if ((!$n_s_reflect_ManifestFactory$DoubleManifest$)) {
    $n_s_reflect_ManifestFactory$DoubleManifest$ = new $c_s_reflect_ManifestFactory$DoubleManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$DoubleManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$FloatManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$FloatManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$FloatManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$FloatManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$FloatManifest$.prototype = $c_s_reflect_ManifestFactory$FloatManifest$.prototype;
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.init___ = (function() {
  this.toString$1 = "Float";
  $n_s_reflect_ManifestFactory$FloatManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$FloatManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$FloatManifest$: 0
}, false, "scala.reflect.ManifestFactory$FloatManifest$", {
  s_reflect_ManifestFactory$FloatManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$FloatManifest$;
var $n_s_reflect_ManifestFactory$FloatManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$FloatManifest$() {
  if ((!$n_s_reflect_ManifestFactory$FloatManifest$)) {
    $n_s_reflect_ManifestFactory$FloatManifest$ = new $c_s_reflect_ManifestFactory$FloatManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$FloatManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$IntManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$IntManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$IntManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$IntManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$IntManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$IntManifest$.prototype = $c_s_reflect_ManifestFactory$IntManifest$.prototype;
$c_s_reflect_ManifestFactory$IntManifest$.prototype.init___ = (function() {
  this.toString$1 = "Int";
  $n_s_reflect_ManifestFactory$IntManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$IntManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$IntManifest$: 0
}, false, "scala.reflect.ManifestFactory$IntManifest$", {
  s_reflect_ManifestFactory$IntManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$IntManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$IntManifest$;
var $n_s_reflect_ManifestFactory$IntManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$IntManifest$() {
  if ((!$n_s_reflect_ManifestFactory$IntManifest$)) {
    $n_s_reflect_ManifestFactory$IntManifest$ = new $c_s_reflect_ManifestFactory$IntManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$IntManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$LongManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$LongManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$LongManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$LongManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$LongManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$LongManifest$.prototype = $c_s_reflect_ManifestFactory$LongManifest$.prototype;
$c_s_reflect_ManifestFactory$LongManifest$.prototype.init___ = (function() {
  this.toString$1 = "Long";
  $n_s_reflect_ManifestFactory$LongManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$LongManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$LongManifest$: 0
}, false, "scala.reflect.ManifestFactory$LongManifest$", {
  s_reflect_ManifestFactory$LongManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$LongManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$LongManifest$;
var $n_s_reflect_ManifestFactory$LongManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$LongManifest$() {
  if ((!$n_s_reflect_ManifestFactory$LongManifest$)) {
    $n_s_reflect_ManifestFactory$LongManifest$ = new $c_s_reflect_ManifestFactory$LongManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$LongManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$PhantomManifest() {
  $c_s_reflect_ManifestFactory$ClassTypeManifest.call(this);
  this.toString$2 = null
}
$c_s_reflect_ManifestFactory$PhantomManifest.prototype = new $h_s_reflect_ManifestFactory$ClassTypeManifest();
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.constructor = $c_s_reflect_ManifestFactory$PhantomManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$PhantomManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$PhantomManifest.prototype = $c_s_reflect_ManifestFactory$PhantomManifest.prototype;
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.toString__T = (function() {
  return this.toString$2
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ShortManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ShortManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ShortManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ShortManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ShortManifest$.prototype = $c_s_reflect_ManifestFactory$ShortManifest$.prototype;
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.init___ = (function() {
  this.toString$1 = "Short";
  $n_s_reflect_ManifestFactory$ShortManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ShortManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ShortManifest$: 0
}, false, "scala.reflect.ManifestFactory$ShortManifest$", {
  s_reflect_ManifestFactory$ShortManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ShortManifest$;
var $n_s_reflect_ManifestFactory$ShortManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ShortManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ShortManifest$)) {
    $n_s_reflect_ManifestFactory$ShortManifest$ = new $c_s_reflect_ManifestFactory$ShortManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ShortManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$UnitManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$UnitManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$UnitManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$UnitManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$UnitManifest$.prototype = $c_s_reflect_ManifestFactory$UnitManifest$.prototype;
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.init___ = (function() {
  this.toString$1 = "Unit";
  $n_s_reflect_ManifestFactory$UnitManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$UnitManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$UnitManifest$: 0
}, false, "scala.reflect.ManifestFactory$UnitManifest$", {
  s_reflect_ManifestFactory$UnitManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$UnitManifest$;
var $n_s_reflect_ManifestFactory$UnitManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$UnitManifest$() {
  if ((!$n_s_reflect_ManifestFactory$UnitManifest$)) {
    $n_s_reflect_ManifestFactory$UnitManifest$ = new $c_s_reflect_ManifestFactory$UnitManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$UnitManifest$
}
function $is_sc_IterableLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IterableLike)))
}
function $as_sc_IterableLike(obj) {
  return (($is_sc_IterableLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IterableLike"))
}
function $isArrayOf_sc_IterableLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IterableLike)))
}
function $asArrayOf_sc_IterableLike(obj, depth) {
  return (($isArrayOf_sc_IterableLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IterableLike;", depth))
}
/** @constructor */
function $c_sci_List$() {
  $c_scg_SeqFactory.call(this);
  this.partialNotApplied$5 = null
}
$c_sci_List$.prototype = new $h_scg_SeqFactory();
$c_sci_List$.prototype.constructor = $c_sci_List$;
/** @constructor */
function $h_sci_List$() {
  /*<skip>*/
}
$h_sci_List$.prototype = $c_sci_List$.prototype;
$c_sci_List$.prototype.init___ = (function() {
  $c_scg_SeqFactory.prototype.init___.call(this);
  $n_sci_List$ = this;
  this.partialNotApplied$5 = new $c_sci_List$$anon$1().init___();
  return this
});
$c_sci_List$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Nil$()
});
$c_sci_List$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_List$ = new $TypeData().initClass({
  sci_List$: 0
}, false, "scala.collection.immutable.List$", {
  sci_List$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_List$.prototype.$classData = $d_sci_List$;
var $n_sci_List$ = (void 0);
function $m_sci_List$() {
  if ((!$n_sci_List$)) {
    $n_sci_List$ = new $c_sci_List$().init___()
  };
  return $n_sci_List$
}
/** @constructor */
function $c_sci_Stream$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Stream$.prototype = new $h_scg_SeqFactory();
$c_sci_Stream$.prototype.constructor = $c_sci_Stream$;
/** @constructor */
function $h_sci_Stream$() {
  /*<skip>*/
}
$h_sci_Stream$.prototype = $c_sci_Stream$.prototype;
$c_sci_Stream$.prototype.range__O__O__O__s_math_Integral__sc_GenTraversable = (function(start, end, step, evidence$2) {
  return this.range__O__O__O__s_math_Integral__sci_Stream(start, end, step, evidence$2)
});
$c_sci_Stream$.prototype.from__I__I__sci_Stream = (function(start, step) {
  var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, start$1, step$1) {
    return (function() {
      return $this.from__I__I__sci_Stream(((start$1 + step$1) | 0), step$1)
    })
  })(this, start, step));
  return new $c_sci_Stream$Cons().init___O__F0(start, tl)
});
$c_sci_Stream$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Stream$Empty$()
});
$c_sci_Stream$.prototype.range__O__O__O__s_math_Integral__sci_Stream = (function(start, end, step, evidence$1) {
  if ((new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$1, step).$$less__O__Z(evidence$1.fromInt__I__O(0)) ? new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$1, start).$$less$eq__O__Z(end) : new $c_s_math_Ordering$Ops().init___s_math_Ordering__O(evidence$1, end).$$less$eq__O__Z(start))) {
    return $m_sci_Stream$Empty$()
  } else {
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, start$1, end$1, step$1, evidence$1$1, num) {
      return (function() {
        return $this.range__O__O__O__s_math_Integral__sci_Stream(new $c_s_math_Integral$IntegralOps().init___s_math_Integral__O(num, start$1).$$plus__O__O(step$1), end$1, step$1, evidence$1$1)
      })
    })(this, start, end, step, evidence$1, evidence$1));
    return new $c_sci_Stream$Cons().init___O__F0(start, tl)
  }
});
$c_sci_Stream$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_Stream$StreamBuilder().init___()
});
var $d_sci_Stream$ = new $TypeData().initClass({
  sci_Stream$: 0
}, false, "scala.collection.immutable.Stream$", {
  sci_Stream$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$.prototype.$classData = $d_sci_Stream$;
var $n_sci_Stream$ = (void 0);
function $m_sci_Stream$() {
  if ((!$n_sci_Stream$)) {
    $n_sci_Stream$ = new $c_sci_Stream$().init___()
  };
  return $n_sci_Stream$
}
/** @constructor */
function $c_scm_ArrayBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ArrayBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ArrayBuffer$.prototype.constructor = $c_scm_ArrayBuffer$;
/** @constructor */
function $h_scm_ArrayBuffer$() {
  /*<skip>*/
}
$h_scm_ArrayBuffer$.prototype = $c_scm_ArrayBuffer$.prototype;
$c_scm_ArrayBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_ArrayBuffer$ = new $TypeData().initClass({
  scm_ArrayBuffer$: 0
}, false, "scala.collection.mutable.ArrayBuffer$", {
  scm_ArrayBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer$.prototype.$classData = $d_scm_ArrayBuffer$;
var $n_scm_ArrayBuffer$ = (void 0);
function $m_scm_ArrayBuffer$() {
  if ((!$n_scm_ArrayBuffer$)) {
    $n_scm_ArrayBuffer$ = new $c_scm_ArrayBuffer$().init___()
  };
  return $n_scm_ArrayBuffer$
}
/** @constructor */
function $c_scm_LinkedList$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_LinkedList$.prototype = new $h_scg_SeqFactory();
$c_scm_LinkedList$.prototype.constructor = $c_scm_LinkedList$;
/** @constructor */
function $h_scm_LinkedList$() {
  /*<skip>*/
}
$h_scm_LinkedList$.prototype = $c_scm_LinkedList$.prototype;
$c_scm_LinkedList$.prototype.empty__sc_GenTraversable = (function() {
  return new $c_scm_LinkedList().init___()
});
$c_scm_LinkedList$.prototype.newBuilder__scm_Builder = (function() {
  var this$1 = new $c_scm_MutableList().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(l$2) {
      var l = $as_scm_MutableList(l$2);
      return l.first0$5
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$1, f)
});
var $d_scm_LinkedList$ = new $TypeData().initClass({
  scm_LinkedList$: 0
}, false, "scala.collection.mutable.LinkedList$", {
  scm_LinkedList$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_LinkedList$.prototype.$classData = $d_scm_LinkedList$;
var $n_scm_LinkedList$ = (void 0);
function $m_scm_LinkedList$() {
  if ((!$n_scm_LinkedList$)) {
    $n_scm_LinkedList$ = new $c_scm_LinkedList$().init___()
  };
  return $n_scm_LinkedList$
}
/** @constructor */
function $c_scm_ListBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ListBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ListBuffer$.prototype.constructor = $c_scm_ListBuffer$;
/** @constructor */
function $h_scm_ListBuffer$() {
  /*<skip>*/
}
$h_scm_ListBuffer$.prototype = $c_scm_ListBuffer$.prototype;
$c_scm_ListBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_ListBuffer().init___())
});
var $d_scm_ListBuffer$ = new $TypeData().initClass({
  scm_ListBuffer$: 0
}, false, "scala.collection.mutable.ListBuffer$", {
  scm_ListBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer$.prototype.$classData = $d_scm_ListBuffer$;
var $n_scm_ListBuffer$ = (void 0);
function $m_scm_ListBuffer$() {
  if ((!$n_scm_ListBuffer$)) {
    $n_scm_ListBuffer$ = new $c_scm_ListBuffer$().init___()
  };
  return $n_scm_ListBuffer$
}
/** @constructor */
function $c_scm_MutableList$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_MutableList$.prototype = new $h_scg_SeqFactory();
$c_scm_MutableList$.prototype.constructor = $c_scm_MutableList$;
/** @constructor */
function $h_scm_MutableList$() {
  /*<skip>*/
}
$h_scm_MutableList$.prototype = $c_scm_MutableList$.prototype;
$c_scm_MutableList$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_MutableList().init___()
});
var $d_scm_MutableList$ = new $TypeData().initClass({
  scm_MutableList$: 0
}, false, "scala.collection.mutable.MutableList$", {
  scm_MutableList$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_MutableList$.prototype.$classData = $d_scm_MutableList$;
var $n_scm_MutableList$ = (void 0);
function $m_scm_MutableList$() {
  if ((!$n_scm_MutableList$)) {
    $n_scm_MutableList$ = new $c_scm_MutableList$().init___()
  };
  return $n_scm_MutableList$
}
/** @constructor */
function $c_scm_Queue$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_Queue$.prototype = new $h_scg_SeqFactory();
$c_scm_Queue$.prototype.constructor = $c_scm_Queue$;
/** @constructor */
function $h_scm_Queue$() {
  /*<skip>*/
}
$h_scm_Queue$.prototype = $c_scm_Queue$.prototype;
$c_scm_Queue$.prototype.newBuilder__scm_Builder = (function() {
  var this$1 = new $c_scm_MutableList().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$1$2) {
      var x$1 = $as_scm_MutableList(x$1$2);
      return new $c_scm_Queue().init___scm_LinkedList__scm_LinkedList__I(x$1.first0$5, x$1.last0$5, x$1.len$5)
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$1, f)
});
var $d_scm_Queue$ = new $TypeData().initClass({
  scm_Queue$: 0
}, false, "scala.collection.mutable.Queue$", {
  scm_Queue$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_Queue$.prototype.$classData = $d_scm_Queue$;
var $n_scm_Queue$ = (void 0);
function $m_scm_Queue$() {
  if ((!$n_scm_Queue$)) {
    $n_scm_Queue$ = new $c_scm_Queue$().init___()
  };
  return $n_scm_Queue$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyManifest$.prototype = $c_s_reflect_ManifestFactory$AnyManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.init___ = (function() {
  this.toString$2 = "Any";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$AnyManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$AnyManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyManifest$", {
  s_reflect_ManifestFactory$AnyManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyManifest$;
var $n_s_reflect_ManifestFactory$AnyManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyManifest$)) {
    $n_s_reflect_ManifestFactory$AnyManifest$ = new $c_s_reflect_ManifestFactory$AnyManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyValManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyValManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyValManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyValManifest$.prototype = $c_s_reflect_ManifestFactory$AnyValManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.init___ = (function() {
  this.toString$2 = "AnyVal";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$AnyValManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$AnyValManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyValManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyValManifest$", {
  s_reflect_ManifestFactory$AnyValManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyValManifest$;
var $n_s_reflect_ManifestFactory$AnyValManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyValManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyValManifest$)) {
    $n_s_reflect_ManifestFactory$AnyValManifest$ = new $c_s_reflect_ManifestFactory$AnyValManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyValManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NothingManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NothingManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NothingManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NothingManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NothingManifest$.prototype = $c_s_reflect_ManifestFactory$NothingManifest$.prototype;
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.init___ = (function() {
  this.toString$2 = "Nothing";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Nothing$.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$NothingManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$NothingManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NothingManifest$: 0
}, false, "scala.reflect.ManifestFactory$NothingManifest$", {
  s_reflect_ManifestFactory$NothingManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NothingManifest$;
var $n_s_reflect_ManifestFactory$NothingManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NothingManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NothingManifest$)) {
    $n_s_reflect_ManifestFactory$NothingManifest$ = new $c_s_reflect_ManifestFactory$NothingManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NothingManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NullManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NullManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NullManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NullManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NullManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NullManifest$.prototype = $c_s_reflect_ManifestFactory$NullManifest$.prototype;
$c_s_reflect_ManifestFactory$NullManifest$.prototype.init___ = (function() {
  this.toString$2 = "Null";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Null$.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$NullManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$NullManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NullManifest$: 0
}, false, "scala.reflect.ManifestFactory$NullManifest$", {
  s_reflect_ManifestFactory$NullManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NullManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NullManifest$;
var $n_s_reflect_ManifestFactory$NullManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NullManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NullManifest$)) {
    $n_s_reflect_ManifestFactory$NullManifest$ = new $c_s_reflect_ManifestFactory$NullManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NullManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ObjectManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ObjectManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ObjectManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ObjectManifest$.prototype = $c_s_reflect_ManifestFactory$ObjectManifest$.prototype;
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.init___ = (function() {
  this.toString$2 = "Object";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  $n_s_reflect_ManifestFactory$ObjectManifest$ = this;
  return this
});
var $d_s_reflect_ManifestFactory$ObjectManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ObjectManifest$: 0
}, false, "scala.reflect.ManifestFactory$ObjectManifest$", {
  s_reflect_ManifestFactory$ObjectManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ObjectManifest$;
var $n_s_reflect_ManifestFactory$ObjectManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ObjectManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ObjectManifest$)) {
    $n_s_reflect_ManifestFactory$ObjectManifest$ = new $c_s_reflect_ManifestFactory$ObjectManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ObjectManifest$
}
function $is_sc_GenMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenMap)))
}
function $as_sc_GenMap(obj) {
  return (($is_sc_GenMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenMap"))
}
function $isArrayOf_sc_GenMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenMap)))
}
function $asArrayOf_sc_GenMap(obj, depth) {
  return (($isArrayOf_sc_GenMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenMap;", depth))
}
function $is_sc_GenSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSeq)))
}
function $as_sc_GenSeq(obj) {
  return (($is_sc_GenSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSeq"))
}
function $isArrayOf_sc_GenSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSeq)))
}
function $asArrayOf_sc_GenSeq(obj, depth) {
  return (($isArrayOf_sc_GenSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSeq;", depth))
}
/** @constructor */
function $c_sci_Vector$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.NIL$6 = null;
  this.Log2ConcatFaster$6 = 0;
  this.TinyAppendFaster$6 = 0
}
$c_sci_Vector$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_Vector$.prototype.constructor = $c_sci_Vector$;
/** @constructor */
function $h_sci_Vector$() {
  /*<skip>*/
}
$h_sci_Vector$.prototype = $c_sci_Vector$.prototype;
$c_sci_Vector$.prototype.init___ = (function() {
  $c_scg_IndexedSeqFactory.prototype.init___.call(this);
  $n_sci_Vector$ = this;
  this.NIL$6 = new $c_sci_Vector().init___I__I__I(0, 0, 0);
  return this
});
$c_sci_Vector$.prototype.empty__sc_GenTraversable = (function() {
  return this.NIL$6
});
$c_sci_Vector$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_Vector$ = new $TypeData().initClass({
  sci_Vector$: 0
}, false, "scala.collection.immutable.Vector$", {
  sci_Vector$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Vector$.prototype.$classData = $d_sci_Vector$;
var $n_sci_Vector$ = (void 0);
function $m_sci_Vector$() {
  if ((!$n_sci_Vector$)) {
    $n_sci_Vector$ = new $c_sci_Vector$().init___()
  };
  return $n_sci_Vector$
}
/** @constructor */
function $c_s_math_Numeric$ByteIsIntegral$() {
  $c_O.call(this)
}
$c_s_math_Numeric$ByteIsIntegral$.prototype = new $h_O();
$c_s_math_Numeric$ByteIsIntegral$.prototype.constructor = $c_s_math_Numeric$ByteIsIntegral$;
/** @constructor */
function $h_s_math_Numeric$ByteIsIntegral$() {
  /*<skip>*/
}
$h_s_math_Numeric$ByteIsIntegral$.prototype = $c_s_math_Numeric$ByteIsIntegral$.prototype;
$c_s_math_Numeric$ByteIsIntegral$.prototype.init___ = (function() {
  $n_s_math_Numeric$ByteIsIntegral$ = this;
  return this
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.minus__O__O__O = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Numeric$ByteIsIntegral$class__minus__s_math_Numeric$ByteIsIntegral__B__B__B(this, x$1, y$1)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.plus__O__O__O = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Numeric$ByteIsIntegral$class__plus__s_math_Numeric$ByteIsIntegral__B__B__B(this, x$1, y$1)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.times__O__O__O = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Numeric$ByteIsIntegral$class__times__s_math_Numeric$ByteIsIntegral__B__B__B(this, x$1, y$1)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Ordering$ByteOrdering$class__compare__s_math_Ordering$ByteOrdering__B__B__I(this, x$1, y$1)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.quot__O__O__O = (function(x, y) {
  var x$1 = $uB(x);
  var y$1 = $uB(y);
  return $s_s_math_Numeric$ByteIsIntegral$class__quot__s_math_Numeric$ByteIsIntegral__B__B__B(this, x$1, y$1)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.fromInt__I__O = (function(x) {
  return $s_s_math_Numeric$ByteIsIntegral$class__fromInt__s_math_Numeric$ByteIsIntegral__I__B(this, x)
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.toInt__O__I = (function(x) {
  var x$1 = $uB(x);
  return x$1
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Numeric$ByteIsIntegral$ = new $TypeData().initClass({
  s_math_Numeric$ByteIsIntegral$: 0
}, false, "scala.math.Numeric$ByteIsIntegral$", {
  s_math_Numeric$ByteIsIntegral$: 1,
  O: 1,
  s_math_Numeric$ByteIsIntegral: 1,
  s_math_Integral: 1,
  s_math_Numeric: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_math_Ordering$ByteOrdering: 1
});
$c_s_math_Numeric$ByteIsIntegral$.prototype.$classData = $d_s_math_Numeric$ByteIsIntegral$;
var $n_s_math_Numeric$ByteIsIntegral$ = (void 0);
function $m_s_math_Numeric$ByteIsIntegral$() {
  if ((!$n_s_math_Numeric$ByteIsIntegral$)) {
    $n_s_math_Numeric$ByteIsIntegral$ = new $c_s_math_Numeric$ByteIsIntegral$().init___()
  };
  return $n_s_math_Numeric$ByteIsIntegral$
}
/** @constructor */
function $c_s_math_Numeric$CharIsIntegral$() {
  $c_O.call(this)
}
$c_s_math_Numeric$CharIsIntegral$.prototype = new $h_O();
$c_s_math_Numeric$CharIsIntegral$.prototype.constructor = $c_s_math_Numeric$CharIsIntegral$;
/** @constructor */
function $h_s_math_Numeric$CharIsIntegral$() {
  /*<skip>*/
}
$h_s_math_Numeric$CharIsIntegral$.prototype = $c_s_math_Numeric$CharIsIntegral$.prototype;
$c_s_math_Numeric$CharIsIntegral$.prototype.init___ = (function() {
  $n_s_math_Numeric$CharIsIntegral$ = this;
  return this
});
$c_s_math_Numeric$CharIsIntegral$.prototype.minus__O__O__O = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  var c = $s_s_math_Numeric$CharIsIntegral$class__minus__s_math_Numeric$CharIsIntegral__C__C__C(this, x$1, y$1);
  return new $c_jl_Character().init___C(c)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.plus__O__O__O = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  var c = $s_s_math_Numeric$CharIsIntegral$class__plus__s_math_Numeric$CharIsIntegral__C__C__C(this, x$1, y$1);
  return new $c_jl_Character().init___C(c)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.times__O__O__O = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  var c = $s_s_math_Numeric$CharIsIntegral$class__times__s_math_Numeric$CharIsIntegral__C__C__C(this, x$1, y$1);
  return new $c_jl_Character().init___C(c)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.compare__O__O__I = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  return $s_s_math_Ordering$CharOrdering$class__compare__s_math_Ordering$CharOrdering__C__C__I(this, x$1, y$1)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.quot__O__O__O = (function(x, y) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  if ((y === null)) {
    var y$1 = 0
  } else {
    var this$4 = $as_jl_Character(y);
    var y$1 = this$4.value$1
  };
  var c = $s_s_math_Numeric$CharIsIntegral$class__quot__s_math_Numeric$CharIsIntegral__C__C__C(this, x$1, y$1);
  return new $c_jl_Character().init___C(c)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.fromInt__I__O = (function(x) {
  var c = $s_s_math_Numeric$CharIsIntegral$class__fromInt__s_math_Numeric$CharIsIntegral__I__C(this, x);
  return new $c_jl_Character().init___C(c)
});
$c_s_math_Numeric$CharIsIntegral$.prototype.toInt__O__I = (function(x) {
  if ((x === null)) {
    var x$1 = 0
  } else {
    var this$2 = $as_jl_Character(x);
    var x$1 = this$2.value$1
  };
  return x$1
});
$c_s_math_Numeric$CharIsIntegral$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Numeric$CharIsIntegral$ = new $TypeData().initClass({
  s_math_Numeric$CharIsIntegral$: 0
}, false, "scala.math.Numeric$CharIsIntegral$", {
  s_math_Numeric$CharIsIntegral$: 1,
  O: 1,
  s_math_Numeric$CharIsIntegral: 1,
  s_math_Integral: 1,
  s_math_Numeric: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_math_Ordering$CharOrdering: 1
});
$c_s_math_Numeric$CharIsIntegral$.prototype.$classData = $d_s_math_Numeric$CharIsIntegral$;
var $n_s_math_Numeric$CharIsIntegral$ = (void 0);
function $m_s_math_Numeric$CharIsIntegral$() {
  if ((!$n_s_math_Numeric$CharIsIntegral$)) {
    $n_s_math_Numeric$CharIsIntegral$ = new $c_s_math_Numeric$CharIsIntegral$().init___()
  };
  return $n_s_math_Numeric$CharIsIntegral$
}
/** @constructor */
function $c_s_math_Numeric$IntIsIntegral$() {
  $c_O.call(this)
}
$c_s_math_Numeric$IntIsIntegral$.prototype = new $h_O();
$c_s_math_Numeric$IntIsIntegral$.prototype.constructor = $c_s_math_Numeric$IntIsIntegral$;
/** @constructor */
function $h_s_math_Numeric$IntIsIntegral$() {
  /*<skip>*/
}
$h_s_math_Numeric$IntIsIntegral$.prototype = $c_s_math_Numeric$IntIsIntegral$.prototype;
$c_s_math_Numeric$IntIsIntegral$.prototype.init___ = (function() {
  $n_s_math_Numeric$IntIsIntegral$ = this;
  return this
});
$c_s_math_Numeric$IntIsIntegral$.prototype.minus__O__O__O = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Numeric$IntIsIntegral$class__minus__s_math_Numeric$IntIsIntegral__I__I__I(this, x$1, y$1)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.plus__O__O__O = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Numeric$IntIsIntegral$class__plus__s_math_Numeric$IntIsIntegral__I__I__I(this, x$1, y$1)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.times__O__O__O = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Numeric$IntIsIntegral$class__times__s_math_Numeric$IntIsIntegral__I__I__I(this, x$1, y$1)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Ordering$IntOrdering$class__compare__s_math_Ordering$IntOrdering__I__I__I(this, x$1, y$1)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.quot__O__O__O = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Numeric$IntIsIntegral$class__quot__s_math_Numeric$IntIsIntegral__I__I__I(this, x$1, y$1)
});
$c_s_math_Numeric$IntIsIntegral$.prototype.fromInt__I__O = (function(x) {
  return x
});
$c_s_math_Numeric$IntIsIntegral$.prototype.toInt__O__I = (function(x) {
  var x$1 = $uI(x);
  return x$1
});
$c_s_math_Numeric$IntIsIntegral$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Numeric$IntIsIntegral$ = new $TypeData().initClass({
  s_math_Numeric$IntIsIntegral$: 0
}, false, "scala.math.Numeric$IntIsIntegral$", {
  s_math_Numeric$IntIsIntegral$: 1,
  O: 1,
  s_math_Numeric$IntIsIntegral: 1,
  s_math_Integral: 1,
  s_math_Numeric: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_math_Ordering$IntOrdering: 1
});
$c_s_math_Numeric$IntIsIntegral$.prototype.$classData = $d_s_math_Numeric$IntIsIntegral$;
var $n_s_math_Numeric$IntIsIntegral$ = (void 0);
function $m_s_math_Numeric$IntIsIntegral$() {
  if ((!$n_s_math_Numeric$IntIsIntegral$)) {
    $n_s_math_Numeric$IntIsIntegral$ = new $c_s_math_Numeric$IntIsIntegral$().init___()
  };
  return $n_s_math_Numeric$IntIsIntegral$
}
/** @constructor */
function $c_s_math_Numeric$LongIsIntegral$() {
  $c_O.call(this)
}
$c_s_math_Numeric$LongIsIntegral$.prototype = new $h_O();
$c_s_math_Numeric$LongIsIntegral$.prototype.constructor = $c_s_math_Numeric$LongIsIntegral$;
/** @constructor */
function $h_s_math_Numeric$LongIsIntegral$() {
  /*<skip>*/
}
$h_s_math_Numeric$LongIsIntegral$.prototype = $c_s_math_Numeric$LongIsIntegral$.prototype;
$c_s_math_Numeric$LongIsIntegral$.prototype.init___ = (function() {
  $n_s_math_Numeric$LongIsIntegral$ = this;
  return this
});
$c_s_math_Numeric$LongIsIntegral$.prototype.minus__O__O__O = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Numeric$LongIsIntegral$class__minus__s_math_Numeric$LongIsIntegral__J__J__J(this, x$1, y$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.plus__O__O__O = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Numeric$LongIsIntegral$class__plus__s_math_Numeric$LongIsIntegral__J__J__J(this, x$1, y$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.times__O__O__O = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Numeric$LongIsIntegral$class__times__s_math_Numeric$LongIsIntegral__J__J__J(this, x$1, y$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Ordering$LongOrdering$class__compare__s_math_Ordering$LongOrdering__J__J__I(this, x$1, y$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.quot__O__O__O = (function(x, y) {
  var x$1 = $uJ(x);
  var y$1 = $uJ(y);
  return $s_s_math_Numeric$LongIsIntegral$class__quot__s_math_Numeric$LongIsIntegral__J__J__J(this, x$1, y$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.fromInt__I__O = (function(x) {
  return $s_s_math_Numeric$LongIsIntegral$class__fromInt__s_math_Numeric$LongIsIntegral__I__J(this, x)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.toInt__O__I = (function(x) {
  var x$1 = $uJ(x);
  return $s_s_math_Numeric$LongIsIntegral$class__toInt__s_math_Numeric$LongIsIntegral__J__I(this, x$1)
});
$c_s_math_Numeric$LongIsIntegral$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Numeric$LongIsIntegral$ = new $TypeData().initClass({
  s_math_Numeric$LongIsIntegral$: 0
}, false, "scala.math.Numeric$LongIsIntegral$", {
  s_math_Numeric$LongIsIntegral$: 1,
  O: 1,
  s_math_Numeric$LongIsIntegral: 1,
  s_math_Integral: 1,
  s_math_Numeric: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_math_Ordering$LongOrdering: 1
});
$c_s_math_Numeric$LongIsIntegral$.prototype.$classData = $d_s_math_Numeric$LongIsIntegral$;
var $n_s_math_Numeric$LongIsIntegral$ = (void 0);
function $m_s_math_Numeric$LongIsIntegral$() {
  if ((!$n_s_math_Numeric$LongIsIntegral$)) {
    $n_s_math_Numeric$LongIsIntegral$ = new $c_s_math_Numeric$LongIsIntegral$().init___()
  };
  return $n_s_math_Numeric$LongIsIntegral$
}
/** @constructor */
function $c_s_math_Numeric$ShortIsIntegral$() {
  $c_O.call(this)
}
$c_s_math_Numeric$ShortIsIntegral$.prototype = new $h_O();
$c_s_math_Numeric$ShortIsIntegral$.prototype.constructor = $c_s_math_Numeric$ShortIsIntegral$;
/** @constructor */
function $h_s_math_Numeric$ShortIsIntegral$() {
  /*<skip>*/
}
$h_s_math_Numeric$ShortIsIntegral$.prototype = $c_s_math_Numeric$ShortIsIntegral$.prototype;
$c_s_math_Numeric$ShortIsIntegral$.prototype.init___ = (function() {
  $n_s_math_Numeric$ShortIsIntegral$ = this;
  return this
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.minus__O__O__O = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Numeric$ShortIsIntegral$class__minus__s_math_Numeric$ShortIsIntegral__S__S__S(this, x$1, y$1)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.plus__O__O__O = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Numeric$ShortIsIntegral$class__plus__s_math_Numeric$ShortIsIntegral__S__S__S(this, x$1, y$1)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.lt__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lt__s_math_Ordering__O__O__Z(this, x, y)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.times__O__O__O = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Numeric$ShortIsIntegral$class__times__s_math_Numeric$ShortIsIntegral__S__S__S(this, x$1, y$1)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Ordering$ShortOrdering$class__compare__s_math_Ordering$ShortOrdering__S__S__I(this, x$1, y$1)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.quot__O__O__O = (function(x, y) {
  var x$1 = $uS(x);
  var y$1 = $uS(y);
  return $s_s_math_Numeric$ShortIsIntegral$class__quot__s_math_Numeric$ShortIsIntegral__S__S__S(this, x$1, y$1)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.fromInt__I__O = (function(x) {
  return $s_s_math_Numeric$ShortIsIntegral$class__fromInt__s_math_Numeric$ShortIsIntegral__I__S(this, x)
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.toInt__O__I = (function(x) {
  var x$1 = $uS(x);
  return x$1
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.lteq__O__O__Z = (function(x, y) {
  return $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(this, x, y)
});
var $d_s_math_Numeric$ShortIsIntegral$ = new $TypeData().initClass({
  s_math_Numeric$ShortIsIntegral$: 0
}, false, "scala.math.Numeric$ShortIsIntegral$", {
  s_math_Numeric$ShortIsIntegral$: 1,
  O: 1,
  s_math_Numeric$ShortIsIntegral: 1,
  s_math_Integral: 1,
  s_math_Numeric: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_math_Ordering$ShortOrdering: 1
});
$c_s_math_Numeric$ShortIsIntegral$.prototype.$classData = $d_s_math_Numeric$ShortIsIntegral$;
var $n_s_math_Numeric$ShortIsIntegral$ = (void 0);
function $m_s_math_Numeric$ShortIsIntegral$() {
  if ((!$n_s_math_Numeric$ShortIsIntegral$)) {
    $n_s_math_Numeric$ShortIsIntegral$ = new $c_s_math_Numeric$ShortIsIntegral$().init___()
  };
  return $n_s_math_Numeric$ShortIsIntegral$
}
/** @constructor */
function $c_sc_AbstractTraversable() {
  $c_O.call(this)
}
$c_sc_AbstractTraversable.prototype = new $h_O();
$c_sc_AbstractTraversable.prototype.constructor = $c_sc_AbstractTraversable;
/** @constructor */
function $h_sc_AbstractTraversable() {
  /*<skip>*/
}
$h_sc_AbstractTraversable.prototype = $c_sc_AbstractTraversable.prototype;
$c_sc_AbstractTraversable.prototype.mkString__T__T = (function(sep) {
  return this.mkString__T__T__T__T("", sep, "")
});
$c_sc_AbstractTraversable.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.toVector__sci_Vector = (function() {
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  return $as_sci_Vector($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_AbstractTraversable.prototype.last__O = (function() {
  return $s_sc_TraversableLike$class__last__sc_TraversableLike__O(this)
});
$c_sc_AbstractTraversable.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.tail__O = (function() {
  return $s_sc_TraversableLike$class__tail__sc_TraversableLike__O(this)
});
$c_sc_AbstractTraversable.prototype.repr__O = (function() {
  return this
});
$c_sc_AbstractTraversable.prototype.isTraversableAgain__Z = (function() {
  return true
});
$c_sc_AbstractTraversable.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
});
$c_sc_AbstractTraversable.prototype.nonEmpty__Z = (function() {
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this)
});
$c_sc_AbstractTraversable.prototype.newBuilder__scm_Builder = (function() {
  return this.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_sc_AbstractTraversable.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sc_GenSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSet)))
}
function $as_sc_GenSet(obj) {
  return (($is_sc_GenSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSet"))
}
function $isArrayOf_sc_GenSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSet)))
}
function $asArrayOf_sc_GenSet(obj, depth) {
  return (($isArrayOf_sc_GenSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSet;", depth))
}
function $is_sc_IndexedSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeqLike)))
}
function $as_sc_IndexedSeqLike(obj) {
  return (($is_sc_IndexedSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeqLike"))
}
function $isArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeqLike)))
}
function $asArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (($isArrayOf_sc_IndexedSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeqLike;", depth))
}
function $is_sc_LinearSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqLike)))
}
function $as_sc_LinearSeqLike(obj) {
  return (($is_sc_LinearSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqLike"))
}
function $isArrayOf_sc_LinearSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqLike)))
}
function $asArrayOf_sc_LinearSeqLike(obj, depth) {
  return (($isArrayOf_sc_LinearSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqLike;", depth))
}
function $is_sc_LinearSeqOptimized(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqOptimized)))
}
function $as_sc_LinearSeqOptimized(obj) {
  return (($is_sc_LinearSeqOptimized(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqOptimized"))
}
function $isArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqOptimized)))
}
function $asArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (($isArrayOf_sc_LinearSeqOptimized(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqOptimized;", depth))
}
function $is_sc_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Iterable)))
}
function $as_sc_Iterable(obj) {
  return (($is_sc_Iterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Iterable"))
}
function $isArrayOf_sc_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Iterable)))
}
function $asArrayOf_sc_Iterable(obj, depth) {
  return (($isArrayOf_sc_Iterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Iterable;", depth))
}
function $is_scm_LinkedListLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_LinkedListLike)))
}
function $as_scm_LinkedListLike(obj) {
  return (($is_scm_LinkedListLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.LinkedListLike"))
}
function $isArrayOf_scm_LinkedListLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_LinkedListLike)))
}
function $asArrayOf_scm_LinkedListLike(obj, depth) {
  return (($isArrayOf_scm_LinkedListLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.LinkedListLike;", depth))
}
/** @constructor */
function $c_sc_AbstractIterable() {
  $c_sc_AbstractTraversable.call(this)
}
$c_sc_AbstractIterable.prototype = new $h_sc_AbstractTraversable();
$c_sc_AbstractIterable.prototype.constructor = $c_sc_AbstractIterable;
/** @constructor */
function $h_sc_AbstractIterable() {
  /*<skip>*/
}
$h_sc_AbstractIterable.prototype = $c_sc_AbstractIterable.prototype;
$c_sc_AbstractIterable.prototype.head__O = (function() {
  return this.iterator__sc_Iterator().next__O()
});
$c_sc_AbstractIterable.prototype.toIterator__sc_Iterator = (function() {
  return this.iterator__sc_Iterator()
});
$c_sc_AbstractIterable.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z(this, that)
});
$c_sc_AbstractIterable.prototype.forall__F1__Z = (function(p) {
  var this$1 = this.iterator__sc_Iterator();
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, p)
});
$c_sc_AbstractIterable.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.iterator__sc_Iterator();
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$1, f)
});
$c_sc_AbstractIterable.prototype.find__F1__s_Option = (function(p) {
  var this$1 = this.iterator__sc_Iterator();
  return $s_sc_Iterator$class__find__sc_Iterator__F1__s_Option(this$1, p)
});
$c_sc_AbstractIterable.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  return $s_sc_IterableLike$class__zipWithIndex__sc_IterableLike__scg_CanBuildFrom__O(this, bf)
});
$c_sc_AbstractIterable.prototype.drop__I__O = (function(n) {
  return $s_sc_IterableLike$class__drop__sc_IterableLike__I__O(this, n)
});
$c_sc_AbstractIterable.prototype.toStream__sci_Stream = (function() {
  return this.iterator__sc_Iterator().toStream__sci_Stream()
});
$c_sc_AbstractIterable.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V(this, xs, start, len)
});
function $is_sci_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Iterable)))
}
function $as_sci_Iterable(obj) {
  return (($is_sci_Iterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Iterable"))
}
function $isArrayOf_sci_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Iterable)))
}
function $asArrayOf_sci_Iterable(obj, depth) {
  return (($isArrayOf_sci_Iterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Iterable;", depth))
}
var $d_sci_Iterable = new $TypeData().initClass({
  sci_Iterable: 0
}, true, "scala.collection.immutable.Iterable", {
  sci_Iterable: 1,
  sci_Traversable: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  s_Immutable: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1
});
/** @constructor */
function $c_sci_StringOps() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_sci_StringOps.prototype = new $h_O();
$c_sci_StringOps.prototype.constructor = $c_sci_StringOps;
/** @constructor */
function $h_sci_StringOps() {
  /*<skip>*/
}
$h_sci_StringOps.prototype = $c_sci_StringOps.prototype;
$c_sci_StringOps.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sci_StringOps.prototype.apply__I__O = (function(idx) {
  var $$this = this.repr$1;
  var c = (65535 & $uI($$this["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_StringOps.prototype.toIterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this["length"]))
});
$c_sci_StringOps.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_StringOps.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_StringOps.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_StringOps.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.equals__O__Z = (function(x$1) {
  return $m_sci_StringOps$().equals$extension__T__O__Z(this.repr$1, x$1)
});
$c_sci_StringOps.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_StringOps.prototype.mkString__T__T = (function(sep) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, "", sep, "")
});
$c_sci_StringOps.prototype.toString__T = (function() {
  var $$this = this.repr$1;
  return $$this
});
$c_sci_StringOps.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_StringOps.prototype.slice__I__I__O = (function(from, until) {
  return $m_sci_StringOps$().slice$extension__T__I__I__T(this.repr$1, from, until)
});
$c_sci_StringOps.prototype.toVector__sci_Vector = (function() {
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  return $as_sci_Vector($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(this, cbf))
});
$c_sci_StringOps.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqOptimized$$anon$1().init___sc_IndexedSeqOptimized(this)
});
$c_sci_StringOps.prototype.reverse__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__reverse__sc_IndexedSeqOptimized__O(this)
});
$c_sci_StringOps.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this["length"])
});
$c_sci_StringOps.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this["length"]))
});
$c_sci_StringOps.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this["length"])
});
$c_sci_StringOps.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$3 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this["length"]));
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this$3)
});
$c_sci_StringOps.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I(this, p, end)
});
$c_sci_StringOps.prototype.drop__I__O = (function(n) {
  var $$this = this.repr$1;
  var until = $uI($$this["length"]);
  return $m_sci_StringOps$().slice$extension__T__I__I__T(this.repr$1, n, until)
});
$c_sci_StringOps.prototype.thisCollection__sc_Seq = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sci_StringOps.prototype.repr__O = (function() {
  return this.repr$1
});
$c_sci_StringOps.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_StringOps.prototype.isTraversableAgain__Z = (function() {
  return true
});
$c_sci_StringOps.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $m_sjsr_RuntimeString$().hashCode__T__I($$this)
});
$c_sci_StringOps.prototype.init___T = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_sci_StringOps.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
});
$c_sci_StringOps.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_T(repr);
  return new $c_sci_WrappedString().init___T(repr$1)
});
$c_sci_StringOps.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_sci_StringOps.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sci_StringOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_StringOps)))
}
function $as_sci_StringOps(obj) {
  return (($is_sci_StringOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.StringOps"))
}
function $isArrayOf_sci_StringOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_StringOps)))
}
function $asArrayOf_sci_StringOps(obj, depth) {
  return (($isArrayOf_sci_StringOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.StringOps;", depth))
}
var $d_sci_StringOps = new $TypeData().initClass({
  sci_StringOps: 0
}, false, "scala.collection.immutable.StringOps", {
  sci_StringOps: 1,
  O: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_StringOps.prototype.$classData = $d_sci_StringOps;
function $is_sc_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Seq)))
}
function $as_sc_Seq(obj) {
  return (($is_sc_Seq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Seq"))
}
function $isArrayOf_sc_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Seq)))
}
function $asArrayOf_sc_Seq(obj, depth) {
  return (($isArrayOf_sc_Seq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Seq;", depth))
}
function $is_sc_Set(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Set)))
}
function $as_sc_Set(obj) {
  return (($is_sc_Set(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Set"))
}
function $isArrayOf_sc_Set(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Set)))
}
function $asArrayOf_sc_Set(obj, depth) {
  return (($isArrayOf_sc_Set(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Set;", depth))
}
/** @constructor */
function $c_scm_AbstractIterable() {
  $c_sc_AbstractIterable.call(this)
}
$c_scm_AbstractIterable.prototype = new $h_sc_AbstractIterable();
$c_scm_AbstractIterable.prototype.constructor = $c_scm_AbstractIterable;
/** @constructor */
function $h_scm_AbstractIterable() {
  /*<skip>*/
}
$h_scm_AbstractIterable.prototype = $c_scm_AbstractIterable.prototype;
function $is_scm_BufferLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_BufferLike)))
}
function $as_scm_BufferLike(obj) {
  return (($is_scm_BufferLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.BufferLike"))
}
function $isArrayOf_scm_BufferLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_BufferLike)))
}
function $asArrayOf_scm_BufferLike(obj, depth) {
  return (($isArrayOf_scm_BufferLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.BufferLike;", depth))
}
function $is_sc_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeq)))
}
function $as_sc_IndexedSeq(obj) {
  return (($is_sc_IndexedSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeq"))
}
function $isArrayOf_sc_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeq)))
}
function $asArrayOf_sc_IndexedSeq(obj, depth) {
  return (($isArrayOf_sc_IndexedSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeq;", depth))
}
function $is_sc_LinearSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeq)))
}
function $as_sc_LinearSeq(obj) {
  return (($is_sc_LinearSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeq"))
}
function $isArrayOf_sc_LinearSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeq)))
}
function $asArrayOf_sc_LinearSeq(obj, depth) {
  return (($isArrayOf_sc_LinearSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeq;", depth))
}
/** @constructor */
function $c_sc_AbstractSeq() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSeq.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSeq.prototype.constructor = $c_sc_AbstractSeq;
/** @constructor */
function $h_sc_AbstractSeq() {
  /*<skip>*/
}
$h_sc_AbstractSeq.prototype = $c_sc_AbstractSeq.prototype;
$c_sc_AbstractSeq.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_SeqLike$class__lengthCompare__sc_SeqLike__I__I(this, len)
});
$c_sc_AbstractSeq.prototype.isEmpty__Z = (function() {
  return $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)
});
$c_sc_AbstractSeq.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
});
$c_sc_AbstractSeq.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSeq.prototype.reverse__O = (function() {
  return $s_sc_SeqLike$class__reverse__sc_SeqLike__O(this)
});
$c_sc_AbstractSeq.prototype.reverseIterator__sc_Iterator = (function() {
  return $s_sc_SeqLike$class__reverseIterator__sc_SeqLike__sc_Iterator(this)
});
$c_sc_AbstractSeq.prototype.size__I = (function() {
  return this.length__I()
});
$c_sc_AbstractSeq.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_SeqLike$class__lastIndexWhere__sc_SeqLike__F1__I__I(this, p, end)
});
$c_sc_AbstractSeq.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sc_AbstractSeq.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this.seq__sc_Seq())
});
$c_sc_AbstractSeq.prototype.lastIndexWhere__F1__I = (function(p) {
  return $s_sc_GenSeqLike$class__lastIndexWhere__sc_GenSeqLike__F1__I(this, p)
});
$c_sc_AbstractSeq.prototype.toCollection__O__sc_Seq = (function(repr) {
  return $as_sc_Seq(repr)
});
/** @constructor */
function $c_sc_AbstractMap() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractMap.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractMap.prototype.constructor = $c_sc_AbstractMap;
/** @constructor */
function $h_sc_AbstractMap() {
  /*<skip>*/
}
$h_sc_AbstractMap.prototype = $c_sc_AbstractMap.prototype;
$c_sc_AbstractMap.prototype.apply__O__O = (function(key) {
  return $s_sc_MapLike$class__apply__sc_MapLike__O__O(this, key)
});
$c_sc_AbstractMap.prototype.isEmpty__Z = (function() {
  return $s_sc_MapLike$class__isEmpty__sc_MapLike__Z(this)
});
$c_sc_AbstractMap.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenMapLike$class__equals__sc_GenMapLike__O__Z(this, that)
});
$c_sc_AbstractMap.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractMap.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_MapLike$class__addString__sc_MapLike__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractMap.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.mapSeed$2)
});
$c_sc_AbstractMap.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_MapBuilder().init___sc_GenMap(this.empty__sc_Map())
});
$c_sc_AbstractMap.prototype.stringPrefix__T = (function() {
  return "Map"
});
/** @constructor */
function $c_sc_AbstractSet() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSet.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSet.prototype.constructor = $c_sc_AbstractSet;
/** @constructor */
function $h_sc_AbstractSet() {
  /*<skip>*/
}
$h_sc_AbstractSet.prototype = $c_sc_AbstractSet.prototype;
$c_sc_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_sc_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_sc_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  return this.forall__F1__Z(that)
});
$c_sc_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_sc_AbstractSet.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
});
$c_sc_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.empty__sc_Set())
});
$c_sc_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
function $is_sci_Set(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Set)))
}
function $as_sci_Set(obj) {
  return (($is_sci_Set(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Set"))
}
function $isArrayOf_sci_Set(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Set)))
}
function $asArrayOf_sci_Set(obj, depth) {
  return (($isArrayOf_sci_Set(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Set;", depth))
}
function $is_sci_Map(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Map)))
}
function $as_sci_Map(obj) {
  return (($is_sci_Map(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Map"))
}
function $isArrayOf_sci_Map(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Map)))
}
function $asArrayOf_sci_Map(obj, depth) {
  return (($isArrayOf_sci_Map(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Map;", depth))
}
function $is_scm_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Seq)))
}
function $as_scm_Seq(obj) {
  return (($is_scm_Seq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Seq"))
}
function $isArrayOf_scm_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Seq)))
}
function $asArrayOf_scm_Seq(obj, depth) {
  return (($isArrayOf_scm_Seq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Seq;", depth))
}
/** @constructor */
function $c_sci_AbstractMap() {
  $c_sc_AbstractMap.call(this)
}
$c_sci_AbstractMap.prototype = new $h_sc_AbstractMap();
$c_sci_AbstractMap.prototype.constructor = $c_sci_AbstractMap;
/** @constructor */
function $h_sci_AbstractMap() {
  /*<skip>*/
}
$h_sci_AbstractMap.prototype = $c_sci_AbstractMap.prototype;
$c_sci_AbstractMap.prototype.init___ = (function() {
  return this
});
$c_sci_AbstractMap.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_AbstractMap.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_AbstractMap.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Iterable$()
});
$c_sci_AbstractMap.prototype.empty__sc_Map = (function() {
  return this.empty__sci_Map()
});
$c_sci_AbstractMap.prototype.empty__sci_Map = (function() {
  return $m_sci_Map$EmptyMap$()
});
/** @constructor */
function $c_sci_ListSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_ListSet.prototype = new $h_sc_AbstractSet();
$c_sci_ListSet.prototype.constructor = $c_sci_ListSet;
/** @constructor */
function $h_sci_ListSet() {
  /*<skip>*/
}
$h_sci_ListSet.prototype = $c_sci_ListSet.prototype;
$c_sci_ListSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_ListSet.prototype.init___ = (function() {
  return this
});
$c_sci_ListSet.prototype.head__O = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Set has no elements")
});
$c_sci_ListSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_ListSet.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_ListSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_ListSet.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Empty ListSet has no outer pointer")
});
$c_sci_ListSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_ListSet$()
});
$c_sci_ListSet.prototype.$$plus__O__sci_ListSet = (function(elem) {
  return new $c_sci_ListSet$Node().init___sci_ListSet__O(this, elem)
});
$c_sci_ListSet.prototype.size__I = (function() {
  return 0
});
$c_sci_ListSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this)
});
$c_sci_ListSet.prototype.empty__sc_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet.prototype.tail__O = (function() {
  return this.tail__sci_ListSet()
});
$c_sci_ListSet.prototype.contains__O__Z = (function(elem) {
  return false
});
$c_sci_ListSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
$c_sci_ListSet.prototype.tail__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Next of an empty set")
});
$c_sci_ListSet.prototype.stringPrefix__T = (function() {
  return "ListSet"
});
function $is_sci_ListSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_ListSet)))
}
function $as_sci_ListSet(obj) {
  return (($is_sci_ListSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.ListSet"))
}
function $isArrayOf_sci_ListSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_ListSet)))
}
function $asArrayOf_sci_ListSet(obj, depth) {
  return (($isArrayOf_sci_ListSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.ListSet;", depth))
}
/** @constructor */
function $c_sci_Set$EmptySet$() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_Set$EmptySet$.prototype = new $h_sc_AbstractSet();
$c_sci_Set$EmptySet$.prototype.constructor = $c_sci_Set$EmptySet$;
/** @constructor */
function $h_sci_Set$EmptySet$() {
  /*<skip>*/
}
$h_sci_Set$EmptySet$.prototype = $c_sci_Set$EmptySet$.prototype;
$c_sci_Set$EmptySet$.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.init___ = (function() {
  $n_sci_Set$EmptySet$ = this;
  return this
});
$c_sci_Set$EmptySet$.prototype.apply__O__O = (function(v1) {
  return false
});
$c_sci_Set$EmptySet$.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$EmptySet$.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_Set$EmptySet$.prototype.size__I = (function() {
  return 0
});
$c_sci_Set$EmptySet$.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_Set$EmptySet$.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$EmptySet$.prototype.contains__O__Z = (function(elem) {
  return false
});
$c_sci_Set$EmptySet$.prototype.$$plus__O__sc_Set = (function(elem) {
  return new $c_sci_Set$Set1().init___O(elem)
});
var $d_sci_Set$EmptySet$ = new $TypeData().initClass({
  sci_Set$EmptySet$: 0
}, false, "scala.collection.immutable.Set$EmptySet$", {
  sci_Set$EmptySet$: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$EmptySet$.prototype.$classData = $d_sci_Set$EmptySet$;
var $n_sci_Set$EmptySet$ = (void 0);
function $m_sci_Set$EmptySet$() {
  if ((!$n_sci_Set$EmptySet$)) {
    $n_sci_Set$EmptySet$ = new $c_sci_Set$EmptySet$().init___()
  };
  return $n_sci_Set$EmptySet$
}
/** @constructor */
function $c_sci_Set$Set1() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null
}
$c_sci_Set$Set1.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set1.prototype.constructor = $c_sci_Set$Set1;
/** @constructor */
function $h_sci_Set$Set1() {
  /*<skip>*/
}
$h_sci_Set$Set1.prototype = $c_sci_Set$Set1.prototype;
$c_sci_Set$Set1.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set1.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set1.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set1.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set1.prototype.forall__F1__Z = (function(f) {
  return $uZ(f.apply__O__O(this.elem1$4))
});
$c_sci_Set$Set1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4)
});
$c_sci_Set$Set1.prototype.size__I = (function() {
  return 1
});
$c_sci_Set$Set1.prototype.init___O = (function(elem1) {
  this.elem1$4 = elem1;
  return this
});
$c_sci_Set$Set1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set1.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set1.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set2().init___O__O(this.elem1$4, elem))
});
$c_sci_Set$Set1.prototype.contains__O__Z = (function(elem) {
  return $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4)
});
$c_sci_Set$Set1.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set1 = new $TypeData().initClass({
  sci_Set$Set1: 0
}, false, "scala.collection.immutable.Set$Set1", {
  sci_Set$Set1: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set1.prototype.$classData = $d_sci_Set$Set1;
/** @constructor */
function $c_sci_Set$Set2() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null
}
$c_sci_Set$Set2.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set2.prototype.constructor = $c_sci_Set$Set2;
/** @constructor */
function $h_sci_Set$Set2() {
  /*<skip>*/
}
$h_sci_Set$Set2.prototype = $c_sci_Set$Set2.prototype;
$c_sci_Set$Set2.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set2.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set2.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set2.prototype.init___O__O = (function(elem1, elem2) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  return this
});
$c_sci_Set$Set2.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set2.prototype.forall__F1__Z = (function(f) {
  return ($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4)))
});
$c_sci_Set$Set2.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4)
});
$c_sci_Set$Set2.prototype.size__I = (function() {
  return 2
});
$c_sci_Set$Set2.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set2.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set2.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set3().init___O__O__O(this.elem1$4, this.elem2$4, elem))
});
$c_sci_Set$Set2.prototype.contains__O__Z = (function(elem) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4))
});
$c_sci_Set$Set2.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set2 = new $TypeData().initClass({
  sci_Set$Set2: 0
}, false, "scala.collection.immutable.Set$Set2", {
  sci_Set$Set2: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set2.prototype.$classData = $d_sci_Set$Set2;
/** @constructor */
function $c_sci_Set$Set3() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null
}
$c_sci_Set$Set3.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set3.prototype.constructor = $c_sci_Set$Set3;
/** @constructor */
function $h_sci_Set$Set3() {
  /*<skip>*/
}
$h_sci_Set$Set3.prototype = $c_sci_Set$Set3.prototype;
$c_sci_Set$Set3.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set3.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set3.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set3.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set3.prototype.forall__F1__Z = (function(f) {
  return (($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4))) && $uZ(f.apply__O__O(this.elem3$4)))
});
$c_sci_Set$Set3.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4)
});
$c_sci_Set$Set3.prototype.init___O__O__O = (function(elem1, elem2, elem3) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  return this
});
$c_sci_Set$Set3.prototype.size__I = (function() {
  return 3
});
$c_sci_Set$Set3.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set3.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set3.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set4().init___O__O__O__O(this.elem1$4, this.elem2$4, this.elem3$4, elem))
});
$c_sci_Set$Set3.prototype.contains__O__Z = (function(elem) {
  return (($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4))
});
$c_sci_Set$Set3.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set3 = new $TypeData().initClass({
  sci_Set$Set3: 0
}, false, "scala.collection.immutable.Set$Set3", {
  sci_Set$Set3: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set3.prototype.$classData = $d_sci_Set$Set3;
/** @constructor */
function $c_sci_Set$Set4() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null;
  this.elem4$4 = null
}
$c_sci_Set$Set4.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set4.prototype.constructor = $c_sci_Set$Set4;
/** @constructor */
function $h_sci_Set$Set4() {
  /*<skip>*/
}
$h_sci_Set$Set4.prototype = $c_sci_Set$Set4.prototype;
$c_sci_Set$Set4.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set4.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set4.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set4.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set4.prototype.forall__F1__Z = (function(f) {
  return ((($uZ(f.apply__O__O(this.elem1$4)) && $uZ(f.apply__O__O(this.elem2$4))) && $uZ(f.apply__O__O(this.elem3$4))) && $uZ(f.apply__O__O(this.elem4$4)))
});
$c_sci_Set$Set4.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4);
  f.apply__O__O(this.elem4$4)
});
$c_sci_Set$Set4.prototype.size__I = (function() {
  return 4
});
$c_sci_Set$Set4.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4, this.elem4$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Set$Set4.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set4.prototype.$$plus__O__sci_Set = (function(elem) {
  if (this.contains__O__Z(elem)) {
    return this
  } else {
    var this$1 = new $c_sci_HashSet().init___();
    var elem1 = this.elem1$4;
    var elem2 = this.elem2$4;
    var array = [this.elem3$4, this.elem4$4, elem];
    var this$2 = this$1.$$plus__O__sci_HashSet(elem1).$$plus__O__sci_HashSet(elem2);
    var start = 0;
    var end = $uI(array["length"]);
    var z = this$2;
    x: {
      var jsx$1;
      _foldl: while (true) {
        if ((start === end)) {
          var jsx$1 = z;
          break x
        } else {
          var temp$start = ((1 + start) | 0);
          var arg1 = z;
          var index = start;
          var arg2 = array[index];
          var x$2 = $as_sc_Set(arg1);
          var temp$z = x$2.$$plus__O__sc_Set(arg2);
          start = temp$start;
          z = temp$z;
          continue _foldl
        }
      }
    };
    return $as_sci_HashSet($as_sc_Set(jsx$1))
  }
});
$c_sci_Set$Set4.prototype.contains__O__Z = (function(elem) {
  return ((($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem4$4))
});
$c_sci_Set$Set4.prototype.init___O__O__O__O = (function(elem1, elem2, elem3, elem4) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  this.elem4$4 = elem4;
  return this
});
$c_sci_Set$Set4.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set4 = new $TypeData().initClass({
  sci_Set$Set4: 0
}, false, "scala.collection.immutable.Set$Set4", {
  sci_Set$Set4: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set4.prototype.$classData = $d_sci_Set$Set4;
function $is_scm_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_IndexedSeq)))
}
function $as_scm_IndexedSeq(obj) {
  return (($is_scm_IndexedSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.IndexedSeq"))
}
function $isArrayOf_scm_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_IndexedSeq)))
}
function $asArrayOf_scm_IndexedSeq(obj, depth) {
  return (($isArrayOf_scm_IndexedSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.IndexedSeq;", depth))
}
/** @constructor */
function $c_sci_HashSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_HashSet.prototype = new $h_sc_AbstractSet();
$c_sci_HashSet.prototype.constructor = $c_sci_HashSet;
/** @constructor */
function $h_sci_HashSet() {
  /*<skip>*/
}
$h_sci_HashSet.prototype = $c_sci_HashSet.prototype;
$c_sci_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_HashSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return new $c_sci_HashSet$HashSet1().init___O__I(key, hash)
});
$c_sci_HashSet.prototype.computeHash__O__I = (function(key) {
  return this.improve__I__I($m_sr_ScalaRunTime$().hash__O__I(key))
});
$c_sci_HashSet.prototype.init___ = (function() {
  return this
});
$c_sci_HashSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_HashSet.prototype.$$plus__O__sci_HashSet = (function(e) {
  return this.updated0__O__I__I__sci_HashSet(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_HashSet$()
});
$c_sci_HashSet.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_HashSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  if ($is_sci_HashSet(that)) {
    var x2 = $as_sci_HashSet(that);
    return this.subsetOf0__sci_HashSet__I__Z(x2, 0)
  } else {
    var this$1 = this.iterator__sc_Iterator();
    return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
  }
});
$c_sci_HashSet.prototype.size__I = (function() {
  return 0
});
$c_sci_HashSet.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_HashSet.prototype.empty__sc_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
$c_sci_HashSet.prototype.improve__I__I = (function(hcode) {
  var h = ((hcode + (~(hcode << 9))) | 0);
  h = (h ^ ((h >>> 14) | 0));
  h = ((h + (h << 4)) | 0);
  return (h ^ ((h >>> 10) | 0))
});
$c_sci_HashSet.prototype.contains__O__Z = (function(e) {
  return this.get0__O__I__I__Z(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_HashSet(elem)
});
$c_sci_HashSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return false
});
$c_sci_HashSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return true
});
function $is_sci_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet)))
}
function $as_sci_HashSet(obj) {
  return (($is_sci_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet"))
}
function $isArrayOf_sci_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet)))
}
function $asArrayOf_sci_HashSet(obj, depth) {
  return (($isArrayOf_sci_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet;", depth))
}
var $d_sci_HashSet = new $TypeData().initClass({
  sci_HashSet: 0
}, false, "scala.collection.immutable.HashSet", {
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet.prototype.$classData = $d_sci_HashSet;
/** @constructor */
function $c_sci_ListSet$EmptyListSet$() {
  $c_sci_ListSet.call(this)
}
$c_sci_ListSet$EmptyListSet$.prototype = new $h_sci_ListSet();
$c_sci_ListSet$EmptyListSet$.prototype.constructor = $c_sci_ListSet$EmptyListSet$;
/** @constructor */
function $h_sci_ListSet$EmptyListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$EmptyListSet$.prototype = $c_sci_ListSet$EmptyListSet$.prototype;
var $d_sci_ListSet$EmptyListSet$ = new $TypeData().initClass({
  sci_ListSet$EmptyListSet$: 0
}, false, "scala.collection.immutable.ListSet$EmptyListSet$", {
  sci_ListSet$EmptyListSet$: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$EmptyListSet$.prototype.$classData = $d_sci_ListSet$EmptyListSet$;
var $n_sci_ListSet$EmptyListSet$ = (void 0);
function $m_sci_ListSet$EmptyListSet$() {
  if ((!$n_sci_ListSet$EmptyListSet$)) {
    $n_sci_ListSet$EmptyListSet$ = new $c_sci_ListSet$EmptyListSet$().init___()
  };
  return $n_sci_ListSet$EmptyListSet$
}
/** @constructor */
function $c_sci_ListSet$Node() {
  $c_sci_ListSet.call(this);
  this.head$5 = null;
  this.$$outer$f = null
}
$c_sci_ListSet$Node.prototype = new $h_sci_ListSet();
$c_sci_ListSet$Node.prototype.constructor = $c_sci_ListSet$Node;
/** @constructor */
function $h_sci_ListSet$Node() {
  /*<skip>*/
}
$h_sci_ListSet$Node.prototype = $c_sci_ListSet$Node.prototype;
$c_sci_ListSet$Node.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_ListSet$Node.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_ListSet$Node.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.$$plus__O__sci_ListSet = (function(e) {
  return (this.containsInternal__p5__sci_ListSet__O__Z(this, e) ? this : new $c_sci_ListSet$Node().init___sci_ListSet__O(this, e))
});
$c_sci_ListSet$Node.prototype.sizeInternal__p5__sci_ListSet__I__I = (function(n, acc) {
  _sizeInternal: while (true) {
    if (n.isEmpty__Z()) {
      return acc
    } else {
      var temp$n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
      var temp$acc = ((1 + acc) | 0);
      n = temp$n;
      acc = temp$acc;
      continue _sizeInternal
    }
  }
});
$c_sci_ListSet$Node.prototype.size__I = (function() {
  return this.sizeInternal__p5__sci_ListSet__I__I(this, 0)
});
$c_sci_ListSet$Node.prototype.init___sci_ListSet__O = (function($$outer, head) {
  this.head$5 = head;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_ListSet$Node.prototype.contains__O__Z = (function(e) {
  return this.containsInternal__p5__sci_ListSet__O__Z(this, e)
});
$c_sci_ListSet$Node.prototype.tail__O = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.containsInternal__p5__sci_ListSet__O__Z = (function(n, e) {
  _containsInternal: while (true) {
    if ((!n.isEmpty__Z())) {
      if ($m_sr_BoxesRunTime$().equals__O__O__Z(n.head__O(), e)) {
        return true
      } else {
        n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
        continue _containsInternal
      }
    } else {
      return false
    }
  }
});
$c_sci_ListSet$Node.prototype.tail__sci_ListSet = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
var $d_sci_ListSet$Node = new $TypeData().initClass({
  sci_ListSet$Node: 0
}, false, "scala.collection.immutable.ListSet$Node", {
  sci_ListSet$Node: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$Node.prototype.$classData = $d_sci_ListSet$Node;
/** @constructor */
function $c_scm_AbstractSeq() {
  $c_sc_AbstractSeq.call(this)
}
$c_scm_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$c_scm_AbstractSeq.prototype.constructor = $c_scm_AbstractSeq;
/** @constructor */
function $h_scm_AbstractSeq() {
  /*<skip>*/
}
$h_scm_AbstractSeq.prototype = $c_scm_AbstractSeq.prototype;
$c_scm_AbstractSeq.prototype.seq__sc_TraversableOnce = (function() {
  return this.seq__scm_Seq()
});
$c_scm_AbstractSeq.prototype.seq__scm_Seq = (function() {
  return this
});
/** @constructor */
function $c_sci_HashSet$EmptyHashSet$() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$EmptyHashSet$.prototype = new $h_sci_HashSet();
$c_sci_HashSet$EmptyHashSet$.prototype.constructor = $c_sci_HashSet$EmptyHashSet$;
/** @constructor */
function $h_sci_HashSet$EmptyHashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$EmptyHashSet$.prototype = $c_sci_HashSet$EmptyHashSet$.prototype;
var $d_sci_HashSet$EmptyHashSet$ = new $TypeData().initClass({
  sci_HashSet$EmptyHashSet$: 0
}, false, "scala.collection.immutable.HashSet$EmptyHashSet$", {
  sci_HashSet$EmptyHashSet$: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$EmptyHashSet$.prototype.$classData = $d_sci_HashSet$EmptyHashSet$;
var $n_sci_HashSet$EmptyHashSet$ = (void 0);
function $m_sci_HashSet$EmptyHashSet$() {
  if ((!$n_sci_HashSet$EmptyHashSet$)) {
    $n_sci_HashSet$EmptyHashSet$ = new $c_sci_HashSet$EmptyHashSet$().init___()
  };
  return $n_sci_HashSet$EmptyHashSet$
}
/** @constructor */
function $c_sci_HashSet$HashTrieSet() {
  $c_sci_HashSet.call(this);
  this.bitmap$5 = 0;
  this.elems$5 = null;
  this.size0$5 = 0
}
$c_sci_HashSet$HashTrieSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$HashTrieSet.prototype.constructor = $c_sci_HashSet$HashTrieSet;
/** @constructor */
function $h_sci_HashSet$HashTrieSet() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet.prototype = $c_sci_HashSet$HashTrieSet.prototype;
$c_sci_HashSet$HashTrieSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
  if (((this.bitmap$5 & mask) !== 0)) {
    var sub = this.elems$5.u[offset];
    var subNew = sub.updated0__O__I__I__sci_HashSet(key, hash, ((5 + level) | 0));
    if ((sub === subNew)) {
      return this
    } else {
      var elemsNew = $newArrayObject($d_sci_HashSet.getArrayOf(), [this.elems$5.u["length"]]);
      $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew, 0, this.elems$5.u["length"]);
      elemsNew.u[offset] = subNew;
      return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(this.bitmap$5, elemsNew, ((this.size0$5 + ((subNew.size__I() - sub.size__I()) | 0)) | 0))
    }
  } else {
    var elemsNew$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [((1 + this.elems$5.u["length"]) | 0)]);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew$2, 0, offset);
    elemsNew$2.u[offset] = new $c_sci_HashSet$HashSet1().init___O__I(key, hash);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, offset, elemsNew$2, ((1 + offset) | 0), ((this.elems$5.u["length"] - offset) | 0));
    var bitmapNew = (this.bitmap$5 | mask);
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmapNew, elemsNew$2, ((1 + this.size0$5) | 0))
  }
});
$c_sci_HashSet$HashTrieSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  while ((i < this.elems$5.u["length"])) {
    this.elems$5.u[i].foreach__F1__V(f);
    i = ((1 + i) | 0)
  }
});
$c_sci_HashSet$HashTrieSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_HashSet$HashTrieSet$$anon$1().init___sci_HashSet$HashTrieSet(this)
});
$c_sci_HashSet$HashTrieSet.prototype.size__I = (function() {
  return this.size0$5
});
$c_sci_HashSet$HashTrieSet.prototype.init___I__Asci_HashSet__I = (function(bitmap, elems, size0) {
  this.bitmap$5 = bitmap;
  this.elems$5 = elems;
  this.size0$5 = size0;
  $m_s_Predef$().assert__Z__V(($m_jl_Integer$().bitCount__I__I(bitmap) === elems.u["length"]));
  return this
});
$c_sci_HashSet$HashTrieSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  if ((this.bitmap$5 === (-1))) {
    return this.elems$5.u[(31 & index)].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else if (((this.bitmap$5 & mask) !== 0)) {
    var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
    return this.elems$5.u[offset].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else {
    return false
  }
});
$c_sci_HashSet$HashTrieSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  if ((that === this)) {
    return true
  } else {
    if ($is_sci_HashSet$HashTrieSet(that)) {
      var x2 = $as_sci_HashSet$HashTrieSet(that);
      if ((this.size0$5 <= x2.size0$5)) {
        var abm = this.bitmap$5;
        var a = this.elems$5;
        var ai = 0;
        var b = x2.elems$5;
        var bbm = x2.bitmap$5;
        var bi = 0;
        if (((abm & bbm) === abm)) {
          while ((abm !== 0)) {
            var alsb = (abm ^ (abm & (((-1) + abm) | 0)));
            var blsb = (bbm ^ (bbm & (((-1) + bbm) | 0)));
            if ((alsb === blsb)) {
              if ((!a.u[ai].subsetOf0__sci_HashSet__I__Z(b.u[bi], ((5 + level) | 0)))) {
                return false
              };
              abm = (abm & (~alsb));
              ai = ((1 + ai) | 0)
            };
            bbm = (bbm & (~blsb));
            bi = ((1 + bi) | 0)
          };
          return true
        } else {
          return false
        }
      }
    };
    return false
  }
});
function $is_sci_HashSet$HashTrieSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashTrieSet)))
}
function $as_sci_HashSet$HashTrieSet(obj) {
  return (($is_sci_HashSet$HashTrieSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashTrieSet"))
}
function $isArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashTrieSet)))
}
function $asArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashTrieSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashTrieSet;", depth))
}
var $d_sci_HashSet$HashTrieSet = new $TypeData().initClass({
  sci_HashSet$HashTrieSet: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet", {
  sci_HashSet$HashTrieSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashTrieSet.prototype.$classData = $d_sci_HashSet$HashTrieSet;
/** @constructor */
function $c_sci_HashSet$LeafHashSet() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$LeafHashSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$LeafHashSet.prototype.constructor = $c_sci_HashSet$LeafHashSet;
/** @constructor */
function $h_sci_HashSet$LeafHashSet() {
  /*<skip>*/
}
$h_sci_HashSet$LeafHashSet.prototype = $c_sci_HashSet$LeafHashSet.prototype;
/** @constructor */
function $c_sci_ListMap() {
  $c_sci_AbstractMap.call(this)
}
$c_sci_ListMap.prototype = new $h_sci_AbstractMap();
$c_sci_ListMap.prototype.constructor = $c_sci_ListMap;
/** @constructor */
function $h_sci_ListMap() {
  /*<skip>*/
}
$h_sci_ListMap.prototype = $c_sci_ListMap.prototype;
$c_sci_ListMap.prototype.value__O = (function() {
  throw new $c_ju_NoSuchElementException().init___T("empty map")
});
$c_sci_ListMap.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_ListMap.prototype.empty__sc_Map = (function() {
  return $m_sci_ListMap$EmptyListMap$()
});
$c_sci_ListMap.prototype.empty__sci_Map = (function() {
  return $m_sci_ListMap$EmptyListMap$()
});
$c_sci_ListMap.prototype.size__I = (function() {
  return 0
});
$c_sci_ListMap.prototype.iterator__sc_Iterator = (function() {
  var this$1 = new $c_sci_ListMap$$anon$1().init___sci_ListMap(this);
  var this$2 = $m_sci_List$();
  var cbf = this$2.ReusableCBFInstance$2;
  var this$3 = $as_sci_List($s_sc_TraversableOnce$class__to__sc_TraversableOnce__scg_CanBuildFrom__O(this$1, cbf));
  return $s_sc_SeqLike$class__reverseIterator__sc_SeqLike__sc_Iterator(this$3)
});
$c_sci_ListMap.prototype.key__O = (function() {
  throw new $c_ju_NoSuchElementException().init___T("empty map")
});
$c_sci_ListMap.prototype.updated__O__O__sci_ListMap = (function(key, value) {
  return new $c_sci_ListMap$Node().init___sci_ListMap__O__O(this, key, value)
});
$c_sci_ListMap.prototype.get__O__s_Option = (function(key) {
  return $m_s_None$()
});
$c_sci_ListMap.prototype.next__sci_ListMap = (function() {
  throw new $c_ju_NoSuchElementException().init___T("empty map")
});
$c_sci_ListMap.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.updated__O__O__sci_ListMap(kv.$$und1__O(), kv.$$und2__O())
});
function $is_sci_ListMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_ListMap)))
}
function $as_sci_ListMap(obj) {
  return (($is_sci_ListMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.ListMap"))
}
function $isArrayOf_sci_ListMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_ListMap)))
}
function $asArrayOf_sci_ListMap(obj, depth) {
  return (($isArrayOf_sci_ListMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.ListMap;", depth))
}
/** @constructor */
function $c_sci_Map$EmptyMap$() {
  $c_sci_AbstractMap.call(this)
}
$c_sci_Map$EmptyMap$.prototype = new $h_sci_AbstractMap();
$c_sci_Map$EmptyMap$.prototype.constructor = $c_sci_Map$EmptyMap$;
/** @constructor */
function $h_sci_Map$EmptyMap$() {
  /*<skip>*/
}
$h_sci_Map$EmptyMap$.prototype = $c_sci_Map$EmptyMap$.prototype;
$c_sci_Map$EmptyMap$.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_Map$EmptyMap$.prototype.size__I = (function() {
  return 0
});
$c_sci_Map$EmptyMap$.prototype.get__O__s_Option = (function(key) {
  return $m_s_None$()
});
$c_sci_Map$EmptyMap$.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  var key = kv.$$und1__O();
  var value = kv.$$und2__O();
  return new $c_sci_Map$Map1().init___O__O(key, value)
});
var $d_sci_Map$EmptyMap$ = new $TypeData().initClass({
  sci_Map$EmptyMap$: 0
}, false, "scala.collection.immutable.Map$EmptyMap$", {
  sci_Map$EmptyMap$: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Map$EmptyMap$.prototype.$classData = $d_sci_Map$EmptyMap$;
var $n_sci_Map$EmptyMap$ = (void 0);
function $m_sci_Map$EmptyMap$() {
  if ((!$n_sci_Map$EmptyMap$)) {
    $n_sci_Map$EmptyMap$ = new $c_sci_Map$EmptyMap$().init___()
  };
  return $n_sci_Map$EmptyMap$
}
/** @constructor */
function $c_sci_Map$Map1() {
  $c_sci_AbstractMap.call(this);
  this.key1$5 = null;
  this.value1$5 = null
}
$c_sci_Map$Map1.prototype = new $h_sci_AbstractMap();
$c_sci_Map$Map1.prototype.constructor = $c_sci_Map$Map1;
/** @constructor */
function $h_sci_Map$Map1() {
  /*<skip>*/
}
$h_sci_Map$Map1.prototype = $c_sci_Map$Map1.prototype;
$c_sci_Map$Map1.prototype.init___O__O = (function(key1, value1) {
  this.key1$5 = key1;
  this.value1$5 = value1;
  return this
});
$c_sci_Map$Map1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(new $c_T2().init___O__O(this.key1$5, this.value1$5))
});
$c_sci_Map$Map1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_T2().init___O__O(this.key1$5, this.value1$5)]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Map$Map1.prototype.size__I = (function() {
  return 1
});
$c_sci_Map$Map1.prototype.updated__O__O__sci_Map = (function(key, value) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_sci_Map$Map1().init___O__O(this.key1$5, value) : new $c_sci_Map$Map2().init___O__O__O__O(this.key1$5, this.value1$5, key, value))
});
$c_sci_Map$Map1.prototype.get__O__s_Option = (function(key) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_s_Some().init___O(this.value1$5) : $m_s_None$())
});
$c_sci_Map$Map1.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.updated__O__O__sci_Map(kv.$$und1__O(), kv.$$und2__O())
});
var $d_sci_Map$Map1 = new $TypeData().initClass({
  sci_Map$Map1: 0
}, false, "scala.collection.immutable.Map$Map1", {
  sci_Map$Map1: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Map$Map1.prototype.$classData = $d_sci_Map$Map1;
/** @constructor */
function $c_sci_Map$Map2() {
  $c_sci_AbstractMap.call(this);
  this.key1$5 = null;
  this.value1$5 = null;
  this.key2$5 = null;
  this.value2$5 = null
}
$c_sci_Map$Map2.prototype = new $h_sci_AbstractMap();
$c_sci_Map$Map2.prototype.constructor = $c_sci_Map$Map2;
/** @constructor */
function $h_sci_Map$Map2() {
  /*<skip>*/
}
$h_sci_Map$Map2.prototype = $c_sci_Map$Map2.prototype;
$c_sci_Map$Map2.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(new $c_T2().init___O__O(this.key1$5, this.value1$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key2$5, this.value2$5))
});
$c_sci_Map$Map2.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_T2().init___O__O(this.key1$5, this.value1$5), new $c_T2().init___O__O(this.key2$5, this.value2$5)]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Map$Map2.prototype.size__I = (function() {
  return 2
});
$c_sci_Map$Map2.prototype.updated__O__O__sci_Map = (function(key, value) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_sci_Map$Map2().init___O__O__O__O(this.key1$5, value, this.key2$5, this.value2$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5) ? new $c_sci_Map$Map2().init___O__O__O__O(this.key1$5, this.value1$5, this.key2$5, value) : new $c_sci_Map$Map3().init___O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, this.value2$5, key, value)))
});
$c_sci_Map$Map2.prototype.get__O__s_Option = (function(key) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_s_Some().init___O(this.value1$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5) ? new $c_s_Some().init___O(this.value2$5) : $m_s_None$()))
});
$c_sci_Map$Map2.prototype.init___O__O__O__O = (function(key1, value1, key2, value2) {
  this.key1$5 = key1;
  this.value1$5 = value1;
  this.key2$5 = key2;
  this.value2$5 = value2;
  return this
});
$c_sci_Map$Map2.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.updated__O__O__sci_Map(kv.$$und1__O(), kv.$$und2__O())
});
var $d_sci_Map$Map2 = new $TypeData().initClass({
  sci_Map$Map2: 0
}, false, "scala.collection.immutable.Map$Map2", {
  sci_Map$Map2: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Map$Map2.prototype.$classData = $d_sci_Map$Map2;
/** @constructor */
function $c_sci_Map$Map3() {
  $c_sci_AbstractMap.call(this);
  this.key1$5 = null;
  this.value1$5 = null;
  this.key2$5 = null;
  this.value2$5 = null;
  this.key3$5 = null;
  this.value3$5 = null
}
$c_sci_Map$Map3.prototype = new $h_sci_AbstractMap();
$c_sci_Map$Map3.prototype.constructor = $c_sci_Map$Map3;
/** @constructor */
function $h_sci_Map$Map3() {
  /*<skip>*/
}
$h_sci_Map$Map3.prototype = $c_sci_Map$Map3.prototype;
$c_sci_Map$Map3.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(new $c_T2().init___O__O(this.key1$5, this.value1$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key2$5, this.value2$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key3$5, this.value3$5))
});
$c_sci_Map$Map3.prototype.init___O__O__O__O__O__O = (function(key1, value1, key2, value2, key3, value3) {
  this.key1$5 = key1;
  this.value1$5 = value1;
  this.key2$5 = key2;
  this.value2$5 = value2;
  this.key3$5 = key3;
  this.value3$5 = value3;
  return this
});
$c_sci_Map$Map3.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_T2().init___O__O(this.key1$5, this.value1$5), new $c_T2().init___O__O(this.key2$5, this.value2$5), new $c_T2().init___O__O(this.key3$5, this.value3$5)]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Map$Map3.prototype.size__I = (function() {
  return 3
});
$c_sci_Map$Map3.prototype.updated__O__O__sci_Map = (function(key, value) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_sci_Map$Map3().init___O__O__O__O__O__O(this.key1$5, value, this.key2$5, this.value2$5, this.key3$5, this.value3$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5) ? new $c_sci_Map$Map3().init___O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, value, this.key3$5, this.value3$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key3$5) ? new $c_sci_Map$Map3().init___O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, this.value2$5, this.key3$5, value) : new $c_sci_Map$Map4().init___O__O__O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, this.value2$5, this.key3$5, this.value3$5, key, value))))
});
$c_sci_Map$Map3.prototype.get__O__s_Option = (function(key) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_s_Some().init___O(this.value1$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5) ? new $c_s_Some().init___O(this.value2$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key3$5) ? new $c_s_Some().init___O(this.value3$5) : $m_s_None$())))
});
$c_sci_Map$Map3.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.updated__O__O__sci_Map(kv.$$und1__O(), kv.$$und2__O())
});
var $d_sci_Map$Map3 = new $TypeData().initClass({
  sci_Map$Map3: 0
}, false, "scala.collection.immutable.Map$Map3", {
  sci_Map$Map3: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Map$Map3.prototype.$classData = $d_sci_Map$Map3;
/** @constructor */
function $c_sci_Map$Map4() {
  $c_sci_AbstractMap.call(this);
  this.key1$5 = null;
  this.value1$5 = null;
  this.key2$5 = null;
  this.value2$5 = null;
  this.key3$5 = null;
  this.value3$5 = null;
  this.key4$5 = null;
  this.value4$5 = null
}
$c_sci_Map$Map4.prototype = new $h_sci_AbstractMap();
$c_sci_Map$Map4.prototype.constructor = $c_sci_Map$Map4;
/** @constructor */
function $h_sci_Map$Map4() {
  /*<skip>*/
}
$h_sci_Map$Map4.prototype = $c_sci_Map$Map4.prototype;
$c_sci_Map$Map4.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(new $c_T2().init___O__O(this.key1$5, this.value1$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key2$5, this.value2$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key3$5, this.value3$5));
  f.apply__O__O(new $c_T2().init___O__O(this.key4$5, this.value4$5))
});
$c_sci_Map$Map4.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_T2().init___O__O(this.key1$5, this.value1$5), new $c_T2().init___O__O(this.key2$5, this.value2$5), new $c_T2().init___O__O(this.key3$5, this.value3$5), new $c_T2().init___O__O(this.key4$5, this.value4$5)]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_Map$Map4.prototype.size__I = (function() {
  return 4
});
$c_sci_Map$Map4.prototype.init___O__O__O__O__O__O__O__O = (function(key1, value1, key2, value2, key3, value3, key4, value4) {
  this.key1$5 = key1;
  this.value1$5 = value1;
  this.key2$5 = key2;
  this.value2$5 = value2;
  this.key3$5 = key3;
  this.value3$5 = value3;
  this.key4$5 = key4;
  this.value4$5 = value4;
  return this
});
$c_sci_Map$Map4.prototype.updated__O__O__sci_Map = (function(key, value) {
  if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5)) {
    return new $c_sci_Map$Map4().init___O__O__O__O__O__O__O__O(this.key1$5, value, this.key2$5, this.value2$5, this.key3$5, this.value3$5, this.key4$5, this.value4$5)
  } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5)) {
    return new $c_sci_Map$Map4().init___O__O__O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, value, this.key3$5, this.value3$5, this.key4$5, this.value4$5)
  } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key3$5)) {
    return new $c_sci_Map$Map4().init___O__O__O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, this.value2$5, this.key3$5, value, this.key4$5, this.value4$5)
  } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key4$5)) {
    return new $c_sci_Map$Map4().init___O__O__O__O__O__O__O__O(this.key1$5, this.value1$5, this.key2$5, this.value2$5, this.key3$5, this.value3$5, this.key4$5, value)
  } else {
    var this$1 = new $c_sci_HashMap().init___();
    var elem1 = new $c_T2().init___O__O(this.key1$5, this.value1$5);
    var elem2 = new $c_T2().init___O__O(this.key2$5, this.value2$5);
    var array = [new $c_T2().init___O__O(this.key3$5, this.value3$5), new $c_T2().init___O__O(this.key4$5, this.value4$5), new $c_T2().init___O__O(key, value)];
    var this$3 = this$1.$$plus__T2__sci_HashMap(elem1).$$plus__T2__sci_HashMap(elem2);
    var this$2 = $m_sci_HashMap$();
    var bf = new $c_scg_GenMapFactory$MapCanBuildFrom().init___scg_GenMapFactory(this$2);
    var this$4 = bf.$$outer$f;
    var b = new $c_scm_MapBuilder().init___sc_GenMap(this$4.empty__sc_GenMap());
    var delta = $uI(array["length"]);
    $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V(b, this$3, delta);
    $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(b, this$3);
    var i = 0;
    var len = $uI(array["length"]);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      b.$$plus$eq__T2__scm_MapBuilder($as_T2(arg1));
      i = ((1 + i) | 0)
    };
    return $as_sci_HashMap(b.elems$1)
  }
});
$c_sci_Map$Map4.prototype.get__O__s_Option = (function(key) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key1$5) ? new $c_s_Some().init___O(this.value1$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key2$5) ? new $c_s_Some().init___O(this.value2$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key3$5) ? new $c_s_Some().init___O(this.value3$5) : ($m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key4$5) ? new $c_s_Some().init___O(this.value4$5) : $m_s_None$()))))
});
$c_sci_Map$Map4.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.updated__O__O__sci_Map(kv.$$und1__O(), kv.$$und2__O())
});
var $d_sci_Map$Map4 = new $TypeData().initClass({
  sci_Map$Map4: 0
}, false, "scala.collection.immutable.Map$Map4", {
  sci_Map$Map4: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Map$Map4.prototype.$classData = $d_sci_Map$Map4;
/** @constructor */
function $c_sci_HashMap() {
  $c_sci_AbstractMap.call(this)
}
$c_sci_HashMap.prototype = new $h_sci_AbstractMap();
$c_sci_HashMap.prototype.constructor = $c_sci_HashMap;
/** @constructor */
function $h_sci_HashMap() {
  /*<skip>*/
}
$h_sci_HashMap.prototype = $c_sci_HashMap.prototype;
$c_sci_HashMap.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_HashMap.prototype.computeHash__O__I = (function(key) {
  return this.improve__I__I($m_sr_ScalaRunTime$().hash__O__I(key))
});
$c_sci_HashMap.prototype.init___ = (function() {
  return this
});
$c_sci_HashMap.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_HashMap.prototype.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap = (function(key, hash, level, value, kv, merger) {
  return new $c_sci_HashMap$HashMap1().init___O__I__O__T2(key, hash, value, kv)
});
$c_sci_HashMap.prototype.get0__O__I__I__s_Option = (function(key, hash, level) {
  return $m_s_None$()
});
$c_sci_HashMap.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_HashMap.prototype.$$plus__T2__sci_HashMap = (function(kv) {
  return this.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap(kv.$$und1__O(), this.computeHash__O__I(kv.$$und1__O()), 0, kv.$$und2__O(), kv, null)
});
$c_sci_HashMap.prototype.empty__sc_Map = (function() {
  $m_sci_HashMap$();
  return $m_sci_HashMap$EmptyHashMap$()
});
$c_sci_HashMap.prototype.empty__sci_Map = (function() {
  $m_sci_HashMap$();
  return $m_sci_HashMap$EmptyHashMap$()
});
$c_sci_HashMap.prototype.size__I = (function() {
  return 0
});
$c_sci_HashMap.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_HashMap.prototype.get__O__s_Option = (function(key) {
  return this.get0__O__I__I__s_Option(key, this.computeHash__O__I(key), 0)
});
$c_sci_HashMap.prototype.improve__I__I = (function(hcode) {
  var h = ((hcode + (~(hcode << 9))) | 0);
  h = (h ^ ((h >>> 14) | 0));
  h = ((h + (h << 4)) | 0);
  return (h ^ ((h >>> 10) | 0))
});
$c_sci_HashMap.prototype.$$plus__T2__sc_GenMap = (function(kv) {
  return this.$$plus__T2__sci_HashMap(kv)
});
function $is_sci_HashMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap)))
}
function $as_sci_HashMap(obj) {
  return (($is_sci_HashMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap"))
}
function $isArrayOf_sci_HashMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap)))
}
function $asArrayOf_sci_HashMap(obj, depth) {
  return (($isArrayOf_sci_HashMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap;", depth))
}
var $d_sci_HashMap = new $TypeData().initClass({
  sci_HashMap: 0
}, false, "scala.collection.immutable.HashMap", {
  sci_HashMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_HashMap.prototype.$classData = $d_sci_HashMap;
/** @constructor */
function $c_sci_HashSet$HashSet1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.key$6 = null;
  this.hash$6 = 0
}
$c_sci_HashSet$HashSet1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSet1.prototype.constructor = $c_sci_HashSet$HashSet1;
/** @constructor */
function $h_sci_HashSet$HashSet1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSet1.prototype = $c_sci_HashSet$HashSet1.prototype;
$c_sci_HashSet$HashSet1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  if (((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))) {
    return this
  } else if ((hash !== this.hash$6)) {
    return $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level)
  } else {
    var this$2 = $m_sci_ListSet$EmptyListSet$();
    var elem = this.key$6;
    return new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, new $c_sci_ListSet$Node().init___sci_ListSet__O(this$2, elem).$$plus__O__sci_ListSet(key))
  }
});
$c_sci_HashSet$HashSet1.prototype.init___O__I = (function(key, hash) {
  this.key$6 = key;
  this.hash$6 = hash;
  return this
});
$c_sci_HashSet$HashSet1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.key$6)
});
$c_sci_HashSet$HashSet1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.key$6]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_HashSet$HashSet1.prototype.size__I = (function() {
  return 1
});
$c_sci_HashSet$HashSet1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))
});
$c_sci_HashSet$HashSet1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return that.get0__O__I__I__Z(this.key$6, this.hash$6, level)
});
function $is_sci_HashSet$HashSet1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashSet1)))
}
function $as_sci_HashSet$HashSet1(obj) {
  return (($is_sci_HashSet$HashSet1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashSet1"))
}
function $isArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashSet1)))
}
function $asArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashSet1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashSet1;", depth))
}
var $d_sci_HashSet$HashSet1 = new $TypeData().initClass({
  sci_HashSet$HashSet1: 0
}, false, "scala.collection.immutable.HashSet$HashSet1", {
  sci_HashSet$HashSet1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSet1.prototype.$classData = $d_sci_HashSet$HashSet1;
/** @constructor */
function $c_sci_HashSet$HashSetCollision1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.hash$6 = 0;
  this.ks$6 = null
}
$c_sci_HashSet$HashSetCollision1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSetCollision1.prototype.constructor = $c_sci_HashSet$HashSetCollision1;
/** @constructor */
function $h_sci_HashSet$HashSetCollision1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSetCollision1.prototype = $c_sci_HashSet$HashSetCollision1.prototype;
$c_sci_HashSet$HashSetCollision1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return ((hash === this.hash$6) ? new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, this.ks$6.$$plus__O__sci_ListSet(key)) : $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level))
});
$c_sci_HashSet$HashSetCollision1.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$2, f)
});
$c_sci_HashSet$HashSetCollision1.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.ks$6;
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1)
});
$c_sci_HashSet$HashSetCollision1.prototype.size__I = (function() {
  return this.ks$6.size__I()
});
$c_sci_HashSet$HashSetCollision1.prototype.init___I__sci_ListSet = (function(hash, ks) {
  this.hash$6 = hash;
  this.ks$6 = ks;
  return this
});
$c_sci_HashSet$HashSetCollision1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && this.ks$6.contains__O__Z(key))
});
$c_sci_HashSet$HashSetCollision1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  var res = true;
  while (true) {
    if (res) {
      var this$3 = this$2.that$2;
      var jsx$1 = $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$3)
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var arg1 = this$2.next__O();
      res = that.get0__O__I__I__Z(arg1, this.hash$6, level)
    } else {
      break
    }
  };
  return res
});
var $d_sci_HashSet$HashSetCollision1 = new $TypeData().initClass({
  sci_HashSet$HashSetCollision1: 0
}, false, "scala.collection.immutable.HashSet$HashSetCollision1", {
  sci_HashSet$HashSetCollision1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSetCollision1.prototype.$classData = $d_sci_HashSet$HashSetCollision1;
/** @constructor */
function $c_sci_List() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_List.prototype = new $h_sc_AbstractSeq();
$c_sci_List.prototype.constructor = $c_sci_List;
/** @constructor */
function $h_sci_List() {
  /*<skip>*/
}
$h_sci_List.prototype = $c_sci_List.prototype;
$c_sci_List.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_List.prototype.init___ = (function() {
  return this
});
$c_sci_List.prototype.apply__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_List.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_List.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_List.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_List.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_List.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_List$()
});
$c_sci_List.prototype.foreach__F1__V = (function(f) {
  var these = this;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    these = $as_sci_List(these.tail__O())
  }
});
$c_sci_List.prototype.reverse__O = (function() {
  return this.reverse__sci_List()
});
$c_sci_List.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(this)
});
$c_sci_List.prototype.drop__I__sci_List = (function(n) {
  var these = this;
  var count = n;
  while (((!these.isEmpty__Z()) && (count > 0))) {
    these = $as_sci_List(these.tail__O());
    count = (((-1) + count) | 0)
  };
  return these
});
$c_sci_List.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_LinearSeqOptimized$class__find__sc_LinearSeqOptimized__F1__s_Option(this, p)
});
$c_sci_List.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.length__I = (function() {
  return $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this)
});
$c_sci_List.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_LinearSeqOptimized$class__lastIndexWhere__sc_LinearSeqOptimized__F1__I__I(this, p, end)
});
$c_sci_List.prototype.toStream__sci_Stream = (function() {
  return (this.isEmpty__Z() ? $m_sci_Stream$Empty$() : new $c_sci_Stream$Cons().init___O__F0(this.head__O(), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $as_sci_List($this.tail__O()).toStream__sci_Stream()
    })
  })(this))))
});
$c_sci_List.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.last__O = (function() {
  return $s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this)
});
$c_sci_List.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_List.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ((bf === $m_sci_List$().ReusableCBFInstance$2)) {
    if ((this === $m_sci_Nil$())) {
      return $m_sci_Nil$()
    } else {
      var h = new $c_sci_$colon$colon().init___O__sci_List(f.apply__O__O(this.head__O()), $m_sci_Nil$());
      var t = h;
      var rest = $as_sci_List(this.tail__O());
      while ((rest !== $m_sci_Nil$())) {
        var nx = new $c_sci_$colon$colon().init___O__sci_List(f.apply__O__O(rest.head__O()), $m_sci_Nil$());
        t.tl$5 = nx;
        t = nx;
        rest = $as_sci_List(rest.tail__O())
      };
      return h
    }
  } else {
    return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_List.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_sc_LinearSeqLike(repr);
  return $as_sc_LinearSeq(repr$1)
});
$c_sci_List.prototype.reverse__sci_List = (function() {
  var result = $m_sci_Nil$();
  var these = this;
  while ((!these.isEmpty__Z())) {
    var x$4 = these.head__O();
    var this$1 = result;
    result = new $c_sci_$colon$colon().init___O__sci_List(x$4, this$1);
    these = $as_sci_List(these.tail__O())
  };
  return result
});
$c_sci_List.prototype.stringPrefix__T = (function() {
  return "List"
});
function $is_sci_List(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_List)))
}
function $as_sci_List(obj) {
  return (($is_sci_List(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.List"))
}
function $isArrayOf_sci_List(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_List)))
}
function $asArrayOf_sci_List(obj, depth) {
  return (($isArrayOf_sci_List(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.List;", depth))
}
/** @constructor */
function $c_sci_ListMap$EmptyListMap$() {
  $c_sci_ListMap.call(this)
}
$c_sci_ListMap$EmptyListMap$.prototype = new $h_sci_ListMap();
$c_sci_ListMap$EmptyListMap$.prototype.constructor = $c_sci_ListMap$EmptyListMap$;
/** @constructor */
function $h_sci_ListMap$EmptyListMap$() {
  /*<skip>*/
}
$h_sci_ListMap$EmptyListMap$.prototype = $c_sci_ListMap$EmptyListMap$.prototype;
var $d_sci_ListMap$EmptyListMap$ = new $TypeData().initClass({
  sci_ListMap$EmptyListMap$: 0
}, false, "scala.collection.immutable.ListMap$EmptyListMap$", {
  sci_ListMap$EmptyListMap$: 1,
  sci_ListMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListMap$EmptyListMap$.prototype.$classData = $d_sci_ListMap$EmptyListMap$;
var $n_sci_ListMap$EmptyListMap$ = (void 0);
function $m_sci_ListMap$EmptyListMap$() {
  if ((!$n_sci_ListMap$EmptyListMap$)) {
    $n_sci_ListMap$EmptyListMap$ = new $c_sci_ListMap$EmptyListMap$().init___()
  };
  return $n_sci_ListMap$EmptyListMap$
}
/** @constructor */
function $c_sci_ListMap$Node() {
  $c_sci_ListMap.call(this);
  this.key$6 = null;
  this.value$6 = null;
  this.$$outer$f = null
}
$c_sci_ListMap$Node.prototype = new $h_sci_ListMap();
$c_sci_ListMap$Node.prototype.constructor = $c_sci_ListMap$Node;
/** @constructor */
function $h_sci_ListMap$Node() {
  /*<skip>*/
}
$h_sci_ListMap$Node.prototype = $c_sci_ListMap$Node.prototype;
$c_sci_ListMap$Node.prototype.value__O = (function() {
  return this.value$6
});
$c_sci_ListMap$Node.prototype.apply__O__O = (function(k) {
  return this.apply0__p6__sci_ListMap__O__O(this, k)
});
$c_sci_ListMap$Node.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_ListMap$Node.prototype.apply0__p6__sci_ListMap__O__O = (function(cur, k) {
  _apply0: while (true) {
    if (cur.isEmpty__Z()) {
      throw new $c_ju_NoSuchElementException().init___T(("key not found: " + k))
    } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(k, cur.key__O())) {
      return cur.value__O()
    } else {
      cur = cur.next__sci_ListMap();
      continue _apply0
    }
  }
});
$c_sci_ListMap$Node.prototype.size0__p6__sci_ListMap__I__I = (function(cur, acc) {
  _size0: while (true) {
    if (cur.isEmpty__Z()) {
      return acc
    } else {
      var temp$cur = cur.next__sci_ListMap();
      var temp$acc = ((1 + acc) | 0);
      cur = temp$cur;
      acc = temp$acc;
      continue _size0
    }
  }
});
$c_sci_ListMap$Node.prototype.size__I = (function() {
  return this.size0__p6__sci_ListMap__I__I(this, 0)
});
$c_sci_ListMap$Node.prototype.key__O = (function() {
  return this.key$6
});
$c_sci_ListMap$Node.prototype.updated__O__O__sci_ListMap = (function(k, v) {
  var m = this.remove0__p6__O__sci_ListMap__sci_List__sci_ListMap(k, this, $m_sci_Nil$());
  return new $c_sci_ListMap$Node().init___sci_ListMap__O__O(m, k, v)
});
$c_sci_ListMap$Node.prototype.get__O__s_Option = (function(k) {
  return this.get0__p6__sci_ListMap__O__s_Option(this, k)
});
$c_sci_ListMap$Node.prototype.get0__p6__sci_ListMap__O__s_Option = (function(cur, k) {
  _get0: while (true) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(k, cur.key__O())) {
      return new $c_s_Some().init___O(cur.value__O())
    } else {
      var this$1 = cur.next__sci_ListMap();
      if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
        cur = cur.next__sci_ListMap();
        continue _get0
      } else {
        return $m_s_None$()
      }
    }
  }
});
$c_sci_ListMap$Node.prototype.init___sci_ListMap__O__O = (function($$outer, key, value) {
  this.key$6 = key;
  this.value$6 = value;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_ListMap$Node.prototype.remove0__p6__O__sci_ListMap__sci_List__sci_ListMap = (function(k, cur, acc) {
  _remove0: while (true) {
    if (cur.isEmpty__Z()) {
      var this$1 = acc;
      return $as_sci_ListMap($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$1))
    } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(k, cur.key__O())) {
      var x$4 = cur.next__sci_ListMap();
      var this$2 = acc;
      var acc$1 = x$4;
      var these = this$2;
      while ((!these.isEmpty__Z())) {
        var arg1 = acc$1;
        var arg2 = these.head__O();
        var x0$1 = $as_sci_ListMap(arg1);
        var x1$1 = $as_sci_ListMap(arg2);
        acc$1 = new $c_sci_ListMap$Node().init___sci_ListMap__O__O(x0$1, x1$1.key__O(), x1$1.value__O());
        these = $as_sc_LinearSeqOptimized(these.tail__O())
      };
      return $as_sci_ListMap(acc$1)
    } else {
      var temp$cur = cur.next__sci_ListMap();
      var x$5 = cur;
      var this$3 = acc;
      var temp$acc = new $c_sci_$colon$colon().init___O__sci_List(x$5, this$3);
      cur = temp$cur;
      acc = temp$acc;
      continue _remove0
    }
  }
});
$c_sci_ListMap$Node.prototype.next__sci_ListMap = (function() {
  return this.$$outer$f
});
var $d_sci_ListMap$Node = new $TypeData().initClass({
  sci_ListMap$Node: 0
}, false, "scala.collection.immutable.ListMap$Node", {
  sci_ListMap$Node: 1,
  sci_ListMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListMap$Node.prototype.$classData = $d_sci_ListMap$Node;
/** @constructor */
function $c_sci_Stream() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_Stream.prototype = new $h_sc_AbstractSeq();
$c_sci_Stream.prototype.constructor = $c_sci_Stream;
/** @constructor */
function $h_sci_Stream() {
  /*<skip>*/
}
$h_sci_Stream.prototype = $c_sci_Stream.prototype;
$c_sci_Stream.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Stream.prototype.reverse__sci_Stream = (function() {
  var elem = $m_sci_Stream$Empty$();
  var result = new $c_sr_ObjectRef().init___O(elem);
  var these = this;
  while ((!these.isEmpty__Z())) {
    $m_sci_Stream$();
    var stream = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, result$1) {
      return (function() {
        return $as_sci_Stream(result$1.elem$1)
      })
    })(this, result));
    var r = new $c_sci_Stream$ConsWrapper().init___F0(stream).$$hash$colon$colon__O__sci_Stream(these.head__O());
    r.tail__O();
    result.elem$1 = r;
    these = $as_sci_Stream(these.tail__O())
  };
  return $as_sci_Stream(result.elem$1)
});
$c_sci_Stream.prototype.init___ = (function() {
  return this
});
$c_sci_Stream.prototype.apply__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_Stream.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_Stream.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_Stream.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_Stream.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Stream.prototype.flatMap__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var nonEmptyPrefix = new $c_sr_ObjectRef().init___O(this);
      var prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream();
      while (((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z()) && prefix.isEmpty__Z())) {
        nonEmptyPrefix.elem$1 = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix.elem$1).tail__O());
        if ((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z())) {
          prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream()
        }
      };
      var x$1 = ($as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z() ? ($m_sci_Stream$(), $m_sci_Stream$Empty$()) : prefix.append__F0__sci_Stream(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1, nonEmptyPrefix$1) {
        return (function() {
          var x = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix$1.elem$1).tail__O()).flatMap__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f, nonEmptyPrefix))))
    };
    return x$1
  } else {
    return $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.mkString__T__T = (function(sep) {
  return this.mkString__T__T__T__T("", sep, "")
});
$c_sci_Stream.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  this.force__sci_Stream();
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_Stream.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Stream$()
});
$c_sci_Stream.prototype.toString__T = (function() {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, ("Stream" + "("), ", ", ")")
});
$c_sci_Stream.prototype.foreach__F1__V = (function(f) {
  var _$this = this;
  x: {
    _foreach: while (true) {
      if ((!_$this.isEmpty__Z())) {
        f.apply__O__O(_$this.head__O());
        _$this = $as_sci_Stream(_$this.tail__O());
        continue _foreach
      };
      break x
    }
  }
});
$c_sci_Stream.prototype.reverse__O = (function() {
  return this.reverse__sci_Stream()
});
$c_sci_Stream.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_StreamIterator().init___sci_Stream(this)
});
$c_sci_Stream.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_LinearSeqOptimized$class__find__sc_LinearSeqOptimized__F1__s_Option(this, p)
});
$c_sci_Stream.prototype.length__I = (function() {
  var len = 0;
  var left = this;
  while ((!left.isEmpty__Z())) {
    len = ((1 + len) | 0);
    left = $as_sci_Stream(left.tail__O())
  };
  return len
});
$c_sci_Stream.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  var this$1 = $m_sci_Stream$();
  return this.zip__sc_GenIterable__scg_CanBuildFrom__O(this$1.from__I__I__sci_Stream(0, 1), bf)
});
$c_sci_Stream.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.toStream__sci_Stream = (function() {
  return this
});
$c_sci_Stream.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_LinearSeqOptimized$class__lastIndexWhere__sc_LinearSeqOptimized__F1__I__I(this, p, end)
});
$c_sci_Stream.prototype.last__O = (function() {
  return $s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this)
});
$c_sci_Stream.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.drop__I__sci_Stream = (function(n) {
  var _$this = this;
  _drop: while (true) {
    if (((n <= 0) || _$this.isEmpty__Z())) {
      return _$this
    } else {
      var temp$_$this = $as_sci_Stream(_$this.tail__O());
      var temp$n = (((-1) + n) | 0);
      _$this = temp$_$this;
      n = temp$n;
      continue _drop
    }
  }
});
$c_sci_Stream.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  b.append__T__scm_StringBuilder(start);
  if ((!this.isEmpty__Z())) {
    b.append__O__scm_StringBuilder(this.head__O());
    var cursor = this;
    var n = 1;
    if (cursor.tailDefined__Z()) {
      var scout = $as_sci_Stream(this.tail__O());
      if (scout.isEmpty__Z()) {
        b.append__T__scm_StringBuilder(end);
        return b
      };
      if ((cursor !== scout)) {
        cursor = scout;
        if (scout.tailDefined__Z()) {
          scout = $as_sci_Stream(scout.tail__O());
          while (((cursor !== scout) && scout.tailDefined__Z())) {
            b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
            n = ((1 + n) | 0);
            cursor = $as_sci_Stream(cursor.tail__O());
            scout = $as_sci_Stream(scout.tail__O());
            if (scout.tailDefined__Z()) {
              scout = $as_sci_Stream(scout.tail__O())
            }
          }
        }
      };
      if ((!scout.tailDefined__Z())) {
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        var this$1 = cursor;
        if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O())
        }
      } else {
        var runner = this;
        var k = 0;
        while ((runner !== scout)) {
          runner = $as_sci_Stream(runner.tail__O());
          scout = $as_sci_Stream(scout.tail__O());
          k = ((1 + k) | 0)
        };
        if (((cursor === scout) && (k > 0))) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        n = ((n - k) | 0)
      }
    };
    if ((!cursor.isEmpty__Z())) {
      if ((!cursor.tailDefined__Z())) {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("?")
      } else {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("...")
      }
    }
  };
  b.append__T__scm_StringBuilder(end);
  return b
});
$c_sci_Stream.prototype.force__sci_Stream = (function() {
  var these = this;
  var those = this;
  if ((!these.isEmpty__Z())) {
    these = $as_sci_Stream(these.tail__O())
  };
  while ((those !== these)) {
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if ((these === those)) {
      return this
    };
    those = $as_sci_Stream(those.tail__O())
  };
  return this
});
$c_sci_Stream.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Stream.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var hd = f.apply__O__O(this.head__O());
      var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1) {
        return (function() {
          var x = $as_sci_Stream($this.tail__O()).map__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f));
      var x$1 = new $c_sci_Stream$Cons().init___O__F0(hd, tl)
    };
    return x$1
  } else {
    return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_sc_LinearSeqLike(repr);
  return $as_sc_LinearSeq(repr$1)
});
$c_sci_Stream.prototype.append__F0__sci_Stream = (function(rest) {
  if (this.isEmpty__Z()) {
    return $as_sc_GenTraversableOnce(rest.apply__O()).toStream__sci_Stream()
  } else {
    var hd = this.head__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, rest$1) {
      return (function() {
        return $as_sci_Stream($this.tail__O()).append__F0__sci_Stream(rest$1)
      })
    })(this, rest));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  }
});
$c_sci_Stream.prototype.stringPrefix__T = (function() {
  return "Stream"
});
$c_sci_Stream.prototype.zip__sc_GenIterable__scg_CanBuildFrom__O = (function(that, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if ((this.isEmpty__Z() || that.isEmpty__Z())) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var hd = new $c_T2().init___O__O(this.head__O(), that.head__O());
      var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, that$1) {
        return (function() {
          var x = $as_sci_Stream($this.tail__O()).zip__sc_GenIterable__scg_CanBuildFrom__O($as_sc_GenIterable(that$1.tail__O()), ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, that));
      var x$1 = new $c_sci_Stream$Cons().init___O__F0(hd, tl)
    };
    return x$1
  } else {
    return $s_sc_IterableLike$class__zip__sc_IterableLike__sc_GenIterable__scg_CanBuildFrom__O(this, that, bf)
  }
});
function $is_sci_Stream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream)))
}
function $as_sci_Stream(obj) {
  return (($is_sci_Stream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream"))
}
function $isArrayOf_sci_Stream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream)))
}
function $asArrayOf_sci_Stream(obj, depth) {
  return (($isArrayOf_sci_Stream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream;", depth))
}
/** @constructor */
function $c_sci_HashMap$EmptyHashMap$() {
  $c_sci_HashMap.call(this)
}
$c_sci_HashMap$EmptyHashMap$.prototype = new $h_sci_HashMap();
$c_sci_HashMap$EmptyHashMap$.prototype.constructor = $c_sci_HashMap$EmptyHashMap$;
/** @constructor */
function $h_sci_HashMap$EmptyHashMap$() {
  /*<skip>*/
}
$h_sci_HashMap$EmptyHashMap$.prototype = $c_sci_HashMap$EmptyHashMap$.prototype;
var $d_sci_HashMap$EmptyHashMap$ = new $TypeData().initClass({
  sci_HashMap$EmptyHashMap$: 0
}, false, "scala.collection.immutable.HashMap$EmptyHashMap$", {
  sci_HashMap$EmptyHashMap$: 1,
  sci_HashMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_HashMap$EmptyHashMap$.prototype.$classData = $d_sci_HashMap$EmptyHashMap$;
var $n_sci_HashMap$EmptyHashMap$ = (void 0);
function $m_sci_HashMap$EmptyHashMap$() {
  if ((!$n_sci_HashMap$EmptyHashMap$)) {
    $n_sci_HashMap$EmptyHashMap$ = new $c_sci_HashMap$EmptyHashMap$().init___()
  };
  return $n_sci_HashMap$EmptyHashMap$
}
/** @constructor */
function $c_sci_HashMap$HashMap1() {
  $c_sci_HashMap.call(this);
  this.key$6 = null;
  this.hash$6 = 0;
  this.value$6 = null;
  this.kv$6 = null
}
$c_sci_HashMap$HashMap1.prototype = new $h_sci_HashMap();
$c_sci_HashMap$HashMap1.prototype.constructor = $c_sci_HashMap$HashMap1;
/** @constructor */
function $h_sci_HashMap$HashMap1() {
  /*<skip>*/
}
$h_sci_HashMap$HashMap1.prototype = $c_sci_HashMap$HashMap1.prototype;
$c_sci_HashMap$HashMap1.prototype.ensurePair__T2 = (function() {
  if ((this.kv$6 !== null)) {
    return this.kv$6
  } else {
    this.kv$6 = new $c_T2().init___O__O(this.key$6, this.value$6);
    return this.kv$6
  }
});
$c_sci_HashMap$HashMap1.prototype.init___O__I__O__T2 = (function(key, hash, value, kv) {
  this.key$6 = key;
  this.hash$6 = hash;
  this.value$6 = value;
  this.kv$6 = kv;
  return this
});
$c_sci_HashMap$HashMap1.prototype.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap = (function(key, hash, level, value, kv, merger) {
  if (((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))) {
    if ((merger === null)) {
      return ((this.value$6 === value) ? this : new $c_sci_HashMap$HashMap1().init___O__I__O__T2(key, hash, value, kv))
    } else {
      var nkv = merger.apply__T2__T2__T2(this.kv$6, kv);
      return new $c_sci_HashMap$HashMap1().init___O__I__O__T2(nkv.$$und1__O(), hash, nkv.$$und2__O(), nkv)
    }
  } else if ((hash !== this.hash$6)) {
    var that = new $c_sci_HashMap$HashMap1().init___O__I__O__T2(key, hash, value, kv);
    return $m_sci_HashMap$().scala$collection$immutable$HashMap$$makeHashTrieMap__I__sci_HashMap__I__sci_HashMap__I__I__sci_HashMap$HashTrieMap(this.hash$6, this, hash, that, level, 2)
  } else {
    var this$2 = $m_sci_ListMap$EmptyListMap$();
    var key$1 = this.key$6;
    var value$1 = this.value$6;
    return new $c_sci_HashMap$HashMapCollision1().init___I__sci_ListMap(hash, new $c_sci_ListMap$Node().init___sci_ListMap__O__O(this$2, key$1, value$1).updated__O__O__sci_ListMap(key, value))
  }
});
$c_sci_HashMap$HashMap1.prototype.get0__O__I__I__s_Option = (function(key, hash, level) {
  return (((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6)) ? new $c_s_Some().init___O(this.value$6) : $m_s_None$())
});
$c_sci_HashMap$HashMap1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.ensurePair__T2())
});
$c_sci_HashMap$HashMap1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.ensurePair__T2()]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6["length"]))
});
$c_sci_HashMap$HashMap1.prototype.size__I = (function() {
  return 1
});
function $is_sci_HashMap$HashMap1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashMap1)))
}
function $as_sci_HashMap$HashMap1(obj) {
  return (($is_sci_HashMap$HashMap1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashMap1"))
}
function $isArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashMap1)))
}
function $asArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashMap1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashMap1;", depth))
}
var $d_sci_HashMap$HashMap1 = new $TypeData().initClass({
  sci_HashMap$HashMap1: 0
}, false, "scala.collection.immutable.HashMap$HashMap1", {
  sci_HashMap$HashMap1: 1,
  sci_HashMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_HashMap$HashMap1.prototype.$classData = $d_sci_HashMap$HashMap1;
/** @constructor */
function $c_sci_HashMap$HashMapCollision1() {
  $c_sci_HashMap.call(this);
  this.hash$6 = 0;
  this.kvs$6 = null
}
$c_sci_HashMap$HashMapCollision1.prototype = new $h_sci_HashMap();
$c_sci_HashMap$HashMapCollision1.prototype.constructor = $c_sci_HashMap$HashMapCollision1;
/** @constructor */
function $h_sci_HashMap$HashMapCollision1() {
  /*<skip>*/
}
$h_sci_HashMap$HashMapCollision1.prototype = $c_sci_HashMap$HashMapCollision1.prototype;
$c_sci_HashMap$HashMapCollision1.prototype.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap = (function(key, hash, level, value, kv, merger) {
  if ((hash === this.hash$6)) {
    if ((merger === null)) {
      var jsx$1 = true
    } else {
      var this$1 = this.kvs$6;
      var jsx$1 = (!$s_sc_MapLike$class__contains__sc_MapLike__O__Z(this$1, key))
    };
    if (jsx$1) {
      return new $c_sci_HashMap$HashMapCollision1().init___I__sci_ListMap(hash, this.kvs$6.updated__O__O__sci_ListMap(key, value))
    } else {
      var this$2 = this.kvs$6;
      var kv$1 = merger.apply__T2__T2__T2(new $c_T2().init___O__O(key, this.kvs$6.apply__O__O(key)), kv);
      return new $c_sci_HashMap$HashMapCollision1().init___I__sci_ListMap(hash, this$2.updated__O__O__sci_ListMap(kv$1.$$und1__O(), kv$1.$$und2__O()))
    }
  } else {
    var that = new $c_sci_HashMap$HashMap1().init___O__I__O__T2(key, hash, value, kv);
    return $m_sci_HashMap$().scala$collection$immutable$HashMap$$makeHashTrieMap__I__sci_HashMap__I__sci_HashMap__I__I__sci_HashMap$HashTrieMap(this.hash$6, this, hash, that, level, ((1 + this.kvs$6.size__I()) | 0))
  }
});
$c_sci_HashMap$HashMapCollision1.prototype.get0__O__I__I__s_Option = (function(key, hash, level) {
  return ((hash === this.hash$6) ? this.kvs$6.get__O__s_Option(key) : $m_s_None$())
});
$c_sci_HashMap$HashMapCollision1.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.kvs$6;
  var this$2 = this$1.iterator__sc_Iterator();
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$2, f)
});
$c_sci_HashMap$HashMapCollision1.prototype.iterator__sc_Iterator = (function() {
  return this.kvs$6.iterator__sc_Iterator()
});
$c_sci_HashMap$HashMapCollision1.prototype.size__I = (function() {
  return this.kvs$6.size__I()
});
$c_sci_HashMap$HashMapCollision1.prototype.init___I__sci_ListMap = (function(hash, kvs) {
  this.hash$6 = hash;
  this.kvs$6 = kvs;
  return this
});
var $d_sci_HashMap$HashMapCollision1 = new $TypeData().initClass({
  sci_HashMap$HashMapCollision1: 0
}, false, "scala.collection.immutable.HashMap$HashMapCollision1", {
  sci_HashMap$HashMapCollision1: 1,
  sci_HashMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_HashMap$HashMapCollision1.prototype.$classData = $d_sci_HashMap$HashMapCollision1;
/** @constructor */
function $c_sci_HashMap$HashTrieMap() {
  $c_sci_HashMap.call(this);
  this.bitmap$6 = 0;
  this.elems$6 = null;
  this.size0$6 = 0
}
$c_sci_HashMap$HashTrieMap.prototype = new $h_sci_HashMap();
$c_sci_HashMap$HashTrieMap.prototype.constructor = $c_sci_HashMap$HashTrieMap;
/** @constructor */
function $h_sci_HashMap$HashTrieMap() {
  /*<skip>*/
}
$h_sci_HashMap$HashTrieMap.prototype = $c_sci_HashMap$HashTrieMap.prototype;
$c_sci_HashMap$HashTrieMap.prototype.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap = (function(key, hash, level, value, kv, merger) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$6 & (((-1) + mask) | 0)));
  if (((this.bitmap$6 & mask) !== 0)) {
    var sub = this.elems$6.u[offset];
    var subNew = sub.updated0__O__I__I__O__T2__sci_HashMap$Merger__sci_HashMap(key, hash, ((5 + level) | 0), value, kv, merger);
    if ((subNew === sub)) {
      return this
    } else {
      var elemsNew = $newArrayObject($d_sci_HashMap.getArrayOf(), [this.elems$6.u["length"]]);
      $m_s_Array$().copy__O__I__O__I__I__V(this.elems$6, 0, elemsNew, 0, this.elems$6.u["length"]);
      elemsNew.u[offset] = subNew;
      return new $c_sci_HashMap$HashTrieMap().init___I__Asci_HashMap__I(this.bitmap$6, elemsNew, ((this.size0$6 + ((subNew.size__I() - sub.size__I()) | 0)) | 0))
    }
  } else {
    var elemsNew$2 = $newArrayObject($d_sci_HashMap.getArrayOf(), [((1 + this.elems$6.u["length"]) | 0)]);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$6, 0, elemsNew$2, 0, offset);
    elemsNew$2.u[offset] = new $c_sci_HashMap$HashMap1().init___O__I__O__T2(key, hash, value, kv);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$6, offset, elemsNew$2, ((1 + offset) | 0), ((this.elems$6.u["length"] - offset) | 0));
    return new $c_sci_HashMap$HashTrieMap().init___I__Asci_HashMap__I((this.bitmap$6 | mask), elemsNew$2, ((1 + this.size0$6) | 0))
  }
});
$c_sci_HashMap$HashTrieMap.prototype.get0__O__I__I__s_Option = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  if ((this.bitmap$6 === (-1))) {
    return this.elems$6.u[(31 & index)].get0__O__I__I__s_Option(key, hash, ((5 + level) | 0))
  } else if (((this.bitmap$6 & mask) !== 0)) {
    var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$6 & (((-1) + mask) | 0)));
    return this.elems$6.u[offset].get0__O__I__I__s_Option(key, hash, ((5 + level) | 0))
  } else {
    return $m_s_None$()
  }
});
$c_sci_HashMap$HashTrieMap.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  while ((i < this.elems$6.u["length"])) {
    this.elems$6.u[i].foreach__F1__V(f);
    i = ((1 + i) | 0)
  }
});
$c_sci_HashMap$HashTrieMap.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_HashMap$HashTrieMap$$anon$1().init___sci_HashMap$HashTrieMap(this)
});
$c_sci_HashMap$HashTrieMap.prototype.size__I = (function() {
  return this.size0$6
});
$c_sci_HashMap$HashTrieMap.prototype.init___I__Asci_HashMap__I = (function(bitmap, elems, size0) {
  this.bitmap$6 = bitmap;
  this.elems$6 = elems;
  this.size0$6 = size0;
  return this
});
function $is_sci_HashMap$HashTrieMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashTrieMap)))
}
function $as_sci_HashMap$HashTrieMap(obj) {
  return (($is_sci_HashMap$HashTrieMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashTrieMap"))
}
function $isArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashTrieMap)))
}
function $asArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashTrieMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashTrieMap;", depth))
}
var $d_sci_HashMap$HashTrieMap = new $TypeData().initClass({
  sci_HashMap$HashTrieMap: 0
}, false, "scala.collection.immutable.HashMap$HashTrieMap", {
  sci_HashMap$HashTrieMap: 1,
  sci_HashMap: 1,
  sci_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  sci_Map: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sci_MapLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_HashMap$HashTrieMap.prototype.$classData = $d_sci_HashMap$HashTrieMap;
/** @constructor */
function $c_sci_Stream$Cons() {
  $c_sci_Stream.call(this);
  this.hd$5 = null;
  this.tlVal$5 = null;
  this.tlGen$5 = null
}
$c_sci_Stream$Cons.prototype = new $h_sci_Stream();
$c_sci_Stream$Cons.prototype.constructor = $c_sci_Stream$Cons;
/** @constructor */
function $h_sci_Stream$Cons() {
  /*<skip>*/
}
$h_sci_Stream$Cons.prototype = $c_sci_Stream$Cons.prototype;
$c_sci_Stream$Cons.prototype.head__O = (function() {
  return this.hd$5
});
$c_sci_Stream$Cons.prototype.tail__sci_Stream = (function() {
  if ((!this.tailDefined__Z())) {
    if ((!this.tailDefined__Z())) {
      this.tlVal$5 = $as_sci_Stream(this.tlGen$5.apply__O());
      this.tlGen$5 = null
    }
  };
  return this.tlVal$5
});
$c_sci_Stream$Cons.prototype.tailDefined__Z = (function() {
  return (this.tlGen$5 === null)
});
$c_sci_Stream$Cons.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_Stream$Cons.prototype.tail__O = (function() {
  return this.tail__sci_Stream()
});
$c_sci_Stream$Cons.prototype.init___O__F0 = (function(hd, tl) {
  this.hd$5 = hd;
  this.tlGen$5 = tl;
  return this
});
var $d_sci_Stream$Cons = new $TypeData().initClass({
  sci_Stream$Cons: 0
}, false, "scala.collection.immutable.Stream$Cons", {
  sci_Stream$Cons: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Cons.prototype.$classData = $d_sci_Stream$Cons;
/** @constructor */
function $c_sci_Stream$Empty$() {
  $c_sci_Stream.call(this)
}
$c_sci_Stream$Empty$.prototype = new $h_sci_Stream();
$c_sci_Stream$Empty$.prototype.constructor = $c_sci_Stream$Empty$;
/** @constructor */
function $h_sci_Stream$Empty$() {
  /*<skip>*/
}
$h_sci_Stream$Empty$.prototype = $c_sci_Stream$Empty$.prototype;
$c_sci_Stream$Empty$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Stream$Empty$.prototype.tailDefined__Z = (function() {
  return false
});
$c_sci_Stream$Empty$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Stream$Empty$.prototype.tail__sr_Nothing$ = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty stream")
});
$c_sci_Stream$Empty$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty stream")
});
$c_sci_Stream$Empty$.prototype.tail__O = (function() {
  this.tail__sr_Nothing$()
});
var $d_sci_Stream$Empty$ = new $TypeData().initClass({
  sci_Stream$Empty$: 0
}, false, "scala.collection.immutable.Stream$Empty$", {
  sci_Stream$Empty$: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Empty$.prototype.$classData = $d_sci_Stream$Empty$;
var $n_sci_Stream$Empty$ = (void 0);
function $m_sci_Stream$Empty$() {
  if ((!$n_sci_Stream$Empty$)) {
    $n_sci_Stream$Empty$ = new $c_sci_Stream$Empty$().init___()
  };
  return $n_sci_Stream$Empty$
}
/** @constructor */
function $c_sci_Vector() {
  $c_sc_AbstractSeq.call(this);
  this.startIndex$4 = 0;
  this.endIndex$4 = 0;
  this.focus$4 = 0;
  this.dirty$4 = false;
  this.depth$4 = 0;
  this.display0$4 = null;
  this.display1$4 = null;
  this.display2$4 = null;
  this.display3$4 = null;
  this.display4$4 = null;
  this.display5$4 = null
}
$c_sci_Vector.prototype = new $h_sc_AbstractSeq();
$c_sci_Vector.prototype.constructor = $c_sci_Vector;
/** @constructor */
function $h_sci_Vector() {
  /*<skip>*/
}
$h_sci_Vector.prototype = $c_sci_Vector.prototype;
$c_sci_Vector.prototype.checkRangeConvert__p4__I__I = (function(index) {
  var idx = ((index + this.startIndex$4) | 0);
  if (((index >= 0) && (idx < this.endIndex$4))) {
    return idx
  } else {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + index))
  }
});
$c_sci_Vector.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Vector.prototype.display3__AO = (function() {
  return this.display3$4
});
$c_sci_Vector.prototype.gotoPosWritable__p4__I__I__I__V = (function(oldIndex, newIndex, xor) {
  if (this.dirty$4) {
    $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor)
  } else {
    $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V(this, newIndex, xor);
    this.dirty$4 = true
  }
});
$c_sci_Vector.prototype.head__O = (function() {
  if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.head")
  };
  return this.apply__I__O(0)
});
$c_sci_Vector.prototype.apply__I__O = (function(index) {
  var idx = this.checkRangeConvert__p4__I__I(index);
  var xor = (idx ^ this.focus$4);
  return $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O(this, idx, xor)
});
$c_sci_Vector.prototype.depth__I = (function() {
  return this.depth$4
});
$c_sci_Vector.prototype.lengthCompare__I__I = (function(len) {
  return ((this.length__I() - len) | 0)
});
$c_sci_Vector.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_sci_Vector.prototype.initIterator__sci_VectorIterator__V = (function(s) {
  var depth = this.depth$4;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if (this.dirty$4) {
    var index = this.focus$4;
    $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V(s, index)
  };
  if ((s.depth$2 > 1)) {
    var index$1 = this.startIndex$4;
    var xor = (this.startIndex$4 ^ this.focus$4);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, index$1, xor)
  }
});
$c_sci_Vector.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Vector.prototype.init___I__I__I = (function(startIndex, endIndex, focus) {
  this.startIndex$4 = startIndex;
  this.endIndex$4 = endIndex;
  this.focus$4 = focus;
  this.dirty$4 = false;
  return this
});
$c_sci_Vector.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$4 = x$1
});
$c_sci_Vector.prototype.$$colon$plus__O__scg_CanBuildFrom__O = (function(elem, bf) {
  return ((((bf === ($m_sci_IndexedSeq$(), $m_sc_IndexedSeq$().ReusableCBF$6)) || (bf === $m_sci_Seq$().ReusableCBFInstance$2)) || (bf === $m_sc_Seq$().ReusableCBFInstance$2)) ? this.appendBack__O__sci_Vector(elem) : $s_sc_SeqLike$class__$$colon$plus__sc_SeqLike__O__scg_CanBuildFrom__O(this, elem, bf))
});
$c_sci_Vector.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Vector$()
});
$c_sci_Vector.prototype.cleanLeftEdge__p4__I__V = (function(cutIndex) {
  if ((cutIndex < 32)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, cutIndex)
  } else if ((cutIndex < 1024)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, ((cutIndex >>> 5) | 0))
  } else if ((cutIndex < 32768)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, ((cutIndex >>> 10) | 0))
  } else if ((cutIndex < 1048576)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, ((cutIndex >>> 15) | 0))
  } else if ((cutIndex < 33554432)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, (31 & ((cutIndex >>> 15) | 0)));
    this.display4$4 = this.copyRight__p4__AO__I__AO(this.display4$4, ((cutIndex >>> 20) | 0))
  } else if ((cutIndex < 1073741824)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, (31 & ((cutIndex >>> 15) | 0)));
    this.display4$4 = this.copyRight__p4__AO__I__AO(this.display4$4, (31 & ((cutIndex >>> 20) | 0)));
    this.display5$4 = this.copyRight__p4__AO__I__AO(this.display5$4, ((cutIndex >>> 25) | 0))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
});
$c_sci_Vector.prototype.display0__AO = (function() {
  return this.display0$4
});
$c_sci_Vector.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$4 = x$1
});
$c_sci_Vector.prototype.display4__AO = (function() {
  return this.display4$4
});
$c_sci_Vector.prototype.shiftTopLevel__p4__I__I__V = (function(oldLeft, newLeft) {
  var x1 = (((-1) + this.depth$4) | 0);
  switch (x1) {
    case 0: {
      var array = this.display0$4;
      this.display0$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array, oldLeft, newLeft);
      break
    }
    case 1: {
      var array$1 = this.display1$4;
      this.display1$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$1, oldLeft, newLeft);
      break
    }
    case 2: {
      var array$2 = this.display2$4;
      this.display2$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$2, oldLeft, newLeft);
      break
    }
    case 3: {
      var array$3 = this.display3$4;
      this.display3$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$3, oldLeft, newLeft);
      break
    }
    case 4: {
      var array$4 = this.display4$4;
      this.display4$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$4, oldLeft, newLeft);
      break
    }
    case 5: {
      var array$5 = this.display5$4;
      this.display5$4 = $s_sci_VectorPointer$class__copyRange__sci_VectorPointer__AO__I__I__AO(this, array$5, oldLeft, newLeft);
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
});
$c_sci_Vector.prototype.tail__sci_Vector = (function() {
  if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.tail")
  };
  return this.drop__I__sci_Vector(1)
});
$c_sci_Vector.prototype.toVector__sci_Vector = (function() {
  return this
});
$c_sci_Vector.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sci_Vector$$anon$1().init___sci_Vector(this)
});
$c_sci_Vector.prototype.appendBack__O__sci_Vector = (function(value) {
  if ((this.endIndex$4 !== this.startIndex$4)) {
    var blockIndex = ((-32) & this.endIndex$4);
    var lo = (31 & this.endIndex$4);
    if ((this.endIndex$4 !== blockIndex)) {
      var s = new $c_sci_Vector().init___I__I__I(this.startIndex$4, ((1 + this.endIndex$4) | 0), blockIndex);
      var depth = this.depth$4;
      $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
      s.dirty$4 = this.dirty$4;
      s.gotoPosWritable__p4__I__I__I__V(this.focus$4, blockIndex, (this.focus$4 ^ blockIndex));
      s.display0$4.u[lo] = value;
      return s
    } else {
      var shift = (this.startIndex$4 & (~(((-1) + (1 << $imul(5, (((-1) + this.depth$4) | 0)))) | 0)));
      var shiftBlocks = ((this.startIndex$4 >>> $imul(5, (((-1) + this.depth$4) | 0))) | 0);
      if ((shift !== 0)) {
        $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(this);
        if ((this.depth$4 > 1)) {
          var newBlockIndex = ((blockIndex - shift) | 0);
          var newFocus = ((this.focus$4 - shift) | 0);
          var s$2 = new $c_sci_Vector().init___I__I__I(((this.startIndex$4 - shift) | 0), ((((1 + this.endIndex$4) | 0) - shift) | 0), newBlockIndex);
          var depth$1 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$2, this, depth$1);
          s$2.dirty$4 = this.dirty$4;
          s$2.shiftTopLevel__p4__I__I__V(shiftBlocks, 0);
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$2);
          s$2.gotoFreshPosWritable__p4__I__I__I__V(newFocus, newBlockIndex, (newFocus ^ newBlockIndex));
          s$2.display0$4.u[lo] = value;
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$2);
          return s$2
        } else {
          var newBlockIndex$2 = (((-32) + blockIndex) | 0);
          var newFocus$2 = this.focus$4;
          var s$3 = new $c_sci_Vector().init___I__I__I(((this.startIndex$4 - shift) | 0), ((((1 + this.endIndex$4) | 0) - shift) | 0), newBlockIndex$2);
          var depth$2 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$3, this, depth$2);
          s$3.dirty$4 = this.dirty$4;
          s$3.shiftTopLevel__p4__I__I__V(shiftBlocks, 0);
          s$3.gotoPosWritable__p4__I__I__I__V(newFocus$2, newBlockIndex$2, (newFocus$2 ^ newBlockIndex$2));
          s$3.display0$4.u[((32 - shift) | 0)] = value;
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$3);
          return s$3
        }
      } else {
        var newFocus$3 = this.focus$4;
        var s$4 = new $c_sci_Vector().init___I__I__I(this.startIndex$4, ((1 + this.endIndex$4) | 0), blockIndex);
        var depth$3 = this.depth$4;
        $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$4, this, depth$3);
        s$4.dirty$4 = this.dirty$4;
        s$4.gotoFreshPosWritable__p4__I__I__I__V(newFocus$3, blockIndex, (newFocus$3 ^ blockIndex));
        s$4.display0$4.u[lo] = value;
        if ((s$4.depth$4 === ((1 + this.depth$4) | 0))) {
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$4)
        };
        return s$4
      }
    }
  } else {
    var elems = $newArrayObject($d_O.getArrayOf(), [32]);
    elems.u[0] = value;
    var s$5 = new $c_sci_Vector().init___I__I__I(0, 1, 0);
    s$5.depth$4 = 1;
    s$5.display0$4 = elems;
    return s$5
  }
});
$c_sci_Vector.prototype.preClean__p4__I__V = (function(depth) {
  this.depth$4 = depth;
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case 0: {
      this.display1$4 = null;
      this.display2$4 = null;
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 1: {
      this.display2$4 = null;
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 2: {
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 3: {
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 4: {
      this.display5$4 = null;
      break
    }
    case 5: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
});
$c_sci_Vector.prototype.$$plus$colon__O__scg_CanBuildFrom__O = (function(elem, bf) {
  return ((((bf === ($m_sci_IndexedSeq$(), $m_sc_IndexedSeq$().ReusableCBF$6)) || (bf === $m_sci_Seq$().ReusableCBFInstance$2)) || (bf === $m_sc_Seq$().ReusableCBFInstance$2)) ? this.appendFront__O__sci_Vector(elem) : $s_sc_SeqLike$class__$$plus$colon__sc_SeqLike__O__scg_CanBuildFrom__O(this, elem, bf))
});
$c_sci_Vector.prototype.iterator__sc_Iterator = (function() {
  return this.iterator__sci_VectorIterator()
});
$c_sci_Vector.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$4 = x$1
});
$c_sci_Vector.prototype.$$plus$plus__sc_GenTraversableOnce__scg_CanBuildFrom__O = (function(that, bf) {
  if ((((bf === ($m_sci_IndexedSeq$(), $m_sc_IndexedSeq$().ReusableCBF$6)) || (bf === $m_sci_Seq$().ReusableCBFInstance$2)) || (bf === $m_sc_Seq$().ReusableCBFInstance$2))) {
    if (that.isEmpty__Z()) {
      return this
    } else {
      var again = ((!that.isTraversableAgain__Z()) ? that.toVector__sci_Vector() : that.seq__sc_TraversableOnce());
      var x1 = again.size__I();
      switch (x1) {
        default: {
          if (((x1 <= 2) || (x1 < (this.length__I() >> 5)))) {
            var v = new $c_sr_ObjectRef().init___O(this);
            again.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, v$1) {
              return (function(x$2) {
                v$1.elem$1 = $as_sci_Vector($as_sci_Vector(v$1.elem$1).$$colon$plus__O__scg_CanBuildFrom__O(x$2, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)))
              })
            })(this, v)));
            return $as_sci_Vector(v.elem$1)
          } else if (((this.length__I() < (x1 >> 5)) && $is_sci_Vector(again))) {
            var v$2 = $as_sci_Vector(again);
            var ri = new $c_sci_Vector$$anon$1().init___sci_Vector(this);
            while (ri.hasNext__Z()) {
              var x$1 = ri.next__O();
              v$2 = $as_sci_Vector(v$2.$$plus$colon__O__scg_CanBuildFrom__O(x$1, ($m_sci_Vector$(), $m_sc_IndexedSeq$().ReusableCBF$6)))
            };
            return v$2
          } else {
            return $s_sc_TraversableLike$class__$$plus$plus__sc_TraversableLike__sc_GenTraversableOnce__scg_CanBuildFrom__O(this, again, bf)
          }
        }
      }
    }
  } else {
    return $s_sc_TraversableLike$class__$$plus$plus__sc_TraversableLike__sc_GenTraversableOnce__scg_CanBuildFrom__O(this, that.seq__sc_TraversableOnce(), bf)
  }
});
$c_sci_Vector.prototype.length__I = (function() {
  return ((this.endIndex$4 - this.startIndex$4) | 0)
});
$c_sci_Vector.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$4 = x$1
});
$c_sci_Vector.prototype.gotoFreshPosWritable__p4__I__I__I__V = (function(oldIndex, newIndex, xor) {
  if (this.dirty$4) {
    $s_sci_VectorPointer$class__gotoFreshPosWritable1__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor)
  } else {
    $s_sci_VectorPointer$class__gotoFreshPosWritable0__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor);
    this.dirty$4 = true
  }
});
$c_sci_Vector.prototype.display1__AO = (function() {
  return this.display1$4
});
$c_sci_Vector.prototype.last__O = (function() {
  if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.last")
  };
  return this.apply__I__O((((-1) + this.length__I()) | 0))
});
$c_sci_Vector.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_Vector(n)
});
$c_sci_Vector.prototype.display5__AO = (function() {
  return this.display5$4
});
$c_sci_Vector.prototype.tail__O = (function() {
  return this.tail__sci_Vector()
});
$c_sci_Vector.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.requiredDepth__p4__I__I = (function(xor) {
  if ((xor < 32)) {
    return 1
  } else if ((xor < 1024)) {
    return 2
  } else if ((xor < 32768)) {
    return 3
  } else if ((xor < 1048576)) {
    return 4
  } else if ((xor < 33554432)) {
    return 5
  } else if ((xor < 1073741824)) {
    return 6
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
});
$c_sci_Vector.prototype.iterator__sci_VectorIterator = (function() {
  var s = new $c_sci_VectorIterator().init___I__I(this.startIndex$4, this.endIndex$4);
  this.initIterator__sci_VectorIterator__V(s);
  return s
});
$c_sci_Vector.prototype.zeroLeft__p4__AO__I__V = (function(array, index) {
  var i = 0;
  while ((i < index)) {
    array.u[i] = null;
    i = ((1 + i) | 0)
  }
});
$c_sci_Vector.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Vector.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$4 = x$1
});
$c_sci_Vector.prototype.display2__AO = (function() {
  return this.display2$4
});
$c_sci_Vector.prototype.dropFront0__p4__I__sci_Vector = (function(cutIndex) {
  var blockIndex = ((-32) & cutIndex);
  var xor = (cutIndex ^ (((-1) + this.endIndex$4) | 0));
  var d = this.requiredDepth__p4__I__I(xor);
  var shift = (cutIndex & (~(((-1) + (1 << $imul(5, d))) | 0)));
  var s = new $c_sci_Vector().init___I__I__I(((cutIndex - shift) | 0), ((this.endIndex$4 - shift) | 0), ((blockIndex - shift) | 0));
  var depth = this.depth$4;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  s.dirty$4 = this.dirty$4;
  s.gotoPosWritable__p4__I__I__I__V(this.focus$4, blockIndex, (this.focus$4 ^ blockIndex));
  s.preClean__p4__I__V(d);
  s.cleanLeftEdge__p4__I__V(((cutIndex - shift) | 0));
  return s
});
$c_sci_Vector.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$4 = x$1
});
$c_sci_Vector.prototype.appendFront__O__sci_Vector = (function(value) {
  if ((this.endIndex$4 !== this.startIndex$4)) {
    var blockIndex = ((-32) & (((-1) + this.startIndex$4) | 0));
    var lo = (31 & (((-1) + this.startIndex$4) | 0));
    if ((this.startIndex$4 !== ((32 + blockIndex) | 0))) {
      var s = new $c_sci_Vector().init___I__I__I((((-1) + this.startIndex$4) | 0), this.endIndex$4, blockIndex);
      var depth = this.depth$4;
      $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
      s.dirty$4 = this.dirty$4;
      s.gotoPosWritable__p4__I__I__I__V(this.focus$4, blockIndex, (this.focus$4 ^ blockIndex));
      s.display0$4.u[lo] = value;
      return s
    } else {
      var freeSpace = (((1 << $imul(5, this.depth$4)) - this.endIndex$4) | 0);
      var shift = (freeSpace & (~(((-1) + (1 << $imul(5, (((-1) + this.depth$4) | 0)))) | 0)));
      var shiftBlocks = ((freeSpace >>> $imul(5, (((-1) + this.depth$4) | 0))) | 0);
      if ((shift !== 0)) {
        $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(this);
        if ((this.depth$4 > 1)) {
          var newBlockIndex = ((blockIndex + shift) | 0);
          var newFocus = ((this.focus$4 + shift) | 0);
          var s$2 = new $c_sci_Vector().init___I__I__I((((((-1) + this.startIndex$4) | 0) + shift) | 0), ((this.endIndex$4 + shift) | 0), newBlockIndex);
          var depth$1 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$2, this, depth$1);
          s$2.dirty$4 = this.dirty$4;
          s$2.shiftTopLevel__p4__I__I__V(0, shiftBlocks);
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$2);
          s$2.gotoFreshPosWritable__p4__I__I__I__V(newFocus, newBlockIndex, (newFocus ^ newBlockIndex));
          s$2.display0$4.u[lo] = value;
          return s$2
        } else {
          var newBlockIndex$2 = ((32 + blockIndex) | 0);
          var newFocus$2 = this.focus$4;
          var s$3 = new $c_sci_Vector().init___I__I__I((((((-1) + this.startIndex$4) | 0) + shift) | 0), ((this.endIndex$4 + shift) | 0), newBlockIndex$2);
          var depth$2 = this.depth$4;
          $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$3, this, depth$2);
          s$3.dirty$4 = this.dirty$4;
          s$3.shiftTopLevel__p4__I__I__V(0, shiftBlocks);
          s$3.gotoPosWritable__p4__I__I__I__V(newFocus$2, newBlockIndex$2, (newFocus$2 ^ newBlockIndex$2));
          s$3.display0$4.u[(((-1) + shift) | 0)] = value;
          $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$3);
          return s$3
        }
      } else if ((blockIndex < 0)) {
        var move = (((1 << $imul(5, ((1 + this.depth$4) | 0))) - (1 << $imul(5, this.depth$4))) | 0);
        var newBlockIndex$3 = ((blockIndex + move) | 0);
        var newFocus$3 = ((this.focus$4 + move) | 0);
        var s$4 = new $c_sci_Vector().init___I__I__I((((((-1) + this.startIndex$4) | 0) + move) | 0), ((this.endIndex$4 + move) | 0), newBlockIndex$3);
        var depth$3 = this.depth$4;
        $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$4, this, depth$3);
        s$4.dirty$4 = this.dirty$4;
        $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$4);
        s$4.gotoFreshPosWritable__p4__I__I__I__V(newFocus$3, newBlockIndex$3, (newFocus$3 ^ newBlockIndex$3));
        s$4.display0$4.u[lo] = value;
        $s_sci_VectorPointer$class__debug__sci_VectorPointer__V(s$4);
        return s$4
      } else {
        var newFocus$4 = this.focus$4;
        var s$5 = new $c_sci_Vector().init___I__I__I((((-1) + this.startIndex$4) | 0), this.endIndex$4, blockIndex);
        var depth$4 = this.depth$4;
        $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s$5, this, depth$4);
        s$5.dirty$4 = this.dirty$4;
        s$5.gotoFreshPosWritable__p4__I__I__I__V(newFocus$4, blockIndex, (newFocus$4 ^ blockIndex));
        s$5.display0$4.u[lo] = value;
        return s$5
      }
    }
  } else {
    var elems = $newArrayObject($d_O.getArrayOf(), [32]);
    elems.u[31] = value;
    var s$6 = new $c_sci_Vector().init___I__I__I(31, 32, 0);
    s$6.depth$4 = 1;
    s$6.display0$4 = elems;
    return s$6
  }
});
$c_sci_Vector.prototype.drop__I__sci_Vector = (function(n) {
  if ((n <= 0)) {
    return this
  } else if ((((this.startIndex$4 + n) | 0) < this.endIndex$4)) {
    return this.dropFront0__p4__I__sci_Vector(((this.startIndex$4 + n) | 0))
  } else {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  }
});
$c_sci_Vector.prototype.toCollection__O__sc_Seq = (function(repr) {
  return $as_sc_IndexedSeq(repr)
});
$c_sci_Vector.prototype.copyRight__p4__AO__I__AO = (function(array, left) {
  var a2 = $newArrayObject($d_O.getArrayOf(), [array.u["length"]]);
  var length = ((a2.u["length"] - left) | 0);
  $systemArraycopy(array, left, a2, left, length);
  return a2
});
$c_sci_Vector.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$4 = x$1
});
function $is_sci_Vector(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Vector)))
}
function $as_sci_Vector(obj) {
  return (($is_sci_Vector(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Vector"))
}
function $isArrayOf_sci_Vector(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Vector)))
}
function $asArrayOf_sci_Vector(obj, depth) {
  return (($isArrayOf_sci_Vector(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Vector;", depth))
}
var $d_sci_Vector = new $TypeData().initClass({
  sci_Vector: 0
}, false, "scala.collection.immutable.Vector", {
  sci_Vector: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_VectorPointer: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_Vector.prototype.$classData = $d_sci_Vector;
/** @constructor */
function $c_sci_WrappedString() {
  $c_sc_AbstractSeq.call(this);
  this.self$4 = null
}
$c_sci_WrappedString.prototype = new $h_sc_AbstractSeq();
$c_sci_WrappedString.prototype.constructor = $c_sci_WrappedString;
/** @constructor */
function $h_sci_WrappedString() {
  /*<skip>*/
}
$h_sci_WrappedString.prototype = $c_sci_WrappedString.prototype;
$c_sci_WrappedString.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_WrappedString.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.apply__I__O = (function(idx) {
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_WrappedString.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz["charCodeAt"](n)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_WrappedString.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_WrappedString.prototype.toString__T = (function() {
  return this.self$4
});
$c_sci_WrappedString.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_IndexedSeq$()
});
$c_sci_WrappedString.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_WrappedString.prototype.slice__I__I__O = (function(from, until) {
  return this.slice__I__I__sci_WrappedString(from, until)
});
$c_sci_WrappedString.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqOptimized$$anon$1().init___sc_IndexedSeqOptimized(this)
});
$c_sci_WrappedString.prototype.reverse__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__reverse__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.iterator__sc_Iterator = (function() {
  var thiz = this.self$4;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz["length"]))
});
$c_sci_WrappedString.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_IndexedSeqOptimized$class__find__sc_IndexedSeqOptimized__F1__s_Option(this, p)
});
$c_sci_WrappedString.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.length__I = (function() {
  var thiz = this.self$4;
  return $uI(thiz["length"])
});
$c_sci_WrappedString.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  return $s_sc_IndexedSeqOptimized$class__zipWithIndex__sc_IndexedSeqOptimized__scg_CanBuildFrom__O(this, bf)
});
$c_sci_WrappedString.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I(this, p, end)
});
$c_sci_WrappedString.prototype.last__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.drop__I__O = (function(n) {
  var thiz = this.self$4;
  var until = $uI(thiz["length"]);
  return this.slice__I__I__sci_WrappedString(n, until)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_WrappedString.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_WrappedString.prototype.init___T = (function(self) {
  this.self$4 = self;
  return this
});
$c_sci_WrappedString.prototype.slice__I__I__sci_WrappedString = (function(from, until) {
  var start = ((from < 0) ? 0 : from);
  if ((until <= start)) {
    var jsx$1 = true
  } else {
    var thiz = this.self$4;
    var jsx$1 = (start >= $uI(thiz["length"]))
  };
  if (jsx$1) {
    return new $c_sci_WrappedString().init___T("")
  };
  var thiz$1 = this.self$4;
  if ((until > $uI(thiz$1["length"]))) {
    var thiz$2 = this.self$4;
    var end = $uI(thiz$2["length"])
  } else {
    var end = until
  };
  var thiz$3 = $m_s_Predef$().unwrapString__sci_WrappedString__T(this);
  return new $c_sci_WrappedString().init___T($as_T(thiz$3["substring"](start, end)))
});
$c_sci_WrappedString.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_sci_WrappedString(repr);
  return repr$1
});
$c_sci_WrappedString.prototype.newBuilder__scm_Builder = (function() {
  return $m_sci_WrappedString$().newBuilder__scm_Builder()
});
function $is_sci_WrappedString(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_WrappedString)))
}
function $as_sci_WrappedString(obj) {
  return (($is_sci_WrappedString(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.WrappedString"))
}
function $isArrayOf_sci_WrappedString(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_WrappedString)))
}
function $asArrayOf_sci_WrappedString(obj, depth) {
  return (($isArrayOf_sci_WrappedString(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.WrappedString;", depth))
}
var $d_sci_WrappedString = new $TypeData().initClass({
  sci_WrappedString: 0
}, false, "scala.collection.immutable.WrappedString", {
  sci_WrappedString: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_WrappedString.prototype.$classData = $d_sci_WrappedString;
/** @constructor */
function $c_sci_$colon$colon() {
  $c_sci_List.call(this);
  this.head$5 = null;
  this.tl$5 = null
}
$c_sci_$colon$colon.prototype = new $h_sci_List();
$c_sci_$colon$colon.prototype.constructor = $c_sci_$colon$colon;
/** @constructor */
function $h_sci_$colon$colon() {
  /*<skip>*/
}
$h_sci_$colon$colon.prototype = $c_sci_$colon$colon.prototype;
$c_sci_$colon$colon.prototype.productPrefix__T = (function() {
  return "::"
});
$c_sci_$colon$colon.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_$colon$colon.prototype.productArity__I = (function() {
  return 2
});
$c_sci_$colon$colon.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_$colon$colon.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.head$5;
      break
    }
    case 1: {
      return this.tl$5;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sci_$colon$colon.prototype.tail__O = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.init___O__sci_List = (function(head, tl) {
  this.head$5 = head;
  this.tl$5 = tl;
  return this
});
$c_sci_$colon$colon.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_$colon$colon = new $TypeData().initClass({
  sci_$colon$colon: 0
}, false, "scala.collection.immutable.$colon$colon", {
  sci_$colon$colon: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_$colon$colon.prototype.$classData = $d_sci_$colon$colon;
/** @constructor */
function $c_sci_Nil$() {
  $c_sci_List.call(this)
}
$c_sci_Nil$.prototype = new $h_sci_List();
$c_sci_Nil$.prototype.constructor = $c_sci_Nil$;
/** @constructor */
function $h_sci_Nil$() {
  /*<skip>*/
}
$h_sci_Nil$.prototype = $c_sci_Nil$.prototype;
$c_sci_Nil$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Nil$.prototype.productPrefix__T = (function() {
  return "Nil"
});
$c_sci_Nil$.prototype.productArity__I = (function() {
  return 0
});
$c_sci_Nil$.prototype.equals__O__Z = (function(that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return x2.isEmpty__Z()
  } else {
    return false
  }
});
$c_sci_Nil$.prototype.tail__sci_List = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty list")
});
$c_sci_Nil$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Nil$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_sci_Nil$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty list")
});
$c_sci_Nil$.prototype.tail__O = (function() {
  return this.tail__sci_List()
});
$c_sci_Nil$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_Nil$ = new $TypeData().initClass({
  sci_Nil$: 0
}, false, "scala.collection.immutable.Nil$", {
  sci_Nil$: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_Nil$.prototype.$classData = $d_sci_Nil$;
var $n_sci_Nil$ = (void 0);
function $m_sci_Nil$() {
  if ((!$n_sci_Nil$)) {
    $n_sci_Nil$ = new $c_sci_Nil$().init___()
  };
  return $n_sci_Nil$
}
/** @constructor */
function $c_scm_AbstractSet() {
  $c_scm_AbstractIterable.call(this)
}
$c_scm_AbstractSet.prototype = new $h_scm_AbstractIterable();
$c_scm_AbstractSet.prototype.constructor = $c_scm_AbstractSet;
/** @constructor */
function $h_scm_AbstractSet() {
  /*<skip>*/
}
$h_scm_AbstractSet.prototype = $c_scm_AbstractSet.prototype;
$c_scm_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_scm_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_scm_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_scm_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  var this$1 = new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this);
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
});
$c_scm_AbstractSet.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_scm_AbstractSet.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_AbstractSet.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  return $s_sc_TraversableLike$class__map__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
});
$c_scm_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
$c_scm_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_HashSet().init___()
});
$c_scm_AbstractSet.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
/** @constructor */
function $c_scm_LinkedList() {
  $c_scm_AbstractSeq.call(this);
  this.elem$5 = null;
  this.next$5 = null
}
$c_scm_LinkedList.prototype = new $h_scm_AbstractSeq();
$c_scm_LinkedList.prototype.constructor = $c_scm_LinkedList;
/** @constructor */
function $h_scm_LinkedList() {
  /*<skip>*/
}
$h_scm_LinkedList.prototype = $c_scm_LinkedList.prototype;
$c_scm_LinkedList.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_LinkedList.prototype.init___ = (function() {
  this.next$5 = this;
  return this
});
$c_scm_LinkedList.prototype.head__O = (function() {
  return $s_scm_LinkedListLike$class__head__scm_LinkedListLike__O(this)
});
$c_scm_LinkedList.prototype.apply__I__O = (function(n) {
  return $s_scm_LinkedListLike$class__apply__scm_LinkedListLike__I__O(this, n)
});
$c_scm_LinkedList.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_scm_LinkedListLike$class__apply__scm_LinkedListLike__I__O(this, n)
});
$c_scm_LinkedList.prototype.isEmpty__Z = (function() {
  return $s_scm_LinkedListLike$class__isEmpty__scm_LinkedListLike__Z(this)
});
$c_scm_LinkedList.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_LinkedList.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_LinkedList$()
});
$c_scm_LinkedList.prototype.foreach__F1__V = (function(f) {
  $s_scm_LinkedListLike$class__foreach__scm_LinkedListLike__F1__V(this, f)
});
$c_scm_LinkedList.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_LinkedListLike$$anon$1().init___scm_LinkedListLike(this)
});
$c_scm_LinkedList.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_LinkedList.prototype.length__I = (function() {
  return $s_scm_LinkedListLike$class__length0__p0__scm_LinkedListLike__scm_Seq__I__I(this, this, 0)
});
$c_scm_LinkedList.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_LinkedList.prototype.drop__I__O = (function(n) {
  return $s_scm_LinkedListLike$class__drop__scm_LinkedListLike__I__scm_Seq(this, n)
});
$c_scm_LinkedList.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_LinkedList.prototype.tail__O = (function() {
  return $s_scm_LinkedListLike$class__tail__scm_LinkedListLike__scm_Seq(this)
});
$c_scm_LinkedList.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_LinkedList.prototype.init___O__scm_LinkedList = (function(elem, next) {
  $c_scm_LinkedList.prototype.init___.call(this);
  if ((next !== null)) {
    this.elem$5 = elem;
    this.next$5 = next
  };
  return this
});
function $is_scm_LinkedList(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_LinkedList)))
}
function $as_scm_LinkedList(obj) {
  return (($is_scm_LinkedList(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.LinkedList"))
}
function $isArrayOf_scm_LinkedList(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_LinkedList)))
}
function $asArrayOf_scm_LinkedList(obj, depth) {
  return (($isArrayOf_scm_LinkedList(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.LinkedList;", depth))
}
var $d_scm_LinkedList = new $TypeData().initClass({
  scm_LinkedList: 0
}, false, "scala.collection.mutable.LinkedList", {
  scm_LinkedList: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_LinearSeq: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  scm_LinkedListLike: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_LinkedList.prototype.$classData = $d_scm_LinkedList;
/** @constructor */
function $c_scm_AbstractBuffer() {
  $c_scm_AbstractSeq.call(this)
}
$c_scm_AbstractBuffer.prototype = new $h_scm_AbstractSeq();
$c_scm_AbstractBuffer.prototype.constructor = $c_scm_AbstractBuffer;
/** @constructor */
function $h_scm_AbstractBuffer() {
  /*<skip>*/
}
$h_scm_AbstractBuffer.prototype = $c_scm_AbstractBuffer.prototype;
$c_scm_AbstractBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
/** @constructor */
function $c_scm_MutableList() {
  $c_scm_AbstractSeq.call(this);
  this.first0$5 = null;
  this.last0$5 = null;
  this.len$5 = 0
}
$c_scm_MutableList.prototype = new $h_scm_AbstractSeq();
$c_scm_MutableList.prototype.constructor = $c_scm_MutableList;
/** @constructor */
function $h_scm_MutableList() {
  /*<skip>*/
}
$h_scm_MutableList.prototype = $c_scm_MutableList.prototype;
$c_scm_MutableList.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_MutableList.prototype.init___ = (function() {
  this.first0$5 = new $c_scm_LinkedList().init___();
  this.last0$5 = this.first0$5;
  this.len$5 = 0;
  return this
});
$c_scm_MutableList.prototype.head__O = (function() {
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this)) {
    var this$1 = this.first0$5;
    return $s_scm_LinkedListLike$class__head__scm_LinkedListLike__O(this$1)
  } else {
    throw new $c_ju_NoSuchElementException().init___()
  }
});
$c_scm_MutableList.prototype.apply__I__O = (function(n) {
  var this$1 = this.first0$5;
  return $s_scm_LinkedListLike$class__apply__scm_LinkedListLike__I__O(this$1, n)
});
$c_scm_MutableList.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_scm_MutableList.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  var this$1 = this.first0$5;
  return $s_scm_LinkedListLike$class__apply__scm_LinkedListLike__I__O(this$1, n)
});
$c_scm_MutableList.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_MutableList.prototype.isEmpty__Z = (function() {
  return (this.len$5 === 0)
});
$c_scm_MutableList.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_MutableList.prototype.prependElem__O__V = (function(elem) {
  this.first0$5 = new $c_scm_LinkedList().init___O__scm_LinkedList(elem, this.first0$5);
  if ((this.len$5 === 0)) {
    this.last0$5 = this.first0$5
  };
  this.len$5 = ((1 + this.len$5) | 0)
});
$c_scm_MutableList.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return $s_sc_LinearSeqOptimized$class__drop__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized(this, n)
});
$c_scm_MutableList.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_MutableList(elem)
});
$c_scm_MutableList.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_MutableList$()
});
$c_scm_MutableList.prototype.foreach__F1__V = (function(f) {
  $s_sc_LinearSeqOptimized$class__foreach__sc_LinearSeqOptimized__F1__V(this, f)
});
$c_scm_MutableList.prototype.tailImpl__scm_MutableList__V = (function(tl) {
  var requirement = $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this);
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T(("requirement failed: " + "tail of empty list"))
  };
  var this$2 = this.first0$5;
  tl.first0$5 = $as_scm_LinkedList($s_scm_LinkedListLike$class__tail__scm_LinkedListLike__scm_Seq(this$2));
  tl.len$5 = (((-1) + this.len$5) | 0);
  tl.last0$5 = ((tl.len$5 === 0) ? tl.first0$5 : this.last0$5)
});
$c_scm_MutableList.prototype.result__O = (function() {
  return this
});
$c_scm_MutableList.prototype.iterator__sc_Iterator = (function() {
  return (this.isEmpty__Z() ? $m_sc_Iterator$().empty$1 : new $c_scm_MutableList$$anon$1().init___scm_MutableList(this))
});
$c_scm_MutableList.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_MutableList.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_MutableList.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_LinearSeqOptimized$class__find__sc_LinearSeqOptimized__F1__s_Option(this, p)
});
$c_scm_MutableList.prototype.length__I = (function() {
  return this.len$5
});
$c_scm_MutableList.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_MutableList.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_LinearSeqOptimized$class__lastIndexWhere__sc_LinearSeqOptimized__F1__I__I(this, p, end)
});
$c_scm_MutableList.prototype.last__O = (function() {
  if (this.isEmpty__Z()) {
    throw new $c_ju_NoSuchElementException().init___T("MutableList.empty.last")
  };
  return this.last0$5.elem$5
});
$c_scm_MutableList.prototype.drop__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__drop__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized(this, n)
});
$c_scm_MutableList.prototype.tail__O = (function() {
  return this.tail__scm_MutableList()
});
$c_scm_MutableList.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_MutableList.prototype.appendElem__O__V = (function(elem) {
  if ((this.len$5 === 0)) {
    this.prependElem__O__V(elem)
  } else {
    this.last0$5.next$5 = new $c_scm_LinkedList().init___();
    this.last0$5 = $as_scm_LinkedList(this.last0$5.next$5);
    this.last0$5.elem$5 = elem;
    this.last0$5.next$5 = new $c_scm_LinkedList().init___();
    this.len$5 = ((1 + this.len$5) | 0)
  }
});
$c_scm_MutableList.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_MutableList(elem)
});
$c_scm_MutableList.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_MutableList.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_MutableList.prototype.$$plus$eq__O__scm_MutableList = (function(elem) {
  this.appendElem__O__V(elem);
  return this
});
$c_scm_MutableList.prototype.tail__scm_MutableList = (function() {
  var tl = new $c_scm_MutableList().init___();
  this.tailImpl__scm_MutableList__V(tl);
  return tl
});
$c_scm_MutableList.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_sc_LinearSeqLike(repr);
  return $as_sc_LinearSeq(repr$1)
});
$c_scm_MutableList.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_MutableList().init___()
});
$c_scm_MutableList.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
function $is_scm_MutableList(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_MutableList)))
}
function $as_scm_MutableList(obj) {
  return (($is_scm_MutableList(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.MutableList"))
}
function $isArrayOf_scm_MutableList(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_MutableList)))
}
function $asArrayOf_scm_MutableList(obj, depth) {
  return (($isArrayOf_scm_MutableList(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.MutableList;", depth))
}
var $d_scm_MutableList = new $TypeData().initClass({
  scm_MutableList: 0
}, false, "scala.collection.mutable.MutableList", {
  scm_MutableList: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_LinearSeq: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_MutableList.prototype.$classData = $d_scm_MutableList;
/** @constructor */
function $c_scm_Queue() {
  $c_scm_MutableList.call(this)
}
$c_scm_Queue.prototype = new $h_scm_MutableList();
$c_scm_Queue.prototype.constructor = $c_scm_Queue;
/** @constructor */
function $h_scm_Queue() {
  /*<skip>*/
}
$h_scm_Queue.prototype = $c_scm_Queue.prototype;
$c_scm_Queue.prototype.init___scm_LinkedList__scm_LinkedList__I = (function(fst, lst, lng) {
  $c_scm_Queue.prototype.init___.call(this);
  this.first0$5 = fst;
  this.last0$5 = lst;
  this.len$5 = lng;
  return this
});
$c_scm_Queue.prototype.dequeue__O = (function() {
  if (this.isEmpty__Z()) {
    throw new $c_ju_NoSuchElementException().init___T("queue empty")
  } else {
    var res = this.first0$5.elem$5;
    this.first0$5 = $as_scm_LinkedList(this.first0$5.next$5);
    this.decrementLength__p6__V();
    return res
  }
});
$c_scm_Queue.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_Queue.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_Queue$()
});
$c_scm_Queue.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_Queue.prototype.decrementLength__p6__V = (function() {
  this.len$5 = (((-1) + this.len$5) | 0);
  if ((this.len$5 === 0)) {
    this.last0$5 = this.first0$5
  }
});
$c_scm_Queue.prototype.drop__I__O = (function(n) {
  return $s_sc_LinearSeqOptimized$class__drop__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized(this, n)
});
$c_scm_Queue.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_Queue.prototype.tail__O = (function() {
  return this.tail__scm_Queue()
});
$c_scm_Queue.prototype.tail__scm_Queue = (function() {
  var tl = new $c_scm_Queue().init___();
  this.tailImpl__scm_MutableList__V(tl);
  return tl
});
$c_scm_Queue.prototype.tail__scm_MutableList = (function() {
  return this.tail__scm_Queue()
});
$c_scm_Queue.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_sc_LinearSeqLike(repr);
  return $as_sc_LinearSeq(repr$1)
});
$c_scm_Queue.prototype.newBuilder__scm_Builder = (function() {
  return $m_scm_Queue$().newBuilder__scm_Builder()
});
var $d_scm_Queue = new $TypeData().initClass({
  scm_Queue: 0
}, false, "scala.collection.mutable.Queue", {
  scm_Queue: 1,
  scm_MutableList: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_LinearSeq: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_Queue.prototype.$classData = $d_scm_Queue;
/** @constructor */
function $c_scm_HashSet() {
  $c_scm_AbstractSet.call(this);
  this.$$undloadFactor$5 = 0;
  this.table$5 = null;
  this.tableSize$5 = 0;
  this.threshold$5 = 0;
  this.sizemap$5 = null;
  this.seedvalue$5 = 0
}
$c_scm_HashSet.prototype = new $h_scm_AbstractSet();
$c_scm_HashSet.prototype.constructor = $c_scm_HashSet;
/** @constructor */
function $h_scm_HashSet() {
  /*<skip>*/
}
$h_scm_HashSet.prototype = $c_scm_HashSet.prototype;
$c_scm_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_HashSet.prototype.init___ = (function() {
  $c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents.call(this, null);
  return this
});
$c_scm_HashSet.prototype.apply__O__O = (function(v1) {
  return $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this, v1)
});
$c_scm_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_HashSet$()
});
$c_scm_HashSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  var len = this.table$5.u["length"];
  while ((i < len)) {
    var curEntry = this.table$5.u[i];
    if ((curEntry !== null)) {
      f.apply__O__O($s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this, curEntry))
    };
    i = ((1 + i) | 0)
  }
});
$c_scm_HashSet.prototype.size__I = (function() {
  return this.tableSize$5
});
$c_scm_HashSet.prototype.result__O = (function() {
  return this
});
$c_scm_HashSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this)
});
$c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents = (function(contents) {
  $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V(this);
  $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V(this, contents);
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  var this$1 = new $c_scm_HashSet().init___();
  var this$2 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$1, this));
  return this$2.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_HashSet = (function(elem) {
  $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this, elem);
  return this
});
function $is_scm_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_HashSet)))
}
function $as_scm_HashSet(obj) {
  return (($is_scm_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.HashSet"))
}
function $isArrayOf_scm_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_HashSet)))
}
function $asArrayOf_scm_HashSet(obj, depth) {
  return (($isArrayOf_scm_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.HashSet;", depth))
}
var $d_scm_HashSet = new $TypeData().initClass({
  scm_HashSet: 0
}, false, "scala.collection.mutable.HashSet", {
  scm_HashSet: 1,
  scm_AbstractSet: 1,
  scm_AbstractIterable: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_Set: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  scm_SetLike: 1,
  sc_script_Scriptable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_FlatHashTable: 1,
  scm_FlatHashTable$HashUtils: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet.prototype.$classData = $d_scm_HashSet;
/** @constructor */
function $c_scm_ListBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.scala$collection$mutable$ListBuffer$$start$6 = null;
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
}
$c_scm_ListBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ListBuffer.prototype.constructor = $c_scm_ListBuffer;
/** @constructor */
function $h_scm_ListBuffer() {
  /*<skip>*/
}
$h_scm_ListBuffer.prototype = $c_scm_ListBuffer.prototype;
$c_scm_ListBuffer.prototype.copy__p6__V = (function() {
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    return (void 0)
  };
  var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
  var this$1 = this.last0$6;
  var limit = this$1.tl$5;
  this.clear__V();
  while ((cursor !== limit)) {
    this.$$plus$eq__O__scm_ListBuffer(cursor.head__O());
    cursor = $as_sci_List(cursor.tail__O())
  }
});
$c_scm_ListBuffer.prototype.init___ = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.exported$6 = false;
  this.len$6 = 0;
  return this
});
$c_scm_ListBuffer.prototype.head__O = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.head__O()
});
$c_scm_ListBuffer.prototype.apply__I__O = (function(n) {
  if (((n < 0) || (n >= this.len$6))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  } else {
    var this$2 = this.scala$collection$mutable$ListBuffer$$start$6;
    return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this$2, n)
  }
});
$c_scm_ListBuffer.prototype.lengthCompare__I__I = (function(len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this$1, len)
});
$c_scm_ListBuffer.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_scm_ListBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this$1, that)
});
$c_scm_ListBuffer.prototype.isEmpty__Z = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()
});
$c_scm_ListBuffer.prototype.toList__sci_List = (function() {
  this.exported$6 = (!this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z());
  return this.scala$collection$mutable$ListBuffer$$start$6
});
$c_scm_ListBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ListBuffer.prototype.equals__O__Z = (function(that) {
  if ($is_scm_ListBuffer(that)) {
    var x2 = $as_scm_ListBuffer(that);
    return this.scala$collection$mutable$ListBuffer$$start$6.equals__O__Z(x2.scala$collection$mutable$ListBuffer$$start$6)
  } else {
    return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
  }
});
$c_scm_ListBuffer.prototype.mkString__T__T = (function(sep) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, "", sep, "")
});
$c_scm_ListBuffer.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ListBuffer$()
});
$c_scm_ListBuffer.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    these = $as_sci_List(these.tail__O())
  }
});
$c_scm_ListBuffer.prototype.reverseIterator__sc_Iterator = (function() {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_SeqLike$class__reverseIterator__sc_SeqLike__sc_Iterator(this$1)
});
$c_scm_ListBuffer.prototype.size__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.result__O = (function() {
  return this.toList__sci_List()
});
$c_scm_ListBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_ListBuffer$$anon$1().init___scm_ListBuffer(this)
});
$c_scm_ListBuffer.prototype.find__F1__s_Option = (function(p) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__find__sc_LinearSeqOptimized__F1__s_Option(this$1, p)
});
$c_scm_ListBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ListBuffer.prototype.length__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ListBuffer.prototype.toStream__sci_Stream = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream()
});
$c_scm_ListBuffer.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__lastIndexWhere__sc_LinearSeqOptimized__F1__I__I(this$1, p, end)
});
$c_scm_ListBuffer.prototype.last__O = (function() {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$1)
});
$c_scm_ListBuffer.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this$1, b, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_ListBuffer = (function(x) {
  if (this.exported$6) {
    this.copy__p6__V()
  };
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    this.scala$collection$mutable$ListBuffer$$start$6 = this.last0$6
  } else {
    var last1 = this.last0$6;
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    last1.tl$5 = this.last0$6
  };
  this.len$6 = ((1 + this.len$6) | 0);
  return this
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_ListBuffer.prototype.lastIndexWhere__F1__I = (function(p) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_GenSeqLike$class__lastIndexWhere__sc_GenSeqLike__F1__I(this$1, p)
});
$c_scm_ListBuffer.prototype.clear__V = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
});
$c_scm_ListBuffer.prototype.nonEmpty__Z = (function() {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer = (function(xs) {
  _$plus$plus$eq: while (true) {
    var x1 = xs;
    if ((x1 !== null)) {
      if ((x1 === this)) {
        var n = this.len$6;
        xs = $as_sc_TraversableOnce($s_sc_IterableLike$class__take__sc_IterableLike__I__O(this, n));
        continue _$plus$plus$eq
      }
    };
    return $as_scm_ListBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(xs)
});
$c_scm_ListBuffer.prototype.stringPrefix__T = (function() {
  return "ListBuffer"
});
function $is_scm_ListBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ListBuffer)))
}
function $as_scm_ListBuffer(obj) {
  return (($is_scm_ListBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ListBuffer"))
}
function $isArrayOf_scm_ListBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ListBuffer)))
}
function $asArrayOf_scm_ListBuffer(obj, depth) {
  return (($isArrayOf_scm_ListBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ListBuffer;", depth))
}
var $d_scm_ListBuffer = new $TypeData().initClass({
  scm_ListBuffer: 0
}, false, "scala.collection.mutable.ListBuffer", {
  scm_ListBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_Builder: 1,
  scg_SeqForwarder: 1,
  scg_IterableForwarder: 1,
  scg_TraversableForwarder: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer.prototype.$classData = $d_scm_ListBuffer;
/** @constructor */
function $c_scm_StringBuilder() {
  $c_scm_AbstractSeq.call(this);
  this.underlying$5 = null
}
$c_scm_StringBuilder.prototype = new $h_scm_AbstractSeq();
$c_scm_StringBuilder.prototype.constructor = $c_scm_StringBuilder;
/** @constructor */
function $h_scm_StringBuilder() {
  /*<skip>*/
}
$h_scm_StringBuilder.prototype = $c_scm_StringBuilder.prototype;
$c_scm_StringBuilder.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___ = (function() {
  $c_scm_StringBuilder.prototype.init___I__T.call(this, 16, "");
  return this
});
$c_scm_StringBuilder.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_StringBuilder.prototype.$$plus$eq__C__scm_StringBuilder = (function(x) {
  this.append__C__scm_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.apply__I__O = (function(idx) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz["charCodeAt"](idx)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_StringBuilder.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz["charCodeAt"](index)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_StringBuilder.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $as_T(thiz["substring"](start, end))
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_IndexedSeq$()
});
$c_scm_StringBuilder.prototype.toString__T = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_StringBuilder.prototype.slice__I__I__O = (function(from, until) {
  return $s_sci_StringLike$class__slice__sci_StringLike__I__I__O(this, from, until)
});
$c_scm_StringBuilder.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqOptimized$$anon$1().init___sc_IndexedSeqOptimized(this)
});
$c_scm_StringBuilder.prototype.reverse__O = (function() {
  return this.reverse__scm_StringBuilder()
});
$c_scm_StringBuilder.prototype.result__O = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.append__T__scm_StringBuilder = (function(s) {
  this.underlying$5.append__T__jl_StringBuilder(s);
  return this
});
$c_scm_StringBuilder.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz["length"]))
});
$c_scm_StringBuilder.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_IndexedSeqOptimized$class__find__sc_IndexedSeqOptimized__F1__s_Option(this, p)
});
$c_scm_StringBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_StringBuilder.prototype.init___I__T = (function(initCapacity, initValue) {
  $c_scm_StringBuilder.prototype.init___jl_StringBuilder.call(this, new $c_jl_StringBuilder().init___I((($uI(initValue["length"]) + initCapacity) | 0)).append__T__jl_StringBuilder(initValue));
  return this
});
$c_scm_StringBuilder.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  return $s_sc_IndexedSeqOptimized$class__zipWithIndex__sc_IndexedSeqOptimized__scg_CanBuildFrom__O(this, bf)
});
$c_scm_StringBuilder.prototype.length__I = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $uI(thiz["length"])
});
$c_scm_StringBuilder.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I(this, p, end)
});
$c_scm_StringBuilder.prototype.last__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this)
});
$c_scm_StringBuilder.prototype.drop__I__O = (function(n) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var until = $uI(thiz["length"]);
  return $s_sci_StringLike$class__slice__sci_StringLike__I__I__O(this, n, until)
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_StringBuilder.prototype.init___jl_StringBuilder = (function(underlying) {
  this.underlying$5 = underlying;
  return this
});
$c_scm_StringBuilder.prototype.append__O__scm_StringBuilder = (function(x) {
  this.underlying$5.append__T__jl_StringBuilder($m_sjsr_RuntimeString$().valueOf__O__T(x));
  return this
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_scm_StringBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_StringBuilder.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_StringBuilder.prototype.reverse__scm_StringBuilder = (function() {
  return new $c_scm_StringBuilder().init___jl_StringBuilder(new $c_jl_StringBuilder().init___jl_CharSequence(this.underlying$5).reverse__jl_StringBuilder())
});
$c_scm_StringBuilder.prototype.append__C__scm_StringBuilder = (function(x) {
  this.underlying$5.append__C__jl_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.toCollection__O__sc_Seq = (function(repr) {
  var repr$1 = $as_scm_StringBuilder(repr);
  return repr$1
});
$c_scm_StringBuilder.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_StringBuilder().init___())
});
$c_scm_StringBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
function $is_scm_StringBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_StringBuilder)))
}
function $as_scm_StringBuilder(obj) {
  return (($is_scm_StringBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.StringBuilder"))
}
function $isArrayOf_scm_StringBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_StringBuilder)))
}
function $asArrayOf_scm_StringBuilder(obj, depth) {
  return (($isArrayOf_scm_StringBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.StringBuilder;", depth))
}
var $d_scm_StringBuilder = new $TypeData().initClass({
  scm_StringBuilder: 0
}, false, "scala.collection.mutable.StringBuilder", {
  scm_StringBuilder: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  jl_CharSequence: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder.prototype.$classData = $d_scm_StringBuilder;
/** @constructor */
function $c_sjs_js_WrappedArray() {
  $c_scm_AbstractBuffer.call(this);
  this.array$6 = null
}
$c_sjs_js_WrappedArray.prototype = new $h_scm_AbstractBuffer();
$c_sjs_js_WrappedArray.prototype.constructor = $c_sjs_js_WrappedArray;
/** @constructor */
function $h_sjs_js_WrappedArray() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray.prototype = $c_sjs_js_WrappedArray.prototype;
$c_sjs_js_WrappedArray.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.init___ = (function() {
  $c_sjs_js_WrappedArray.prototype.init___sjs_js_Array.call(this, []);
  return this
});
$c_sjs_js_WrappedArray.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.apply__I__O = (function(index) {
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sjs_js_WrappedArray.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sjs_js_WrappedArray.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  this.array$6["push"](elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sjs_js_WrappedArray$()
});
$c_sjs_js_WrappedArray.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sjs_js_WrappedArray.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_sjs_js_WrappedArray.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqOptimized$$anon$1().init___sc_IndexedSeqOptimized(this)
});
$c_sjs_js_WrappedArray.prototype.reverse__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__reverse__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.result__O = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.array$6["length"]))
});
$c_sjs_js_WrappedArray.prototype.seq__scm_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sjs_js_WrappedArray.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_IndexedSeqOptimized$class__find__sc_IndexedSeqOptimized__F1__s_Option(this, p)
});
$c_sjs_js_WrappedArray.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  return $s_sc_IndexedSeqOptimized$class__zipWithIndex__sc_IndexedSeqOptimized__scg_CanBuildFrom__O(this, bf)
});
$c_sjs_js_WrappedArray.prototype.length__I = (function() {
  return $uI(this.array$6["length"])
});
$c_sjs_js_WrappedArray.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I(this, p, end)
});
$c_sjs_js_WrappedArray.prototype.last__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.drop__I__O = (function(n) {
  var until = $uI(this.array$6["length"]);
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_sjs_js_WrappedArray.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  this.array$6["push"](elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_WrappedArray.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sjs_js_WrappedArray.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sjs_js_WrappedArray.prototype.init___sjs_js_Array = (function(array) {
  this.array$6 = array;
  return this
});
$c_sjs_js_WrappedArray.prototype.toCollection__O__sc_Seq = (function(repr) {
  return $as_scm_IndexedSeq(repr)
});
$c_sjs_js_WrappedArray.prototype.stringPrefix__T = (function() {
  return "WrappedArray"
});
var $d_sjs_js_WrappedArray = new $TypeData().initClass({
  sjs_js_WrappedArray: 0
}, false, "scala.scalajs.js.WrappedArray", {
  sjs_js_WrappedArray: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1
});
$c_sjs_js_WrappedArray.prototype.$classData = $d_sjs_js_WrappedArray;
/** @constructor */
function $c_scm_ArrayBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.initialSize$6 = 0;
  this.array$6 = null;
  this.size0$6 = 0
}
$c_scm_ArrayBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ArrayBuffer.prototype.constructor = $c_scm_ArrayBuffer;
/** @constructor */
function $h_scm_ArrayBuffer() {
  /*<skip>*/
}
$h_scm_ArrayBuffer.prototype = $c_scm_ArrayBuffer.prototype;
$c_scm_ArrayBuffer.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_ArrayBuffer = (function(elem) {
  var n = ((1 + this.size0$6) | 0);
  $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n);
  this.array$6.u[this.size0$6] = elem;
  this.size0$6 = ((1 + this.size0$6) | 0);
  return this
});
$c_scm_ArrayBuffer.prototype.init___ = (function() {
  $c_scm_ArrayBuffer.prototype.init___I.call(this, 16);
  return this
});
$c_scm_ArrayBuffer.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.apply__I__O = (function(idx) {
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.remove__I__I__V = (function(n, count) {
  var requirement = (count >= 0);
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T(("requirement failed: " + "removing negative number of elements"))
  };
  if (((n < 0) || (n > ((this.size0$6 - count) | 0)))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  var m = ((n + count) | 0);
  var len = ((this.size0$6 - ((n + count) | 0)) | 0);
  var src = this.array$6;
  var dest = this.array$6;
  $systemArraycopy(src, m, dest, n, len);
  var sz = ((this.size0$6 - count) | 0);
  $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V(this, sz)
});
$c_scm_ArrayBuffer.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_ArrayBuffer.prototype.apply__O__O = (function(v1) {
  var idx = $uI(v1);
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayBuffer.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ArrayBuffer$()
});
$c_scm_ArrayBuffer.prototype.foreach__F1__V = (function(f) {
  $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V(this, f)
});
$c_scm_ArrayBuffer.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_scm_ArrayBuffer.prototype.reverseIterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqOptimized$$anon$1().init___sc_IndexedSeqOptimized(this)
});
$c_scm_ArrayBuffer.prototype.reverse__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__reverse__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.result__O = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.size0$6)
});
$c_scm_ArrayBuffer.prototype.find__F1__s_Option = (function(p) {
  return $s_sc_IndexedSeqOptimized$class__find__sc_IndexedSeqOptimized__F1__s_Option(this, p)
});
$c_scm_ArrayBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ArrayBuffer.prototype.init___I = (function(initialSize) {
  this.initialSize$6 = initialSize;
  $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V(this);
  return this
});
$c_scm_ArrayBuffer.prototype.zipWithIndex__scg_CanBuildFrom__O = (function(bf) {
  return $s_sc_IndexedSeqOptimized$class__zipWithIndex__sc_IndexedSeqOptimized__scg_CanBuildFrom__O(this, bf)
});
$c_scm_ArrayBuffer.prototype.length__I = (function() {
  return this.size0$6
});
$c_scm_ArrayBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.remove__I__O = (function(n) {
  var result = $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, n);
  this.remove__I__I__V(n, 1);
  return result
});
$c_scm_ArrayBuffer.prototype.lastIndexWhere__F1__I__I = (function(p, end) {
  return $s_sc_IndexedSeqOptimized$class__lastIndexWhere__sc_IndexedSeqOptimized__F1__I__I(this, p, end)
});
$c_scm_ArrayBuffer.prototype.last__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.drop__I__O = (function(n) {
  var until = this.size0$6;
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer = (function(xs) {
  if ($is_sc_IndexedSeqLike(xs)) {
    var x2 = $as_sc_IndexedSeqLike(xs);
    var n = x2.length__I();
    var n$1 = ((this.size0$6 + n) | 0);
    $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n$1);
    x2.copyToArray__O__I__I__V(this.array$6, this.size0$6, n);
    this.size0$6 = ((this.size0$6 + n) | 0);
    return this
  } else {
    return $as_scm_ArrayBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayBuffer.prototype.sizeHint__I__V = (function(len) {
  if (((len > this.size0$6) && (len >= 1))) {
    var newarray = $newArrayObject($d_O.getArrayOf(), [len]);
    var src = this.array$6;
    var length = this.size0$6;
    $systemArraycopy(src, 0, newarray, 0, length);
    this.array$6 = newarray
  }
});
$c_scm_ArrayBuffer.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_ArrayBuffer.prototype.toCollection__O__sc_Seq = (function(repr) {
  return $as_scm_IndexedSeq(repr)
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer(xs)
});
$c_scm_ArrayBuffer.prototype.stringPrefix__T = (function() {
  return "ArrayBuffer"
});
function $is_scm_ArrayBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuffer)))
}
function $as_scm_ArrayBuffer(obj) {
  return (($is_scm_ArrayBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuffer"))
}
function $isArrayOf_scm_ArrayBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuffer)))
}
function $asArrayOf_scm_ArrayBuffer(obj, depth) {
  return (($isArrayOf_scm_ArrayBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuffer;", depth))
}
var $d_scm_ArrayBuffer = new $TypeData().initClass({
  scm_ArrayBuffer: 0
}, false, "scala.collection.mutable.ArrayBuffer", {
  scm_ArrayBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1,
  scm_ResizableArray: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer.prototype.$classData = $d_scm_ArrayBuffer;
}).call(this);
//# sourceMappingURL=example-fastopt.js.map
