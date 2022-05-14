
function Display(S) {

    const
        ISFIREFOX=navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
        TRANSPARENT_COLOR = [0, 0, 0, 0],
        TRANSPARENT_ID = -1,
        CURSOR_BLINK_SPEED = 20,
        MESSAGE_SPEED = 120,
        LAYERS_CHANGE_SPEED =20,
        PIXEL_LAYERS=2,
        PI12= Math.PI/2,
        PI2 = Math.PI*2;

    function createCanvas() {
        let canvas=document.createElement("canvas");
        if (ISFIREFOX)
            canvas.style.imageRendering="-moz-crisp-edges";
        else {
            canvas.style.imageRendering="pixelated";
            canvas.style.fontSmoothing="none";
        }
        return canvas;
    }

    function getCanvasContext(canvas) {
        var ctx=canvas.getContext("2d");
        ctx.webkitImageSmoothingEnabled = ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.oImageSmoothingEnabled = ctx.msImageSmoothingEnabled= false;        
        return ctx;
    }

    let

        // Display
        displayContainer=document.createElement("div"),
        displayBackground=document.createElement("div"),
        displayCanvas=createCanvas(),
        displayCanvasCtx=0,
		displayWidth=0,
		displayHeight=0,
        displayScaleX=1,
        displayScaleY=1,
        displayDirty=false,
        displayRendererDirty=false,
        displayLayers=[],

        // Message
        messageCanvas=createCanvas(),
        messageData=0,
        messageX=0,
        messageY=0,
        messageTimer=0,
        messageMaxWidth=0,
        messageMaxHeight=0,
        messageDirty=false,

        // Font
        font=0,
        fontSystem=0,
        fontId=0,
        fontList=[],

        // Pixel
        pixel=[],
        pixelCursorX=0,
        pixelCursorY=0,
        pixelCanvas=0,
        pixelCanvasCtx=0,
        pixelCanvasDatas=0,
        pixelCanvasMaps=0,
        pixelCanvasTimer=0,
        pixelCanvasVisible=0,
        pixelWidth=0,
        pixelHeight=0,

        // Palette
        palette=[],
        paletteColorsCount=0,
        paletteBanksCount=0,
        paletteNameToColorId={},
        paletteColors=[],

        // Cursor
        cursorX=0,
        cursorY=0,
        cursorFgColor=TRANSPARENT_ID,
        cursorBgColor=TRANSPARENT_ID,
        cursorBank=0,
        cursorFlash=0,
        cursorOver=0,
        cursorTimer=0,
        cursorInvert=false,
        cursorIsVisible=false,
        cursorIsOn=false,
        cursorDirty=false,

        // Text
        text=[],
        textWidth=0,
        textHeight=0,
        textCommaSize=0,
        textLetterWidth=0,
        textLetterHeight=0,

        // Screen
        screenBgColor=TRANSPARENT_ID,
        screenBorderColor=TRANSPARENT_ID,
        screenFrameTop=0,
        screenFrameBottom=0,
        screenFrameRight=0,
        screenFrameLeft=0,

        // Keyboard
        keyboardPressed=0,
        keyboardLastPressed=0,
        keyboardKeyEventsCb={},
        keyboardKeyEventsCbId=0;
        keyboard=[];

    // Normalization/validation

    function normalize(num,cap) {
        if (num === undefined) return num;
        else return Math.floor(Math.abs(num)) % cap; 
    }

    function normalizePaletteColor(color) {
        return normalize(color,paletteColorsCount); 
    }

    function normalizeColorBank(bank) {
        return normalize(bank,paletteBanksCount);
    }

    function normalizeCoord(x) {
        if (x === undefined) return x;
        else return Math.floor(x);
    }

    function normalizeBoolean(v) {
        if ( v=== undefined) return v;
        else return !!v;
    }

    function normalizeByte(v) {
        return normalize(v,256);
    }

    function normalizeBit(v) {
        if ( v=== undefined) return v;
        else return v ? 1 : 0;
    }

    function normalizeFontId(id) {
        return normalize(id,fontList.length);
    }

    function charIsOnScreen(x,y) {
        return (x>=0) && (y>=0) && (x<textWidth) && (y<textHeight);
    }

    function pixelIsOnScreen(x,y) {
        return (x>=0) && (y>=0) && (x<pixelWidth) && (y<pixelHeight);
    }
    
    // Math helpers

    function calculateAngle(x1,y1,x2,y2) {
        let ret=Math.atan2(y2 - y1, x2 - x1)+PI12;
        if (ret<0) ret+=PI2;
        return ret;
    }

    // Palette

    let paletteGetColor=(id)=>id == TRANSPARENT_ID ? TRANSPARENT_COLOR : paletteColors[id];
    let paletteGetHtmlColor=(id)=>"rgba("+paletteGetColor(id).join(",")+")";
    let paletteSolveColor=(id)=>id == TRANSPARENT_ID ? screenBgColor % paletteColorsCount : id;

    // Message

    function messageShow(text,speed) {
        let
            lines=text.replace(/\t/g,"  ").replace(/\r/g,"").split("\n").splice(0,messageMaxHeight),
            width=0;
        
        lines=lines.map(line=>{
            line=line.substr(0,messageMaxWidth);
            width=Math.max(width,line.length);
            return line;
        });

        let
            messageWidth = width*fontSystem.width,
            messageHeight = lines.length*fontSystem.height;

        messageCanvas.width=messageWidth;
        messageCanvas.height=messageHeight;

        let
            ctx=getCanvasContext(messageCanvas),
            fgcolor = paletteGetColor(messageFgColor);

        ctx.fillStyle = paletteGetHtmlColor(messageBgColor);
        ctx.fillRect(0,0,messageWidth,messageHeight);
        messageData=ctx.getImageData(0,0,messageCanvas.width,messageCanvas.height);

        lines.forEach((line,y)=>{
            for (let x=0;x<line.length;x++) {
                let
                    letter=line.charCodeAt(x),
                    letterData=fontSystem.data[letter];
                if (letterData)
                    for (let ly=0;ly<fontSystem.height;ly++)
                        for (let lx=0;lx<fontSystem.width;lx++)
                            if (letterData[ly][lx]) {
                                let px=((lx+x*fontSystem.width)+(ly+y*fontSystem.height)*messageWidth)*4;
                                messageData.data[px]=fgcolor[0];
                                messageData.data[px+1]=fgcolor[1];
                                messageData.data[px+2]=fgcolor[2];
                                messageData.data[px+3]=fgcolor[3];
                            }
            }
        });

        messageX = displayWidth - messageCanvas.width - fontSystem.width;
        messageY = displayHeight - messageCanvas.height - fontSystem.height;
        messageTimer = MESSAGE_SPEED * speed;
        messageDirty = true;

    }

    // Canvas

    function displaySetScale(scalex,scaley) {
        displayScaleX = scalex;
        displayScaleY = scaley;
        displayContainer.style.overflow="hidden";
        displayContainer.style.width = displayWidth * scalex;
        displayContainer.style.height = displayHeight * scaley;
        displayBackground.style.transformOrigin="0px 0px";
        displayBackground.style.transform="scale("+scalex+","+scaley+")";
    }

    function displayEmptyTextRow() {
        let row=[];
        for (let i=0;i<textWidth;i++) row.push(textEmptyChar());
        return row;
    }

    function displayEmptyPixelRow() {
        let row=[];
        for (let x=0;x<pixelWidth;x++)
            row.push(pixelEmptyPixel());
        return row;
    }

    function displayReset() {

        // Font
        fontSet(0, true);
        textLetterWidth=font.width;
        textLetterHeight=font.height;
        pixelWidth=textWidth*textLetterWidth;
        pixelHeight=textHeight*textLetterHeight;

        // Palette
        paletteColors = palette.colors;
        paletteColorsCount = palette.count || paletteColors.length;
        paletteBanksCount = palette.banks || 1;

        paletteNameToColorId = palette.nameToColorId;
        cursorInvert = false;
        cursorFgColor = palette.defaultFgColor;
        cursorBgColor = TRANSPARENT_ID;
        cursorBank = 0;
        cursorFlash = 0;
        cursorOver = 0;
        screenBgColor = palette.defaultBgColor;
        screenBorderColor = palette.defaultBorderColor;

        // Display canvas
        displayDirty = true;
		displayWidth = screenFrameLeft+screenFrameRight+pixelWidth;
		displayHeight = screenFrameTop+screenFrameBottom+pixelHeight;
        displayBackground.style.width = displayWidth;
        displayBackground.style.height = displayHeight;
        displayCanvas.width = displayWidth;
        displayCanvas.height = displayHeight;
        displayCanvasCtx = getCanvasContext(displayCanvas);

        // Message
        messageData=0;
        messageX=0;
        messageY=0;
        messageTimer=0;
        messageDirty=false;
        messageBgColor = palette.messageBgColor;
        messageFgColor = palette.messageFgColor;
        messageMaxWidth = Math.floor(displayWidth/textLetterWidth)-2;
        messageMaxHeight = Math.floor(displayHeight/textLetterHeight)-2;

        // Raw canvas
        if (pixelWidth && pixelHeight) {
            pixelCanvas=createCanvas();
            pixelCanvas.width=pixelWidth;
            pixelCanvas.height=pixelHeight;
            pixelCanvasCtx=getCanvasContext(pixelCanvas);
            pixelCanvasMaps=[];
            pixelCanvasDatas=[];
            pixelCanvasTimer=0;
            pixelCanvasVisible=0;
            for (var i=0;i<PIXEL_LAYERS;i++) {
                let data=pixelCanvasCtx.getImageData(0,0,pixelWidth,pixelHeight);
                pixelCanvasDatas.push(data);
                pixelCanvasMaps.push(data.data);
            }
        } else {
            pixelCanvas=0;
            pixelCanvasCtx=0;
            pixelCanvasDatas=[];
            pixelCanvasMaps = [];
        }

        // Reset text
        cursorX = 0;
        cursorY = 0;
        cursorTimer=0;
        cursorInvert=false;
        cursorIsVisible=false;
        cursorIsOn=false;
        cursorDirty=false;

        text = [];
        for (let y=0;y<textHeight;y++)
            text.push(displayEmptyTextRow());

        // Reset pixels
        pixelCursorX=0;
        pixelCursorY=0;
        pixel=[];
        for (let l=0;l<PIXEL_LAYERS;l++) {
            let layer=[];
            for (let y=0;y<pixelHeight;y++)
                layer.push(displayEmptyPixelRow());
            pixel.push(layer);
        }

        // Clear screen
        textClear();

        // Set scale
        displaySetScale(displayScaleX,displayScaleY);
    }

    function displayFinalize() {
        // Sort display layers
        displayLayers.sort((a,b)=>{
            if (a.priority>b.priority) return 1;
            else if (a.priority<b.priority) return -1;
            else return 0;
        });
    }

    function displayDrawCursor() {
        displayCanvasCtx.fillStyle = paletteGetHtmlColor(text[cursorY][cursorX].fg);
        displayCanvasCtx.fillRect(screenFrameLeft+cursorX*textLetterWidth, screenFrameTop+cursorY*textLetterHeight, textLetterWidth, textLetterHeight);
    }

    function displayAddLayer(priority,renderer) {
        displayLayers.push({
            priority:priority,
            renderer:renderer
        })
    }

    function displayTick() {
        if (displayRendererDirty || displayDirty || cursorDirty || messageDirty) {
            displayCanvas.width=displayWidth;
            displayBackground.style.backgroundColor = paletteGetHtmlColor(screenBgColor);
            for (var i=0;i<displayLayers.length;i++)
                displayLayers[i].renderer(S,displayCanvasCtx,screenFrameLeft,screenFrameTop);
            displayDirty =false;
            cursorDirty=false;
            messageDirty=false;
            displayRendererDirty = false;
        }
        if (messageTimer) {
            messageTimer--;
            if (!messageTimer) {
                messageData = 0;
                messageDirty = true;
            }
        }
        if (cursorIsVisible) {
            cursorTimer++;
            if (cursorTimer>CURSOR_BLINK_SPEED) {
                cursorTimer=0;
                cursorIsOn=!cursorIsOn;
                cursorDirty = true;
            }
        }
        pixelCanvasTimer++;
        if ((PIXEL_LAYERS>1) && (pixelCanvasTimer>LAYERS_CHANGE_SPEED)) {
            pixelCanvasTimer=0;
            pixelCanvasVisible=(pixelCanvasVisible+1)%PIXEL_LAYERS;
            displayDirty=true;
        }
    }

    // Screen

    function screenSetFrameSize(top,right,bottom,left) {
        screenFrameTop = top;
        screenFrameRight = right;
        screenFrameBottom = bottom;
        screenFrameLeft = left;
    }

    function screenSetBorderColor(c) {
        screenBorderColor = c;
        displayDirty = true;
    }
    
    function screenSetBgColor(c) {
        screenBgColor = c;
        displayDirty = true;
    }

    // Cursor

    function cursorSetVisible(visible) {
        cursorIsVisible = visible;
        cursorDirty = true;
        cursorTimer = 0;
        cursorIsOn = visible;
    }

    function cursorSetInvert(r) {
        cursorInvert = r;
    }

    function cursorMoveRight() {
        cursorX++;
        textCheckHorizontalOverflow();
    }

    function cursorMoveLeft() {
        cursorX--;
        textCheckHorizontalOverflow();
    }

    function cursorMoveDown() {
        cursorY++;
        textCheckVerticalOverflow();
    }

    function cursorMoveUp() {
        if (cursorY) cursorY--;
    }

    function cursorMoveHome() {
        cursorX=0;
        cursorY=0;
    }

    function cursorShow() {
        cursorTimer = 0;
        cursorIsOn = true;
        displayDirty = true;
    }

    // Raw pixels

    function pixelEmptyPixel() {
        return -1;
    }

    function pixelUpdate(x,y,layer) {
        let
            px = (x+(y*pixelWidth))*4,
            color = paletteGetColor(pixel[layer][y][x]);
        pixelCanvasMaps[layer][px] = color[0];
        pixelCanvasMaps[layer][px+1] = color[1];
        pixelCanvasMaps[layer][px+2] = color[2];
        pixelCanvasMaps[layer][px+3] = color[3];
        displayDirty = true;
    }

    function pixelUpdateArea(sx,sy,ex,ey) {
        for (let l=0;l<PIXEL_LAYERS;l++)
            for (var x=sx;x<ex;x++)
                for (var y=sy;y<ey;y++)
                    pixelUpdate(x,y,l);
    }
    
    function pixelScrollYBy(amt) {
        for (let l=0;l<PIXEL_LAYERS;l++) {
            let shifted = pixel[l].splice(0,amt);
            for (let i=0;i<amt;i++)
                pixel[l].push(shifted[i]);
        }
        pixelUpdateArea(0,0,pixelWidth,pixelHeight-amt);
    }

    function pixelLayerPut(x,y,layer,color,over) {
        x=Math.floor(x);
        y=Math.floor(y);
        if (pixelIsOnScreen(x,y)) {
            if (over)
                pixel[layer][y][x]=pixel[layer][y][x] == TRANSPARENT_ID ? color : TRANSPARENT_ID;
            else
                pixel[layer][y][x]=color;
            pixelUpdate(x,y,layer);
        }
    }

    function pixelLayerLine(x1,y1,x2,y2,layer,color,over) {
        x1=Math.floor(x1);
        y1=Math.floor(y1);
        x2=Math.floor(x2);
        y2=Math.floor(y2);
        let
            dx =Math.abs(x2 - x1),
            sx = x1 < x2 ? 1 : -1,
            dy = Math.abs(y2 - y1),
            sy = y1 < y2 ? 1 : -1,
            err = (dx > dy ? dx : -dy) / 2;
        if (dx || dy)
            while (true) {
                pixelLayerPut(x1, y1,layer,color,over);
                if (x1 === x2 && y1 === y2) break;
                let e2 = err;
                if (e2 > -dx) {
                    err -= dy;
                    x1 += sx;
                }
                if (e2 < dy) {
                    err += dx;
                    y1 += sy;
                }
            }
    }

    function pixelLayerCircle(cx,cy,radius,start,end,ex,ey,side,layer,color,over) {
        if (side>0) {
            if (start>end) end+=PI2;
        } else {
            if (end>start) start+=PI2;
        }
        let
            step_size = (end - start) / 50,
            angle = start,
            first = true,
            ox,oy;
        if (step_size) {
            do {
                let px = (Math.sin(angle) * radius) + cx,
                py = (-Math.cos(angle) * radius) + cy;
                if (first) first = false;
                else pixelLayerLine(ox,oy,px,py,layer,color,over);
                ox=px;
                oy=py;
                angle = angle + step_size;
            } while (step_size>0? angle < end : angle > end);
            pixelLayerLine(ox,oy,ex,ey,layer,color,cursorOver,over);
        }
    }

    function pixelPlot(x,y) {
        let color=cursorInvert ? TRANSPARENT_ID : cursorFgColor;
        pixelCursorX=x;
        pixelCursorY=y;
        if (S.registry.quirkBottomLeftOrigin)
            y=pixelHeight-y;
        for (let l=0;l<PIXEL_LAYERS;l++)
            pixelLayerPut(x,y,l, l || !cursorFlash ? color : TRANSPARENT_ID,cursorOver);
    }

    function pixelDraw(x2,y2,ang) {
        let
            color=cursorInvert ? TRANSPARENT_ID : cursorFgColor,
            dx=pixelCursorX+x2,
            dy=pixelCursorY+y2,
            startX=pixelCursorX,
            startY=pixelCursorY,
            endX=dx,
            endY=dy;

        if (S.registry.quirkBottomLeftOrigin) {
            startY=pixelHeight-startY;
            endY=pixelHeight-endY;
        }

        if (ang) {
            let
                xx,yy,
                l=Math.sqrt(x2*x2 + y2*y2),
                r=Math.abs((l/2)/Math.sin(ang/2)),
                x3 = (startX+endX)/2;
                y3 = (startY+endY)/2,
                s = Math.sqrt(r*r-Math.pow((l/2),2));
        
            if(ang<0){
                xx = x3 + s*-y2/l;
                yy = y3 + s*x2/l;
            } else {
                xx = x3 - s*-y2/l;
                yy = y3 - s*x2/l;
            }

            let
                ang1=calculateAngle(xx,yy,startX,startY),
                ang2=calculateAngle(xx,yy,endX,endY);

            for (let l=0;l<PIXEL_LAYERS;l++)
                pixelLayerCircle(xx,yy,r,ang2,ang1,startX,startY,ang,l, l || !cursorFlash ? color : TRANSPARENT_ID,cursorOver);
        
        } else {

            for (let l=0;l<PIXEL_LAYERS;l++)
                pixelLayerLine(startX,startY,endX,endY,l, l || !cursorFlash ? color : TRANSPARENT_ID,cursorOver);

        }

        pixelCursorX=dx;
        pixelCursorY=dy;

    }

    function pixelCircle(cx,cy,rad) {
        let color=cursorInvert ? TRANSPARENT_ID : cursorFgColor;
        pixelCursorX=cx+rad;
        pixelCursorY=cy;

        if (S.registry.quirkBottomLeftOrigin)
            cy=pixelHeight-cy;

        for (let l=0;l<PIXEL_LAYERS;l++)
            pixelLayerCircle(cx,cy,rad,0,PI2,cx,cy-rad,1,l, l || !cursorFlash ? color : TRANSPARENT_ID);

    }

    // Font

    function fontUnpack(font) {
        let
            unpackedFont={
                width: font.width,
                height: font.height,
                data:[]
            },
            noRow=[],
            noChar=[];

        for (var x=0;x<font.width;x++)
            noRow.push(0);

        for (var y=0;y<font.height;y++)
            noChar.push(noRow);

        for (var i=0;i<255;i++)
            if (font.data[i]) {
                unpackedFont.data[i]=[];
                for (let y=0;y<font.height;y++)
                    if (font.data[i][y]) {
                        let row=[];
                        for (let x=0;x<font.width;x++)
                            if (font.data[i][y][x]=="1") row.push(1);
                            else row.push(0);
                        unpackedFont.data[i].push(row);
                    } else
                        unpackedFont.data[i].push(Tools.clone(noRow));
            } else
                unpackedFont.data.push(Tools.clone(noChar));
        return unpackedFont;
    }

    function fontSet(id, noredraw) {
        fontId = id;
        font = fontList[fontId];
        if (!noredraw)
            for (let y=0;y<textHeight;y++)
                for (let x=0;x<textHeight;x++)
                    textRenderCharAt(x,y);
    }

    function fontGetRow(ch, row) {
        if (font.data[ch] && font.data[ch][row])
            return font.data[ch][row];
        else
            return false;
    }

    // Textmode

    function textInput(settings,cb) {
        let
            inputValue=[],
            cursorPosition=0;
        cursorSetVisible(true);
        let regId = keyboardRegisterKeyEvent((S,e)=>{
            switch (e.type) {
                case "keydown":{
                    let
                        letter = e.key,
                        code = letter.charCodeAt(0);
                    if (letter.length==1 && code >= 32 && code <= 126) {
                        if (settings.alwaysUppercase) letter=letter.toUpperCase();
                        inputValue[cursorPosition]=letter;
                        cursorPosition++;
                        cursorShow();
                        textPrint(letter);
                    } else switch (e.keyCode) {
                        case 37:{ // Cursor left
                            if (cursorPosition) {
                                cursorPosition--;
                                cursorShow();
                                cursorMoveLeft();
                            }
                            break;
                        }
                        case 39:{ // Cursor right
                            if (cursorPosition<inputValue.length) {
                                cursorPosition++;
                                cursorShow();
                                cursorMoveRight();
                            }
                            break;
                        }
                        case 35:{ // End
                            while (cursorPosition<inputValue.length) {
                                cursorPosition++;
                                cursorMoveRight();
                            }
                            cursorShow();
                            break;
                        }
                        case 36:{ // Home
                            while (cursorPosition) {
                                cursorPosition--;
                                cursorMoveLeft();
                            }
                            cursorShow();
                            break;
                        }
                        case 8:{ // Backspace
                            if (cursorPosition) {
                                let update="";
                                cursorPosition--;
                                inputValue.splice(cursorPosition,1);
                                for (var i=cursorPosition;i<inputValue.length;i++)
                                    update+=inputValue[i];
                                cursorMoveLeft();
                                textPrint(update+" ");
                                for (var i=0;i<=update.length;i++)
                                    cursorMoveLeft();
                                cursorShow();
                            }
                            break;
                        }
                        case 46:{ // Delete
                            if (cursorPosition<inputValue.length) {
                                let update="";
                                inputValue.splice(cursorPosition,1);
                                for (var i=cursorPosition;i<inputValue.length;i++)
                                    update+=inputValue[i];
                                textPrint(update+" ");
                                for (var i=0;i<=update.length;i++)
                                    cursorMoveLeft();
                                cursorShow();
                            }
                            break;
                        }
                        case 13:{
                            let
                                value = inputValue.join(""),
                                msg = cb(value);
                            if (msg)
                                messageShow(msg,1);
                            else {
                                cursorSetVisible(false);
                                cursorSetInvert(false);
                                keyboardUnregisterKeyEvents(regId);
                            }
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                    break;
                }
            }
        });
    }

    function textEmptyChar() {
        return { chr:32, fg:cursorFgColor, bg:TRANSPARENT_ID, inv:false, bank:0, flash:false };
    }

    function textRenderCharAt(x,y) {
        let
            bgcolor,fgcolor,
            letter=text[y][x],
            letterData=font.data[letter.chr],
            flash=false;
        if (letter.inv) {
            bgcolor=letter.fg;
            fgcolor=letter.bg;
        } else {
            bgcolor=letter.bg;
            fgcolor=letter.fg;
        }
        if (letter.bank) {
            if (fgcolor != TRANSPARENT_ID) fgcolor+=letter.bank*paletteColorsCount;
            if (bgcolor != TRANSPARENT_ID) bgcolor+=letter.bank*paletteColorsCount;
        }
        flash=letter.flash;
        x*=textLetterWidth;
        y*=textLetterHeight;
        if (letterData)
            for (let ly=0;ly<textLetterHeight;ly++)
                for (let lx=0;lx<textLetterWidth;lx++) {
                    if (letterData[ly][lx]) pixelLayerPut(x+lx,y+ly,0,fgcolor);
                    else pixelLayerPut(x+lx,y+ly,0,bgcolor);
                    if (flash)
                        if (letterData[ly][lx]) pixelLayerPut(x+lx,y+ly,1,bgcolor);
                        else pixelLayerPut(x+lx,y+ly,1,fgcolor);
                    else
                        if (letterData[ly][lx]) pixelLayerPut(x+lx,y+ly,1,fgcolor);
                        else pixelLayerPut(x+lx,y+ly,1,bgcolor);
                }
    }

    function textSetCharAt(x,y,char,invert,bgcolor,fgcolor,bank,flash) {
        if (charIsOnScreen(x,y))
            switch (char) {
                case 12:{
                    textClear();
                    break;
                }
                default:{
                    if (char !== undefined) text[y][x].chr = char;
                    if (invert !== undefined) text[y][x].inv = invert;
                    if (fgcolor !== undefined) text[y][x].fg = fgcolor;
                    if (fgcolor !== undefined) text[y][x].bg = bgcolor;
                    if (bank !== undefined) text[y][x].bank = bank;
                    if (flash !== undefined) text[y][x].flash = flash;
                    textRenderCharAt(x,y);
                }
            }
    }

    function textGetCharAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].chr;
        else
            return 0;
    }

    function textCopyCharAt(x1,y1,x2,y2) {
        textSetCharAt(x2,y2,text[y1][x1].chr,text[y1][x1].inv,text[y1][x1].bg,text[y1][x1].fg,text[y1][x1].bank);
    }

    function textSetCharFgColorAt(x,y,color) {
        if (charIsOnScreen(x,y)) {
            text[y][x].fg=color;
            textRenderCharAt(x,y);
        }
    }

    function textGetCharFgColorAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].fg;
        else
            return 0;
    }

    function textSetCharBgColorAt(x,y,color) {
        if (charIsOnScreen(x,y)) {
            text[y][x].bg=color;
            textRenderCharAt(x,y);
        }
    }

    function textGetCharBgColorAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].bg;
        else
            return 0;
    }

    function textSetCharInverseAt(x,y,inv) {
        if (charIsOnScreen(x,y)) {
            text[y][x].inv=inv;
            textRenderCharAt(x,y);
        }
    }

    function textGetCharInverseAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].inv;
        else
            return false;
    }

    function textSetCharBankAt(x,y,bank) {
        if (charIsOnScreen(x,y)) {
            text[y][x].bank=bank;
            textRenderCharAt(x,y);
        }
    }

    function textGetCharBankAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].bank;
        else
            return 0;
    }

    function textSetCharFlashAt(x,y,flash) {
        if (charIsOnScreen(x,y)) {
            text[y][x].flash=flash;
            textRenderCharAt(x,y);
        }
    }

    function textGetCharFlashAt(x,y) {
        if (charIsOnScreen(x,y))
            return text[y][x].flash;
        else
            return false;
    }

    function textSetEmptyCharAt(x,y) {
        textSetCharAt(x,y,32,false,TRANSPARENT_ID,cursorFgColor,cursorBank,false);
    }

    function textPrintChar(char) {        
        textSetCharAt(cursorX,cursorY, char, cursorInvert, cursorBgColor, cursorFgColor,cursorBank,cursorFlash);
        cursorMoveRight();
    } 

    function textPrintComma() {
        cursorX++;
        let nextPosition=Math.ceil(cursorX/textCommaSize)*textCommaSize;
        cursorX=nextPosition%textWidth;
        cursorY+=Math.floor(nextPosition/textWidth);
        textCheckVerticalOverflow();
    }

    function textPrintTab(pos) {
        pos=Math.floor(pos);
        if (pos>cursorX) cursorX=pos;
        textCheckHorizontalOverflow();
    }

    function textClear() {
        for (let y=0;y<textHeight;y++)
            for (let x=0;x<textWidth;x++)
                textSetEmptyCharAt(x,y);
        cursorX=0;
        cursorY=0;
    }

    function textScrollYBy(amt) {
        let
            fromRefresh = textHeight - amt,
            shifted = text.splice(0,amt);
        for (let i=0;i<amt;i++)
            text.push(shifted[i]);
        pixelScrollYBy(textLetterHeight*amt);
        for (let y=fromRefresh;y<textHeight;y++)
            for (let x=0;x<textWidth;x++)
                textSetEmptyCharAt(x,y);
        cursorY=textHeight-1;
    }

    function textCheckVerticalOverflow() {
        if (cursorY>=textHeight) textScrollYBy(1);
    }

    function textCarriageReturn() {
        cursorMoveDown();
        cursorX=0;
    }

    function textCheckHorizontalOverflow() {
        if (cursorX>=textWidth) {
            let lines=Math.floor(cursorX/textWidth);
            cursorX=cursorX%textWidth;
            for (let i=0;i<lines;i++) cursorMoveDown();
        }
        if (cursorX<0)
            if (cursorY>0) {
                cursorX = textWidth-1;
                cursorY--;
            } else cursorX=0;
    }

    function textPrint(str) {
        if (typeof str != "string") str=str+"";
        for (let i=0;i<str.length;i++) {
            let
                char=str.charCodeAt(i),
                specialChar = S.charmap.asciiToSpecialChar(char);
            switch (specialChar) {
                case D.CHAR_CARRIAGE_RETURN:{
                    textCarriageReturn();
                    break
                }
                case D.CHAR_BELL:{
                    break
                }
                case D.CHAR_REVERSE_ON:{
                    cursorInvert=true;
                    break
                }
                case D.CHAR_REVERSE_OFF:{
                    cursorInvert=false;
                    break
                }
                case D.CHAR_CLEAR:{
                    textClear();
                    break;
                }
                case D.CHAR_INSERT:{
                    /*
                    // TODO How's this on a Commodore 64?

                    if (S.registry.quirkFake80Columns && (cursorY%2 == 0) && (cursorY<textHeight-1)) {
                        for (let i=textWidth-1;i>0;i--)
                            textCopyCharAt(i-1,cursorY+1,i,cursorY+1);
                        textCopyCharAt(textWidth-1,cursorY,0,cursorY+1);
                    }
                    */
                    if (cursorX<textWidth) {
                        for (let i=textWidth-1;i>cursorX;i--)
                            textCopyCharAt(i-1,cursorY,i,cursorY);
                        textSetCharAt(cursorX,cursorY,32,false,TRANSPARENT_ID);
                    }
                    break;
                }
                case D.CHAR_DOWN:{
                    cursorMoveDown();
                    break;
                }
                case D.CHAR_UP:{
                    cursorMoveUp();
                    break;
                }
                case D.CHAR_RIGHT:{
                    cursorMoveRight();
                    break;
                }
                case D.CHAR_LEFT:{
                    cursorMoveLeft();
                    break;
                }
                case D.CHAR_HOME:{
                    cursorMoveHome();
                    break;
                }
                case D.CHAR_BLACK:{
                    cursorFgColor = paletteNameToColorId.black || 0;
                    break;
                }
                case D.CHAR_WHITE:{
                    cursorFgColor = paletteNameToColorId.white || 0;
                    break;
                }
                case D.CHAR_RED:{
                    cursorFgColor = paletteNameToColorId.red || 0;
                    break;
                }
                case D.CHAR_CYAN:{
                    cursorFgColor = paletteNameToColorId.cyan || 0;
                    break;
                }
                case D.CHAR_VIOLET:{
                    cursorFgColor = paletteNameToColorId.violet || 0;
                    break;
                }
                case D.CHAR_GREEN:{
                    cursorFgColor = paletteNameToColorId.green || 0;
                    break;
                }
                case D.CHAR_BLUE:{
                    cursorFgColor = paletteNameToColorId.blue || 0;
                    break;
                }
                case D.CHAR_YELLOW:{
                    cursorFgColor = paletteNameToColorId.yellow || 0;
                    break;
                }
                case D.CHAR_ORANGE:{
                    cursorFgColor = paletteNameToColorId.orange || 0;
                    break;
                }
                case D.CHAR_BROWN:{
                    cursorFgColor = paletteNameToColorId.brown || 0;
                    break;
                }
                case D.CHAR_LIGHTRED:{
                    cursorFgColor = paletteNameToColorId.lightred || 0;
                    break;
                }
                case D.CHAR_DARKGREY:{
                    cursorFgColor = paletteNameToColorId.darkgrey || 0;
                    break;
                }
                case D.CHAR_GREY:{
                    cursorFgColor = paletteNameToColorId.grey || 0;
                    break;
                }
                case D.CHAR_LIGHTGREEN:{
                    cursorFgColor = paletteNameToColorId.lightgreen || 0;
                    break;
                }
                case D.CHAR_LIGHTBLUE:{
                    cursorFgColor = paletteNameToColorId.lightblue || 0;
                    break;
                }
                case D.CHAR_LIGHTGREY:{
                    cursorFgColor = paletteNameToColorId.lightgrey || 0;
                    break;
                }
                case D.CHAR_BACKSPACE:{
                    if (cursorX) {
                        cursorMoveLeft();
                        for (let i=cursorX;i<textWidth-1;i++)
                            textCopyCharAt(i+1,cursorY,i,cursorY);
                    }
                    /*
                    // TODO How's this on a Commodore 64?

                    if (S.registry.quirkFake80Columns && (cursorY%2 == 0) && !textCharIsEmpty(textWidth-1,cursorY)) {
                        textCopyCharAt(0,cursorY+1,textWidth-1,cursorY);
                        for (let i=0;i<textWidth-1;i++)
                            textCopyCharAt(i+1,cursorY+1,i,cursorY+1);
                        textSetCharAt(textWidth-1,cursorY+1,32,false,TRANSPARENT_ID,TRANSPARENT_ID,0);
                    } else*/ textSetCharAt(textWidth-1,cursorY,32,false,TRANSPARENT_ID);
                    break;
                }
                default:{
                    switch (char) {
                        default:{
                            textPrintChar(char);
                        }
                    }
                }   
            }
        }
    }

    // Input

    function keyboardRegisterKeyEvent(e) {
        do {
            keyboardKeyEventsCbId=(keyboardKeyEventsCbId+1)%100||1;
        } while (keyboardKeyEventsCb[keyboardKeyEventsCbId]);
        keyboardKeyEventsCb[keyboardKeyEventsCbId] = e;
        return keyboardKeyEventsCbId;
    }

    function keyboardUnregisterKeyEvents(id) {
        delete keyboardKeyEventsCb[id];
    }

    function keyboardClearKeyEvents() {
        keyboardKeyEventsCb = {};
    }

    // Low-level

    this.reset=function() { displayReset(); }

    this.finalize=function() { displayFinalize(); }

    this.tick=function() { displayTick(); }

    this.setScale=function(x,y) { displaySetScale(x,y); }

    this.getWidth=()=>displayWidth;

    this.getHeight=()=>displayHeight;

    this.getNode=function() { return displayContainer; }

    this.focus=function() { displayContainer.focus(); }

    // Extra renderer

    this.addDisplayLayer=function(priority,renderer) { displayAddLayer(priority, renderer); }

    this.setDisplayRendererDirty=function() { displayRendererDirty = true; }

    // Messages

    this.messageShow=function(t,s) { messageShow(t,s); }

    // Font

    this.fontGetLetterWidth=()=>textLetterWidth;

    this.fontGetLetterHeight=()=>textLetterHeight;

    this.fontGetRowByte=function(ch,row) {
        let bits=fontGetRow(ch, row);
        return bits ? parseInt(bits.join(""),2) : 0;
    }

    this.fontSetRowByte=function(ch,row,v) {
        let bits=fontGetRow(ch, row);
        if (bits) {
            let toset=normalizeByte(v).toString(2).padStart(bits.length,"0");
            for (let i=0;i<bits.length;i++)
                bits[i]=toset[i]=="0"?0:1;
        }
    }

    this.fontGetBit=function(ch,col,row) {
        let bits=fontGetRow(ch, row);
        return bits ? bits[col] : 0;
    }

    this.fontSetBit=function(ch,col,row,bit) {
        let bits=fontGetRow(ch, row);
        if (bits) font.data[ch][row][col]=normalizeBit(bit);
    }

    this.fontSystemSet=function(f) { fontSystem=fontUnpack(f); }

    this.fontAdd=function(f) { fontList.push(fontUnpack(f)); }

    this.fontReset=function() {
        fontId=0;
        fontList = [];
    }

    this.fontSetId=function(id) { return fontSet(normalizeFontId(id)); }

    this.fontNextId=function(id) {
        fontId = (fontId+1)%fontList.length;
        fontSet(fontId);
    }

    this.fontGetId=()=>fontId;

    // Palette

    this.paletteSet=function(p) { palette = Tools.clone(p); }

    this.paletteGetColor=function(i) { return paletteGetColor(normalizePaletteColor(i)); }

    this.paletteGetHtmlColor=function(i) { return paletteGetHtmlColor(normalizePaletteColor(i)); }

    // Cursor

    this.cursorGetStatus=function() {
        return {
            bgcolor:this.cursorGetBgColor(),
            fgcolor:this.cursorGetFgColor(),
            flash:this.cursorGetFlash(),
            invert:this.cursorGetInvert(),
            over:this.cursorGetOver()
        }
    }

    this.cursorSetStatus=function(s) {
        this.cursorSetBgColor(s.bgcolor);
        this.cursorSetFgColor(s.fgcolor);
        this.cursorSetFlash(s.flash);
        this.cursorSetInvert(s.invert);
        this.cursorSetOver(s.over)
    }

    this.cursorSetVisible=function(v) { return cursorSetVisible(normalizeBoolean(v)); }

    this.cursorSetFgColor=function(c) { cursorFgColor = normalizePaletteColor(c); }

    this.cursorGetFgColor=()=>cursorFgColor;

    this.cursorSetBgColor=function(c) { cursorBgColor = normalizePaletteColor(c); }

    this.cursorGetBgColor=()=>cursorBgColor;

    this.cursorSetInvert=function(r) { return cursorSetInvert(normalizeBoolean(r)); }

    this.cursorGetInvert=()=>cursorInvert;

    this.cursorGetX=()=>cursorX;

    this.cursorSetX=function(x) { cursorX = normalizeCoord(x) % textWidth; }

    this.cursorGetY=()=>cursorY;

    this.cursorSetY=function(y) { cursorY = normalizeCoord(y) % textHeight; }
    
    this.cursorMoveLeft=function() { return cursorMoveLeft(); }

    this.cursorMoveRight=function() { return cursorMoveRight(); }

    this.cursorShow=function() { return cursorShow(); }

    this.cursorSetBank=function(i) { cursorBank = normalizeColorBank(i); }

    this.cursorSetFlash=function(i) { cursorFlash = normalizeBoolean(i); }

    this.cursorGetFlash=()=>cursorFlash;

    this.cursorSetOver=function(i) { cursorOver = normalizeBoolean(i); }

    this.cursorGetOver=()=>cursorOver;

    // Screen

    this.screenGetWidth=()=>pixelWidth;

    this.screenGetHeight=()=>pixelHeight;

    this.screenGetPixels=(layer)=>pixel[layer];

    this.screenSetFrameSize=function(top,right,bottom,left) { return screenSetFrameSize(top,right,bottom,left); }

    this.screenSetBgColor=function(c) { return screenSetBgColor(normalizePaletteColor(c)) }

    this.screenGetBgColor=()=>screenBgColor;

    this.screenSetBorderColor=function(c) { return screenSetBorderColor(normalizePaletteColor(c)) }

    this.screenGetBorderColor=()=>screenBorderColor;

    this.screenSetBgColorAsCursorBgColor=function() {
        if (cursorBgColor!==TRANSPARENT_ID) screenSetBgColor(cursorBgColor + (cursorBank * paletteColorsCount));
    }

    // Pixels

    this.pixelPlot=function(x,y) { return pixelPlot(x,y); }

    this.pixelDraw=function(x2,y2,ang) { return pixelDraw(x2,y2,ang); }

    this.pixelCircle=function(cx,cy,rad) { return pixelCircle(cx,cy,rad); }

    // Keyboard

    this.keyboardGetPressed=()=>keyboardPressed;

    this.keyboardGetLastPressed=()=>keyboardLastPressed;

    this.keyboardIsKeyPressed=(id)=>!!keyboard[id];

    this.keyboardRegisterKeyEvent=function(e){ return keyboardRegisterKeyEvent(e); }

    this.keyboardUnregisterKeyEvents=function(id) { return keyboardUnregisterKeyEvents(id); }

    this.keyboardClearKeyEvents=function() { return keyboardClearKeyEvents(); }
    
    // Text

    this.textInput=function(settings,cb) { return textInput(settings,cb) }

    this.textSetWidth=function(w) { textWidth=w; }

    this.textSetHeight=function(h) { textHeight=h; }

    this.textSetCommaSize=function(s) { textCommaSize=s; }

	this.textSetCharAt=function(x,y,c,invert) {
        return textSetCharAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizeByte(c),
            normalizeBoolean(invert)
        );
    }

    this.textGetCharAt=(x,y)=>{
        return textGetCharAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textSetCharFgColorAt=function(x,y,c) {
        return textSetCharFgColorAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizePaletteColor(c)
        );
    }

    this.textGetCharFgColorAt=(x,y)=>{
        return textGetCharFgColorAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textSetCharBgColorAt=function(x,y,c) {
        return textSetCharBgColorAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizePaletteColor(c)
        );
    }

    this.textGetCharBgColorAt=(x,y)=>{
        return textGetCharBgColorAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textSetCharInverseAt=function(x,y,v) {
        return textSetCharInverseAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizeBoolean(v)
        );
    }

    this.textGetCharInverseAt=function(x,y) {
        return textGetCharInverseAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textSetCharFlashAt=function(x,y,v) {
        return textSetCharFlashAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizeBoolean(v)
        );
    }

    this.textGetCharFlashAt=function(x,y) {
        return textGetCharFlashAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textSetCharBankAt=function(x,y,b) {
        return textSetCharBankAt(
            normalizeCoord(x),
            normalizeCoord(y),
            normalizeColorBank(b)
        );
    }

    this.textGetCharBankAt=function(x,y) {
        return textGetCharBankAt(
            normalizeCoord(x),
            normalizeCoord(y)
        );
    }

    this.textGetWidth=()=>textWidth;

    this.textGetHeight=()=>textHeight;

    this.textCarriageReturn=function() { return textCarriageReturn(); }

    this.textClear=function() { return textClear(); }
   
    this.textPrintComma=function() { return textPrintComma(); }

    this.textPrintTab=function(v) { return textPrintTab(v); }

    this.textPrint=function(str) { return textPrint(str); }

    // Initialization
    displayContainer.appendChild(displayBackground);
    displayBackground.appendChild(displayCanvas);
    displayContainer.tabIndex = 1;
    displayContainer.onkeydown=(e)=>{
        for (let k in keyboardKeyEventsCb) keyboardKeyEventsCb[k](S,e);
        keyboardPressed=e.keyCode;
        keyboardLastPressed=e.keyCode;
        keyboard[e.keyCode]=1;
        // Enable browser CTRL-F, CTRL-R etc.
        if (!e.ctrlKey) e.preventDefault();
    }
    displayContainer.onkeyup=(e)=>{
        for (let k in keyboardKeyEventsCb) keyboardKeyEventsCb[k](S,e);
        keyboardPressed=0;
        keyboard[e.keyCode]=0;
    }
    this.fontReset();
    this.textSetCommaSize(7);

    // Initialize system rendered layers

    // 1000-1999: Custom background renderer

    // Draw the foreground content
    displayAddLayer(2000,function() {
        if (pixelCanvasDatas.length) {
            pixelCanvasCtx.putImageData(pixelCanvasDatas[pixelCanvasVisible],0,0);
            displayCanvasCtx.drawImage(pixelCanvas,screenFrameLeft,screenFrameTop);
        }
    });

    // Draw the cursor the cursor
    displayAddLayer(2100,function() {
        if (cursorIsVisible && cursorIsOn) displayDrawCursor();
    });

    // 3000-3999: Custom foreground renderer

    // Draw the border
    displayAddLayer(4000,function() {
        displayCanvasCtx.fillStyle = paletteGetHtmlColor(screenBorderColor);
        displayCanvasCtx.fillRect(0,0,screenFrameLeft,displayHeight);
        displayCanvasCtx.fillRect(displayWidth-screenFrameRight,0,screenFrameRight,displayHeight);
        displayCanvasCtx.fillRect(screenFrameLeft,0,displayWidth-screenFrameLeft-screenFrameRight,screenFrameTop);
        displayCanvasCtx.fillRect(screenFrameLeft,displayHeight-screenFrameBottom,displayWidth-screenFrameLeft-screenFrameRight,screenFrameBottom);
    });

    // Draw the system message box
    displayAddLayer(10000,function() {
        if (messageData) displayCanvasCtx.putImageData(messageData,messageX,messageY);
    });


}
