
(function (test) {
    "use strict";


    if(typeof require === "function") {
        var EventEmitter = require("../../EventEmitter");
    }
    else {
        var EventEmitter = window.EventEmitter;
    }
    
    test(EventEmitter);


}(function(EventEmitter) {
    "use strict";




    describe("EventEmitter", function() {
        var ee = new EventEmitter();

        var insertSpy = function(event, method) {
            var cb = jasmine.createSpy();
            ee[method || "on"](event || "event", cb);
            return cb;
        }

        var insertStub = function(event, method) {
            var cb = function() {/* Stub */};
            ee[method || "on"](event || "event", cb);
            return cb;
        }

        beforeEach(function() {
            ee.offAll();
        });



        it("has a #_events property", function() {
            expect(ee._events).toBeDefined();
            expect(ee._events).toEqual({});
        });

        it("has a .regexs property", function() {
            expect(EventEmitter.regexs).toBeDefined();
            expect(EventEmitter.regexs).toEqual({});
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
                var right = /^scope:.*$/;

                expect(regex.toString()).toEqual(right.toString());
            });
        });


        describe("#emit", function() {
            it("is an alias of #fire", function() {
                expect(ee.emit).toBe(ee.fire);
            });

            it("is an alias of #trigger", function() {
                expect(ee.emit).toBe(ee.trigger);
            });

            it("fires simple events", function() {
                var cb = insertSpy();

                expect(cb).not.toHaveBeenCalled();
                ee.emit("event");
                expect(cb.calls.count()).toBe(1);
            });

            it("fires wildcard events correctly", function() {
                var cb1 = insertSpy("scope:event");
                var cb2 = insertSpy("other-event");

                expect(cb1).not.toHaveBeenCalled();
                ee.emit("scope:*");
                expect(cb1.calls.count()).toBe(1);
                expect(cb2).not.toHaveBeenCalled();
            });

            it("matches wildcard listeners correctly", function() {
                var cb1 = insertSpy("scope:*");
                var cb2 = insertSpy("scope:other-event");

                expect(cb1).not.toHaveBeenCalled();
                ee.emit("scope:event");
                expect(cb1.calls.count()).toBe(1);
                expect(cb2).not.toHaveBeenCalled();
            });

            it("passes all the arguments to the listeners and passes the original event as last one", function() {
                var cb = insertSpy("event");
                ee.emit("event", "hello", "world");

                expect(cb).toHaveBeenCalledWith("hello", "world", "event");
            });
        });


        describe("#on", function() {
            it("is an alias of #addListener", function() {
                expect(ee.on).toBe(ee.addListener);
            });

            it("is an alias of #addEventListener", function() {
                expect(ee.on).toBe(ee.addListener);
            });

            it("adds an array to the _events if there isn't one for the current event", function() {
                insertStub();

                expect(ee._events.event).toEqual(jasmine.any(Array));
            });

            it("adds listeners to the _events", function() {
                var cb = insertStub();

                expect(ee._events.event.indexOf(cb)).toBeGreaterThan(-1);
            });

            it("adds RegExps to the _regexs", function() {
                insertStub();

                expect(ee._regexs.event).toBeDefined();
                expect(ee._regexs.event.toString()).toBe(/^event$/.toString());
            });
        });


        describe("#once", function() {
            it("is an alias of #addOnceListener", function() {
                expect(ee.once).toBe(ee.addOnceListener);
            });

            it("adds a listener to the _events", function() {
                insertStub("event", "once");

                expect(ee.count("event")).toBe(1);
            });

            it("executes the listener only once when the event is fired", function() {
                var cb = insertSpy("event", "once");

                expect(cb).not.toHaveBeenCalled();
                ee.emit("event");
                ee.emit("event");
                expect(cb.calls.count()).toBe(1);
            });
        });


        describe("#many", function() {
            var insertSpy = function(event, amount) {
                var cb = jasmine.createSpy();
                ee.many(event || "event", cb, amount);
                return cb;
            }

            it("is an alias of #addManyListener", function() {
                expect(ee.many).toBe(ee.addManyListener);
            });

            it("adds a listener to the _events", function() {
                var cb = insertSpy("event", 2);

                expect(ee.count("event")).toBe(1);
            });

            it("removes the listener after having been called the right amount of times", function() {
                var cb = insertSpy("event", 2);

                expect(ee.count("event")).toBe(1);
                ee.emit("event");
                ee.emit("event");
                expect(ee.count("event")).toBe(0);
            })

            it("executes the listener the right amount of times when the event is fired", function() {
                var cb = insertSpy("event", 2);

                expect(cb).not.toHaveBeenCalled();
                ee.emit("event");
                ee.emit("event");
                ee.emit("event");
                expect(cb.calls.count()).toBe(2);
            });
        });


        describe("#off", function() {
            it("is an alias of #removeListener", function() {
                expect(ee.off).toBe(ee.removeListener);
            });

            it("is an alias of #removeEventListener", function() {
                expect(ee.off).toBe(ee.removeEventListener);
            });

            it("removes the listener from the _events", function() {
                var cb = insertStub();

                expect(ee.count("event")).toBe(1);
                ee.off("event", cb);
                expect(ee.count("event")).toBe(0);
            });

            it("only removes the listener for the specified event", function() {
                var cb = function() {/* Stub */};
                ee.on("event", cb);
                ee.on("other-event", cb);

                expect(ee.count("event")).toBe(1);
                expect(ee.count("other-event")).toBe(1);
                ee.off("event", cb);
                expect(ee.count("event")).toBe(0);
                expect(ee.count("other-event")).toBe(1);
            });

            it("only removes one instance of the listener when 'all' is false (without wildcards)", function() {
                var cb = function() {/* Stub */};
                ee.on("event", cb);
                ee.on("event", cb);

                expect(ee.count("event")).toBe(2);
                ee.off("event", cb);
                expect(ee.count("event")).toBe(1);
            });

            it("only removes one instance of the listener when 'all' is false (with wildcards)", function() {
                var cb = function() {/* Stub */};
                ee.on("scope:event", cb);
                ee.on("scope:other-event", cb);

                expect(ee.count("scope:*")).toBe(2);
                ee.off("scope:*", cb);
                expect(ee.count("scope:*")).toBe(1);
            });

            it("removes all instances of the listener when 'all' is true (without wildcards)", function() {
                var cb = function() {/* Stub */};
                ee.on("event", cb);
                ee.on("event", cb);

                expect(ee.count("event")).toBe(2);
                ee.off("event", cb, true);
                expect(ee.count("event")).toBe(0);
            });

            it("removes all instances of the listener when 'all' is true (with wildcards)", function() {
                var cb = function() {/* Stub */};
                ee.on("scope:event", cb);
                ee.on("scope:other-event", cb);

                expect(ee.count("scope:*")).toBe(2);
                ee.off("scope:*", cb, true);
                expect(ee.count("scope:*")).toBe(0);
            });

            it("does not remove listeners whose (wildcard) events match the event (as opposed to #on, #count, #listeners)", function() {
                var cb = insertStub("scope:*");

                expect(ee.count("scope:*")).toBe(1);
                ee.off("scope:event", cb);
                expect(ee.count("scope:*")).toBe(1);
            });
        });


        describe("#offAll", function() {
            it("is an alias of #removeAllListeners", function() {
                expect(ee.offAll).toBe(ee.removeAllListeners);
            });

            it("removes only the listeners for the specified event", function() {
                insertStub("event");
                insertStub("event");
                insertStub("other-event");

                expect(ee.count("event")).toBe(2);
                expect(ee.count("other-event")).toBe(1);
                ee.offAll("event");
                expect(ee.count("event")).toBe(0);
                expect(ee.count("other-event")).toBe(1);
            });

            it("removes all listeners when no event is specified", function() {
                insertStub("event");
                insertStub("event");
                insertStub("other-event");
                insertStub("other-event");

                expect(ee.count()).toBe(4);
                ee.offAll();
                expect(ee.count()).toBe(0);
            });

            it("removes listeners that match a wildcard", function() {
                insertStub("scope:event");
                insertStub("scope:other-event");

                expect(ee.count("scope:event")).toBe(1);
                expect(ee.count("scope:other-event")).toBe(1);
                ee.offAll("scope:*");
                expect(ee.count("scope:event")).toBe(0);
                expect(ee.count("scope:other-event")).toBe(0);
            });

            it("does not remove listeners whose (wildcard) events match the event", function() {
                insertStub("scope:*");
                insertStub("scope:other-*");

                expect(ee.count("scope:*")).toBe(2);
                ee.offAll("scope:other-event");
                expect(ee.count("scope*")).toBe(2);
            });
        });


        describe("#count", function() {
            it("is an alias of #countListeners", function() {
                expect(ee.count).toBe(ee.countListeners);
            });

            it("returns the right amount of listeners", function() {
                expect(ee.count("event")).toBe(0);
                insertStub("event");
                insertStub("event");
                insertStub("other-event");
                expect(ee.count("event")).toBe(2);
            });

            it("counts all the listeners when no event is specified", function() {
                expect(ee.count()).toBe(0);
                insertStub("event");
                insertStub("other-event");
                expect(ee.count()).toBe(2);
            });

            it("counts listeners that match a wildcard", function() {
                insertStub("scope:event");
                insertStub("other-event");

                expect(ee.count("scope:*")).toBe(1);
            });

            it("counts listeners whose (wildcard) events match the event", function() {
                insertStub("scope:*");
                insertStub("scope:other-*");
                insertStub("event");

                expect(ee.count("scope:other-event")).toBe(2);
            });
        });


        describe("#listeners", function() {
            it("is an alias of #getListeners", function() {
                expect(ee.listeners).toBe(ee.getListeners);
            });

            it("returns the right listeners", function() {
                var cb1 = insertStub("event");
                var cb2 = insertStub("other-event");

                expect(ee.listeners("event")).toContain(cb1);
                expect(ee.listeners("event")).not.toContain(cb2);
            });

            it("returns all listeners when no event is specified", function() {
                insertStub("event");
                insertStub("other-event");

                expect(ee.listeners().length).toBe(2);
            });

            it("returns listeners that match a wildcard", function() {
                var cb1 = insertStub("scope:event");
                var cb2 = insertStub("scope:other-event");
                var cb3 = insertStub("event");

                expect(ee.listeners("scope:*")).toContain(cb1);
                expect(ee.listeners("scope:*")).toContain(cb2);
                expect(ee.listeners("scope:*")).not.toContain(cb3);
            });

            it("returns listeners whose (wildcard) events match the event", function() {
                var cb1 = insertStub("scope:*");
                var cb2 = insertStub("scope:other-*");
                var cb3 = insertStub("event");

                expect(ee.listeners("scope:other-event")).toContain(cb1);
                expect(ee.listeners("scope:other-event")).toContain(cb2);
                expect(ee.listeners("scope:other-event")).not.toContain(cb3);
            });
        });


    });
    
    
    
    
    
    
}));