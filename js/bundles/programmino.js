DreamBuilder.addPackages({
    name:"programmino",
    description:"Provides Programmino basic features.",
    packages:[
        {
            name:"programmino",
            description:"Adds all Programmino systems common features.",
            requires:[
                "operators-programmino",
                "modifiers-programmino",
                "statements-programmino-io",
                "statements-programmino-time",
                "statements-programmino-math",
                "statements-programmino-codeflow",
                "statements-programmino-arrays",
                "statements-programmino-data",
                "statements-programmino-memory",
                "statements-programmino-strings",
                "statements-programmino-debugging",
                "statements-programmino-ignored",
                "foundation-programmino",
            ]
        },
        {
            name:"programmino-base",
            description:"Adds Programmino core features.",
            requires:[
                "programmino",
                "operators-programmino-accentpower",
            ]
        },
        {
            name:"programmino-advanced",
            description:"Adds Programmino core and advanced features.",
            requires:[
                "programmino",
                "modifiers-programmino-advanced",
                "statements-programmino-advanced",
                "foundation-programmino-advanced",
                "assignments-programmino-advanced",
                "operators-programmino-advanced",
                "oop-programmino-advanced",
                "operators-programmino-accentxor",
            ]
        },
        {
            name:"operators-programmino",
            description:"Adds common operators.",
            contains:{               
                operators:[
                    {
                        tokens:["+"],
                        description:"Sum values.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value+b.value)
                    },{
                        tokens:["-"],
                        description:"Subtracts values.",
                        priority:1,
                        code:(v,a,b)=>Tokens.newNumber(a.value-b.value),
                    },{
                        tokens:["*"],
                        description:"Multiply values.",
                        priority:0,
                        code:(v,a,b)=>Tokens.newNumber(a.value*b.value),
                    },{
                        tokens:["/"],
                        description:"Divide values.",
                        priority:0,
                        code:(v,a,b)=>Tokens.newNumber(a.value/b.value),
                    },{
                        tokens:["=","=="],
                        description:"Check values equality.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value==b.value),
                    },{
                        tokens:[">"],
                        description:"Check if x is greater than y.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value>b.value),
                    },{
                        tokens:["<"],
                        description:"Check if x is lower than y.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value<b.value),
                    },{
                        tokens:[">=","=>"],
                        description:"Check if x is greater or equal than y.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value>=b.value),
                    },{
                        tokens:["<=","=<"],
                        description:"Check if x is lower or equal than y.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value<=b.value),
                    },{
                        tokens:["<>","!="],
                        description:"Check values inequality.",
                        priority:2,
                        code:(v,a,b)=>v.system.logic.encodeBoolean(a.value!=b.value),
                    },{
                        tokens:["OR","||"],
                        description:"Perform OR between two values.",
                        priority:4,
                        code:(v,a,b)=>v.system.logic.or(a,b),
                    },{
                        tokens:["AND","&&"],
                        description:"Perform AND between two values.",
                        priority:3,
                        code:(v,a,b)=>v.system.logic.and(a,b),
                    },{
                        tokens:["MOD","%"],
                        description:"Gets x module y.",
                        priority:1,
                        code:(v,a,b)=>Tokens.newNumber(a.value%b.value),
                    }
                ]
            }
        },
        {
            name:"operators-programmino-accentpower",
            description:"Adds ^ as x to the power of y.",
            contains:{               
                operators:[
                   {
                        tokens:["^"],
                        description:"Gets the of x to the power of y.",
                        priority:0,
                        code:(v,a,b)=>Tokens.newNumber(Math.pow(a.value,b.value)),
                    }
                ]
            }
        },
        {
            name:"modifiers-programmino",
            description:"Adds common value modifiers.",
            contains:{
                modifiers:[
                    {
                        tokens:["-"],
                        description:"Inverts a number.",
                        code:(v,trail,v1)=>Tokens.newNumber(-v1.value)
                    },{
                        tokens:["!"],
                        description:"Negates a boolean.",
                        code:(v,trail,v1)=>v.system.logic.not(v1.value)
                    },{
                        tokens:["+"],
                        description:"Converts to number.",
                        code:(v,trail,v1)=>Tokens.newNumber(parseFloat(v1.value))
                    }
                ]
            }
        },
        {
            name:"modifiers-programmino-advanced",
            description:"Adds advanced value modifiers.",
            contains:{
                modifiers:[
                   {
                        tokens:["++"],
                        description:"Increments a variable.",
                        isTrailable:true,
                        code:(v,trail,v1)=>{
                            if (!v1.into[v1.intoKey]) v1.into[v1.intoKey]=Tokens.newNumber(0);
                            v1.into[v1.intoKey].value++;
                            if (!trail) v1.value++;
                            return v1;
                        }
                    },{
                        tokens:["--"],
                        description:"Decrements a variable.",
                        isTrailable:true,
                        code:(v,trail,v1)=>{
                            if (!v1.into[v1.intoKey]) v1.into[v1.intoKey]=Tokens.newNumber(0);
                            v1.into[v1.intoKey].value--;
                            if (!trail) v1.value--;
                            return v1;
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-advanced",
            description:"Adds advanced statements.",
            contains:{
                statements:[
                    {
                        tokens:["BREAK"],
                        description:"Break the current cycle.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v,v1) {
                            return this.returnBackToType("isCycle",true,"stopCycle",true);
                        }
                    },{
                        tokens:["?"],
                        description:"Starts a ternary.",
                        type:"token",
                        token: K.TKN_QUESTIONMARK
                    }
                ]
            }
        },
        {
            name:"operators-programmino-advanced",
            description:"Adds advanced operators.",
            contains:{               
                operators:[
                    {
                        tokens:[">>"],
                        description:"Bitwise right shifted value.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value >> b.value)
                    },{
                        tokens:[">>>"],
                        description:"Unsigned bitwise right shifted value.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value >>> b.value)
                    },{
                        tokens:["<<"],
                        description:"Bitwise left shifted value.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value << b.value)
                    },{
                        tokens:["&"],
                        description:"Bitwise AND shifted values.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value & b.value)
                    },{
                        tokens:["|"],
                        description:"Bitwise OR value.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value | b.value)
                    },{
                        tokens:["**"],
                        description:"Exponent value.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value ** b.value)
                    }
                ]
            }
        },
        {
            name:"operators-programmino-accentxor",
            description:"Adds ^ as x XOR y.",
            contains:{               
                operators:[
                    {
                        tokens:["^"],
                        description:"Bitwise XOR values.",
                        priority:1,
                        code:(v,a,b)=>Tokens.new(a.value ^ b.value)
                    }
                ]
            }
        },
        {
            name:"statements-programmino-io",
            description:"Adds common I/O statements.",
            contains:{
                statements:[
                    {
                        tokens:["POS"],
                        description:"Returns horizontal cursor position on the screen.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            if (v.system.registry.quirkFake80Columns)
                                return this.returnValue(Tokens.newNumber(v.system.display.cursorGetX()+(v.system.display.cursorGetY()%2?v.system.display.textGetWidth():0)));
                            else
                                return this.returnValue(Tokens.newNumber(v.system.display.cursorGetX()));
                        }
                    },{
                        tokens:["PRINT"],
                        description:"Prints text on the screen.",
                        type:"jsFetcher",
                        code:{
                            start:function(v) {
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                v._status=v.system.display.cursorGetStatus();
                            },
                            fetch:function(v,v1) {
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                if (v.system.registry._printNewLine) {
                                    v.system.display.textCarriageReturn();
                                    delete v.system.registry._printNewLine;
                                }
                                switch (v1.type) {
                                    case K.TKN_NEXTARGUMENT:{
                                        v.system.display.textPrintComma();
                                        v._semicolon=true;
                                        break;
                                    }
                                    case K.TKN_TAB:{
                                        v.system.display.textPrintTab(v1.value);
                                        break;
                                    }
                                    case K.TKN_SEMICOLON:{
                                        v._semicolon=true;
                                        break;
                                    }
                                    case K.TKN_NULL:{
                                        break;
                                    }
                                    default:{
                                        v.system.display.textPrint(Tokens.tokenToString(v1,v.system.registry.quirkPrintNoExtraSpaces));
                                    }
                                }
                            },
                            end:function(v) {
                                if (v.system.registry.quirkRememberCursorAttributes)
                                    v.system.display.cursorSetStatus(v._status);
                                v.system.display.cursorSetInvert(false);
                                if (!v._semicolon)
                                    if (v.system.registry.quirkNewLineOnNextPrint) v.system.registry._printNewLine=true;
                                    else v.system.display.textCarriageReturn();
                                return Tokens.newNumber(0);
                            }
                        }
                    },{
                        tokens:["INPUT"],
                        description:"Asks the user to input a value.",
                        type:"jsFetcher",
                        code:{
                            start:function(v) {
                                v._first=true;
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                v._status=v.system.display.cursorGetStatus();
                            },
                            fetch:function(v,v1) {
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                if (v.system.registry._printNewLine) {
                                    v.system.display.textCarriageReturn();
                                    delete v.system.registry._printNewLine;
                                }
                                if (v1.variableName) {
                                    if (v._first) {
                                        if (!v.system.registry.quirkInputNoQuestionMark) v.system.display.textPrint("? ");
                                        v._first=false;
                                    } else
                                        v.system.display.textPrint(" ");
                                    v.system.display.textInput({
                                        alwaysUppercase:v.system.registry.quirkInputAlwaysUppercase
                                    },(value)=>{
                                        let type;
                                        if (v.system.registry.quirkInputAlwaysStrings)
                                            type = K.TKN_STRING;
                                        else
                                            // dollar-trailing variables always contains uppercase strings
                                            type = Tokens.getTokenTypeByName(v1.variableName.value);
                                        switch (type) {
                                            case K.TKN_STRING:{
                                                token=Tokens.newString(value);
                                                break;
                                            }
                                            case K.TKN_NUMBER:{
                                                let numberval=parseFloat(value);
                                                if (numberval==value) token=Tokens.newNumber(numberval);
                                                else return "Invalid input\nExpected number";
                                                break;
                                            }
                                            case K.TKN_NULL:{
                                                token=Tokens.newString(value);
                                                break;
                                            }
                                            default:{
                                                return "Input unsupported for token type '"+type+"'";
                                            }
                                        }
                                        Tokens.setPointerOrCopy(v1,token);
                                        this.returnContinueFetch();
                                    });
                                    return this.returnPauseFetch();
                                } else
                                    switch (v1.type) {
                                        case K.TKN_NEXTARGUMENT:{
                                            v.system.display.textPrint(" ");
                                            v._semicolon=true;                                            
                                            break;
                                        }
                                        case K.TKN_TAB:{
                                            v.system.display.textPrintTab(v1.value);
                                            break;
                                        }
                                        case K.TKN_SEMICOLON:{
                                            v._semicolon=true;
                                            break;
                                        }
                                        case K.TKN_NULL:{
                                            break;
                                        }
                                        default:{
                                            v.system.display.textPrint(Tokens.tokenToString(v1,v.system.registry.quirkPrintNoExtraSpaces));
                                        }
                                    }
                            },
                            end:function(v) {
                                if (v.system.registry.quirkRememberCursorAttributes)
                                    v.system.display.cursorSetStatus(v._status);
                                v.system.display.cursorSetInvert(false);
                                if (!v._semicolon)
                                    if (v.system.registry.quirkNewLineOnNextPrint) v.system.registry._printNewLine=true;
                                    else v.system.display.textCarriageReturn();
                                return Tokens.newNumber(0);
                            }
                        }
                    },{
                        tokens:["WAIT"],
                        description:"Wait for a given amount or seconds or for a memory location to match a mask.",
                        type:"jsFunction",
                        code:function(v,v1,v2,v3) {
                            if (v2) {
                                // Wait for memory address to change
                                function schedule(self) {
                                    setTimeout(()=>{
                                        let peek = v.system.memory.syncPeek(v1.value);
                                        if (peek === null) 
                                            self.returnContinueBreaker(v,"Wait to unsupported memory area '"+v1.value+"'");
                                        else {
                                            let match = peek & v2.value;
                                            if (v3) match=!match;
                                            if (match) return self.returnContinue(Tokens.newNumber(0));
                                            else schedule(self);
                                        }
                                    }, 1);
                                }
                                schedule(this);
                            } else {
                                // Wait seconds
                                setTimeout(()=>this.returnContinue(Tokens.newNull()), v1.value*1000);
                            }
                            return this.returnWait();
                        }
                    },{
                        tokens:["CLS"],
                        description:"Clear the screen.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v) {
                            v.system.display.textClear();
                            if (v.system.registry.quirkClearSetBackgroundColor)
                                v.system.display.screenSetBgColorAsCursorBgColor();
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["GET"],
                        description:"Wait the user to hit a key.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            return this.returnWaitTick(()=>{
                                let key = v.system.display.keyboardGetPressed();
                                let token = Tokens.newString( key==0 ? "" : v.system.charmap.keyCodeToString(key));
                                Tokens.setPointerOrCopy(v1,token);
                                return this.returnContinue(token);                    
                            });
                        }
                    }, {
                        tokens:["TAB"],
                        description:"Spaces to a position on the screen.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            return this.returnValue(Tokens.newTab(v1.value));
                        }
                    },{
                        tokens:["SPC"],
                        description:"Move the cursor to the right.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            let out = "";
                            for (let i=0;i<v1.value;i++) out+=v.system.charmap.specialCharToString(D.CHAR_RIGHT);
                            return this.returnValue(Tokens.newString(out));
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-time",
            description:"Adds time functions.",
            contains:{
                statements:[
                    {
                        tokens:["TIME$"],
                        description:"Returns the time as a string in HHIISS format.",
                        type:"jsProperty",
                        code:{
                            initialize:function(S) {
                                S.registry.TIME = {
                                    started:new Date(),
                                    h:0,
                                    m:0,
                                    s:0
                                };
                            },
                            set:function(v,v1){
                                v.system.registry.TIME = {
                                    started:(new Date()).getTime(),
                                    h:parseInt(v1.value.substr(0,2)),
                                    m:parseInt(v1.value.substr(2,2)),
                                    s:parseInt(v1.value.substr(4,2))
                                };
                                return v1;
                            },
                            get:function(v) {
                                let
                                    h=v.system.registry.TIME.h,
                                    m=v.system.registry.TIME.m,
                                    s=v.system.registry.TIME.s,
                                    passed=Math.floor(((new Date()).getTime()-v.system.registry.TIME.started)/1000);
                                s+=passed;
                                if (s>59) {
                                    m+=Math.floor(s/60);
                                    s=s%60;
                                }
                                if (m>59) {
                                    h+=Math.floor(m/60);
                                    m=m%60;
                                }
                                if (h>23) h=h%24;
                                return Tokens.newString(h.toString().padStart(2,"0")+m.toString().padStart(2,"0")+s.toString().padStart(2,"0"));
                            }
                        }
                    },
                    {
                        tokens:["TIME"],
                        description:"Returns the time as number of seconds.",
                        type:"jsProperty",
                        code:{
                            set:function(v,v1){
                                v.system.registry.TIME = {
                                    started:(new Date()).getTime(),
                                    h:Math.floor(v1.value/3600)%24,
                                    m:Math.floor(v1.value/60)%60,
                                    s:v1.value%60,
                                };
                                return v1;
                            },
                            get:function(v) {
                                let
                                    h=v.system.registry.TIME.h,
                                    m=v.system.registry.TIME.m,
                                    s=v.system.registry.TIME.s,
                                    passed=Math.floor(((new Date()).getTime()-v.system.registry.TIME.started)/1000);
                                s+=passed;
                                if (s>59) {
                                    m+=Math.floor(s/60);
                                    s=s%60;
                                }
                                if (m>59) {
                                    h+=Math.floor(m/60);
                                    m=m%60;
                                }
                                if (h>23) h=h%24;
                                return Tokens.newNumber(s+(m*60)+(h*3600));
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-math",
            description:"Adds math statements.",
            contains:{
                statements:[
                    {
                        tokens:["RND"],
                        description:"Returns a random float number between 0 and 1.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){
                            let seed = v.system.registry._randomSeed;
                            if (seed == undefined) seed = Math.random() * 65536;
                            if (v1 && v1.value<0) seed = -v1.value;
                            seed = ( seed * 9301 + 49297) % 233280;
                            v.system.registry._randomSeed = seed;
                            let rnd = seed / 233280;
                            if (!v1 || (v1.value == 0)) rnd = Math.floor(rnd * 256)/256;
                            return this.returnValue(Tokens.newNumber(rnd));
                        }
                    },{
                        tokens:["NOT"],
                        description:"Negates a value.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(v.system.logic.not(v1.value))}
                    },{
                        tokens:["SGN"],
                        description:"Returns 1, -1, or 0 if the number is greater, lower, or equal than 0.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(v1.value==0?0:v1.value>0?1:-1))}
                    },{
                        tokens:["INT"],
                        description:"Returns the integer value of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.floor(v1.value)))}
                    },{
                        tokens:["SIN"],
                        description:"Returns the sine of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.sin(v1.value)))}
                    },{
                        tokens:["SQR"],
                        description:"Returns the square root of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.sqrt(v1.value)))}
                    },{
                        tokens:["COS"],
                        description:"Returns the cosine of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.cos(v1.value)))}
                    },{
                        tokens:["ABS"],
                        description:"Returns the absolute value of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.abs(v1.value)))}
                    },{
                        tokens:["LOG"],
                        description:"Returns the natural logarithm of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.log(v1.value)))}
                    },{
                        tokens:["ATN"],
                        description:"Returns the arctangent of a number in radians.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.atan(v1.value)))}
                    },{
                        tokens:["EXP"],
                        description:"Returns the Euler's number raised to given power.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.exp(v1.value)))}
                    },{
                        tokens:["TAN"],
                        description:"Returns the tangent of a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(Math.tan(v1.value)))}
                    },{
                        tokens:["PI"],
                        description:"Returns the approximated ratio of the circumference of a circle to its diameter. (3.14159265)",
                        type:"jsProperty",
                        code:{
                            get:function(v) {
                                return Tokens.newNumber(3.14159265);
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-codeflow",
            description:"Adds code flow statements.",
            contains:{
                statements:[
                    {
                        tokens:["GOTO"],
                        description:"Jumps to a specified line number.",
                        type:"jsFunction",
                        code:function(v,v1){
                            return this.returnBackToType("isCycle",true,"gotoNumber",v1);
                        }
                    },{
                        tokens:["GOSUB"],
                        description:"Temporary jumps to a specified line number. The RETURN statement returns back.",
                        type:"jsFunction",
                        code:function(v,v1){
                            if (!v1) return this.returnBreaker(v,"Missing destination");
                            // Create a new code executor, initialized as a gosub
                            return this.returnPassThru(Tokens.newNumber(0),v,"code",{gotoNumber:v1, isGosub:true, isCycle:true},true);
                        }
                    },{
                        tokens:["RETURN"],
                        description:"Goes back to the last GOSUB statement.",
                        type:"jsFunction",
                        code:function(v,v1) {
                            if (v1) {
                                // Acts like function return
                                return this.returnValue(v1);
                            } else {
                                // Acts like GOSUB return
                                return this.returnBackToType("isGosub",true,"return",true);
                            }
                        }
                    },{
                        tokens:["END","STOP"],
                        description:"Ends the program.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v) {
                            return this.returnEnd(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["RUN"],
                        description:"Runs the program from start.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v) {
                            v.global.variables={};
                            delete v.system.registry.dataIndex;
                            return v.system.cpu.returnRun(this);
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-arrays",
            description:"Adds array statements.",
            contains:{
                statements:[
                    {
                        tokens:["DIM"],
                        description:"Initializes a variable to an empty array of given size.",
                        type:"jsFunction",
                        isSpreaded:true, // DIM(A(2),B(3)) => A=DIM(2); B=DIM(3)
                        code:function(v,v1) {
                            if (v1) {
                                // DIM(3) creates an array
                                let value=Tokens.newArray(Array(arguments[1].value)),
                                    seq=[value];
                                for (var i=2;i<arguments.length;i++) {
                                    let newseq=[];
                                    seq.forEach(list=>{
                                        for (var q=0;q<arguments[i-1].value;q++) {
                                            let sub=Tokens.newArray(Array(arguments[i].value));
                                            list.value[q]=sub;
                                            newseq.push(sub);
                                        }
                                    });
                                    seq=newseq;
                                }
                                return this.returnValue(value);
                            } else {
                                // DIM() initializes a variable
                                return this.returnValue(Tokens.newTokenByName(v.assignTo.variableName.value));
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-data",
            description:"Adds data reading statements.",
            contains:{
                statements:[
                    {
                        tokens:["READ"],
                        description:"Returns the next data value.",
                        type:"jsFunction",
                        flip:true, // READ(A(2)) => A(2) = READ()
                        code:function(v) {
                            if (v.system.registry.dataIndex == undefined) v.system.registry.dataIndex=0;
                            let read = v.root.code.data[v.system.registry.dataIndex];
                            if (read === undefined) return this.returnBreaker(v,"Out of data");
                            else {
                                v.system.registry.dataIndex++;
                                return this.returnValue(Tokens.newTokenByName(v.assignTo.variableName.value,read));
                            }
                        }
                    },{
                        tokens:["RESTORE"],
                        description:"Clear or sets the pointer of the data values.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            if (v1) v.system.registry.dataIndex=v1.value;
                            else delete v.system.registry.dataIndex;
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-memory",
            description:"Adds memory read/write and system calls statements.",
            contains:{
                statements:[
                    {
                        tokens:["POKE"],
                        description:"Sets a memory address to a value.",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            return v.system.memory.poke(v,this,v1.value,v2.value);
                        }
                    },{
                        tokens:["PEEK"],
                        description:"Returns the value stored in a memory address.",
                        type:"jsFunction",
                        noEqualStatements:true, // PEEK 3=2 IS (PEEK 3)=2 and not PEEK(3=2)
                        argumentsCount:1,
                        code:function(v,v1) {
                            return v.system.memory.peek(v,this,v1.value);
                        }
                    },{
                        tokens:["SYS"],
                        description:"Performs a system call.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v, v1) {
                            return v.system.memory.sys(v,this,v1.value);
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-strings",
            description:"Adds string manipulation statements.",
            contains:{
                statements:[
                    {
                        tokens:["LEFT$"],
                        description:"Returns the last characters of a string.",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            return this.returnValue(Tokens.newString((v1.value+"").substr(0,v2.value)));
                        }
                    },{
                        tokens:["RIGHT$"],
                        description:"Returns the first characters of a string.",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            let strval=(v1.value+"");
                            return this.returnValue(Tokens.newString(strval.substr(strval.length-v2.value)));
                        }
                    },{
                        tokens:["MID$"],
                        description:"Returns the characters in the middle of a string.",
                        type:"jsFunction",
                        argumentsCount:3,
                        code:function(v,v1,v2,v3) {
                            // Index starts from 1
                            return this.returnValue(Tokens.newString((v1.value+"").substr(v2.value-v.system.registry.quirkStringsStartsFrom,v3?v3.value:v1.length)));
                        }
                    },{
                        tokens:["STR$"],
                        description:"Converts a number to a string.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            return this.returnValue(Tokens.newString(String(v1.value)));
                        }
                    },{
                        tokens:["CHR$"],
                        description:"Returns the character at the given position in the current charMap.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            return this.returnValue(Tokens.newString(v.system.charmap.charToString(v1.value)));
                        }
                    },{
                        tokens:["VAL"],
                        description:"Converts a string to a number.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(parseInt(v1.value)))}
                    },{
                        tokens:["LEN"],
                        description:"Returns the length of a string or an array.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber((v1.structuredValue ? v1.structuredValue.value : (v1.value+"")).length))}
                    },{
                        tokens:["ASC"],
                        description:"Returns the given character position in the current charMap.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){ return this.returnValue(Tokens.newNumber(v.system.charmap.charAt((v1.value+""),0)))}
                    }
                ]
            }
        },
        {
            name:"statements-programmino-debugging",
            description:"Adds debugging statements.",
            contains:{
                statements:[
                    {
                        tokens:["DEBUGGER"],
                        description:"Invokes the JavaScript debugger.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v,v1){
                            debugger;
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["CONSOLELOG"],
                        description:"Logs in JavaScript console.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){
                            console.log(v1);
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    }
                ]
            }
        },
        {
            name:"statements-programmino-ignored",
            description:"Adds common ignored statements.",
            contains:{
                statements:[
                    {
                        tokens:["LET"],
                        description:"Declares a variable.",
                        type:"ignored"
                    }
                ]
            }
        },
        {
            name:"assignments-programmino-advanced",
            description:"Adds advanced assignment symbols.",
            contains:{
                assignments:[
                    {
                        tokens:["+="],
                        description:"Sum variables values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) + value.value);
                        }
                    },{
                        tokens:["-="],
                        description:"Subtracts variables values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) - value.value);
                        }
                    },{
                        tokens:["*="],
                        description:"Multiplies variables values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) * value.value);
                        }
                    },{
                        tokens:["/="],
                        description:"Divide variables values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) / value.value);
                        }
                    },{
                        tokens:["%="],
                        description:"Assign variable to the module of the value.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) % value.value);
                        }
                    },{
                        tokens:["<<="],
                        description:"Assign variable to the bitwise left shifted value.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) << value.value);
                        }
                    },{
                        tokens:[">>="],
                        description:"Assign variable to the bitwise right shifted value.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) >> value.value);
                        }
                    },{
                        tokens:[">>>="],
                        description:"Assign variable to the unsigned bitwise right shifted value.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) >>> value.value);
                        }
                    },{
                        tokens:["&="],
                        description:"Binary AND the values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) & value.value);
                        }
                    },{
                        tokens:["^="],
                        description:"Binary XOR the values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) ^ value.value);
                        }
                    },{
                        tokens:["**="],
                        description:"Exponent the values and assign it.",
                        code:function(v,prevValue,value) {
                            return Tokens.newNumber((prevValue ? prevValue.value : 0) ** value.value);
                        }
                    }
                ],
            }
        },
        {
            name:"foundation-programmino-advanced",
            description:"Adds advanced symbols and parsers configuration.",
            contains:{
                statements:[
                    { tokens:["DO"], description:"Starts a WHILE/DO or a DO/WHILE cycle.", type:"token", token: K.TKN_DO },
                    { tokens:["WHILE"], description:"Describes the looping condition.", type:"token", token: K.TKN_WHILE },
                    { tokens:["REPEAT"], description:"Starts a REPEAT/UNTIL cycle.", type:"token", token: K.TKN_REPEAT },
                    { tokens:["UNTIL"], description:"Describes the loop end condition.", type:"token", token: K.TKN_UNTIL },
                    { tokens:["SWITCH"], description:"Starts a SWITCH/CASE.", type:"token", token: K.TKN_SWITCH },
                    { tokens:["CASE"], description:"Describes a SWITCH/CASE case.", type:"token", token: K.TKN_CASE },
                    { tokens:["DEFAULT"], description:"Describes the default case in a SWITCH/CASE.", type:"token", token: K.TKN_DEFAULT }
                ]
            }
        },
        {
            name:"oop-programmino-advanced",
            description:"Adds simple OOP statements.",
            contains:{
                statements:[
                    {
                        tokens:["CLASS"],
                        description:"Describes a class.",
                        type:"token",
                        token: K.TKN_CLASS
                    },
                    {
                        tokens:["NEW"],
                        description:"Creates a new class instance.",
                        type:"ignored"
                    }
                ],
                objectContexts:[
                    {
                        tokens:["this"],
                        description:"Refers to the called object instance.",
                        context:K.CTX_INSTANCE
                    }
                ]
            }
        },
        {
            name:"foundation-programmino",
            description:"Sets symbols and parsers configuration.",
            contains:{
                lettersSets:[
                    {
                        on:"abcdefghijklmnopqrstuvxyzwABCDEFGHIJKLMNOPQRSTUVXYZW_$",
                        setType:K.TKN_SYMBOL,
                        setAttribute:"value",
                        consume:true,
                        append:true,
                        setParser:[
                            {
                                on:"abcdefghijklmnopqrstuvxyzwABCDEFGHIJKLMNOPQRSTUVXYZW1234567890_",
                                consume:true,
                                append:true
                            },{
                                on:"$",
                                consume:true,
                                append:true,
                                end:true
                            }
                        ]
                    },
                    {
                        on:"0123456789",
                        setType:K.TKN_NUMBER,
                        setAttribute:"value",
                        consume:true,
                        append:true,
                        setParser:[
                            {
                                on:"1234567890.",
                                consume:true,
                                append:true
                            },{
                                on:"E",
                                setAttribute:"exp",
                                consume:true,
                                setParser:[
                                    {
                                        on:"+",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    },
                                    {
                                        on:"-",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    },
                                    {
                                        on:"1234567890",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        on:".",
                        setType:K.TKN_NUMBER,
                        setAttribute:"value",
                        consume:true,
                        append:true,
                        setParser:[
                            {
                                on:"1234567890",
                                consume:true,
                                append:true
                            },{
                                on:"E",
                                setAttribute:"exp",
                                consume:true,
                                setParser:[
                                    {
                                        on:"+",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    },
                                    {
                                        on:"-",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    },
                                    {
                                        on:"1234567890",
                                        consume:true,
                                        append:true,
                                        setParser:[
                                            {
                                                on:"1234567890",
                                                consume:true,
                                                append:true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                on:"abcdefghijklmnopqrstuvxyzwABCDFGHIJKLMNOPQRSTUVXYZW_",
                                setType:K.TKN_DOT,
                                end:true
                            }
                        ]
                    }
                ],
                assignments:[
                    {
                        tokens:["="],
                        description:"Assign a value to a variable or checks equality.",
                        isEqual:true
                    }
                ],
                statements:[
                    {
                        tokens:["("],
                        description:"Starts an expression or method call.",
                        type:"token",
                        token: K.TKN_OPENPARENTHESIS
                    },{
                        tokens:[","],
                        description:"Specify another argument of a method call.",
                        type:"token",
                        token: K.TKN_NEXTARGUMENT
                    },{
                        tokens:[")"],
                        description:"Ends an expression or a method call",
                        type:"token",
                        token: K.TKN_CLOSEPARENTHESIS
                    },{
                        tokens:["{"],
                        description:"Starts a code block.",
                        type:"token",
                        token: K.TKN_STARTCODEBLOCK
                    },{
                        tokens:["}"],
                        description:"Ends a code block.",
                        type:"token",
                        token: K.TKN_ENDCODEBLOCK
                    },{
                        tokens:["["],
                        description:"Starts an array getter.",
                        type:"token",
                        token: K.TKN_STARTGETTER
                    },{
                        tokens:["]"],
                        description:"Ends an array getter.",
                        type:"token",
                        token: K.TKN_ENDGETTER
                    },{
                        tokens:["\""],
                        description:"Starts/ends a string.",
                        type:"token",
                        token: K.TKN_STRINGMARKER
                    },{
                        tokens:["\n"],
                        description:"Ends a line / starts a new line.",
                        type:"token",
                        token: K.TKN_NEWLINE,
                        tokenIndex:["newLine"]
                    },{
                        tokens:[":"],
                        description:"Separate multiple statements on the same line.",
                        type:"token",
                        token: K.TKN_COLON
                    },{
                        tokens:[" "],
                        description:"Spaces.",
                        type:"token",
                        token: K.TKN_SPACE
                    },{
                        tokens:[";"],
                        description:"Separate multiple statements on the same line.",
                        type:"token",
                        token: K.TKN_SEMICOLON
                    },{
                        tokens:["REM","//"],
                        description:"Add a comment line.",
                        type:"token",
                        token: K.TKN_COMMENTLINE,
                        relatedToken:"newLine"
                    },{
                        tokens:["/*"],
                        description:"Starts a comment block.",
                        type:"token",
                        token: K.TKN_COMMENTBLOCKSTART,
                        relatedToken:"commentBlockEnd-slashstar"
                    },{
                        tokens:["*/"],
                        description:"Ends a comment block.",
                        type:"token",
                        token: K.TKN_COMMENTBLOCKEND,
                        tokenIndex:["commentBlockEnd-slashstar"]
                    },{
                        tokens:["IF"],
                        description:"Specify a condition.",
                        type:"token",
                        token: K.TKN_IF
                    },{
                        tokens:["THEN"],
                        description:"Specify the code to execute if a condition is true.",
                        type:"token",
                        token: K.TKN_THEN
                    },{
                        tokens:["ELSE"],
                        description:"Specify the code to execute if a condition is not true.",
                        type:"token",
                        breakArguments:true, // PRINT 1 ELSE PRINT 2 is PRINT 1; ELSE PRINT 2
                        token: K.TKN_ELSE
                    },{
                        tokens:["FOR"],
                        description:"Specify a cycle.",
                        type:"token",
                        token: K.TKN_FOR
                    },{
                        tokens:["TO"],
                        description:"Specify the ending value of a cycle when using BASIC syntax.",
                        type:"token",
                        token: K.TKN_TO
                    },{
                        tokens:["NEXT"],
                        description:"Starts the next FOR loop.",
                        type:"token",
                        token: K.TKN_NEXT
                    },{
                        tokens:["."],
                        description:"Specify the decimal part of a number.",
                        type:"token",
                        token: K.TKN_DOT
                    },{
                        tokens:["STEP"],
                        description:"Specify the step value of a FOR cycle.",
                        type:"token",
                        token: K.TKN_STEP
                    },{
                        tokens:["DATA"],
                        description:"Defines a list of data values.",
                        type:"token",
                        token:K.TKN_DATA
                    },{
                        tokens:["ON"],
                        description:"Performs a conditional action.",
                        type:"token",
                        token:K.TKN_ON
                    },{
                        tokens:["DEF","FUNCTION"],
                        description:"Creates a user-defined function.",
                        type:"token",
                        token:K.TKN_FUNCTION
                    },{
                        tokens:["TRUE"],
                        description:"Boolean TRUE value.",
                        type:"token",
                        token:K.TKN_BOOLEAN,
                        tokenValue:true
                    },{
                        tokens:["FALSE"],
                        description:"Boolean FALSE value.",
                        type:"token",
                        token:K.TKN_BOOLEAN,
                        tokenValue:false
                    }
                ]
            }
        },       
    ]
});