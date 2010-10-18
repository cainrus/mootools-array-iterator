Array iterator
===========

This plugin provides functionality for array iteration with php like methods (next, prev, current, key, end, reset, rewind).
And some more functionality.

![Screenshot](http://farm5.static.flickr.com/4084/5090601279_6bb2f58b54.jpg)

How to use
----------
* Create array:
    
        var collection = [1,2,3,4,5];
    
* Create iterator( you can create a few instances ):
    var iterator = collection.iterator(options);
* Now you can iterate array:
    console.log(iterator.next());    // 1
    console.log(iterator.end());     // 5
    console.log(iterator.prev());    // 4
    console.log(iterator.reset());   // 1
    console.log(iterator.slide(3));  // 4
    console.log(iterator.slide(-2)); // 2
    console.log(iterator.rewind());  // null
* You can get array from iterator:
    console.log(iterator.ref());     // [1,2,3,4,5]
* Try to play with _pit_ option:
    var collection = [1,2,3]
    var iterator = collection.iterator({pit : true});
    iterator.next();                 // 1
    iterator.next();                 // 2
    iterator.next();                 // 3
    iterator.next();                 // null
    iterator.next();                 // 1
    iterator.next();                 // 2
    iterator.options.pit = false;
    iterator.prev();                 // 1
    iterator.prev();                 // 3
* Try to play with _limits_ option:
    iterator.options.limits = true;
    iterator.jump(0);                // 1
    iterator.next();                 // 2
    iterator.next();                 // 3
    iterator.next();                 // 3
    iterator.next();                 // 3

Options of iterator
-----------------
* _pit_    - Allow to select null position, when iterating. Null position selected only
when you create iterator or when you will select wrong index(like null, 'asd', NaN..),
or when you will you use rewind method.
* _limits_ - Not allow to jump from zero index on the last and back again

##Example:

    /* create inventory for game */ 
    var Axe = $('Axe'), Potion = $('Potion'); MagicBook = $('MagicBook');
    var inventory = [Axe, Potion, MagicBook];

    // Iteration of inventory.
    var activeSlot = inventory.iterator({
      // Allow to select null position, when iterating. Null position selected only
      // when you create iterator or when you will select wrong index(like null, 'asd', NaN..),
      // or when you will you use rewind method.
      pit : true, // By default
      // Not allow to jump from zero index on the last and back again
      limits: false // By default
    }); 

    var index, active;
    index = activeSlot.key(); // Index of selected item
    active = activeSlot.current(); // Index of selected item
    console.log(index); // null, because there is nothing selected on start
    console.log(active); // null, because there is nothing selected on start

    // Try to do something with every item in inventory
    while (active = activeSlot.next()){
      active.makeSomething;
    }

    // Same backwards
    while (active = activeSlot.next()){
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
    active = activeSlot.slide(2);
    // OR
    active = activeSlot.next(), activeSlot.next();




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
