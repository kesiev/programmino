
function Cpu(S) {
        
    function Runner(log,system,global,code,runners,rootRunnerId) {

        function RunStack(system,runners,global) {
            const
                R={
                    RETURNVALUE:1,
                    BREAKER:2,
                    END:3,
                    BACKTOTYPE:4,
                    BACKTO:5,
                    WAIT:6,
                    WAITTICK:7,
                    PASSTHRU:8,
                    CONTINUE:9
                };
            let
                returned=false,
                returnTypeId=0,
                returnTypeValue=0,
                returnSendId=0,
                returnSendValue=0,
                returnLastItem = 0,
                returnRunnerId = 0,
                returnArgs = 0,
                stack=[],
                codeRunning=true,
                runResult=0,
                running=true;

            function findType(key,value,times) {
                if (!times) times=1;
                for (let i=stack.length-1;i>0;i--)
                    if (stack[i][key]==value) {
                        times--;
                        if (!times) return i;
                    }                
                return 0;
            }

            function stopRunning() {
                codeRunning = false;
                running = false;
            }

            function handleResult(result,runIndex) {
                let lastItem=stack[runIndex];

                if (codeRunning && result)
                    switch (result) {
                        case R.RETURNVALUE:{
                            if (lastItem.intoKey!==undefined) lastItem.into[lastItem.intoKey]=returned;
                            else lastItem.into.push(returned);
                            stack.splice(runIndex,1);
                            break;
                        }
                        case R.BREAKER:{
                            stopRunning();
                            runResult = returned;
                            return returned;
                        }
                        case R.END:{
                            stopRunning();
                            runResult=returned;
                            break;
                        }
                        case R.BACKTOTYPE:{
                            let position=findType(returnTypeId,returnTypeValue);
                            stack=stack.splice(0,position+1);
                            let lastItem=stack[stack.length-1];
                            if (returnSendId) lastItem[returnSendId]=returnSendValue;
                            break;
                        }
                        case R.BACKTO:{
                            stack=stack.splice(0,returned+1);
                            let lastItem=stack[stack.length-1];
                            if (returnSendId) lastItem[returnSendId]=returnSendValue;
                            break;
                        }
                        case R.WAIT:{
                            running=false;
                            break;
                        }
                        case R.WAITTICK:{
                            running=false;
                            system.cpu.wait(returned);
                            break;
                        }
                        case R.PASSTHRU:{
                            if (lastItem.intoKey!==undefined) lastItem.into[lastItem.intoKey]=returned;
                            else lastItem.into.push(returned);
                            runStack.passThru(returnLastItem,returnRunnerId,returnArgs);
                            break;
                        }
                        case R.CONTINUE:{
                            break;
                        }
                        default:{
                            stack.splice(runIndex,1);
                        }
                    }
            }

            this.returnValue=function(value) {
                returned=value;
                return R.RETURNVALUE;
            }

            this.returnBreaker=function(token, message, data) {
                returned=new Breaker(message, {
                    atLine:token.atLine,
                    stack:stack,
                    data:data
                });
                return R.BREAKER;
            }

            this.returnContinueBreaker=function(token, message, data) {
                returned=new Breaker(message, {
                    atLine:token.atLine,
                    stack:stack,
                    data:data
                });
                handleResult(R.BREAKER,stack.length-1);
            }

            this.returnEnd=function(value) {
                returned = value;
                return R.END;
            }

            this.returnBackToType=function(typeid, typevalue, sendid, sendvalue) {
                returnTypeId=typeid;
                returnTypeValue=typevalue;
                returnSendId=sendid;
                returnSendValue=sendvalue;
                return R.BACKTOTYPE;
            }

            this.returnBackTo=function(position, sendid, sendvalue) {
                returned=position;
                returnSendId=sendid;
                returnSendValue=sendvalue;
                return R.BACKTO;
            }

            this.returnWait=function() {
                return R.WAIT;
            }

            this.returnPauseFetch=function() {
                return R.WAIT;
            }

            this.returnWaitTick=function(cb) {
                returned = cb;
                return R.WAITTICK;
            }

            this.returnPassThru=function(v,lastItem,runnerId,args) {
                returnLastItem = lastItem;
                returnRunnerId = runnerId;
                returnArgs = args;
                returned = v;
                return R.PASSTHRU;
            }        

            this.returnContinue=function(value) {
                returned=value;
                handleResult(R.RETURNVALUE,stack.length-1);
                running=true;
            }

            this.returnContinueFetch=function() {
                handleResult(R.CONTINUE,stack.length-1);
                running=true;
            }

            this.pop=function() {
                stack.pop();
            }
        
            this.cycle=function() {
                let
                    runIndex=stack.length-1,
                    lastItem=stack[runIndex];
                    indent="";
                if (log) {
                    for (let i=0;i<runIndex;i++) indent+="---";
                    console.log("[",((lastItem.atLine||"?")+"").padStart(4," "),"]",indent,lastItem.id);
                }
                handleResult(lastItem.parser.apply(this,[lastItem,stack]),runIndex);
            }

            this.call=function(lastItem,into,intoKey,runnerId,args) {
                let newRunner={
                    id:runnerId,
                    isRoot:stack.length==0,
                    parser:runners[runnerId],
                    into:into,
                    intoKey:intoKey,
                    system:system,
                    defaultScope:lastItem&&lastItem.defaultScope?lastItem.defaultScope:0,
                    global:lastItem&&lastItem.global?lastItem.global:global,
                    local:lastItem&&lastItem.local?lastItem.local:0
                };
                if (!newRunner.defaultScope) newRunner.defaultScope=newRunner.global;
                if (args) for (let k in args) newRunner[k]=args[k];
                if (!newRunner.local) {
                    newRunner.local={};
                    for (let k in newRunner.global) newRunner.local[k]={};
                }
                stack.push(newRunner);
                newRunner.root=stack[0];
            }

            this.passThru=function(lastItem,runnerId,args) {
                this.call(lastItem,lastItem.into,lastItem.intoKey,runnerId,args);
                return true;
            }

            this.goBack=function(times) {
                pointers=pointers.splice(0,pointers.length-times);
                stack=stack.splice(0,pointers[pointers.length-1]);
                return true;
            }

            this.backToRoot=function() {
                pointers=pointers.splice(0,1);
                stack=stack.splice(0,1);
                return true;
            }

            this.getResult=function() {
                return stack[0];
            }

            // Interface

            this.abort=function() {
                stopRunning();
            }

            this.run=function() {
                if (running) this.cycle();
                return codeRunning;
            }

            this.getRunResult=function() {
                return runResult;
            }

        }

        // Initialize memory
        for (var k in global.functions)
            switch (global.functions[k].type) {
                case K.TKN_JSPROPERTY:{
                    if (global.functions[k].structuredValue.initialize)
                        global.functions[k].structuredValue.initialize.apply(this,[system]);
                    break;
                }
            }

        // Run
        let
            runStack=new RunStack(system,runners,global),
            out={};
        runStack.call(0,out,"ret",rootRunnerId,{code:code},true);
        return runStack;
    }


    const
        MESSAGE_SPEED = 5,
        ERROR_AROUND=1;
    
    let
        listener=0,
        global=0,
        runner,
        opsPerTick=0,
        parsed = 0,
        logRunner = false,
        wait = false,
        running = false,
        lines=0;

    function showError(type,result) {
        let
            oneline="",
            message=type+"\n"+result.message,
            chunk="",
            line;
        if (result.data.atLine) {
            line=result.data.atLine-1;
            let
                digits=(""+lines.length).length,
                from=Math.max(line-ERROR_AROUND,0),
                to=Math.min(line+ERROR_AROUND,lines.length-1);
            for (var i=from;i<=to;i++)
                chunk+=((i+1)+"").padStart(digits," ")+" "+(i==line?">":":")+" "+lines[i]+"\n";
            chunk=chunk.substr(0,chunk.length-1);
        }
        S.display.messageShow(message+(chunk?"\n\n"+chunk:""), MESSAGE_SPEED);
        console.warn(type,result.message,result.data);
        if (chunk) {
            let lines=chunk.split("\n");
            lines.forEach(line=>console.warn("| "+line));
        }
        oneline=result.message;
        if (listener && listener.error) listener.error(S,oneline,line);
    }

    function showEnded(result) {
        let oneline = "Ended successfully. Returned: "+Tokens.tokenToString(result,true);
        S.display.messageShow("Ended successfully.\nReturned: "+Tokens.tokenToString(result,true), MESSAGE_SPEED);
        if (listener && listener.ended) listener.ended(S,oneline,result);
    }

    function run() {
        let
            runners = Cpu.getRunners();
        runner=Runner(logRunner,S,global,parsed.codeblock,runners,"root");
        running=true;
    }

    this.setOpsPerTick=function(o) {
        opsPerTick = o || 250;
    }

    this.returnRun = function(statement) {
        run();
        return statement.returnWait();
    }

    this.setEventListener=function(eventListener) {
        listener = eventListener;
    }
    
    this.runCode = function(code, enableLogParser, enableLogRunner) {

        logRunner = enableLogRunner;
        runner = 0;
        running=false;
        wait = false;
        lines = code.split("\n");

        parsed=S.parser.parse(code,enableLogParser);
        if (parsed.isBreaker)
            showError("PARSE ERROR",parsed);
        else {
            if (enableLogParser)
                console.warn("CODEBLOCK:",parsed.codeblock);
            run();
        }
    }

    this.explainCode = function(code, enableLogParser) {
        let parsed=S.parser.parse(code,enableLogParser);
        if (parsed.isBreaker) {
            showError("PARSE ERROR",parsed);
            return false;
        } else
            return Tools.explain(S,parsed.codeblock);
    }

    this.stop = function() {
        let result = runner.getRunResult();
        if (result.isBreaker)
            showError("RUNTIME ERROR",result);
        else
            showEnded(result);
        console.warn("Memory",runner.getResult().defaultScope.variables);
        running = false;
        runner = 0;
    }

    this.abort = function() {
        if (runner) {
            runner.abort();
            running = false;
            runner = 0;
        }
    }

    this.wait = function(cb) {
        wait = cb;
    }

    this.tick = function() {
        if (runner) {
            if (wait) {
                let runWait=wait;
                wait=false;
                runWait();
            }
            for (var i=0;i<opsPerTick;i++) {
                if (running) {
                    running = runner.run();
                    if (wait) break;
                } else {
                    this.stop();
                    break;
                }
            }
        }
    }

    this.setGlobal=function(g) {
        global=g;
    }

    this.getGlobal=function() {
        return global;
    }

    // Initialize
    this.setOpsPerTick();
}
