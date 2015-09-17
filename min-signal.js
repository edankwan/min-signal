function MinSignal() {
    this._listeners = [];
}

var undef;

var _p = MinSignal.prototype;

_p.add = add;
_p.addOnce = addOnce;
_p.remove = remove;
_p.dispatch = dispatch;

var ERROR_MESSAGE_MISSING_CALLBACK = 'Callback function is missing!';

var _slice = Array.prototype.slice;

function _sort(list) {
    list.sort(function(a, b){
        a = a.p;
        b = b.p;
        return b < a ? 1 : a > b ? -1 : 0;
    });
}

/**
 * Adding callback to the signal
 * @param {Function} the callback function
 * @param {object} the context of the callback function
 * @param {number} priority in the dispatch call. The higher priority it is, the eariler it will be dispatched.
 * @param {any...} additional argument prefix
 */
function add (fn, context, priority, args) {

    if(!fn) {
        throw ERROR_MESSAGE_MISSING_CALLBACK;
    }

    priority = priority || 0;
    var listeners = this._listeners;
    var listener, realFn, sliceIndex;
    var i = listeners.length;
    while(i--) {
        listener = listeners[i];
        if(listener.f === fn && listener.c === context) {
            return false;
        }
    }
    if(typeof priority === 'function') {
        realFn = priority;
        priority = args;
        sliceIndex = 4;
    }
    listeners.unshift({f: fn, c: context, p: priority, r: realFn || fn, a: _slice.call(arguments, sliceIndex || 3), j: false});
    _sort(listeners);
}

/**
 * Adding callback to the signal but it will only trigger once
 * @param {Function} the callback function
 * @param {object} the context of the callback function
 * @param {number} priority in the dispatch call. The higher priority it is, the eariler it will be dispatched.
 * @param {any...} additional argument prefix
 */
function addOnce (fn, context, priority, args) {

    if(!fn) {
        throw ERROR_MESSAGE_MISSING_CALLBACK;
    }

    var self = this;
    var realFn = function() {
        self.remove.call(self, fn, context);
        return fn.apply(context, _slice.call(arguments, 0));
    };
    args = _slice.call(arguments, 0);
    if(args.length === 1) {
        args.push(undef);
    }
    args.splice(2, 0, realFn);
    add.apply(self, args);
}

/**
 * Remove callback from the signal
 * @param {Function} the callback function
 * @param {object} the context of the callback function
 * @return {boolean} return true if there is any callback was removed
 */
function remove (fn, context) {
    if(!fn) {
        this._listeners.length = 0;
        return true;
    }
    var listeners = this._listeners;
    var listener;
    var i = listeners.length;
    while(i--) {
        listener = listeners[i];
        if(listener.f === fn && (!context || (listener.c === context))) {
            listener.j = true;
            listeners.splice(i, 1);
            return true;
        }
    }
    return false;
}


/**
 * Dispatch the callback
 * @param {any...} additional argument suffix
 */
function dispatch(args) {
    args = _slice.call(arguments, 0);
    var listeners = this._listeners;
    var listener, context;
    var i = listeners.length;
    while(i--) {
        listener = listeners[i];
        if(listener && !listener.j) {
            listener.j = true;
            if(listener.r.apply(listener.c, listener.a.concat(args)) === false) {
                break;
            }
        }
    }
    listeners = this._listeners;
    i = listeners.length;
    while(i--) {
        listeners[i].j = false;
    }
}

if (typeof module !== 'undefined') {
    module.exports = MinSignal;
}
