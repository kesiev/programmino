DreamBuilder.addPackages({
    name:"64",
    description:"Provides features inspired by the Commodore 64 8-bit home computer.",
    packages:[
        {
            name:"dream-64",
            description:"Adds some features of the Commodore 64 8-bit home computer. It enables Programmino to run some of its BASIC programs.",
            requires:[
                "charmap-64",
                "clock-retro-slow",
                "display-retro-40x25",
                "display-retro-fake80cols",
                "font-64",
                "frame-retro-small",
                "keycodes-64",
                "keymacro-retro-switchfont",
                "logic-numbers",
                "memory-64-joysticks",
                "memory-64-keyboard",
                "memory-64-screen",
                "memory-64-switchfont",
                "memory-64-unsupported",
                "statements-64-unsupported",
                "palette-64",
                "parser-64-abbreviations",
                "parser-64-letteralias",
                "programmino-base",
                "sound-64-unsupported",
                "screen-64-sprites",
                "sys-64-screen",
                "sys-64-unsupported",
                "runtime-retro-lowercasestatements",
                "runtime-retro-stringstartfrom1",
                "runtime-retro-symbolsfirst",
                "runtime-retro-variablesarenotstructures",
                "memory-64-basic"
            ]
        },
        {
            name:"memory-64-keyboard",
            description:"Adds Commodore 64 memory areas for keyboard input.",
            contains:{
                memoryLocations:[
                    {
                        address:197,
                        description:"Matrix code of key previously pressed.",
                        getter:{ 
                            waitTick:true,
                            getterProcess:function(S,P,v) {
                                return S.charmap.keyCodeToSystemKeyCode(S.display.keyboardGetPressed());
                            }
                        },
                        setter:0
                    },{
                        address:198,
                        description:"Length of keyboard buffer. (=0 or =1 supported)",
                        getter:{
                            waitTick:true,
                            getterProcess:function(S,P,v) {
                                return S.display.keyboardGetPressed() ? 1 : 0;
                            }
                        },
                        setter:0
                    }
                ]
            }
        },
        {
            name:"parser-64-abbreviations",
            description:"Adds Commodore 64 statement abbreviations.",
            contains:{
                abbreviations:[
                    { from:[ "aB" ], to:"ABS" },
                    { from:[ "aN" ], to:"AND" },
                    { from:[ "aS" ], to:"ASC" },
                    { from:[ "aT" ], to:"ATN" },
                    { from:[ "cH" ], to:"CHR$" },
                    { from:[ "clO" ], to:"CLOSE" },
                    { from:[ "cL" ], to:"CLR" },
                    { from:[ "cM" ], to:"CMD" },
                    { from:[ "cO" ], to:"CONT" },
                    { from:[ "dA" ], to:"DATA" },
                    { from:[ "dE" ], to:"DEF" },
                    { from:[ "dI" ], to:"DIM" },
                    { from:[ "eN" ], to:"END" },
                    { from:[ "eX" ], to:"EXP" },
                    { from:[ "fO" ], to:"FOR" },
                    { from:[ "fR" ], to:"FRE" },
                    { from:[ "gE" ], to:"GET" },
                    { from:[ "goS" ], to:"GOSUB" },
                    { from:[ "gO" ], to:"GOTO" },
                    { from:[ "iN" ], to:"INPUT#" },
                    { from:[ "leF" ], to:"LEFT$" },
                    { from:[ "lE" ], to:"LET" },
                    { from:[ "lI" ], to:"LIST" },
                    { from:[ "lO" ], to:"LOAD" },
                    { from:[ "mI" ], to:"MID$" },
                    { from:[ "nE" ], to:"NEXT" },
                    { from:[ "nO" ], to:"NOT" },
                    { from:[ "oP" ], to:"OPEN" },
                    { from:[ "pE" ], to:"PEEK" },
                    { from:[ "pO" ], to:"POKE" },
                    { from:[ "?" ], to:"PRINT" },
                    { from:[ "pR" ], to:"PRINT#" },
                    { from:[ "rE" ], to:"READ" },
                    { from:[ "reS" ], to:"RESTORE" },
                    { from:[ "reT" ], to:"RETURN" },
                    { from:[ "rI" ], to:"RIGHT$" },
                    { from:[ "rN" ], to:"RND" },
                    { from:[ "rU" ], to:"RUN" },
                    { from:[ "sA" ], to:"SAVE" },
                    { from:[ "sG" ], to:"SGN" },
                    { from:[ "sI" ], to:"SIN" },
                    { from:[ "sP" ], to:"SPC(" },
                    { from:[ "sQ" ], to:"SQR" },
                    { from:[ "stE" ], to:"STEP" },
                    { from:[ "sT" ], to:"STOP" },
                    { from:[ "stR" ], to:"STR$" },
                    { from:[ "sY" ], to:"SYS" },
                    { from:[ "tA" ], to:"TAB(" },
                    { from:[ "TI", "ti" ], to:"TIME" },
                    { from:[ "TI$", "ti$" ], to:"TIME$" },
                    { from:[ "tH" ], to:"THEN" },
                    { from:[ "uS" ], to:"USR" },
                    { from:[ "vA" ], to:"VAL" },
                    { from:[ "vE" ], to:"VERIFY" },
                    { from:[ "wA" ], to:"WAIT" },
                ]
            }
        },
        {
            name:"memory-64-joysticks",
            description:"Adds Commodore 64 Joysticks.",
            contains:{
                memoryLocations:[
                    {
                        address:56320,
                        description:"Port 2 Joystick.",
                        getter:{
                            waitTick:true,
                            getterProcess:function(S,P,v) {
                                let out = 127;
                                if (S.display.keyboardIsKeyPressed(38)) out &= ~1;
                                if (S.display.keyboardIsKeyPressed(40)) out &= ~2;
                                if (S.display.keyboardIsKeyPressed(37)) out &= ~4;
                                if (S.display.keyboardIsKeyPressed(39)) out &= ~8;
                                if (S.display.keyboardIsKeyPressed(32)) out &= ~16;
                                return out;
                            }
                        },
                        setter:0
                    },{
                        address:56321,
                        description:"Port 1 Joystick.",
                        getter:{ // 
                            waitTick:true,
                            getterProcess:function(S,P,v) {
                                let out = 255;
                                if (S.display.keyboardIsKeyPressed(38)) out &= ~1;
                                if (S.display.keyboardIsKeyPressed(40)) out &= ~2;
                                if (S.display.keyboardIsKeyPressed(37)) out &= ~4;
                                if (S.display.keyboardIsKeyPressed(39)) out &= ~8;
                                if (S.display.keyboardIsKeyPressed(32)) out &= ~16;
                                return out;
                            }
                        },
                        setter:0
                    }
                ]
            }
        },
        {
            name:"parser-64-letteralias",
            description:"Adds Commodore 64 letter aliases.",
            contains:{
                letterAliases:[
                    { letter:"A", isAscii:193 },
                    { letter:"B", isAscii:194 },
                    { letter:"C", isAscii:195 },
                    { letter:"D", isAscii:196 },
                    { letter:"E", isAscii:197 },
                    { letter:"F", isAscii:198 },
                    { letter:"G", isAscii:199 },
                    { letter:"H", isAscii:200 },
                    { letter:"I", isAscii:201 },
                    { letter:"J", isAscii:202 },
                    { letter:"K", isAscii:203 },
                    { letter:"L", isAscii:204 },
                    { letter:"M", isAscii:205 },
                    { letter:"N", isAscii:206 },
                    { letter:"O", isAscii:207 },
                    { letter:"P", isAscii:208 },
                    { letter:"Q", isAscii:209 },
                    { letter:"R", isAscii:210 },
                    { letter:"S", isAscii:211 },
                    { letter:"T", isAscii:212 },
                    { letter:"U", isAscii:213 },
                    { letter:"V", isAscii:214 },
                    { letter:"W", isAscii:215 },
                    { letter:"X", isAscii:216 },
                    { letter:"Y", isAscii:217 },
                    { letter:"Z", isAscii:218 },
                ]
            }
        },
        {
            name:"keycodes-64",
            description:"Adds Commodore 64 keycodes.",
            contains:{
                keyCodeMap:{
                    noKeyIsSystemKeyCode:64,
                    map:[
                        { keyCode: 8, isSystemKeyCode: 0, keyCodeLabel:"Backspace" },
                        { keyCode: 13, isSystemKeyCode: 1, keyCodeLabel:"Return" },
                        { keyCode: 32, isSystemKeyCode: 60, keyCodeLabel:"Space" },
                        { keyCode: 35, isSystemKeyCode: 63, keyCodeLabel:"End" },
                        { keyCode: 36, isSystemKeyCode: 51, keyCodeLabel:"Home" },
                        { keyCode: 37, isSystemKeyCode: 2, keyCodeLabel:"Left" },
                        { keyCode: 38, isSystemKeyCode: 7, keyCodeLabel:"Up" },
                        { keyCode: 39, isSystemKeyCode: 2, keyCodeLabel:"Right" },
                        { keyCode: 40, isSystemKeyCode: 7, keyCodeLabel:"Down" },
                        { keyCode: 42, isSystemKeyCode: 49, keyCodeLabel:"*" },
                        { keyCode: 43, isSystemKeyCode: 40, keyCodeLabel:"+" },
                        { keyCode: 45, isSystemKeyCode: 0, keyCodeLabel:"INS" },
                        { keyCode: 46, isSystemKeyCode: 0, keyCodeLabel:"DEL" },
                        { keyCode: 48, isSystemKeyCode: 35, keyCodeLabel:"0" },
                        { keyCode: 49, isSystemKeyCode: 56, keyCodeLabel:"1" },
                        { keyCode: 50, isSystemKeyCode: 59, keyCodeLabel:"2" },
                        { keyCode: 51, isSystemKeyCode: 8, keyCodeLabel:"3" },
                        { keyCode: 52, isSystemKeyCode: 11, keyCodeLabel:"4" },
                        { keyCode: 53, isSystemKeyCode: 16, keyCodeLabel:"5" },
                        { keyCode: 54, isSystemKeyCode: 19, keyCodeLabel:"6" },
                        { keyCode: 55, isSystemKeyCode: 24, keyCodeLabel:"7" },
                        { keyCode: 56, isSystemKeyCode: 27, keyCodeLabel:"8" },
                        { keyCode: 57, isSystemKeyCode: 32, keyCodeLabel:"9" },
                        { keyCode: 60, isSystemKeyCode: 47, keyCodeLabel:"<" },
                        { keyCode: 61, isSystemKeyCode: 53, keyCodeLabel:"=" },
                        { keyCode: 62, isSystemKeyCode: 44, keyCodeLabel:">" },
                        { keyCode: 63, isSystemKeyCode: 55, keyCodeLabel:"?" },
                        { keyCode: 64, isSystemKeyCode: 46, keyCodeLabel:"@" },
                        { keyCode: 65, isSystemKeyCode: 10, keyCodeLabel:"A" },
                        { keyCode: 66, isSystemKeyCode: 28, keyCodeLabel:"B" },
                        { keyCode: 67, isSystemKeyCode: 20, keyCodeLabel:"C" },
                        { keyCode: 68, isSystemKeyCode: 18, keyCodeLabel:"D" },
                        { keyCode: 69, isSystemKeyCode: 14, keyCodeLabel:"E" },
                        { keyCode: 70, isSystemKeyCode: 21, keyCodeLabel:"F" },
                        { keyCode: 71, isSystemKeyCode: 26, keyCodeLabel:"G" },
                        { keyCode: 72, isSystemKeyCode: 29, keyCodeLabel:"H" },
                        { keyCode: 73, isSystemKeyCode: 33, keyCodeLabel:"I" },
                        { keyCode: 74, isSystemKeyCode: 34, keyCodeLabel:"J" },
                        { keyCode: 75, isSystemKeyCode: 37, keyCodeLabel:"K" },
                        { keyCode: 76, isSystemKeyCode: 42, keyCodeLabel:"L" },
                        { keyCode: 77, isSystemKeyCode: 36, keyCodeLabel:"M" },
                        { keyCode: 78, isSystemKeyCode: 39, keyCodeLabel:"N" },
                        { keyCode: 79, isSystemKeyCode: 38, keyCodeLabel:"O" },
                        { keyCode: 80, isSystemKeyCode: 41, keyCodeLabel:"P" },
                        { keyCode: 81, isSystemKeyCode: 62, keyCodeLabel:"Q" },
                        { keyCode: 82, isSystemKeyCode: 17, keyCodeLabel:"R" },
                        { keyCode: 83, isSystemKeyCode: 13, keyCodeLabel:"S" },
                        { keyCode: 84, isSystemKeyCode: 22, keyCodeLabel:"T" },
                        { keyCode: 85, isSystemKeyCode: 30, keyCodeLabel:"U" },
                        { keyCode: 86, isSystemKeyCode: 31, keyCodeLabel:"V" },
                        { keyCode: 87, isSystemKeyCode: 9, keyCodeLabel:"W" },
                        { keyCode: 88, isSystemKeyCode: 23, keyCodeLabel:"X" },
                        { keyCode: 89, isSystemKeyCode: 25, keyCodeLabel:"Y" },
                        { keyCode: 90, isSystemKeyCode: 12, keyCodeLabel:"Z" },
                        { keyCode: 91, isSystemKeyCode: 45, keyCodeLabel:"[" },
                        { keyCode: 93, isSystemKeyCode: 50, keyCodeLabel:"]" },
                        { keyCode: 112, isSystemKeyCode: 4, keyCodeLabel:"F1" },
                        { keyCode: 113, isSystemKeyCode: 4, keyCodeLabel:"F2" },
                        { keyCode: 114, isSystemKeyCode: 5, keyCodeLabel:"F3" },
                        { keyCode: 115, isSystemKeyCode: 5, keyCodeLabel:"F4" },
                        { keyCode: 116, isSystemKeyCode: 6, keyCodeLabel:"F5" },
                        { keyCode: 117, isSystemKeyCode: 6, keyCodeLabel:"F6" },
                        { keyCode: 118, isSystemKeyCode: 3, keyCodeLabel:"F5" },
                        { keyCode: 119, isSystemKeyCode: 3, keyCodeLabel:"F6" },
                        { keyCode: 189, isSystemKeyCode: 43, keyCodeLabel:"-" },
                    ]
                }
            }
        },
        {
            name:"screen-64-sprites",
            description:"Adds Commodore 64 sprites rendering and memory areas.",
            contains:{
                memoryAreas:[
                    {
                        fromAddress:2040,
                        toAddress:2047,
                        description:"Default area for sprite pointers."
                    },{
                        fromAddress:53248,
                        toAddress:53264,
                        description:"Sprites coordinates."
                    },{
                        fromAddress:53278,
                        toAddress:53279,
                        description:"Sprite-sprite collision register & Sprite-background collision register."
                    },{
                        fromAddress:53267,
                        toAddress:54271,
                        description:"VIC-II."
                    }
                ],
                run:function(system) {

                    let
                        xstretch=system.display.screenGetWidth()/320,
                        ystretch=system.display.screenGetHeight()/200,
                        spritewatchers=[],
                        displayDirtyCallback = (S,watcher,location)=>{
                            S.display.setDisplayRendererDirty()
                        };

                    // Default area for sprite pointers (8 bytes).
                    system.memory.addAreaWatcher(2040,2047,(S,watcher,address,value)=>{
                        let sprite=address-watcher.start;
                        S.memory.removeWatcher(spritewatchers[sprite]);
                        spritewatchers[sprite]=S.memory.addAreaWatcher(value*64,(value*64)+63,displayDirtyCallback);
                        S.display.setDisplayRendererDirty();
                    });
    
                    // Sprites coordinates
                    system.memory.addAreaWatcher(53248,53264,displayDirtyCallback);
    
                    // Rest ov VIC-II
                    system.memory.addAreaWatcher(53266,54271,displayDirtyCallback);
    
                    // Default sprite colors
                    system.memory.syncPoke(53287,241);
                    system.memory.syncPoke(53288,242);
                    system.memory.syncPoke(53289,243);
                    system.memory.syncPoke(53290,244);
                    system.memory.syncPoke(53291,245);
                    system.memory.syncPoke(53292,246);
                    system.memory.syncPoke(53293,247);
                    system.memory.syncPoke(53294,252);
    
                    // Sprites rendering

                    let renderSprites=(phase,S,ctx,ox,oy)=>{
                        let
                            showPhase=!phase,
                            pixels=S.display.screenGetPixels(0),
                            pixelsmap=[],
                            spriteCollisions = 0,
                            backgroundCollisions = 0,
                            enabledSprites = S.memory.syncPeek(53269),
                            zIndexSprites = S.memory.syncPeek(53275),
                            multicolorSprites = S.memory.syncPeek(53276),
                            multicolorColor1 = S.display.paletteGetHtmlColor(S.memory.syncPeek(53285)),
                            multicolorColor2 = S.display.paletteGetHtmlColor(S.memory.syncPeek(53286)),
                            textRamAddress = 1024, // S.memory.syncPeek(53272) - Change not supported
                            startingAddress = textRamAddress+1016,
                            stretchX = S.memory.syncPeek(53277),
                            stretchY = S.memory.syncPeek(53271),
                            xCoordinateBit = S.memory.syncPeek(53264),
                            coords=53248,
                            unicolorRegister = 53287,
                            mask=1;
                        for (let i=0;i<8;i++) {
                            if ((enabledSprites & mask) && (!(zIndexSprites & mask)!=showPhase )) {
                                let
                                    isMulticolor = multicolorSprites & mask,
                                    unicolorColor = S.display.paletteGetHtmlColor(S.memory.syncPeek(unicolorRegister)),
                                    spriteAddress = S.memory.syncPeek(startingAddress) * 64,
                                    pixelWidth = (stretchX & mask ? 2 : 1) * (isMulticolor ? 2 : 1) * xstretch,
                                    pixelHeight = (stretchY & mask ? 2 : 1) * ystretch,
                                    dx= ox+(S.memory.syncPeek(coords)+(xCoordinateBit & mask ? 256 : 0) - 24) * xstretch,
                                    dy= oy+(S.memory.syncPeek(coords+1) - 50) * ystretch;
                                    px=dx, py=dy;
                                if (isMulticolor) {
                                    let pixelRow = pixelWidth*4;
                                    for (let y=0;y<21;y++) {
                                        for (let bx=0;bx<3;bx++) {
                                            dx += pixelRow;
                                            let
                                                rx = dx,
                                                byte = S.memory.syncPeek(spriteAddress);
                                            for (let x=0;x<4;x++) {
                                                let color;
                                                rx-=pixelWidth;
                                                switch (3 & byte) {
                                                    case 1:{
                                                        color=multicolorColor1;
                                                        break;
                                                    }
                                                    case 2:{
                                                        color=unicolorColor;
                                                        break;
                                                    }
                                                    case 3:{
                                                        color=multicolorColor2;
                                                        break;
                                                    }
                                                }
                                                if (color) {
                                                    ctx.fillStyle = color;
                                                    for (let blx=rx;blx<rx+pixelWidth;blx++)
                                                        for (let bly=dy;bly<dy+pixelHeight;bly++) {
                                                            if (pixels[bly-oy] && (pixels[bly-oy][blx-ox]>-1)) backgroundCollisions|=mask;
                                                            if (!pixelsmap[bly]) pixelsmap[bly]=[];
                                                            if (pixelsmap[bly][blx] === undefined) {
                                                                pixelsmap[bly][blx]=mask;
                                                                ctx.fillRect(blx,bly,1,1);
                                                            } else {
                                                                spriteCollisions |= mask;
                                                                spriteCollisions |= pixelsmap[bly][blx];
                                                            }
                                                        }
                                                }
                                                byte = byte>>2;
                                            }
                                            spriteAddress++;
                                        }
                                        dx=px;
                                        dy+=pixelHeight;
                                    }
                                } else {
                                    let pixelRow = pixelWidth*8;
                                    ctx.fillStyle = unicolorColor;
                                    for (let y=0;y<21;y++) {
                                        for (let bx=0;bx<3;bx++) {
                                            dx += pixelRow;
                                            let
                                                rx = dx,
                                                byte = S.memory.syncPeek(spriteAddress);
                                            for (let x=0;x<8;x++) {
                                                rx-=pixelWidth;
                                                if (byte % 2) {
                                                    for (let blx=rx;blx<rx+pixelWidth;blx++)
                                                        for (let bly=dy;bly<dy+pixelHeight;bly++) {
                                                            if (pixels[bly-oy] && (pixels[bly-oy][blx-ox]>-1)) backgroundCollisions|=mask;
                                                            if (!pixelsmap[bly]) pixelsmap[bly]=[];
                                                            if (pixelsmap[bly][blx] === undefined) {
                                                                pixelsmap[bly][blx]=mask;
                                                                ctx.fillRect(blx,bly,1,1);
                                                            } else {
                                                                spriteCollisions |= mask;
                                                                spriteCollisions |= pixelsmap[bly][blx];
                                                            }
                                                        }
                                                }
                                                byte = byte>>1;
                                            }
                                            spriteAddress++;
                                        }
                                        dx=px;
                                        dy+=pixelHeight;
                                    }
                                }
                            }
                            mask = mask << 1;
                            coords += 2;
                            unicolorRegister++;
                            startingAddress++;
                        }
                        S.memory.syncPoke(53278,spriteCollisions);
                        S.memory.syncPoke(53279,backgroundCollisions);
                    }

                    system.display.addDisplayLayer(1500,(S,ctx,ox,oy)=>renderSprites(0,S,ctx,ox,oy));
                    system.display.addDisplayLayer(3500,(S,ctx,ox,oy)=>renderSprites(1,S,ctx,ox,oy));
                }
            },
        },
        {
            name:"memory-64-unsupported",
            description:"Adds Commodore 64 common memory areas as unsupported free memory.",
            contains:{
                memoryLocations:[
                    {
                        address:53265,
                        description:"Screen control register #1. (=128)",
                        getter:{
                            getterProcess:function(S,P,v) {
                                return 128 // TODO Wait for screen redraw?
                            }
                        },
                        setter:0
                    },{
                        address:53266,
                        description:"Current raster line. (=64)",
                        getter:{
                            getterProcess:function(S,P,v) {
                                return 64 // TODO Wait for screen redraw?
                            }
                        },
                        setter:0
                    },{
                        address:56577,
                        description:"Port B, RS232 access."
                    },{
                        address:56578,
                        description:"Port A data direction register."
                    },{
                        address:56579,
                        description:"Port B data direction register."
                    },{
                        address:19,
                        description:"Current I/O device number."
                    },{
                        address:0,
                        description:"Processor port data direction register."
                    },{
                        address:650,
                        description:"Keyboard repeat switch."
                    }
                ],
                memoryAreas:[
                    {
                        fromAddress:2024,
                        toAddress:2039,
                        description:"Unused."
                    },{
                        fromAddress:1020,
                        toAddress:1023,
                        description:"Unused."
                    },{
                        fromAddress:828,
                        toAddress:1019,
                        description:"Datasette buffer."
                    },{
                        fromAddress:53295,
                        toAddress:53311,
                        description:"Unusable."
                    }
                ]
            }
        },
        {
            name:"memory-64-basic",
            description:"Adds Commodore 64 basic area memory.",
            contains:{
                memoryAreas:[
                    {
                        fromAddress:2049,
                        toAddress:40959,
                        description:"Default BASIC area"
                    }
                ]
            }
        },
        {
            name:"sound-64-unsupported",
            description:"Adds Commodore 64 SID memory areas as unsupported free memory. (i.e. no audio)",
            contains:{
                memoryAreas:[
                    {
                        fromAddress:54272,
                        toAddress:55295,
                        description:"SID."
                    }
                ]
            }
        },
        {
            name:"memory-64-screen",
            description:"Adds Commodore 64 memory areas for screen manipulation.",
            contains:{
                memoryLocations:[
                    {
                        address:53280,
                        description:"Display border color.",
                        setter:{ 
                            device:"display",
                            setter:"screenSetBorderColor",
                        },
                        getter:{ 
                            device:"display",
                            getter:"screenGetBorderColor"
                        }
                    },{
                        address:53281,
                        description:"Display background color.",
                        setter:{ 
                            device:"display",
                            setter:"screenSetBgColor",
                        },
                        getter:{ 
                            device:"display",
                            getter:"screenGetBgColor"
                        }
                    },{
                        address:646,
                        description:"Cursor color.",
                        setter:{ 
                            device:"display",
                            setter:"cursorSetFgColor",
                        },
                        getter:{ 
                            device:"display",
                            getter:"cursorGetFgColor"
                        }
                    },{
                        address:211,
                        description:"Cursor X position.",
                        setter:{ 
                            device:"display",
                            setter:"cursorSetX",
                        },
                        getter:{ 
                            device:"display",
                            getter:"cursorGetX"
                        }
                    },{
                        address:214,
                        description:"Cursor Y position.",
                        setter:{ 
                            device:"display",
                            setter:"cursorSetY",
                        },
                        getter:{ 
                            device:"display",
                            getter:"cursorGetY"
                        }
                    }
                ],
                memoryAreas:[
                    {
                        fromAddress:1024,
                        toAddress:2023,
                        description:"Text screen characters.",
                        getter:{
                            getterProcess:function(S,P,a) {
                                let
                                    w=S.display.textGetWidth(),
                                    x=a%w,
                                    y=Math.floor(a/w);
                                return S.charmap.getScreenCodeAt(x,y);
                            }
                        },
                        setter:{
                            setterProcess:function(S,P,a,v) {
                                let
                                    w=S.display.textGetWidth(),
                                    x=a%w,
                                    y=Math.floor(a/w);
                                S.charmap.setScreenCodeAt(x,y,v);
                            },
                        }
                    },{
                        fromAddress:55296,
                        toAddress:56295,
                        description:"Text screen colors.",
                        getter:{
                            getterProcess:function(S,P,a) {
                                let
                                    w=S.display.textGetWidth(),
                                    col=a%w,
                                    row=Math.floor(a/w);
                                return S.display.textGetCharFgColorAt(col,row);
                            }
                        },
                        setter:{
                            setterProcess:function(S,P,a,v) {
                                let
                                    w=S.display.textGetWidth(),
                                    col=a%w,
                                    row=Math.floor(a/w);
                                S.display.textSetCharFgColorAt(col,row,v);
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"charmap-64",
            description:"Adds Commodore 64 charmap.",
            requires:["parser-retro-macros"],
            contains:{
                charMap:[
                    { char:0, asLabels:["NULL"] }, // (unused)
                    { char:1, asLabels:["CT A"] }, // (unused)
                    { char:2, asLabels:["CT B"] }, // (unused)
                    { char:3, asLabels:["CT C"], asKeyCodes:[35] }, // Stop
                    { char:4, asLabels:["CT D"] }, // (unused)
                    { char:5, asSpecialChar: D.CHAR_WHITE, asLabels:["WHITE","WHT","CT E"] }, // white
                    { char:6, asLabels:["CT F"] }, // (unused)
                    { char:7, asLabels:["CT G"] }, // (unused)
                    { char:8, asAscii:20, asLabels:["CT H","UP/LO LOCK ON"] }, // disable C=-Shift
                    { char:9, asLabels:["CT I","UP/LO LOCK OFF"] }, // enable C=-Shift
                    { char:10, asLabels:["CT J"] }, // (unused)
                    { char:11, asAscii:17, asLabels:["CT K"] }, // (unused)
                    { char:12, asAscii:147, asLabels:["CT L"] }, // (unused)
                    { char:13, asSpecialChar: D.CHAR_CARRIAGE_RETURN, asLabels:["CT M", "RETURN"] }, // Return
                    { char:14, asLabels:["CT N"] }, // lo/up charset
                    { char:15, asLabels:["CT O"] }, // (unused)
                    { char:16, asLabels:["CT P"] }, // (unused)
                    { char:17, asAscii:11, asSpecialChar: D.CHAR_DOWN, asLabels:["CT Q","DOWN"], asKeyCodes:[40] }, // cursor down
                    { char:18, asSpecialChar: D.CHAR_REVERSE_ON, asLabels:["CT R","REVERSE ON","RVON","RVS ON","RVRS ON"] }, // reverse on
                    { char:19, asSpecialChar: D.CHAR_HOME, asLabels:["CT S","HOME"], asKeyCodes:[36] }, // Home
                    { char:20, asAscii:8, asSpecialChar: D.CHAR_BACKSPACE, asLabels:["CT T","DELETE","DEL"], asKeyCodes:[46] }, // Delete
                    { char:21, asLabels:["CT U"] }, // (unused)
                    { char:22, asLabels:["CT V"] }, // (unused)
                    { char:23, asLabels:["CT W"] }, // (unused)
                    { char:24, asLabels:["CT X"] }, // (unused)
                    { char:25, asLabels:["CT Y"] }, // (unused)
                    { char:26, asLabels:["CT Z"] }, // (unused)
                    { char:27, asLabels:["ESC"] }, // (unused)
                    { char:28, asSpecialChar: D.CHAR_RED, asLabels:["RED"] }, // red
                    { char:29, asSpecialChar: D.CHAR_RIGHT, asLabels:["RIGHT","RGHT"], asKeyCodes:[39] }, // cursor right
                    { char:30, asSpecialChar: D.CHAR_GREEN, asLabels:["GREEN","GRN"] }, // green
                    { char:31, asSpecialChar: D.CHAR_BLUE, asLabels:["BLU","BLUE"] }, // blue
                    { char:32, asScreenCodes:[32], asInvertedScreenCodes:[160], asLabels:["SPACE"] }, // [ ]
                    { char:33, asScreenCodes:[33], asInvertedScreenCodes:[161] },
                    { char:34, asScreenCodes:[34], asInvertedScreenCodes:[162] },
                    { char:35, asScreenCodes:[35], asInvertedScreenCodes:[163] },
                    { char:36, asScreenCodes:[36], asInvertedScreenCodes:[164] },
                    { char:37, asScreenCodes:[37], asInvertedScreenCodes:[165] },
                    { char:38, asScreenCodes:[38], asInvertedScreenCodes:[166] },
                    { char:39, asScreenCodes:[39], asInvertedScreenCodes:[167] },
                    { char:40, asScreenCodes:[40], asInvertedScreenCodes:[168] },
                    { char:41, asScreenCodes:[41], asInvertedScreenCodes:[169] },
                    { char:42, asScreenCodes:[42], asInvertedScreenCodes:[170] },
                    { char:43, asScreenCodes:[43], asInvertedScreenCodes:[171] },
                    { char:44, asScreenCodes:[44], asInvertedScreenCodes:[172], asKeyCodes:[188] },
                    { char:45, asScreenCodes:[45], asInvertedScreenCodes:[173] },
                    { char:46, asScreenCodes:[46], asInvertedScreenCodes:[174], asKeyCodes:[190] },
                    { char:47, asScreenCodes:[47], asInvertedScreenCodes:[175] },
                    { char:48, asScreenCodes:[48], asInvertedScreenCodes:[176] },
                    { char:49, asScreenCodes:[49], asInvertedScreenCodes:[177] },
                    { char:50, asScreenCodes:[50], asInvertedScreenCodes:[178] },
                    { char:51, asScreenCodes:[51], asInvertedScreenCodes:[179] },
                    { char:52, asScreenCodes:[52], asInvertedScreenCodes:[180] },
                    { char:53, asScreenCodes:[53], asInvertedScreenCodes:[181] },
                    { char:54, asScreenCodes:[54], asInvertedScreenCodes:[182] },
                    { char:55, asScreenCodes:[55], asInvertedScreenCodes:[183] },
                    { char:56, asScreenCodes:[56], asInvertedScreenCodes:[184] },
                    { char:57, asScreenCodes:[57], asInvertedScreenCodes:[185] },
                    { char:58, asScreenCodes:[58], asInvertedScreenCodes:[186] },
                    { char:59, asScreenCodes:[59], asInvertedScreenCodes:[187] },
                    { char:60, asScreenCodes:[60], asInvertedScreenCodes:[188] },
                    { char:61, asScreenCodes:[61], asInvertedScreenCodes:[189] },
                    { char:62, asScreenCodes:[62], asInvertedScreenCodes:[190] },
                    { char:63, asScreenCodes:[63], asInvertedScreenCodes:[191] },
                    { char:64, asScreenCodes:[0], asInvertedScreenCodes:[128] },
                    { char:65, asAscii:97, asKeyCodes:[65], asScreenCodes:[1], asInvertedScreenCodes:[129] }, // [a]
                    { char:66, asAscii:98, asKeyCodes:[66], asScreenCodes:[2], asInvertedScreenCodes:[130] }, // [b]
                    { char:67, asAscii:99, asKeyCodes:[67], asScreenCodes:[3], asInvertedScreenCodes:[131] }, // [c]
                    { char:68, asAscii:100, asKeyCodes:[68], asScreenCodes:[4], asInvertedScreenCodes:[132] }, // [d]
                    { char:69, asAscii:101, asKeyCodes:[69], asScreenCodes:[5], asInvertedScreenCodes:[133] }, // [e]
                    { char:70, asAscii:102, asKeyCodes:[70], asScreenCodes:[6], asInvertedScreenCodes:[134] }, // [f]
                    { char:71, asAscii:103, asKeyCodes:[71], asScreenCodes:[7], asInvertedScreenCodes:[135] }, // [g]
                    { char:72, asAscii:104, asKeyCodes:[72], asScreenCodes:[8], asInvertedScreenCodes:[136] }, // [h]
                    { char:73, asAscii:105, asKeyCodes:[73], asScreenCodes:[9], asInvertedScreenCodes:[137] }, // [i]
                    { char:74, asAscii:106, asKeyCodes:[74], asScreenCodes:[10], asInvertedScreenCodes:[138] }, // [j]
                    { char:75, asAscii:107, asKeyCodes:[75], asScreenCodes:[11], asInvertedScreenCodes:[139] }, // [k]
                    { char:76, asAscii:108, asKeyCodes:[76], asScreenCodes:[12], asInvertedScreenCodes:[140] }, // [l]
                    { char:77, asAscii:109, asKeyCodes:[77], asScreenCodes:[13], asInvertedScreenCodes:[141] }, // [m]
                    { char:78, asAscii:110, asKeyCodes:[78], asScreenCodes:[14], asInvertedScreenCodes:[142] }, // [n]
                    { char:79, asAscii:111, asKeyCodes:[79], asScreenCodes:[15], asInvertedScreenCodes:[143] }, // [o]
                    { char:80, asAscii:112, asKeyCodes:[80], asScreenCodes:[16], asInvertedScreenCodes:[144] }, // [p]
                    { char:81, asAscii:113, asKeyCodes:[81], asScreenCodes:[17], asInvertedScreenCodes:[145] }, // [q]
                    { char:82, asAscii:114, asKeyCodes:[82], asScreenCodes:[18], asInvertedScreenCodes:[146] }, // [r]
                    { char:83, asAscii:115, asKeyCodes:[83], asScreenCodes:[19], asInvertedScreenCodes:[147] }, // [s]
                    { char:84, asAscii:116, asKeyCodes:[84], asScreenCodes:[20], asInvertedScreenCodes:[148] }, // [t]
                    { char:85, asAscii:117, asKeyCodes:[85], asScreenCodes:[21], asInvertedScreenCodes:[149] }, // [u]
                    { char:86, asAscii:118, asKeyCodes:[86], asScreenCodes:[22], asInvertedScreenCodes:[150] }, // [v]
                    { char:87, asAscii:119, asKeyCodes:[87], asScreenCodes:[23], asInvertedScreenCodes:[151] }, // [w]
                    { char:88, asAscii:120, asKeyCodes:[88], asScreenCodes:[24], asInvertedScreenCodes:[152] }, // [x]
                    { char:89, asAscii:121, asKeyCodes:[89], asScreenCodes:[25], asInvertedScreenCodes:[153] }, // [y]
                    { char:90, asAscii:122, asKeyCodes:[90], asScreenCodes:[26], asInvertedScreenCodes:[154] }, // [z]
                    { char:91, asScreenCodes:[27], asInvertedScreenCodes:[155] }, // [[]
                    { char:92, asScreenCodes:[28], asInvertedScreenCodes:[156], asLabels:["POUND"] }, // [\]
                    { char:93, asScreenCodes:[29], asInvertedScreenCodes:[157] }, // []]
                    { char:94, asScreenCodes:[30], asInvertedScreenCodes:[158], asLabels:["UP ARROW"] }, // [^]
                    { char:95, asScreenCodes:[31], asInvertedScreenCodes:[159], asLabels:["ARROW LEFT"] }, // [_]
                    { char:96, asAscii:192, asScreenCodes:[64], asInvertedScreenCodes:[192] }, // #192
                    { char:97, asAscii:193, asScreenCodes:[65], asInvertedScreenCodes:[193], asLabels:["A"] }, // #193 / [A]
                    { char:98, asAscii:194, asScreenCodes:[66], asInvertedScreenCodes:[194], asLabels:["B"] }, // #194 / [B]
                    { char:99, asAscii:195, asScreenCodes:[67], asInvertedScreenCodes:[195], asLabels:["C"] }, // #195 / [C]
                    { char:100, asAscii:196, asScreenCodes:[68], asInvertedScreenCodes:[196], asLabels:["D"] }, // #196 / [D]
                    { char:101, asAscii:197, asScreenCodes:[69], asInvertedScreenCodes:[197], asLabels:["E"] }, // #197 / [E]
                    { char:102, asAscii:198, asScreenCodes:[70], asInvertedScreenCodes:[198], asLabels:["F"] }, // #198 / [F]
                    { char:103, asAscii:199, asScreenCodes:[71], asInvertedScreenCodes:[199], asLabels:["G"] }, // #199 / [G]
                    { char:104, asAscii:200, asScreenCodes:[72], asInvertedScreenCodes:[200], asLabels:["H"] }, // #200 / [H]
                    { char:105, asAscii:201, asScreenCodes:[73], asInvertedScreenCodes:[201], asLabels:["I"] }, // #201 / [I]
                    { char:106, asAscii:202, asScreenCodes:[74], asInvertedScreenCodes:[202], asLabels:["J"] }, // #202 / [J]
                    { char:107, asAscii:203, asScreenCodes:[75], asInvertedScreenCodes:[203], asLabels:["K"] }, // #203 / [K]
                    { char:108, asAscii:204, asScreenCodes:[76], asInvertedScreenCodes:[204], asLabels:["L"] }, // #204 / [L]
                    { char:109, asAscii:205, asScreenCodes:[77], asInvertedScreenCodes:[205], asLabels:["M"] }, // #205 / [M]
                    { char:110, asAscii:206, asScreenCodes:[78], asInvertedScreenCodes:[206], asLabels:["N"] }, // #206 / [N]
                    { char:111, asAscii:207, asScreenCodes:[79], asInvertedScreenCodes:[207], asLabels:["O"] }, // #207 / [O]
                    { char:112, asAscii:208, asScreenCodes:[80], asInvertedScreenCodes:[208], asLabels:["P"] }, // #208 / [P]
                    { char:113, asAscii:209, asScreenCodes:[81], asInvertedScreenCodes:[209], asLabels:["Q"] }, // #209 / [Q]
                    { char:114, asAscii:210, asScreenCodes:[82], asInvertedScreenCodes:[210], asLabels:["R"] }, // #210 / [R]
                    { char:115, asAscii:211, asScreenCodes:[83], asInvertedScreenCodes:[211], asLabels:["S"] }, // #211 / [S]
                    { char:116, asAscii:212, asScreenCodes:[84], asInvertedScreenCodes:[212], asLabels:["T"] }, // #212 / [T]
                    { char:117, asAscii:213, asScreenCodes:[85], asInvertedScreenCodes:[213], asLabels:["U"] }, // #213 / [U]
                    { char:118, asAscii:214, asScreenCodes:[86], asInvertedScreenCodes:[214], asLabels:["V"] }, // #214 / [V]
                    { char:119, asAscii:215, asScreenCodes:[87], asInvertedScreenCodes:[215], asLabels:["W"] }, // #215 / [W]
                    { char:120, asAscii:216, asScreenCodes:[88], asInvertedScreenCodes:[216], asLabels:["X"] }, // #216 / [X]
                    { char:121, asAscii:217, asScreenCodes:[89], asInvertedScreenCodes:[217], asLabels:["Y"] }, // #217 / [Y]
                    { char:122, asAscii:218, asScreenCodes:[90], asInvertedScreenCodes:[218], asLabels:["Z"] }, // #218 / [Z]
                    { char:123, asAscii:219, asScreenCodes:[91], asInvertedScreenCodes:[219] }, // #219
                    { char:124, asAscii:220, asScreenCodes:[92], asInvertedScreenCodes:[220] }, // #220
                    { char:125, asAscii:221, asScreenCodes:[93], asInvertedScreenCodes:[221] }, // #221
                    { char:126, asAscii:222, asScreenCodes:[94], asInvertedScreenCodes:[222] }, // #222
                    { char:127, asAscii:223, asScreenCodes:[95], asInvertedScreenCodes:[223] }, // #223
                    { char:129, asSpecialChar: D.CHAR_ORANGE, asLabels:["ORANGE","ORNG"] }, // orange
                    { char:133, asLabels:["F1"], asKeyCodes:[112] }, // F1
                    { char:134, asLabels:["F3"], asKeyCodes:[114] }, // F3
                    { char:135, asLabels:["F5"], asKeyCodes:[116] }, // F5
                    { char:136, asLabels:["F7"], asKeyCodes:[118] }, // F7
                    { char:137, asLabels:["F2"], asKeyCodes:[113] }, // F2
                    { char:138, asLabels:["F4"], asKeyCodes:[115] }, // F4
                    { char:139, asLabels:["F6"], asKeyCodes:[117] }, // F6
                    { char:140, asLabels:["F8"], asKeyCodes:[119] }, // F8
                    { char:141, asLabels:["SHIFT RETURN"] },
                    { char:142, asLabels:["UPPER CASE"] },
                    { char:144, asSpecialChar: D.CHAR_BLACK, asLabels:["BLACK","BLK"] }, // black
                    { char:145, asSpecialChar: D.CHAR_UP, asLabels:["UP"], asKeyCodes:[38] }, // cursor up
                    { char:146, asSpecialChar: D.CHAR_REVERSE_OFF, asLabels:["REVERSE OFF","RVOF","RVS OFF","RVRS OFF"] }, // reverse off
                    { char:147, asAscii:12, asSpecialChar: D.CHAR_CLEAR, asLabels:["CLEAR","CLR"] }, // Clear
                    { char:148, asSpecialChar: D.CHAR_INSERT, asLabels:["INST","INSERT"], asKeyCodes:[45] }, // Insert
                    { char:149, asSpecialChar: D.CHAR_BROWN, asLabels:["BROWN","BRN"] }, // brown
                    { char:150, asSpecialChar: D.CHAR_LIGHTRED, asLabels:["PINK", "LRED","LT RED" ] }, // pink
                    { char:151, asSpecialChar: D.CHAR_DARKGREY, asLabels:["DARK GRAY","GRY1","GREY1"] }, // dark grey
                    { char:152, asSpecialChar: D.CHAR_GREY, asLabels:["GRAY","GRY2","GREY2"] }, // grey
                    { char:153, asSpecialChar: D.CHAR_LIGHTGREEN, asLabels:["LGRN", "LIGHT GREEN","LT GREEN"] }, // light green
                    { char:154, asSpecialChar: D.CHAR_LIGHTBLUE, asLabels:["LIGHT BLUE","LBLU","LT BLUE"] }, // light blue
                    { char:155, asSpecialChar: D.CHAR_LIGHTGREY, asLabels:["LIGHT GRAY","GRY3","GRAY3"] }, // light grey
                    { char:156, asSpecialChar: D.CHAR_VIOLET, asLabels:["PURPLE","PUR"] }, // purple
                    { char:157, asSpecialChar: D.CHAR_LEFT, asLabels:["LEFT"], asKeyCodes:[37] }, // cursor left
                    { char:158, asSpecialChar: D.CHAR_YELLOW, asLabels:["YELLOW","YEL"] }, // yellow
                    { char:159, asSpecialChar: D.CHAR_CYAN, asLabels:["CYAN","CYN"] }, // cyan
                    { char:160, asScreenCodes:[96], asInvertedScreenCodes:[224], asLabels:["SH SPACE","SHIFT-SPACE"] }, // #160
                    { char:161, asScreenCodes:[97], asInvertedScreenCodes:[225], asLabels:["CM K","CBM-K"] }, // #161
                    { char:162, asScreenCodes:[98], asInvertedScreenCodes:[226], asLabels:["CM I","CBM-I"] }, // #162
                    { char:163, asScreenCodes:[99], asInvertedScreenCodes:[227], asLabels:["CM T","CBM-T"] }, // #163
                    { char:164, asScreenCodes:[100], asInvertedScreenCodes:[228], asLabels:["CM @","CBM-@"] }, // #164
                    { char:165, asScreenCodes:[101], asInvertedScreenCodes:[229], asLabels:["CM G","CBM-G"] }, // #165
                    { char:166, asScreenCodes:[102], asInvertedScreenCodes:[230], asLabels:["CM +","CBM-+"] }, // #166
                    { char:167, asScreenCodes:[103], asInvertedScreenCodes:[231], asLabels:["CM M","CBM-M"] }, // #167
                    { char:168, asScreenCodes:[104], asInvertedScreenCodes:[232], asLabels:["CM POUND","CM-POUND"] }, // #168
                    { char:169, asScreenCodes:[105], asInvertedScreenCodes:[233], asLabels:["SH POUND","SHIFT-POUND"] }, // #169
                    { char:170, asScreenCodes:[106], asInvertedScreenCodes:[234], asLabels:["CM N","CBM-N"] }, // #170
                    { char:171, asScreenCodes:[107], asInvertedScreenCodes:[235], asLabels:["CM Q","CBM-Q"] }, // #171
                    { char:172, asScreenCodes:[108], asInvertedScreenCodes:[236], asLabels:["CM D","CBM-D"] }, // #172
                    { char:173, asScreenCodes:[109], asInvertedScreenCodes:[237], asLabels:["CM Z","CBM-Z"] }, // #173
                    { char:174, asScreenCodes:[110], asInvertedScreenCodes:[238], asLabels:["CM S","CBM-S"] }, // #174
                    { char:175, asScreenCodes:[111], asInvertedScreenCodes:[239], asLabels:["CM P","CBM-P"] }, // #175
                    { char:176, asScreenCodes:[112], asInvertedScreenCodes:[240], asLabels:["CM A","CBM-A"] }, // #176
                    { char:177, asScreenCodes:[113], asInvertedScreenCodes:[241], asLabels:["CM E","CBM-E"] }, // #177
                    { char:178, asScreenCodes:[114], asInvertedScreenCodes:[242], asLabels:["CM R","CBM-R"] }, // #178
                    { char:179, asScreenCodes:[115], asInvertedScreenCodes:[243], asLabels:["CM W","CBM-W"] }, // #179
                    { char:180, asScreenCodes:[116], asInvertedScreenCodes:[244], asLabels:["CM H","CBM-H"] }, // #180
                    { char:181, asScreenCodes:[117], asInvertedScreenCodes:[245], asLabels:["CM J","CBM-J"] }, // #181
                    { char:182, asScreenCodes:[118], asInvertedScreenCodes:[246], asLabels:["CM L","CBM-L"] }, // #182
                    { char:183, asScreenCodes:[119], asInvertedScreenCodes:[247], asLabels:["CM Y","CBM-Y"] }, // #183
                    { char:184, asScreenCodes:[120], asInvertedScreenCodes:[248], asLabels:["CM U","CBM-U"] }, // #184
                    { char:185, asScreenCodes:[121], asInvertedScreenCodes:[249], asLabels:["CM O","CBM-O"] }, // #185
                    { char:186, asScreenCodes:[122], asInvertedScreenCodes:[250], asLabels:["SH @","SHIFT-@"] }, // #186
                    { char:187, asScreenCodes:[123], asInvertedScreenCodes:[251], asLabels:["CM F","CBM-F"] }, // #187
                    { char:188, asScreenCodes:[124], asInvertedScreenCodes:[252], asLabels:["CM C","CBM-C"] }, // #188
                    { char:189, asScreenCodes:[125], asInvertedScreenCodes:[253], asLabels:["CM X","CBM-X"] }, // #189
                    { char:190, asScreenCodes:[126], asInvertedScreenCodes:[254], asLabels:["CM V","CBM-V"] }, // #190
                    { char:191, asScreenCodes:[127], asInvertedScreenCodes:[255], asLabels:["CM B","CBM-B"] }, // #191
                    { char:192, asAscii:96, asLabels:["SH ASTERISK","SHIFT-*"] }, // [`]
                    { char:193, asAscii:65, asLabels:["SHIFT-A"] }, // [A]
                    { char:194, asAscii:66, asLabels:["SHIFT-B"] }, // [B]
                    { char:195, asAscii:67, asLabels:["SHIFT-C"] }, // [C]
                    { char:196, asAscii:68, asLabels:["SHIFT-D"] }, // [D]
                    { char:197, asAscii:69, asLabels:["SHIFT-E"] }, // [E]
                    { char:198, asAscii:70, asLabels:["SHIFT-F"] }, // [F]
                    { char:199, asAscii:71, asLabels:["SHIFT-G"] }, // [G]
                    { char:200, asAscii:72, asLabels:["SHIFT-H"] }, // [H]
                    { char:201, asAscii:73, asLabels:["SHIFT-I"] }, // [I]
                    { char:202, asAscii:74, asLabels:["SHIFT-J"] }, // [J]
                    { char:203, asAscii:75, asLabels:["SHIFT-K"] }, // [K]
                    { char:204, asAscii:76, asLabels:["SHIFT-L"] }, // [L]
                    { char:205, asAscii:77, asLabels:["SHIFT-M"] }, // [M]
                    { char:206, asAscii:78, asLabels:["SHIFT-N"] }, // [N]
                    { char:207, asAscii:79, asLabels:["SHIFT-O"] }, // [O]
                    { char:208, asAscii:80, asLabels:["SHIFT-P"] }, // [P]
                    { char:209, asAscii:81, asLabels:["SHIFT-Q"] }, // [Q]
                    { char:210, asAscii:82, asLabels:["SHIFT-R"] }, // [R]
                    { char:211, asAscii:83, asLabels:["SHIFT-S"] }, // [S]
                    { char:212, asAscii:84, asLabels:["SHIFT-T"] }, // [T]
                    { char:213, asAscii:85, asLabels:["SHIFT-U"] }, // [U]
                    { char:214, asAscii:86, asLabels:["SHIFT-V"] }, // [V]
                    { char:215, asAscii:87, asLabels:["SHIFT-W"] }, // [W]
                    { char:216, asAscii:88, asLabels:["SHIFT-X"] }, // [X]
                    { char:217, asAscii:89, asLabels:["SHIFT-Y"] }, // [Y]
                    { char:218, asAscii:90, asLabels:["SHIFT-Z"] }, // [Z]
                    { char:219, asAscii:123, asLabels:["SHIFT-+"] }, // [{]
                    { char:220, asAscii:124, asLabels:["CM -","CBM--"] }, // [|]
                    { char:221, asAscii:125, asLabels:["SH -","SHIFT--"] }, // [}]
                    { char:222, asAscii:126, asLabels:["SHIFT-^"] }, // [~]
                    { char:223, asAscii:127, asLabels:["CM ASTERISK","CBM-*"] }, // #223
                    { char:224 }, // #224
                    { char:225 }, // #225
                    { char:226 }, // #226
                    { char:227 }, // #227
                    { char:228 }, // #228
                    { char:229 }, // #229
                    { char:230 }, // #230
                    { char:231 }, // #231
                    { char:232 }, // #232
                    { char:233 }, // #233
                    { char:234 }, // #234
                    { char:235 }, // #235
                    { char:236 }, // #236
                    { char:237 }, // #237
                    { char:238 }, // #238
                    { char:239 }, // #239
                    { char:240 }, // #240
                    { char:241 }, // #241
                    { char:242 }, // #242
                    { char:243 }, // #243
                    { char:244 }, // #244
                    { char:245 }, // #245
                    { char:246 }, // #246
                    { char:247 }, // #247
                    { char:248 }, // #248
                    { char:249 }, // #249
                    { char:250 }, // #250
                    { char:251 }, // #251
                    { char:252 }, // #252
                    { char:253 }, // #253
                    { char:254 }, // #254
                ]
            }
        },
        {
            name:"sys-64-screen",
            description:"Adds Commodore 64 common SYS calls for screen manipulation.",
            contains:{
                memoryAreas:[
                    {
                        fromAddress:780,
                        toAddress:783,
                        description:"Value of register A/X/Y/status registers after SYS."
                    }
                ],
                sys:[
                    {
                        address:65520,
                        description:"Set cursor position X,Y at memory address 782,781.",
                        call:{
                            sys:function(S,P,v) {
                                S.display.cursorSetX(S.memory.syncPeek(782));
                                S.display.cursorSetY(S.memory.syncPeek(781));
                            }
                        }
                    },{
                        address:58732,
                        description:"Set cursor position X,Y at memory address 211,214.",
                        call:{
                            sys:function(S,P,v) {
                                S.display.cursorSetX(S.memory.syncPeek(211));
                                S.display.cursorSetY(S.memory.syncPeek(214));
                            }
                        }
                    },{
                        address:58640,
                        description:"Set cursor position X,Y at memory address 211,214.",
                        call:{
                            sys:function(S,P,v) {
                                S.display.cursorSetX(S.memory.syncPeek(211));
                                S.display.cursorSetY(S.memory.syncPeek(214));
                            }
                        }
                    },{
                        address:59903,
                        description:"Clears line of text at address 781.",
                        call:{
                            sys:function(S,P,v) {
                                let
                                    width=S.display.textGetWidth(),
                                    y=S.memory.syncPeek(781);
                                for (let x=0;x<width;x++)
                                    S.display.textSetCharAt(x,y,32);
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"sys-64-unsupported",
            description:"Adds Commodore 64 unsupported SYS calls.",
            contains:{
                
            }
        },
        {
            name:"font-64",
            description:"Sets Commodore 64 fonts. (uppercase and lowercase)",
            contains:{
                fonts:[
                    FONTS.C64UP,
                    FONTS.C64LO
                ]
            }
        },
        {
            name:"palette-64",
            description:"Sets Commodore 64 default color palette.",
            contains:{
                palette:{
                    defaultBgColor:6,
                    defaultFgColor:14,
                    defaultBorderColor:14,
                    messageBgColor:2,
                    messageFgColor:1,
                    nameToColorId:{ black:0, white:1, red:2, cyan:3, violet:4, green:5, blue:6, yellow:7, orange:8, brown:9, lightred:10, darkgrey:11, grey:12, lightgreen:13, lightblue:14, lightgrey:15 },
                    colors:[
                        [0, 0, 0, 255],
                        [255, 255, 255,255],
                        [136, 0, 0,255],
                        [170, 255, 238,255],
                        [204, 68, 204,255],
                        [0, 204, 85,255],
                        [0, 0, 170,255],
                        [238, 238, 119,255],
                        [221, 136, 85,255],
                        [102, 68, 0,255],
                        [255, 119, 119,255],
                        [51, 51, 51,255],
                        [119, 119, 119,255],
                        [170, 255, 102,255],
                        [0, 136, 255,255],
                        [187, 187, 187,255]
                    ]    
                }
            }
        },
        {
            name:"statements-64-unsupported",
            description:"Adds Commodore 64 unsupported statements.",
            contains:{
                statements:[
                   {
                        tokens:["FRE"],
                        description:"Returns the amount of free memory. (returns -26638)",
                        type:"jsFunction",
                        code:function(v,v1,v2) {
                            return this.returnValue(Tokens.newNumber(-26638));
                        }
                    }
                ]
            }
        },
        {
            name:"memory-64-switchfont",
            description:"Adds Commodore 64 memory area to switch fonts.",
            contains:{
                memoryLocations:[
                    {
                        address:53272,
                        description:"Pointer to character memory. (Text mode, only =23 supported)",
                        getter:{
                            getterProcess:function(S,P,a) {
                                if (S.display.fontGetId() == 1) return 23;
                                else return 21;
                            }
                        },
                        setter:{
                            setterProcess:function(S,P,a,v) {
                                if (v == 23) S.display.fontSetId(1);
                                else S.display.fontSetId(0);
                            }
                        }
                    }
                ]
            }
        },
        {
            name:"logic-numbers",
            description:"Use Commodore 64 boolean logic.",
            contains:{
                booleanMode:"BOOL_NUMBERS"
            }
        },
    ]
})