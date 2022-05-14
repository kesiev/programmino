DreamBuilder.addPackages({
    name:"legacybasic",
    description:"Provides features inspired by earlier BASIC interpreters.",
    packages:[
        {
            name:"dream-legacybasic",
            description:"Adds some features of earlier BASIC interpreters. It enables Programmino to run some Creative Computing collection BASIC programs.",
            requires:[
                "programmino-base",
                "display-retro-80x25",
                "font-retro-vga8x16",
                "frame-retro-small",
                "palette-retro-cga",
                "runtime-retro-inputuppercase",
                "runtime-retro-lowercasestatements",
                "print-retro-commasize14",
                "runtime-retro-stringstartfrom1",
                "runtime-retro-symbolsfirst",
                "runtime-retro-variablesarenotstructures",
                "charmap-ascii"
            ]
        },
    ]
});