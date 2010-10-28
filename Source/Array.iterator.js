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
 - Iterator.range
 - Iterator.key
 - Iterator.rewind
 - Iterator.reset
 - Iterator.prev
 - Iterator.next
 - Iterator.end
 - Iterator.slide
 - Iterator.valid

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
        return this.Data[key] = value;
        
    }
};



// Iterator Class
var Iterator = new Class({
    // Settings
    Implements  : [Options],
    options     : {
        // Allows the participation of null in iteration of stack, otherwise only at start and manual.
        pit         : true,
        // Allows to limit movement when reaches the edges
        limits      : false,
        // Allows to ignore indexes not in range
        min: null,
        max: null,
        // TODO:
        // 1. option pass: array, keys to pass.
        pass:[]
    },
    // Constructor
    initialize: function(ref, options){
        this.setOptions(options);
        // Unique ID.
        var getUid = function(uid){return uid}.pass([Util.getUniqueId()]);
        // Link to same instance of array.
        this.ref = function(){return this;}.bind(ref);
        // Position Setter
        this.jump = function(key){
            // check key
            key = this.valid(key);
            return Util.setData(getUid(), key);
        };
        // Position Getter
        this.key = function(){
            var uid = getUid(), key = this.valid(Util.getData(uid));
            return Util.setData(uid, key);
        };

        this.range(); // Set valid min and max
    },
    // key validator
    valid: function(){
        // base checks
        var length = this.ref().length;
        var key = (arguments.length>0) ? Number.from(arguments[0]) : this.key();
        // empty array or key checks
        if (key === null || length === 0) return null;
        // Negative to positive
        if (key < 0) key = this.ref().length+key;
        // limits checks
        if (key<0 || key > length-1) return null;
        // pass range checks
        if (this.options.pass.indexOf(key)>-1) return null;
        // complex range checks
        var range = function(side){ return (Number.from(side) === null) ? null : side.limit(0, length);}
        var min = range(this.options.min), max = range(this.options.max);
        if ((min && key < min)||(max && key > max)) return null;
        return key;
    },
    // move cursor to minimal allowed position
    reset: function(){
        var range = this.range(), key = (range.length) ? range[0] : null;
        return this.jump(key), this.current(key);
    },
    // Move cursor out, to null
    rewind: function(){
        return this.jump(null);
    },
    // Move cursor to maximum allowed position
    end: function(){
        var range = this.range(), key = (range.length) ? range.pop() : null;
        return this.jump(key), this.current(key);
    },
    // Move cursor next
    next: function() {
        return this.slide(1);
    },
    // Move cursor back
    prev: function(){
       return this.slide(-1);
    },
    // Return selected array value
    current: function(){
        var key = this.valid(arguments[0]) || this.key();
        return (key === null) ? null : this.ref()[key];
    },
    // Move with offset back or forward [,from index]
    slide: function(offset, index){
        var range = this.range(), key = [index,this.key()].pick();
        var limit = this.options.limits, pit = this.options.pit, pass = this.options.pass;
        // Exit with null result if range or offset is invalid .
        if (!range.length||offset===null) return this.jump(null);
        if (offset===0) return this.current();
        // Pit option setup.
        if (pit) range.unshift(null);// Add null to map of indexes if pit is enabled
        // Move cursor from not existing index (null)
        var index = range.indexOf(String.from(key));
        if (pit) key = (key === null) ? 0 : index;
        else if (offset>0) key = (key === null) ? (offset--,0) :index;
          else key = (key === null) ? 0 : index;
       // Post process by limit option.
       if (!limit && offset.abs() >= range.length) {offset = offset%range.length;}
       key = key + offset;
       var max = range.length-1;
       if (limit) {
           if (key > max) key = max;
           if (key < 0) key = 0;
       } else {
           if (key > max) key = key-max-1;
           if (key < 0) key =  key+max+1;
       }
       key = range[key]; this.jump(key);
       return this.current();
    },
    // Return range
    range: function(){
        var array = this.ref(), length = array.length-1, keys = Object.keys(array);
        with(this.options){
            if (length<0) {min=max=null;return [];} // empty array ~ empty range
            min = Number.from(this.options.min), max = Number.from(this.options.max);
            if (min===null) min = 0; else min = min.limit(0, length);
            if (max===null) max = length; else max = max.limit(0, length);
            range = (min>max) ? keys.slice(min).combine(keys.slice(0,max+1)) : keys.slice(min, max+1);
            return range.filter(function(index){return !!pass.indexOf(index);});
        }
    }
});

Array.implement({
    iterator: function(options){
        return new Iterator(this, options);
    }
});


})();
