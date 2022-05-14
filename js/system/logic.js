function Logic(S) {
    const
        BOOL_NUMBERS = Logic.BOOL_NUMBERS,
        BOOL_ZX = Logic.BOOL_ZX;
    
    let
        booleanMode = 0;

    this.setBooleanMode=function(v) {
        booleanMode = v || 0;
    }

    this.not=function(v) {
        switch (booleanMode) {
            case BOOL_ZX:{
                return Tokens.newNumber(v == 1 ? 0 : 1);
            }
            case BOOL_NUMBERS:{
                return Tokens.newNumber((v*-1)-1);
            }
            default:{
                return Tokens.newBoolean(!v);
            }
        }
    }

    this.and=function(v1,v2) {
        switch (booleanMode) {
            case BOOL_ZX:{
                return v1.value && v2.value ? v1 : v1.type==K.TKN_STRING ? Tokens.newString("") : Tokens.newNumber(0);
            }
            case BOOL_NUMBERS:{
                return Tokens.newNumber(v1.value & v2.value)
            }
            default:{
                return Tokens.newBoolean(v1.value && v2.value);
            }
        }
    }

    this.or=function(v1,v2) {
        switch (booleanMode) {
            case BOOL_ZX:{
                return Tokens.newNumber(v1.value || v2.value ? 1 :0);
            }
            case BOOL_NUMBERS:{
                return Tokens.newNumber(v1.value | v2.value)
            }
            default:{
                return Tokens.newBoolean(v1.value || v2.value);
            }
        }
    }

    this.encodeBoolean=function(v) {
        let isBoolean = typeof v == 'boolean';
        switch (booleanMode) {
            case BOOL_ZX:{
                return Tokens.newNumber(isBoolean ? v ? 1 : 0 : v);
            }
            case BOOL_NUMBERS:{
                return Tokens.newNumber(isBoolean ? v ? -1 :0 : v);
            }
            default:{
                if (isBoolean) return Tokens.newBoolean(v);
                else return Tokens.newNumber(v);
            }
        }
    }

    this.decodeBoolean=function(v) {
        switch (booleanMode) {
            case BOOL_ZX:{
                return v.value ? 1 : 0
            }
            case BOOL_NUMBERS:{
                return v.value != 0;
            }
            default:{
                return v.value;
            }
        }
    }

    // Initialize
    this.setBooleanMode();

}

Logic.BOOL_NUMBERS = 1;
Logic.BOOL_ZX = 2;