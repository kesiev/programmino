
function Memory(S) {
    let
        exactLocations={},
        ram={},
		areas=[],
        watchers=[],
        sys={},
        watchersAreaId=0;

    function getLocation(address) {
        let location = exactLocations[address];
        if (!location)
            for (let i=0;i<areas.length;i++)
                if ((address>=areas[i].start)&&(address<=areas[i].end)) {
                    location=areas[i];
                    break;
                }
        return location;
    }

    this.reset=function(){
        sys={};
        exactLocations={};
        areas=[];
        watchers={};
        watchersAreaId=0;
    }

    // Manages memory watchers

    this.addLocationWatcher = function(address,cb) {
        return this.addAreaWatcher(address,address,cb);
    }

    this.addAreaWatcher = function(start, end, cb) {
        do {
            watchersAreaId=((watchersAreaId+1)%1000)||1;
        } while (watchers[watchersAreaId]);
        watchers[watchersAreaId]={
            start:start,
            end:end,
            callback:cb
        }
        return watchersAreaId;
    }

    this.removeWatcher=function(id) {
        if (id) delete watchers[id];
    }

    // Create memory areas

    this.addLocation=function(address,getter,setter) {
        if (setter == undefined) setter = getter;
        exactLocations[address]={
            setter:setter,
            getter:getter
        };
    }

	this.addArea=function(start,end,getter,setter) {
        if (setter == undefined) setter = getter;
        areas.push({
			start:start,
			end:end,
            setter:setter,
            getter:getter||0
        });
    }

    // Create sys calls

    this.addSys=function(address,cb) {
        sys[address]=cb;
    }


    // To be used by low-level functions

    this.syncPeek = function(address) {
        address=Math.floor(address);
        let location=getLocation(address);
        if (location == undefined) return null;
        else return this.get(location, address)
    }

    this.syncPoke=function(address,value) {
        value=Math.floor(value);
        address=Math.floor(address);
        let location=getLocation(address);
        if (location == undefined) return null;
        else this.set(location,address,value);
    }

    // To be used by statements

    this.sys = function(v,statement, address, tickWaited) {
        address=Math.floor(address);
        let location=sys[address];
        if (location == undefined) return statement.returnBreaker(v,"SYS "+address+" unsupported");
        else if (location.waitTick && !tickWaited)
            return statement.returnWaitTick(()=>this.sys(v,statement, address,true));
        else {
            location.sys(S,location,address);
            let value = Tokens.newNumber(0);
            if (tickWaited) return statement.returnContinue(value);
            else return statement.returnValue(value);
        }
    }

    this.peek = function(v,statement, address, tickWaited) {
        address=Math.floor(address);
        let location=getLocation(address);
        if (location == undefined) return statement.returnBreaker(v,"Peek to unsupported memory area '"+address+"'");
        else if (location.getter && location.getter.waitTick && !tickWaited)
            return statement.returnWaitTick(()=>this.peek(v,statement, address,true));
        else {
            let value = Tokens.newNumber(this.get(location, address));
            if (tickWaited) return statement.returnContinue(value);
            else return statement.returnValue(value);
        }
    }

    this.poke = function(v,statement,address,value) {
        value=Math.floor(value);
        if (!S.registry.quirkMemoryUseInt)
            value = Math.abs(value%256);
        address=Math.floor(address);
        let location=getLocation(address);
        if (location == undefined) return statement.returnBreaker(v,"Poke to unsupported memory area '"+address+"'");
        else {
            this.set(location,address,value);
            return statement.returnValue(Tokens.newNumber(0));
        }
    }

    // Location managers

    this.set=function(location, address,value) {
        for (let k in watchers)
            if (address>=watchers[k].start && address<=watchers[k].end) watchers[k].callback(S,watchers[k],address,value);
        if (location.setter) {
            if (location.start) address-=location.start;
            if (location.setter.setterProcess) location.setter.setterProcess(S,location.setter,address,value);
            else if (location.setter.device) S[location.setter.device][location.setter.setter](value);
        } else ram[address]=value;
    }

    this.get=function(location, address) {
        let value;
        if (location.getter) {
            if (location.start) address-=location.start;
            if (location.getter.getterProcess) value=location.getter.getterProcess(S,location.getter,address);
            else if (location.getter.device) value=S[location.getter.device][location.getter.getter]();
            else value = location.getter;
        } else value=ram[address]||0;
        return value;
    }

    // Initialize
    this.reset();
}
