interface MinSignalItem {
	priority: number;
	dispatchCount: number;
	fn: Function;
	realFn: Function;
	context?: any;
	args: Array<any>;
}

export default class MinSignal {
	private _slice: any;
	private _listeners: Array<MinSignalItem>;
	private _dispatchCount: number;

	constructor() {
		this._slice = Array.prototype.slice;
		this._listeners = [];
		this._dispatchCount = 0;
	}

	private _sort(list) {
		list.sort(function (a, b) {
			a = a.p;
			b = b.p;
			return b < a ? 1 : b > a ? -1 : 0;
		});
	}

	/**
	 * Adding callback to the signal
	 * @param {Function} the callback function
	 * @param {object} the context of the callback function
	 * @param {number} priority in the dispatch call. The higher priority it is, the eariler it will be dispatched.
	 * @param {any...} additional argument prefix
	 */
	public add(fn: Function, context?: any, priority?, ...args): boolean {
		priority = priority || 0;
		let listeners = this._listeners;
		let listener, realFn, sliceIndex;
		let i = listeners.length;
		while (i--) {
			listener = listeners[i];
			if (listener.fn === fn && listener.context === context) {
				return false;
			}
		}
		if (typeof priority === 'function') {
			realFn = priority;
			priority = args;
			sliceIndex = 4;
		}
		listeners.unshift({ fn: fn, context: context, priority: priority, realFn: realFn || fn, args: this._slice.call(arguments, sliceIndex || 3), dispatchCount: 0 });
		this._sort(listeners);
		return true;
	}

	/**
	 * Adding callback to the signal but it will only trigger once
	 * @param {Function} the callback function
	 * @param {object} the context of the callback function
	 * @param {number} priority in the dispatch call. The higher priority it is, the eariler it will be dispatched.
	 * @param {any...} additional argument prefix
	 */
	public addOnce(fn: Function, context?: any, priority?, ...args): boolean {
		let self = this;
		let realFn = function () {
			self.remove.call(self, fn, context);
			return fn.apply(context, self._slice.call(arguments, 0));
		};
		args = this._slice.call(arguments, 0);
		if (args.length === 1) {
			args.push(undefined);
		}
		args.splice(2, 0, realFn);
		return this.add.apply(self, args);
	}

	/**
	 * Remove callback from the signal
	 * @param {Function} the callback function
	 * @param {object} the context of the callback function
	 * @return {boolean} return true if there is any callback was removed
	 */
	public remove(fn?, context?): boolean {
		if (!fn) {
			this._listeners.length = 0;
			return true;
		}
		let listeners = this._listeners;
		let listener;
		let i = listeners.length;
		while (i--) {
			listener = listeners[i];
			if (listener.fn === fn && (!context || listener.context === context)) {
				listener.dispatchCount = 0;
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
	public dispatch(...args) {
		args = this._slice.call(arguments, 0);
		this._dispatchCount += 1;
		let dispatchCount = this._dispatchCount;
		let listeners = this._listeners;
		let listener, context, stoppedListener;
		let i = listeners.length;
		while (i--) {
			listener = listeners[i];
			if (listener && listener.dispatchCount < dispatchCount) {
				listener.dispatchCount = dispatchCount;
				if (listener.r.apply(listener.context, listener.a.concat(args)) === false) {
					stoppedListener = listener;
					break;
				}
			}
		}
		listeners = this._listeners;
		i = listeners.length;
		while (i--) {
			listeners[i].dispatchCount = 0;
		}
		return stoppedListener;
	}
}
