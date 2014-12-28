
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



    describe("Namespace", function() {
        var ee = new EventEmitter();
        var ns = ee.namespace("scope");

        var insertStubEE = function(event, method) {
            var cb = function() {/* Stub */};
            ee[method || "on"](event || "event", cb);
            return cb;
        }

        var insertSpyEE = function(event, method) {
            var cb = jasmine.createSpy();
            ee[method || "on"](event || "event", cb);
            return cb;
        }

        var insertStubNS = function(event, method) {
            var cb = function() {/* Stub */};
            ns[method || "on"](event || "event", cb);
            return cb;
        }

        var insertSpyNS = function(event, method) {
            var cb = jasmine.createSpy();
            ns[method || "on"](event || "event", cb);
            return cb;
        }

        beforeEach(function() {
            ee.removeAllListeners();
        });


        it("has a emitter property", function() {
            expect(ns.emitter).toBeDefined();
            expect(ns.emitter).toBe(ee);
        });

        it("has a scope property", function() {
            expect(ns.scope).toBeDefined();
            expect(ns.scope).toBe("scope");
        });


        describe("#emit", function() {
            it("emits the right event", function() {
                var cb = insertSpyEE("*");
                ns.emit("event");

                expect(cb).toHaveBeenCalledWith("scope:event");
            });

            it("passes the right arguments to the parent emitter", function() {
                var cb = insertSpyEE("*");
                ns.emit("event", "hello", "world");

                expect(cb).toHaveBeenCalledWith("hello", "world", "scope:event");
            });
        });


        describe("#on", function() {
            it("is an alias of #addListener", function() {
                expect(ns.on).toBe(ns.addListener);
            });

            it("is an alias of #addEventListener", function() {
                expect(ns.on).toBe(ns.addEventListener);
            });

            it("adds the listener to the right event", function() {
                var cb = insertStubNS();

                expect(ns.listeners("event")).toContain(cb);
            });
        });


        describe("#once", function() {
            it("is an alias of #addOnceListener", function() {
                expect(ns.once).toBe(ns.addOnceListener);
            });

            it("adds the listener to the right event", function() {
                expect(ns.count("event")).toBe(0);
                insertStubNS();
                expect(ns.count("event")).toBe(1);
            });

            it("executes the listener only once when the event is fired", function() {
                var cb = insertSpyNS("event", "once");
                ns.emit("event");
                ns.emit("event");

                expect(cb.calls.count()).toBe(1);
            });
        });


        describe("#many", function() {
            var insertSpy = function() {
                var cb = jasmine.createSpy();
                ns.many("event", cb, 2);
                return cb;
            }

            it("is an alias of #addManyListener", function() {
                expect(ns.many).toBe(ns.addManyListener);
            });

            it("adds the listener to the right event", function() {
                expect(ns.count("event")).toBe(0);
                var cb = insertSpy();
                expect(ns.count("event")).toBe(1);
            });

            it("executes the listener the right amount of times when the event is fired", function() {
                var cb = insertSpy();
                ns.emit("event");
                ns.emit("event");
                ns.emit("event");

                expect(cb.calls.count()).toBe(2);
            });
        });


        describe("#off", function() {
            it("is an alias of #removeListener", function() {
                expect(ns.off).toBe(ns.removeListener);
            });

            it("is an alias of #removeEventListener", function() {
                expect(ns.off).toBe(ns.removeEventListener);
            });

            it("removes the listener from the right event", function() {
                var cb = function() {/* Stub */};
                ns.on("event", cb);
                ns.on("other-event", cb);
                ns.off("event", cb);

                expect(ns.listeners("event")).not.toContain(cb);
                expect(ns.listeners("other-event")).toContain(cb);
            });
        });


        describe("#count", function() {
            it("is an alias of #countListeners", function() {
                expect(ns.count).toBe(ns.countListeners);
            });

            it("counts the right listeners", function() {
                insertStubEE("event");
                insertStubNS("event");
                insertStubNS("other-event");

                expect(ns.count("event")).toBe(1);
            });
            it("counts all the listeners in the namespace when no event is specified", function() {
                insertStubEE("event");
                insertStubNS("event");
                insertStubNS("other-event");

                expect(ns.count()).toBe(2);
            });
        });


        describe("#listeners", function() {
            it("is an alias of #getListeners", function() {
                expect(ns.listeners).toBe(ns.getListeners);
            });

            it("returns the right listeners", function() {
                var cb1 = insertStubEE("event");
                var cb2 = insertStubNS("event");
                var cb3 = insertStubNS("other-event");

                expect(ns.listeners("event")).not.toContain(cb1);
                expect(ns.listeners("event")).toContain(cb2);
                expect(ns.listeners("event")).not.toContain(cb3);
            });

            it("returns all the listeners in the namespace when no event is specified", function() {
                var cb1 = insertStubEE();
                var cb2 = insertStubNS();
                var cb3 = insertStubNS("other-event");

                expect(ns.listeners()).not.toContain(cb1);
                expect(ns.listeners()).toContain(cb2);
                expect(ns.listeners()).toContain(cb3);
            });
        });


        describe("#namespace", function() {
            it("returns a namespace with the right scope", function() {
                var child = ns.namespace("child-scope");

                expect(child.scope).toBe("scope:child-scope");
            });

            it("return s a namespace with the same emitter as its parent", function() {
                var child = ns.namespace("child-scope");

                expect(child.emitter).toBe(ee);
            });
        });

    });
    
    
    
    
    
}));