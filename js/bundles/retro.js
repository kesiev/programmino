DreamBuilder.addPackages({
    name:"retro",
    description:"Provides features inspired by misc retro machines.",
    packages:[
        {
            name:"parser-retro-quotes",
            description:"Instructs the code parser support to quoted letters (i.e. \\n).",
            contains:{
                quotesEnabled:true
            }
        },
        {
            name:"parser-retro-callablestrings",
            description:"Instructs the code parser to support for calling string methods (i.e. \"HELLO\"(3)).",
            contains:{
                registry:{
                    quirkCallableStrings:true
                }
            }
        },
        {
            name:"parser-retro-macros",
            description:"Instructs the code parser to support for listing macros (i.e. {$65}).",
            contains:{
                macrosEnabled:true
            }
        },
        {
            name:"at-retro-invertxy",
            description:"Instructs the AT statement to use column,row instead of row,column.",
            contains:{
                registry:{
                    quirkAtUseXY:true
                }
            }
        },
        {
            name:"parser-retro-codelabels",
            description:"Instructs the code parser to allow text labels. (i.e. label:)",
            contains:{
                registry:{
                    quirkCodeLabels:true
                }
            }
        },
        {
            name:"memory-retro-useint",
            description:"Instructs the memory to store integer values instead of values between 0 and 255.",
            contains:{
                registry:{
                    quirkMemoryUseInt:true
                }
            }
        },
        {
            name:"display-retro-fake80cols",
            description:"Adds fake 80 columns. Some systems like Commodore 64 used to do that.",
            contains:{
                registry:{
                    quirkFake80Columns:true
                }
            }
        },
        {
            name:"clock-retro-slow",
            description:"Sets execution speed to 50 operations per frame.",
            contains:{
                opsPerTick:50
            }
        },
        {
            name:"clock-retro-fast",
            description:"Sets execution speed to 500 operations per frame.",
            contains:{
                opsPerTick:500
            }
        },
        {
            name:"frame-retro-small",
            description:"Sets a small screen frame.",
            contains:{
                frameSize:{
                    top:20,
                    right:30,
                    bottom:20,
                    left:30
                }
            }
        },
        {
            name:"runtime-retro-symbolsfirst",
            description:"Instructs the code parser to detect symbols before splitting words. (i.e. PRINTA is PRINT A and not the PRINTA keyword)",
            contains:{
                symbolsFirst:true
            }
        },
        {
            name:"runtime-retro-lowercasestatements",
            description:"Instructs the code parser to detect lowercase statements.",
            contains:{
                addLowerCaseStatements:true
            }
        },
        {
            name:"print-retro-latenextline",
            description:"Instructs the PRINT statement to print the trailing new line when executing the next PRINT statement instead of at the end of its execution.",
            contains:{
                registry:{
                    quirkNewLineOnNextPrint:true
                }
            }
        },
        {
            name:"print-retro-noextraspaces",
            description:"Instructs the PRINT statement to not print spaces around certain types of value.",
            contains:{
                registry:{
                    quirkPrintNoExtraSpaces:true
                }
            }
        },
        {
            name:"input-retro-noquestionmark",
            description:"Instructs the INPUT statement to not print a question mark when certain types of value.",
            contains:{
                registry:{
                    quirkInputNoQuestionMark:true
                }
            }
        },
        {
            name:"screen-retro-bottomleftorigin",
            description:"Instructs drawing statements to use the bottom-left of the screen as screen origin instead of the top-left.",
            contains:{
                registry:{
                    quirkBottomLeftOrigin:true
                }
            }
        },
        {
            name:"runtime-retro-remembercursorattributes",
            description:"Instructs printing and drawing statements to save and restore cursor attibutes.",
            contains:{
                registry:{
                    quirkRememberCursorAttributes:true
                }
            }
        },
        {
            name:"clear-retro-setbackgroundcolor",
            description:"Instructs the screen clearing statements to set display background color to cursor background color.",
            contains:{
                registry:{
                    quirkClearSetBackgroundColor:true
                }
            }
        },
        {
            name:"runtime-retro-variablesarenotstructures",
            description:"Instructs the code interpreter to let variables contain a value and a different structure within the same name.",
            contains:{
                registry:{
                    quirkVariablesAreNotStructures:true
                }
            }
        },
        {
            name:"runtime-retro-stringstartfrom1",
            description:"Instructs the code interpeter that first letter in strings has index 1 instead of 0.",
            contains:{
                registry:{
                    quirkStringsStartsFrom:1
                }
            }
        },
        {
            name:"runtime-retro-arraystartfrom1",
            description:"Instructs the code interpeter that the first element in arrays has index 1 instead of 0.",
            contains:{
                registry:{
                    quirkArraysStartsFrom:1
                }
            }
        },
        {
            name:"runtime-retro-inputuppercase",
            description:"Instructs input statements to always use uppercase letters.",
            contains:{
                registry:{
                    quirkInputAlwaysUppercase:true
                }
            }
        },
        {
            name:"runtime-retro-inputalwaysstrings",
            description:"Instructs input statements to manage all values as strings.",
            contains:{
                registry:{
                    quirkInputAlwaysStrings:true
                }
            }
        },
        {
            name:"print-retro-commasize14",
            description:"Instructs the text printing statements that the comma symbol is 14 characters long.",
            contains:{
                commaSize:14
            }
        },
        {
            name:"display-retro-80x25",
            description:"Sets display size to 80 columns x 25 rows characters.",
            contains:{
                textWidth:80,
                textHeight:25
            }
        },
        {
            name:"display-retro-32x22",
            description:"Sets display size to 32 columns x 22 rows characters.",
            contains:{
                textWidth:32,
                textHeight:22
            }
        },
        {
            name:"display-retro-40x25",
            description:"Sets display size to 40 columns x 25 rows characters.",
            contains:{
                textWidth:40,
                textHeight:25
            }
        },
        {
            name:"font-retro-vga8x16",
            description:"Sets VGA 8x16 font.",
            contains:{
                fonts:[
                    FONTS.VGA816
                ]
            }
        },
        {
            name:"keymacro-retro-switchfont",
            description:"Adds CTRL+SHIFT key to switch fonts.",
            contains:{
                keyboardEvent:function(S,e) {
                    if (e.ctrlKey && e.shiftKey) S.display.fontNextId();
                }
            }
        },
        {
            name:"palette-retro-cga",
            description:"Sets CGA color palette.",
            contains:{
                palette:{
                    defaultBgColor:0,
                    defaultFgColor:15,
                    defaultBorderColor:0,
                    messageBgColor:4,
                    messageFgColor:15,
                    nameToColorId:{ black:0, white:15, red:4, cyan:3, violet:5, green:2, blue:1, yellow:14, orange:12, brown:6, lightred:12, darkgrey:8, grey:7, lightgreen:10, lightblue:9, lightgrey:7 },
                    colors:[
                        [0,0,0,255],
                        [0,0,170,255],
                        [0,170,0,255],
                        [0,170,170,255],
                        [170,0,0,255],
                        [170,0,170,255],
                        [170,170,0,255],
                        [170,170,170,255],
                        [85,85,85,255],
                        [85,85,255,255],
                        [85,255,85,255],
                        [85,255,255,255],
                        [255,85,85,255],
                        [255,85,255,255],
                        [255,255,85,255],
                        [255,255,255,255]
                    ]
                }
            }
        },
        {
            name:"parser-retro-dotforproperties",
            description:"Instructs the code parser to use the dot symbol to access object properties.",
            contains:{
                registry:{
                    quirkDotForProperties:true
                }
            }
        },
        {
            name:"charmap-ascii",
            description:"Adds ASCII charmap.",
            requires:["parser-retro-macros"],
            contains:{
                charMap:[
                    { char:7, asSpecialChar: D.CHAR_BELL },
                    { char:8, asSpecialChar: D.CHAR_BACKSPACE },
                    { char:10, asSpecialChar: D.CHAR_DOWN },
                ]
            }
        },
    ]
})