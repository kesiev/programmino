Parser.getParsers=function() {return {

    singleToken:function(v,token) {
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                switch (token.type) {
                    case K.TKN_NUMBER:
                    case K.TKN_JSFETCHER:
                    case K.TKN_JSPROPERTY:
                    case K.TKN_JSFUNCTION:
                    case K.TKN_SYMBOL:{
                        if (v.intoKey!==undefined) v.into[v.intoKey]=token;
                        else v.into.push(expression);
                        return true;
                        break;
                    }
                }
            }
        }
    },

    arguments:function(v,token){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=true;
                    this.pushParser("expression",{
                        into:v.into,
                        quirks:v.quirks
                    },token);
                } else switch (token.type) {
                    case K.TKN_NEXTARGUMENT:{
                        if ((v.quirks.argumentsCount === undefined) || (v.into.length < v.quirks.argumentsCount)) {
                            // Null as argument if they're missing empty. Overwritten by next statement.
                            v.into.push({
                                action:K.ACT_EXPRESSION,
                                atLine:v.invokeLine,
                                expression:[
                                    Tokens.newNull()
                                ]
                            });
                            this.pushParser("expression",{
                                into:v.into,
                                intoKey:v.into.length-1,
                                quirks:v.quirks
                            });
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_CLOSEPARENTHESIS:{
                        return true;
                        break;
                    }
                    case K.TKN_NEWLINE:{
                        // If waiting for a closed parenthesis ignore \n
                        if (v.quirks.awaitClosedParenthesis) return;
                        else return this.returnPass(token);
                        break;
                    }
                    default:{
                        // Unrecognized token: pass to caller
                        return this.returnPass(token);
                    }
                }
            }
        }
    },

    inlineArray:function(v,token){
        if (!v.first) {
            v.first=true;
            let array={
                action:K.ACT_INLINEARRAY,
                values:v.data
            };
            if (v.intoKey!==undefined) v.into[v.intoKey]=array;
            else v.into.push(array);
            delete v.into;
            this.pushParser("expression",{
                into:v.data,
                quirks:v.quirks
            },token);
        } else {
            let prevToken=v.data[v.data.length-1];
            switch (token.type) {
                case K.TKN_NEWLINE:
                case K.TKN_SPACE:{
                    break;
                }
                default:{
                    switch (token.type) {
                        case K.TKN_NEXTARGUMENT:{
                            // If first element was not defined, adds a NULL
                            if (!v.data.length)
                                v.data.push({
                                    action:K.ACT_EXPRESSION,
                                    atLine:v.invokeLine,
                                    expression:[
                                        Tokens.newNull()
                                    ]
                                });
                            v.data.push({
                                action:K.ACT_EXPRESSION,
                                atLine:v.invokeLine,
                                expression:[
                                    Tokens.newNull()
                                ]
                            });
                            this.pushParser("expression",{
                                into:v.data,
                                intoKey:v.data.length-1,
                                quirks:v.quirks
                            });
                            break;
                        }
                        case K.TKN_ENDGETTER:{
                            return true;
                            break;
                        }
                        default:{
                            // Unrecognized token: pass to caller
                            return this.returnBreaker({atLine:v.invokeLine},"Unexpected array definition token",v.data);
                        }
                    }
                }
            }
        }
    },

    inlineObject:function(v,token){

        let parseError=()=>this.returnBreaker({atLine:v.invokeLine},"Unexpected object definition token",v.data);

        if (!v.first) {
            v.first=true;
            v.step=1;
            let obj={
                action:K.ACT_INLINEOBJECT,
                attributes:v.data
            };
            if (v.intoKey!==undefined) v.into[v.intoKey]=obj;
            else v.into.push(obj);           
            delete v.into;
        }
        switch (token.type) {
            case K.TKN_NEWLINE:
            case K.TKN_SPACE:{
                break;
            }
            default:{
                switch (v.step) {
                    case 1:{
                        // Looking for attribute name, object definition end, or comma (if it's not the first time)
                        switch (token.type) {
                            case K.TKN_NEXTARGUMENT:{
                                if (v.waitComma) v.waitComma=false;
                                else return parseError();
                                break;
                            }
                            case K.TKN_SYMBOL:{
                                if (v.waitComma)
                                    return parseError();
                                else {
                                    v.data.push({key:token.value});
                                    v.step++;
                                }
                                break;
                            }
                            case K.TKN_ENDCODEBLOCK:{
                                return true;
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:v.invokeLine},"Unexpected object definition token",v.data);
                                break;
                            }
                        }
                        break;
                    }
                    case 2:{
                        // Waiting for ":"
                        switch (token.type) {
                            case K.TKN_COLON:{
                                v.step=1;
                                v.waitComma=true;
                                this.pushParser("expression",{
                                    into:v.data[v.data.length-1],
                                    intoKey:"value",
                                    quirks:v.quirks
                                });
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:v.invokeLine},"Unexpected object definition token",v.data);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },

    fetcher:function(v,token){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                switch (token.type) {
                    case K.TKN_SEMICOLON:
                    case K.TKN_NEXTARGUMENT:{
                        v.into.push(token);
                        break;
                    }
                    case K.TKN_NEXTARGUMENT:
                    case K.TKN_CLOSEPARENTHESIS:
                    case K.TKN_COLON:
                    case K.TKN_CLOSE:
                    case K.TKN_NEWLINE:{
                        return this.returnPass(token);
                        break;
                    }
                    default:{
                        if (v.const.breakArguments.indexOf(token.value) != -1)
                            return this.returnPass(token);
                        else {
                            // It's an expression?
                            v.into.push({
                                action:K.ACT_EXPRESSION,
                                atLine:v.invokeLine,
                                expression:[
                                    Tokens.newNull()
                                ]
                            });
                            this.pushParser("expression",{
                                into:v.into,
                                intoKey:v.into.length-1,
                                quirks:{
                                    // Supports if a = 2
                                    singleEqualIsEqualOperator:true
                                }
                            },token);
                        }
                        break;
                    }
                }
            }
        }
    },

    ternary:function(v,token,currentLine) {
        if (!v.first) {
            v.first=1;
            v.step=1;
            v.ternary={
                action:K.ACT_TERNARY,
                condition:v.condition
            }
            if (v.intoKey!==undefined) v.into[v.intoKey]=v.ternary;
            else v.into.push(v.ternary);
            delete v.into;
        }
        switch (token.type) {
            case K.TKN_NEWLINE:
            case K.TKN_SPACE:{
                break;
            }
            default:{
                switch (v.step) {
                    case 1:{
                        // condition ? ...
                        v.step++;
                        this.pushParser("expression",{
                            into:v.ternary,
                            intoKey:"onTrue",
                            quirks:{
                                // Supports if a = 2
                                singleEqualIsEqualOperator:true,
                                // Ignore new lines
                                ignoreNewLines:true
                            }
                        },token);
                        break;
                    }
                    case 2:{
                        // condition ? ontrue ...
                        switch (token.type) {
                            case K.TKN_COLON:{
                                v.step++;
                                this.pushParser("expression",{
                                    into:v.ternary,
                                    intoKey:"onFalse",
                                    quirks:{
                                        // Supports if a = 2
                                        singleEqualIsEqualOperator:true,
                                        // Ignore new lines
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            default:{
                                return this.returnBreaker(token,"Bad ternary");
                            }
                        }
                        break;
                    }
                    case 3:{
                        return this.returnPass(token);
                    }
                }
            }
        }
    },

    expression:function(v,token,currentLine){

        function addToken(add) {
            v.tokenParsed=true;
            if (v.into) {
                v.expression={
                    action:K.ACT_EXPRESSION,
                    atLine:currentLine,
                    expression:v.data,
                    modifiers:v.expressionModifiers
                };
                if (v.intoKey!==undefined) v.into[v.intoKey]=v.expression;
                else v.into.push(v.expression);
                delete v.into;
            }
            if (add) {
                if (v.modifiers) add.modifiers=v.modifiers;
                if (v.modifiersTrailing) add.modifiersTrailing=v.modifiersTrailing;
                v.data.push(add);
                delete v.modifiers;
                delete v.modifiersTrailing;
            }
        }

        let prevToken=v.data[v.data.length-1];
        if (v.endExpression) return this.returnPass(token);
        else if (v.const.ignoreStatements && (v.const.ignoreStatements.indexOf(token.value)!=-1))
            return;
        else switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{             
                let
                    prevTokenIsQueueable = prevToken && ((prevToken.type==K.TKN_OPERATOR)|| (prevToken.type==K.TKN_STRINGQUEUE)|| (prevToken.type==K.TKN_MODIFIER)),
                    canStringQueueToken= prevToken && !prevTokenIsQueueable,
                    canQueueModifier=!prevToken || prevTokenIsQueueable,
                    canQueueModifierTrailing=prevToken && (prevToken.type == K.TKN_SYMBOL),
                    canManipulateToken=prevToken && (v.system.registry.quirkCallableStrings && prevToken.type == K.TKN_STRING),
                    canQueueToken=!prevToken || prevTokenIsQueueable,
                    canQueueOperator=prevToken && (prevToken.type!=K.TKN_OPERATOR),
                    modifierIsOperator=prevToken && (prevToken.type!=K.TKN_OPERATOR);
                if (v.nextNumberIsDecimals && token.type != K.TKN_NUMBER)
                    delete v.nextNumberIsDecimals;
                switch (token.type) {
                    case K.TKN_OPERATOR:{
                        // If breaks sequence, exits and pass token
                        if (canQueueOperator) addToken(token);
                        else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_MODIFIER:{
                        // If breaks sequence, exits and pass token
                        if (canQueueModifier) {
                            if (!v.modifiers) v.modifiers=[];
                            v.modifiers.push(token);
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_MODIFIERTRAILING:{
                        // If breaks sequence, exits and pass token
                        if (canQueueModifier) {
                            // Add before...
                            if (!v.modifiers) v.modifiers=[];
                            v.modifiers.push(token);
                        } else if (canQueueModifierTrailing) {
                            // Add after
                            if (!prevToken.modifiersTrailing) prevToken.modifiersTrailing=[];
                            prevToken.modifiersTrailing.push(token);
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_MODIFIEROPERATOR:{
                        // If breaks sequence, exits and pass token
                        if (modifierIsOperator) {
                            token.type=K.TKN_OPERATOR;
                            addToken(token);
                        } else {
                            token.type=K.TKN_MODIFIER;
                            if (!v.modifiers) v.modifiers=[];
                            v.modifiers.push(token);
                        }
                        break;
                    }
                    case K.TKN_NUMBER:{
                        // Create number decimals
                        if (v.nextNumberIsDecimals && prevToken.type==K.TKN_NUMBER)
                            prevToken.value+=parseFloat("0."+token.value);
                        else if (canQueueToken) {
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken(token);  // If breaks sequence, exits and pass token
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_BOOLEAN:
                    case K.TKN_STRING:{
                        if (canQueueToken) {
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken(token);
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_JSPROPERTY:{
                        if (canQueueToken) {
                            // Properties are calls with no arguments
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            token.action=K.ACT_SYMBOLMANIPULATION;
                            token.atLine=v.invokeLine;
                            token.manipulation=[
                                {
                                    action:K.ACT_CALL,
                                    atLine:v.invokeLine,
                                    arguments:[]
                                }
                            ];
                            addToken(token);
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_JSFETCHER:
                    case K.TKN_JSFUNCTION:
                    case K.TKN_SYMBOL:{
                        if (canQueueToken) {
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken(token);
                            this.pushParser("tokenManipulation",{
                                into:token,
                                quirks:{
                                    awaitClosedParenthesis:v.quirks.awaitClosedParenthesis,
                                    singleEqualIsEqualOperator:v.quirks.singleEqualIsEqualOperator,
                                    ignoreNewLines:v.quirks.ignoreNewLines,
                                    includeSpacedCommaInFetchers:v.quirks.includeSpacedCommaInFetchers
                                }
                            });
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_FUNCTION:{
                         // Anonymous function
                        if (canQueueToken) {
                            // Properties are calls with no arguments
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            token={ action:K.ACT_DEFINEFUNCTION, atLine:v.invokeLine };
                            addToken(token);
                            this.pushParser("defineFunction",{into:token});
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_TO:{
                        if (v.quirks.toEndsStatement) return this.returnPass(token);
                        else {
                            addToken();
                            v.endExpression=true;
                            if (v.expression.expression.length)
                                v.expression.from = Tools.clone(v.expression);
                            v.expression.action=K.ACT_RANGE;
                            delete v.expression.expression;
                            delete v.expression.modififiers;
                            this.pushParser("expression",{
                                into:v.expression,
                                intoKey:"to",
                                expressionModifiers:v.modifiers,
                                quirks:v.quirks
                            });
                        }
                        break;
                    }
                    case K.TKN_DOT:{
                        // Manages 3.5
                        if (prevToken && prevToken.type==K.TKN_NUMBER )
                            v.nextNumberIsDecimals=true;
                        // Manages .5
                        else if (!prevToken || (
                            prevToken.type==K.TKN_OPERATOR ||
                            prevToken.type==K.TKN_MODIFIER ||
                            prevToken.type==K.TKN_MODIFIERTRAILING ||
                            prevToken.type==K.TKN_MODIFIEROPERATOR ||
                            prevToken.type==K.TKN_STRINGQUEUE ||
                            prevToken.type==K.TKN_ASSIGN ||
                            prevToken.type==K.TKN_EQUALASSIGN
                        )) {
                            addToken(Tokens.newNumber(0));
                            v.nextNumberIsDecimals=true;
                        } else if (canQueueToken) {
                            token.atLine = currentLine;
                            return this.returnBreaker({atLine:currentLine},"Can't parse property");
                        }
                        break;
                    }
                    case K.TKN_OPENPARENTHESIS:{
                        if (canManipulateToken) {
                            addToken();
                            this.pushParser("tokenManipulation",{
                                into:prevToken
                            },token);
                        } else if (canQueueToken) {
                            // If breaks sequence, exits and pass token
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken();
                            this.pushParser("expression",{
                                into:v.data,
                                consumeParenthesis:K.TKN_CLOSEPARENTHESIS,
                                expressionModifiers:v.modifiers,
                                quirks:{
                                    // Don't close arguments until a closed parenthesis is found, allowing a(1,\n2)
                                    awaitClosedParenthesis:true,
                                    // Pass equal quirk
                                    singleEqualIsEqualOperator:v.quirks.singleEqualIsEqualOperator
                                }
                            });
                            delete v.modifiers;
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_SEMICOLON:{
                        return this.returnPass(token);
                        break;
                    }
                    case K.TKN_NEWLINE:{
                        // If waiting for a closed parenthesis ignore \n
                        if (v.quirks.awaitClosedParenthesis) return;
                        else if (v.quirks.ignoreNewLines) return;
                        // If the statement must have a token ignore \n
                        else if (v.quirks.forceToken && !v.tokenParsed) return;
                        else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_ASSIGN:{
                        return this.returnPass(token);
                        break;
                    }
                    case K.TKN_EQUALASSIGN:{
                        // Disable = for selected statements (i.e. PEEK A=3 is PEEK(A)=3)
                        if (v.quirks.disableEqual) return this.returnPass(token);
                        // Supports "a = 2" as equal operator. Use it in conditions
                        else if (v.quirks.singleEqualIsEqualOperator) {
                            token.type=K.TKN_OPERATOR;
                            addToken(token)
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_CLOSE:{
                        return this.returnPass(token);
                        break;
                    }
                    case K.TKN_STARTGETTER:{
                        // Inline arrays
                        if (canQueueToken) {
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken();
                            this.pushParser("inlineArray",{
                                into:v.data,
                                quirks:{
                                    // Supports if a = 2
                                    singleEqualIsEqualOperator:true,
                                    // Ignore new lines (array end is marked by TKN_ENDGETTER)
                                    ignoreNewLines:true
                                }
                            });
                        } else return this.returnPass(token);
                        break;
                    }
                    case K.TKN_QUESTIONMARK:{
                        // Ternary - Creates a sub-expression with expression parsed so far as ternary condition
                        addToken();
                        let condition={
                            action:K.ACT_EXPRESSION,
                            atLine:v.expression.currentLine,
                            expression:v.expression.expression,
                            modifiers:v.expression.modifiers
                        };
                        v.data=[];
                        v.expression.expression=v.data;
                        this.pushParser("ternary",{
                            into:v.data,
                            condition:condition
                        });
                        break;
                    }
                    case K.TKN_STARTCODEBLOCK:{
                        // Inline objects
                        if (canQueueToken) {
                            if (canStringQueueToken) addToken(Tokens.newStringQueue());
                            addToken();
                            this.pushParser("inlineObject",{
                                into:v.data,
                                quirks:{
                                    // Supports if a = 2
                                    singleEqualIsEqualOperator:true,
                                    // Ignore new lines (array end is marked by TKN_ENDCODEBLOCK)
                                    ignoreNewLines:true
                                }
                            });
                        } else return this.returnPass(token);
                        break;
                    }
                    default:{
                        if (v.consumeParenthesis!==null && (token.type==v.consumeParenthesis)) return true;
                        else return this.returnPass(token); // If breaks sequence, exits and pass token
                    }
                }
            }
        }
    },

    if:function(v,token,currentLine){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.spareTokens=[];
                    v.first=true;
                    v.state=1;
                }
                switch (v.state) {
                    case 1:{ // IF (condition)
                        v.state++;
                        this.pushParser("expression",{
                            into:v.into,
                            intoKey:"if",
                            quirks:{
                                // Supports if a = 2
                                singleEqualIsEqualOperator:true
                            }
                        },token);
                        break;
                    }
                    case 2:{ // [THEN] (action)
                        switch (token.type) {
                            case K.TKN_NEWLINE:
                            case K.TKN_THEN:{
                               break;
                            }
                            case K.TKN_SEMICOLON:{
                                // Condition with no action
                                v.state++;
                                break;
                            }
                            default:{
                                v.state++;
                                this.pushParser("statement",{
                                    into:v.into,
                                    intoKey:"then",
                                    atLine:currentLine,
                                    quirks:{
                                        // Support if (a==b) 30 as if (a==b) GOTO 30
                                        numbersAsGoto:true
                                    }
                                },token);
                                break;
                            }
                        }
                        break;
                    }
                    case 3:{ // Wait for else, if any...
                        switch (token.type) {
                            case K.TKN_ELSE:{
                               v.state++;
                               break;
                            }
                            case K.TKN_SEMICOLON:
                            case K.TKN_NEWLINE:{
                                // Still waiting for else, keeping tokens in memory...
                                v.spareTokens.push(token);
                                break;
                            }
                            default:{
                                // Else not found, push back all the previous tokens. If ended.
                                v.spareTokens.forEach(prevToken=>this.pushToken(prevToken));
                                this.pushToken(token);
                                return true;
                                break;
                            }
                        }
                        break;
                    }
                    case 4:{ // [ELSE] (action)
                        switch (token.type) {
                            case K.TKN_NEWLINE:{
                                break;
                            }
                            default:{
                                v.state++;
                                this.pushParser("statement",{
                                    into:v.into,
                                    intoKey:"else",
                                    atLine:currentLine
                                },token);
                            }
                        }
                        break;
                    }
                    case 5:{ // If ended
                        return this.returnPass(token);
                        break;
                    }
                }
            }
        }
    },

    defineFunction:function(v,token){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=true;
                    v.state=1;
                }
                switch (v.state) {
                    case 1:{
                        // FUNCTION A(...
                        switch (token.type) {
                            case K.TKN_JSPROPERTY:
                            case K.TKN_JSFUNCTION:
                            case K.TKN_SYMBOL:{
                                v.into.name=token;
                                break;
                            }
                            case K.TKN_OPENPARENTHESIS:{
                                v.into.arguments=[];
                                v.state++;
                                break;
                            }
                        }
                        break;
                    }
                    case 2:{
                        // DEF A(p1,p2)...
                        switch (token.type) {
                            case K.TKN_JSPROPERTY:
                            case K.TKN_JSFUNCTION:
                            case K.TKN_SYMBOL:{
                                v.into.arguments.push(token.value);
                                break;
                            }
                            case K.TKN_CLOSEPARENTHESIS:{
                                v.state++;
                                break;
                            }
                        }
                        break;
                    }
                    case 3:{
                        // DEF A(p1,p2)=...
                        if ((token.type != K.TKN_EQUALASSIGN) && (token.type != K.TKN_ASSIGN)) {
                            if (v.functionIsExpression)
                                this.pushParser("expression",{
                                    into:v.into,
                                    intoKey:"expression",
                                    quirks:{
                                        // Supports if a = 2
                                        singleEqualIsEqualOperator:true
                                    }
                                },token);
                            else {
                                this.pushParser("statement",{
                                    into:v.into,
                                    intoKey:"code",
                                    atLine:token.atLine,
                                    quirks:{
                                        // Support if (a==b) 30 as if (a==b) GOTO 30
                                        numbersAsGoto:true
                                    }
                                },token);
                            }
                            v.state++;
                        } else v.functionIsExpression=true;
                        break;
                    }
                    case 4:{
                        return this.returnPass(token);
                    }
                }
            }
        }
    },

    on:function(v,token,currentLine){
                                
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=true;
                    v.state=1;
                }
                switch (v.state) {
                    case 1:{
                        v.state++;
                        this.pushParser("expression",{
                            into:v.into,
                            intoKey:"condition",
                            quirks:{
                                // Supports if a = 2
                                singleEqualIsEqualOperator:true
                            }
                        },token);
                        break;
                    }
                    case 2:{
                        v.state++;
                        this.pushParser("statement",{
                            into:v,
                            intoKey:"statement",
                            atLine:currentLine,
                            quirks:{
                                // Support if (a==b) 30 as if (a==b) GOTO 30
                                numbersAsGoto:true,
                                // : are endlines (i.e. in ON X GOTO 10,20:PRINT is not ON X { GOTO 10; PRINT } but ON X GOTO 10,20:PRINT )
                                colonAsSemicolon:true
                            }
                        },token);
                        break;
                    }
                    case 3:{
                        v.into.options=[];
                        v.statement.command.manipulation[0].arguments.forEach(argument=>{
                            v.into.options.push({
                                action:K.ACT_RUNCOMMAND,
                                atLine:v.invokeLine,
                                command:{
                                    action:K.ACT_SYMBOLMANIPULATION,
                                    atLine:v.invokeLine,
                                    value:v.statement.command.value,
                                    type:K.TKN_JSFUNCTION,
                                    manipulation:[
                                        {
                                            action:K.ACT_CALL,
                                            atLine:v.invokeLine,
                                            arguments:[argument]
                                        }
                                    ]

                                }
                            });
                        });
                        return this.returnPass(token);
                        break;
                    }
                }
            }
        }
    },

    next:function(v,token,currentLine) {
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                switch (token.type) {
                    case K.TKN_JSPROPERTY:
                    case K.TKN_JSFUNCTION:
                    case K.TKN_SYMBOL:{
                        v.data.push(token);
                        break;
                    }
                    case K.TKN_NEXTARGUMENT:{
                        break;
                    }
                    default:{
                        if (v.data.length)
                            v.data.forEach(iterator=>this.pushToken(Tokens.newNextProcessed(iterator)));
                        else
                            this.pushToken(Tokens.newNextProcessed());
                        this.pushToken(token);
                        return true;
                    }
                }
            }
        }
    },

    conditionLoop:function(v,token,currentLine){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=1;
                    v.state=1;
                }
                switch (v.state) {
                    case 1:{
                        switch (token.type) {
                            case K.TKN_WHILE:{
                                // WHILE...
                                v.state++;
                                v.into.conditionFirst=true;
                                v.into.conditionIsContinue=true;
                                this.pushParser("expression",{
                                    into:v.into,
                                    intoKey:"condition",
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            case K.TKN_UNTIL:{
                                // UNTIL...
                                v.state++;
                                v.into.conditionFirst=true;
                                v.into.conditionIsEnd=true;
                                this.pushParser("expression",{
                                    into:v.into,
                                    intoKey:"condition",
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            case K.TKN_REPEAT:
                            case K.TKN_DO:{
                                // Loop code, wait for condition after
                                v.state=3;
                                this.pushParser("statement",{
                                    into:v.into,
                                    intoKey:"code",
                                    atLine:currentLine,
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:currentLine},"Bad loop structure",token);
                            }
                        }
                        break;
                    }
                    case 2:{
                        // Loop code
                        switch (token.type) {
                            case K.TKN_REPEAT:
                            case K.TKN_DO:{
                                break;
                            }
                            default:{
                                v.state=100;
                                this.pushParser("statement",{
                                    into:v.into,
                                    intoKey:"code",
                                    atLine:currentLine,
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                },token);
                            }
                        }
                        break;
                    }
                    case 3:{
                        switch (token.type) {
                            case K.TKN_WHILE:{
                                // WHILE...
                                v.state=100;
                                v.into.conditionIsContinue=true;
                                this.pushParser("expression",{
                                    into:v.into,
                                    intoKey:"condition",
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            case K.TKN_UNTIL:{
                                // UNTIL...
                                v.state=100;
                                v.into.conditionIsEnd=true;
                                this.pushParser("expression",{
                                    into:v.into,
                                    intoKey:"condition",
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:currentLine},"Bad loop structure",token);
                            }
                        }
                        break;
                    }
                    case 100:{
                        return this.returnPass(token);
                    }
                }
            }
        }
    },

    switch:function(v,token,currentLine){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_NEWLINE:
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=1;
                    v.state=1;
                    v.into.cases=[];
                }
                switch (v.state) {
                    case 1:{
                        // Value
                        v.state++;
                        this.pushParser("expression",{
                            into:v.into,
                            intoKey:"on",
                            quirks:{
                                ignoreNewLines:true
                            }
                        },token);
                        break;
                    }
                    case 2:{
                        // Wait for block
                        switch (token.type) {
                            case K.TKN_STARTCODEBLOCK:{
                                v.state++;
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:currentLine},"Bad switch structure",token);
                            }
                        }
                        break;
                    }
                    case 3:{
                        // Wait for cases or switch end
                        switch (token.type) {
                            case K.TKN_ENDCODEBLOCK:{
                                return true;
                                break;
                            }
                            case K.TKN_CASE:{
                                v.state++;
                                v.case={on:0,code:0};
                                v.into.cases.push(v.case);
                                this.pushParser("expression",{
                                    into:v.case,
                                    intoKey:"on",
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            case K.TKN_DEFAULT:{
                                v.state++;
                                v.case={onDefault:1,code:0};
                                v.into.cases.push(v.case);
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:currentLine},"Bad switch structure",token);
                            }
                        }
                        break;
                    }
                    case 4:{
                        // Wait for case code
                        switch (token.type) {
                            case K.TKN_COLON:{
                                v.state=3;
                                this.pushParser("statement",{
                                    into:v.case,
                                    intoKey:"code",
                                    atLine:currentLine,
                                    quirks:{
                                        ignoreNewLines:true
                                    }
                                });
                                break;
                            }
                            default:{
                                return this.returnBreaker({atLine:currentLine},"Bad switch structure",token);
                            }
                        }
                        break;
                    }
                }
            }
        }
    },

    for:function(v,token,currentLine){
        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=true;
                    v.state=1;
                }
                switch (v.state) {
                    case 1:{
                        // Detecting for type
                        if (token.type == K.TKN_OPENPARENTHESIS) {
                            // FOR (I...
                            v.state=200;
                            this.pushParser("statement",{
                                into:v.into,
                                intoKey:"initializeCode",
                                atLine:currentLine,
                                quirks:{
                                    ignoreNewLines:true
                                }
                            });
                        } else if (token.type == K.TKN_SYMBOL) {
                            // FOR I
                            v.state=100;
                            v.into.iterator=token;
                            this.pushParser("statement",{
                                into:v.into,
                                intoKey:"initializeCode",
                                atLine:currentLine,
                                quirks:{
                                    toEndsStatement:true
                                }
                            },token);
                        }
                        break;
                    }
                    case 100:{
                        // FOR I=1 ...
                        if (token.type == K.TKN_TO) {
                            v.state++;
                            this.pushParser("expression",{
                                into:v.into,
                                intoKey:"iteratorDestination",
                                quirks:{
                                    forceToken:true,
                                    singleEqualIsEqualOperator:true
                                }
                            });
                        }
                        break;
                    }
                   case 101:{
                        // FOR I=1 TO N ...
                        // ...STEP
                        if (token.type == K.TKN_STEP) {
                            this.pushParser("expression",{
                                into:v.into,
                                intoKey:"iteratorStep",
                                quirks:{
                                    forceToken:true
                                }
                            });
                        } else  {
                            v.state++;
                            this.pushParser("codeblock",{
                                into:v.into,
                                intoKey:"code",
                                // Next are automatically solved in FOR order - no iterator check
                                endCodeAt:0,
                                quirks:{
                                    // End the block at the NEXT statement
                                    manageNextStatements:true
                                }
                            },token);
                        }
                        break;
                    }
                    case 102:{
                        // FOR cycle ended.
                        return this.returnPass(token);
                        break;
                    }
                    case 200:{
                        // IF(__;...
                        v.state++;
                        this.pushParser("expression",{
                            into:v.into,
                            intoKey:"iterationCondition",
                            quirks:{
                                ignoreNewLines:true
                            }
                        });
                        break;
                    }
                    case 201:{
                        // IF(__;___;...
                        v.state++;
                        this.pushParser("statement",{
                            into:v.into,
                            intoKey:"iteration",
                            atLine:currentLine,
                            quirks:{
                                ignoreNewLines:true
                            }
                        });
                        break;
                    }
                    case 202:{
                        // IF (___;___;___) ...
                        v.state++;
                        this.pushParser("statement",{
                            into:v.into,
                            intoKey:"code",
                            atLine:currentLine,
                            quirks:{
                                ignoreNewLines:true,
                            }
                        });
                        break;
                    }
                    case 203:{
                        return this.returnPass(token);
                    }
                }
            }
        }
    },

    tokenManipulation:function(v,token,currentLine) {
        let endManipulation=(token)=>{
            if (v.forceCall && !v.into.manipulation.length) {
                v.into.manipulation.push({
                    action:v.callAction,
                    atLine:v.invokeLine,
                    arguments:[]
                });
            }
            return this.returnPass(token);
        };

        let prevToken=v.data[v.data.length-1];
        if (!v.first) {
            v.allowSpacedArguments=v.into.type !== K.TKN_SYMBOL;
            v.tokenType = v.into.type;
            v.callAction = v.tokenType == K.TKN_JSFETCHER ? K.ACT_FETCH : K.ACT_CALL;
            v.disableEqual = (v.const.noEqualStatements.indexOf(v.into.value)!=-1)
            v.argumentsCount = v.const.argumentsCount[v.into.value];
            v.forceCall = v.tokenType == K.TKN_JSFETCHER || v.tokenType == K.TKN_JSFUNCTION;
            v.first=1;
        }
        switch (token.type) {
            case K.TKN_SPACE:{
                // If allowSpacedArguments and the next token is a space it's a spaced call
                if (!v.first && v.allowSpacedArguments) v.spacedArgs = 1;
                break;
            }
            default:{
                if (v.first==1) {
                    v.first=2;
                    v.into.action=K.ACT_SYMBOLMANIPULATION;
                    v.into.atLine=v.invokeLine;
                    if (v.into.manipulation) v.data=v.into.manipulation;
                    else v.into.manipulation=v.data;
                    if (v.allowSpacedArguments) {
                        // Manages a"hello"
                        switch (token.type) {
                            case K.TKN_DOT: // PRINT.3 = PRINT 0.3
                            case K.TKN_NEXTARGUMENT:
                            case K.TKN_MODIFIER:
                            case K.TKN_MODIFIERTRAILING:
                            case K.TKN_MODIFIEROPERATOR:
                            case K.TKN_JSFETCHER:
                            case K.TKN_JSPROPERTY:
                            case K.TKN_JSFUNCTION:
                            case K.TKN_SYMBOL:
                            case K.TKN_NUMBER:
                            case K.TKN_BOOLEAN:
                            case K.TKN_STRING:{
                                v.spacedArgs=1;
                                break;
                            }
                        }
                    }
                }
                if (v.spacedArgs == 1) {
                    switch (token.type) {
                        case K.TKN_OPENPARENTHESIS:
                        case K.TKN_MODIFIER:
                        case K.TKN_MODIFIEROPERATOR:
                        case K.TKN_MODIFIERTRAILING:
                        case K.TKN_JSPROPERTY:
                        case K.TKN_JSFUNCTION:
                        case K.TKN_SYMBOL:
                        case K.TKN_JSFETCHER:
                        case K.TKN_NUMBER:
                        case K.TKN_BOOLEAN:
                        case K.TKN_STRING:
                        case K.TKN_DOT:
                        case K.TKN_NEXTARGUMENT: {
                            let call={action:v.callAction,atLine:currentLine,arguments:[]};
                            v.spacedArgs=2;
                            // a,"hello" is a call with the first argument empty
                            if (token.type == K.TKN_NEXTARGUMENT) {
                                // Include commas in streams (i.e. spacing in PRINT statements)
                                if (v.quirks.includeSpacedCommaInFetchers)
                                    return endManipulation(token);
                                else
                                    call.arguments.push({
                                        action:K.ACT_EXPRESSION,
                                        atLine:v.invokeLine,
                                        expression:[
                                            Tokens.newNull()
                                        ]
                                    });                               
                            }
                            v.data.push(call);
                            if (v.tokenType == K.TKN_JSFETCHER)
                                // Prepare a stream of arguments for the fetcher (i.e. PRINT "HELLO";A$;"!")
                                this.pushParser("fetcher",{
                                    into:call.arguments
                                },token);
                            else
                                // Prepare simple call, splitting arguments
                                this.pushParser("arguments",{
                                    into:call.arguments,
                                    quirks:{
                                        // Keep the = meaning and "PRINT A=1" is "PRINT (A == 1)"
                                        singleEqualIsEqualOperator:v.quirks.singleEqualIsEqualOperator || v.spacedArgs,
                                        // Disable equal for selected statements (i.e. PEEK A=3 is PEEK(A)=3)
                                        disableEqual:v.disableEqual,
                                        // Set a fixed number of arguments, if any
                                        argumentsCount:v.argumentsCount
                                    }
                                },token);
                            break;
                        }
                        default:
                            return endManipulation(token);
                    }
                } else {
                    switch (token.type) {
                        case K.TKN_OPENPARENTHESIS:{
                            // a(...)
                            let call={action:v.callAction,atLine:currentLine,arguments:[]};
                            v.data.push(call);
                            this.pushParser("arguments",{
                                into:call.arguments,                            
                                quirks:{
                                    // Don't close arguments until a closed parenthesis is found, allowing a(1,\n2)
                                    awaitClosedParenthesis:true,
                                    // Keep the = meaning
                                    singleEqualIsEqualOperator:v.quirks.singleEqualIsEqualOperator,
                                    // Set a fixed number of arguments, if any
                                    argumentsCount:v.argumentsCount
                                }
                            }, v.quirks.enableMixedArguments ? token : 0);
                            break;
                        }
                        case K.TKN_STARTGETTER:{
                            // a[...]
                            let get={action:K.ACT_GETARRAY,atLine:currentLine,arguments:0};
                            v.data.push(get);
                            this.pushParser("expression",{
                                into:get,
                                intoKey:"arguments",
                                consumeParenthesis:K.TKN_ENDGETTER,
                                quirks:{
                                    // Don't close arguments until a closed parenthesis is found, allowing a[1+\n2]
                                    awaitClosedParenthesis:true,
                                    // Keep the = meaning
                                    singleEqualIsEqualOperator:v.quirks.singleEqualIsEqualOperator,
                                    // Set a fixed number of arguments, if any
                                    argumentsCount:v.argumentsCount
                                }
                            });
                            break;
                        }
                        case K.TKN_DOT:{
                            // a.b
                            let get={action:K.ACT_GETPROPERTY,atLine:currentLine};
                            v.data.push(get);
                            this.pushParser("singleToken",{
                                into:get,
                                intoKey:"arguments"
                            });
                            break;
                        }
                        case K.TKN_NEXTARGUMENT:{
                            return endManipulation(token);
                            break;
                        }
                        default:{
                            // Unrecognized token: pass to caller
                            return endManipulation(token);
                        }
                    }
                }
            }
        }
    },

    data:function(v,token,currentLine) {
        function endEntry() {
            if (v.isString) v.entry=v.system.charmap.solveStringQuotes(v.entry);
            v.root.codeblock.data.push(v.entry);
            v.entry="";
            v.waittype=true;
            v.parsingString=false;
            v.isString=false;
        }

        if (!v.first) {
            v.first=1;
            v.waittype=true;
            v.parsing=false;
            v.entry="";
            return this.startRawMode();
        }
        switch (token.type) {
            case K.TKN_CLOSE:{
                endEntry();
                return this.returnPass(token);
                break;
            }
            case K.TKN_RAWCHAR:{
                switch (token.value) {
                    case " ":{
                        if (v.parsing)
                            v.entry+=token.value;
                        break;
                    }
                    case ",":{
                        if (v.parsingString)
                            v.entry+=token.value;
                        else
                            endEntry();
                        break;
                    }
                    case "\n":
                        endEntry();
                        token.type = K.TKN_NEWLINE;
                        return this.endRawMode(token);
                        break;
                    case ":":{
                        if (v.parsingString)
                            v.entry+=token.value;
                        else {
                            endEntry();
                            token.type = K.TKN_COLON;
                            return this.endRawMode(token);
                        }
                        break;
                    }
                    default:{                     
                        if (token.value ==  "\"")
                            if (v.waittype) {
                                v.isString=true;
                                v.parsingString=true;
                            } else v.parsingString=false;
                        else v.entry+=token.value;
                        v.waittype=false;
                        v.parsing=true;
                    }
                }
                break;
            }
            default:{
                return this.returnBreaker({atLine:currentLine},"Unmanaged data token type '"+token.type+"'",token);
                break;
            }
        }
       
    },

    defineClass:function(v,token,currentLine) {

        let
            endSymbol=()=>{
                if (v.createSymbolMethod) {
                    v.into.methods.push({ name:v.createSymbol, code:v.createSymbolMethod });
                } else if (v.createSymbolValue) {
                    v.into.variables.push({ name:v.createSymbol, value:v.createSymbolValue });
                }
                delete v.createSymbol;
                delete v.createSymbolValue;
                delete v.createSymbolMethod;
            },
            badClass=()=>this.returnBreaker({atLine:v.invokeLine},"Bad class definition",v.data);

        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                if (!v.first) {
                    v.first=true;
                    v.step=1;
                    v.into.variables=[];
                    v.into.methods=[];
                }
                switch (v.step) {
                    case 1:{
                        // Class scope definition
                        switch (token.type) {
                            case K.TKN_SYMBOL:{
                                if (!v.into.name) v.into.name = token;
                                else return badClass(); 
                                break;
                            }
                            case K.TKN_STARTCODEBLOCK:{
                                v.step++;
                                break;
                            }
                            default:{
                                return badClass();
                            }
                        }
                        break;
                    }
                    case 2:{
                        // Class definition
                        switch (token.type) {
                            case K.TKN_NEWLINE:
                            case K.TKN_SEMICOLON:{
                                return endSymbol();
                                break;
                            }
                            case K.TKN_FUNCTION:{
                                if (!v.createSymbol)
                                    v.symbolIsFunction=true;
                                else return badClass(); 
                                break;
                            }
                            case K.TKN_OPENPARENTHESIS:{
                                if (v.createSymbol && !v.createSymbolMethod && !v.createSymbolValue) {
                                    v.symbolIsFunction=true;
                                    v.createSymbolMethod={  action:K.ACT_DEFINEFUNCTION, atLine:v.currentLine };
                                    this.pushParser("defineFunction",{into:v.createSymbolMethod},token);
                                } else return badClass(); 
                                break;
                            }
                            case K.TKN_COLON:
                            case K.TKN_ASSIGN:
                            case K.TKN_EQUALASSIGN:{
                                if (!v.createSymbolMethod && !v.createSymbolValue)
                                    this.pushParser("expression",{
                                        into:v,
                                        intoKey:"createSymbolValue",
                                        quirks:{
                                            // Supports if a = 2
                                            singleEqualIsEqualOperator:true
                                        }
                                    });
                                else return badClass(); 
                                break;
                            }
                            case K.TKN_SYMBOL:{
                                if (!v.createSymbolMethod && !v.createSymbolValue)
                                    v.createSymbol = token;
                                else
                                    return badClass(); 
                                break;
                            }
                            case K.TKN_ENDCODEBLOCK:{
                                endSymbol();
                                return true;
                            }
                            default:{
                                return badClass();
                            }
                        }
                    }
                }
            }
        }
    },

    statement:function(v,token,currentLine){

        let resetStatement=()=>{
            v.data.length=0;
        }

        let endStatement=(token)=>{
            if (!v.token && v.data.length) {
                if (v.data.length>1) debugger;
                v.data=v.data[0];
                let isStatementCall =
                    (v.data.action==K.ACT_SYMBOLMANIPULATION) &&
                    v.data.manipulation[0] &&
                    v.data.manipulation[0].action == K.ACT_CALL;

                if ( 
                    isStatementCall &&
                    v.quirks.enableSpecialStatements &&
                    (v.const.spreadStatements.indexOf(v.data.value)!=-1)
                ) {
                    // Manage spreaded statements
                    v.token={
                        action:K.ACT_CODEBLOCK,
                        atLine:v.invokeLine,
                        code:[]
                    }
                    v.data.manipulation[0].arguments.forEach(manipulation=>{
                        let
                            submanipulation = manipulation.expression[0].manipulation,
                            subject = [],
                            dimensions = [];

                        submanipulation.forEach(item=>{
                            if (item.action == K.ACT_CALL) dimensions.push(item);
                            else subject.push(item);
                        });
                        if (!dimensions.length)
                            // DIM A -> A=DIM()
                            dimensions.push({
                                action:K.ACT_CALL,
                                atLine:manipulation.atLine,
                                arguments:[]
                            });
                        v.token.code.push({
                            action:K.ACT_ASSIGN,
                            atLine:v.invokeLine,
                            to:{
                                action:K.ACT_SYMBOLMANIPULATION,
                                atLine:v.invokeLine,
                                type:manipulation.expression[0].type,
                                value:manipulation.expression[0].value,
                                manipulation:subject
                            },
                            value:{
                                action:K.ACT_EXPRESSION,
                                atLine:v.invokeLine,
                                expression:[
                                    {
                                        action:K.ACT_SYMBOLMANIPULATION,
                                        atLine:v.invokeLine,
                                        value:v.data.value,
                                        type:K.TKN_JSFUNCTION,
                                        manipulation:dimensions
                                    }
                                ]
                            }
                        });
                    })
                } else if ( 
                    isStatementCall &&
                    v.quirks.enableSpecialStatements &&
                    (v.const.flipStatements.indexOf(v.data.value)!=-1)
                ) {
                    // Manage flipped statements
                    v.token={
                        action:K.ACT_CODEBLOCK,
                        atLine:v.invokeLine,
                        code:[]
                    }
                    v.data.manipulation[0].arguments.forEach(manipulation=>{
                        v.token.code.push({
                            action:K.ACT_ASSIGN,
                            atLine:v.invokeLine,
                            to:manipulation.expression[0],
                            value:{
                                action:K.ACT_EXPRESSION,
                                atLine:v.invokeLine,
                                expression:[
                                    {
                                        action:K.ACT_SYMBOLMANIPULATION,
                                        atLine:v.invokeLine,
                                        value:v.data.value,
                                        type:K.TKN_JSFUNCTION,
                                        manipulation:[{action:K.ACT_CALL,atLine:v.invokeLine,arguments:[]}]
                                    }
                                ]
                            }
                        });
                    })
                } else {
                    // Statements with a single manipulation are execution with no arguments (END, RETURN, etc.)
                    if ((v.data.action == K.ACT_SYMBOLMANIPULATION) && (v.data.manipulation.length==0))
                        v.data.manipulation.push({action:v.callAction,atLine:v.invokeLine,arguments:[]})
                    v.token={
                        action:K.ACT_RUNCOMMAND,
                        atLine:v.invokeLine,
                        command:v.data
                    };
                }
            }
            if (v.token) {
                if (v.intoKey!==undefined) v.into[v.intoKey]=v.token;
                else if (v.into) v.into.push(v.token);
            }
            return this.returnPass(token);
        }

        let prevToken=v.data[v.data.length-1];
        switch (token.type) {
            case K.TKN_SPACE:{
                break;
            }
            default:{
                let isFirstToken=!v.token && !v.data.length;
                switch (token.type) {
                    case K.TKN_TO:
                    case K.TKN_CLOSE:
                    case K.TKN_NEWLINE:
                    case K.TKN_SEMICOLON:{
                        // Ignore new lines in sub-statements as FOR(...;...;...)
                        if ((token.type ==  K.TKN_NEWLINE) && v.quirks.ignoreNewLines ) return;
                        // Manage the TO of a FOR ... TO ... cycle.
                        else if ((token.type == K.TKN_TO) && v.quirks.toEndsStatement) return endStatement(token);
                        else if (!prevToken || (prevToken.type!=K.TKN_OPERATOR)) return endStatement(token);
                        break;
                    }
                    case K.TKN_JSFETCHER:
                    case K.TKN_JSPROPERTY:
                    case K.TKN_JSFUNCTION:
                    case K.TKN_SYMBOL:{
                        if (isFirstToken) {
                            v.callAction = token.type == K.TKN_JSFETCHER ? K.ACT_FETCH : K.ACT_CALL;
                            if (v.const.ignoreStatements && (v.const.ignoreStatements.indexOf(token.value)!=-1))
                                return;
                            else {
                                v.data.push(token);
                                this.pushParser("tokenManipulation",{
                                    into:token,
                                    quirks:{
                                        enableMixedArguments:v.quirks.enableMixedArguments
                                    }
                                });
                            }
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_IF:{
                        if (isFirstToken) {
                            v.token={ action:K.ACT_IF, atLine:v.invokeLine };
                            this.pushParser("if",{into:v.token });
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_ON:{
                        if (isFirstToken) {
                            v.token={ action:K.ACT_ON, atLine:v.invokeLine };
                            this.pushParser("on",{into:v.token });
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_FOR:{
                        if (isFirstToken) {
                            v.token={  action:K.ACT_FOR, atLine:v.invokeLine };
                            this.pushParser("for",{into:v.token});
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_FUNCTION:{
                        if (isFirstToken) {
                            v.token={  action:K.ACT_DEFINEFUNCTION, atLine:v.invokeLine };
                            this.pushParser("defineFunction",{into:v.token});
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_UNTIL:
                    case K.TKN_REPEAT:
                    case K.TKN_WHILE:
                    case K.TKN_DO:{
                        if (isFirstToken) {
                            v.token={  action:K.ACT_CONDITIONLOOP, atLine:v.invokeLine };
                            this.pushParser("conditionLoop",{into:v.token},token);
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_SWITCH:{
                        if (isFirstToken) {
                            v.token={  action:K.ACT_SWITCH, atLine:v.invokeLine };
                            this.pushParser("switch",{into:v.token});
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_CLASS:{
                        if (isFirstToken) {
                            v.token={  action:K.ACT_DEFINECLASS, atLine:v.invokeLine };
                            this.pushParser("defineClass",{into:v.token});
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_DATA:{
                        if (isFirstToken) {
                            v.token={
                                action:K.ACT_NOOP,
                                atLine:v.invokeLine
                            };
                           this.pushParser("data",0,token);
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_ASSIGN:
                    case K.TKN_EQUALASSIGN:{
                        if (!v.token) {
                            // The left side of an assignment must be a symbolmanipulation (a[3]=2)
                            if (prevToken && prevToken.action== K.ACT_SYMBOLMANIPULATION) {
                                v.token={
                                    action:K.ACT_ASSIGN,
                                    atLine:v.invokeLine,
                                    symbol:token.value,
                                    to:v.data[0],
                                    value:0
                                };
                                this.pushParser("expression",{
                                    into:v.token,
                                    intoKey:"value",
                                    quirks:{
                                        ignoreNewLines:v.quirks.ignoreNewLines,
                                        // TO ends statement, inherit from FOR cycle
                                        toEndsStatement:v.quirks.toEndsStatement,
                                        // A=A$=1 is A=A$ == 1
                                        singleEqualIsEqualOperator:true
                                    }
                                });
                            } else return this.returnBreaker({atLine:v.invokeLine},"Bad variable assignment",v.data);
                        }
                         else return endStatement(token);
                        break;
                    }
                    case K.TKN_COLON:{
                        // If it's a label (i.e. label:)
                        if (v.system.registry.quirkCodeLabels && v.data.length == 1 && !v.data[0].manipulation.length) {
                            let label = { codeblock:v.codeblock, index: v.codeblock.code.length };
                            v.root.codeblock.labels[v.data[0].value] = label;
                            v.codeblock.labels[v.data[0].value]=label;
                            resetStatement();
                        } else
                        // If it's a new line of a : codeblock, add this
                        if (v.quirks.colonAsSemicolon) return endStatement(token);
                        else {
                            // Creates a local codeblock.
                            endStatement();
                            this.pushParser("codeblock",{
                                into:v,
                                intoKey:"token",
                                // Inherit endCodeAt from previous codeblock or use newline
                                endCodeAt:v.quirks.codeBlockEndCodeAt || K.TKN_NEWLINE,
                                quirks:{
                                    // The first line of the codeblock is the already parsed one
                                    firstLine:v.token,
                                    // Passes the block ender to the parent, so it closes it if they're using the same endCodeAt
                                    passEndCode:true,
                                    // Other : are like ;
                                    colonAsSemicolon:true,
                                    // Next statements are passed to previous codeblock parser
                                    passNext:true
                                }
                            });
                        }
                        break;
                    }
                    case K.TKN_STARTCODEBLOCK:{
                        if (isFirstToken) {
                           this.pushParser("codeblock",{
                                into:v,
                                intoKey:"token",
                                endCodeAt:K.TKN_ENDCODEBLOCK
                            });
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_MODIFIER:
                    case K.TKN_MODIFIERTRAILING:
                    case K.TKN_MODIFIEROPERATOR:{
                        if (!v.token) {
                            // Parsing an expression with no statement. Push back all tokens back in the right order...
                            v.data.forEach(prevToken=>this.pushToken(prevToken));
                            this.pushToken(token);
                            v.data=[];
                            // ...and parse it as expression.
                            this.pushParser("expression",{
                                into:v,
                                intoKey:"token",
                                quirks:{
                                    // Supports if a = 2
                                    singleEqualIsEqualOperator:true
                                }
                            });
                        } else return endStatement(token);
                        break;
                    }
                    case K.TKN_NUMBER:{
                        if (v.quirks.numbersAsGoto) {
                            v.token={
                                action:K.ACT_RUNCOMMAND,
                                atLine:v.invokeLine,
                                command:{
                                    action:K.ACT_SYMBOLMANIPULATION,
                                    atLine:v.invokeLine,
                                    type:K.TKN_JSFUNCTION,
                                    value:"GOTO",
                                    manipulation:[{
                                        action:K.ACT_CALL,
                                        atLine:v.invokeLine,
                                        arguments:[
                                            {
                                                action:K.ACT_EXPRESSION,
                                                atLine:v.invokeLine,
                                                expression:[token]
                                            }
                                        ]
                                    }]
                                }
                            };
                        } else endStatement(token);
                        break;
                    }
                    default:{
                        return endStatement(token);
                    }
                }
            }
        }
    },

    codeblock:function(v,token,currentLine) {
        if (!v.codeblock) {
            v.codeblock={
                action:K.ACT_CODEBLOCK,
                atLine:currentLine,
                code:[],
                labels:{}
            };
            if (v.isRoot) v.codeblock.data=[];
            if (v.intoKey!==undefined) v.into[v.intoKey]=v.codeblock;
            else if (v.into) v.into.push(v.codeblock);
        }
        if (v.quirks.firstLine) {
            // A statement that became a code block like "PRINT:PRINT"
            v.codeblock.code.push(v.quirks.firstLine);
            delete v.quirks.firstLine;
        }
        let prevLine=v.codeblock.code[v.codeblock.code.length-1];
        if (v.endCodeAt!==undefined && (token.type == v.endCodeAt)) {
            return v.quirks.passEndCode ? this.returnPass(token) : true;
        } else switch (token.type) {
            case K.TKN_COLON:
            case K.TKN_SPACE:
            case K.TKN_SEMICOLON:
            case K.TKN_NEWLINE:{
                break;
            }
            case K.TKN_CLOSE:{
                if (v.isRoot) return;
                else return this.returnPass(token);
                break;
            }
            case K.TKN_NUMBER:{
                // Line numbers are managed as global labels
                let label = { codeblock:v.codeblock, index: v.codeblock.code.length };
                v.root.codeblock.labels[token.value] = label;
                v.codeblock.labels[token.value]=label;
                break;
            }
            case K.TKN_NEXT:{
                if (v.quirks.passNext) return this.returnPass(token);
                else this.pushParser("next");
                break;
            }
            case K.TKN_NEXTPROCESSED:{
                v.codeblock.code.push({
                    action:K.ACT_NEXT,
                    atLine:v.invokeLine,
                    iterator:token.value
                });
                return v.quirks.manageNextStatements;
                break;
            }
            default:{
                this.pushParser("statement",{
                    prevLine:prevLine,
                    into:v.codeblock.code,
                    intoKey:v.codeblock.code.length,
                    atLine:currentLine,
                    codeblock:v.codeblock,
                    quirks:{
                        colonAsSemicolon:v.quirks.colonAsSemicolon,
                        // Inherit for a:b:c codeblocks
                        codeBlockEndCodeAt:v.endCodeAt,
                        // Enable special statements like DIM A(1),B(2),C(3) => A=DIM(1), B=DIM(2), C=DIM(3)
                        enableSpecialStatements: true,
                        // Enable mixed arguments methods like POKE(1+2),3
                        enableMixedArguments: true
                    }
                },token);
            }
        }
    }

}};
