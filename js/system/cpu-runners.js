
Cpu.getRunners=function(){
    
    function newLocalScope(model) {
        let scope={variables:{}, functions:{}};
        if (model)
            for (var k in scope)
                if (model[k])
                    for (var k2 in model[k])
                        scope[k][k2]=model[k][k2];
        return scope;
    }

    function applyModifiers(v,token,modifiers,modifiersTrailing) {
        if (!modifiers) {
            modifiers=token.modifiers;
            modifiersTrailing=token.modifiersTrailing;
            delete token.modifiers;
            delete token.modifiersTrailing;
        }
        if (modifiers)
            for (let i=modifiers.length-1;i>=0;i--)
                token=v.global.modifiers[modifiers[i].value](v,false,token);
        if (modifiersTrailing)
            modifiersTrailing.forEach(mod=>v.global.modifiers[mod.value](v,true,token));
        return token;
    };

    function addObjectContext(v,scope,instance) {
        scope=newLocalScope(scope);
        v.global.objectContexts.forEach(context=>{
            switch (context.context) {
                case K.CTX_INSTANCE:{
                    scope.variables[context.token] = instance;
                    break;
                }
                break;
            }
        });
        return scope;
    }
    
    return {

    expression:function(v) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.step=1;
            v.solved=[];
        }
        switch (v.step) {
            case 1:{ // Solve all tokens
                v.index++;
                let step=v.expression[v.index];
                if (step) {
                    switch (step.action) {
                        case K.ACT_SYMBOLMANIPULATION:{
                            this.call(v,v.solved,v.index,"symbolManipulation",{
                                assignTo:v.assignTo,
                                atLine:step.atLine,
                                modifiers:step.modifiers,
                                modifiersTrailing:step.modifiersTrailing,
                                token:step,
                                manipulation:step.manipulation
                            });
                            break;
                        }
                        case K.ACT_INLINEARRAY:{
                            this.call(v,v.solved,v.index,"inlineArray",{
                                assignTo:v.assignTo,
                                atLine:step.atLine,
                                modifiers:step.modifiers,
                                modifiersTrailing:step.modifiersTrailing,
                                values:step.values
                            });
                            break;
                        }
                        case K.ACT_INLINEOBJECT:{
                            this.call(v,v.solved,v.index,"inlineObject",{
                                assignTo:v.assignTo,
                                atLine:step.atLine,
                                modifiers:step.modifiers,
                                modifiersTrailing:step.modifiersTrailing,
                                attributes:step.attributes
                            });
                            break;
                        }
                        case K.ACT_EXPRESSION:{
                            this.call(v,v.solved,v.index,"expression",step);
                            break;
                        }
                        case K.ACT_DEFINEFUNCTION:{
                            v.solved[v.index]=Tokens.newAnonymousFunctionCode(step);
                            break;
                        }
                        case K.ACT_TERNARY:{
                            this.call(v,v.solved,v.index,"ternary",{
                                assignTo:v.assignTo,
                                atLine:step.atLine,
                                modifiers:step.modifiers,
                                modifiersTrailing:step.modifiersTrailing,
                                condition:step.condition,
                                onTrue:step.onTrue,
                                onFalse:step.onFalse
                            });
                            break;
                        }
                        default:{
                            // Tokens are cloned to keep the code as-is
                            if (step.action===undefined) v.solved.push(Tokens.clone(step));
                            else return this.returnBreaker(v,"Unsupported expression action type '"+step.action+"'");
                        }
                    }
                } else v.step++;
                break;
            }
            case 2:{ // Run expression
                let doBreak;
                v.global.operatorsPriority.forEach(operators=>{
                    for (let i=1;i<v.solved.length;i+=2) {
                        if (operators.indexOf(v.solved[i].value)!=-1) {
                            if (v.global.operators[v.solved[i].value]) {
                                if (v.solved[i-1] && v.solved[i+1]) {
                                    v.solved.splice(i-1,3,v.global.operators[v.solved[i].value](v,applyModifiers(v,v.solved[i-1]),applyModifiers(v,v.solved[i+1])));
                                    i-=2;
                                } else return doBreak = "Can't apply operator '"+v.solved[i].value+"'";
                            } else return doBreak = "Unsupported operator '"+v.solved[i].value+"'";
                        }
                    }
                });
                if (doBreak) return this.returnBreaker(v,doBreak);
                else if (v.solved.length==1) {
                    let value=applyModifiers(v,applyModifiers(v,v.solved[0]),v.modifiers);
                    return this.returnValue(value);
                } else {
                    v.solved.map(value=>applyModifiers(v,value));
                    return this.returnValue(Tokens.newRawList(v.solved,v.modifiers));
                }
                break;
            }
        }
    },

    instanceClass:function(v) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.step=1;
            v.rawInstance = {};
            v.instance = Tokens.newAnonymousObject(v.rawInstance);
        }
        switch (v.step) {
            case 1:{ // Solve all variables
                v.index++;
                let variable = v.instanceClass.variables[v.index];
                if (variable) this.call(v,v.rawInstance,variable.name.value,"expression",variable.value);
                else v.step++;
                break;
            }
            case 2:{ // Append method and calls constructor
                v.step++;
                v.instanceClass.methods.forEach(method=>{
                    v.rawInstance[method.name.value]=Tokens.newAnonymousFunctionCode(method.code);
                });
                // Call constructor, if any
                if (v.rawInstance[v.token.value]) {
                    this.call(v,v,"value","manipulationCall",{
                        method:v.rawInstance[v.token.value],
                        atLine:v.atLine,
                        arguments:v.arguments,
                        localScope:addObjectContext(v,v.localScope,v.instance),
                        token:v.token,
                        methodName:v.token,
                        isRoot:true
                    })
                }
                break;
            }
            case 3:{
                // Object is ready
                return this.returnValue(v.instance);
            }
        }
    },

    manipulationFetch:function(v) {
         // Arguments are evaluated and sent to the statement
         if (!v.first) {
            v.first=1;
            v.index=-1;
            v.step=1;
            v.solved=[v];
            if (v.method.structuredValue.start) v.method.structuredValue.start.apply(this,v.solved);
        }
        switch (v.step) {
            case 1:{
                v.index++;
                let step=v.arguments[v.index];
                if (step) {
                    v.step++;
                    switch (step.action) {
                        case K.ACT_EXPRESSION:{
                            this.call(v,v.solved,1,"expression",step);
                            break;
                        }
                        default:{
                            v.solved[1]=step;
                            break;
                        }
                    }
                } else return this.returnValue(v.method.structuredValue.end.apply(this,v.solved));
                // Solve argument
                break;
            }
            case 2:{
                v.step=1;
                let ret = v.method.structuredValue.fetch.apply(this,v.solved);
                if (ret !== undefined) return ret;
                break;
            }
        }
    },

    manipulationCall:function (v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
            v.index=-1;
            v.solved=[v];
            if (!v.method)
                return this.returnBreaker(v, "Method not found '"+v.methodName.value+"'",v.token);
        }
        switch (v.step) {
            case 1:{
                // Before solving call
                switch (v.method.type) {
                    case K.TKN_NUMBER:
                    case K.TKN_STRING:{
                        if (v.method.structuredValue)
                            switch (v.method.structuredValue.type) {
                                case K.TKN_CLASSCODE:{
                                    // On class instance arguments are solved later by the constructor call
                                    return this.passThru(v,"instanceClass",{
                                        instanceClass:v.method.structuredValue.value,
                                        arguments:v.arguments,
                                        token:v.token,
                                        getPointer:v.getPointer,
                                        atLine:v.atLine
                                    });
                                    break;
                                }
                                default:{
                                    v.step++;
                                }
                            }
                        else
                            v.step++;
                        break;
                    }
                    default:{
                        v.step++;
                    }
                }
                break;
            }
            case 2:{
                // Solve arguments
                v.index++;
                let step=v.arguments[v.index];
                if (step)
                    switch (step.action) {
                        case K.ACT_EXPRESSION:{
                            this.call(v,v.solved,v.solved.length,"expression",step);
                            break;
                        }
                        case K.ACT_RANGE:{
                            v.solved.push(Tokens.newRange());
                            if (step.from) this.call(v,v.solved[v.solved.length-1],"from","expression",step.from);
                            if (step.to) this.call(v,v.solved[v.solved.length-1],"to","expression",step.to);
                            break;
                        }
                        default:{
                            return this.returnBreaker(v,"Unsupported manipulation call '"+step.action+"'",step);
                        }
                    }
                else
                    v.step++;
                break;
            }
            case 3:{
                // Perform call
                switch (v.method.type) {
                    case K.TKN_ARRAY:{
                        return this.returnBreaker(v,"Can't call method on array",v.method);
                        break;
                    }
                    case K.TKN_NUMBER:
                    case K.TKN_STRING:{
                        if (v.method.structuredValue) v.method=v.method.structuredValue;
                        if (v.method) {
                            switch (v.method.type) {
                                case K.TKN_STRING:{
                                    // Handle string get via a(1,2,3)
                                    // This getter works with integer only
                                    for (var i=1;i<v.solved.length;i++) {
                                        let solving = v.solved[i];
                                        switch (solving.type) {
                                            case K.TKN_RANGE:{
                                                let
                                                    starting = v.system.registry.quirkStringsStartsFrom,
                                                    from = starting,len;
                                                if (!solving.from) from=starting;
                                                else if (solving.from.value>from) from=solving.from.value;
                                                if (solving.to) len=solving.to.value-from+1;
                                                else len=v.method.value.length;
                                                v.method=Tokens.newString(v.method.value.substr(from-starting,len));
                                                break;
                                            }
                                            default:{
                                                let index = Math.floor(solving.value);
                                                v.method=Tokens.newString(v.method.value.substr(index-v.system.registry.quirkStringsStartsFrom,1));
                                            }
                                        }
                                    }
                                    return this.returnValue(v.method);
                                    break;
                                }
                                case K.TKN_ARRAY:{
                                    // Handle array get via a(1,2,3)
                                    // This getter works with integer only
                                    for (var i=1;i<v.solved.length-1;i++) {
                                        let index = Math.floor(v.solved[i].value)-v.system.registry.quirkArraysStartsFrom;
                                        if (v.method.value[index] === undefined) {
                                            if (v.getPointer) {
                                                // If getting a pointer and array is not defined, create a new empty one
                                                v.method.value[index] = Tokens.newArray([]);
                                                v.method=v.method.value[index];
                                            } else
                                                // Not existing values are defaulted by the variable name
                                                v.method = Tokens.newTokenByName(v.token.value);
                                        } else v.method=v.method.value[index];
                                    }
                                    return this.returnValue(Tokens.newPointer(v.method.value,Math.floor(v.solved[v.solved.length-1].value-v.system.registry.quirkArraysStartsFrom)));
                                    break;
                                }
                                case K.TKN_FUNCTIONCODE:{
                                    // Handle function call via a(1,2,3)
                                    v.localScope=newLocalScope(v.localScope);
                                    v.method.value.arguments.forEach((argument,id)=>{
                                        if (v.solved[id+1] !== undefined)
                                            v.localScope.variables[argument]=v.solved[id+1];
                                    });
                                    v.defaultScope = v.localScope;
                                    if (v.method.value.code) return this.passThru(v,"line",{line:v.method.value.code, isCycle:true });
                                    else return this.passThru(v,"expression",v.method.value.expression);
                                    break;
                                }
                                default:{
                                    return this.returnBreaker(v, "Unsupported call to '"+v.method.type+"' tokens.",v.method);
                                }
                            }
                        } else return this.returnBreaker(v, "No structure to call in variable '"+v.token+"'",v.method);
                        break;
                    }
                    case K.TKN_JSFUNCTION:{
                        return v.method.structuredValue.apply(this,v.solved);
                        break;
                    }
                    case K.TKN_JSPROPERTY:{
                        return this.returnValue(v.method.structuredValue.get.apply(this,v.solved));
                        break;
                    }
                    default:{
                        return this.returnBreaker(v,"Can't call method type '"+v.method.type+"'",v.method);
                    }
                }
                break;
            }
        }
    },

    manipulationGetArray:function (v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"key","expression",v.key);
                break;
            }
            default:{
                if (v.value.structuredValue === undefined)
                    return this.returnValue(Tokens.newPointer(v.value.value,v.key.value));
                else
                    return this.returnValue(Tokens.newPointer(v.value.structuredValue.value,v.key.value));
            }
        }
    },

    inlineArray:function(v) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.items=[];
            v.value=Tokens.newAnonymousArray(v.items);
        }
        v.index++;
        let step=v.values?v.values[v.index]:0;
        if (step) {
            switch (step.action) {
                case K.ACT_EXPRESSION:{
                    this.call(v,v.items,v.items.length,"expression",step);
                    break;
                }
                default:{
                    return this.returnBreaker(v,"Unsupported array element '"+step.action+"'");
                }
            }
        } else {
            v.value.modifiers = v.modifiers;
            v.value.modifiersTrailing = v.modifiersTrailing;
            return this.returnValue(v.value);
        }
    },

    inlineObject:function(v) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.items={};
            v.value=Tokens.newAnonymousObject(v.items);
        }
        v.index++;
        let step=v.attributes?v.attributes[v.index]:0;
        if (step) {
            switch (step.value.action) {
                case K.ACT_EXPRESSION:{
                    this.call(v,v.items,step.key,"expression",step.value);
                    break;
                }
                default:{
                    return this.returnBreaker(v,"Unsupported object element '"+step.action+"'");
                }
            }
        } else {
            v.value.modifiers = v.modifiers;
            v.value.modifiersTrailing = v.modifiersTrailing;
            return this.returnValue(v.value);
        }
    },

    ternary:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                // Solve condition
                v.step++;
                this.call(v,v,"condition","expression",v.condition);
                break;
            }
            case 2:{
                // Check condition
                if (v.system.logic.decodeBoolean(v.condition))
                    return this.passThru(v,"expression",v.onTrue);
                else
                    return this.passThru(v,"expression",v.onFalse);
                break;
            }
        }
    },

    symbolManipulation:function(v) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.methodName=v.token;
            switch (v.token.type) {
                case K.TKN_STRING:{
                    v.value=v.token;
                    break;
                }
                case K.TKN_JSPROPERTY:
                case K.TKN_JSFETCHER:
                case K.TKN_JSFUNCTION:
                case K.TKN_SYMBOL:{
                    let tokenValue=v.token.value;
                    if (v.isSet)
                        if (v.global.functions[tokenValue] !== undefined) v.value=Tokens.newPointer(v.global.functions,tokenValue);
                        else if (v.global.variables[tokenValue] !== undefined) v.value=Tokens.newPointer(v.global.variables,tokenValue);
                        else v.value=Tokens.newPointer(v.defaultScope.variables,tokenValue);
                    else if (v.defaultScope.functions[tokenValue] !== undefined) v.value=Tokens.newPointer(v.defaultScope.functions,tokenValue);
                    else if (v.defaultScope.variables[tokenValue] !== undefined) v.value=Tokens.newPointer(v.defaultScope.variables,tokenValue);
                    else if (v.local.functions[tokenValue] !== undefined) v.value=Tokens.newPointer(v.local.functions,tokenValue);
                    else if (v.local.variables[tokenValue] !== undefined) v.value=Tokens.newPointer(v.local.variables,tokenValue);
                    else if (v.global.functions[tokenValue] !== undefined) v.value=Tokens.newPointer(v.global.functions,tokenValue);
                    else v.value=Tokens.newPointer(v.global.variables,tokenValue);
                    break;
                }
                default:{
                    return this.returnBreaker(v,"Can't manipulate token '"+v.token.type+"'");
                    break;
                }
            }
        }
        v.index++;
        let step=v.manipulation?v.manipulation[v.index]:0;
        if (step) {
            if (Tokens.isPointer(v.value) && (v.index==0) && (step.action == K.ACT_CALL) && (!Tokens.solvePointer(v.value) || !Tokens.solvePointer(v.value).structuredValue) && v.system.registry.quirkVariablesAreNotStructures) {
                // In BASIC variables accessed as A(3) are arrays even if not DIMmed
                console.warn("Probable missing statement:",v.value.intoKey);
                Tokens.setPointerOrCopy(v.value,Tokens.newArray([]));
            }
            if (Tokens.isPointer(v.value)) v.value=Tokens.solvePointer(v.value);
            switch (step.action) {
                case K.ACT_CALL:{
                    this.call(v,v,"value","manipulationCall",{
                        assignTo:v.assignTo,
                        method:v.value,
                        atLine:v.atLine,
                        arguments:step.arguments,
                        token:v.token,
                        getPointer:v.getPointer,
                        methodName:v.methodName,
                        localScope:v.localScope,
                        // Root tokens "array calls" are initialized with empty array
                        isRoot:v.index==0
                    })
                    break;
                }
                case K.ACT_FETCH:{
                    this.call(v,v,"value","manipulationFetch",{
                        assignTo:v.assignTo,
                        method:v.value,
                        atLine:v.atLine,
                        arguments:step.arguments,
                        token:v.token,
                        getPointer:v.getPointer,
                        // Root tokens "array calls" are initialized with empty array
                        isRoot:v.index==0
                    })
                    break;
                }
                case K.ACT_GETPROPERTY:{
                    if (!v.value)
                        return this.returnBreaker(v,"Object '"+v.methodName.value+"' doesn't exists");
                    else if (!v.value.structuredValue)
                        return this.returnBreaker(v,"'"+v.methodName.value+"' is not an object");
                    else {
                        v.localScope=addObjectContext(v,v.localScope,v.value);
                        v.value = Tokens.newPointer(v.value.structuredValue.value,step.arguments.value);
                        v.methodName=step.arguments;
                    }
                    break;
                }
                case K.ACT_GETARRAY:{
                    this.call(v,v,"value","manipulationGetArray",{value:v.value,atLine:v.atLine,key:step.arguments})
                    break;
                }
                default:{
                    return this.returnBreaker(v,"Unsupported symbol manipulation action '"+step.action+"'");
                }
            }
        } else {
            if (!v.getPointer && v.value && Tokens.isPointer(v.value)) {
                let token=Tokens.solvePointer(v.value);
                if (!token) token=Tokens.newTokenByName(v.token.value);
                // If getting a property, calls the getter
                if (token.type == K.TKN_JSPROPERTY) v.value=token.structuredValue.get.apply(this,[v]);
                else v.value=Tokens.newPointerToValue(v.value, token);
                if (token.structuredValue) v.value.structuredValue = token.structuredValue;
            }
            if (Tokens.isPointer(v.value)) Tokens.setPointerVariableName(v.value,v.token);
            v.value.modifiers = v.modifiers;
            v.value.modifiersTrailing = v.modifiersTrailing;
            return this.returnValue(v.value);
        }
    },

    assign:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"to","symbolManipulation",{
                    isSet:true,
                    atLine:v.atLine,
                    token:v.to,
                    modifiers:v.to.modifiers,
                    modifiersTrailing:v.to.modifiersTrailing,
                    manipulation:v.to.manipulation,
                    getPointer:true
                });
                break;
            }
            case 2:{
                v.step++;
                v.value.assignTo = v.to;
                this.call(v,v,"value","expression",v.value);
                break;
            }
            case 3:{
                let prevValue = Tokens.solvePointer(v.to);
                if (v.global.assignments[v.symbol])
                    v.value = v.global.assignments[v.symbol](v,prevValue,v.value);
                if (prevValue && prevValue.type == K.TKN_JSPROPERTY) v.value = prevValue.structuredValue.set.apply(this,[v,v.value]);
                else Tokens.setPointerOrCopy(v.to,v.value,v.system.registry.quirkVariablesAreNotStructures);
                return this.returnValue(v.value);
            }
        }
    },

    defineFunction:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"to","symbolManipulation",{
                    isSet:true,
                    atLine:v.atLine,
                    token:v.fn.name,
                    getPointer:true
                });
                break;
            }
            case 2:{
                let token=Tokens.newFunctionCode(v.fn);
                Tokens.setPointerOrCopy(v.to,token);
                return this.returnValue(token);
            }
        }
    },

    defineClass:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"to","symbolManipulation",{
                    isSet:true,
                    atLine:v.atLine,
                    token:v.newClass.name,
                    getPointer:true
                });
                break;
            }
            case 2:{
                let token=Tokens.newClassCode(v.newClass);
                Tokens.setPointerOrCopy(v.to,token);
                return this.returnValue(token);
            }
        }
    },

    command:function(v) {
        switch (v.command.action) {
            case K.ACT_SYMBOLMANIPULATION:{
                return this.passThru(v,"symbolManipulation",{
                    token:v.command,
                    modifiers:v.command.modifiers,
                    modifiersTrailing:v.command.modifiersTrailing,
                    atLine:v.atLine,
                    manipulation:v.command.manipulation
                });
                break;
            }
            default:{
                return this.returnBreaker(v,"Unsupported command action '"+v.command.action+"'",v.line);
            }
        }
    },

    if:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"if","expression",v.if);
                break;
            }
            case 2:{
                if (v.system.logic.decodeBoolean(v.if)) {
                    if (v.then) return this.passThru(v,"line",{line:v.then});
                    else return this.returnValue(0);
                } else {
                    if (v.else) return this.passThru(v,"line",{line:v.else});
                    else return this.returnValue(0);
                }
                break;
            }
        }
    },

    conditionLoop:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=v.conditionFirst?100:1;
            v.value=0;
        }
        if (v.stopCycle) return this.returnValue(v.value);
        else switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"end","expression",v.condition);
                break;
            }
            case 2:{
                let go=v.system.logic.decodeBoolean(v.end);
                if (v.conditionIsEnd) go=!go;
                if (go) v.step=100;
                else return this.returnValue(v.value);
            }
            case 100:{
                v.step=1;
                this.call(v,v,"value","line",{line:v.code,isCycle:true});
                break;
            }
        }
    },

    switch:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
            v.case=-1;
            v.value=0;
            v.solvedCases=[];
            v.matched=false;
        }
        if (v.stopCycle) return this.returnValue(v.value);
        else switch (v.step) {
            case 1:{
                // Get switch value
                v.step++;
                this.call(v,v,"onValue","expression",v.on);
                break;
            }
            case 2:{
                // Iterate cases
                v.case++;
                let currentCase=v.cases[v.case];
                if (currentCase) {
                    v.solvedCase={onDefault:currentCase.onDefault,on:0,code:currentCase.code};
                    v.solvedCases.push(v.solvedCase);
                    if (!currentCase.onDefault)
                        this.call(v,v.solvedCase,"on","expression",currentCase.on);
                } else {
                    v.case=-1;
                    v.step++;
                }
                break;
            }
            case 3:{
                v.step++;
                for (let i=0;i<v.solvedCases.length;i++)
                    if (v.solvedCases[i].on.value == v.onValue.value) {
                        v.matchCase=true;
                        break;
                    }
                break;
            }
            case 4:{
                v.case++;
                let solvedCase=v.solvedCases[v.case];
                if (solvedCase) {
                    if (v.matched || (solvedCase.onDefault && !v.matchCase) || (solvedCase.on.value == v.onValue.value)) {
                        v.matched=true;
                        if (solvedCase.code) this.call(v,v,"value","line",{line:solvedCase.code,isCycle:true});
                    }
                } else return this.returnValue(v.value);
                break;
            }
        }
    },
    
    for:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
            v.value=0;
        }
        if (v.stopCycle) return this.returnValue(v.value);
        else if (v.iterator) {
            // FOR I=1 TO 10 style cycle
            switch (v.step) {
                case 1:{
                    // Initialize cycle
                    v.step++;
                    this.call(v,v,"noop","line",{line:v.initializeCode});
                    break;
                }
                case 2:{
                    v.step++;
                    // Calculate step and destination
                    this.call(v,v,"destinationValue","expression",v.iteratorDestination);
                    if (v.iteratorStep) this.call(v,v,"stepValue","expression",v.iteratorStep);
                    else v.stepValue=Tokens.newNumber(1);
                    break;
                }
                case 3:{
                    // Iterate - code calls are pushed to the stack
                    v.step++;
                    this.call(v,v,"value","line",{
                        line:v.code,
                        isIterator:true,
                        isIterating:v.iterator.value,
                        isCycle:true
                    });
                    break;
                }
                case 4:{
                    // Prepare condition verification
                    v.step++;
                    if (v.iterator) {
                        this.call(v,v,"iteratorValue","symbolManipulation",{
                            isSet:true,
                            atLine:v.atLine,
                            token:v.iterator,
                            getPointer:true
                        });
                    }
                    break;
                }
                case 5:{
                    // Check condition
                    let value=Tokens.solvePointer(v.iteratorValue).value;
                    Tokens.solvePointer(v.iteratorValue).value+=v.stepValue.value;
                    if (
                        (value==v.destinationValue.value)||
                        ((v.stepValue.value>0)&&(value>v.destinationValue.value))||
                        ((v.stepValue.value<0)&&(value<v.destinationValue.value))
                    ) return this.returnValue(v.value);
                    else v.step=3;
                    break;
                }
            }
        } else {
            // FOR(I=0;I<10;I++) style cycle
            switch (v.step) {
                case 1:{
                    // Initialize cycle
                    v.step++;
                    if (v.initializeCode) this.call(v,v,"noop","line",{line:v.initializeCode});
                    break;
                }
                case 2:{
                    // Prepare condition verification
                    v.step++;
                    if (v.iterationCondition) this.call(v,v,"conditionValue","expression",v.iterationCondition);
                    else delete v.conditionValue;
                    break;
                }
                case 3:{
                    // Check condition
                    if ((v.conditionValue===undefined) || v.system.logic.decodeBoolean(v.conditionValue)) v.step++;
                    else return this.returnValue(v.value);
                    break;
                }
                case 4:{
                    // Iterate - code calls are pushed to the stack
                    v.step++;
                    if (v.code) this.call(v,v,"value","line",{
                        line:v.code,
                        isIterator:true,
                        isCycle:true
                    });
                    break;
                }
                case 5:{
                    v.step=2;
                    // Iterator
                    if (v.iteration)this.call(v,v,"noop","line",{line:v.iteration});
                    break;
                }
            }
        }
    },

    on:function(v) {
        if (!v.first) {
            v.first=1;
            v.step=1;
            v.value=0;
        }
        switch (v.step) {
            case 1:{
                // Evaluate condition
                v.step++;
                this.call(v,v,"condition","expression",v.condition);
                break;
            }
            case 2:{
                // Select option
                v.step++;
                if (v.condition.value) {
                    let
                        index=v.condition.value-1,
                        option=v.options[index];
                    if (option)
                        return this.passThru(v,"line",{line:option});
                    else return this.returnValue();
                } else return this.returnValue();
                break;
            }
        }
    },

    line:function(v){
        switch (v.line.action) {
            case K.ACT_NEXT:{ 
                if (v.line.iterator)
                    // NEXT I
                    return this.returnBackToType("isIterating",v.line.iterator.value,"end",true);
                else
                    // NEXT
                    return this.returnBackToType("isIterator",true,"end",true);
                break;
            }
            case K.ACT_RUNCOMMAND:{
                return this.passThru(v,"command",v.line);
                break;
            }
            case K.ACT_ASSIGN:{
                return this.passThru(v,"assign",v.line);
                break;
            }
            case K.ACT_DEFINEFUNCTION:{
                return this.passThru(v,"defineFunction",{fn:v.line});
                break;
            }
            case K.ACT_IF:{
                return this.passThru(v,"if",v.line);
                break;
            }
            case K.ACT_DEFINECLASS:{
                return this.passThru(v,"defineClass",{newClass:v.line});
                break;
            }
            case K.ACT_CODEBLOCK:{
                return this.passThru(v,"code",{
                    code:v.line,
                    isCycle:v.isCycle,
                    isIterator:v.isIterator,
                    isIterating:v.isIterating
                });
                break;
            }
            case K.ACT_CONDITIONLOOP:{
                return this.passThru(v,"conditionLoop",v.line);
                break;
            }
            case K.ACT_SWITCH:{
                return this.passThru(v,"switch",v.line);
                break;
            }
            case K.ACT_FOR:{
                return this.passThru(v,"for",v.line);
                break;
            }
            case K.ACT_ON:{
                return this.passThru(v,"on",v.line);
                break;
            }
            case K.ACT_EXPRESSION:{
                return this.passThru(v,"expression",v.line);
                break;
            }
            case K.ACT_NOOP:{
                return this.returnValue();
                break;
            }
            default:{
                return this.returnBreaker(v,"Unsupported line action '"+v.line.action+"'", v.line);
            }
        }
    },

    data:function(v,stack) {
        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.solved=[];
        }
        v.index++;
        let step=v.data[v.index];
        if (step) this.call(v,v.solved,v.solved.length,"expression",step);
        else return this.returnValue(v.solved);
    },
    
    code:function(v,stack) {

        function findLineLabel(label) {
            let sv;
            for (var i=0;i<stack.length;i++) {
                sv=stack[i];
                if (sv.code)
                    if (sv.code.labels[label] !== undefined)
                        return sv.code.labels[label];
            }
            return false;
        }

        function findLineNumber(number) {
            
            let
                destination=-1,
                position=-1,
                sv;
            for (var i=0;i<stack.length;i++) {
                sv=stack[i];
                if (sv.code)
                    for (let k in sv.code.labels) {
                        let linenumber=parseInt(k);
                        if ((linenumber>destination)&&(linenumber<=number)) {
                            destination=linenumber;
                            position=sv.code.labels[k];
                        }
                    }
                if (sv===v) break;
            }
            if (position==-1 || (destination<number)) return false;
            else return position;
        }

        if (!v.first) {
            v.first=1;
            v.index=-1;
            v.prevLine=0;
            v.currentLine=0;
        }
        if (v.return) {
            let sv, gosubCode, lastCode=-1;
            for (var i=0;i<stack.length;i++) {
                sv=stack[i];
                if (sv.parser == v.parser) {
                    if (sv.isGosub) gosubCode=lastCode;
                    lastCode=i;
                }
            }
            if (lastCode && (gosubCode!=-1)) return this.returnBackTo(gosubCode);
            else return this.returnBreaker(v,"Can't return");
        } else {
           if (v.gotoNumber!==undefined) {
                let goto=false;
                if (v.system.registry.quirkCodeLabels && v.gotoNumber.variableName)
                    goto = findLineLabel(v.gotoNumber.variableName.value);
                // Search the line number in all previous calls 
                if (goto === false)
                    goto = findLineNumber(v.gotoNumber.value);
                delete v.gotoNumber;
                if (goto) {
                    v.code=goto.codeblock;
                    v.index=goto.index;
                } else return this.returnValue(v.value); // GOTO over the end of the program
            } else if (v.end) v.index=-1;
            else if (v.stopCycle) {
                v.index=-1;
                v.into.stopCycle=true;
            } else v.index++;
            v.prevLine=v.currentLine;
            v.currentLine=v.code.code[v.index];
            if (v.currentLine) return this.call(v,v,"value","line",{atLine:v.line,line:v.currentLine});
            else if (v.isGosub) {
                if (v.prevLine) v.atLine = v.prevLine.atLine;
                return this.returnBreaker(v,"Unexpected code end during GOSUB");
            } else
                return this.returnValue(v.value);
        }
    },

    root:function(v,stack) {
        if (!v.first) {
            v.first=1;
            v.atLine=0;
            v.step=1;
        }
        switch (v.step) {
            case 1:{
                v.step++;
                this.call(v,v,"value","code",{code:v.code, value:v.value, isCycle:1});
                break;
            }
            case 2:{
                return this.returnEnd(v.value || Tokens.newNumber(0));
            }
        }
    }
}};