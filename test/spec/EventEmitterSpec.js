describe("EventEmitter", function() {
    var ee = new EventEmitter();
    
    it("has a .regexs property", function() {
        expect(EventEmitter.regexs).toBeDefined();
        expect(EventEmitter.regexs).toEqual({});
    });
    
    it("has a #_events property", function() {
        expect(ee._events).toBeDefined();
        expect(ee._events).toEqual({});
    });
    
    
    describe(".execListener", function() {
        
        describe("with functions", function() {
            var cb;
            
            beforeEach(function() {
                cb = jasmine.createSpy();
                EventEmitter.execListener(cb, ["hello", "world"]);
            });
            
            it("executes the listeners", function() {
                expect(cb).toHaveBeenCalled();
            });

            it("applies the right arguments to the listeners", function() {
                expect(cb).toHaveBeenCalledWith("hello", "world");
            });
        });
        
        
        describe("with objects", function() {
            var cb;
            
            beforeEach(function() {
                cb = jasmine.createSpyObj("cb", ["handleEvent"]);
                EventEmitter.execListener(cb, ["hello", "world"]);
            });
            
            it("executes the handleEvent methods of the listeners", function() {
                expect(cb.handleEvent).toHaveBeenCalled();
            });
            
            it("applies the right arguments to the handleEvent methods of the listeners", function() {
                expect(cb.handleEvent).toHaveBeenCalledWith("hello", "world");
            });
        });
        
    });
    
    
    describe(".eventRegex", function() {
        it("returns a RegExp", function() {
            var regex = EventEmitter.eventRegex("scope:*");
            
            expect(regex).toEqual(jasmine.any(RegExp));
        });
        
        it("returns the right RegExp", function() {
            var regex = EventEmitter.eventRegex("scope:*");
            var right = /scope:.*/;
            
            expect(regex.toString()).toEqual(right.toString());
        });
    });
    
    
    describe("#emit", function() {
        beforeEach(function() {
            ee.removeAllListeners();
        });
        
        it("fires simple events", function() {
            var cb = jasmine.createSpy();
            ee.on("event", cb);
            
            expect(cb).not.toHaveBeenCalled();
            ee.emit("event");
            expect(cb.calls.count()).toBe(1);
        });
        
        it("fires wildcard events correctly", function() {
            var cb1 = jasmine.createSpy();
            var cb2 = jasmine.createSpy();
            ee.on("scope:event", cb1);
            ee.on("other-event", cb2);
            
            expect(cb1).not.toHaveBeenCalled();
            ee.emit("scope:*");
            expect(cb1.calls.count()).toBe(1);
            expect(cb2).not.toHaveBeenCalled();
        });
        
        it("matches wildcard listeners correctly", function() {
            var cb1 = jasmine.createSpy();
            var cb2 = jasmine.createSpy();
            ee.on("scope:*", cb1);
            ee.on("scope:other-event", cb2);
            
            expect(cb1).not.toHaveBeenCalled();
            ee.emit("scope:event");
            expect(cb1.calls.count()).toBe(1);
            expect(cb2).not.toHaveBeenCalled();
        });
        
        it("passes all the arguments to the listeners and passes the original event as last one", function() {
            var cb = jasmine.createSpy();
            ee.on("event", cb);
            ee.emit("event", "hello", "world");
            
            expect(cb).toHaveBeenCalledWith("hello", "world", "event");
        });
    });
    
    
    describe("#on", function() {
        beforeEach(function() {
            ee.removeAllListeners();
        });
        
        it("is an alias of #addListener", function() {
            expect(ee.on).toBe(ee.addListener);
        });
        
        it("is an alias of #addEventListener", function() {
            expect(ee.on).toBe(ee.addListener);
        });
        
        it("adds an array to the _events if there isn't one for the current event", function() {
            ee.removeAllListeners("event");
            ee.on("event", function(){/* Stub */});
            
            console.log(ee._events.event instanceof Array);
            console.log(ee._events.event);
            expect(ee._events.event).toEqual(jasmine.any(Array));
        });
        
        it("adds listeners to the _events", function() {
            var cb = function() { /*stub */};
            ee.on("event", cb);
            
            expect(ee._events.event.indexOf(cb)).toBeGreaterThan(-1);
        });
        
        it("adds RegExps to the _regexs", function() {
            ee.on("event", function() {/* Stub */});
            
            expect(ee._regexs.event).toBeDefined();
            expect(ee._regexs.event.toString()).toBe(/event/.toString());
        });
    });
    
    
    describe("#once", function() {
        it("is an alias of #addOnceListener", function() {
            expect(ee.once).toBe(ee.addOnceListener);
        });
        
        it("adds a listener to the _events", function() {
            ee.removeAllListeners();
            ee.once("event", function() {/* Stub */});
            
            expect(ee._events.event.length).toBe(1);
        });
        
        it("executes the listener only once when the event is fired", function() {
            ee.removeAllListeners();
            var cb = jasmine.createSpy();
            ee.once("event", cb);
            
            expect(cb).not.toHaveBeenCalled();
            ee.emit("event");
            ee.emit("event");
            expect(cb.calls.count()).toBe(1);
        });
    });
    
    
    describe("#many", function() {
        it("is an alias of #addManyListener");
        it("adds a listener to the _events");
        it("executes the listener the right amount of times when the event is fired");
    });
    
    
    describe("#off", function() {
        it("is an alias of #removeListener");
        it("is an alias of #removeEventListener");
        it("removes the listener from the _events");
        it("only removes the listener for the specified event");
        it("only removes one instance of the listener when 'all' is false");
        it("removes all instances of the listener when 'all' is true");
        it("takes into account wildcards");
    });
    
    
    describe("#offAll", function() {
        it("is an alias of #removeAllListeners");
        it("removes only the listeners for the specified event");
        it("removes all listeners when no event is specified");
        it("takes into account wildcards");
    });
    
    
    describe("#count", function() {
        it("is an alias of #countListeners");
        it("returns the right amount of listeners");
        it("counts all the listeners when no event is specified");
        it("takes into accoutn wildcards");
    });
    
    
    describe("#listeners", function() {
        it("is an alias of #getListeners");
        it("returns the right listeners");
        it("returns all listeners when no event is specified");
    });
    
    
});