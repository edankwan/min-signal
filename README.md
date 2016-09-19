# min-signal

[**min-signal**](http://edankwan.github.io/min-signal) is a lightweight version of [**js-signals**](https://millermedeiros.github.io/js-signals/) which is heavily inspired by [**Robert Penner’s AS3-Signals**](https://github.com/robertpenner/as3-signals). Signal is an alternative to `Events`/`Promises`/`Callbacks`. To know more about the differences, you can check out the [**Wiki page**](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations) of js-signals.

Unlike other trimmed version js-signals, min-signal preverses some useful features like **priorty** and **arguments injection** which comes in handy during the development.

Dispatch the same signal within the signal callback is not recommended. If it happens the new signal execution will kick in and stop the unfinished execution. 

Examples
---

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

function callback1() {
    console.log('1');
}

function callback2() {
    console.log('2');
}

function callback3() {
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

### Stop Propagation
You can stop propagation by returning `false` in the callback function. By stopping propagation, in the `dispatch()` call it will return the listener which triggered the stop propagation.
````js
var onStarted = new MinSignal();

onStarted.add(function(){
	return false; // returns "false" to stop propagation
});
onStarted.add(function(){
	console.log('wont be triggered'); // this function won't be trigger
});

onStarted.dispatch(); // log : {...} // will return the listener that stopped the propagation
````


Installation
---
### Manually
Download min-signal [**here**](https://raw.githubusercontent.com/edankwan/min-signal/master/min-signal.js).

### Npm
Check out the npm page [**here**](https://www.npmjs.com/package/min-signal).



Testing
---
run `npm run test` to run the test suite.

TODO
---
- additional features?
- add more tests

License
---
min-signal is currently under [**Giant Penis License (GPL)**](http://giant-penis-license.org) which is a deformed M.I.T license including penis text art.