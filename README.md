Array iterator
===========

This plugin provides functionality for array iteration with php like methods (next, prev, current, key, end, reset, rewind).
And some more functionality.

![Screenshot](http://farm5.static.flickr.com/4149/5094127748_c6a3bc7d98_m.jpg)

* You can create new Lighthouse tickets here: <http://cainrus.lighthouseapp.com/projects/62133/mootools-array-iterator>
* Plugin homepage: <http://mootools.net/forge/p/array_iterator>

Methods of iterator
-----------------

* reset  - select first index and return it
* end    - select last index and return it
* next   - select next index and return it
* prev   - select previous index and return it
* rewind - Select null index.
* jump   - Select index and return value. Can be positive or negative(will select index from end).
* slide  - Jump over passed offset and return value. Can be positive or negative. You can pass second argument "from", to move from described index.
* key    - return active key (number or null if not exist or not allowed)
* ref    - return original array.
* range  - return allowed range of array. Options _min_, _max_, _pass_ are accounted.
* valid  - return active key or null if index is not valid or not allowed. You can validate with this method any index if it is valid.

How to use
----------

* Add some lines in the head of your HTML document.

        #html
        <script type="text/javascript" src="mootools.js"></script> 
        <script type="text/javascript" src="Array.Iterator.js"></script>

* Create array and iterator( you can create a few instances of it:

        #js
        var collection = [1,2,3,4,5];                 // array
        var iterator = collection.iterator(options);  // iterator
        var iterator2 = collection.iterator(options); // another iterator

* Now you can easily iterate that array:

        #js
        console.log(iterator.next());    // 1
        console.log(iterator.end());     // 5
        console.log(iterator.prev());    // 4
        console.log(iterator.reset());   // 1
        console.log(iterator.slide(3));  // 4
        console.log(iterator.slide(-2)); // 2
        console.log(iterator.rewind());  // null

* You can get array from iterator:

        #js
        console.log(iterator.ref());             // [1,2,3,4,5]
        console.log(iterator.ref()===collection) // true

* You can get pointer from the iterator:

        #js
        console.log('value = ' + iterator.jump(2)); // value = 3
        console.log('key = ' + iterator.key());     // key = 2

* Try to get penultimate value:

        #js
        iterator.jump(-2); console.log(iterator.current()); // 4
        iterator.end(); console.log(iterator.prev());       // 4, same thing

* Try to play with _pit_ option:

        #js
        var collection = [1,2,3]
        var iterator = collection.iterator({pit : true});
        console.log(iterator.next());                 // 1
        console.log(iterator.next());                 // 2
        console.log(iterator.next());                 // 3
        // Null index at start(or end), use it to catch end of range.
        console.log(iterator.next());                 // null
        console.log(iterator.next());                 // 1
        console.log(iterator.next());                 // 2
        iterator.options.pit = false;
        // No more null index when iterating!
        console.log(iterator.prev());                 // 1
        console.log(iterator.prev());                 // 3

* Try to play with _limits_ option:

        #js
        iterator.options.limits = true;
        console.log(iterator.jump(0));                // 1
        console.log(iterator.next());                 // 2
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3

* Try to designate boundaries of iterator with _min_ & _max_ options:

        #js
        iterator.options.min = 1;
        iterator.options.max = 2;
        console.log(iterator.reset());                // 2
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3
        iterator.options.limits = false;
        console.log(iterator.next());                 // 2

* Try to designate boundaries of iterator with _min_ & _max_ options:

        #js
        var collection = [1,2,3,4,5]
        var iterator = collection.iterator({pass:2});
        console.log(iterator.reset());                // 1
        console.log(iterator.next());                 // 2
        // You skipped one!
        console.log(iterator.next());                 // 4
        // Try to skip more.
        iterator.options.pass = [1,3];
        console.log(iterator.reset());                // 1
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 5

* Try ability to chain method calls(jump, end, reset, rewind, next, prev, slide):

        #js
        var collection = [1,2,3,4,5]
        var iterator = collection.iterator({chains:true});
        iterator.reset().next().next().current();         // 3
        iterator.rewind().slide(-2).current();            // 4

Options of iterator
-----------------
* pit    - Add null position in iteration cycle. By default null position available when key in not valid or on start.
* limits - Restrict the movement from first to last allowed index or backwards.
* min    - Minimum allowed index, you can't select index less than it.
* max    - Maximum allowed index, you can't select index more than it.
* pass   - index or array of indexes to skip.
* chains - Allow ability to chain method calls of movement

Example
-----------------

    #js
    /* create inventory for game */ 
    var inventory = [$('Axe'), $('Potion'), $('MagicBook')];

    // Iteration of inventory.
    var activeSlot = inventory.iterator({
      pit : true
    }); 

    // Try to log all items in inventory
    activeSlot.reset();
    while (activeSlot.valid()) {
        console.log(activeSlot.current());
        activeSlot.next();
    }

    // reset to the null index when yo need it
    Game.addEvent('inventoryCreate', function(){
        activeSlot.rewind();
    });
    
    // Try to select last added item of invenroty
    Game.addEvent('inventoryOpen', function(){
      activeSlot.reset();
    });