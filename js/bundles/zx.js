DreamBuilder.addPackages({
    name:"ZX",
    description:"Provides features inspired by the ZX Spectrum 48K 8-bit home computer.",
    packages:[
        {
            name:"dream-zx",
            description:"Adds some features of the ZX Spectrum 48K 8-bit home computer. It enables Programmino to run some of its BASIC programs.",
            requires:[
                "programmino-base",
                "display-retro-32x22",
                "font-zx",
                "frame-retro-small",
                "palette-zx",
                "runtime-retro-arraystartfrom1",
                "runtime-retro-stringstartfrom1",
                "statements-zx-unsupported",
                "print-retro-latenextline",
                "logic-zx",
                "runtime-retro-remembercursorattributes",
                "clear-retro-setbackgroundcolor",
                "statements-zx-partial",
                "charmap-zx",
                "keycodes-zx",
                "memory-zx-udg",
                "memory-zx-keypressed",
                "memory-zx-unsupported",
                "clock-retro-slow",
                "statements-zx",
                "screen-retro-bottomleftorigin",
                "parser-retro-callablestrings",
            ]
        },
        {
            name:"statements-zx",
            description:"Adds ZX Spectrum 48K statements.",
            contains:{
                statements:[
                    {
                        tokens:["GO TO"],
                        type:"aliasOf",
                        statement:"GOTO",
                        argumentsCount:1,
                        addToLettersSets:true // Parser will match the symbol even if spaced
                    },{
                        tokens:["GO SUB"],
                        type:"aliasOf",
                        statement:"GOSUB",
                        argumentsCount:1,
                        addToLettersSets:true // Parser will match the symbol even if spaced
                    },{
                        tokens:["CLEAR"],
                        type:"aliasOf",
                        argumentsCount:0,
                        statement:"CLS"
                    },{
                        tokens:["CODE"],
                        type:"aliasOf",
                        argumentsCount:1,
                        statement:"ASC"
                    },{
                        tokens:["INKEY$"],
                        description:"Returns the pressed key.",
                        type:"jsProperty",
                        code:{
                            get:function(v) {
                                let key = v.system.display.keyboardGetPressed();
                                return Tokens.newString( key==0 ? "" : v.system.charmap.keyCodeToString(key));
                            }
                        }
                    },{
                        tokens:["BORDER"],
                        description:"Changes the screen border color.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            v.system.display.screenSetBorderColor(v1.value);
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["PAPER"],
                        description:"Changes the cursor background color.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            v.system.display.cursorSetBgColor(v1.value);
                            return this.returnValue(Tokens.newNull());
                        }
                    },{
                        tokens:["INK"],
                        description:"Changes the cursor foreground color.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            v.system.display.cursorSetFgColor(v1.value);
                            return this.returnValue(Tokens.newNull());
                        }     
                    },{
                        tokens:["AT"],
                        description:"Moves the cursor at a given position.",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            delete v.system.registry._printNewLine;
                            if (v.system.registry.quirkAtUseXY) {
                                v.system.display.cursorSetX(v1.value);
                                v.system.display.cursorSetY(v2.value);
                            } else {
                                v.system.display.cursorSetY(v1.value);
                                v.system.display.cursorSetX(v2.value);
                            }
                            return this.returnValue(Tokens.newNull());
                        }
                    },{
                        tokens:["PAUSE"],
                        description:"Wait for a given amount of frames.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            setTimeout(()=>this.returnContinue(Tokens.newNull()), v1.value*v.system.clock.getMspf()) ;
                            return this.returnWait();
                        }
                    },{
                        tokens:["BRIGHT"],
                        description:"Changes the cursor color bank color.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            v.system.display.cursorSetBank(v1.value);
                            return this.returnValue(Tokens.newNumber(0));
                        } 
                    },{
                        tokens:["FLASH"],
                        description:"Changes the cursor flash attrbute.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1,v2) {
                            v.system.display.cursorSetFlash(v1.value);
                            return this.returnValue(Tokens.newNull());
                        }
                    },{
                        tokens:["ATTR"],
                        description:"Returns the attributes of a character on the screen.",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            let
                                y=v1.value, x=v2.value,
                                bank=v.system.display.textGetCharBankAt(x,y),
                                flash=v.system.display.textGetCharFlashAt(x,y),
                                bg=v.system.display.textGetCharBgColorAt(x,y),
                                fg=v.system.display.textGetCharFgColorAt(x,y);
                            let nr=(128 * flash) | (64 * (bank!=0)) | (bg << 3) | (fg);
                            return this.returnValue(Tokens.newNumber(nr));
                        }
                    },{
                        tokens:["PLOT"],
                        description:"Draws a pixel on the screen.",
                        type:"jsFetcher",
                        code:{
                            start:function(v) {
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                v._status=v.system.display.cursorGetStatus();
                                v._args=[];
                            },
                            fetch:function(v,v1) {
                                switch (v1.type) {
                                    case K.TKN_NUMBER:{
                                        v._args.push(v1.value);
                                        break;
                                    }
                                    case K.TKN_NEXTARGUMENT:
                                    case K.TKN_SEMICOLON:
                                    case K.TKN_NULL:{
                                        break;
                                    }
                                    default:{
                                        return this.returnBreaker(v,"Can't draw token type '"+v1.type+"'");
                                    }
                                }
                            },
                            end:function(v) {
                                v.system.display.pixelPlot(v._args[0],v._args[1]);
                                if (v.system.registry.quirkRememberCursorAttributes)
                                    v.system.display.cursorSetStatus(v._status);
                                return Tokens.newNumber(0);
                            }
                        }
                    },{
                        tokens:["DRAW"],
                        description:"Draws a line or an arc on the screen.",
                        type:"jsFetcher",
                        code:{
                            start:function(v) {
                                v._semicolon=v.system.registry.quirkPrintDontReturn;
                                v._status=v.system.display.cursorGetStatus();
                                v._args=[];
                            },
                            fetch:function(v,v1) {
                                switch (v1.type) {
                                    case K.TKN_NUMBER:{
                                        v._args.push(v1.value);
                                        break;
                                    }
                                    case K.TKN_NEXTARGUMENT:
                                    case K.TKN_SEMICOLON:
                                    case K.TKN_NULL:{
                                        break;
                                    }
                                    default:{
                                        return this.returnBreaker(v,"Can't draw token type '"+v1.type+"'");
                                    }
                                }
                            },
                            end:function(v) {
                                v.system.display.pixelDraw(v._args[0],v._args[1],v._args[2]);
                                if (v.system.registry.quirkRememberCursorAttributes)
                                    v.system.display.cursorSetStatus(v._status);
                                return Tokens.newNumber(0);
                            }
                        }
                    },{
                        tokens:["CIRCLE"],
                        description:"Draws a circle on the screen.",
                        type:"jsFunction",
                        argumentsCount:3,
                        code:function(v,v1,v2,v3){
                            v.system.display.pixelCircle(v1.value,v2.value,v3.value);
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["INVERSE"],
                        description:"Select foreground/background color as default color.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){
                            v.system.display.cursorSetInvert(v1.value == 1);
                            return this.returnValue(Tokens.newNull());
                        }
                    },{
                        tokens:["OVER"],
                        description:"Invert pixels while drawing.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1){
                            v.system.display.cursorSetOver(v1.value == 1);
                            return this.returnValue(Tokens.newNull());
                        }
                    },{
                        tokens:["RANDOMIZE"],
                        description:"Set random seed.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            if (v1) v.system.registry._randomSeed = v1.value;
                            else delete v.system.registry._randomSeed;
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    },{
                        tokens:["'"],
                        description:"Returns a new line character.",
                        type:"jsFunction",
                        argumentsCount:0,
                        code:function(v) {
                            return this.returnValue(Tokens.newString("\n"));
                        }
                    },{
                        tokens:["SCREEN$"],
                        description:"Returns the character on the screen at a given position",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            let letter=v.system.display.textGetCharAt(v1.value,v2.value);
                            return this.returnValue(Tokens.newString(v.system.charmap.charToString(letter)));
                        }
                    }
                ]
            }
        },
        {
            name:"statements-zx-partial",
            description:"Adds ZX Spectrum 48K partially supported statements",
            contains:{
                statements:[
                    {
                        tokens:["USR"],
                        description:"Returns UDG address for a given letter.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            if (v1.type == K.TKN_STRING) {
                                let delta = v.system.charmap.charAt(v1.value,0)-v.system.charmap.charAt("a",0);
                                return this.returnValue(Tokens.newNumber(65368+delta*8));
                            } else {
                                return this.returnValue(Tokens.newNumber(0));
                            }
                            
                        }
                    }
                ]
            }
        },
        {
            name:"statements-zx-unsupported",
            description:"Adds ZX Spectrum 48K unsupported statements.",
            contains:{
                statements:[
                    {
                        tokens:["BEEP"],
                        description:"Beeps for the given duration and with the given pitch. (Unsupported)",
                        type:"jsFunction",
                        argumentsCount:2,
                        code:function(v,v1,v2) {
                            setTimeout(()=>this.returnContinue(Tokens.newNull()), (v1.value*1000)|| 1);
                            return this.returnWait();
                        }
                    },{
                        tokens:["#"],
                        description:"Access screen.",
                        type:"jsFunction",
                        argumentsCount:1,
                        code:function(v,v1) {
                            return this.returnValue(Tokens.newNumber(0));
                        }
                    }
                ]
            }
        },
        {
            name:"keycodes-zx",
            description:"Adds ZX Spectrum 48K keycodes.",
            contains:{
                keyCodeMap:{
                    noKeyIsSystemKeyCode:0,
                    map:[
                        { keyCode: 8, isSystemKeyCode: 12 }, // Backspace
                        { keyCode: 13, isSystemKeyCode: 13 }, // Return
                        { keyCode: 37, isSystemKeyCode: 8 }, // Left
                        { keyCode: 38, isSystemKeyCode: 11 }, // Up
                        { keyCode: 39, isSystemKeyCode: 9 }, // Right
                        { keyCode: 40, isSystemKeyCode: 10 }, // Down
                        { keyCode: 45, isSystemKeyCode: 0 }, // INS
                        { keyCode: 46, isSystemKeyCode: 0 }, // DEL
                        { keyCode: 65, isSystemKeyCode: 97 }, // [A]
                        { keyCode: 66, isSystemKeyCode: 98 }, // [B]
                        { keyCode: 67, isSystemKeyCode: 99 }, // [C]
                        { keyCode: 68, isSystemKeyCode: 100 }, // [D]
                        { keyCode: 69, isSystemKeyCode: 101 }, // [E]
                        { keyCode: 70, isSystemKeyCode: 102 }, // [F]
                        { keyCode: 71, isSystemKeyCode: 103 }, // [G]
                        { keyCode: 72, isSystemKeyCode: 104 }, // [H]
                        { keyCode: 73, isSystemKeyCode: 105 }, // [I]
                        { keyCode: 74, isSystemKeyCode: 106 }, // [J]
                        { keyCode: 75, isSystemKeyCode: 107 }, // [K]
                        { keyCode: 76, isSystemKeyCode: 108 }, // [L]
                        { keyCode: 77, isSystemKeyCode: 109 }, // [M]
                        { keyCode: 78, isSystemKeyCode: 110 }, // [N]
                        { keyCode: 79, isSystemKeyCode: 111 }, // [O]
                        { keyCode: 80, isSystemKeyCode: 112 }, // [P]
                        { keyCode: 81, isSystemKeyCode: 113 }, // [Q]
                        { keyCode: 82, isSystemKeyCode: 114 }, // [R]
                        { keyCode: 83, isSystemKeyCode: 115 }, // [S]
                        { keyCode: 84, isSystemKeyCode: 116 }, // [T]
                        { keyCode: 85, isSystemKeyCode: 117 }, // [U]
                        { keyCode: 86, isSystemKeyCode: 118 }, // [V]
                        { keyCode: 87, isSystemKeyCode: 119 }, // [W]
                        { keyCode: 88, isSystemKeyCode: 120 }, // [X]
                        { keyCode: 89, isSystemKeyCode: 121 }, // [Y]
                        { keyCode: 90, isSystemKeyCode: 122 }, // [Z]
                        { keyCode: 189, isSystemKeyCode: 43 }, // −
                    ]
                }
            }
        },
        {
            name:"charmap-zx",
            description:"Adds the ZX Spectrum 48K charmap.",
            requires:["parser-retro-quotes"],
            contains:{
                charMap:[
                    { char:34, asQuoted:["\""] }, // ["]
                    { char:97, asKeyCodes:[65] }, // [A]
                    { char:98, asKeyCodes:[66] }, // [B]
                    { char:99, asKeyCodes:[67] }, // [C]
                    { char:100, asKeyCodes:[68] }, // [D]
                    { char:101, asKeyCodes:[69] }, // [E]
                    { char:102, asKeyCodes:[70] }, // [F]
                    { char:103, asKeyCodes:[71] }, // [G]
                    { char:104, asKeyCodes:[72] }, // [H]
                    { char:105, asKeyCodes:[73] }, // [I]
                    { char:106, asKeyCodes:[74] }, // [J]
                    { char:107, asKeyCodes:[75] }, // [K]
                    { char:108, asKeyCodes:[76] }, // [L]
                    { char:109, asKeyCodes:[77] }, // [M]
                    { char:110, asKeyCodes:[78] }, // [N]
                    { char:111, asKeyCodes:[79] }, // [O]
                    { char:112, asKeyCodes:[80] }, // [P]
                    { char:113, asKeyCodes:[81] }, // [Q]
                    { char:114, asKeyCodes:[82] }, // [R]
                    { char:115, asKeyCodes:[83] }, // [S]
                    { char:116, asKeyCodes:[84] }, // [T]
                    { char:117, asKeyCodes:[85] }, // [U]
                    { char:118, asKeyCodes:[86] }, // [V]
                    { char:119, asKeyCodes:[87] }, // [W]
                    { char:120, asKeyCodes:[88] }, // [X]
                    { char:121, asKeyCodes:[89] }, // [Y]
                    { char:122, asKeyCodes:[90] }, // [Z]
                    { char:144, asQuoted:["a"] }, // UDG 0
                    { char:145, asQuoted:["b"] }, // UDG 1
                    { char:146, asQuoted:["c"] }, // UDG 2
                    { char:147, asQuoted:["d"] }, // UDG 3
                    { char:148, asQuoted:["e"] }, // UDG 4
                    { char:149, asQuoted:["f"] }, // UDG 5
                    { char:150, asQuoted:["g"] }, // UDG 6
                    { char:151, asQuoted:["h"] }, // UDG 7
                    { char:152, asQuoted:["i"] }, // UDG 8
                    { char:153, asQuoted:["j"] }, // UDG 9
                    { char:154, asQuoted:["k"] }, // UDG 10
                    { char:155, asQuoted:["l"] }, // UDG 11
                    { char:156, asQuoted:["m"] }, // UDG 12
                    { char:157, asQuoted:["n"] }, // UDG 13
                    { char:158, asQuoted:["o"] }, // UDG 14
                    { char:159, asQuoted:["p"] }, // UDG 15
                    { char:160, asQuoted:["q"] }, // UDG 16
                    { char:161, asQuoted:["r"] }, // UDG 17
                    { char:162, asQuoted:["s"] }, // UDG 18
                    { char:163, asQuoted:["t"] }, // UDG 19
                    { char:164, asQuoted:["u"] }, // UDG 20
                    { char:165, asQuoted:["v"] }, // UDG 21
                    { char:166, asQuoted:["w"] }, // UDG 22
                    { char:167, asQuoted:["x"] }, // UDG 23
                    { char:168, asQuoted:["y"] }, // UDG 24
                    { char:169, asQuoted:["z"] }, // UDG 25
                ]
            }
        },
        {
            name:"logic-zx",
            description:"Use ZX Spectrum 48K boolean logic.",
            contains:{
                booleanMode:"BOOL_ZX"
            }
        },
        {
            name:"font-zx",
            description:"Sets Spectrum 48K font.",
            contains:{
                fonts:[
                    FONTS.ZX
                ]
            }
        },
        {
            name:"memory-zx-udg",
            description:"Adds ZX Spectrum 48K 65368-65535 memory areas to customize ZX Spectrum 48K UDG.",
            contains:{
                run:function(system) {
                    system.registry.udgPixelHeight = Math.floor(system.display.fontGetLetterHeight()/8);
                },
                memoryAreas:[
                    {
                        fromAddress:65368,
                        toAddress:65535,
                        description:"UDG.",
                        getter:{
                            getterProcess:function(S,P,a) {
                                let
                                    char=144+Math.floor(a/8),
                                    row=(a%8)*S.registry.udgPixelHeight;
                                return S.display.fontGetRowByte(char,row);
                            }
                        },
                        setter:{
                            setterProcess:function(S,P,a,v) {
                                let
                                    char=144+Math.floor(a/8),
                                    row=(a%8)*S.registry.udgPixelHeight;
                                for (let y=0;y<system.registry.udgPixelHeight;y++)
                                    S.display.fontSetRowByte(char,row+y,v);
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"memory-zx-keypressed",
            description:"Adds ZX Spectrum 48K 23560 memory location that stores the last pressed key.",
            contains:{
                memoryLocations:[
                    {
                        address:23560,
                        description:"Stores newly pressed key.",
                        getter:{
                            waitTick:true,
                            getterProcess:function(S,P,a) {
                                return S.charmap.keyCodeToSystemKeyCode(S.display.keyboardGetLastPressed());
                            }
                        },
                        setter:0
                    }
                ]
            }
        },
        {
            name:"memory-zx-unsupported",
            description:"Adds ZX Spectrum 48K common memory areas as unsupported free memory.",
            contains:{
                memoryAreas:[
                    {
                        fromAddress:16516,
                        toAddress:16539,
                        description:"N/A"
                    }
                ]
            }
        },
        {
            name:"palette-zx",
            description:"Sets ZX Spectrum 48K default color palette. Color brightness is managed via color banks.",
            contains:{
                palette:{
                    banks:2, count:8,
                    defaultBgColor:7,
                    defaultFgColor:0,
                    defaultBorderColor:7,
                    messageBgColor:10, messageFgColor:15,
                    nameToColorId:{ black:8, white:15, red:2, cyan:5, violet:11, green:4, blue:9, yellow:14, orange:10, brown:10, lightred:11, darkgrey:0, grey:7, lightgreen:12, lightblue:9, lightgrey:7 },
                    colors:[
                        [ 0,0,0,255 ],
                        [0,0,238,255],
                        [238,0,0,255],
                        [238,0,238,255],
                        [0,238,0,255],
                        [0,238,238,255],
                        [238,238,0,255],
                        [238,238,238,255],
                        [ 0,0,0,255 ],
                        [0,0,255,255],
                        [255,0,0,255],
                        [255,0,255,255],
                        [0,255,0,255],
                        [0,255,255,255],
                        [255,255,0,255],
                        [255,255,255,255]
                    ]
                }
            }
        },
    ]
});