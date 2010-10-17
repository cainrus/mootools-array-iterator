(function(){


// Iterator Common utilites
var Util = {
    uid : Date.now(),
    getUniqueId : function() {return (this.uid++).toString(36);},
    Data: {},
    getData: function(key) {
        return this.Data[key];
    },
    setData: function(key, value) {
        this.Data[key] = value;
        
    }
};




var Iterator = new Class({
    Implements: [Options],
    options: {
        pit    : true,
        limits: false // limit pointer with positions which exists
        //round: false // forbid to go by cyrcles

    },
    initialize: function(ref, options){
        this.setOptions(options);
        // private function, it returns unique ID
        var getUid = function(uid){return uid}.pass([Util.getUniqueId()]);
        // link to same instance of array
        // only get, no way to change\replace it
        this.ref = function(){return this;}.bind(ref);

        // Position Setter
        this.jump = function(key){
            if ( typeof(key) === "undefined" ) return this;
            // Add positive number or null, if key presents, and return self instance.
            key = parseInt(key,10);
            // If key is invalid or out of range, then it should be null.
            if (isNaN(key) || key < 0 || key > this.ref().length - 1) key = null;
	    Util.setData(getUid(), key);
	    return key;
        };
        
        // Position Getter
        this.key = function(uid){
            var key = Util.getData(uid);
            return (typeof(key) === "undefined") ? null : key;
        }.pass(getUid());


    },

    // Move cursor to the first position
    reset: function(){
        var key = this.jump(0);
        return this.watch(key)[0];
    },

    // Move cursor out
    rewind: function(){
        var key =  this.jump(null);
        return this.watch(key)[0];
    },
    end: function(){
        var key = null, length = this.ref().length;
        if (length) {
            key = length - 1;
        }
        key = this.jump(key);
        return this.watch(key)[0];
    },
    next: function() {
        return this.slide(1);
    },

    prev: function(){
       return this.slide(-1);
    },

    // Return selected array value
    current: function(){
            var key = this.key();
            return this.watch(key)[0];
    },



    slide: function(offset){
        var key = this.key(), length = this.ref().length;
        // if filled array and valid offset
        var pattern = /^(-|\+)?\d+$/;
        if (length && pattern.test(offset)) {
            var unit = (offset < 0) ? -1 : 1;
            var maxKey = length - 1;
            var limit = this.options.limit, pit =  this.options.pit;

            while (offset) {
                if (unit > 0) {
                    if (key === null) key = 0;
                    else if (key!==  maxKey) key++;
                    else if ( key >= maxKey) {
                        if (limit && pit) key = maxKey;
                        if (!limit && !pit) key = 0;
                        if (!limit && pit) key = null;
                    }
                }
                else if (unit < 0) {
                    if (key >= 1) key--;
                    else if ( key < 1 ) {
                        if (!limit) {
                            if (key === null) {key = maxKey; }
                            else if (pit) { key = null; }
                            else if (!pit) { key = maxKey; }
                        } else if (limit) {
                            if (pit) { key = null; }
                            else if (!pit) { key = 0; }
                        }
                    }
                }

                if (limit && pit && key === maxKey) key = maxKey;
                
                offset = offset - unit;
            }
        } else {
            key = null;
        }

        key = this.jump(key);
        return this.watch(key)[0];
    },


    watch: function(indexes){
        indexes = (typeof indexes === 'array') ? indexes : [indexes];
        var i, value, values = [];
        while (indexes.length) {
            i = indexes.shift();
            value = (i === null) ? null : this.ref()[i];
            values.push(value);
        }
        return values;

    }

});

Array.implement({
    iterator: function(options){
        return new Iterator(this, options);
    }
});


})();
