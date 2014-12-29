EventEmitter
============

The last EventEmitter you'll ever need. Small, fast, full-featured, for node.js and the browser.  
Apart from the usual stuff, `EventEmitter` features:
1. `handleEvent()` objects
2. wildcards
3. namespaces
4. an API you already know
5. excellent documentation
6. extensive tests, powered by [Jasmine (v2.1)][jasmine]
7. support for your package manager

And all this in 3.2kB (minified) or 1050 bytes (gzipped)!


## Table of Contents
* [Getting a copy](#getting-a-copy)
    * [Source](#source)
    * [NPM](#npm)
    * [Bower](#bower)
    * [Component](#component)
* [Using it in your page](#using-it-in-your-page)
    * [Browser](#browser)
    * [AMD](#amd)
    * [node.js / CommonJS](#nodejs--commonjs)
* [Contributing](#contributing)
* [Notes](#notes)
    * [Wildcards](#wildcards)
    * [Listeners](#listeners)
* [API](#api)
    * [new EventEmitter()](#new-eventemitter)
    * [#_events](#_events--object)
    * [#on/addListener/addEventListener](#onaddlisteneraddeventlistener-string-event-listener-listener)
    * [#once/addOnceListener](#onceaddoncelistener-string-event-listener-listener)
    * [#many/addManyListener](#manyaddmanylistener-string-event-listener-listener-int-times)
    * [#emit/fire/trigger](#emitfiretrigger-string-event-any-arg1-any-arg2)
    * [#off/removeListener/removeEventListener](#offremovelistenerremoveeventlistener-stringevent-listener-listener-bool-all-false)
    * [#offAll/removeAllListeners](#offallremovealllisteners-string-event-)
    * [#count/countListeners](#countcountlisteners-string-event-)
    * [#listeners/getListeners](##listenersgetlisteners-string-event-)
    * [.execListener](#execlistener-listener-listener-arrayany-args)
    * [.eventRegexp](#eventregexp-string-event)
    * [.regexps](#regexps--object)
* [License](#license)


## Getting a copy
There are several ways of obtaining a copy of `EventEmitter`. You can download the source code from [GitHub], or use your preferred package manager.

### Source
Go to the [GitHub repo][GitHub], download the `EventEmitter.js` or `EventEmitter.min.js` (minified) scripts and put them somewhere in your project folder.

### NPM
Make sure you have [node.js] and [npm][npm-home] (which comes with node.js) installed. Then, you can just:

```
$ npm install --save last-eventemitter
```

### Bower
Make sure you have [Bower][bower-home] installed. Then, you can just:

```
$ bower install TuurDutoit/EventEmitter
```

### Component
Make sure you have [Component][component-home] installed. Then, you can just:

```
$ component install TuurDutoit/EventEmitter
```


## Using it in your page
Again, there are several ways to do this. `EventEmitter` works with AMD loaders (like [requirejs]), commonJS (used by [node.js]) and in the browser, as the global `EventEmitter` symbol.

### Browser
Just include the `EventEmitter.js` (developement) or `EventEmitter.min.js` (production) scripts in your page, by appending a `<script>` tag in the `<head>`:

```html
<script type="text/javascript" src="path/to/EventEmitter.js"></script>
```

### AMD
Just require it in your code, like so:

```javascript
//myModule.js
define("path/to/EventEmitter", function(EventEmitter) {...});
```

Note the absence of the `.js` extension on `path/to/EventEmitter`!

### node.js / commonJS
Just require it in your code, like so:

```javascript
var EventEmitter = require("last-eventemitter");
```

Note the absence of the `.js` extension on `path/to/EventEmitter`!


## Contributing
`EventEmitter` is fully open-source and free as in speech. Please feel free to open issues (in the [issue tracker] please) and don't be shy to open a Pull Request! Happy coding!


## Notes
### Wildcards
At the moment the wildcards implementation works with RegExps, which have one major downside: comparing two RegExps (and thus wildcard events) is very difficult. That is why I advise you to use wildcards only with namespaces: use them to wildcard scopes, but not parts of scopes/events. That leads to problems when matching event strings.

Also, wildcards work differently with `#off()` and `#offAll()` than with all the other methods. With `#off()` and `#offAll()`, the `event`s passed to those methods are converted to RegExps, and then all the listeners' event strings are matched against these RegExps to determine which should be removed. This prevents the removal of a listener listening to `scope:*` by calling `#offAll("scope:event")`, but allows removing a listener listening for `scope:event` byt calling `#offAll("scope:*")`.  
With all the other methods, it works a little differently. Here, matches are tested in both ways: the listeners' event strings are matched against the `event`s RegExp, and the `event` is tested against the listeners' RegExps. This allows executing a listener listening to `scope:*` with a call to `emit("scope:event")`, but it also allows executing one listening to `scope:event` by calling `emit("scope:*")`.

I'm working on a way to allow for more complex wildcards, maybe even using RegExps yourself in all the methods, but that is complex, and more importantly, computationally intensive, and thus slow. I hope I can solve the problem, but don't expect that to happen soon.


### Listeners
`Listener`s can be either a normal `function` or an object with a `handleEvent()` method (as in the DOM Events API). For more info about `handleEvent()`, check [this page][handleEvent] (check the 'listener' section).  


## API

__Note__: A `.` means a property/method is only available on the `EventEmitter` object, not on its instances. A `#` means that a property/method is only available on `EventEmitter` instances.

__Note__: A `Listener` type means either a normal function or an Object with a `handleEvent()` method. For more info, check the [Listeners](#listeners) section above.


### new EventEmitter()
__*return*__: *EventEmitter*. Of course.

To begin, create a new instance of `EventEmitter`. The contructor doesn't expect any arguments.

```javascript
var ee = new EventEmitter();
```


### #_events | Object
The `#_events`object maps event strings to arrays of listeners. It is intended to be used internally, but you can, very cautiously, use it yourself.

An `_events` object looks like this:
```javascript
ee._events = {
    "event": [function(){...}, function(){...}, function(){...}],
    "scope:event": [function(){...}],
    "scope:*": [function(){...}, function(){...}]
}
```


### #on/addListener/addEventListener (string: event, Listener: listener)
__event__: *string*. The event to add the listener to. May contain wildcards.  
__listener__: *Listener*. The listener to add.  
__*return*__: *EventEmitter*. For chaining.

Use this method to attach an event listener. When the `event` is fired, the listener will be executed (i.e. passed to `EventEmitter.execListener`) and the arguments passed to `emit()` will be passed on to the listener. The last argument will be the event string passed to `emit()`. If a listener is added multiple times, it will be executed the same amount of times it was added and in the same order as it was added. Also, `event` may contain wildcards (please read the [Wildcards](#wildcards) section).

```javascript
// Received event: scope:event
// Hello, Tuur Dutoit
ee.on("event", function(name, event) {
    console.log("Hello, " + name);
});
ee.on("scope:*", function(event) {
    console.log("Received event: " + event);
});

ee.emit("scope:event");
ee.emit("event", "Tuur Dutoit");
```


### #once/addOnceListener (string: event, Listener: listener)
__event__: *string*. The event to add the listener to. May contain wildcards.  
__listener__: *Listener*. The listener to add.  
__*return*__: *EventEmitter*. For chaining.

This method does the same as `#on()`, but it makes sure the listener is only called once: it will remove it after the first call.

```javascript
// Listener called 1 time.
// Done.
var count = 0;
ee.once("event", function() {
    count++;
    console.log("Listener called " + count + " time.");
});

ee.emit("event");
ee.emit("event");
console.log("Done.");
```


### #many/addManyListener (string: event, Listener: listener, int: times)
__event__: *string*. The event to add the listener to. May contain wildcards.  
__listener__: *Listener*. The listener to add.  
__times__: *int*. The maximum amount of times to call the listener.  
__*return*__: *EventEmitter*. For chaining.

This method does the same as `#on()`, but makes sure the listener is called a maximum of `times` times, by removing the listener after the `times`th call.

__Note__: `addManyListener` is singular!

```javascript
// Listener called 1 times.
// Listener called 2 times.
// Done.
var count = 0;
ee.many("event", function() {
    count++;
    console.log("Listener called " + count + " times.");
}, 2);

ee.emit("event");
ee.emit("event");
ee.emit("event");
console.log("Done.");
```


### #emit/fire/trigger (string: event, [any: arg1, any: arg2,...])
__event__: *string*. The event that should be emitted. May contain wildcards.  
__argN__: *any*. Arguments to pass to the listeners.  
__*return*__: *EventEmitter*. For chaining.

This method emits events, i.e. it executes all the listeners that are listening for `event` (which may contain wildcards; read the [Wildcards](#wildcards) section), passing in all the arguments after `event`.  
There are two things happening here:
1. Checking which listeners to call. This is done by checking if the `event` RegExp matches the listener's event string, __or vice versa__. Read the [Wildcards](#wildcards) section for more info.
2. Executing the listeners. In this stage, all the matching listeners are passed to `.execListener()` for execution. The `args` will be set to any arguments that are passed after `event`, and then `event` itself is passed as last argument.

```javascript
// Received event: scope:event
// Hello, Tuur Dutoit
ee.on("event", function(name, event) {
    console.log("Hello, " + name);
});
ee.on("scope:*", function(event) {
    console.log("Received event: " + event);
});

ee.emit("scope:event");
ee.emit("event", "Tuur Dutoit");
```

### #off/removeListener/removeEventListener (string:event, Listener: listener, [bool: all (false)])
__event__: *string*. The event to remove the listener from. May contain wildcards.  
__listener__: *Listener*. The listener to remove.  
__all__: *bool, optional (false)*. Whether to remove all instances of the listener.  
__*return*__: *EventEmitter*. For chaining.

This method removes `listener` from the list of listeners for `event`. `event` may contain wildcards, but these work a little different from `#on()` and `#emit()`: here, only the listeners' event strings are matched against `event`'s RegExp, and not the other way around. For more info, read the [Wildcards](#wildcards) section.  
The `all` argument allows to control the behaviour when a listener has been added multiple times. When `all` is `false` (the default), only one instance of the listener is removed. When `all` is `true`, all the instances (that match `event`) will be removed.

With `all = false`:
```javascript
var listener = function(){...};
// Add the listener twice
ee.on("event", listener);
ee.on("event", listener);
// Remove one instance
ee.off("event", listener);
// 1
ee.count("event");
```
With `all = true`:
```javascript
ee.on("event", listener);
ee.on("event", listener);
// Remove all instances
ee.off("event", listener, true);
// 0
ee.count("event");
```


### #offAll/removeAllListeners ([string: event ("*")])
__event__: _string, optional ("*")_. The event to remove all listeners from. May contain wildcards.  
__*return*__: *EventEmitter*. For chaining.

This method removes all listeners for a specific `event` (which may contain wildcards; read the [Wildcards](#wildcards) section), or for the whole `EventEmitter` (if no `event` is specified).

For a specific event:
```javascript
ee.on("event", function(){...});
ee.on("other-event", function(){...});
ee.removeAllListeners("event");

// 1
ee.count("event");
```
For the whole `EventEmitter`:
```javascript
ee.on("event", function(){...});
ee.on("other-event", function(){...});
ee.offAll();

// 0
ee.count();
```


### #count/countListeners ([string: event ("*")])
__event__: _string, optional ("*")_ The event for which to count the listeners. May contain wildcards.  
__*return*__: *int* The amount of listener listening for `event`.

This method counts the listeners that are listening to `event` (which may contain wildcards; read the [Wildcards](#wildcards) section). If no `event` is specified, it counts all the listeners for the `EventEmitter`.

For a specific event:
```javascript
ee.on("event", function(){...});
ee.on("other-event", function(){...});

// 1
ee.count("event");
```
For the whole `EventEmitter`:
```javascript
ee.on("event", function(){...});
ee.on("other-event", function(){...});

// 2
ee.count();
```


### #listeners/getListeners ([string: event ("*")])
__event__: _string, optional ("*")_. The event to get the listeners for. May contain wildcards.  
__*return*__: *Array&lt;Listener&gt;*. An array containing all the listeners listening for `event`.

This method retrieves all the listeners that listen for `event` (which may contain wildcards; read the [Wildcards](#wildcards) section). If no `event` is specified, it returns all the listeners bound to the `EventEmitter`. The returned array may contain duplicates (if you added a listener more than once).

For a specific `event`:
```javascript
ee.on("event", function listener1(){...});
ee.on("other-event", function listener2(){...});

// [ function listener1(){...} ]
ee.listener("event");
```
For the whole `EventEmitter`:
```javascript
ee.on("event", function listener1(){...});
ee.on("other-event", function listener2(){...});

// [ function listener1(){...}, function listener2(){...} ]
ee.listeners();
```


### .execListener (Listener: listener, Array&lt;any&gt;: args)
__listener__: *Listener* The listener to execute.  
__args__: *Array&lt;any&gt;* The arguments to pass to the listener  
__*return*__: *any*. Anything the listener returns.

__Note__: This method is only available on the `EventEmitter` object, not on its instances!

`EventEmitter.execListener()` executes a listener, `apply()`ing `args` to it.  
`listener` can be a function, or an object with a `handleEvent()` method. For more info about listeners, check the [Listeners](#listeners) section.
The `this` in the listener will be set to `listener` (be it a function or an object; this is default javascript behaviour). This method is intended for internal use, but may be used publicly.

```javascript
var listener = function(arg1, arg2){
    console.log(arg1 + ", " + arg2);
    console.log(this);
}
var objectListener = {
    handleEvent: listener
}
var args = ["hello", "world"];

//hello, world
//function
EventEmitter.execListener(listener, ["hello", "world"]);

//hello, world
//object
EventEmitter.execListener(objectListener, ["hello", "world"]);
```


### .eventRegexp (string: event)
__event__: *string*. The event name to convert to a RegExp.  
__*return*__: *RegExp*. The RegExp that matches the event name.

__Note__: This method is only available on the `EventEmitter` object, not on its instances!

With `EventEmitter.eventRegexp()`, you can get the RegExp representation of a wildcard event. This method just passes the event name you give it to `new RegExp(event)`, after replacing `*` by `.*`. This method is intended for internal use, but may be used publicly.  
This method uses the `EventEmitter.regexps` object as a sort of cache: any event strings that have not yet passed `eventRegexp()` will be added to it (with their RegExp representation), and `EventRegexp()` will return the RegExp that has been stored in `regexps` if the event string can be found there.

__Note__: When matching wildcard events with other wildcard events, weird things can happen. I'm working on a way to solve this. In the meantime, take a look at the [Wildcards](#wildcards) section.

```javascript
// /scope:.*/
EventEmitter.eventRegexp("scope:*");
// Matches: "scope:event", "scope:other-event"
// but not: "event", "world:event"
```


### .regexps | Object

__Note__: This property is only available on the `EventEmitter` object, not on its instances!

`EventEmitter.regexps` is an object matching event strings and their RegExp representations. This is only used by `EventEmitter.eventRegexp()` as a sort of cache, to prevent memoty leaks.

It looks like this:

```javascript
EventEmitter.regexps = {
    "event": /^event$/,
    "scope:*": /^scope:.*$
}
```







## License
The MIT License (MIT)

Copyright (c) 2014-2015 Tuur Dutoit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.







[jasmine]: http://jasmine.github.io/
[requirejs]: http://requirejs.org/
[node.js]: http://nodejs.org/
[GitHub]: https://github.com/TuurDutoit/EventEmitter/
[npm]: https://www.npmjs.com/package/last-eventemitter
[npm-home]: https://www.npmjs.com/
[bower-home]: http://bower.io/
[component-home]: https://github.com/componentjs/component
[handleEvent]: https://developer.mozilla.org/en/docs/Web/API/EventTarget.addEventListener
[issue tracker]: https://github.com/TuurDutoit/EventEmitter/issues