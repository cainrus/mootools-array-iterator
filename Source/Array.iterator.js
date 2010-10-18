/*
---
script: Array-iterator.js

description: Advanced array iteration.

license: MIT-style license.

authors:
 - Sergei Tarassov

requires:
  core/1.3: '*'

provides: 
 - Array.iterator
 - Iterator
 - Iterator.ref
 - Iterator.key
 - Iterator.rewind
 - Iterator.reset
 - Iterator.prev
 - Iterator.next
 - Iterator.end

...
*/

(function(){

// Iterator private utilites
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



// Iterator Class
var Iterator = new Class({
    Implements  : [Options],
    options     : {
        pit         : true, // allow null-exit
        limits      : false //
        // TODO:
        // 1. option pass: array, keys to pass.
        // 2. option min: int, minimal key alowed
        // 3. option max: int, maximum key alowed

    },
    initialize: function(ref, options){
        this.setOptions(options);
        // Unique ID.
        var getUid = function(uid){return uid}.pass([Util.getUniqueId()]);
        // Link to same instance of array.
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
        return this.current(key);
    },

    // Move cursor out
    rewind: function(){
        var key =  this.jump(null);
        return this.current(key);
    },
    end: function(){
        var key = null, length = this.ref().length;
        if (length) {
            key = length - 1;
        }
        key = this.jump(key);
        return this.current(key);
    },
    next: function() {
        return this.slide(1);
    },

    prev: function(){
       return this.slide(-1);
    },

    // Return selected array value
    current: function(){
        var key = (arguments.length) ? arguments[0] : this.key();
        return (key === null) ? null : this.ref()[key];
    },


    // Slide to
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
        return this.current(key);
    }

});

Array.implement({
    iterator: function(options){
        return new Iterator(this, options);
    }
});


})();

