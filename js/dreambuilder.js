let DreamBuilder=(function(){
    let
        defaultConfiguration="",
        bundles={},
        packages={};

    function addPackage(p) {
        packages[p.name] = p;
    }

    function build(requirements) {
        let system={};
        system.registry={
            quirkStringsStartsFrom:0,
            quirkArraysStartsFrom:0,
            quirkInputAlwaysUppercase:false,
            quirkElseColonAsNewLine:false,
            quirkFake80Columns:false,
            quirkCallableStrings:false
        };
        system.registry.quirkArraysStartsFrom=0;
        system.registry.quirkStringsStartsFrom=0;
        system.display=new Display(system);
        system.clock=new Clock(system);
        system.cpu=new Cpu(system);
        system.charmap=new Charmap(system);
        system.memory=new Memory(system);
        system.parser=new Parser(system);
        system.logic=new Logic(system);
        system.display.fontSystemSet(FONTS.VGA816);

        let
            cpuGlobal={
                operatorsPriority:[],
                objectContexts:[],
                modifiers:{},
                operators:{},
                variables:{},
                functions:{},
                assignments:{}
            },
            parserConfig={
                argumentsCount:{},
                spreadStatements:[],
                breakArguments:[],
                noEqualStatements:[],
                flipStatements:[],
                ignoreStatements:[],
                tokens:[]
            },
            parserLettersSets=[],
            aliasOf=[],
            runs=[],
            tokensIndex={};
            operators=[];

        for (var i in requirements) {
            if (requirements[i] != 0) {
                let package=packages[i];
                if (package) {

                    if (package.contains) {

                        // CPU global
                        if (package.contains.operators)
                            package.contains.operators.forEach(operator=>{
                                if (!cpuGlobal.operatorsPriority[operator.priority]) cpuGlobal.operatorsPriority[operator.priority]=[];
                                operator.tokens.forEach(token=>{
                                    if (!tokensIndex[token]) tokensIndex[token]={};
                                    tokensIndex[token].isOperator=true;
                                    cpuGlobal.operatorsPriority[operator.priority].push(token);
                                    cpuGlobal.operators[token]=operator.code;
                                })
                            })
                        if (package.contains.modifiers)
                            package.contains.modifiers.forEach(modifier=>{
                                modifier.tokens.forEach(token=>{
                                    if (!tokensIndex[token]) tokensIndex[token]={};
                                    tokensIndex[token].isModifier=true;
                                    tokensIndex[token].isTrailable=modifier.isTrailable;
                                    cpuGlobal.modifiers[token]=modifier.code;
                                })
                            });
                        if (package.contains.assignments)
                            package.contains.assignments.forEach(assign=>{
                                assign.tokens.forEach(token=>{
                                    if (!tokensIndex[token]) tokensIndex[token]={};
                                    tokensIndex[token].isAssign=true;
                                    tokensIndex[token].isEqual=assign.isEqual;
                                    cpuGlobal.assignments[token]=assign.code;
                                })
                            });
                        if (package.contains.objectContexts)
                            package.contains.objectContexts.forEach(context=>{
                                context.tokens.forEach(token=>{
                                    cpuGlobal.objectContexts.push({token:token, context:context.context});
                                })
                            });
                        if (package.contains.statements)
                            package.contains.statements.forEach(statement=>{
                                let fn,ignored,isFetcher,isToken;
                                switch (statement.type) {
                                    case "jsFunction":{
                                        fn=Tokens.newJsFunction(statement.code);
                                        break;
                                    }
                                    case "jsFetcher":{
                                        fn=Tokens.newJsFetcher(statement.code);
                                        isFetcher=true;
                                        break;
                                    }
                                    case "jsProperty":{
                                        fn=Tokens.newJsProperty(statement.code);
                                        break;
                                    }
                                    case "aliasOf":{
                                        aliasOf.push({set:statement.tokens, to:statement.statement});
                                        fn=0;
                                        break;
                                    }
                                    case "ignored":{
                                        ignored=true;
                                        fn=0;
                                        break;
                                    }
                                    case "token":{
                                        isToken=true;
                                        break;
                                    }
                                    default:{
                                        throw "Unknown statement type "+statement.type;
                                    }
                                }
                                if (isFetcher) parserConfig.tokens.push({ symbols:statement.tokens, type: K.TKN_JSFETCHER });
                                statement.tokens.forEach(token=>{
                                    if (statement.argumentsCount !== undefined) parserConfig.argumentsCount[token]=statement.argumentsCount;
                                    if (statement.isSpreaded) parserConfig.spreadStatements.push(token);
                                    if (statement.noEqualStatements) parserConfig.noEqualStatements.push(token);
                                    if (statement.flip) parserConfig.flipStatements.push(token);
                                    if (statement.breakArguments) parserConfig.breakArguments.push(token);
                                    if (statement.addToLettersSets)
                                        parserLettersSets.unshift({
                                            onSequence:token,
                                            setType:K.TKN_SYMBOL,
                                            setAttribute:"value",
                                            append:true,
                                            consume:true
                                        });
                                    if (isToken) {
                                        if (!tokensIndex[token]) tokensIndex[token]={};
                                        tokensIndex[token].is=statement.token;
                                        tokensIndex[token].index=statement.tokenIndex;
                                        tokensIndex[token].value=statement.tokenValue;
                                        tokensIndex[token].relatedToken=statement.relatedToken;
                                    } else if (ignored) {
                                        if (!tokensIndex[token]) tokensIndex[token]={};
                                        tokensIndex[token].is=K.TKN_SYMBOL;
                                        parserConfig.ignoreStatements.push(token);
                                    } else
                                        cpuGlobal.functions[token]=fn;
                                })
                            });

                        // Memory
                        if (package.contains.memoryLocations)
                            package.contains.memoryLocations.forEach(location=>{
                                system.memory.addLocation(location.address, location.getter, location.setter);
                            })
                        if (package.contains.memoryAreas)
                            package.contains.memoryAreas.forEach(area=>{
                                system.memory.addArea(area.fromAddress, area.toAddress, area.getter, area.setter);
                            })
                        if (package.contains.sys)
                            package.contains.sys.forEach(sys=>{
                                system.memory.addSys(sys.address,sys.call);
                            })
                        

                        // Parser
                        if (package.contains.lettersSets)
                            package.contains.lettersSets.forEach(set=>parserLettersSets.push(set));
                        if (package.contains.abbreviations)
                            system.parser.setAbbreviations(package.contains.abbreviations);
                        if (package.contains.symbolsFirst)
                            system.parser.setSymbolsFirst(package.contains.symbolsFirst);
                        if (package.contains.addLowerCaseStatements)
                            system.parser.addLowerCaseStatements(package.contains.addLowerCaseStatements);
                            
                        // Logic
                        if (package.contains.booleanMode)
                            system.logic.setBooleanMode(Logic[package.contains.booleanMode]);

                        // Registry
                        if (package.contains.registry)
                            for (var k in package.contains.registry)
                                system.registry[k]=package.contains.registry[k];

                        // CPU
                        if (package.contains.opsPerTick !== undefined)
                            system.cpu.setOpsPerTick(package.contains.opsPerTick);

                        // Charmap
                        if (package.contains.letterAliases)
                            system.charmap.setLetterAliases(package.contains.letterAliases);
                        if (package.contains.keyCodeMap)
                            system.charmap.setSystemKeyCodeMap(package.contains.keyCodeMap);
                        if (package.contains.quotesEnabled !== undefined)
                            system.charmap.setQuotesEnabled(package.contains.quotesEnabled);
                        if (package.contains.macrosEnabled !== undefined)
                            system.charmap.setMacrosEnabled(package.contains.macrosEnabled);
                        if (package.contains.charMap)
                            system.charmap.setCharMap(package.contains.charMap);

                        // Display
                        if (package.contains.commaSize !== undefined)
                            system.display.textSetCommaSize(package.contains.commaSize);
                        if (package.contains.textWidth !== undefined)
                            system.display.textSetWidth(package.contains.textWidth);
                        if (package.contains.textHeight !== undefined)
                            system.display.textSetHeight(package.contains.textHeight);
                        if (package.contains.frameSize)
                            system.display.screenSetFrameSize(package.contains.frameSize.top,package.contains.frameSize.left,package.contains.frameSize.bottom,package.contains.frameSize.right);
                        if (package.contains.palette)
                            system.display.paletteSet(package.contains.palette);
                        if (package.contains.keyboardEvent)
                            system.display.keyboardRegisterKeyEvent(package.contains.keyboardEvent);
                        if (package.contains.fonts)
                            package.contains.fonts.forEach(font=>{
                                system.display.fontAdd(font);
                            });

                        // Run (executed after the system is initialized)
                        if (package.contains.run)
                            runs.push(package.contains.run);
                    }
                } else throw "Package "+requirements[i]+ " not found";
            }
        }

        for (var k in tokensIndex) {
            if (tokensIndex[k].is !== undefined)
                parserConfig.tokens.push({ symbols:[k], type: tokensIndex[k].is, index:tokensIndex[k].index, value:tokensIndex[k].value, relatedToken:tokensIndex[k].relatedToken });
            else if (tokensIndex[k].isModifier)
                if (tokensIndex[k].isTrailable)
                    parserConfig.tokens.push({ symbols:[k], type: K.TKN_MODIFIERTRAILING, relatedToken:tokensIndex[k].relatedToken });
                else if (tokensIndex[k].isOperator)
                    parserConfig.tokens.push({ symbols:[k], type: K.TKN_MODIFIEROPERATOR, relatedToken:tokensIndex[k].relatedToken });
                else
                    parserConfig.tokens.push({ symbols:[k], type: K.TKN_MODIFIER, relatedToken:tokensIndex[k].relatedToken });
            else if (tokensIndex[k].isAssign)
                if (tokensIndex[k].isEqual)
                    parserConfig.tokens.push({ symbols:[k], type: K.TKN_EQUALASSIGN, relatedToken:tokensIndex[k].relatedToken });
                else
                    parserConfig.tokens.push({ symbols:[k], type: K.TKN_ASSIGN, relatedToken:tokensIndex[k].relatedToken });
            else if (tokensIndex[k].isOperator)
                parserConfig.tokens.push({ symbols:[k], type: K.TKN_OPERATOR, relatedToken:tokensIndex[k].relatedToken });        }

        // Set aliases
        aliasOf.forEach(alias=>{
            alias.set.forEach(set=>{
                cpuGlobal.functions[set]=cpuGlobal.functions[alias.to];
            })
        });

        // Initialize
        system.cpu.setGlobal(cpuGlobal);
        system.parser.setConfig(parserConfig);
        system.parser.setLettersSets(parserLettersSets);
        system.display.reset();

        runs.forEach(run=>run(system));

        system.display.finalize();

        return system;
    }

    function updatePackagesDeps(codePackages) {
        let
            id=0,
            addPackages=[],
            addedPackages={};

        for (var package in codePackages)
            switch (codePackages[package]) {
                case 1:{
                    // Schedule deps check
                    addPackages.push(package);
                    break;
                }
                case 2:{
                    // Remove previous deps
                    delete codePackages[package];
                }
            }
        while (addPackages[id]) {
            let package=addPackages[id];
            if (!addedPackages[package]) {
                addedPackages[package]=1;
                if (packages[package].requires)
                    packages[package].requires.forEach(requirement=>{
                        if ((codePackages[requirement]!==0) && (codePackages[requirement]!==1) && !addedPackages[requirement]) {
                            codePackages[requirement]=2;
                            addPackages.push(requirement);
                        }
                    }); 
            }
            id++;
        }
        return codePackages;
    }

    function getCodePackages(code) {
        let
            codePackages={},
            config = code.match(/\[Programmino:([^\]]+)\]/),
            list = config && config[0] ? config[0] : defaultConfiguration;
        list.replace(/([<>])([^<>\]]+)/g,function(match,action,package) {
            switch (action) {
                case ">":{
                    codePackages[package]=1;
                    break;
                }
                case "<":{
                    codePackages[package]=0;
                    break;
                }
            }
        });
        updatePackagesDeps(codePackages);
        return codePackages;
    }

    function sortPackages(packages, codePackages, mode) {
        packages.forEach(package=>{
            switch (codePackages[package.id]) {
                case 0:{
                    package.priority=1000;
                    break;
                }
                case 1:{
                    package.priority=1500;
                    break;
                }
                case 2:{
                    package.priority=500;
                    break;
                }
                default:{
                    package.priority=0;
                }
            }
        });
        packages.sort((a,b)=>{
            if (a.priority>b.priority) return -1; else
            if (a.priority<b.priority) return 1; else {
                switch (mode) {
                    case 1:{
                        if (a.requires>b.requires) return -1; else
                        if (a.requires<b.requires) return 1;
                        break;
                    }
                    case 2:{
                        if (a.requiredBy>b.requiredBy) return -1; else
                        if (a.requiredBy<b.requiredBy) return 1;
                        break;
                    }
                }
                if (a.id>b.id) return 1; else
                if (a.id<b.id) return -1; else
                return 0;
            }
        });
        return packages;
    }

    function getPackages() {
        let list=[];
        for (var k in packages)
            list.push({
                id:k,
                priority:0,
                requires:this.INDEX[k].requires ? this.INDEX[k].requires.length : 0,
                requiredBy:this.INDEX[k].requiredBy ? this.INDEX[k].requiredBy.length : 0,
                index:this.INDEX[k]
            });
        return list;
    }

    function setCodePackages(code,packages) {
        let
            packagesString="[Programmino:",
            replaced=false;
        for (var k in packages)
            switch (packages[k]) {
                case 1:{
                    packagesString+=">"+k;
                    break;
                }
                case 0:{
                    packagesString+="<"+k;
                    break;
                }
            }
        packagesString+="]";
        code=code.replace(/\[Programmino:([^\]]*)\]/,function(){
            replaced=true;
            return packagesString;
        });
        if (!replaced)
            code+="\n\n// "+packagesString;
        return code;
    }

    return {
        INDEX:{},
        // Packages management
        getCodePackages:getCodePackages,
        setCodePackages:setCodePackages,
        updatePackagesDeps:updatePackagesDeps,
        sortPackages:sortPackages,
        getPackages:getPackages,
        setDefaultConfiguration:function(configuration) {
            defaultConfiguration=configuration;
        },
        // Utilities
        graphWizPackages:function() {
            let out="digraph G {\n";
            for (var k in packages) {
                out+="\t\""+k+"\";\n";
                if (packages[k].requires)
                    for (var v in packages[k].requires)
                        out+="\t\""+k+"\" -> \""+packages[k].requires[v]+"\";\n";
            }
            out+="}";
            return out;
        },
        // Run
        run:function(code, listener, enableLogParser, enableLogRunner) {
            let
                codePackages=getCodePackages(code);
                system=build(codePackages);
            system.clock.setEventListener(listener);
            system.cpu.setEventListener(listener);
            system.clock.start();
            system.cpu.runCode(code,enableLogParser,enableLogRunner);
            return system;
        },
        explain:function(code, listener, enableLogParser) {
            let
                codePackages=getCodePackages(code);
                system=build(codePackages);
            system.cpu.setEventListener(listener);
            return system.cpu.explainCode(code,enableLogParser);
        },
        // Initialization
        initialize:function() {
            let requiredBy={};
            for (var k in packages)
                if (packages[k].requires)
                    packages[k].requires.forEach(k2=>{
                        if (!requiredBy[k2]) requiredBy[k2]=[];
                        requiredBy[k2].push(k);    
                    });
            for (var k in packages) {
                let
                    package=packages[k],
                    contains="";
                if (package.contains) {
                    contains="Contains:<ul>";
                    if (package.contains.lettersSets)
                        contains+="<li><span class='element'>A symbol parser configuration.</span></li>";
                    if (package.contains.statements)
                        package.contains.statements.forEach(statement=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(statement.tokens.join(", "))+"</span>: ";
                            if (statement.type=="aliasOf") {
                                contains+="as "+Tools.htmlEntities(statement.statement);
                            } else contains+=Tools.htmlEntities(statement.description);
                            contains+="</li>"
                        });
                    if (package.contains.modifiers)
                        package.contains.modifiers.forEach(modifier=>{
                            contains+="<li><span class='element'>Modifier "+Tools.htmlEntities(modifier.tokens.join(", "))+"</span>: "+Tools.htmlEntities(modifier.description)+"</li>";
                        });
                    if (package.contains.assignments)
                        package.contains.assignments.forEach(assignment=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(assignment.tokens.join(", "))+"</span>: "+Tools.htmlEntities(assignment.description)+"</li>";
                        });
                    if (package.contains.abbreviations)
                        package.contains.abbreviations.forEach(abbreviation=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(abbreviation.from.join(", "))+"</span>: abbreviates "+Tools.htmlEntities(abbreviation.to)+"</li>";
                        });
                    if (package.contains.letterAliases)
                        package.contains.letterAliases.forEach(alias=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(alias.letter)+"</span>: in listings is ASCII "+alias.isAscii+" ("+Tools.htmlEntities(String.fromCharCode(alias.isAscii))+")</li>";
                        });
                    if (package.contains.objectContexts) {
                        contains+="<li><span class='element'>In object methods</span>:<ul>";
                        package.contains.objectContexts.forEach(ctx=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(ctx.tokens.join(", "))+"</span>: "+Tools.htmlEntities(ctx.description)+"</li>";
                        });
                        contains+="</ul></li>";
                    }
                    if (package.contains.charMap)
                        package.contains.charMap.forEach(char=>{
                            contains+=(
                                "<li><span class='element'>Char "+char.char+"</span>: "+
                                (char.asAscii ? "as ASCII "+char.asAscii+", " :"")+
                                (char.asLabels ? "as label "+char.asLabels.join(", ")+", " :"")+
                                (char.asScreenCodes ? "as screen code "+char.asScreenCodes.join(", ")+", " :"")+
                                (char.asInvertedScreenCodes ? "as inverted screen code "+char.asInvertedScreenCodes.join(", ")+", " :"")+
                                (char.asKeyCodes ? "as keycode "+char.asKeyCodes.join(", ")+", " :"")+
                                (char.asSpecialChar !== undefined ? "as special char "+char.asSpecialChar+", " :"")
                            ).slice(0,-2);
                        });
                    if (package.contains.keyCodeMap) {
                        if (package.contains.keyCodeMap.noKeyIsSystemKeyCode !== undefined)
                            contains+="<li><span class='element'>When no key is pressed</span>: is keycode "+package.contains.keyCodeMap.noKeyIsSystemKeyCode+"</li>";
                        package.contains.keyCodeMap.map.forEach(entry=>{
                            contains+="<li><span class='element'>Pressing keycode "+entry.keyCode+(entry.keyCodeLabel?" ("+entry.keyCodeLabel+")":"")+"</span>: is system keycode "+entry.isSystemKeyCode+"</li>";
                        });
                    }
                    if (package.contains.operators)
                        package.contains.operators.forEach(operator=>{
                            contains+="<li><span class='element'>"+Tools.htmlEntities(operator.tokens.join(", "))+"</span>: "+Tools.htmlEntities(operator.description)+"</li>";
                        });
                    if (package.contains.sys)
                        package.contains.sys.forEach(sys=>{
                            contains+="<li><span class='element'>SYS "+sys.address+"</span>: "+Tools.htmlEntities(sys.description)+"</li>";
                        });
                    if (package.contains.memoryLocations)
                        package.contains.memoryLocations.forEach(location=>{
                            contains+="<li><span class='element'>Memory address "+location.address+"</span>: "+Tools.htmlEntities(location.description)+"</li>";
                        });
                    if (package.contains.memoryAreas)
                        package.contains.memoryAreas.forEach(area=>{
                            contains+="<li><span class='element'>Memory area "+area.fromAddress+"-"+area.toAddress+"</span>: "+Tools.htmlEntities(area.description)+"</li>";
                        });
                    if (package.contains.fonts)
                        package.contains.fonts.forEach(font=>{
                            contains+="<li><span class='element'>Font</span>: "+font.width+"x"+font.height+" ";
                            [65,66,67,49,50,51].forEach(char=>{
                                if (font.data[char]) {
                                    contains+="<div class='sampleletter'>";
                                    font.data[char].forEach(row=>{
                                        contains+="<div class='sampleletterrow'>";
                                        if (row)
                                            for (let x=0;x<font.width;x++)
                                                contains+="<div class='sampleletterpixel "+(row[x]=="1"?"on":"off")+"'></div>";
                                        else
                                            for (let i=0;i<font.width;i++)
                                                contains+="<div class='sampleletterpixel off'></div>";
                                        contains+="</div>";
                                    });
                                    contains+="</div>";
                                }
                            });
                        });
                    if (package.contains.palette) {
                        contains+="<li><span class='element'>Colors</span>:<ul>";
                        let bank=0;
                        package.contains.palette.colors.forEach((color,id)=>{
                            if (package.contains.palette.banks && (id%package.contains.palette.count == 0)) {
                                if (bank) contains+="</ul></li>";
                                contains+="<li><span class='element'>Bank #"+bank+"</span>:<ul>";
                                bank++;
                            }
                            contains+="<li><span class='element'>#"+id+"</span>: <div class='samplecolor' style='background-color:rgb("+color.join(",")+")'></div> RGB("+color.join(",")+")</li>";
                        });
                        if (bank) contains+="</ul></li>";
                        contains+="</ul></li>";
                        if (package.contains.palette.nameToColorId) {
                            contains+="<li><span class='element'>Color IDs</span>:<ul>";
                            for (let k in package.contains.palette.nameToColorId)
                                contains+="<li><span class='element'>"+k+"</span>: <div class='samplecolor' style='background-color:rgb("+package.contains.palette.colors[package.contains.palette.nameToColorId[k]].join(",")+")'></div> Color #"+package.contains.palette.nameToColorId[k]+"</li>";
                            contains+="</ul></li>";
                        }
                        contains+="<li><span class='element'>Display</span>: <div class='sampledisplay' style='color:rgb("+package.contains.palette.colors[package.contains.palette.defaultFgColor].join(",")+");border-color:rgb("+package.contains.palette.colors[package.contains.palette.defaultBorderColor].join(",")+");background-color:rgb("+package.contains.palette.colors[package.contains.palette.defaultBgColor].join(",")+")'>ABC123</div></li>";
                        contains+="<li><span class='element'>Message</span>: <div class='samplemessage' style='color:rgb("+package.contains.palette.colors[package.contains.palette.messageFgColor].join(",")+");background-color:rgb("+package.contains.palette.colors[package.contains.palette.messageBgColor].join(",")+")'>Sample message</div></li>";
                    }
                    contains+="</ul>";
                }
                this.INDEX[k]={
                    id:k,
                    description:Tools.htmlEntities(package.description),
                    requires:package.requires ? package.requires.sort() : false,
                    requiredBy:requiredBy[k] || false,
                    contains:contains
                };
            }
        },
        addPackages:function(b) {
            let ret=true;
            if (bundles[b.name] == undefined) {
                bundles[b.name]=b;
                b.packages.forEach(package=>{
                    if (packages[package.name] !== undefined) throw "Package "+package.name+" already registered";
                });
                b.packages.forEach(package=>addPackage(package));
            } else throw "Bundle "+b.name+" already registered";
        }
    }
})();