describe("Namespace", function() {
    
    it("has a emitter property");
    it("has a scope property");
    it("has a execListener() method");
    it("has a eventRegex() method");
    
    
    describe("#emit", function() {
        it("emits the right event");
        it("passes the right arguments to the parent emitter");
    });
    
    
    describe("#on", function() {
        it("is an alias of #addListener");
        it("is an alias of #addEventListener");
        it("adds the listener to the right event");
    });
    
    
    describe("#once", function() {
        it("is an alias of #addOnceListener");
        it("adds the listener to the right event");
        it("executes the listener onmy once when the event is fired");
    });
    
    
    describe("#many", function() {
        it("is an alias of #addManyListener");
        it("adds the listener to the right event");
        it("executes the listener the right amount of times when the event is fired");
    });
    
    
    describe("#off", function() {
        it("is an alias of #removeListener");
        it("is an alias of #removeEventListener");
        it("removes the listener from the right event");
    });
    
    
    describe("#count", function() {
        it("is an alias of #countListeners");
        it("counts the right listeners");
        it("counts all the listeners in the namespace when no event is specified");
    });
    
    
    describe("#listener", function() {
        it("is an alias of #getListeners");
        it("returns the right listeners");
        it("returns all the listeners in the namespace when no event is specified");
    });
    
    
    describe("#namespace", function() {
        it("returns a namespace with the right scope");
        it("return s a namespace with the same emitter as its parent");
    });
    
});