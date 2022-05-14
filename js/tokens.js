Tokens={
    new:function(value) {
        switch (typeof value) {
            case "string":{
                return this.newString(value);
                break;
            }
            default:{
                return this.newNumber(value);
            }
        }
    },
    tokenToString:function(token,nospaces) {
        switch (token.type) {
            case K.TKN_STRING:{
                return token.value;
                break;
            }
            case K.TKN_NUMBER:{
                if (nospaces)
                    return token.value.toString();
                else
                    return (token.value<0?"":" ")+token.value+" ";
                break;
            }
            case K.TKN_NULL:{
                return "NULL";
                break;
            }
            case K.TKN_BOOLEAN:{
                if (token.value) return "true";
                else return "false";
                break;
            }
            case K.TKN_ARRAY:{
                return "(Array)";
                break;
            }
            case K.TKN_FUNCTIONCODE:{
                return "(Function)";
                break;
            }
            case K.TKN_CLASSCODE:{
                return "(Class)";
                break;
            }
            default:{
                return "(Token:"+token.type+")";
            }
        }
    },
    getTokenTypeByName:function(name) {
        if (name[name.length-1]=="$") return K.TKN_STRING;
        else return K.TKN_NUMBER;
    },
    newTokenByName:function(name,value) {
        let type=this.getTokenTypeByName(name);
        switch (type) {
            case K.TKN_STRING:{
                if (value === undefined) value="";
                return this.newString(value);
                break;
            }
            case K.TKN_NUMBER:{
                if (value === undefined) value=0;
                else value = value*1;
                return this.newNumber(value);
                break;
            }
            default:{
                console.warn("Unsupported type");
                break;
            }
        }
    },
    newRawChar:function(ch) {
        return { type:K.TKN_RAWCHAR, value:ch }
    },
    newRange:function() {
        return { type:K.TKN_RANGE, from:undefined, to:undefined }
    },
    newJsFunction:function(code) {
        return { type:K.TKN_JSFUNCTION, structuredValue: code }
    },
    newDot:function() {
        return { type:K.TKN_DOT }
    },
    newJsFetcher:function(code) {
        return { type:K.TKN_JSFETCHER, structuredValue: code }
    },
    newJsProperty:function(code) {
        return { type:K.TKN_JSPROPERTY, structuredValue: code }
    },
    newRawList:function(value, modifiers, modifiersTrailing) {
        return { type: K.TKN_RAWLIST, value:value, modifiers:modifiers, modifiersTrailing:modifiersTrailing }
    },
    newNumber:function(value, modifiers, modifiersTrailing) {
        return { type: K.TKN_NUMBER, value:value, modifiers:modifiers, modifiersTrailing:modifiersTrailing }
    },
    newString:function(value) {
        return { type: K.TKN_STRING, value:value }
    },
    newStringQueue:function() {
        return { type: K.TKN_STRINGQUEUE };
    },
    newBoolean:function(value) {
        return { type: K.TKN_BOOLEAN, value:!!value }
    },
    newTab:function(value) {
        return { type: K.TKN_TAB, value:value }
    },
    newArray:function(value) {
        return { type: K.TKN_ARRAY, value:value }
    },
    newSymbol:function(symbol) {
        return { type:K.TKN_SYMBOL, value:symbol}
    },
    newClose:function() {
        return {type:K.TKN_CLOSE};
    },
    newNull:function() {
        return {type:K.TKN_NULL};
    },
    newPointer:function(into, intoKey) {
        return { into:into, intoKey:intoKey }
    },
    newNextProcessed:function(iterator) {
        return {type:K.TKN_NEXTPROCESSED, value:iterator}
    },
    newPointerToValue:function(pointer, value) {
        return {
            type:value.type,
            value:value.value,
            modifiers:value.modifiers,
            modifiersTrailing:value.modifiersTrailing,
            into:pointer.into,
            intoKey:pointer.intoKey
        }
    },
    setPointerVariableName:function(pointer, name) {
        pointer.variableName = name;
    },
    newFunctionCode:function(fn) {
        return { type:K.TKN_FUNCTIONCODE, value:fn }
    },
    newClassCode:function(cl) {
        return { type:K.TKN_CLASSCODE, value:cl }
    },
    newObject:function(fn) {
        return { type:K.TKN_OBJECT, value:fn }
    },
    newAnonymousFunctionCode:function(fn) {
        return { type:K.TKN_NUMBER, value:0, structuredValue:this.newFunctionCode(fn) }
    },
    newAnonymousObject:function(fn) {
        return { type:K.TKN_NUMBER, value:0, structuredValue:this.newObject(fn) }
    },
    newAnonymousArray:function(value) {
        return { type:K.TKN_NUMBER, value:0, structuredValue:this.newArray(value) }
    },
    clone:function(token) {
        return { type:token.type, value:token.value, structuredValue:token.structuredValue, modifiers:token.modifiers, modifiersTrailing:token.modifiersTrailing, manipulation:token.manipulation };
    },
    solvePointer:function(pointer) {
        let value=pointer.into[pointer.intoKey];
        return value;
    },
    setPointerOrCopy:function(pointer,value,skipStructure) {
        switch (value.type) {
            // These are assigned by value
            case K.TKN_STRING:{
                if (pointer.into[pointer.intoKey] == undefined)
                    pointer.into[pointer.intoKey]=this.newString(value.value);
                else {
                    pointer.into[pointer.intoKey].type = value.type;
                    pointer.into[pointer.intoKey].value = value.value;
                }
                break;
            }
            case K.TKN_BOOLEAN:{
                if (pointer.into[pointer.intoKey] == undefined)
                    pointer.into[pointer.intoKey]=this.newBoolean(value.value);
                else {
                    pointer.into[pointer.intoKey].type = value.type;
                    pointer.into[pointer.intoKey].value = value.value;
                }
                break;
            }
            case K.TKN_NUMBER:{
                if (pointer.into[pointer.intoKey] == undefined)
                    pointer.into[pointer.intoKey]=this.newNumber(value.value);
                else {
                    pointer.into[pointer.intoKey].type = value.type;
                    pointer.into[pointer.intoKey].value = value.value;
                }
                break;
            }
            // These are mediated by a basic type
            case K.TKN_CLASSCODE:
            case K.TKN_FUNCTIONCODE:
            case K.TKN_ARRAY:{
                if (pointer.into[pointer.intoKey] == undefined)
                    pointer.into[pointer.intoKey]=this.newTokenByName(pointer.intoKey);
                switch (pointer.into[pointer.intoKey].type) {
                    case K.TKN_STRING:
                    case K.TKN_NUMBER:{
                        pointer.into[pointer.intoKey].structuredValue=value;
                        break;
                    }
                    default:{
                        console.warn("unsupported");
                        debugger;
                    }
                }
                break;
            }
            default:{
                console.warn("unsupported");
                debugger;
            }
        }
        if (value.structuredValue && !skipStructure)
            pointer.into[pointer.intoKey].structuredValue = value.structuredValue;
        
    },
    isPointer:function(token) {
        return token.into!==undefined;
    }
}