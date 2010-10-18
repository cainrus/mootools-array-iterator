Array iterator
===========

This plugin provides functionality for array iteration with php like methods (next, prev, current, key, end, reset, rewind).
And some more functionality.

![Screenshot](http://farm5.static.flickr.com/4084/5090601279_6bb2f58b54.jpg)

How to use
----------

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


Create iterator
-----------------

    [1,2,3].iterator(); // Will return iterator.

Options of iterator
-----------------
* pit    - Allow to select null position, when iterating. Null position selected only
           when you create iterator or when you will select wrong index(like null, 'asd', NaN..),
           or when you will you use rewind method.
* limits - Not allow to jump from zero index on the last and back again

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
