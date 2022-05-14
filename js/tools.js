let Tools={
    
    htmlEntities:function(rawStr) {
        return rawStr === undefined ? "" : rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    },
    clone:function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    download:function(url,cb) {
        var oReq = new XMLHttpRequest();
        oReq.onload = (e)=>{
            if (oReq.readyState == 4 && oReq.status == 200) cb(oReq.responseText);
        }
        oReq.open("GET", url);
        oReq.send();
    },
    explain:function(S,node) {
        let out="";
        let mods="";
        let trailmods="";
        if (node.modifiers)
            node.modifiers.forEach(mod=>mods+="<span class=modifier>"+mod.value+"</span>");
        if (node.modifiersTrailing)
            node.modifiersTrailing.forEach(mod=>trailmods+="<span class=modifier>"+mod.value+"</span>");
        switch (node.type) {
            case K.TKN_NULL:{
                out+="<span class=\"token null\">NULL</span>";
                break;
            }
            case K.TKN_NUMBER:{
                out+="<span class=\"token number\">"+mods+node.value+trailmods+"</span>";
                break;
            }
            case K.TKN_BOOLEAN:{
                out+="<span class=\"token boolean\">"+mods+(node.value?"TRUE":"FALSE")+trailmods+"</span>";
                break;
            }
            case K.TKN_STRING:{
                let conv = "";
                for (var i=0;i<node.value.length;i++) {
                    let
                        ord=node.value.charCodeAt(i);
                        special=S.charmap.asciiToLabel(ord),
                        quoted=S.charmap.asciiToQuoted(ord);
                    if (special == -1) conv+="<span class=unknownspecialchar>UNKNOWN</span>";
                    else if (special) conv+="<span class=specialchar>"+special+"</span>";
                    else if (quoted) conv+="<span class=quotedchar>"+quoted+"</span>";
                    else if (ord == 32) conv+="<span class=spacechar>&nbsp;</span>";
                    else conv+=Tools.htmlEntities(node.value[i]);
                }
                out+=mods+"<span class=\"token string\">\""+conv+"\"";
                if (node.action)
                    out+=this.explainAction(S,node,true);
                out+=trailmods+"</span>";
                break;
            }
            default:{
                out+=this.explainAction(S,node);
            }
        }
        return out;
    },
    explainAction:function(S,node,ignorevalue) {
        let out="";
        let mods="";
        let trailmods="";
        if (node.modifiers)
            node.modifiers.forEach(mod=>mods+="<span class=modifier>"+mod.value+"</span>");
        if (node.modifiersTrailing)
            node.modifiersTrailing.forEach(mod=>trailmods+="<span class=modifier>"+mod.value+"</span>");
        if (node.atLine) out+="<span class=atline>"+node.atLine+"</span>";
        if (node.action === undefined) {
            switch (node.type) {    
                case K.TKN_STRINGQUEUE:{
                    out+="<span class=specialsymbol>;</span>";
                    break;
                }
            default:{
                    out+="<span class=token>"+mods+node.value+trailmods+"</span> ";
                }
            }
            
        } else switch (node.action) {
            case K.ACT_INLINEARRAY:{
                out+="<span class=array>[";
                if (node.values.length) {
                    node.values.forEach(value=>out+="<span class=arrayitem>"+this.explainAction(S,value)+"</span>, ");
                    out=out.substr(0,out.length-2);
                }
                out+="]</span>";
                break;
            }
            case K.ACT_INLINEOBJECT:{
                out+="<span class=object>{";
                node.attributes.forEach(value=>out+="<div class=objectproperty><span class=objectkey>"+value.key+"</span>: "+this.explainAction(S,value.value)+"</div>");
                out+="}</span>";
                break;
            }
            case K.ACT_RUNCOMMAND:{
                out+="<span class=command>"+this.explain(S,node.command)+"</span>";
                break;
            }
            case K.ACT_SYMBOLMANIPULATION:{
                if (node.value && !ignorevalue) out+=mods+"<span class=symbol>"+node.value;
                node.manipulation.forEach(manipulation=>out+="<span class=manipulation>"+this.explain(S,manipulation)+"</span>");
                out+=trailmods+"</span>";
                break;
            }
            case K.ACT_CODEBLOCK:{
                let labelsDone={};
                out+="<div class=codeblock>";
                node.code.forEach((line,id)=>{
                    let label="";
                    for (let k in node.labels)
                        if (node.code === node.labels[k].codeblock.code) {
                            if (node.labels[k].index==id) {
                                label+=k+", ";
                                labelsDone[k]=1;
                            }
                        } else labelsDone[k]=1;
                    label=label.substr(0,label.length-2);
                    out+="<div class=codeline>"+(label?"<span class=label>&#x2261; "+label+"</span>":"")+this.explain(S,line)+"</div>"
                });
                let labelsDoneList = "";
                for (let k in node.labels)
                    if (!labelsDone[k]) labelsDoneList+=k+", ";
                labelsDoneList=labelsDoneList.substr(0,labelsDoneList.length-2);
                if (labelsDoneList) out+="<div class=codeline><span class=label>&#x2261; "+labelsDoneList+"</span></div>";
                out+="</div>";
                if (node.data && node.data.length) {
                    out+="<div class=data>DATA:";
                    node.data.forEach(data=>out+="<div class=dataline>"+data+"</div>");
                    out+="</div>";
                }
                break;
            }
            case K.ACT_ASSIGN:{
                out+="<span class=assign>"+this.explain(S,node.to)+" = "+this.explain(S,node.value)+"</span>";
                break;
            }
            case K.ACT_GETARRAY:{
                out+="["+this.explain(S,node.arguments)+"]";
                break;
            }
            case K.ACT_GETPROPERTY:{
                out+="."+this.explain(S,node.arguments);
                break;
            }
            case K.ACT_CALL:{
                out+="(";
                if (node.arguments.length) {
                    node.arguments.forEach(argument=>{
                        out+=this.explain(S,argument)+", ";
                    });
                    out=out.substr(0,out.length-2)+")";
                } else out+=")";
                break;
            }
            case K.ACT_NEXT:{
                out+="<span class='next'>NEXT</span>"+(node.iterator?"<span class=nextiterator>"+node.iterator.value+"</span>":"");
                break;
            }
            case K.ACT_IF:{
                out+="<div class=if><div class=condition>IF "+this.explain(S,node.if)+"</div>";
                if (node.then) out+="<div class=then>THEN "+this.explain(S,node.then)+"</div>";
                if (node.else) out+="<div class=else>ELSE "+this.explain(S,node.else)+"</div>";
                out+="</div>";
                break;
            }
            case K.ACT_EXPRESSION:{
                out+=mods+"<span class=expression>";
                node.expression.forEach(token=>out+=this.explain(S,token));
                out+=trailmods+"</span>";
                break;
            }
            case K.ACT_FOR:{
                out+="<div class=for>FOR";
                if (node.iterator) out+="<div class=iterator>"+node.iterator.value+" TO "+this.explain(S,node.iteratorDestination)+(node.iteratorStep?"STEP"+this.explain(S,node.iteratorStep):"")+"</div>";
                if (node.initializeCode) out+="<div class=initializecode>"+this.explain(S,node.initializeCode)+"</div>";
                if (node.iterationCondition) out+="<div class=iterationCondition>"+this.explain(S,node.iterationCondition)+"</div>";
                if (node.iteration) out+="<div class=iteration>"+this.explain(S,node.iteration)+"</div>";
                if (node.code) out+="<div class=forcode>"+this.explain(S,node.code)+"</div>";
                out+="</div>"
                break;
            }
            case K.ACT_NOOP:{
                out+="<span class=noop>NOOP</span>";
                break;
            }
            case K.ACT_ON:{
                out+="<div class=on>ON "+this.explain(S,node.condition);
                node.options.forEach((option,id)=>out+="<div class=onoption>"+(id+1)+": "+this.explain(S,option)+"</div>");
                out+="</div>"
                break;
            }
            case K.ACT_DEFINEFUNCTION:{
                out+="<div class=definefunction>FUNCTION "+(node.name?node.name.value:"")+"("+node.arguments.join(", ")+")<div class=definefunctionbody>";
                if (node.code) out+="CODE: "+this.explain(S,node.code);
                else out+="EXPRESSION: "+this.explain(S,node.expression)+"";
                out+="</div></div>"
                break;
            }
            case K.ACT_CONDITIONLOOP:{
                out+="<div class=dowhile>";
                if (node.conditionFirst) {
                    if (node.conditionIsEnd) out+="<div class=until>UNTIL ";
                    else out+="<div class=while>WHILE ";
                    out+=this.explain(S,node.condition)+"</div>";
                    if (node.code) out+="<div class=conditionloop>"+this.explain(S,node.code)+"</div>";
                } else {
                    if (node.code) out+="<div class=conditionloop>"+this.explain(S,node.code)+"</div>";
                    if (node.conditionIsEnd) out+="<div class=until>UNTIL ";
                    else out+="<div class=while>WHILE ";
                    out+=this.explain(S,node.condition)+"</div>";
                }
                out+="</div>"
                break;
            }
            case K.ACT_FETCH:{
                out+="&laquo;";
                if (node.arguments.length) {
                    node.arguments.forEach(argument=>{
                        out+=this.explain(S,argument)+" ";
                    });
                    out=out.substr(0,out.length-1);
                }
                break;
            }
            case K.ACT_TERNARY:{
                out+="<span class=ternary><span class=ternarycondition>"+this.explain(S,node.condition)+"</span>?<span class=ternaryontrue>"+this.explain(S,node.onTrue)+"</span>:<span class=ternaryonfalse>"+this.explain(S,node.onFalse)+"</span></span>";
                break;
            }
            case K.ACT_RANGE:{
                out+="<span class=range>" + (node.from?"<span class=rangefrom>"+this.explain(S,node.from)+"</span>":"")+" ~ "+(node.to?"<span class=rangeto>"+this.explain(S,node.to)+"</span>":"") + "</span>";
                break;
            }
            case K.ACT_SWITCH:{
                out+="<div class=switch>SWITCH " +this.explain(S,node.on);
                node.cases.forEach(cas=>{
                    if (cas.onDefault)
                        out+="<div class=switchcasedefault>DEFAULT:";
                    else
                        out+="<div class=switchcase>CASE "+this.explain(S,cas.on)+":";
                    if (cas.code) out+="<div class=switchcode>"+this.explain(S,cas.code)+"</div>";
                    out+="</div>";
                });
                out+="</div>";
                break;
            }
            case K.ACT_DEFINECLASS:{
                out+="<div class=newclass>CLASS " +this.explain(S,node.name);
                if (node.variables) {
                    out+="<div class=classvariables>";
                    node.variables.forEach(variable=>out+="<div class=classvariable>"+this.explain(S,variable.name)+" : "+this.explain(S,variable.value)+"</div>");
                }
                if (node.methods) {
                    out+="<div class=classmethods>";
                    node.methods.forEach(method=>out+="<div class=classmethod>"+this.explain(S,method.name)+this.explain(S,method.code)+"</div>");
                }
                out+="</div>";
                break;
            }
            case K.ACT_INSTANCECLASS:{
                out+="NEW(";
                if (node.arguments.length) {
                    node.arguments.forEach(argument=>{
                        out+=this.explain(S,argument)+", ";
                    });
                    out=out.substr(0,out.length-2)+")";
                } else out+=")";
                break;
            }
            default:{
                console.warn("Unknown action",node);
                debugger;
            }
        }
        return out;
    }
}