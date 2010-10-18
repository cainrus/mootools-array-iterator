How to use
----------
* You'll need an array with test data:

	var collection = [1,2,3,4,5];

* Create iterator( you can create a few instances ):

        var iterator = collection.iterator(options);

* Now you can easily iterate that array:

        console.log(iterator.next());    // 1
        console.log(iterator.end());     // 5
        console.log(iterator.prev());    // 4
        console.log(iterator.reset());   // 1
        console.log(iterator.slide(3));  // 4
        console.log(iterator.slide(-2)); // 2
        console.log(iterator.rewind());  // null

* You can get array:

        console.log(iterator.ref());     // [1,2,3,4,5]

* You can get pointer of the iterator:

        console.log('value = ' + iterator.jump(2)); // value = 3
        console.log('key = ' + iterator.key());     // key = 4

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
