// Simple Event Bus for decoupled UI interactions
// on(event, handler), off(event, handler), emit(event, payload)
(function(){
    class EventBus {
        constructor() {
            this.events = {};
        }
        on(event, handler) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(handler);
        }
        off(event, handler) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(h => h !== handler);
        }
        emit(event, payload) {
            if (!this.events[event]) return;
            this.events[event].forEach(handler => {
                try { handler(payload); } catch (err) { console.error(`[events] handler error for ${event}:`, err); }
            });
        }
        once(event, handler) {
            const onceHandler = (p) => { handler(p); this.off(event, onceHandler); };
            this.on(event, onceHandler);
        }
    }
    window.eventBus = new EventBus();
    window.on = (e,h) => window.eventBus.on(e,h);
    window.off = (e,h) => window.eventBus.off(e,h);
    window.emit = (e,p) => window.eventBus.emit(e,p);
})();


