describe("EventEmitter", function() {
    var ee = new EventEmitter();
    
    it("has a _events property", function() {
        expect(ee._events).toBeDefined();
        expect(ee._events).toEqual({});
    });

    it("has a _regexs property", function() {
        expect(ee._regexs).toBeDefined();
        expect(ee._regexs).toEqual({});
    });
    
    
    describe("#execListener", function() {
        
        describe("with functions", function() {
            var cb;
            
            beforeEach(function() {
                cb = jasmine.createSpy();
                ee.execListener(cb, ["hello", "world"]);
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
                ee.execListener(cb, ["hello", "world"]);
            });
            
            it("executes the handleEvent methods of the listeners", function() {
                expect(cb.handleEvent).toHaveBeenCalled();
            });
            
            it("applies the right arguments to the handleEvent methods of the listeners", function() {
                expect(cb.handleEvent).toHaveBeenCalledWith("hello", "world");
            });
        });
        
    });
    
    
    describe("#eventRegex", function() {
        it("returns a RegExp", function() {
            var regex = ee.eventRegex("scope:*");
            
            expect(regex).toEqual(jasmine.any(RegExp));
        });
        
        it("returns the right RegExp", function() {
            var regex = ee.eventRegex("scope:*");
            var right = /scope:.*/;
            
            expect(regex.toString()).toEqual(right.toString());
        });
    });
    
    
    describe("#emit", function() {
        it("fires simple events");
        it("fires wildcard events");
        it("passes all the arguments to the listeners and passes the original event as last one");
    });
    
    
    describe("#on", function() {
        it("is an alias of #addListener");
        it("is an alias of #addEventListener");
        it("adds an array to the _events if there isn't one for the current event");
        it("adds listeners to the _events");
        it("adds RegExps to the _regexs");
    });
    
    
    describe("#once", function() {
        it("is an alias of #addOnceListener");
        it("adds a listener to the _events");
        it("executes the listener only once when the event is fired");
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