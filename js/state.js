// Pulse State Manager - Enhanced localStorage-backed state helpers
// getState(key, fallback), setState(key, value), updateState(key, updaterFn)
(function(){
    class PulseStateManager {
        constructor() {
            this.cache = new Map();
            this.initializeDefaults();
            this.initializeTheme();
        }
        
        initializeDefaults() {
            if (!this.get('settings')) {
                this.set('settings', {
                    theme: 'dark', // 'dark' or 'light'
                    notifications: { 
                        taskAdded: true, 
                        taskOverdue: true, 
                        dailySummary: true,
                        webhookFired: true,
                        systemAlert: true
                    },
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
                    },
                    ui: {
                        sidebarCollapsed: false,
                        animationsEnabled: true,
                        glassmorphismEnabled: true
                    }
                });
            }
            
            if (!this.get('pulseStats')) {
                this.set('pulseStats', {
                    lastSync: new Date().toISOString(),
                    webhooksFired: 0,
                    tasksCompleted: 0,
                    systemHealth: 'excellent',
                    activeUsers: 0
                });
            }
        }
        
        initializeTheme() {
            const savedTheme = this.get('settings')?.theme || 'dark';
            this.applyTheme(savedTheme);
        }
        
        applyTheme(theme) {
            const body = document.getElementById('body');
            const themeIcon = document.getElementById('themeIcon');
            
            if (!body || !themeIcon) return;
            
            if (theme === 'light') {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                body.style.setProperty('--bg-color', '#FAFAFA');
                body.style.setProperty('--surface-color', '#FFFFFF');
                body.style.setProperty('--text-color', '#1A1A1A');
                themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                body.style.setProperty('--bg-color', '#121212');
                body.style.setProperty('--surface-color', '#1A1A1A');
                body.style.setProperty('--text-color', '#FFFFFF');
                themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
            }
            
            // Update CSS custom properties for theme-aware components
            document.documentElement.style.setProperty('--current-bg', getComputedStyle(body).getPropertyValue('--bg-color'));
            document.documentElement.style.setProperty('--current-surface', getComputedStyle(body).getPropertyValue('--surface-color'));
            document.documentElement.style.setProperty('--current-text', getComputedStyle(body).getPropertyValue('--text-color'));
        }
        
        toggleTheme() {
            const currentTheme = this.get('settings')?.theme || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            this.update('settings', (settings) => ({
                ...settings,
                theme: newTheme
            }));
            
            this.applyTheme(newTheme);
            return newTheme;
        }
        
        updatePulseStats(updates) {
            this.update('pulseStats', (stats) => ({
                ...stats,
                ...updates,
                lastSync: new Date().toISOString()
            }));
        }
        
        key(k){ return `pulse_${k}`; }
        
        get(key, fallback=null){
            if (this.cache.has(key)) return this.cache.get(key);
            try {
                const raw = localStorage.getItem(this.key(key));
                if (!raw) return fallback;
                const val = JSON.parse(raw);
                this.cache.set(key, val);
                return val;
            } catch(e){ console.warn('[pulse-state] read failed', key, e); return fallback; }
        }
        
        set(key, value){
            try {
                localStorage.setItem(this.key(key), JSON.stringify(value));
                this.cache.set(key, value);
                return true;
            } catch(e){ console.error('[pulse-state] write failed', key, e); return false; }
        }
        
        update(key, updater){
            const curr = this.get(key, undefined);
            const next = typeof updater === 'function' ? updater(curr) : updater;
            return this.set(key, next);
        }
        
        clear(key){ 
            try { 
                localStorage.removeItem(this.key(key)); 
                this.cache.delete(key); 
            } catch(e){} 
        }
        
        // Pulse-specific methods
        getTheme() {
            return this.get('settings')?.theme || 'dark';
        }
        
        getPulseStats() {
            return this.get('pulseStats', {});
        }
        
        recordWebhookFire() {
            const stats = this.get('pulseStats', {});
            this.updatePulseStats({
                webhooksFired: (stats.webhooksFired || 0) + 1
            });
        }
        
        recordTaskCompletion() {
            const stats = this.get('pulseStats', {});
            this.updatePulseStats({
                tasksCompleted: (stats.tasksCompleted || 0) + 1
            });
        }
    }
    
    const psm = new PulseStateManager();
    
    // Global Pulse API
    window.getState = (k,f) => psm.get(k,f);
    window.setState = (k,v) => psm.set(k,v);
    window.updateState = (k,u) => psm.update(k,u);
    window.clearState = (k) => psm.clear(k);
    
    // Pulse-specific API
    window.pulse = {
        getTheme: () => psm.getTheme(),
        toggleTheme: () => psm.toggleTheme(),
        getStats: () => psm.getPulseStats(),
        recordWebhook: () => psm.recordWebhookFire(),
        recordTaskComplete: () => psm.recordTaskCompletion(),
        updateStats: (updates) => psm.updatePulseStats(updates)
    };
    
    // Auto-initialize theme on page load
    document.addEventListener('DOMContentLoaded', () => {
        psm.initializeTheme();
    });
})();





