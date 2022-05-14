
let K={

    ACT_ASSIGN:1, // x = y
    ACT_CALL:2, // x(y)
    ACT_GETARRAY:3, // x[y]
    ACT_GETPROPERTY:4, // x.y
    ACT_RUNCOMMAND:5, // (simple code run)
    ACT_IF:6, // IF ... THEN ... ELSE
    ACT_CODEBLOCK:7, // { ... }
    ACT_EXPRESSION:8,  // 1 + 2 + a(3)
    ACT_FOR:9, // FOR ...
    ACT_CONDITIONLOOP:10, // DO-WHILE / WHILE-DO / REPEAT-UNTIL...
    ACT_SYMBOLMANIPULATION:11, // a[..](...)
    ACT_NEXT:12, // NEXT ...
    ACT_NOOP:13, // DATA
    ACT_ON:14, // ON ... (statement)
    ACT_DEFINEFUNCTION:15, // DEF...
    ACT_FETCH:16, // PRINT A;"B","C"
    ACT_RANGE:17, // 1 TO 3
    ACT_INLINEARRAY:18, // [...]
    ACT_INLINEOBJECT:19, // {...}
    ACT_TERNARY:20, // a ? b : c
    ACT_SWITCH:21, // SWITCH/CASE
    ACT_DEFINECLASS:22, // CLASS ...
    ACT_INSTANCECLASS:23, // NEW CLASS(...

    TKN_CLOSE:-100, // (The code ended)

    TKN_STRINGQUEUE:-4, // BASIC: "a";b;
    TKN_STRING:-3, // "text"
    TKN_NUMBER:-2, // 12
    TKN_SYMBOL:-1, // print

    TKN_OPENPARENTHESIS:1, // (
    TKN_NEXTARGUMENT:2, // ,
    TKN_CLOSEPARENTHESIS:3, // )

    TKN_STARTCODEBLOCK:4, // {
    TKN_ENDCODEBLOCK:5, // }

    TKN_STARTGETTER:6, // [
    TKN_ENDGETTER:7, // ]

    TKN_STRINGMARKER:8, // "
    TKN_NEWLINE:10, // \n

    TKN_STATEMENT:11, // print
    TKN_MODIFIEROPERATOR:12, // +, -
    TKN_MODIFIER:13,
    TKN_OPERATOR:14, // *
    
    TKN_EQUALASSIGN:15, // =
    TKN_SPACE:16, // [SPC]
    TKN_SEMICOLON:17, // ;
    TKN_COMMENTLINE:18, // REM
    TKN_COMMENTBLOCKSTART:19, // /*
    TKN_COMMENTBLOCKEND:20, // */
    TKN_IF:21, // IF
    TKN_THEN:22, // THEN
    TKN_ELSE:23, // ELSE
    TKN_FOR:24, // FOR
    TKN_TO:25, // TO
    TKN_NEXT:26, // NEXT ...
    TKN_STEP:27, // STEP
    TKN_DOT:28, // .
    TKN_DO:29, // DO
    TKN_WHILE:30, // WHILE
    TKN_ARRAY:31, // (logic arrays)
    TKN_BOOLEAN:32, // true/false
    TKN_RAWLIST:33, // "Hello";a;"how are you";
    TKN_COLON:34, // :
    TKN_DATA:35, // DATA...
    TKN_ON:37, // ON ...
    TKN_FUNCTION:38, // FUNCTION ...
    TKN_FUNCTIONCODE:39, // (the function code itself)
    TKN_NULL:40, // NULL
    TKN_NEXTPROCESSED:41, // (Single solved TKN_NEXT)
    TKN_JSFUNCTION:42, // (Raw javascript functions)
    TKN_TAB:43, // (Tab symbol)
    TKN_JSPROPERTY:44, // (Raw javascript property with getter and setter)
    TKN_JSFETCHER:45, // (Javascript method that consumes a stream of arguments - i.e. PRINT/INPUT that evaluates arguments on the go)
    TKN_RANGE:46, // 1 TO 3
    TKN_RAWCHAR:47, // "A" (parser in raw mode)
    TKN_MODIFIERTRAILING:48, // ++
    TKN_ASSIGN:49, // :=
    TKN_OBJECT:50, // (Logic object)
    TKN_QUESTIONMARK:51, // ?
    TKN_REPEAT:52, // REPEAT
    TKN_UNTIL:53, // UNTIL
    TKN_SWITCH:54, // SWITCH (for SWITCH/CASE)
    TKN_CASE:55, // CASE (for SWITCH/CASE)
    TKN_DEFAULT:57, // DEFAULT (for SWITCH/CASE)
    TKN_CLASS:58, // CLASS
    TKN_CLASSCODE:59, // (the class code itself)

    CTX_INSTANCE:1, // THIS
}

let D={
    CHAR_REVERSE_ON: 1,
    CHAR_REVERSE_OFF: 2,
    CHAR_CLEAR: 3,
    CHAR_DOWN: 4,
    CHAR_UP: 5,
    CHAR_RIGHT: 6,
    CHAR_LEFT: 7,
    CHAR_HOME: 8,
    CHAR_CARRIAGE_RETURN: 9,
    CHAR_BELL: 10,
    CHAR_BACKSPACE: 11,
    CHAR_INSERT:12,

    // Colors by name
    CHAR_BLACK: 100,
    CHAR_WHITE: 101,
    CHAR_RED: 102,
    CHAR_CYAN: 103,
    CHAR_VIOLET: 104,
    CHAR_GREEN: 105,
    CHAR_BLUE: 106,
    CHAR_YELLOW: 107,
    CHAR_ORANGE: 108,
    CHAR_BROWN: 109,
    CHAR_LIGHTRED: 110,
    CHAR_DARKGREY: 111,
    CHAR_GREY: 112,
    CHAR_LIGHTGREEN: 113,
    CHAR_LIGHTBLUE: 114,
    CHAR_LIGHTGREY: 115
}

function Breaker(message,data) {
    if (data && data.atLine) message+= " at line "+data.atLine;
    this.isBreaker = true;
    this.message = message;
    this.data = data;
    debugger;
}
