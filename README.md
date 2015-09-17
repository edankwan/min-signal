# min-signal
A mini version of signal in Javascript. It supports priority and additional prefixed/suffixed arguments.

## Examples

### Basic Example
Example of using the basic functions: `add()`, `dispatch()` and `remove()` with **min-signal**
````js
var onStarted = new MinSignal();

function callback(param1, param2) {
    console.log(param1 + ' ' + param2);
}

onStarted.add(callback); //add listener
onStarted.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
onStarted.remove(callback); //remove a single listener
````

### addOnce()
If you want the callback to be dispatched only once, you can use `addOnce()`.
````js
var onStarted = new MinSignal();

function callback() {
    console.log('hello');
}

onStarted.addOnce(callback);
onStarted.dispatch(); // log : hello
onStarted.dispatch(); // do nothing
````

### Priority
The third argument of the `add()` and `addOnce()` is the priority, the higher it is, the earlier it will be dispatched. The default value is 0, and order by first comes first served principle.
````js
var onStarted = new MinSignal();

function callback1(param1, param2) {
    console.log('1');
}

function callback2(param1, param2) {
    console.log('2');
}

function callback3(param1, param2) {
    console.log('3');
}

onStarted.add(callback1);
onStarted.add(callback2);
onStarted.add(callback3, null, 10);
onStarted.dispatch(); // log : 3, 1, 2
````

### Context
Like function binding, you can provide the context for the callback binding. Same context with the same function will be ignored.
````js
var onStarted = new MinSignal();

function callback() {
    console.log(this.id);
}

var a = {id: 'a'};
var b = {id: 'b'};

onStarted.add(callback, a);
onStarted.add(callback, a);
onStarted.add(callback, b);
onStarted.dispatch(); // log : a, b
````

### Argument prefix
You can also add argument prefix with the `add()` and `addOnce()` like in `Function.bind()`. One thing need to keep in mind is that, for the duplicated callback checking, it only check the function and the context, same function with the same context with new argument prefix will be rejected instead of overriding.
````js
var onStarted = new MinSignal();

function callback(param1, param2, param3, param4) {
    console.log(param1 + param2 + param3 + param4);
}

onStarted.add(callback, null, 0, 'a', 'b');
onStarted.dispatch('c', 'd'); // log : abcd
````

Testing
---
run `npm run test` to run the test suite.

License
---
min-signal is currently under [**Giant Penis License (GPL)**](http://giant-penis-license.org) which is a deformed M.I.T license including penis text art.