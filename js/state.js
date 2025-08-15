// Minimal localStorage-backed state helpers
// getState(key, fallback), setState(key, value), updateState(key, updaterFn)
(function(){
    class StateManager {
        constructor() {
            this.cache = new Map();
            this.initializeDefaults();
        }
        initializeDefaults() {
            if (!this.get('settings')) {
                this.set('settings', {
                    notifications: { taskAdded: true, taskOverdue: true, dailySummary: true },
                    integrations: {
                        gmail: { email: '' },
                        webhooks: {
                            inboundUrl: '',
                            referencePayload: {},
                            mappings: [],
                            outboundUrls: [],
                            triggers: {
                                taskCompleted: true,
                                taskInProgress: false,
                                taskOverdue: true,
                                jobInProgress: false,
                                jobNeedsAssistance: true
                            }
                        }
                    }
                });
            }
        }
        key(k){ return `goh_${k}`; }
        get(key, fallback=null){
            if (this.cache.has(key)) return this.cache.get(key);
            try {
                const raw = localStorage.getItem(this.key(key));
                if (!raw) return fallback;
                const val = JSON.parse(raw);
                this.cache.set(key, val);
                return val;
            } catch(e){ console.warn('[state] read failed', key, e); return fallback; }
        }
        set(key, value){
            try {
                localStorage.setItem(this.key(key), JSON.stringify(value));
                this.cache.set(key, value);
                return true;
            } catch(e){ console.error('[state] write failed', key, e); return false; }
        }
        update(key, updater){
            const curr = this.get(key, undefined);
            const next = typeof updater === 'function' ? updater(curr) : updater;
            return this.set(key, next);
        }
        clear(key){ try { localStorage.removeItem(this.key(key)); this.cache.delete(key); } catch(e){} }
    }
    const sm = new StateManager();
    window.getState = (k,f) => sm.get(k,f);
    window.setState = (k,v) => sm.set(k,v);
    window.updateState = (k,u) => sm.update(k,u);
})();


