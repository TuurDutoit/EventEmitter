EventEmitter
============

The last EventEmitter you'll ever need. Small, fast, full-featured, for node.js and the browser.  
Apart from the usual stuff, `EventEmitter` features:
1. `handleEvent()` objects
2. wildcards
3. namespaces
4. an API you already know
5. excellent documentation (coming soon)
6. extensive tests, powered by [Jasmine (v2.1)][jasmine]
7. support for your package manager

And all this in 3.3kB (minified) or 1056 bytes (gzipped)!





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





## API
Coming Soon!





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