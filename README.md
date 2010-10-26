Array iterator
===========

This plugin provides functionality for array iteration with php like methods (next, prev, current, key, end, reset, rewind).
And some more functionality.

![Screenshot](http://farm5.static.flickr.com/4149/5094127748_c6a3bc7d98_m.jpg)

* You can create new Lighthouse tickets here: <http://cainrus.lighthouseapp.com/projects/62133/mootools-array-iterator>
* Github: <http://github.com/cainrus/mootools-array-iterator/>
* Plugin homepage: <http://mootools.net/forge/p/array_iterator>

Methods of iterator
-----------------

* reset  - select first index and return it
* end    - select last index and return it
* next   - select next indext and return it
* prev   - select preverious index and return it
* rewind - select null index
* jump   - select index and return value on index
* slide  - select every X index and return it, can be positive or negative
* key    - return active key (number or null)
* ref    - link to original array
* range  - return range of array

How to use
----------

* Create array and iterator( you can create a few instances of it ):

        var collection = [1,2,3,4,5]; // array
        var iterator = collection.iterator(options); // iterator

* Now you can easily iterate that array:

        console.log(iterator.next());    // 1
        console.log(iterator.end());     // 5
        console.log(iterator.prev());    // 4
        console.log(iterator.reset());   // 1
        console.log(iterator.slide(3));  // 4
        console.log(iterator.slide(-2)); // 2
        console.log(iterator.rewind());  // null

* You can get array from iterator:

        console.log(iterator.ref());     // [1,2,3,4,5]
        console.log(iterator.ref()===collection) // true

* You can get pointer from the iterator:

        console.log('value = ' + iterator.jump(2)); // value = 3
        console.log('key = ' + iterator.key());     // key = 4

* Try to select penultimate value:
        console.log(iterator.jump(-2));   // 4
        iterator.end(); console.log(iterator.prev());   // 4, same thing

* Try to play with _pit_ option:

        var collection = [1,2,3]
        var iterator = collection.iterator({pit : true});
        console.log(iterator.next());                 // 1
        console.log(iterator.next());                 // 2
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // null
        console.log(iterator.next());                 // 1
        console.log(iterator.next());                 // 2
        iterator.options.pit = false;
        console.log(iterator.prev());                 // 1
        console.log(iterator.prev());                 // 3

* Try to play with _limits_ option:

        iterator.options.limits = true;
        console.log(iterator.jump(0));                // 1
        console.log(iterator.next());                 // 2
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3

* Try to designate boundaries of iterator with _min_ & _max_ options:
        iterator.options.min = 2;
        iterator.options.max = 3;
        console.log(iterator.reset());                // 2
        console.log(iterator.next());                 // 3
        console.log(iterator.next());                 // 3
        iterator.options.limits = false;
        console.log(iterator.next());                 // 2

Options of iterator
-----------------
* pit    - Allow to select null position, when iterating. Null position selected only
when you create iterator or when you will select wrong index(like null, 'asd', NaN..),
or when you will you use rewind method.
* limits - Not allow to jump from zero index on the last and back again
* min    - Minimum allowed index, you can't select index less than it.
* max    - Maximum allowed index, you can't select index more than it.

Example
-----------------

    /* create inventory for game */ 
    var Axe = $('Axe'), Potion = $('Potion'); MagicBook = $('MagicBook');
    var inventory = [Axe, Potion, MagicBook];

    // Iteration of inventory.
    var activeSlot = inventory.iterator({
      // Allow to select null position, when iterating. Null position selected only
      // when you create iterator or when you will select wrong index(like null, 'asd', NaN..),
      // or when you will use rewind method.
      pit : true, // By default
      // Not allow to jump from zero index on the last and back again
      limits: false // By default
    }); 

    var index, active;
    index = activeSlot.key(); // Index of selected item
    active = activeSlot.current(); // value of selected item
    console.log(index); // null, because there is nothing selected on start
    console.log(active); // null, because there is nothing selected on start

    // Try to do something with every item in inventory
    while (active = activeSlot.next()){
      active.makeSomething;
    }

    // Same backwards
    while (active = activeSlot.prev()){
      active.makeSomething;
    }
    
    // reset to the null index when you need
    Game.addEvent('unselect', function(){
      activeSlot.rewind();
    });
    
    // to the first index
    Game.addEvent('inventoryOpen', function(){
      activeSlot.reset();
    });
    
    // try to select every second item in inventory
    inventory.push(Coat, Sword, Lamp); // Now: Axe, Potion, MagicBook, Coat, Sword, Lamp
    activeSlot.slide(2);
    active = activeSlot.slide(2);
    // OR
    active = activeSlot.next(), activeSlot.next();
