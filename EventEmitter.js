
(function (factory) {
    "use strict";


    if(typeof define === "function" && define.amd) {
        define(factory);
    }
    else if(typeof module === "object") {
        module.exports = factory();
    }
    else {
        window.EventEmitter = factory();
    }


}(function() {
    "use strict";


    var EventEmitter = function() {
        this._events = {};
        this._regexs = {};
        
        return this;
    }
    
    
    
    
    /**
     * Utils
     *
     * 'Private' API
     */
    
    var copyArray = function(arr, start, end) {
        var result = [];
        if(!start) {
            start = 0;
        }
        if(!end) {
            end = arr.length;
        }
        
        for(var i = start; i < end; i++) {
            result.push(arr[i]);
        }
        
        return result;
    }
    
    var execListener = EventEmitter.execListener = function(cb, args) {
        if(typeof cb === "function") {
            return cb.apply(cb, args);
        }
        else if(typeof cb === "object" && typeof cb.handleEvent === "function") {
            return cb.handleEvent.apply(cb, args);
        }
    }
    
    var Regexs = EventEmitter.regexs = {};
    var eventRegex = EventEmitter.eventRegex = function(event) {
        if(!Regexs[event]) {
            Regexs[event] = new RegExp("^"+event.replace("*", ".*")+"$");
        }
        
        return Regexs[event];
    }
    
    
    
    
    /**
     * EventEmitter
     *
     * Public API
     */
    
    EventEmitter.prototype.emit =
    EventEmitter.prototype.fire =
    EventEmitter.prototype.trigger =
    function(event) {
        var args = copyArray(arguments, 1);
        args.push(event);
        var regex1 = eventRegex(event);
        
        outer:
        for(var ev in this._events) {
            var regex2 = eventRegex(ev);
            if(regex2.test(event) || regex1.test(ev)) {
                var listeners = this._events[ev];
                for(var i = 0, len = listeners.length; i < len; i++) {
                    var res = execListener(listeners[i], args, event);
                    if(res === false) {
                        break outer;
                    }
                }
            }
        }
        
        return this;
    }
    
    EventEmitter.prototype.on =
    EventEmitter.prototype.addListener =
    EventEmitter.prototype.addEventListener =
    function(event, cb) {
        if(!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(cb);
        this._regexs[event] = eventRegex(event);
        this.emit("newListener", event, cb);
        
        return this;
    }
    
    EventEmitter.prototype.once =
    EventEmitter.prototype.addOnceListener =
    function(event, cb) {
        var self = this;
        var func = function() {
            execListener(cb, arguments);
            self.removeListener(event, this);
        }
        this.addListener(event, func);
        
        
        return this;
    }
    
    EventEmitter.prototype.many =
    EventEmitter.prototype.addManyListener =
    function(event, cb, amount) {
        var self = this;
        var count = 0;
        var func = function() {
            execListener(cb, arguments);
            count++;
            console.log(count);
            if(count === amount) {
                self.removeListener(event, this);
            }
        }
        this.addListener(event, func);
        
        return this;
    }
    
    EventEmitter.prototype.off =
    EventEmitter.prototype.removeListener =
    EventEmitter.prototype.removeEventListener =
    function(event, cb, all) {
        var regex = eventRegex(event);
        if(all) {
            for(var ev in this._events) {
                if(regex.test(ev)) {
                    var listeners = this._events[ev];
                    var result = [];
                    for(var i = 0, len = listeners.length; i < len; i++) {
                        if(listeners[i] !== cb) {
                            result.push(listeners[i]);
                        }
                    }
                    this._events[ev] = result;
                }
            }
        }
        else {
            for(var ev in this._events) {
                if(regex.test(ev)) {
                    var index = this._events[ev].indexOf(cb);
                    if(index > -1) {
                        this._events[ev].splice(index, 1);
                        break;
                    }
                }
            }
        }
        
        return this;
    }
    
    EventEmitter.prototype.offAll =
    EventEmitter.prototype.removeAllListeners =
    function(event) {
        if(event) {
            var regex = eventRegex(event);
            for(var ev in this._events) {
                if(regex.test(ev)) {
                    this._events[ev] = [];
                }
            }
        }
        else {
            this._events = {};
        }
        
        return this;
    }
    
    EventEmitter.prototype.count =
    EventEmitter.prototype.countListeners =
    function(event) {
        var sum = 0;
        
        if(event) {
            var regex1 = eventRegex(event);
            for(var ev in this._events) {
                var regex2 = eventRegex(ev);
                if(regex2.test(event) || regex1.test(ev)) {
                    sum += this._events[ev].length;
                }
            }
        }
        else {
            for(var ev in this._events) {
                sum += this._events[ev].length;
            }
        }
        
        return sum;
    }
    
    EventEmitter.prototype.listeners =
    EventEmitter.prototype.getListeners =
    function(event) {
        var listeners = [];
        
        if(event) {
            var regex1 = eventRegex(event);
            for(var ev in this._events) {
                var regex2 = eventRegex(ev);
                if(regex2.test(event) || regex1.test(ev)) {
                    listeners.push.apply(listeners, this._events[ev]);
                }
            }
        }
        else {
            var listeners = [];
            for(var ev in this._events) {
                listeners.push.apply(listeners, this._events[ev]);
            }
        }
        
        return listeners;
    }
    
    
    
    
    
    
    /**
     *  Namespace
     *
     * Create a namespace / scope on EventEmitters
     */
    
    var Namespace = function(emitter, scope) {
        var namespace = {
            emitter: emitter,
            scope: scope,
            execListener: emitter.execListener,
            eventRegex: emitter.eventRegex
        };
        scope += ":";
        
        
        namespace.emit = function(event) {
            arguments[0] = scope+event;
            emitter.emit.apply(emitter, arguments);
            return this;
        }
        
        namespace.on = namespace.addListener = namespace.addEventListener = function(event, cb) {
            emitter.addListener(scope+event, cb);
            return this;
        }
        
        namespace.once = namespace.addOnceListener = function(event, cb) {
            emitter.addOnceListener(scope+event, cb);
            return this;
        }
        
        namespace.many = namespace.addManyListener = function(event, cb) {
            emitter.addManyListener(scope+event, cb);
            return this;
        }
        
        namespace.off = namespace.removeListener = namespace.removeEventListener = function(event, cb) {
            emitter.removeListener(scope+event, cb);
            return this;
        }
        
        namespace.offAll = namespace.removeAllListeners = function(event) {
            emitter.removeAllListeners(scope + (event ? event : "*"));
            
            return this;
        }
        
        namespace.count = namespace.countListeners = function(event) {
            emitter.countListeners(scope + (event ? event : "*"));
            
            return this;
        }
        
        namespace.listeners = namespace.getListeners = function(event) {
            emitter.getListeners(scope + (event ? event : "*"));
            
            return this;
        }
        
        namespace.namespace = function(name) {
            return Namespace(scope+name, emitter);
        }
        
        
        return namespace;
    }
    
    
    EventEmitter.prototype.namespace = function(scope) {
        return Namespace(this, scope);
    }
    
    
    
    
    
    return EventEmitter;


}));