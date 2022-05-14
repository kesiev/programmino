
function Charmap(S) {

    let
        keyCodeToAscii = [],
        charToAscii = [],
        asciiToChar = [],
        labelToAscii = {},
        labelsList = [],
        asciiToSpecialChar = [],
        specialCharToAscii = [],
        keyCodeToSystemKeyCode = [],
        noKeySystemKeyCode = 0,
        screenCodeToAscii = [],
        asciiToScreenCode = [],
        invertedAsciiToScreenCode = [],
        invertedScreenCodes = [],
        letterAliases = [],
        quotedToAscii = {},
        asciiToQuoted = [],
        quotesEnabled = false,
        macrosEnabled = false;

    // Ascii (true system) <-> Char (simulated system)
    this.asciiToChar=(v)=>asciiToChar[v];
    this.charToAscii=(v)=>charToAscii[v];
    this.charAt = (str, pos)=>this.asciiToChar(str.charCodeAt(pos));
    this.charToString = (v)=>String.fromCharCode(this.charToAscii(v));

    // KeyCode (true system) <-> SystemKeyCode (simulated system)
    this.keyCodeToSystemKeyCode = (v)=> v ? keyCodeToSystemKeyCode[v] : noKeySystemKeyCode;

    // KeyCode (true system) --> Ascii (true system)
    this.keyCodeToString = (v)=>String.fromCharCode(keyCodeToAscii[v]);

    // Label (true system) --> Ascii (true system)
    this.labelToAscii = function(v) {
        if (labelToAscii[v]) return labelToAscii[v];
        else {
            let value = parseInt(v);
            if (value == v) {
                return this.charToAscii(value);
            } else {
                console.warn("Can't convert label {"+v+"} to char");
                return 0;
            }
        }
    }
    this.asciiToLabel = (v)=>v ? asciiToLabel[v] ? asciiToLabel[v] : 0 : -1;
    this.labelToString = (v)=>String.fromCharCode(this.labelToAscii(v));

    // Special chars (true system)
    this.asciiToSpecialChar = (v)=>asciiToSpecialChar[v];
    this.specialCharToAscii = (v)=>specialCharToAscii[v] || 0;
    this.specialCharToString = (v)=>String.fromCharCode(this.specialCharToAscii(v));

    // Screencodes
    this.getScreenCodeAt = function(x,y) {
        let
            inv=S.display.textGetCharInverseAt(x,y),
            chr=S.display.textGetCharAt(x,y);
        if (inv) return invertedAsciiToScreenCode[chr];
        else return asciiToScreenCode[chr];
    }
    this.setScreenCodeAt = function(x,y,v) {
        S.display.textSetCharAt(x,y,screenCodeToAscii[v],invertedScreenCodes[v]);
    }

    this.screenCodeToAscii = (v)=>screenCodeToAscii[v];
    this.isScreenCodeInverted = (v)=>invertedScreenCodes[v];
    this.asciiToScreenCode = (v)=>asciiToScreenCode[v];
    this.isScreenCodeInverted = (v)=>invertedScreenCodes[v];

    // Quotes \n
    this.asciiToQuoted=(v)=>asciiToQuoted[v] ? "/"+asciiToQuoted[v] : 0;
    this.quotedToAscii=(v)=>quotedToAscii[v]||0;
    this.quotedToString=(v)=>{
        let chr=this.quotedToAscii(v);
        if (chr) return String.fromCharCode(chr);
        else {
            console.warn("Can't quote letter",v);
            return v;
        }
    }

    // Alias A
    function solveLetterAlias(letter) {
        if (letterAliases)
            for (let j=0;j<letterAliases.length;j++)
                if (letterAliases[j].letter == letter)
                    return String.fromCharCode(letterAliases[j].isAscii);
    }

    // Macros {left}
    this.macroToString = function(v) {
        v=v.toUpperCase();
        let
            symbol="",
            out="",
            found=0;
        
        for (let i=0;i<labelsList.length;i++)
            if (v.substr(0,labelsList[i].length) == labelsList[i]) {
                found = labelsList[i];
                symbol=this.labelToString(found);
                break;
            }
        if (!found) {
            // Support $3F
            let hex=v.match(/^\$[0-9A-F]+/);
            if (hex) {
                found=hex[0];
                symbol=this.charToString(parseInt(found.substr(1),16));
            }
        }
        if (!found) {
            // Support 012
            let dec=v.match(/^[0-9]+/);
            if (dec) {
                found=dec[0];
                symbol=this.charToString(parseInt(found));
            }
        }
        if (found) {
            let times=1;
            if ((v[found.length] == "*") || (v[found.length] == ":"))
                times=parseInt(v.substr(found.length+1));
            else if (found.length!=v.length) {
                console.warn("Can't solve macro",v);
                times=0;
            }
            for (let i=0;i<times;i++) out+=symbol;
        } else console.warn("Can't solve label "+v)
        return out;
    }

    this.solveStringQuotes = function(v) {
        let
            out="",
            macro="",
            open=false;
        for (let i=0;i<v.length;i++) {
            let
                solved=false;
                letter=v.substr(i,1);
            if (macrosEnabled)
                if (open) {
                    solved=true;
                    if (letter=="}") {
                        out+=this.macroToString(macro);
                        open=false;
                    } else macro+=letter;
                } else if (letter=="{") {
                    open=true;
                    macro="";
                    solved=true;
                } 
            if (!solved) {
                let found = solveLetterAlias(letter);
                if (found) {
                    solved=true;
                    out+=found;
                }
            }
            if (!solved) out+=letter;
        }
        return out;
    }

    // Setup
    this.setLetterAliases=function(m) {
        letterAliases = m;
    }

    this.setLetterQuotes=function(m) {
        letterQuotes = m;
    }

    this.setCharMap=function(m) {

        // KeyCode / Ascii
        keyCodeToAscii = [];

        // Ascii/char map
        charToAscii = [];
        asciiToChar = [];

        // Labels / char map
        labelToAscii = {};
        asciiToLabel = [];
        labelsList = [];

        // Special chars / Ascii ,ap
        specialCharToAscii = [];
        asciiToSpecialChar = [];

        // Screen codes
        screenCodeToAscii = [];
        asciiToScreenCode = [];
        invertedScreenCodes = [];

        // Quotes
        quotedToAscii = {};
        asciiToQuoted = [];

        // Initialize
        for (var i=0;i<256;i++) {
            asciiToChar[i]=i;
            charToAscii[i]=i;
            keyCodeToAscii[i]=i;
            screenCodeToAscii[i]=i;
            asciiToScreenCode[i]=i;
            invertedScreenCodes[i]=false;
            invertedAsciiToScreenCode[i] = i;
        }

        // Load
        if (m)
            m.forEach(map=>{
                let asAscii = map.asAscii !== undefined ? map.asAscii : map.char;
                asciiToChar[asAscii] = map.char;
                charToAscii[map.char] = asAscii;
                if (map.asLabels)
                    map.asLabels.forEach(label=>{
                        labelToAscii[label] = asAscii;
                        asciiToLabel[asAscii] = label;
                        labelsList.push(label);
                    });
                if (map.asSpecialChar) {
                    specialCharToAscii[map.asSpecialChar] = asAscii;
                    asciiToSpecialChar[asAscii] = map.asSpecialChar;
                }
                if (map.asKeyCodes)
                    map.asKeyCodes.forEach(keycode=>{
                        keyCodeToAscii[keycode] = asAscii;
                    });
                if (map.asQuoted)
                    map.asQuoted.forEach(quote=>{
                        quotedToAscii[quote] = asAscii;
                        asciiToQuoted[asAscii] = quote;
                    });
                if (map.asScreenCodes)
                    map.asScreenCodes.forEach(screencode=>{
                        screenCodeToAscii[screencode] = asAscii;
                        asciiToScreenCode[asAscii] = screencode;
                    });
                if (map.asInvertedScreenCodes)
                    map.asInvertedScreenCodes.forEach(screencode=>{
                        screenCodeToAscii[screencode] = asAscii;
                        invertedAsciiToScreenCode[asAscii] = screencode;
                        invertedScreenCodes[screencode] = true;
                    });
            })

        // Finalize
        labelsList.sort((a,b)=>{
            if (a.length>b.length) return -1; else
            if (a.length<b.length) return 1; else
            return 0;
        });
    

    }

    this.setSystemKeyCodeMap=function(m) {

        noKeySystemKeyCode = 0;
        keyCodeToSystemKeyCode = [];

        for (var i=0;i<256;i++)
            keyCodeToSystemKeyCode[i]=i;

        // Load
        if (m) {
            noKeySystemKeyCode = m.noKeyIsSystemKeyCode;
            m.map.forEach(map=>{
                keyCodeToSystemKeyCode[map.keyCode]=map.isSystemKeyCode;
            })
        }
    }

    this.setMacrosEnabled = function(v) {
        macrosEnabled = v;
    }

    this.setQuotesEnabled = function(v) {
        quotesEnabled = v;
    }

    this.getQuotesEnabled = function(v) {
        return quotesEnabled;
    }

    // Initialize
    this.setCharMap();
    this.setSystemKeyCodeMap();
}
