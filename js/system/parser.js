function Parser(S) {

    function Komprend(S,log,symbolsfirst,symbolslist,abbreviations,rawcode,config,parsers,parsersRoot,rootParserId) {

        function ParserStack(caller,system,parsers,consts,rootParserId) {
            const
                LOOPDETECTOR_THRESHOLD = 100,
                R={
                    PASS:1,
                    BREAKER:2,
                    STARTRAWMODE:3,
                    ENDRAWMODE:4,
                };
            let
                loopDetector = 0;
                returned=0,
                lastCurrentLine=0,
                stack=[],
                global={},
                queue=[],
                parseResult=false,
                processingQueue=false,
                running=true;
    
            function handleResult(result,runIndex,self) {
                if (!--loopDetector) {
                    result = R.BREAKER;
                    returned = new Breaker("Can't parse",{atLine:lastCurrentLine});
                }
                if (result)
                    switch (result) {
                        case R.PASS:{
                            stack.splice(runIndex,1);
                            self.addToQueue(returned,lastCurrentLine,true);
                            break;
                        }
                        case R.ENDRAWMODE:{
                            caller.changeParserMode(0);
                            stack.splice(runIndex,1);
                            self.addToQueue(returned,lastCurrentLine,true);
                            break;
                        }
                        case R.BREAKER:{
                            parseResult = returned;
                            running=false;
                            return false;
                        }
                        case R.STARTRAWMODE:{
                            caller.changeParserMode(1);
                            break;
                        }
                        default:{
                            stack.splice(runIndex,1);
                        }
                    }
            }
    
            this.returnPass=function(pass) {
                returned=pass;
                return R.PASS;
            }
    
            this.endRawMode=function(pass) {
                returned=pass;
                return R.ENDRAWMODE;
            }
    
            this.startRawMode=function(change) {
                return R.STARTRAWMODE;
            }
    
            this.returnBreaker=function(token, message, data) {
                returned=new Breaker(message, {
                    atLine:token.atLine,
                    data:data
                });
                return R.BREAKER;
            }
    
            this.addToQueue=function(token,line,sub) {
                queue.unshift({token:Tokens.clone(token),line:line,sub:sub});
            }
    
            this.processQueue=function() {
                if (!processingQueue) {
                    processingQueue=true;
                    while (running && queue.length) {
                        let
                            process=queue.shift();
                            runIndex=stack.length-1,
                            lastItem=stack[runIndex];
                            indent="";
                        if (!lastItem) {
                            parseResult = parseError();
                            break
                        }
                        lastCurrentLine=process.line || lastItem.invokeLine;
                        if (log) {
                            for (let i=0;i<runIndex;i++) indent+="---";
                            console.log("[",(process.line+"").padStart(4," "),"]",indent,process.sub?"_":">",lastItem.id,process.token.type,process.token.value);
                        }
                        let result=lastItem.parser.apply(this,[lastItem,process.token,process.line]);
                        handleResult(result,runIndex,this);
                    }
                    processingQueue=false;
                }
            },
    
            this.fetch=function(token,line) {
                loopDetector = LOOPDETECTOR_THRESHOLD;
                this.addToQueue(token, line);
                this.processQueue();
                return parseResult;
            }
    
            this.pushToken=function(token) {
                queue.push({token:Tokens.clone(token),line:lastCurrentLine,sub:true});
            }
    
            this.pushParser=function(parserId,preset,token) {
                let newParser={
                    id:parserId,
                    global:global,
                    isRoot:stack.length==0,
                    parser:parsers[parserId],
                    quirks:{},
                    const:consts,
                    system:system,
                    invokeLine:lastCurrentLine,
                    data:[]
                };
                for (let k in preset)
                    switch (k) {
                        case "quirks":{
                            for (let k in preset.quirks) newParser.quirks[k]=preset.quirks[k];
                            break;
                        }
                        default:{
                            newParser[k]=preset[k];
                        }
                    }
                stack.push(newParser);
                newParser.root=stack[0];
                if (token) this.addToQueue(token, lastCurrentLine, true);
                this.processQueue();
            }
    
            this.getResult=function() {
                return stack[0];
            }
    
            this.pushParser(rootParserId)
        }
    
        let
            parserMode=0,
            prevLineCursor=0,
            currentTokenLine=0,
            currentLine=0,
            p=0,
            stringMode=false,
            stringQuote=false,
            commentMode=false,
            commentReturn=false,
            escape=false,
            symbols=[],
            symbolsIndex={},
            currentTokenValue={ value:"" },
            currentTokenType=0,
            currentTokenAttribute="value";
            currentParser=parsersRoot,
            rawLines = rawcode.split("\n"),
            code = "",
            linesCount = 0,
            lineNumbersMap=[];
    
        for (let i=0;i<rawLines.length;i++) {
            let line = rawLines[i].trim();
            if (line.length) {
                code+=line+="\n";
                lineNumbersMap[linesCount]=i+1;
                linesCount++;
            }
        }
        code=code.substr(0,code.length-1);
    
        function isSymbol(code,p,symbol) {
            return (code.substr(p,symbol.text.length)==symbol.text);
        }
    
        function containSymbol(code,p,symbols) {
            for (let i=0;i<symbols.length;i++)
                if (isSymbol(code,p,symbols[i])) return symbols[i];
        }
    
        function processSymbol(symbol) {
            let parseStackResult=false;
            switch (symbol.token.type) {
                case K.TKN_STRINGMARKER:{
                    stringMode=symbol;
                    stringQuote=false;
                    break;
                }
                case K.TKN_COMMENTLINE:{
                    // New lines are still managed by parsers to create the new line
                    commentMode=symbolsIndex[symbol.token.relatedToken];
                    commentReturn=true;
                    break;
                }
                case K.TKN_COMMENTBLOCKSTART:{
                    // Block closing token is not sent to parsers
                    commentMode=symbolsIndex[symbol.token.relatedToken];
                    commentReturn=false;
                    break;
                }
                default:{
                    parseStackResult = parserStack.fetch(symbol.token,lineNumbersMap[currentTokenLine]);
                }
            }
            currentTokenType = 0;
            currentTokenAttribute = "value";
            currentTokenValue = { value:"" };
            currentTokenLine = currentLine;
            return parseStackResult;
        }
    
        function processToken() {
            let parseStackResult = false;
            if (currentTokenType) {
                switch (currentTokenType) {
                    case K.TKN_RAWCHAR:{
                        parseStackResult = parserStack.fetch(Tokens.newRawChar(currentTokenValue.value),lineNumbersMap[currentTokenLine]);
                        break;
                    }
                    case K.TKN_DOT:{
                        parseStackResult = parserStack.fetch(Tokens.newDot(),lineNumbersMap[currentTokenLine]);
                        break;
                    }
                    case K.TKN_SYMBOL:{
                        let
                            symbol=0,
                            upper=currentTokenValue.value.toUpperCase();
                        for (let i=0;i<symbols.length;i++)
                            if (symbols[i].text == upper) {
                                symbol=symbols[i];
                                break;
                            }
                        if (symbol) {
                            let error = processSymbol(symbol);
                            if (error) return error;
                        } else parserStack.fetch(Tokens.newSymbol(currentTokenValue.value),lineNumbersMap[currentTokenLine]);
                        break;
                    }
                    case K.TKN_STRING:{
                        parseStackResult = parserStack.fetch(
                            Tokens.newString(S.charmap.solveStringQuotes(currentTokenValue.value)),
                            lineNumbersMap[currentTokenLine]
                        );
                        break;
                    }
                    case K.TKN_NUMBER:{
                        let number = parseFloat(currentTokenValue.value);
                        if (currentTokenValue.exp) number*=Math.pow(10,parseInt(currentTokenValue.exp));
                        parseStackResult = parserStack.fetch(Tokens.newNumber(number),lineNumbersMap[currentTokenLine]);
                        break;
                    }
                    default:{
                        return new Breaker("Can't parse token type '"+currentTokenType+"'",{atLine:lineNumbersMap[currentTokenLine]});
                    }
                }
                currentTokenType=0;
                currentTokenAttribute = "value";
                currentTokenValue = { value:"" };
                currentTokenLine = currentLine;
            }
            return parseStackResult;
        }
    
        function getNextSymbol() {
            let symbol=0;
            for (let i=0;i<symbols.length;i++)
                if (isSymbol(code,p,symbols[i])) {
                    symbol=symbols[i];
                    break;
                }
            return symbol;
        }
    
        function runCurrentParser() {
            let
                foundContent = 0,
                found = false,
                parser = 0;
    
            for (var k=0;k<currentParser.length;k++) {
                parser=currentParser[k];
                if (parser.onSequence && (code.substr(p,parser.onSequence.length).toUpperCase()==parser.onSequence)) {
                    found=true;
                    foundContent=parser.onSequence;
                }
                if (parser.on && (parser.on.indexOf(code[p]) != -1)) {
                    found=true;
                    foundContent=code[p];
                }
                if (found) {
                    if (parser.setType) currentTokenType = parser.setType;
                    if (parser.setAttribute) {
                        currentTokenAttribute = parser.setAttribute;
                        if (!currentTokenValue[currentTokenAttribute]) currentTokenValue[currentTokenAttribute]="";
                    }
                    if (parser.append) currentTokenValue[currentTokenAttribute]+=foundContent;
                    if (parser.setParser) currentParser = parser.setParser;
                    if (parser.end) found=false;
                    else found = true;
                    if (parser.consume)
                        p+=foundContent.length;
                    break;
                }
            }
    
            return found;
        }
    
        function solveAbbreviations() {
            let found=false;
            for (let i=0;i<abbreviations.length;i++) {
                for (let j=0;j<abbreviations[i].from.length;j++) {
                    let abbr=abbreviations[i].from[j];
                    if (code.substr(p,abbr.length)==abbr) {
                        code=code.substr(0,p)+abbreviations[i].to+code.substr(p+abbr.length,code.length);
                        found=true;
                        break;
                    }
                }
                if (found) break;
            }
           return found;
        }
    
        function parseError() {
            return new Breaker("Can't parse",{atLine:lineNumbersMap[currentLine]});
        }
    
        this.changeParserMode=(mode)=>{
            parserMode=mode;
        }
    
        config.tokens.forEach(token=>{
            token.symbols.forEach(symbol=>{
                let codeSymbol={
                    text:symbol,
                    token:{
                        value:token.value==undefined?symbol:token.value,
                        type:token.type,
                        relatedToken:token.relatedToken
                    }
                };
                symbols.push(codeSymbol);
                if (token.index) token.index.forEach(id=>symbolsIndex[id]=codeSymbol);
            })
        });
    
        symbolslist.forEach(symbol=>symbols.push(symbol));
    
        symbols.sort((a,b)=>{
            if (a.text.length>b.text.length) return -1; else
            if (a.text.length<b.text.length) return 1; else
            return 0;
        });
    
        parserStack=new ParserStack(
            this,
            S,
            parsers,{
                argumentsCount:config.argumentsCount,
                breakArguments:config.breakArguments,
                noEqualStatements:config.noEqualStatements,
                flipStatements:config.flipStatements,
                spreadStatements:config.spreadStatements,
                ignoreStatements:config.ignoreStatements,
                symbolsIndex:symbolsIndex
            },rootParserId);
    
        while (p<code.length) {

            if ((prevLineCursor != p) && (code[p] == "\n")) {
                prevLineCursor=p;
                currentLine++;
            }
    
            switch (parserMode) {
                case 0:{
                    // Tokenizer
                    let symbol;
                    
            
                    if (commentMode) {
                        if (isSymbol(code,p,commentMode)) {
                            if (!commentReturn) p+=commentMode.text.length;
                            commentMode=false;
                        } else p++;
                    } else if (escape) {
                        currentTokenValue[currentTokenAttribute]+=code[p];
                        p++;
                        escape=false;
                    } else if (stringMode) {
            
                        if (stringQuote) {
                            currentTokenValue[currentTokenAttribute]+=S.charmap.quotedToString(code[p]);
                            stringQuote=false;
                            p++;
                        } else if (code[p]=="\n") {
                            // Supporting unclosed strings
                            currentTokenType = K.TKN_STRING;
                            let error =  processToken();
                            if (error) return error;
                            stringMode=false;
                        } else if (S.charmap.getQuotesEnabled() && code[p]=="\\") {
                            stringQuote=true;
                            p++;
                        } else if (isSymbol(code,p,stringMode)) {
                            if (isSymbol(code,p+stringMode.text.length,stringMode)) {
                                // "hello""world" is hello"world
                                currentTokenValue[currentTokenAttribute]+=stringMode.text;
                                p+=2;
                            } else {
                                currentTokenType = K.TKN_STRING;
                                let error =  processToken();
                                if (error) return error;
                                p+=stringMode.text.length;
                                stringMode=false;    
                            }
                        } else {
                            currentTokenValue[currentTokenAttribute]+=code[p];
                            p++;
                        }
            
                    } else {
            
                        if (symbolsfirst) {
            
                            let
                                runparser=true,
                                parserisonroot = currentParser === parsersRoot;
            
                            let symbol = getNextSymbol();
                            if (symbol) {
                                currentParser = parsersRoot;
                                runparser = false;
                                if (currentTokenType) {
                                    let error = processToken();
                                    if (error) return error;    
                                } else {
                                    let error = processSymbol(symbol);
                                    if (error) return error;
                                    p+=symbol.text.length;
                                }
                            }
            
                            if (runparser) {
                                let solved=solveAbbreviations();
                                if (solved) runparser=false;
                            }
            
                            if (runparser) {
                                let found = runCurrentParser();
                                if (!found)
                                    if (parserisonroot) return parseError();
                                    else {
                                        currentParser = parsersRoot;
                                        let error = processToken();
                                        if (error) return error;
                                    }
                            }
            
                        } else {
            
                            let found = runCurrentParser();
            
                            if (!found) {
            
                                let error = processToken();
                                if (error) return error;
            
                                if (currentParser === parsersRoot) {
            
                                    let symbol=getNextSymbol(p);
            
                                    if (symbol) {
                                        let error = processSymbol(symbol);
                                        if (error) return error;
                                        p+=symbol.text.length;
                                    } else return parseError();
            
                                } else currentParser = parsersRoot;
            
                            }
            
                        }
            
                    }
                    break;
                }
                case 1:{
                    // Single letters
                    currentTokenType=K.TKN_RAWCHAR;
                    currentTokenValue.value=code[p];
                    p++;
                    let error =  processToken();
                    if (error) return error;
                    break;
                }
            }
    
       
    
        }
    
        let error = processToken();
        if (error) return error;
        error = parserStack.fetch(Tokens.newClose(),lineNumbersMap[currentTokenLine]);
        if (error) return error;
    
        return parserStack.getResult();
    }
    
    let
        config = 0,
        lettersSets = 0,
        symbolsFirst = false,
        lowerCaseStatements = false,
        abbreviations = [];
        
    this.setSymbolsFirst = function(v) {
        symbolsFirst = !!v;
    }

    this.setAbbreviations = function(v) {
        abbreviations = v || [];
    }

    this.addLowerCaseStatements = function(v) {
        lowerCaseStatements = !!v;
    }

    this.setConfig = function(c) {
        config=c;
    }

    this.setLettersSets = function(s) {
        lettersSets = s;
    }

    this.parse=function(code, enableLogs) {
        let
            parsers = Parser.getParsers(),
            global = S.cpu.getGlobal(),
            symbolsList = [];

        for (var k in global.functions)
            symbolsList.push({
                    text:k,
                    token:{
                        value:k,
                        type:global.functions[k].type
                    }
                });

        if (lowerCaseStatements) {
            for (var k in global.functions) {
                let locase = k.toLowerCase();
                if (k != locase)
                    symbolsList.push({
                        text:k.toLowerCase(),
                        token:{
                            value:k,
                            type:global.functions[k].type
                        }
                    });
            }
            config.tokens.forEach(token=>{
                token.symbols.forEach(symbol=>{
                    let locase = symbol.toLowerCase();
                    if (locase != symbol) {
                        let newToken=Tools.clone(token);
                        newToken.symbols = [locase];
                        if (newToken.value === undefined) newToken.value = symbol;
                        config.tokens.push(newToken);
                    }
                })
            });
        }

        return Komprend(S,enableLogs,symbolsFirst,symbolsList,abbreviations, code,config,parsers,lettersSets,"codeblock");

    }

    // Initialize
    this.setSymbolsFirst(false);
    this.addLowerCaseStatements(false);

}


