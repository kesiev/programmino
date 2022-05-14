DreamBuilder.addPackages({
    name:"kesiev",
    description:"Provides features inspired by earlier BASIC interpreters.",
    packages:[
        {
            name:"dream-kesiev",
            description:"A machine I've seen in my dreams. A weird mix of machines and programming standards from different ages.",
            requires:[
                "programmino-advanced",
                "display-retro-80x25",
                "font-retro-vga8x16",
                "frame-retro-small",
                "palette-retro-cga",
                "runtime-retro-lowercasestatements",
                "print-retro-commasize14",
                "dream-kesiev-pascal",
                "parser-retro-dotforproperties",
                "clock-retro-fast",
                "memory-zx-udg",
                "statements-zx-partial",
                "statements-zx",
                "charmap-kesiev",
                "screen-64-sprites",
                "memory-64-basic",
                "memory-64-keyboard",
                "memory-64-screen",
                "memory-64-joysticks",
                "runtime-retro-inputalwaysstrings",
                "charmap-ascii",
                "at-retro-invertxy",
                "memory-retro-useint",
                "parser-retro-codelabels",
                "dream-kesiev-fun",
                "print-retro-noextraspaces",
                "input-retro-noquestionmark",
            ]
        },
        {
            name:"dream-kesiev-pascal",
            description:"In that dream there was a dash of Pascal...",
            contains:{
                assignments:[
                    {
                        tokens:[":="],
                        description:"Assign a value to a variable."
                    }
                ],
                statements:[
                    {
                        tokens:["(*"],
                        description:"Starts a comment block.",
                        type:"token",
                        token: K.TKN_COMMENTBLOCKSTART,
                        relatedToken:"commentBlockEnd-roundstar"
                    },{
                        tokens:["*)"],
                        description:"Ends a comment block.",
                        type:"token",
                        token: K.TKN_COMMENTBLOCKEND,
                        tokenIndex:["commentBlockEnd-roundstar"]
                    },
                    {
                        tokens:["WRITELN"],
                        type:"aliasOf",
                        statement:"PRINT"
                    },
                ]
            }
        },
        {
            name:"dream-kesiev-fun",
            description:"In that dream everything seemed... fun?",
            contains:{
              statements:[
                {
                    tokens:["SETOPSPERTICK"],
                    description:"Sets the number of operations to be executed every frame.",
                    type:"jsFunction",
                    argumentsCount:1,
                    code:function(v,v1){
                        v.system.cpu.setOpsPerTick(v1.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["GETFONTBIT"],
                    description:"Gets the on/off bit of a font symbol.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        return this.returnValue(Tokens.newBoolean(v.system.display.fontGetBit(v1.value,v2.value,v3.value)));
                    }
                },
                {
                    tokens:["SETFONTBIT"],
                    description:"Sets the on/off bit of a font symbol.",
                    type:"jsFunction",
                    argumentsCount:4,
                    code:function(v,v1,v2,v3,v4){
                        v.system.display.fontSetBit(v1.value,v2.value,v3.value,!!v4.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["SETCHARAT"],
                    description:"Sets a character on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        v.system.charmap.setScreenCodeAt(v1.value,v2.value,v3.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["SETBGCOLORAT"],
                    description:"Sets a background color on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        v.system.display.textSetCharBgColorAt(v1.value,v2.value,v3.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["BACKGROUND"],
                    description:"Changes the screen background color.",
                    type:"jsFunction",
                    argumentsCount:1,
                    code:function(v,v1) {
                        v.system.display.screenSetBgColor(v1.value);
                        return this.returnValue(Tokens.newNumber(0));
                    }
                },
                {
                    tokens:["SETFGCOLORAT"],
                    description:"Sets a foreground color on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        v.system.display.textSetCharFgColorAt(v1.value,v2.value,v3.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["SETINVERSEAT"],
                    description:"Sets a inverse attribute on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        v.system.display.textSetCharInverseAt(v1.value,v2.value,v3.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["SETFLASHAT"],
                    description:"Sets a flash attribute on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:3,
                    code:function(v,v1,v2,v3){
                        v.system.display.textSetCharFlashAt(v1.value,v2.value,v3.value);
                        return this.returnValue(Tokens.newNull());
                    }
                },
                {
                    tokens:["GETCHARAT"],
                    description:"Sets a character on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:2,
                    code:function(v,v1,v2){
                        return this.returnValue(Tokens.newNumber(v.system.charmap.getScreenCodeAt(v1.value,v2.value)));
                    }
                },
                {
                    tokens:["GETBGCOLORAT"],
                    description:"Gets a background color on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:2,
                    code:function(v,v1,v2){
                        return this.returnValue(Tokens.newNumber(v.system.display.textGetCharBgColorAt(v1.value,v2.value)));
                    }
                },
                {
                    tokens:["GETFGCOLORAT"],
                    description:"Gets a foreground color on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:2,
                    code:function(v,v1,v2){
                        return this.returnValue(Tokens.newNumber(v.system.display.textGetCharFgColorAt(v1.value,v2.value)));
                    }
                },
                {
                    tokens:["GETINVERSEAT"],
                    description:"Gets a inverse attribute on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:2,
                    code:function(v,v1,v2){
                        return this.returnValue(Tokens.newBoolean(v.system.display.textGetCharInverseAt(v1.value,v2.value)));
                    }
                },
                {
                    tokens:["GETFLASHAT"],
                    description:"Gets a flash attribute on the screen at a given position.",
                    type:"jsFunction",
                    argumentsCount:2,
                    code:function(v,v1,v2){
                        return this.returnValue(Tokens.newBoolean(v.system.display.textGetCharFlashAt(v1.value,v2.value)));
                    }
                }
                ]
            }
        },
        {
            name:"charmap-kesiev",
            description:"A charmap I've seen in my dreams.",
            requires:["parser-retro-quotes"],
            contains:{
                charMap:[
                    { char:7, asSpecialChar: D.CHAR_BELL },
                    { char:8, asSpecialChar: D.CHAR_BACKSPACE },
                    { char:10, asSpecialChar: D.CHAR_DOWN },
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
    ]
});