describe('MinSignal', function tests() {

    var MinSignal = require('./min-signal');
    var assume = require('assume');

    describe('#add()', function () {

        it('adds multiple times with same function(without context) once only', function (done) {
            var signal = new MinSignal();

            function foo() {}

            signal.add(foo);
            signal.add(foo);

            assume(signal._listeners.length).equals(1);
            done();

        });

        it('adds multiple times with same function(with context) once only', function (done) {
            var signal = new MinSignal();

            function foo() {}

            var a = {};
            var b = {};

            signal.add(foo, a);
            signal.add(foo, a);
            signal.add(foo, b);
            signal.add(foo, b);
            signal.add(foo, b);

            assume(signal._listeners.length).equals(2);
            done();

        });

        it('prioritizes the callbacks with first come first serve base', function (done) {
            var signal = new MinSignal();

            function foo() {}

            var a = {};
            var b = {};
            var c = {};
            var d = {};
            var e = {};
            var f = {};

            signal.add(foo, a, 12);
            signal.add(foo, b, 2);
            signal.add(foo, c, 5);
            signal.add(foo, d);
            signal.add(foo, e, 7);
            signal.add(foo, f, 12);
            assume(signal._listeners[0].c).equals(d);
            assume(signal._listeners[1].c).equals(b);
            assume(signal._listeners[2].c).equals(c);
            assume(signal._listeners[3].c).equals(e);
            assume(signal._listeners[4].c).equals(f);
            assume(signal._listeners[5].c).equals(a);
            done();

        });

        it('add prepend argments', function (done) {
            var signal = new MinSignal();

            function foo() {}

            signal.add(foo, null, 0, 1, 2, 3);
            assume(signal._listeners[0].a).deep.equals([1, 2, 3]);
            done();

        });

    });

    describe('#dispatch()', function () {

        it('dispatchs stack', function (done) {
            var signal = new MinSignal();
            var count  = 0;

            signal.add(function (step) {
                if (step === 0) {
                    count += 1;
                    signal.dispatch(1);
                } else if (step === 1) {
                    count += 2;
                    signal.dispatch(2);
                } else if (step === 2) {
                    count += 3;
                    assume(count).equals(6);
                    done();
                }
            })
            signal.dispatch(0);

        });

        it('dispatchs multiple callbacks', function (done) {
            var signal = new MinSignal();
            var count  = 0;

            function add() {
                count += this.val;
            }

            var a = {val : 1};
            var b = {val : 2};
            var c = {val : 3};

            signal.add(add, a);
            signal.add(add, b);
            signal.add(add, c);
            signal.dispatch();

            assume(count).equals(6);
            done();

        });


        it('dispatchs callback with arguments', function (done) {
            var signal = new MinSignal();
            var count  = 0;

            function add(a) {
                count += a;
            }

            var a = {};
            var b = {};
            var c = {};

            signal.add(add, a);
            signal.add(add, b);
            signal.add(add, c);
            signal.dispatch(10);

            assume(count).equals(30);
            done();

        });


        it('dispatchs callback with prepend arguments', function (done) {
            var signal = new MinSignal();
            var count  = 0;

            function add(a, b) {
                count += a + b;
            }

            var a = {};
            var b = {};
            var c = {};

            signal.add(add, a, 0, 1);
            signal.add(add, b, 0, 2);
            signal.add(add, c, 0, 3);
            signal.dispatch(10);

            assume(count).equals(36);
            done();

        });


        it('dispatchs with correct priority', function (done) {
            var signal = new MinSignal();
            var stack = [];

            function add() {
                stack.push(this);
            }

            var a = {};
            var b = {};
            var c = {};
            var d = {};
            var e = {};
            var f = {};

            signal.add(add, a, 12);
            signal.add(add, b, 2);
            signal.add(add, c, 5);
            signal.add(add, d);
            signal.add(add, e, 7);
            signal.add(add, f, 12);

            signal.dispatch();
            assume(stack).deep.equals([a, f, e, c, b, d]);
            done();

        });


        it('remove on dispatch', function (done) {
            var signal = new MinSignal();
            var sum = 0;

            var a = {};
            var b = {};
            var c = {};

            function add(val) {
                sum += val;
                signal.remove(add, b);
            }

            signal.add(add, a, 0, 1);
            signal.add(add, b, 0, 3);
            signal.add(add, c, 0, 5);

            signal.dispatch();
            assume(sum).equals(6);
            done();

        });


        it('add on dispatch', function (done) {
            var signal = new MinSignal();
            var sum = 0;

            var a = {};
            var b = {};
            var c = {};

            function add(val) {
                sum += val;
                signal.add(add, c, 0, 5);
            }

            signal.add(add, a, 0, 1);
            signal.add(add, b, 0, 3);

            signal.dispatch();
            assume(sum).equals(6);
            done();

        });

    });

});
