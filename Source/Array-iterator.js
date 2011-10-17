(function(){


// Iterator common private utilites
var Util = {
    uid : Date.now(),
    // Function will return real uniq uid for session
    getUniqueId : function() {return (this.uid++).toString(36);},
    Data: {},
    // Get from private storage
    getData: function(key) {
        return this.Data[key];
    },
    // Set to private storage
    setData: function(key, value) {
        this.Data[key] = value;
    }
};



// Interator class
var Iterator = new Class({
    Implements: [Options],
    options: {
        pit    : true, // Stop iteration on last and first index (null)
        limits : false // limit pointer with positions which exists
        // TODO: implement
        // round: false // forbid to go round

    },
    // constructor
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
    
    // Move cursor to the last position
    end: function(){
        var key = null, length = this.ref().length;
        if (length) {
            key = length - 1;
        }
        key = this.jump(key);
        return this.watch(key)[0];
    },
    
    // Move cursor next
    next: function() {
        return this.slide(1);
    },
	
    // move cursor back
    prev: function(){
       return this.slide(-1);
    },

    // Return selected array value
    current: function(){
            var key = this.key();
            return this.watch(key)[0];
    },

    // Move cursor by offset
    // can be any positive value or negative
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

    // return specified values
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

// Implement iterator to class
// You can get iterator with special function named "iterator" now!
Array.implement({
    iterator: function(options){
        return new Iterator(this, options);
    }
});


})();
