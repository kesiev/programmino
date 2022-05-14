
function Clock(S) {

    const
        FPS = 50,
        MSPF = 1000/FPS;

    let
        eventListener = 0,
        running = false,
        timeout = 0,
        frameTimestamp = 0;

    window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || 0;

    function getTimestamp() { return (new Date()).getTime(); };

    function scheduleNextLogicLoop(ts) {
		if (timeout) clearTimeout(timeout);
		var wait = MSPF - getTimestamp() + frameTimestamp;
		if (wait<=0) wait=1;
		timeout = setTimeout(doLogicLoop, wait);
	};
    
    function doLogicLoop() {

        var ts=getTimestamp();
        frameTimestamp=ts;

        S.cpu.tick();
        S.display.tick();

        scheduleNextLogicLoop(ts);
    }

    function stop() {
        running = false;
        if (timeout) {
            clearTimeout(timeout);
            timeout=0;
        }
    }

    this.getMspf=function() {
        return MSPF;
    }

    this.setEventListener=function(eventListener) {
        listener = eventListener;
    }

    this.start=function() {
        if (!running) {
            if (listener && listener.start) listener.start(S);
            running = true;
            doLogicLoop();
        }
    }

    this.abort=function() {
        S.cpu.abort();
        stop();
    }

    // Initialize
    stop();

}
