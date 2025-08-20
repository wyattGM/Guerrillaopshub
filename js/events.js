// Pulse Events - Enhanced event handling for the modern Pulse interface
(function() {
    'use strict';

    // Pulse-specific utilities
    const PulseUtils = {
        // Create animated pulse effect
        createPulseEffect(element, color = '#3DE8D3') {
            const pulse = document.createElement('div');
            pulse.className = 'absolute inset-0 rounded-full opacity-0';
            pulse.style.background = color;
            pulse.style.animation = 'pulse-ring 1s ease-out';
            element.style.position = 'relative';
            element.appendChild(pulse);
            
            setTimeout(() => pulse.remove(), 1000);
        },
        
        // Show success notification with Pulse styling
        showSuccess(message, duration = 3000) {
            this.showNotification(message, 'success', duration);
        },
        
        // Show error notification with Pulse styling
        showError(message, duration = 5000) {
            this.showNotification(message, 'error', duration);
        },
        
        // Show notification with Pulse styling
        showNotification(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 z-50 p-4 rounded-xl border transition-all duration-300 transform translate-x-full`;
            
            const colors = {
                success: 'bg-pulse-success text-pulse-bg border-pulse-success',
                error: 'bg-pulse-danger text-pulse-bg border-pulse-danger',
                warning: 'bg-pulse-warning text-pulse-bg border-pulse-warning',
                info: 'bg-pulse-primary text-pulse-bg border-pulse-primary'
            };
            
            notification.className += ` ${colors[type] || colors.info}`;
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Auto remove
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },
        
        // Animate element entrance
        animateIn(element, delay = 0) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        },
        
        // Create glassmorphism effect
        applyGlassmorphism(element) {
            element.classList.add('glassmorphism');
            if (window.pulse && window.pulse.getTheme() === 'light') {
                element.classList.add('glassmorphism-light');
            }
        }
    };

    // Enhanced navigation handling
    class PulseNavigation {
        constructor() {
            this.currentSection = null;
            this.initializeNavigation();
        }
        
        initializeNavigation() {
            // Navigation dropdowns
            document.querySelectorAll('.nav-dropdown-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const dropdown = button.closest('.nav-dropdown');
                    const menu = dropdown.querySelector('.nav-dropdown-menu');
                    const icon = button.querySelector('svg:last-child');
                    
                    // Toggle dropdown
                    if (menu.classList.contains('hidden')) {
                        menu.classList.remove('hidden');
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        menu.classList.add('hidden');
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
            });
            
            // Sub-navigation buttons
            document.querySelectorAll('.nav-sub-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const section = button.dataset.section;
                    this.navigateToSection(section);
                });
            });
            
            // Main navigation buttons
            document.querySelectorAll('.main-nav-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const section = button.dataset.section;
                    this.navigateToSection(section);
                });
            });
        }
        
        navigateToSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show target section
            const targetSection = document.getElementById(sectionName + 'SectionContent');
            if (targetSection) {
                targetSection.classList.remove('hidden');
                this.currentSection = sectionName;
                
                // Animate section entrance
                PulseUtils.animateIn(targetSection);
                
                // Update navigation states
                this.updateNavigationStates(sectionName);
                
                // Load section data
                this.loadSectionData(sectionName);
            }
        }
        
        updateNavigationStates(activeSection) {
            // Update main nav buttons
            document.querySelectorAll('.main-nav-button').forEach(button => {
                button.classList.remove('bg-pulse-primary', 'text-pulse-bg');
                button.classList.add('text-pulse-textSecondary');
            });
            
            // Update sub nav buttons
            document.querySelectorAll('.nav-sub-button').forEach(button => {
                button.classList.remove('bg-pulse-primary', 'text-pulse-bg');
                button.classList.add('text-pulse-textSecondary');
            });
            
            // Find and highlight active button
            const activeButton = document.querySelector(`[data-section="${activeSection}"]`);
            if (activeButton) {
                activeButton.classList.remove('text-pulse-textSecondary');
                activeButton.classList.add('bg-pulse-primary', 'text-pulse-bg');
            }
        }
        
        loadSectionData(sectionName) {
            // Load data based on section
            switch(sectionName) {
                case 'team-inhouse':
                case 'team-contractors':
                    this.loadTeamData(sectionName);
                    break;
                case 'sg-clients':
                case 'gm-clients':
                    this.loadClientData(sectionName);
                    break;
                case 'training':
                    this.loadTrainingData();
                    break;
                case 'my-agenda':
                    this.loadAgendaData();
                    break;
                case 'settings':
                    this.loadSettingsData();
                    break;
            }
        }
        
        loadTeamData(teamType) {
            // Simulate loading team data
            const container = document.getElementById('teamContainer');
            if (!container) return;
            
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pulse-primary mb-4"></div>
                    <p class="text-pulse-textSecondary">Loading ${teamType === 'team-inhouse' ? 'in-house' : 'contractor'} team...</p>
                </div>
            `;
            
            // Simulate API call delay
            setTimeout(() => {
                this.renderTeamMembers(teamType);
            }, 1000);
        }
        
        renderTeamMembers(teamType) {
            const container = document.getElementById('teamContainer');
            if (!container) return;
            
            // Sample team data - in real app this would come from API
            const teamData = [
                {
                    name: 'Alex Chen',
                    role: 'Senior Developer',
                    email: 'alex@company.com',
                    type: teamType === 'team-inhouse' ? 'inhouse' : 'contractor',
                    status: 'active'
                },
                {
                    name: 'Sarah Kim',
                    role: 'Product Manager',
                    email: 'sarah@company.com',
                    type: teamType === 'team-inhouse' ? 'inhouse' : 'contractor',
                    status: 'active'
                }
            ];
            
            container.innerHTML = teamData.map(member => `
                <div class="bg-pulse-surface border border-pulse-border rounded-2xl p-6 hover:border-pulse-primary transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-pulse-primary to-pulse-highlight rounded-full flex items-center justify-center text-pulse-bg font-bold text-lg mr-4">
                            ${member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-pulse-text">${member.name}</h3>
                            <p class="text-pulse-primary font-medium">${member.role}</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <p class="text-pulse-textSecondary text-sm">${member.email}</p>
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-pulse-success rounded-full mr-2"></div>
                            <span class="text-pulse-textSecondary text-sm capitalize">${member.status}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        loadClientData(clientType) {
            // Similar implementation for client data
            console.log(`Loading ${clientType} data...`);
        }
        
        loadTrainingData() {
            console.log('Loading training data...');
        }
        
        loadAgendaData() {
            console.log('Loading agenda data...');
        }
        
        loadSettingsData() {
            console.log('Loading settings data...');
        }
    }

    // Enhanced form handling
    class PulseForms {
        constructor() {
            this.initializeForms();
        }
        
        initializeForms() {
            // Login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }
            
            // Team member form
            const teamForm = document.getElementById('memberEditForm');
            if (teamForm) {
                teamForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleTeamMemberSubmit();
                });
            }
        }
        
        handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (!email || !password) {
                PulseUtils.showError('Please fill in all fields');
                return;
            }
            
            // Simulate login process
            PulseUtils.showSuccess('Authenticating...');
            
            setTimeout(() => {
                // Hide login screen
                document.getElementById('loginScreen').classList.add('hidden');
                document.getElementById('mainApp').classList.remove('hidden');
                
                // Show success message
                PulseUtils.showSuccess('Welcome to Pulse! 🚀');
                
                // Initialize navigation
                new PulseNavigation();
                
                // Update pulse stats
                if (window.pulse) {
                    window.pulse.updateStats({ activeUsers: 1 });
                }
            }, 1500);
        }
        
        handleTeamMemberSubmit() {
            // Handle team member form submission
            PulseUtils.showSuccess('Team member saved successfully!');
        }
    }

    // Initialize Pulse interface
    function initializePulse() {
        // Initialize theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.pulse) {
                    const newTheme = window.pulse.toggleTheme();
                    PulseUtils.showSuccess(`Switched to ${newTheme} mode`);
                }
            });
        }
        
        // Initialize forms
        new PulseForms();
        
        // Initialize navigation if already logged in
        if (document.getElementById('mainApp') && !document.getElementById('mainApp').classList.contains('hidden')) {
            new PulseNavigation();
        }
        
        // Add pulse effects to interactive elements
        document.querySelectorAll('button, .nav-dropdown-button, .main-nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                PulseUtils.createPulseEffect(e.currentTarget);
            });
        });
        
        // Initialize glassmorphism effects
        document.querySelectorAll('.glassmorphism').forEach(element => {
            PulseUtils.applyGlassmorphism(element);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePulse);
    } else {
        initializePulse();
    }

    // Export Pulse utilities globally
    window.PulseUtils = PulseUtils;
})();





