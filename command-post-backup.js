// Guerrilla Command Post - Multi-Section App
class GuerrillaCommandPost {
    constructor() {
        this.currentSection = 'team';
        this.currentTeamTab = 'inhouse';
        this.currentClientTab = 'current';
        this.currentTrainingCategory = 'all';
        this.teamSearchTerm = '';
        this.trainingSearchTerm = '';
        this.gmClientsSearchTerm = '';
        this.sgClientsSearchTerm = '';
        this.myAccountsSearchTerm = '';
        this.myTasksSearchTerm = '';
        this.myTasksPriorityFilter = '';
        this.myJobsSearchTerm = '';
        this.isLoggedIn = false;
        this.currentUser = null;
        this.editingMember = null;
        
        // New data structures for enhanced functionality
        this.tasksData = {};
        this.dailyPrioritiesData = {};
        this.contactsData = {};
        this.digitalAssetsData = {};
        this.credentialsData = {};
        this.notesData = {};
        this.meetingTranscriptionsData = {};
        this.clientServicesData = {};
        this.budgetAllocationsData = {};
        this.keyValueIndexData = {};
        this.taskTemplatesData = {};
        this.jobTemplatesData = {};
        this.currentClientDetail = null;
        this.currentUser = { id: 'user_1', name: 'Admin User' };
        
        // Add state management methods
        this.getState = (key, fallback) => {
            if (window.getState) {
                return window.getState(key, fallback);
            }
            return fallback;
        };
        this.setState = (key, value) => {
            if (window.setState) {
                return window.setState(key, value);
            }
            return false;
        };
        this.updateState = (key, updater) => {
            if (window.updateState) {
                return window.updateState(key, updater);
            }
            return false;
        };
        
        // Add toast notification method
        this.showToast = (message, type = 'info') => {
            console.log(`[${type.toUpperCase()}] ${message}`);
            // For now, just log to console. Toast UI can be added later
        };
        
        this.teamData = null;
        this.clientsData = null;
        this.trainingData = null;
        this.jobsData = null;
        
        this.init();
    }

    async init() {
        console.log('Initializing GuerrillaCommandPost...');
        this.setupLoginListeners();
        this.checkAuthStatus();
        
        if (this.isLoggedIn) {
            console.log('User is logged in, loading data...');
            await this.loadAllData();
            this.setupEventListeners();
            this.showSection('team');
            this.switchTeamTab('inhouse');
            this.renderTeamMembers();
            this.renderClients('gm');
            this.renderClients('sg');
            this.renderTrainingMaterials();
            this.hideLoadingState();
        }
    }

    async loadAllData() {
        // Check for saved data first
        if (this.loadSavedTeamData()) {
            console.log('Loading saved team data from localStorage...');
        } else {
            try {
                // Try to load from external file first, fall back to embedded data
                const response = await fetch('./team-data.json');
                if (response.ok) {
                    this.teamData = await response.json();
                } else {
                    throw new Error('External file not found');
                }
            } catch (error) {
                console.log('Using embedded data...');
                this.teamData = this.getTeamFallbackData();
            }
        }
        
        // Load clients, training, and jobs data (embedded for now)
        this.clientsData = this.getClientsData();
        this.trainingData = this.getTrainingData();
        this.jobsData = this.getJobsData();
        
        // Load new enhanced data structures
        this.tasksData = this.getTasksData();
        this.dailyPrioritiesData = this.getDailyPrioritiesData();
        this.contactsData = this.getContactsData();
        this.digitalAssetsData = this.getDigitalAssetsData();
        this.credentialsData = this.getCredentialsData();
        this.notesData = this.getNotesData();
        this.meetingTranscriptionsData = this.getMeetingTranscriptionsData();
        this.clientServicesData = this.getClientServicesData();
        this.budgetAllocationsData = this.getBudgetAllocationsData();
        this.keyValueIndexData = this.getKeyValueIndexData();
        this.taskTemplatesData = this.getTaskTemplatesData();
        this.jobTemplatesData = this.getJobTemplatesData();
        
        // Load from localStorage if available
        this.loadEnhancedDataFromStorage();
    }

    loadEnhancedDataFromStorage() {
        // Load enhanced data from localStorage if available, otherwise keep sample data
        const savedTasks = localStorage.getItem('tasksData');
        if (savedTasks && JSON.parse(savedTasks).gm?.length > 0) {
            this.tasksData = JSON.parse(savedTasks);
        }
        
        const savedDailyPriorities = localStorage.getItem('dailyPrioritiesData');
        if (savedDailyPriorities && Object.keys(JSON.parse(savedDailyPriorities)).length > 0) {
            this.dailyPrioritiesData = JSON.parse(savedDailyPriorities);
        }
        
        const savedContacts = localStorage.getItem('contactsData');
        if (savedContacts && JSON.parse(savedContacts).gm?.length > 0) {
            this.contactsData = JSON.parse(savedContacts);
        }
        
        const savedDigitalAssets = localStorage.getItem('digitalAssetsData');
        if (savedDigitalAssets && Object.keys(JSON.parse(savedDigitalAssets)).length > 0) {
            this.digitalAssetsData = JSON.parse(savedDigitalAssets);
        }
        
        const savedCredentials = localStorage.getItem('credentialsData');
        if (savedCredentials && JSON.parse(savedCredentials).gm?.length > 0) {
            this.credentialsData = JSON.parse(savedCredentials);
        }
        
        const savedNotes = localStorage.getItem('notesData');
        if (savedNotes && JSON.parse(savedNotes).gm?.length > 0) {
            this.notesData = JSON.parse(savedNotes);
        }
        
        const savedMeetingTranscriptions = localStorage.getItem('meetingTranscriptionsData');
        if (savedMeetingTranscriptions && JSON.parse(savedMeetingTranscriptions).gm?.length > 0) {
            this.meetingTranscriptionsData = JSON.parse(savedMeetingTranscriptions);
        }
        
        const savedClientServices = localStorage.getItem('clientServicesData');
        if (savedClientServices && Object.keys(JSON.parse(savedClientServices)).length > 0) {
            this.clientServicesData = JSON.parse(savedClientServices);
        }
        
        const savedBudgetAllocations = localStorage.getItem('budgetAllocationsData');
        if (savedBudgetAllocations && JSON.parse(savedBudgetAllocations).gm?.length > 0) {
            this.budgetAllocationsData = JSON.parse(savedBudgetAllocations);
        }
        
        const savedKeyValueIndex = localStorage.getItem('keyValueIndexData');
        if (savedKeyValueIndex && JSON.parse(savedKeyValueIndex).gm?.length > 0) {
            this.keyValueIndexData = JSON.parse(savedKeyValueIndex);
        }
    }

    setupEventListeners() {
        // Setup edit listeners first
        this.setupEditListeners();
        this.setupClientEditListeners();
        this.setupTrainingEditListeners();
        this.setupEnhancedEventListeners();
        this.setupAgendaTabListeners();
        // Re-enable Settings now that functions are fixed
        this.setupSettingsEventListeners();
        this.setupSettingsFormListeners();
        this.setupModalCloseHandlers();
        
        // Main navigation buttons (non-dropdown)
        document.querySelectorAll('.main-nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const section = e.target.closest('button').dataset.section;
                this.showSection(section);
            });
        });

        // Dropdown toggle functionality
        document.querySelectorAll('.nav-dropdown-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = button.closest('.nav-dropdown');
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                const arrow = button.querySelector('svg:last-child');
                
                // Close other dropdowns
                document.querySelectorAll('.nav-dropdown-menu').forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.classList.add('hidden');
                        const otherArrow = otherMenu.closest('.nav-dropdown').querySelector('.nav-dropdown-button svg:last-child');
                        if (otherArrow) {
                            otherArrow.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current dropdown
                menu.classList.toggle('hidden');
                if (arrow) {
                    arrow.style.transform = menu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        });

        // Sub-navigation buttons (inside dropdowns)
        document.querySelectorAll('.nav-sub-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const section = e.target.closest('button').dataset.section;
                this.showSection(section);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.add('hidden');
                    const arrow = menu.closest('.nav-dropdown').querySelector('.nav-dropdown-button svg:last-child');
                    arrow.style.transform = 'rotate(0deg)';
                });
            }
        });

        // Team section listeners
        document.querySelectorAll('.team-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchTeamTab(tab);
                }
            });
        });

        const teamSearchInput = document.getElementById('teamSearchInput');
        teamSearchInput?.addEventListener('input', (e) => {
            this.teamSearchTerm = e.target.value.toLowerCase();
            this.renderTeamMembers();
        });

        // Client section listeners
        document.querySelectorAll('.gm-tab-button, .sg-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchClientTab(tab);
                }
            });
        });

        // Training section listeners
        document.querySelectorAll('.training-category-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (category) {
                    this.switchTrainingCategory(category);
                }
            });
        });

        // Google folder toggle
        const googleFolderButton = document.querySelector('.training-folder-button[data-folder="google"]');
        const googleSubmenu = document.getElementById('googleSubmenu');
        
        if (googleFolderButton && googleSubmenu) {
            googleFolderButton.addEventListener('click', (e) => {
                e.stopPropagation();
                googleSubmenu.classList.toggle('hidden');
                const arrow = googleFolderButton.querySelector('svg:last-child');
                arrow.style.transform = googleSubmenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });

            // Close submenu when clicking outside
            document.addEventListener('click', (e) => {
                if (!googleFolderButton.contains(e.target) && !googleSubmenu.contains(e.target)) {
                    googleSubmenu.classList.add('hidden');
                    const arrow = googleFolderButton.querySelector('svg:last-child');
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }

        // Client search inputs
        const gmClientsSearchInput = document.getElementById('gmClientsSearchInput');
        gmClientsSearchInput?.addEventListener('input', (e) => {
            this.gmClientsSearchTerm = e.target.value.toLowerCase();
            this.renderClients('gm');
        });

        const sgClientsSearchInput = document.getElementById('sgClientsSearchInput');
        sgClientsSearchInput?.addEventListener('input', (e) => {
            this.sgClientsSearchTerm = e.target.value.toLowerCase();
            this.renderClients('sg');
        });

        const trainingSearchInput = document.getElementById('trainingSearchInput');
        trainingSearchInput?.addEventListener('input', (e) => {
            this.trainingSearchTerm = e.target.value.toLowerCase();
            this.renderTrainingMaterials();
        });

        // Modal listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('teamMemberModal');
        const closeButton = document.getElementById('closeModal');

        // Close modal when clicking the X button
        closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    openTeamMemberModal(member, isInHouse) {
        const modal = document.getElementById('teamMemberModal');
        
        // Update modal content
        document.getElementById('modalName').textContent = member.name;
        document.getElementById('modalRole').textContent = member.role;
        document.getElementById('modalAvatar').textContent = member.name.split(' ').map(n => n[0]).join('');

        // Update email links
        const guerrillaLink = document.querySelector('#modalGuerrillaEmail a');
        const shedGeekLink = document.querySelector('#modalShedGeekEmail a');
        
        guerrillaLink.href = `mailto:${member.emails.guerrilla}`;
        guerrillaLink.textContent = member.emails.guerrilla;
        
        shedGeekLink.href = `mailto:${member.emails.shedgeek}`;
        shedGeekLink.textContent = member.emails.shedgeek;

        // Wire tag add/remove
        const tagsContainer = document.getElementById('modalTagsList');
        const addBtn = document.getElementById('addTagBtn');
        const input = document.getElementById('newTagInput');
        const ensureTags = () => { if (!Array.isArray(member.knowledgeTags)) member.knowledgeTags = []; };
        const renderTags = () => {
            ensureTags();
            if (!tagsContainer) return;
            tagsContainer.innerHTML = member.knowledgeTags.map((t, idx) => `
                <span class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-brand-layer3 text-gray-200 rounded">
                    ${t}
                    <button data-idx="${idx}" class="remove-tag text-gray-400 hover:text-white" title="Remove">×</button>
                </span>
            `).join('');
            tagsContainer.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const i = Number(e.currentTarget.getAttribute('data-idx'));
                    member.knowledgeTags.splice(i,1);
                    this.saveTeamData();
                    renderTags();
                    this.renderTeamMembers();
                });
            });
        };
        renderTags();
        if (addBtn) {
            addBtn.onclick = () => {
                const val = (input?.value || '').trim();
                if (!val) return;
                ensureTags();
                if (!member.knowledgeTags.includes(val)) {
                    member.knowledgeTags.push(val);
                    this.saveTeamData();
                    renderTags();
                    this.renderTeamMembers();
                }
                if (input) input.value = '';
            };
        }

        // Update additional details
        const additionalDetails = document.getElementById('modalAdditionalDetails');
        additionalDetails.innerHTML = '';

        if (isInHouse) {
            // In-house specific details
            let detailsHTML = '<h3 class="text-lg font-semibold text-white mb-3 flex items-center"><svg class="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>Employee Details</h3><div class="space-y-3">';
            
            if (member.location) {
                detailsHTML += `
                    <div class="flex items-center text-sm text-gray-300">
                        <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="font-medium text-white w-20">Location:</span>
                        <span>${member.location}</span>
                    </div>
                `;
            }
            
            if (member.birthday) {
                detailsHTML += `
                    <div class="flex items-center text-sm text-gray-300">
                        <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v6a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
                        </svg>
                        <span class="font-medium text-white w-20">Birthday:</span>
                        <span>${this.formatDate(member.birthday)}</span>
                    </div>
                `;
            }
            
            if (member.phone) {
                detailsHTML += `
                    <div class="flex items-center text-sm text-gray-300">
                        <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.5 11.5a12.5 12.5 0 006 6l2.613-2.226a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V20a2 2 0 01-2 2h-1C9.716 22 2 14.284 2 6V5z"></path>
                        </svg>
                        <span class="font-medium text-white w-20">Phone:</span>
                        <a href="tel:${member.phone}" class="text-brand-primary hover:text-brand-secondary transition-colors duration-200 hover:underline">${this.formatPhone(member.phone)}</a>
                    </div>
                `;
            }
            
            detailsHTML += '</div>';
            additionalDetails.innerHTML = detailsHTML;
        } else {
            // Contractor specific details
            let detailsHTML = '<h3 class="text-lg font-semibold text-white mb-3 flex items-center"><svg class="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6m0 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6m8 0H8m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>Contractor Details</h3><div class="space-y-3">';
            
            if (member.location) {
                detailsHTML += `
                    <div class="flex items-center text-sm text-gray-300">
                        <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="font-medium text-white w-20">Location:</span>
                        <span>${member.location}</span>
                    </div>
                `;
            }

            if (member.whatsapp_groups && member.whatsapp_groups.length > 0) {
                detailsHTML += `
                    <div class="space-y-2">
                        <div class="flex items-start text-sm text-gray-300">
                            <svg class="w-4 h-4 mr-3 mt-0.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3v-1"></path>
                            </svg>
                            <div class="flex-1">
                                <span class="font-medium text-white">WhatsApp Groups:</span>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    ${member.whatsapp_groups.map(group => 
                                        `<span class="inline-block px-3 py-1 text-xs bg-green-500 bg-opacity-20 text-green-300 rounded-full border border-green-500 border-opacity-30">${group}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            detailsHTML += '</div>';
            additionalDetails.innerHTML = detailsHTML;
        }

        // Update notes section
        const notesSection = document.getElementById('modalNotesSection');
        const notesText = document.getElementById('modalNotes');
        
        if (member.notes && member.notes.trim()) {
            notesText.textContent = member.notes;
            notesSection.classList.remove('hidden');
        } else {
            notesSection.classList.add('hidden');
        }

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        const modal = document.getElementById('teamMemberModal');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    showSection(section) {
        this.currentSection = section;
        
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Update main navigation buttons and dropdown states
        document.querySelectorAll('.main-nav-button, .nav-dropdown-button').forEach(button => {
            const buttonSection = button.dataset.section;
            const isActive = buttonSection === section || 
                           (section.startsWith('team-') && buttonSection === 'directory') ||
                           (section.startsWith('jobs-') && buttonSection === 'jobs') ||
                           ((section === 'gm-clients' || section === 'sg-clients') && buttonSection === 'clients');
            
            if (isActive) {
                if (button.classList.contains('nav-dropdown-button')) {
                    button.className = 'nav-dropdown-button w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white bg-brand-layer3 rounded-xl border border-brand-primary border-opacity-50 transition-all duration-200';
                    // Keep dropdown open for active sections
                    const dropdown = button.closest('.nav-dropdown');
                    if (dropdown) {
                        const menu = dropdown.querySelector('.nav-dropdown-menu');
                        const arrow = button.querySelector('svg:last-child');
                        if (menu) menu.classList.remove('hidden');
                        if (arrow) arrow.style.transform = 'rotate(180deg)';
                    }
                } else {
                    button.className = 'main-nav-button w-full flex items-center px-4 py-3 text-sm font-medium text-white bg-brand-layer3 rounded-xl border border-brand-primary border-opacity-50 transition-all duration-200';
                }
            } else {
                if (button.classList.contains('nav-dropdown-button')) {
                    button.className = 'nav-dropdown-button w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-brand-layer2 rounded-xl transition-all duration-200';
                } else {
                    button.className = 'main-nav-button w-full flex items-center px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-brand-layer2 rounded-xl transition-all duration-200';
                }
            }
        });

        // No more sub-navigation in sidebar - all moved to top bars
        
        // Show selected section
        const sectionMap = {
            'team': 'teamSectionContent',
            'team-inhouse': 'teamSectionContent',
            'team-contractors': 'teamSectionContent',
            'gm-clients': 'gmClientsSectionContent',
            'sg-clients': 'sgClientsSectionContent',
            'training': 'trainingSectionContent',
            'jobs-recurring': 'jobsRecurringSectionContent',
            'jobs-onetime': 'jobsOnetimeSectionContent',
            'my-agenda': 'myAgendaSectionContent',
            'settings': 'settingsSectionContent'
        };
        
        const targetSection = document.getElementById(sectionMap[section]);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // Render content based on section
            switch(section) {
                case 'team':
                case 'team-inhouse':
                    this.currentTeamTab = 'inhouse';
                    this.renderTeamMembers();
                    break;
                case 'team-contractors':
                    this.currentTeamTab = 'contractors';
                    this.renderTeamMembers();
                    break;
                case 'gm-clients':
                    this.currentClientTab = 'current'; // Initialize to current tab
                    this.renderClients('gm');
                    break;
                case 'sg-clients':
                    this.currentClientTab = 'current'; // Initialize to current tab
                    this.renderClients('sg');
                    break;
                case 'training':
                    this.renderTrainingMaterials();
                    break;
                case 'jobs-recurring':
                    this.renderJobs('recurring');
                    break;
                case 'jobs-onetime':
                    this.renderJobs('onetime');
                    break;
                case 'my-agenda':
                    this.renderMyAgenda();
                    // Initialize with Daily Priorities tab
                    this.switchAgendaTab('daily-priorities');
                    break;
                case 'settings':
                    this.renderSettings();
                    this.switchSettingsTab('profile');
                    break;
            }
        }
    }

    switchTeamTab(tab) {
        this.currentTeamTab = tab;
        
        // Update team tab buttons
        document.querySelectorAll('.team-tab-button').forEach(button => {
            if (button.dataset.tab === tab) {
                button.className = 'team-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-brand-primary text-black';
            } else {
                button.className = 'team-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-300 hover:text-white hover:bg-brand-layer3 ml-1';
            }
        });

        this.renderTeamMembers();
    }

    switchClientTab(tab) {
        this.currentClientTab = tab;
        
        // Update GM client tab buttons
        document.querySelectorAll('.gm-tab-button').forEach(button => {
            if (button.dataset.tab === tab) {
                button.className = 'gm-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-brand-primary text-black';
            } else {
                button.className = 'gm-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-300 hover:text-white hover:bg-brand-layer3 ml-1';
            }
        });

        // Update SG client tab buttons
        document.querySelectorAll('.sg-tab-button').forEach(button => {
            if (button.dataset.tab === tab) {
                button.className = 'sg-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-brand-primary text-black';
            } else {
                button.className = 'sg-tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-300 hover:text-white hover:bg-brand-layer3 ml-1';
            }
        });

        // Determine which client type to render based on the current section
        const activeSection = document.querySelector('.section-content:not(.hidden)');
        if (activeSection && activeSection.id === 'gmClientsSectionContent') {
            this.renderClients('gm');
        } else if (activeSection && activeSection.id === 'sgClientsSectionContent') {
            this.renderClients('sg');
        }
    }

    switchTrainingCategory(category) {
        this.currentTrainingCategory = category;
        
        // Update training category buttons
        document.querySelectorAll('.training-category-button').forEach(button => {
            if (button.dataset.category === category) {
                button.className = 'training-category-button px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 bg-brand-primary text-brand-bg shadow-md scale-105';
            } else {
                button.className = 'training-category-button px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-brand-secondary scale-100';
            }
        });

        this.renderTrainingMaterials();
    }

    filterTeamMembers(members) {
        if (!this.teamSearchTerm) return members;

        return members.filter(member => {
            const searchableText = [
                member.name,
                member.role,
                member.emails.guerrilla,
                member.emails.shedgeek,
                member.location,
                (Array.isArray(member.knowledgeTags) ? member.knowledgeTags.join(' ') : '')
            ].join(' ').toLowerCase();

            return searchableText.includes(this.teamSearchTerm);
        });
    }

    filterTrainingMaterials(materials) {
        let filtered = materials;
        
        // Filter by category
        if (this.currentTrainingCategory !== 'all') {
            filtered = filtered.filter(material => material.category === this.currentTrainingCategory);
        }
        
        // Filter by search term
        if (this.trainingSearchTerm) {
            filtered = filtered.filter(material => {
                const searchableText = [
                    material.title,
                    material.description,
                    material.category,
                    material.tags.join(' ')
                ].join(' ').toLowerCase();
                
                return searchableText.includes(this.trainingSearchTerm);
            });
        }
        
        return filtered;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric'
        });
    }

    formatPhone(phone) {
        if (!phone) return '';
        return phone.replace(/^\+1\s/, '');
    }

    getUserNameById(userId) {
        if (!this.teamData) return '';
        const all = [...(this.teamData.inhouse || []), ...(this.teamData.contractors || [])];
        const found = all.find(u => String(u.id) === String(userId));
        return found?.name || '';
    }

    createTeamMemberCard(member, isInHouse) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200 cursor-pointer';
        
        // Add click event to open modal
        card.addEventListener('click', () => {
            this.openTeamMemberModal(member, isInHouse);
        });

        const tags = Array.isArray(member.knowledgeTags) ? member.knowledgeTags : [];

        card.innerHTML = `
            <div class="flex items-center py-4 px-6">
                <!-- Avatar -->
                <div class="w-10 h-10 bg-gradient-to-br from-brand-primary to-yellow-500 rounded-lg flex items-center justify-center text-black font-semibold text-sm mr-4">
                    ${member.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <!-- Name & Role -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                        <h3 class="text-white font-medium text-sm">${member.name}</h3>
                        <span class="ml-3 text-gray-400 text-xs">${member.role}</span>
                    </div>
                </div>
                
                <!-- Contact Info -->
                <div class="hidden md:flex items-center space-x-6 text-xs text-gray-400">
                    <div class="text-right">
                        <div>${member.emails.guerrilla}</div>
                        <div>${member.emails.shedgeek}</div>
                    </div>
                    ${member.location ? `<div class="w-20 text-right">${member.location}</div>` : '<div class="w-20"></div>'}
                </div>
                
                <!-- Status/Type Indicator -->
                <div class="ml-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isInHouse ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${isInHouse ? 'Employee' : 'Contractor'}
                    </span>
                </div>
                
                                       <!-- Actions -->
                       <div class="ml-3 flex items-center space-x-2">
                           <button class="edit-member-btn p-1 text-gray-400 hover:text-brand-primary transition-colors duration-200" data-member-id="${member.name}" data-is-inhouse="${isInHouse}">
                               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                               </svg>
                           </button>
                           <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                           </svg>
                       </div>
            </div>
        `;

        return card;
    }

    createClientCard(client) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200 cursor-pointer';
        card.onclick = (e) => {
            console.log('Client card clicked:', client.name);
            // Don't open modal if clicking on edit button
            if (!e.target.closest('.edit-client-btn')) {
                console.log('Opening client detail modal for:', client.name);
                this.openClientDetailModal(client);
            } else {
                console.log('Edit button clicked, not opening modal');
            }
        };

        const statusColor = client.status === 'current' ? 'bg-green-600' : 'bg-gray-600';
        const clientSince = new Date(client.startDate).toLocaleDateString('en-US', { 
            month: 'short',
            year: 'numeric'
        });

        // Determine which icon to use based on client type
        const clientType = client.type || 'gm';
        const iconSrc = clientType === 'gm' ? 'images/gorilla-icon.svg' : 'images/shed-icon.svg';
        const iconAlt = clientType === 'gm' ? 'Guerrilla Marketing' : 'ShedGeek';

        card.innerHTML = `
            <div class="flex items-center py-4 px-6">
                <!-- Division Icon -->
                <img src="${iconSrc}" alt="${iconAlt}" class="w-8 h-8 mr-3">
                
                <!-- Company Avatar -->
                <div class="w-10 h-10 bg-gradient-to-br from-brand-primary to-yellow-500 rounded-lg flex items-center justify-center text-black font-semibold text-sm mr-4">
                    ${client.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <!-- Company Info & Contact -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center mb-1">
                        <h3 class="text-white font-medium text-sm mr-3">${client.name}</h3>
                        <span class="text-gray-400 text-xs">${client.industry}</span>
                    </div>
                    <div class="flex items-center text-xs text-gray-400">
                        <span class="mr-4">${client.contact}</span>
                        <a href="mailto:${client.email}" class="text-brand-primary hover:text-brand-secondary transition-colors duration-200">${client.email}</a>
                    </div>
                </div>
                
                <!-- Services -->
                <div class="hidden lg:flex flex-col items-end mr-6">
                    <div class="text-xs text-gray-400 mb-1">Services</div>
                    <div class="flex flex-wrap gap-1 justify-end max-w-48">
                        ${client.services.slice(0, 3).map(service => 
                            `<span class="px-2 py-1 text-xs bg-brand-layer3 text-gray-300 rounded">${service}</span>`
                        ).join('')}
                        ${client.services.length > 3 ? `<span class="px-2 py-1 text-xs bg-brand-layer3 text-gray-300 rounded">+${client.services.length - 3}</span>` : ''}
                    </div>
                </div>
                
                <!-- Account Manager -->
                <div class="hidden lg:flex flex-col items-center mr-4">
                    <div class="text-xs text-gray-400 mb-1">Account Manager</div>
                    <div class="text-sm text-white">${client.accountManager || 'Unassigned'}</div>
                </div>
                
                <!-- Client Since -->
                <div class="hidden md:flex flex-col items-center mr-4">
                    <div class="text-xs text-gray-400 mb-1">Client Since</div>
                    <div class="text-sm text-white">${clientSince}</div>
                </div>
                
                <!-- Status -->
                <div class="ml-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} text-white">
                        ${client.status === 'current' ? 'Active' : 'Past'}
                    </span>
                </div>

                <!-- Action Buttons -->
                <div class="ml-3 flex space-x-2">
                    <button class="client-360-btn p-1 text-gray-400 hover:text-brand-primary transition-colors duration-200" onclick="guerrillaCommandPost.openClient360Drawer(${JSON.stringify(client).replace(/"/g, '&quot;')})">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </button>
                    <button class="edit-client-btn p-1 text-gray-400 hover:text-brand-primary transition-colors duration-200" data-client-id="${client.id}" data-client-type="${client.type || 'gm'}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        if (tags.length) {
            card.insertAdjacentHTML('beforeend', `<div class="px-6 pb-4 -mt-2 flex flex-wrap gap-1">${tags.map(t => `<span class=\"px-2 py-0.5 text-xs bg-brand-layer3 text-gray-200 rounded\">${t}</span>`).join('')}</div>`);
        }

        return card;
    }

    createTrainingCard(material) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl p-6 hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200 relative';

        const categoryColors = {
            'crm': 'bg-blue-500',
            'meta': 'bg-blue-600',
            'google-search-console': 'bg-red-500',
            'google-ads': 'bg-yellow-500',
            'local-service-ads': 'bg-green-500',
            'business-profile': 'bg-purple-500',
            'tag-manager': 'bg-indigo-500',
            'analytics': 'bg-pink-500'
        };

        const categoryColor = categoryColors[material.category] || 'bg-gray-500';

        card.innerHTML = `
            <!-- Edit Button -->
            <button class="edit-training-btn absolute top-4 right-4 p-1 text-gray-400 hover:text-brand-primary transition-colors duration-200" data-training-id="${material.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>

            <div class="flex items-start justify-between mb-4 pr-10">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${material.title}</h3>
                    <span class="inline-block px-3 py-1 text-xs ${categoryColor} text-white rounded-md mb-2">
                        ${material.category.replace(/-/g, ' ')}
                    </span>
                    <p class="text-gray-300 text-sm">${material.description}</p>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center text-sm text-gray-300">
                    <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium text-white">Duration:</span>
                    <span class="ml-2">${material.duration}</span>
                </div>
                
                <div class="flex items-center text-sm text-gray-300">
                    <svg class="w-4 h-4 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                    <span class="font-medium text-white">Level:</span>
                    <span class="ml-2 capitalize">${material.level}</span>
                </div>

                ${material.tags && material.tags.length > 0 ? `
                <div class="flex items-start text-sm text-gray-300">
                    <svg class="w-4 h-4 mr-3 mt-0.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    <div>
                        <span class="font-medium text-white">Tags:</span>
                        <div class="mt-1 flex flex-wrap gap-1">
                            ${material.tags.map(tag => 
                                `<span class="inline-block px-2 py-1 text-xs bg-brand-primary bg-opacity-20 text-brand-primary rounded-full">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>

            ${material.url ? `
                <div class="pt-4 border-t border-brand-lightBorder mt-4">
                    <a href="${material.url}" target="_blank" class="inline-flex items-center text-brand-primary hover:text-brand-secondary transition-colors duration-200 font-medium">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        View Material
                    </a>
                </div>
            ` : ''}
        `;

        return card;
    }

    renderTeamMembers() {
        const container = document.getElementById('teamContainer');
        const noResults = document.getElementById('teamNoResults');
        
        if (!this.teamData) return;

        const members = this.teamData[this.currentTeamTab];
        const filteredMembers = this.filterTeamMembers(members);

        container.innerHTML = '';

        if (filteredMembers.length === 0) {
            container.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            container.style.display = 'grid';
            noResults.style.display = 'none';

            filteredMembers.forEach(member => {
                const card = this.createTeamMemberCard(member, this.currentTeamTab === 'inhouse');
                container.appendChild(card);
            });
        }
    }

    renderClients(type) {
        const container = document.getElementById(type === 'gm' ? 'gmClientsContainer' : 'sgClientsContainer');
        if (!container) return;

        const clients = this.clientsData[type];
        const status = this.currentClientTab;
        let filteredClients = clients.filter(client => client.status === status);

        // Apply search filter
        const searchTerm = type === 'gm' ? this.gmClientsSearchTerm : this.sgClientsSearchTerm;
        if (searchTerm) {
            filteredClients = filteredClients.filter(client => {
                const searchableText = [
                    client.name,
                    client.industry,
                    client.contact,
                    client.email,
                    client.services?.join(' '),
                    client.notes
                ].join(' ').toLowerCase();
                
                return searchableText.includes(searchTerm);
            });
        }

        container.innerHTML = '';

        filteredClients.forEach(client => {
            // Ensure client has the correct type for icon display
            client.type = type;
            const card = this.createClientCard(client);
            container.appendChild(card);
        });
    }

    renderTrainingMaterials() {
        const container = document.getElementById('trainingContainer');
        if (!this.trainingData) return;

        const filteredMaterials = this.filterTrainingMaterials(this.trainingData);

        container.innerHTML = '';

        filteredMaterials.forEach(material => {
            const card = this.createTrainingCard(material);
            container.appendChild(card);
        });
    }

    hideLoadingState() {
        const loadingState = document.getElementById('teamLoadingState');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
    }

    getTeamFallbackData() {
        return {
            "inhouse": [
                {
                    "id": 1,
                    "name": "Chris Taylor",
                    "role": "Administrator",
                    "emails": {
                        "guerrilla": "chris@guerrillafirm.com",
                        "shedgeek": "chris@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 2,
                    "name": "Christian",
                    "role": "Technical Operations",
                    "emails": {
                        "guerrilla": "christian@guerrillafirm.com",
                        "shedgeek": "christian@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 3,
                    "name": "Cord",
                    "role": "Brand Strategist",
                    "emails": {
                        "guerrilla": "cord@guerrillafirm.com",
                        "shedgeek": "cord@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 4,
                    "name": "David",
                    "role": "Web Developer",
                    "emails": {
                        "guerrilla": "david@guerrillafirm.com",
                        "shedgeek": "david@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 5,
                    "name": "Dylan",
                    "role": "Executive",
                    "emails": {
                        "guerrilla": "dylan@guerrillafirm.com",
                        "shedgeek": "dylan@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 6,
                    "name": "Nathaniel",
                    "role": "Graphic Designer",
                    "emails": {
                        "guerrilla": "nathaniel@guerrillafirm.com",
                        "shedgeek": "nathaniel@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 7,
                    "name": "Nick",
                    "role": "Lead Video Production",
                    "emails": {
                        "guerrilla": "nick@guerrillafirm.com",
                        "shedgeek": "nick@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                },
                {
                    "id": 8,
                    "name": "Wyatt",
                    "role": "Operations Manager",
                    "emails": {
                        "guerrilla": "wyatt@guerrillafirm.com",
                        "shedgeek": "wyatt@shedgeek.com"
                    },
                    "location": "",
                    "birthday": "",
                    "phone": "",
                    "notes": ""
                }
            ],
            "contractors": [
                {
                    "id": 9,
                    "name": "Adeel",
                    "role": "Graphic Designer",
                    "emails": {
                        "guerrilla": "adeel@guerrillafirm.com",
                        "shedgeek": "adeel@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 10,
                    "name": "Hazel",
                    "role": "CRM Support",
                    "emails": {
                        "guerrilla": "hazel@guerrillafirm.com",
                        "shedgeek": "hazel@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 11,
                    "name": "Mark",
                    "role": "Ad Strategist",
                    "emails": {
                        "guerrilla": "mark@guerrillafirm.com",
                        "shedgeek": "mark@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 12,
                    "name": "Nida",
                    "role": "Occasional Coder",
                    "emails": {
                        "guerrilla": "nida@guerrillafirm.com",
                        "shedgeek": "nida@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 13,
                    "name": "Sam",
                    "role": "Occasional Coder",
                    "emails": {
                        "guerrilla": "sam@guerrillafirm.com",
                        "shedgeek": "sam@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 14,
                    "name": "Shakeel",
                    "role": "Occasional Coder",
                    "emails": {
                        "guerrilla": "shakeel@guerrillafirm.com",
                        "shedgeek": "shakeel@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 15,
                    "name": "Saba",
                    "role": "SEO",
                    "emails": {
                        "guerrilla": "saba@guerrillafirm.com",
                        "shedgeek": "saba@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                },
                {
                    "id": 16,
                    "name": "Zee",
                    "role": "Data Integration",
                    "emails": {
                        "guerrilla": "zee@guerrillafirm.com",
                        "shedgeek": "zee@shedgeek.com"
                    },
                    "location": "",
                    "whatsapp_groups": [],
                    "notes": ""
                }
            ]
        };
    }

    getClientsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "type": "gm",
                    "name": "Acme Construction",
                    "industry": "Construction",
                    "contact": "John Smith",
                    "email": "john@acmeconstruction.com",
                    "phone": "+1-555-0123",
                    "status": "current",
                    "startDate": "2024-01-15",
                    "accountManager": "Admin User",
                    "services": ["Google Ads", "Local SEO", "Website Development", "Reputation Management"],
                    "notes": "Focus on local SEO and Google Ads campaigns",
                    "contacts": [
                        { id: 1, name: "John Smith", role: "CEO", email: "john@acmeconstruction.com", phone: "+1-555-0123" },
                        { id: 2, name: "Lisa Brown", role: "Marketing Director", email: "lisa@acmeconstruction.com", phone: "+1-555-0124" }
                    ],
                    "meetings": [
                        { id: 1, date: "2024-01-15", notes: "Q1 strategy review", attendees: ["Chris Taylor", "John Smith"] }
                    ],
                    "budget": [
                        { id: 1, item: "Monthly SEO", amount: 2500, frequency: "monthly" },
                        { id: 2, item: "PPC Campaign", amount: 5000, frequency: "monthly" }
                    ],
                    "software": ["Google Analytics", "SEMrush", "Ahrefs"]
                },
                {
                    "id": 2,
                    "type": "gm",
                    "name": "Premier Roofing",
                    "industry": "Roofing",
                    "contact": "Sarah Johnson",
                    "email": "sarah@premierroofing.com",
                    "phone": "+1-555-0456",
                    "status": "current",
                    "startDate": "2023-11-20",
                    "accountManager": "Dylan",
                    "services": ["Local Service Ads", "Reputation Management", "Social Media"],
                    "notes": "Local Service Ads and reputation management",
                    "contacts": [
                        { id: 1, name: "Sarah Johnson", role: "Marketing Manager", email: "sarah@premierroofing.com", phone: "+1-555-0456" }
                    ],
                    "meetings": [],
                    "budget": [
                        { id: 1, item: "Local Service Ads", amount: 3000, frequency: "monthly" }
                    ],
                    "software": ["Google Ads", "Google My Business", "Reputation.com"]
                },
                {
                    "id": 3,
                    "type": "gm",
                    "name": "Elite Landscaping",
                    "industry": "Landscaping",
                    "contact": "Mike Davis",
                    "email": "mike@elitelandscaping.com",
                    "phone": "+1-555-0789",
                    "status": "past",
                    "startDate": "2023-03-10",
                    "accountManager": "Cord",
                    "services": ["Google Ads", "Facebook Ads", "Lead Generation"],
                    "notes": "Contract ended after successful 8-month campaign",
                    "contacts": [
                        { id: 1, name: "Mike Davis", role: "Owner", email: "mike@elitelandscaping.com", phone: "+1-555-0789" }
                    ],
                    "meetings": [],
                    "budget": [],
                    "software": ["Google Ads", "Facebook Ads Manager"]
                }
            ],
            "sg": [
                {
                    "id": 1,
                    "type": "sg",
                    "name": "Shed World",
                    "industry": "Shed Manufacturing",
                    "contact": "Tom Wilson",
                    "email": "tom@shedworld.com",
                    "phone": "+1-555-0321",
                    "status": "current",
                    "startDate": "2023-12-01",
                    "accountManager": "Christian",
                    "services": ["E-commerce Optimization", "Meta Advertising", "Email Marketing"],
                    "notes": "E-commerce optimization and Meta advertising",
                    "contacts": [
                        { id: 1, name: "Tom Wilson", role: "CEO", email: "tom@shedworld.com", phone: "+1-555-0321" }
                    ],
                    "meetings": [],
                    "budget": [
                        { id: 1, item: "Meta Advertising", amount: 4000, frequency: "monthly" }
                    ],
                    "software": ["Meta Ads Manager", "Shopify", "Klaviyo"]
                },
                {
                    "id": 2,
                    "type": "sg",
                    "name": "Backyard Builders",
                    "industry": "Custom Sheds",
                    "contact": "Lisa Brown",
                    "email": "lisa@backyardbuilders.com",
                    "phone": "+1-555-0654",
                    "status": "current",
                    "startDate": "2024-02-15",
                    "accountManager": "David",
                    "services": ["Local Market Expansion", "Google Ads", "Website Design"],
                    "notes": "Local market expansion campaign",
                    "contacts": [
                        { id: 1, name: "Lisa Brown", role: "Marketing Director", email: "lisa@backyardbuilders.com", phone: "+1-555-0654" }
                    ],
                    "meetings": [],
                    "budget": [
                        { id: 1, item: "Google Ads", amount: 2500, frequency: "monthly" }
                    ],
                    "software": ["Google Ads", "WordPress", "Elementor"]
                },
                {
                    "id": 3,
                    "name": "Storage Solutions Pro",
                    "industry": "Storage Buildings",
                    "contact": "David Martinez",
                    "email": "david@storagesolutionspro.com",
                    "phone": "+1-555-0987",
                    "status": "past",
                    "startDate": "2023-05-20",
                    "accountManager": "Admin User",
                    "services": ["Full Digital Marketing", "ROI Optimization", "Analytics"],
                    "notes": "Project completed - achieved 150% ROI",
                    "contacts": [
                        { id: 1, name: "David Martinez", role: "Owner", email: "david@storagesolutionspro.com", phone: "+1-555-0987" }
                    ],
                    "meetings": [],
                    "budget": [],
                    "software": ["Google Analytics", "Google Ads", "Facebook Ads"]
                }
            ]
        };
    }

    getTrainingData() {
        return [
            {
                "id": 1,
                "title": "CRM Setup and Configuration",
                "description": "Complete guide to setting up and configuring CRM systems for optimal lead management.",
                "category": "crm",
                "duration": "45 minutes",
                "level": "beginner",
                "tags": ["setup", "configuration", "leads"],
                "url": "https://example.com/crm-setup"
            },
            {
                "id": 2,
                "title": "Advanced CRM Automation",
                "description": "Learn to create sophisticated automation workflows to streamline your sales process.",
                "category": "crm",
                "duration": "60 minutes",
                "level": "advanced",
                "tags": ["automation", "workflows", "sales"],
                "url": "https://example.com/crm-automation"
            },
            {
                "id": 3,
                "title": "Meta Ads Campaign Strategy",
                "description": "Master the fundamentals of creating effective Meta advertising campaigns.",
                "category": "meta",
                "duration": "90 minutes",
                "level": "intermediate",
                "tags": ["strategy", "campaigns", "targeting"],
                "url": "https://example.com/meta-strategy"
            },
            {
                "id": 4,
                "title": "Google Search Console Basics",
                "description": "Understanding and utilizing Google Search Console for website optimization.",
                "category": "google-search-console",
                "duration": "30 minutes",
                "level": "beginner",
                "tags": ["seo", "monitoring", "optimization"],
                "url": "https://example.com/gsc-basics"
            },
            {
                "id": 5,
                "title": "Google Ads Keyword Research",
                "description": "Advanced techniques for finding and targeting the right keywords in Google Ads.",
                "category": "google-ads",
                "duration": "75 minutes",
                "level": "intermediate",
                "tags": ["keywords", "research", "targeting"],
                "url": "https://example.com/ads-keywords"
            },
            {
                "id": 6,
                "title": "Local Service Ads Setup",
                "description": "Step-by-step guide to setting up and optimizing Local Service Ads campaigns.",
                "category": "local-service-ads",
                "duration": "40 minutes",
                "level": "beginner",
                "tags": ["local", "setup", "optimization"],
                "url": "https://example.com/lsa-setup"
            },
            {
                "id": 7,
                "title": "Google Business Profile Optimization",
                "description": "Complete optimization strategies for Google Business Profile listings.",
                "category": "business-profile",
                "duration": "35 minutes",
                "level": "beginner",
                "tags": ["local-seo", "listings", "optimization"],
                "url": "https://example.com/gbp-optimization"
            },
            {
                "id": 8,
                "title": "Google Tag Manager Implementation",
                "description": "Learn to implement and manage tracking codes using Google Tag Manager.",
                "category": "tag-manager",
                "duration": "55 minutes",
                "level": "intermediate",
                "tags": ["tracking", "implementation", "tags"],
                "url": "https://example.com/gtm-implementation"
            },
            {
                "id": 9,
                "title": "Google Analytics 4 Reporting",
                "description": "Create custom reports and dashboards in Google Analytics 4.",
                "category": "analytics",
                "duration": "65 minutes",
                "level": "intermediate",
                "tags": ["reporting", "dashboards", "analysis"],
                "url": "https://example.com/ga4-reporting"
            },
            {
                "id": 10,
                "title": "Meta Pixel Advanced Tracking",
                "description": "Advanced Meta Pixel implementation for better conversion tracking.",
                "category": "meta",
                "duration": "50 minutes",
                "level": "advanced",
                "tags": ["pixel", "tracking", "conversions"],
                "url": "https://example.com/meta-pixel"
            }
        ];
    }

    // New Enhanced Data Generation Functions
    getTasksData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "jobId": null,
                    "title": "Setup Google Ads Campaign",
                    "description": "Create and configure Google Ads campaign for Acme Construction",
                    "priority": "high",
                    "status": "in_progress",
                    "assigneeUserId": 1,
                    "dueDate": "2024-08-20",
                    "createdAt": "2024-08-10",
                    "updatedAt": "2024-08-10"
                },
                {
                    "id": 2,
                    "clientId": 2,
                    "jobId": null,
                    "title": "Optimize Local Service Ads",
                    "description": "Review and optimize LSA performance for Premier Roofing",
                    "priority": "medium",
                    "status": "completed",
                    "assigneeUserId": 2,
                    "dueDate": "2024-08-15",
                    "createdAt": "2024-08-05",
                    "updatedAt": "2024-08-15"
                }
            ],
            "sg": [
                {
                    "id": 3,
                    "clientId": 4,
                    "jobId": null,
                    "title": "Meta Ads Campaign Setup",
                    "description": "Setup Meta advertising campaign for Shed World",
                    "priority": "high",
                    "status": "in_progress",
                    "assigneeUserId": 3,
                    "dueDate": "2024-08-25",
                    "createdAt": "2024-08-12",
                    "updatedAt": "2024-08-12"
                }
            ]
        };
    }

    getDailyPrioritiesData() {
        const today = new Date().toISOString().split('T')[0];
        return {
            [today]: [
                {
                    "id": 1,
                    "taskId": 1,
                    "dateISO": today,
                    "assigneeUserId": 1,
                    "createdAt": new Date().toISOString()
                },
                {
                    "id": 2,
                    "taskId": 3,
                    "dateISO": today,
                    "assigneeUserId": 1,
                    "createdAt": new Date().toISOString()
                }
            ]
        };
    }

    getContactsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "name": "John Smith",
                    "title": "CEO",
                    "email": "john@acmeconstruction.com",
                    "phone": "+1-555-0123",
                    "createdAt": "2024-01-15",
                    "updatedAt": "2024-01-15"
                },
                {
                    "id": 2,
                    "clientId": 1,
                    "name": "Lisa Brown",
                    "title": "Marketing Director",
                    "email": "lisa@acmeconstruction.com",
                    "phone": "+1-555-0124",
                    "createdAt": "2024-01-15",
                    "updatedAt": "2024-01-15"
                }
            ],
            "sg": [
                {
                    "id": 3,
                    "clientId": 4,
                    "name": "Tom Wilson",
                    "title": "CEO",
                    "email": "tom@shedworld.com",
                    "phone": "+1-555-0321",
                    "createdAt": "2023-12-01",
                    "updatedAt": "2023-12-01"
                }
            ]
        };
    }

    getDigitalAssetsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "type": "google_ads_account",
                    "name": "Acme Construction Ads",
                    "accountUrl": "https://ads.google.com/um/Account/123456",
                    "externalId": "123-456-7890",
                    "ownership": "client",
                    "accessStatus": "active",
                    "notes": "Primary Google Ads account",
                    "createdAt": "2024-01-15",
                    "updatedAt": "2024-01-15"
                }
            ],
            "sg": [
                {
                    "id": 2,
                    "clientId": 4,
                    "type": "meta_ads_account",
                    "name": "Shed World Meta",
                    "accountUrl": "https://business.facebook.com/adsmanager/123",
                    "externalId": "act_123456789",
                    "ownership": "client",
                    "accessStatus": "active",
                    "notes": "Meta advertising account",
                    "createdAt": "2023-12-01",
                    "updatedAt": "2023-12-01"
                }
            ]
        };
    }

    getCredentialsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "digitalAssetId": 1,
                    "kind": "username_password",
                    "label": "Google Ads Login",
                    "username": "admin@acmeconstruction.com",
                    "secretRef": "encrypted_password_123",
                    "updatedAt": "2024-01-15",
                    "updatedByUserId": 1
                }
            ]
        };
    }

    getNotesData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "jobId": null,
                    "authorUserId": 1,
                    "body": "Initial client onboarding completed. Focus on local SEO and Google Ads.",
                    "createdAt": "2024-01-15"
                }
            ],
            "sg": [
                {
                    "id": 2,
                    "clientId": 4,
                    "jobId": null,
                    "authorUserId": 3,
                    "body": "E-commerce optimization in progress. Meta advertising setup scheduled.",
                    "createdAt": "2023-12-01"
                }
            ]
        };
    }

    getMeetingTranscriptionsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "jobId": null,
                    "source": "manual",
                    "meetingStart": "2024-01-15T10:00:00Z",
                    "participants": ["Chris Taylor", "John Smith"],
                    "summary": "Q1 strategy review and campaign planning",
                    "actionItems": ["Setup Google Ads campaign", "Begin local SEO optimization"],
                    "transcriptText": "Meeting transcript content...",
                    "transcriptFileUrl": null,
                    "messageId": null,
                    "createdAt": "2024-01-15"
                }
            ]
        };
    }

    getClientServicesData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "service": "google_ads_management",
                    "status": "active",
                    "startedAt": "2024-01-15",
                    "endedAt": null,
                    "notes": "Monthly Google Ads management service"
                },
                {
                    "id": 2,
                    "clientId": 2,
                    "service": "local_service_ads",
                    "status": "active",
                    "startedAt": "2023-11-20",
                    "endedAt": null,
                    "notes": "Local Service Ads optimization"
                }
            ],
            "sg": [
                {
                    "id": 3,
                    "clientId": 4,
                    "service": "meta_ads_management",
                    "status": "active",
                    "startedAt": "2023-12-01",
                    "endedAt": null,
                    "notes": "Meta advertising management"
                }
            ]
        };
    }

    getBudgetAllocationsData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "service": "google_ads_management",
                    "monthlyAmount": 2500,
                    "active": true,
                    "updatedAt": "2024-01-15",
                    "updatedByUserId": 1
                },
                {
                    "id": 2,
                    "clientId": 2,
                    "service": "local_service_ads",
                    "monthlyAmount": 3000,
                    "active": true,
                    "updatedAt": "2023-11-20",
                    "updatedByUserId": 2
                }
            ],
            "sg": [
                {
                    "id": 3,
                    "clientId": 4,
                    "service": "meta_ads_management",
                    "monthlyAmount": 4000,
                    "active": true,
                    "updatedAt": "2023-12-01",
                    "updatedByUserId": 3
                }
            ]
        };
    }

    getKeyValueIndexData() {
        return {
            "gm": [
                {
                    "id": 1,
                    "clientId": 1,
                    "scope": "asset",
                    "scopeId": 1,
                    "key": "google_ads.cid",
                    "value": "123-456-7890",
                    "updatedAt": "2024-01-15"
                }
            ],
            "sg": [
                {
                    "id": 2,
                    "clientId": 4,
                    "scope": "asset",
                    "scopeId": 2,
                    "key": "meta.pixel_id",
                    "value": "123456789",
                    "updatedAt": "2023-12-01"
                }
            ]
        };
    }

    getTaskTemplatesData() {
        return [
            {
                "id": "tpl_asset_google_ads",
                "key": "asset_google_ads_access_or_creation",
                "title": "Google Ads Account — Access or Creation",
                "defaultDescription": "Setup or gain access to Google Ads account",
                "defaultPriority": "high",
                "createsAssetType": "google_ads_account",
                "activatesService": null,
                "fields": [
                    { "key": "access_type", "label": "Access provided by client", "kind": "bool", "required": true },
                    { "key": "name", "label": "Account name", "kind": "text", "required": true },
                    { "key": "account_url", "label": "Account URL", "kind": "url", "required": false },
                    { "key": "external_id", "label": "CID or Account ID", "kind": "id", "required": true },
                    { "key": "login_email", "label": "Login or owner email", "kind": "email", "required": false },
                    { "key": "poc_name", "label": "Point of contact name", "kind": "text", "required": false },
                    { "key": "poc_email", "label": "Point of contact email", "kind": "email", "required": false },
                    { "key": "poc_phone", "label": "Point of contact phone", "kind": "text", "required": false },
                    { "key": "cred_username", "label": "Credential username", "kind": "text", "required": false },
                    { "key": "cred_password", "label": "Credential password", "kind": "text", "required": false },
                    { "key": "cred_api_key", "label": "API key", "kind": "text", "required": false },
                    { "key": "notes", "label": "Notes", "kind": "note", "required": false }
                ],
                "onCompleteActions": [
                    { "type": "create_digital_asset", "payload": { "ownershipFrom": "access_type", "map": { "name": "name", "accountUrl": "account_url", "externalId": "external_id" } } },
                    { "type": "capture_credentials", "payload": { "username": "cred_username", "password": "cred_password", "apiKey": "cred_api_key" } },
                    { "type": "write_kv", "payload": { "key": "google_ads.cid", "valueFrom": "external_id" } }
                ]
            },
            {
                "id": "tpl_service_google_ads_onboarding",
                "key": "service_google_ads_onboarding",
                "title": "Google Ads Management — Onboarding",
                "defaultDescription": "Onboard client to Google Ads management service",
                "defaultPriority": "high",
                "createsAssetType": null,
                "activatesService": "google_ads_management",
                "fields": [
                    { "key": "active_now", "label": "Activate service now", "kind": "bool" },
                    { "key": "monthly_budget", "label": "Monthly budget", "kind": "number" },
                    { "key": "primary_kpi", "label": "Primary KPI or goal", "kind": "text" },
                    { "key": "start_date", "label": "Start date", "kind": "text" }
                ],
                "onCompleteActions": [
                    { "type": "set_client_service_active", "payload": { "activeFrom": "active_now" } },
                    { "type": "write_kv", "payload": { "key": "google_ads.monthly_budget", "valueFrom": "monthly_budget" } }
                ]
            }
        ];
    }

    getJobTemplatesData() {
        return [
            {
                "id": "tpl_job_google_ads_setup",
                "key": "job_google_ads_setup",
                "title": "Google Ads Account Setup",
                "taskTemplateIds": ["tpl_asset_google_ads", "tpl_service_google_ads_onboarding"]
            }
        ];
    }

    // Authentication Methods
    setupLoginListeners() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');

        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        logoutBtn?.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.showMainApp();
            // Apply permissions after a brief delay to ensure DOM is ready
            setTimeout(() => this.applyPermissions(), 100);
        } else {
            this.showLoginScreen();
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Login attempt:', { email, password });

        // Simple demo authentication with roles
        let user = null;
        
        if (email === 'admin@guerrillafirm.com' && password === 'admin123') {
            user = { email, name: 'Admin User', role: 'admin' };
            console.log('Admin login successful');
        } else if (email === 'manager@guerrillafirm.com' && password === 'manager123') {
            user = { email, name: 'Manager User', role: 'manager' };
            console.log('Manager login successful');
        } else if (email === 'user@guerrillafirm.com' && password === 'user123') {
            user = { email, name: 'Standard User', role: 'user' };
            console.log('User login successful');
        } else {
            console.log('Invalid credentials');
        }

        if (user) {
            this.currentUser = user;
            this.isLoggedIn = true;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showMainApp();
            this.loadAllData().then(() => {
                this.setupEventListeners();
                this.showSection('team');
                this.switchTeamTab('inhouse');
                this.renderTeamMembers();
                this.applyPermissions();
                this.hideLoadingState();
            });
        } else {
            alert('Invalid credentials. Please use the demo credentials provided.');
        }
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLoginScreen();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    }

    // Data Management Methods
    saveTeamData() {
        localStorage.setItem('teamData', JSON.stringify(this.teamData));
    }

    loadSavedTeamData() {
        const saved = localStorage.getItem('teamData');
        if (saved) {
            this.teamData = JSON.parse(saved);
            return true;
        }
        return false;
    }

    // Edit Member Methods
    setupEditListeners() {
        const addBtn = document.getElementById('addTeamMemberBtn');
        const editModal = document.getElementById('editMemberModal');
        const closeBtn = document.getElementById('closeEditModal');
        const cancelBtn = document.getElementById('cancelEditBtn');
        const form = document.getElementById('memberEditForm');
        const typeSelect = document.getElementById('editType');
        const deleteBtn = document.getElementById('deleteMemberBtn');

        addBtn?.addEventListener('click', () => this.openAddMemberModal());
        closeBtn?.addEventListener('click', () => this.closeEditModal());
        cancelBtn?.addEventListener('click', () => this.closeEditModal());
        form?.addEventListener('submit', (e) => this.handleMemberSave(e));
        typeSelect?.addEventListener('change', () => this.toggleFieldVisibility());
        deleteBtn?.addEventListener('click', () => this.handleMemberDelete());

        // Edit button listeners (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-member-btn')) {
                const btn = e.target.closest('.edit-member-btn');
                const memberName = btn.dataset.memberId;
                const isInHouse = btn.dataset.isInhouse === 'true';
                this.openEditMemberModal(memberName, isInHouse);
            }
        });
    }

    openAddMemberModal() {
        this.editingMember = null;
        document.getElementById('editModalTitle').textContent = 'Add Team Member';
        document.getElementById('deleteMemberBtn').classList.add('hidden');
        this.clearForm();
        document.getElementById('editMemberModal').classList.remove('hidden');
        this.toggleFieldVisibility();
    }

    openEditMemberModal(memberName, isInHouse) {
        const members = isInHouse ? this.teamData.inhouse : this.teamData.contractors;
        this.editingMember = members.find(m => m.name === memberName);
        
        if (this.editingMember) {
            document.getElementById('editModalTitle').textContent = 'Edit Team Member';
            document.getElementById('deleteMemberBtn').classList.remove('hidden');
            this.populateForm(this.editingMember, isInHouse);
            document.getElementById('editMemberModal').classList.remove('hidden');
        }
    }

    closeEditModal() {
        document.getElementById('editMemberModal').classList.add('hidden');
        this.editingMember = null;
        this.clearForm();
    }

    populateForm(member, isInHouse) {
        document.getElementById('editName').value = member.name || '';
        document.getElementById('editRole').value = member.role || '';
        document.getElementById('editGuerrillaEmail').value = member.emails?.guerrilla || '';
        document.getElementById('editShedGeekEmail').value = member.emails?.shedgeek || '';
        document.getElementById('editLocation').value = member.location || '';
        document.getElementById('editNotes').value = member.notes || '';
        document.getElementById('editType').value = isInHouse ? 'inhouse' : 'contractor';

        if (isInHouse) {
            document.getElementById('editBirthday').value = member.birthday || '';
            document.getElementById('editPhone').value = member.phone_number || '';
        } else {
            document.getElementById('editWhatsAppGroups').value = member.whatsapp_groups?.join('\n') || '';
        }

        this.toggleFieldVisibility();
    }

    clearForm() {
        document.getElementById('memberEditForm').reset();
        this.toggleFieldVisibility();
    }

    toggleFieldVisibility() {
        const type = document.getElementById('editType').value;
        const inHouseFields = document.getElementById('inHouseFields');
        const contractorFields = document.getElementById('contractorFields');

        if (type === 'inhouse') {
            inHouseFields.classList.remove('hidden');
            contractorFields.classList.add('hidden');
        } else {
            inHouseFields.classList.add('hidden');
            contractorFields.classList.remove('hidden');
        }
    }

    handleMemberSave(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('editName').value,
            role: document.getElementById('editRole').value,
            emails: {
                guerrilla: document.getElementById('editGuerrillaEmail').value,
                shedgeek: document.getElementById('editShedGeekEmail').value
            },
            location: document.getElementById('editLocation').value,
            notes: document.getElementById('editNotes').value
        };

        const type = document.getElementById('editType').value;
        
        if (type === 'inhouse') {
            formData.birthday = document.getElementById('editBirthday').value;
            formData.phone_number = document.getElementById('editPhone').value;
        } else {
            const whatsappGroups = document.getElementById('editWhatsAppGroups').value;
            formData.whatsapp_groups = whatsappGroups.split('\n').filter(group => group.trim());
        }

        if (this.editingMember) {
            // Update existing member
            Object.assign(this.editingMember, formData);
        } else {
            // Add new member
            const targetArray = type === 'inhouse' ? this.teamData.inhouse : this.teamData.contractors;
            targetArray.push(formData);
        }

        this.saveTeamData();
        this.renderTeamMembers();
        this.closeEditModal();
    }

    handleMemberDelete() {
        if (this.editingMember && confirm('Are you sure you want to delete this team member?')) {
            // Find and remove the member
            let found = false;
            
            this.teamData.inhouse = this.teamData.inhouse.filter(member => {
                if (member === this.editingMember) {
                    found = true;
                    return false;
                }
                return true;
            });

            if (!found) {
                this.teamData.contractors = this.teamData.contractors.filter(member => {
                    return member !== this.editingMember;
                });
            }

            this.saveTeamData();
            this.renderTeamMembers();
            this.closeEditModal();
        }
    }

    // Client Edit Methods
    setupClientEditListeners() {
        // Add buttons
        document.getElementById('addGMClientBtn')?.addEventListener('click', () => this.openAddClientModal('gm'));
        document.getElementById('addSGClientBtn')?.addEventListener('click', () => this.openAddClientModal('sg'));
        
        // Modal controls
        document.getElementById('closeEditClientModal')?.addEventListener('click', () => this.closeEditClientModal());
        document.getElementById('cancelEditClientBtn')?.addEventListener('click', () => this.closeEditClientModal());
        document.getElementById('clientEditForm')?.addEventListener('submit', (e) => this.handleClientSave(e));
        document.getElementById('deleteClientBtn')?.addEventListener('click', () => this.handleClientDelete());

        // Edit button listeners (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-client-btn')) {
                const btn = e.target.closest('.edit-client-btn');
                const clientId = parseInt(btn.dataset.clientId);
                const clientType = btn.dataset.clientType;
                this.openEditClientModal(clientId, clientType);
            }
        });
    }

    openAddClientModal(type) {
        this.editingClient = null;
        this.editingClientType = type;
        document.getElementById('editClientModalTitle').textContent = `Add ${type.toUpperCase()} Client`;
        document.getElementById('deleteClientBtn').classList.add('hidden');
        this.clearClientForm();
        document.getElementById('editClientModal').classList.remove('hidden');
    }

    openEditClientModal(clientId, type) {
        const clients = this.clientsData[type];
        this.editingClient = clients.find(c => c.id === clientId);
        this.editingClientType = type;
        
        if (this.editingClient) {
            document.getElementById('editClientModalTitle').textContent = `Edit ${type.toUpperCase()} Client`;
            document.getElementById('deleteClientBtn').classList.remove('hidden');
            this.populateClientForm(this.editingClient);
            document.getElementById('editClientModal').classList.remove('hidden');
        }
    }

    closeEditClientModal() {
        document.getElementById('editClientModal').classList.add('hidden');
        this.editingClient = null;
        this.editingClientType = null;
        this.clearClientForm();
    }

    populateClientForm(client) {
        document.getElementById('editClientName').value = client.name || '';
        document.getElementById('editClientIndustry').value = client.industry || '';
        document.getElementById('editClientContact').value = client.contact || '';
        document.getElementById('editClientEmail').value = client.email || '';
        document.getElementById('editClientStartDate').value = client.startDate || '';
        document.getElementById('editClientStatus').value = client.status || 'current';
        document.getElementById('editClientServices').value = client.services?.join('\n') || '';
        document.getElementById('editClientNotes').value = client.notes || '';
    }

    clearClientForm() {
        document.getElementById('clientEditForm').reset();
    }

    handleClientSave(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('editClientName').value,
            industry: document.getElementById('editClientIndustry').value,
            contact: document.getElementById('editClientContact').value,
            email: document.getElementById('editClientEmail').value,
            startDate: document.getElementById('editClientStartDate').value,
            status: document.getElementById('editClientStatus').value,
            services: document.getElementById('editClientServices').value.split('\n').filter(s => s.trim()),
            notes: document.getElementById('editClientNotes').value
        };

        if (this.editingClient) {
            // Update existing client
            Object.assign(this.editingClient, formData);
        } else {
            // Add new client
            const newId = Math.max(...this.clientsData[this.editingClientType].map(c => c.id)) + 1;
            formData.id = newId;
            formData.type = this.editingClientType;
            this.clientsData[this.editingClientType].push(formData);
        }

        this.saveClientsData();
        this.renderClients(this.editingClientType);
        this.closeEditClientModal();
    }

    handleClientDelete() {
        if (this.editingClient && confirm('Are you sure you want to delete this client?')) {
            this.clientsData[this.editingClientType] = this.clientsData[this.editingClientType].filter(
                client => client !== this.editingClient
            );
            this.saveClientsData();
            this.renderClients(this.editingClientType);
            this.closeEditClientModal();
        }
    }

    saveClientsData() {
        localStorage.setItem('clientsData', JSON.stringify(this.clientsData));
    }

    saveTasksData() {
        localStorage.setItem('tasksData', JSON.stringify(this.tasksData));
    }

    saveContactsData() {
        localStorage.setItem('contactsData', JSON.stringify(this.contactsData));
    }

    saveDigitalAssetsData() {
        localStorage.setItem('digitalAssetsData', JSON.stringify(this.digitalAssetsData));
    }

    saveCredentialsData() {
        localStorage.setItem('credentialsData', JSON.stringify(this.credentialsData));
    }

    saveNotesData() {
        localStorage.setItem('notesData', JSON.stringify(this.notesData));
    }

    saveMeetingTranscriptionsData() {
        localStorage.setItem('meetingTranscriptionsData', JSON.stringify(this.meetingTranscriptionsData));
    }

    saveClientServicesData() {
        localStorage.setItem('clientServicesData', JSON.stringify(this.clientServicesData));
    }

    saveBudgetAllocationsData() {
        localStorage.setItem('budgetAllocationsData', JSON.stringify(this.budgetAllocationsData));
    }

    saveKeyValueIndexData() {
        localStorage.setItem('keyValueIndexData', JSON.stringify(this.keyValueIndexData));
    }

    saveDailyPrioritiesData() {
        localStorage.setItem('dailyPrioritiesData', JSON.stringify(this.dailyPrioritiesData));
    }

    // Training Edit Methods
    setupTrainingEditListeners() {
        // Add button
        document.getElementById('addTrainingBtn')?.addEventListener('click', () => this.openAddTrainingModal());
        
        // Modal controls
        document.getElementById('closeEditTrainingModal')?.addEventListener('click', () => this.closeEditTrainingModal());
        document.getElementById('cancelEditTrainingBtn')?.addEventListener('click', () => this.closeEditTrainingModal());
        document.getElementById('trainingEditForm')?.addEventListener('submit', (e) => this.handleTrainingSave(e));
        document.getElementById('deleteTrainingBtn')?.addEventListener('click', () => this.handleTrainingDelete());

        // Edit button listeners (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-training-btn')) {
                const btn = e.target.closest('.edit-training-btn');
                const trainingId = parseInt(btn.dataset.trainingId);
                this.openEditTrainingModal(trainingId);
            }
        });
    }

    openAddTrainingModal() {
        this.editingTraining = null;
        document.getElementById('editTrainingModalTitle').textContent = 'Add Training Material';
        document.getElementById('deleteTrainingBtn').classList.add('hidden');
        this.clearTrainingForm();
        document.getElementById('editTrainingModal').classList.remove('hidden');
    }

    openEditTrainingModal(trainingId) {
        this.editingTraining = this.trainingData.find(t => t.id === trainingId);
        
        if (this.editingTraining) {
            document.getElementById('editTrainingModalTitle').textContent = 'Edit Training Material';
            document.getElementById('deleteTrainingBtn').classList.remove('hidden');
            this.populateTrainingForm(this.editingTraining);
            document.getElementById('editTrainingModal').classList.remove('hidden');
        }
    }

    closeEditTrainingModal() {
        document.getElementById('editTrainingModal').classList.add('hidden');
        this.editingTraining = null;
        this.clearTrainingForm();
    }

    populateTrainingForm(training) {
        document.getElementById('editTrainingTitle').value = training.title || '';
        document.getElementById('editTrainingCategory').value = training.category || '';
        document.getElementById('editTrainingDuration').value = training.duration || '';
        document.getElementById('editTrainingLevel').value = training.level || '';
        document.getElementById('editTrainingUrl').value = training.url || '';
        document.getElementById('editTrainingDescription').value = training.description || '';
        document.getElementById('editTrainingTags').value = training.tags?.join(', ') || '';
    }

    clearTrainingForm() {
        document.getElementById('trainingEditForm').reset();
    }

    handleTrainingSave(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('editTrainingTitle').value,
            category: document.getElementById('editTrainingCategory').value,
            duration: document.getElementById('editTrainingDuration').value,
            level: document.getElementById('editTrainingLevel').value,
            url: document.getElementById('editTrainingUrl').value,
            description: document.getElementById('editTrainingDescription').value,
            tags: document.getElementById('editTrainingTags').value.split(',').map(t => t.trim()).filter(t => t)
        };

        if (this.editingTraining) {
            // Update existing training
            Object.assign(this.editingTraining, formData);
        } else {
            // Add new training
            const newId = Math.max(...this.trainingData.map(t => t.id)) + 1;
            formData.id = newId;
            this.trainingData.push(formData);
        }

        this.saveTrainingData();
        this.renderTrainingMaterials();
        this.closeEditTrainingModal();
    }

    handleTrainingDelete() {
        if (this.editingTraining && confirm('Are you sure you want to delete this training material?')) {
            this.trainingData = this.trainingData.filter(training => training !== this.editingTraining);
            this.saveTrainingData();
            this.renderTrainingMaterials();
            this.closeEditTrainingModal();
        }
    }

    saveTrainingData() {
        localStorage.setItem('trainingData', JSON.stringify(this.trainingData));
    }

    setupEnhancedEventListeners() {
        // Task functionality
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.openAddTaskModal());
        
        // Refresh data button
        document.getElementById('refreshDataBtn')?.addEventListener('click', () => {
            console.log('Refresh button clicked');
            this.renderDailyPriorities();
            this.renderSuggestedPriorities();
            this.renderMyTasks();
            this.renderMyJobs();
        });
        
        // Task Template functionality
        document.getElementById('closeTaskTemplateModal')?.addEventListener('click', () => this.closeTaskTemplateModal());
        document.getElementById('cancelTaskTemplateBtn')?.addEventListener('click', () => this.closeTaskTemplateModal());
        document.getElementById('taskTemplateForm')?.addEventListener('submit', (e) => this.handleTaskTemplateSubmit(e));
        
        // Enhanced Client Detail functionality
        document.getElementById('saveQuickNoteBtn')?.addEventListener('click', () => this.saveQuickNote());
        document.getElementById('addDigitalAssetBtn')?.addEventListener('click', () => this.openAddDigitalAssetModal());
        document.getElementById('closeAddDigitalAssetModal')?.addEventListener('click', () => this.closeAddDigitalAssetModal());
        document.getElementById('cancelAddDigitalAssetBtn')?.addEventListener('click', () => this.closeAddDigitalAssetModal());
        document.getElementById('addDigitalAssetForm')?.addEventListener('submit', (e) => this.handleAddDigitalAsset(e));
        
        document.getElementById('addNoteBtn')?.addEventListener('click', () => this.openAddNoteModal());
        document.getElementById('closeAddNoteModal')?.addEventListener('click', () => this.closeAddNoteModal());
        document.getElementById('cancelAddNoteBtn')?.addEventListener('click', () => this.closeAddNoteModal());
        document.getElementById('addNoteForm')?.addEventListener('submit', (e) => this.handleAddNote(e));
        
        document.getElementById('addMeetingTranscriptionBtn')?.addEventListener('click', () => this.openAddMeetingTranscriptionModal());
        document.getElementById('closeAddMeetingTranscriptionModal')?.addEventListener('click', () => this.closeAddMeetingTranscriptionModal());
        document.getElementById('cancelAddMeetingTranscriptionBtn')?.addEventListener('click', () => this.closeAddMeetingTranscriptionModal());
        document.getElementById('addMeetingTranscriptionForm')?.addEventListener('submit', (e) => this.handleAddMeetingTranscription(e));
        
        // Client tab switching
        document.querySelectorAll('.client-detail-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchClientDetailTab(tab);
            });
        });
        
        // Add missing client management event listeners
        document.getElementById('addClientJobBtn')?.addEventListener('click', () => this.openAddClientJobModal());
        document.getElementById('addClientContactBtn')?.addEventListener('click', () => this.openAddClientContactModal());
        document.getElementById('addRecurringJobBtn')?.addEventListener('click', () => this.openAddRecurringJobModal());
        document.getElementById('addOnetimeJobBtn')?.addEventListener('click', () => this.openAddOnetimeJobModal());
    }

    setupAgendaTabListeners() {
        // Agenda tab switching
        document.querySelectorAll('.agenda-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAgendaTab(tab);
            });
        });
        
        // Mark task as priority button
        document.getElementById('markTaskAsPriorityBtn')?.addEventListener('click', () => this.openMarkTaskAsPriorityModal());
    }

    // Jobs Methods
    getJobsData() {
        return {
            recurring: [
                {
                    id: 1,
                    title: "Monthly SEO Optimization",
                    clientId: 1,
                    clientName: "ABC Company",
                    description: "Monthly SEO maintenance and optimization",
                    frequency: "monthly",
                    nextDue: "2024-02-15",
                    assignedTo: "Chris Taylor",
                    status: "active",
                    tasks: [
                        { id: 1, title: "Keyword research", completed: false, dueDate: "2024-02-10", priority: "high", assignedTo: "Chris Taylor" },
                        { id: 2, title: "Content optimization", completed: false, dueDate: "2024-02-12", priority: "medium", assignedTo: "David" },
                        { id: 3, title: "Backlink analysis", completed: true, dueDate: "2024-02-08", priority: "low", assignedTo: "Christian" }
                    ],
                    budget: 2500,
                    software: ["Google Analytics", "SEMrush", "Ahrefs"],
                    notes: "Client is very responsive to changes"
                }
            ],
            onetime: [
                {
                    id: 1,
                    title: "Website Redesign",
                    clientId: 2,
                    clientName: "XYZ Corp",
                    description: "Complete website redesign and development",
                    startDate: "2024-01-15",
                    dueDate: "2024-03-15",
                    assignedTo: "Admin User",
                    status: "in-progress",
                    tasks: [
                        { id: 1, title: "Design mockups", completed: true, dueDate: "2024-01-25", priority: "high", assignedTo: "Admin User" },
                        { id: 2, title: "Frontend development", completed: false, dueDate: "2024-02-15", priority: "high", assignedTo: "David" },
                        { id: 3, title: "Content migration", completed: false, dueDate: "2024-02-28", priority: "medium", assignedTo: "Christian" }
                    ],
                    budget: 15000,
                    software: ["Figma", "WordPress", "Elementor"],
                    notes: "Client wants modern, mobile-first design"
                }
            ]
        };
    }

    renderJobs(type) {
        const container = document.getElementById(type === 'recurring' ? 'recurringJobsContainer' : 'onetimeJobsContainer');
        if (!container) return;

        const jobs = this.jobsData[type];
        container.innerHTML = '';

        jobs.forEach(job => {
            const card = this.createJobCard(job, type);
            container.appendChild(card);
        });
    }

    createJobCard(job, type) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl p-6 hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200 cursor-pointer';
        card.onclick = () => this.openJobDetail(job);

        const statusColors = {
            'active': 'bg-green-500',
            'in-progress': 'bg-blue-500',
            'completed': 'bg-gray-500',
            'paused': 'bg-yellow-500'
        };

        const statusColor = statusColors[job.status] || 'bg-gray-500';

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${job.title}</h3>
                    <p class="text-gray-300 text-sm mb-3">${job.description}</p>
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-400">Client: <span class="text-white">${job.clientName}</span></span>
                        <span class="text-gray-400">Assigned: <span class="text-white">${job.assignedTo}</span></span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white">
                            ${job.status}
                        </span>
                    </div>
                </div>
                <button class="edit-job-btn p-1 text-gray-400 hover:text-brand-primary transition-colors duration-200" data-job-id="${job.id}" data-job-type="${type}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">Budget</div>
                    <div class="text-white font-semibold">$${job.budget.toLocaleString()}</div>
                </div>
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">${type === 'recurring' ? 'Next Due' : 'Due Date'}</div>
                    <div class="text-white font-semibold">${type === 'recurring' ? job.nextDue : job.dueDate}</div>
                </div>
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">Tasks</div>
                    <div class="text-white font-semibold">${job.tasks.filter(t => t.completed).length}/${job.tasks.length}</div>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <h4 class="text-sm font-medium text-white mb-2">Tasks</h4>
                    <div class="space-y-2">
                        ${job.tasks.map(task => {
                            const priorityColors = {
                                'high': 'bg-red-500',
                                'medium': 'bg-yellow-500',
                                'low': 'bg-green-500'
                            };
                            const priorityColor = priorityColors[task.priority] || 'bg-gray-500';
                            const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
                            
                            return `
                                <div class="flex items-center justify-between bg-brand-layer2 rounded-lg p-3">
                                    <div class="flex items-center">
                                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="mr-3 text-brand-primary" onchange="this.closest('.app').updateTaskStatus(${job.id}, ${task.id}, this.checked, '${type}')">
                                        <span class="text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}">${task.title}</span>
                                        <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColor} text-white">
                                            ${task.priority}
                                        </span>
                                        ${isOverdue ? '<span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">Overdue</span>' : ''}
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs text-gray-400">${task.assignedTo || 'Unassigned'}</span>
                                        <span class="text-xs text-gray-400">${task.dueDate}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                ${job.software && job.software.length > 0 ? `
                    <div>
                        <h4 class="text-sm font-medium text-white mb-2">Software</h4>
                        <div class="flex flex-wrap gap-2">
                            ${job.software.map(software => `
                                <span class="px-2 py-1 text-xs bg-brand-layer3 text-gray-300 rounded">${software}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${job.notes ? `
                    <div>
                        <h4 class="text-sm font-medium text-white mb-2">Notes</h4>
                        <p class="text-sm text-gray-300">${job.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    openJobDetail(job) {
        // Reuse client detail modal shell to show job details quickly
        const modal = document.getElementById('clientDetailModal');
        if (!modal) return;
        const title = document.getElementById('clientDetailModalTitle');
        if (title) title.textContent = `Job Details — ${job.title}`;
        // Simple content swap into the overview tab
        const overview = document.getElementById('clientOverviewTab');
        const others = document.querySelectorAll('.client-detail-tab-content');
        others.forEach(el => el.classList.add('hidden'));
        if (overview) {
            overview.classList.remove('hidden');
            overview.innerHTML = `
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                            <div class="text-xs text-gray-400 mb-1">Client</div>
                            <div class="text-white font-medium">${job.clientName || ''}</div>
                        </div>
                        <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                            <div class="text-xs text-gray-400 mb-1">Status</div>
                            <div class="text-white font-medium capitalize">${job.status}</div>
                        </div>
                        <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                            <div class="text-xs text-gray-400 mb-1">Type</div>
                            <div class="text-white font-medium capitalize">${job.type}</div>
                        </div>
                        <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                            <div class="text-xs text-gray-400 mb-1">Budget</div>
                            <div class="text-white font-medium">$${(job.budget||0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                        <div class="text-xs text-gray-400 mb-1">Description</div>
                        <div class="text-gray-300">${job.description || ''}</div>
                    </div>
                    <div class="bg-brand-layer2 border border-brand-border rounded-lg p-4">
                        <div class="text-xs text-gray-400 mb-2">Tasks</div>
                        <div class="space-y-2">
                            ${job.tasks.map(t => `
                                <label class=\"flex items-center gap-2 text-sm\">
                                    <input type=\"checkbox\" ${t.completed ? 'checked' : ''} onchange=\"guerrillaCommandPost.updateTaskStatus(${job.id}, ${t.id}, this.checked, '${job.type || 'recurring'}')\" />
                                    <span class=\"${t.completed ? 'line-through text-gray-500' : 'text-white'}\">${t.title}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        modal.classList.remove('hidden');
        document.getElementById('closeClientDetailModal')?.addEventListener('click', () => this.closeClientDetailModal());
        document.getElementById('cancelClientDetailBtn')?.addEventListener('click', () => this.closeClientDetailModal());
    }

    updateTaskStatus(jobId, taskId, completed, type) {
        const job = this.jobsData[type].find(j => j.id === jobId);
        if (job) {
            const task = job.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = completed;
                this.saveJobsData();
                this.renderJobs(type);
            }
        }
    }

    saveJobsData() {
        localStorage.setItem('jobsData', JSON.stringify(this.jobsData));
    }

    // My Agenda Methods
    renderMyAgenda() {
        this.switchAgendaTab('daily-priorities');
        this.setupAgendaEventListeners();
    }

    setupAgendaEventListeners() {
        // Search inputs
        document.getElementById('myAccountsSearchInput')?.addEventListener('input', (e) => {
            this.myAccountsSearchTerm = e.target.value.toLowerCase();
            this.renderMyAccounts();
        });

        document.getElementById('myTasksSearchInput')?.addEventListener('input', (e) => {
            this.myTasksSearchTerm = e.target.value.toLowerCase();
            this.renderMyTasks();
        });

        document.getElementById('myTasksPriorityFilter')?.addEventListener('change', (e) => {
            this.myTasksPriorityFilter = e.target.value;
            this.renderMyTasks();
        });

        document.getElementById('myTasksClientFilter')?.addEventListener('change', (e) => {
            this.myTasksClientFilter = e.target.value;
            this.renderMyTasks();
        });

        document.getElementById('myJobsSearchInput')?.addEventListener('input', (e) => {
            this.myJobsSearchTerm = e.target.value.toLowerCase();
            this.renderMyJobs();
        });
    }

    renderMyAccounts() {
        const container = document.getElementById('myAccountsContainer');
        if (!container || !this.currentUser) return;

        const allClients = [...this.clientsData.gm, ...this.clientsData.sg];
        const myClients = allClients.filter(client => 
            client.accountManager === this.currentUser.name
        );

        let filteredClients = myClients;
        if (this.myAccountsSearchTerm) {
            filteredClients = myClients.filter(client => {
                const searchableText = [
                    client.name,
                    client.industry,
                    client.contact,
                    client.email,
                    client.services?.join(' ')
                ].join(' ').toLowerCase();
                
                return searchableText.includes(this.myAccountsSearchTerm);
            });
        }

        container.innerHTML = '';

        if (filteredClients.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Assigned Accounts</h3>
                    <p class="text-gray-400">You don't have any accounts assigned to you yet.</p>
                </div>
            `;
        } else {
            filteredClients.forEach(client => {
                const card = this.createMyAccountCard(client);
                container.appendChild(card);
            });
        }
    }

    createMyAccountCard(client) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl p-6 hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200 cursor-pointer';
        card.onclick = () => this.openClientDetailModal(client);

        const statusColors = {
            'current': 'bg-green-500',
            'past': 'bg-gray-500'
        };

        const statusColor = statusColors[client.status] || 'bg-gray-500';

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${client.name}</h3>
                    <p class="text-gray-300 text-sm mb-3">${client.industry}</p>
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-400">Contact: <span class="text-white">${client.contact}</span></span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white">
                            ${client.status}
                        </span>
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <h4 class="text-sm font-medium text-white mb-2">Services</h4>
                    <div class="flex flex-wrap gap-2">
                        ${client.services?.map(service => `
                            <span class="px-2 py-1 text-xs bg-brand-layer3 text-gray-300 rounded">${service}</span>
                        `).join('') || ''}
                    </div>
                </div>

                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">Client since: <span class="text-white">${this.formatDate(client.startDate)}</span></span>
                    <span class="text-brand-primary hover:text-brand-secondary cursor-pointer">View Details →</span>
                </div>
            </div>
        `;

        return card;
    }

    renderMyTasks() {
        const container = document.getElementById('myTasksContainer');
        if (!container || !this.currentUser) return;

        const allTasks = [];
        
        // Collect tasks from the new task data structure
        Object.values(this.tasksData).forEach(divisionTasks => {
            divisionTasks.forEach(task => {
                if (task.assigneeUserId == this.currentUser.id) {
                        allTasks.push({
                            ...task,
                        clientName: this.getClientName(task.clientId),
                        jobTitle: this.getJobTitle(task.jobId)
                        });
                    }
            });
        });

        let filteredTasks = allTasks;
        
        // Filter by status (updated from priority)
        if (this.myTasksPriorityFilter) {
            filteredTasks = filteredTasks.filter(task => task.status === this.myTasksPriorityFilter);
        }
        // Filter by client
        if (this.myTasksClientFilter) {
            filteredTasks = filteredTasks.filter(task => String(task.clientId) === String(this.myTasksClientFilter));
        }
        
        // Filter by search
        if (this.myTasksSearchTerm) {
            filteredTasks = filteredTasks.filter(task => {
                const searchableText = [
                    task.title,
                    task.description,
                    task.clientName,
                    task.jobTitle
                ].join(' ').toLowerCase();
                
                return searchableText.includes(this.myTasksSearchTerm);
            });
        }

        // Sort by priority and due date
        filteredTasks.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        });

        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Assigned Tasks</h3>
                    <p class="text-gray-400">You don't have any tasks assigned to you yet.</p>
                </div>
            `;
        } else {
            filteredTasks.forEach(task => {
                const card = this.createMyTaskCard(task);
                container.appendChild(card);
            });
        }
    }

    createMyTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl p-4 hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200';

        const priorityColors = {
            'high': 'bg-red-500',
            'medium': 'bg-yellow-500',
            'low': 'bg-green-500'
        };

        const priorityColor = priorityColors[task.priority] || 'bg-gray-500';
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
        const today = new Date().toISOString().split('T')[0];
        const isDaily = Array.isArray(this.dailyPrioritiesData[today]) && this.dailyPrioritiesData[today].some(p => p.taskId == task.id);

        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''} class="text-brand-primary" onchange="this.closest('.app').updateMyTaskStatus(${task.id}, this.checked)">
                        <h3 class="text-md font-semibold text-white ${task.status === 'completed' ? 'line-through text-gray-500' : ''}">${task.title}</h3>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColor} text-white">
                            ${task.priority}
                        </span>
                        ${isDaily ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">Daily Priority</span>' : ''}
                        ${isOverdue ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">Overdue</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-300">${task.clientName}${task.jobTitle ? ` - ${task.jobTitle}` : ''}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-400">Due: ${this.formatDate(task.dueDate)}</div>
                </div>
            </div>
        `;

        return card;
    }

    renderMyJobs() {
        const container = document.getElementById('myJobsContainer');
        if (!container || !this.currentUser) return;

        const allJobs = [];
        
        // Collect jobs assigned to current user
        Object.entries(this.jobsData).forEach(([type, jobs]) => {
            jobs.forEach(job => {
                if (job.assignedTo === this.currentUser.name) {
                    allJobs.push({ ...job, type });
                }
            });
        });

        let filteredJobs = allJobs;
        
        if (this.myJobsSearchTerm) {
            filteredJobs = allJobs.filter(job => {
                const searchableText = [
                    job.title,
                    job.description,
                    job.clientName
                ].join(' ').toLowerCase();
                
                return searchableText.includes(this.myJobsSearchTerm);
            });
        }

        container.innerHTML = '';

        if (filteredJobs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Assigned Jobs</h3>
                    <p class="text-gray-400">You don't have any jobs assigned to you yet.</p>
                </div>
            `;
        } else {
            filteredJobs.forEach(job => {
                const card = this.createMyJobCard(job);
                container.appendChild(card);
            });
        }
    }

    createMyJobCard(job) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer1 border border-brand-border rounded-xl p-6 hover:border-brand-lightBorder hover:bg-brand-layer2 transition-all duration-200';

        const statusColors = {
            'active': 'bg-green-500',
            'in-progress': 'bg-blue-500',
            'completed': 'bg-gray-500',
            'paused': 'bg-yellow-500'
        };

        const statusColor = statusColors[job.status] || 'bg-gray-500';

        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${job.title}</h3>
                    <p class="text-gray-300 text-sm mb-3">${job.description}</p>
                    <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-400">Client: <span class="text-white">${job.clientName}</span></span>
                        <span class="text-gray-400">Type: <span class="text-white capitalize">${job.type}</span></span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white">
                            ${job.status}
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">Budget</div>
                    <div class="text-white font-semibold">$${job.budget.toLocaleString()}</div>
                </div>
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">${job.type === 'recurring' ? 'Next Due' : 'Due Date'}</div>
                    <div class="text-white font-semibold">${job.type === 'recurring' ? job.nextDue : job.dueDate}</div>
                </div>
                <div class="bg-brand-layer2 rounded-lg p-3">
                    <div class="text-xs text-gray-400 mb-1">Tasks</div>
                    <div class="text-white font-semibold">${job.tasks.filter(t => t.completed).length}/${job.tasks.length}</div>
                </div>
            </div>
        `;

        return card;
    }

    updateMyTaskStatus(jobType, jobId, taskId, completed) {
        const job = this.jobsData[jobType].find(j => j.id === jobId);
        if (job) {
            const task = job.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = completed;
                this.saveJobsData();
                this.renderMyTasks();
            }
        }
    }

    // Client Detail Modal Methods
    openClientDetailModal(client) {
        console.log('openClientDetailModal called with:', client);
        this.currentClientDetail = client;
        
        const modal = document.getElementById('clientDetailModal');
        const title = document.getElementById('clientDetailModalTitle');
        
        if (!modal) {
            console.error('Client detail modal not found!');
            return;
        }
        
        if (title) {
            title.textContent = `Client Details - ${client.name}`;
        }
        
        this.populateClientDetailForm(client);
        modal.classList.remove('hidden');
        console.log('Modal should now be visible');
        
        this.setupClientDetailEventListeners();
    }

    setupClientDetailEventListeners() {
        // Tab switching handled in setupEnhancedEventListeners

        // Modal controls
        document.getElementById('closeClientDetailModal')?.addEventListener('click', () => this.closeClientDetailModal());
        document.getElementById('cancelClientDetailBtn')?.addEventListener('click', () => this.closeClientDetailModal());
        document.getElementById('saveClientDetailBtn')?.addEventListener('click', () => this.saveClientDetail());
    }

    // Old switchClientDetailTab function removed - using enhanced version

    renderClientJobs() {
        const container = document.getElementById('clientJobsContainer');
        if (!container || !this.currentClientDetail) return;

        const allJobs = [...this.jobsData.recurring, ...this.jobsData.onetime];
        const clientJobs = allJobs.filter(job => job.clientName === this.currentClientDetail.name);

        container.innerHTML = '';

        if (clientJobs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Jobs Found</h3>
                    <p class="text-gray-400">No jobs have been created for this client yet.</p>
                </div>
            `;
        } else {
            clientJobs.forEach(job => {
                const jobCard = this.createClientJobCard(job);
                container.appendChild(jobCard);
            });
        }
    }

    createClientJobCard(job) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer2 border border-brand-border rounded-lg p-4';

        const statusColors = {
            'active': 'bg-green-500',
            'in-progress': 'bg-blue-500',
            'completed': 'bg-gray-500',
            'paused': 'bg-yellow-500'
        };

        const statusColor = statusColors[job.status] || 'bg-gray-500';

        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <h4 class="text-md font-semibold text-white mb-1">${job.title}</h4>
                    <p class="text-gray-300 text-sm mb-2">${job.description}</p>
                    <div class="flex items-center space-x-4 text-xs">
                        <span class="text-gray-400">Type: <span class="text-white capitalize">${job.type || 'recurring'}</span></span>
                        <span class="text-gray-400">Assigned: <span class="text-white">${job.assignedTo}</span></span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white">
                            ${job.status}
                        </span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3 text-xs">
                <div class="bg-brand-layer3 rounded p-2">
                    <div class="text-gray-400 mb-1">Budget</div>
                    <div class="text-white font-semibold">$${job.budget.toLocaleString()}</div>
                </div>
                <div class="bg-brand-layer3 rounded p-2">
                    <div class="text-gray-400 mb-1">Due</div>
                    <div class="text-white font-semibold">${job.dueDate || job.nextDue}</div>
                </div>
                <div class="bg-brand-layer3 rounded p-2">
                    <div class="text-gray-400 mb-1">Tasks</div>
                    <div class="text-white font-semibold">${job.tasks.filter(t => t.completed).length}/${job.tasks.length}</div>
                </div>
            </div>
        `;

        return card;
    }

    renderClientContacts() {
        const container = document.getElementById('clientContactsContainer');
        if (!container || !this.currentClientDetail) return;

        const contacts = this.currentClientDetail.contacts || [];

        container.innerHTML = '';

        if (contacts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Contacts</h3>
                    <p class="text-gray-400">No contacts have been added for this client yet.</p>
                </div>
            `;
        } else {
            contacts.forEach(contact => {
                const contactCard = this.createClientContactCard(contact);
                container.appendChild(contactCard);
            });
        }
    }

    createClientContactCard(contact) {
        const card = document.createElement('div');
        card.className = 'bg-brand-layer2 border border-brand-border rounded-lg p-4';

        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="text-md font-semibold text-white mb-1">${contact.name}</h4>
                    <p class="text-gray-300 text-sm mb-2">${contact.role}</p>
                    <div class="space-y-1 text-sm">
                        <div class="flex items-center">
                            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <a href="mailto:${contact.email}" class="text-brand-primary hover:text-brand-secondary">${contact.email}</a>
                        </div>
                        <div class="flex items-center">
                            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <a href="tel:${contact.phone}" class="text-brand-primary hover:text-brand-secondary">${contact.phone}</a>
                        </div>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-brand-primary transition-colors duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
            </div>
        `;

        return card;
    }

    // Old renderClientMeetings function removed - using enhanced version

    // Old createClientMeetingCard function removed - using enhanced version

    // Old renderClientBudget function completely removed

    populateClientDetailForm(client) {
        console.log('Populating client detail form for:', client);
        
        // Safely populate form fields
        const fields = [
            { id: 'clientDetailName', value: client.name || '' },
            { id: 'clientDetailIndustry', value: client.industry || '' },
            { id: 'clientDetailContact', value: client.contact || '' },
            { id: 'clientDetailEmail', value: client.email || '' },
            { id: 'clientDetailPhone', value: client.phone || '' },
            { id: 'clientDetailStartDate', value: client.startDate || '' },
            { id: 'clientDetailStatus', value: client.status || 'current' }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.value = field.value;
            } else {
                console.warn(`Form element not found: ${field.id}`);
            }
        });
        
        // Populate account manager dropdown
        const accountManagerSelect = document.getElementById('clientDetailAccountManager');
        if (accountManagerSelect && this.teamData?.inhouse) {
        accountManagerSelect.innerHTML = '<option value="">Select Account Manager</option>';
        this.teamData.inhouse.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            if (member.name === client.accountManager) {
                option.selected = true;
            }
            accountManagerSelect.appendChild(option);
        });
        }
        
        // Switch to overview tab by default
        this.switchClientDetailTab('overview');
        
        // Render client services
        this.renderClientServices();
    }

    closeClientDetailModal() {
        document.getElementById('clientDetailModal').classList.add('hidden');
        this.currentClientDetail = null;
    }

    saveClientDetail() {
        if (!this.currentClientDetail) return;

        // Update client data
        this.currentClientDetail.name = document.getElementById('clientDetailName').value;
        this.currentClientDetail.industry = document.getElementById('clientDetailIndustry').value;
        this.currentClientDetail.contact = document.getElementById('clientDetailContact').value;
        this.currentClientDetail.email = document.getElementById('clientDetailEmail').value;
        this.currentClientDetail.phone = document.getElementById('clientDetailPhone').value;
        this.currentClientDetail.startDate = document.getElementById('clientDetailStartDate').value;
        this.currentClientDetail.status = document.getElementById('clientDetailStatus').value;
        this.currentClientDetail.accountManager = document.getElementById('clientDetailAccountManager').value;
        // Services are now handled by checkboxes in Account Management tab
        // No need to get them from the form here
        this.currentClientDetail.notes = document.getElementById('clientDetailNotes').value;

        this.saveClientsData();
        this.closeClientDetailModal();
        
        // Refresh relevant sections
        this.renderClients('gm');
        this.renderClients('sg');
        if (this.currentSection === 'my-agenda') {
            this.renderMyAccounts();
        }
    }

    // Permissions System
    applyPermissions() {
        if (!this.currentUser) return;

        const role = this.currentUser.role;
        
        // Hide/show elements based on role
        const addButtons = document.querySelectorAll('#addTeamMemberBtn, #addGMClientBtn, #addSGClientBtn, #addTrainingBtn');
        const editButtons = document.querySelectorAll('.edit-member-btn, .edit-client-btn, .edit-training-btn');
        const deleteButtons = document.querySelectorAll('#deleteMemberBtn, #deleteClientBtn, #deleteTrainingBtn');

        if (role === 'user') {
            // Read-only access
            addButtons.forEach(btn => btn.style.display = 'none');
            editButtons.forEach(btn => btn.style.display = 'none');
            deleteButtons.forEach(btn => btn.style.display = 'none');
        } else if (role === 'manager') {
            // Can edit team and clients, but not training
            addButtons.forEach(btn => {
                if (btn.id === 'addTrainingBtn') {
                    btn.style.display = 'none';
                }
            });
            // Show all other edit buttons
        } else if (role === 'admin') {
            // Full access - show everything
            addButtons.forEach(btn => btn.style.display = '');
            editButtons.forEach(btn => btn.style.display = '');
            deleteButtons.forEach(btn => btn.style.display = '');
        }

        // Add role indicator to logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            const roleText = logoutBtn.querySelector('.role-text') || document.createElement('span');
            roleText.className = 'role-text text-xs text-gray-500 mr-2';
            roleText.textContent = `${this.currentUser.name} (${role})`;
            if (!logoutBtn.querySelector('.role-text')) {
                logoutBtn.insertBefore(roleText, logoutBtn.firstChild);
            }
        }
    }

    hasPermission(action) {
        if (!this.currentUser) return false;
        
        const role = this.currentUser.role;
        
        switch (action) {
            case 'edit_team':
            case 'edit_clients':
                return role === 'admin' || role === 'manager';
            case 'edit_training':
            case 'delete_any':
                return role === 'admin';
            case 'view_all':
                return true; // All roles can view
            default:
                return false;
        }
    }

    // Enhanced Utility Functions
    searchTasks(query) {
        const allTasks = [];
        Object.values(this.tasksData).forEach(divisionTasks => {
            allTasks.push(...divisionTasks);
        });
        
        if (!query) return allTasks;
        
        return allTasks.filter(task => {
            const searchText = [
                task.title,
                task.description,
                this.getClientName(task.clientId),
                this.getJobTitle(task.jobId)
            ].join(' ').toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        });
    }

    getClientName(clientId) {
        if (!clientId) return '';
        const allClients = [...this.clientsData.gm, ...this.clientsData.sg];
        const client = allClients.find(c => c.id === clientId);
        return client ? client.name : '';
    }

    getJobTitle(jobId) {
        if (!jobId) return '';
        const allJobs = [...this.jobsData.recurring, ...this.jobsData.onetime];
        const job = allJobs.find(j => j.id === jobId);
        return job ? job.title : '';
    }

    createDailyPriority(taskId, dateISO = null) {
        const today = dateISO || new Date().toISOString().split('T')[0];
        const newId = Math.max(...Object.values(this.dailyPrioritiesData).flat().map(dp => dp.id), 0) + 1;
        
        const dailyPriority = {
            id: newId,
            taskId: taskId,
            dateISO: today,
            assigneeUserId: this.currentUser.id,
            createdAt: new Date().toISOString()
        };

        if (!this.dailyPrioritiesData[today]) {
            this.dailyPrioritiesData[today] = [];
        }
        
        this.dailyPrioritiesData[today].push(dailyPriority);
        this.saveDailyPrioritiesData();
        return dailyPriority;
    }

    saveDailyPrioritiesData() {
        localStorage.setItem('dailyPrioritiesData', JSON.stringify(this.dailyPrioritiesData));
    }

    getKeyValue(clientId, key) {
        const clientKVs = this.keyValueIndexData[clientId] || [];
        const kv = clientKVs.find(item => item.key === key);
        return kv ? kv.value : null;
    }

    setKeyValue(clientId, key, value) {
        if (!this.keyValueIndexData[clientId]) {
            this.keyValueIndexData[clientId] = [];
        }
        
        const existingIndex = this.keyValueIndexData[clientId].findIndex(item => item.key === key);
        const kvItem = {
            id: existingIndex >= 0 ? this.keyValueIndexData[clientId][existingIndex].id : Date.now(),
            clientId: clientId,
            scope: 'asset',
            scopeId: null,
            key: key,
            value: value,
            updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            this.keyValueIndexData[clientId][existingIndex] = kvItem;
        } else {
            this.keyValueIndexData[clientId].push(kvItem);
        }
        
        this.saveKeyValueIndexData();
    }

    executeTaskTemplateActions(template, formData) {
        if (!template.onCompleteActions) return;
        
        template.onCompleteActions.forEach(action => {
            switch (action.type) {
                case 'create_digital_asset':
                    this.createDigitalAssetFromTemplate(template, formData, action.payload);
                    break;
                case 'capture_credentials':
                    this.captureCredentialsFromTemplate(template, formData, action.payload);
                    break;
                case 'write_kv':
                    this.writeKeyValueFromTemplate(template, formData, action.payload);
                    break;
                case 'set_client_service_active':
                    this.setClientServiceActiveFromTemplate(template, formData, action.payload);
                    break;
            }
        });
    }

    createDigitalAssetFromTemplate(template, formData, payload) {
        const clientId = formData.clientId;
        const ownership = payload.ownershipFrom === 'access_type' ? 
            (formData.access_type ? 'client' : 'ours') : 'client';
        
        const asset = {
            id: Date.now(),
            clientId: clientId,
            type: template.createsAssetType,
            name: formData[payload.map.name],
            accountUrl: formData[payload.map.accountUrl],
            externalId: formData[payload.map.externalId],
            ownership: ownership,
            accessStatus: 'active',
            notes: formData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!this.digitalAssetsData[clientId]) {
            this.digitalAssetsData[clientId] = [];
        }
        this.digitalAssetsData[clientId].push(asset);
        this.saveDigitalAssetsData();
    }

    captureCredentialsFromTemplate(template, formData, payload) {
        const clientId = formData.clientId;
        const digitalAssetId = formData.digitalAssetId;
        
        if (formData[payload.username]) {
            const credential = {
                id: Date.now(),
                clientId: clientId,
                digitalAssetId: digitalAssetId,
                kind: 'username_password',
                label: `${template.title} Credentials`,
                username: formData[payload.username],
                secretRef: formData[payload.password] || '',
                updatedAt: new Date().toISOString(),
                updatedByUserId: this.currentUser.id
            };
            
            if (!this.credentialsData[clientId]) {
                this.credentialsData[clientId] = [];
            }
            this.credentialsData[clientId].push(credential);
            this.saveCredentialsData();
        }
    }

    writeKeyValueFromTemplate(template, formData, payload) {
        const clientId = formData.clientId;
        const value = formData[payload.valueFrom];
        if (value) {
            this.setKeyValue(clientId, payload.key, value);
        }
    }

    setClientServiceActiveFromTemplate(template, formData, payload) {
        const clientId = formData.clientId;
        const active = formData[payload.activeFrom];
        
        if (active && template.activatesService) {
            const service = {
                id: Date.now(),
                clientId: clientId,
                service: template.activatesService,
                status: 'active',
                startedAt: new Date().toISOString(),
                endedAt: null,
                notes: 'Activated via task template'
            };
            
            if (!this.clientServicesData[clientId]) {
                this.clientServicesData[clientId] = [];
            }
            this.clientServicesData[clientId].push(service);
            this.saveClientServicesData();
        }
    }

    // Daily Priority Modal Functions
    openAddDailyPriorityModal() {
        document.getElementById('addDailyPriorityModal').classList.remove('hidden');
        this.showSearchStep();
        this.populateClientSelects();
    }

    closeAddDailyPriorityModal() {
        document.getElementById('addDailyPriorityModal').classList.add('hidden');
        this.showSearchStep();
        this.clearTaskForm();
    }

    showSearchStep() {
        document.getElementById('searchTasksStep').classList.remove('hidden');
        document.getElementById('createTaskStep').classList.add('hidden');
        document.getElementById('backToSearchBtn').classList.add('hidden');
        document.getElementById('submitDailyPriorityBtn').textContent = 'Add to Today\'s Priorities';
    }

    showCreateTaskStep() {
        document.getElementById('searchTasksStep').classList.add('hidden');
        document.getElementById('createTaskStep').classList.remove('hidden');
        document.getElementById('backToSearchBtn').classList.remove('hidden');
        document.getElementById('submitDailyPriorityBtn').textContent = 'Create Task & Add to Today';
    }

    populateClientSelects() {
        const clientSelect = document.getElementById('newTaskClient');
        const jobSelect = document.getElementById('newTaskJob');
        
        if (clientSelect) {
            clientSelect.innerHTML = '<option value="">Select Client</option>';
            const allClients = [...this.clientsData.gm, ...this.clientsData.sg];
            allClients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
        }
        
        if (jobSelect) {
            jobSelect.innerHTML = '<option value="">Select Job</option>';
            const allJobs = [...this.jobsData.recurring, ...this.jobsData.onetime];
            allJobs.forEach(job => {
                const option = document.createElement('option');
                option.value = job.id;
                option.textContent = job.title;
                jobSelect.appendChild(option);
            });
        }
    }

    searchTasks() {
        const query = document.getElementById('taskSearchInput').value;
        const results = this.searchTasks(query);
        this.displayTaskSearchResults(results);
    }

    displayTaskSearchResults(tasks) {
        const container = document.getElementById('searchResults');
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No tasks found</p>';
            return;
        }
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'p-3 bg-brand-layer2 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-layer3 transition-colors duration-200';
            taskElement.innerHTML = `
                <div class="font-medium text-white">${task.title}</div>
                <div class="text-sm text-gray-400">${this.getClientName(task.clientId)}</div>
                <div class="text-xs text-gray-500">${task.status} • ${task.priority} priority</div>
            `;
            taskElement.onclick = () => this.selectExistingTask(task);
            container.appendChild(taskElement);
        });
    }

    selectExistingTask(task) {
        this.createDailyPriority(task.id);
        this.closeAddDailyPriorityModal();
        this.renderDailyPriorities();
    }

    submitDailyPriority() {
        if (document.getElementById('createTaskStep').classList.contains('hidden')) {
            // We're in search mode, this shouldn't happen
            return;
        }
        
        const formData = {
            clientId: document.getElementById('newTaskClient').value,
            jobId: document.getElementById('newTaskJob').value || null,
            title: document.getElementById('newTaskTitle').value,
            description: document.getElementById('newTaskDescription').value,
            priority: document.getElementById('newTaskPriority').value,
            dueDate: document.getElementById('newTaskDueDate').value,
            status: 'in_progress'
        };
        
        // Create the task first
        const newTask = this.createTask(formData);
        
        // Then add it to today's priorities
        this.createDailyPriority(newTask.id);
        
        this.closeAddDailyPriorityModal();
        this.renderDailyPriorities();
    }

    createTask(formData) {
        const newId = Math.max(...Object.values(this.tasksData).flat().map(t => t.id), 0) + 1;
        const task = {
            id: newId,
            ...formData,
            assigneeUserId: this.currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to appropriate division based on client
        const client = [...this.clientsData.gm, ...this.clientsData.sg].find(c => c.id == formData.clientId);
        const division = client?.type || 'gm';
        
        if (!this.tasksData[division]) {
            this.tasksData[division] = [];
        }
        this.tasksData[division].push(task);
        
        this.saveTasksData();
        return task;
    }

    clearTaskForm() {
        document.getElementById('createTaskForm').reset();
    }

    renderDailyPriorities() {
        const today = new Date().toISOString().split('T')[0];
        const priorities = this.dailyPrioritiesData[today] || [];
        
        console.log('Today\'s priorities:', priorities);
        console.log('All tasks data:', this.tasksData);
        
        const container = document.getElementById('dailyPrioritiesList');
        if (!container) {
            console.error('Daily priorities container not found');
            return;
        }
        
        if (priorities.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No daily priorities set for today</p>';
            return;
        }
        
        container.innerHTML = '';
        priorities.forEach(priority => {
            const task = this.findTaskById(priority.taskId);
            if (task) {
                const priorityElement = this.createDailyPriorityElement(task, priority);
                container.appendChild(priorityElement);
            }
        });
    }

    // Task Template Functions
    openTaskTemplateModal(templateId) {
        const template = this.taskTemplatesData.find(t => t.id === templateId);
        if (!template) return;
        
        document.getElementById('taskTemplateModalTitle').textContent = template.title;
        this.renderTemplateFields(template);
        document.getElementById('taskTemplateModal').classList.remove('hidden');
    }

    closeTaskTemplateModal() {
        document.getElementById('taskTemplateModal').classList.add('hidden');
    }

    renderTemplateFields(template) {
        const container = document.getElementById('templateFields');
        container.innerHTML = '';
        
        template.fields.forEach(field => {
            const fieldElement = this.createTemplateField(field);
            container.appendChild(fieldElement);
        });
    }

    createTemplateField(field) {
        const div = document.createElement('div');
        div.className = 'space-y-2';
        
        const label = document.createElement('label');
        label.className = 'block text-sm font-medium text-white';
        label.textContent = field.label;
        
        let input;
        switch (field.kind) {
            case 'text':
            case 'url':
            case 'email':
            case 'id':
                input = document.createElement('input');
                input.type = field.kind === 'url' ? 'url' : 'text';
                input.className = 'w-full px-4 py-3 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary';
                break;
            case 'note':
                input = document.createElement('textarea');
                input.rows = 3;
                input.className = 'w-full px-4 py-3 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary';
                break;
            case 'number':
                input = document.createElement('input');
                input.type = 'number';
                input.className = 'w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary';
                break;
            case 'bool':
                input = document.createElement('select');
                input.className = 'w-full px-4 py-3 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary';
                input.innerHTML = '<option value="true">Yes</option><option value="false">No</option>';
                break;
        }
        
        input.id = `template_${field.key}`;
        input.name = field.key;
        
        div.appendChild(label);
        div.appendChild(input);
        return div;
    }

    handleTaskTemplateSubmit(e) {
        e.preventDefault();
        
        const formData = {};
        const form = e.target;
        const formElements = form.elements;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.value) {
                formData[element.name] = element.value;
            }
        }
        
        // Execute template actions
        const template = this.taskTemplatesData.find(t => t.id === 'tpl_asset_google_ads'); // This should be dynamic
        this.executeTaskTemplateActions(template, formData);
        
        this.closeTaskTemplateModal();
        // Refresh relevant UI
    }

    // Enhanced Client Detail Functions
    saveQuickNote() {
        const noteText = document.getElementById('quickAddNote').value.trim();
        if (!noteText || !this.currentClientDetail) return;
        
        const note = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            jobId: null,
            authorUserId: this.currentUser.id,
            body: noteText,
            createdAt: new Date().toISOString()
        };
        
        if (!this.notesData[this.currentClientDetail.id]) {
            this.notesData[this.currentClientDetail.id] = [];
        }
        this.notesData[this.currentClientDetail.id].push(note);
        
        this.saveNotesData();
        document.getElementById('quickAddNote').value = '';
        
        // Show success message
        alert('Note added successfully!');
    }

    switchClientDetailTab(tab) {
        // Hide all tab contents
        document.querySelectorAll('.client-detail-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active state from all tab buttons
        document.querySelectorAll('.client-detail-tab-button').forEach(button => {
            button.classList.remove('bg-brand-primary', 'text-black');
            button.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer3');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(`client${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }
        
        // Handle special case for account-management
        if (tab === 'account-management') {
            const accountTab = document.getElementById('clientAccountManagementTab');
            if (accountTab) accountTab.classList.remove('hidden');
        }
        
        // Activate selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tab}"]`);
        if (selectedButton) {
            selectedButton.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer3');
            selectedButton.classList.add('bg-brand-primary', 'text-black');
        }
        
        // Render content based on tab
        switch(tab) {
            case 'overview':
                this.renderClientOverview();
                break;
            case 'contacts':
                this.renderClientContacts();
                break;
            case 'jobs':
                this.renderClientJobs();
                break;
            case 'account-management':
                this.renderClientAccountManagement();
                break;
            case 'notes':
                this.renderClientNotes();
                break;
            case 'meeting-transcriptions':
                this.renderClientMeetingTranscriptions();
                break;
        }
    }

    renderClientAccountManagement() {
        const container = document.getElementById('clientAccountManagementTab');
        if (!container || !this.currentClientDetail) return;
        
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left: Digital Assets -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">Digital Assets</h3>
                        <button id="addDigitalAssetBtn" class="px-3 py-1 bg-brand-primary text-black rounded text-sm font-medium hover:bg-yellow-400 transition-colors duration-200">
                            + Add Asset
                        </button>
                    </div>
                    <div id="clientDigitalAssetsList" class="space-y-3">
                        <!-- Digital assets will be populated here -->
                    </div>
                </div>
                
                <!-- Right: Budgets -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">Budgets</h3>
                        <button id="addBudgetBtn" class="px-3 py-1 bg-brand-primary text-black rounded text-sm font-medium hover:bg-yellow-400 transition-colors duration-200">
                            + Add Budget
                        </button>
                    </div>
                    <div id="clientBudgetsList" class="space-y-3">
                        <!-- Budgets will be populated here -->
                    </div>
                </div>
            </div>
        `;
        
        // Populate digital assets
        this.renderClientDigitalAssets();
        
        // Populate budgets
        this.renderClientBudgets();
        
        // Setup event listeners
        this.setupAccountManagementListeners();
    }

    renderDigitalAssets() {
        const container = document.getElementById('digitalAssetsContainer');
        if (!container || !this.currentClientDetail) return;
        
        const assets = this.digitalAssetsData[this.currentClientDetail.id] || [];
        
        container.innerHTML = '';
        
        if (assets.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No digital assets found</p>';
            return;
        }
        
        assets.forEach(asset => {
            const assetElement = this.createDigitalAssetElement(asset);
            container.appendChild(assetElement);
        });
    }

    createDigitalAssetElement(asset) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-brand-layer2 border border-brand-border rounded-lg';
        
        const statusColors = {
            'active': 'bg-green-500',
            'requested': 'bg-yellow-500',
            'revoked': 'bg-red-500'
        };
        
        const ownershipColors = {
            'ours': 'bg-blue-500',
            'client': 'bg-purple-500'
        };
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-white">${asset.name || asset.type}</div>
                <div class="flex space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[asset.accessStatus]} text-white">
                        ${asset.accessStatus}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ownershipColors[asset.ownership]} text-white">
                        ${asset.ownership}
                    </span>
                </div>
            </div>
            <div class="text-sm text-gray-400 mb-2">${asset.type.replace(/_/g, ' ').toUpperCase()}</div>
            ${asset.externalId ? `<div class="text-xs text-gray-500">ID: ${asset.externalId}</div>` : ''}
            ${asset.notes ? `<div class="text-xs text-gray-400 mt-2">${asset.notes}</div>` : ''}
        `;
        
        return div;
    }

    renderClientDigitalAssets() {
        const container = document.getElementById('clientDigitalAssetsList');
        if (!container || !this.currentClientDetail) return;
        
        const clientAssets = this.digitalAssetsData[this.currentClientDetail.id] || [];
        
        if (clientAssets.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-sm">No digital assets found</p>';
            return;
        }
        
        container.innerHTML = clientAssets.map(asset => `
            <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-layer3 transition-colors duration-200" onclick="guerrillaCommandPost.openDigitalAssetDrawer(${asset.id})">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-white">${asset.type}</div>
                        <div class="text-sm text-gray-400">${asset.name || 'N/A'}</div>
                        <div class="text-sm text-gray-400">${asset.ownership} • ${asset.accessStatus}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-400">${asset.externalId || 'No ID'}</div>
                        <div class="text-xs text-gray-400">${asset.accountUrl ? 'Has URL' : 'No URL'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderClientBudgets() {
        const container = document.getElementById('clientBudgetsList');
        if (!container || !this.currentClientDetail) return;
        
        const clientServices = this.clientServicesData[this.currentClientDetail.id] || [];
        const activeServices = clientServices.filter(service => service.status === 'active');
        const clientBudgets = this.budgetAllocationsData[this.currentClientDetail.id] || [];
        
        // Calculate total monthly spend
        const totalMonthly = clientBudgets.reduce((sum, budget) => sum + (budget.monthlyAmount || 0), 0);
        
        let budgetHtml = '';
        
        if (totalMonthly > 0) {
            budgetHtml += `
                <div class="p-3 bg-brand-primary text-black rounded-lg mb-3">
                    <div class="font-bold text-lg">Total Monthly: $${totalMonthly.toLocaleString()}</div>
                </div>
            `;
        }
        
        // Show all services with their budget status
        const allServices = ['Google Ads', 'Meta Ads', 'Local Services Ads', 'Website Hosting', 'SEO', 'Content Creation'];
        
        allServices.forEach(serviceName => {
            const service = activeServices.find(s => s.service === serviceName);
            const budget = clientBudgets.find(b => b.service === serviceName);
            const isActive = service && service.status === 'active';
            
            budgetHtml += `
                <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg ${!isActive ? 'opacity-50' : ''}">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium text-white">${serviceName}</div>
                            <div class="text-sm text-gray-400">
                                ${isActive ? `Active since ${new Date(service.startedAt).toLocaleDateString()}` : 'Inactive'}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold text-white">$${budget?.monthlyAmount?.toLocaleString() || '0'}/month</div>
                            ${isActive ? 
                                `<button onclick="guerrillaCommandPost.updateBudget('${serviceName}', ${budget?.monthlyAmount || 0})" class="text-xs text-brand-primary hover:text-yellow-400">Update</button>` :
                                `<button onclick="guerrillaCommandPost.activateService('${serviceName}')" class="text-xs text-green-400 hover:text-green-300">Activate</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (activeServices.length === 0) {
            budgetHtml += '<p class="text-gray-400 text-sm mt-3">No active services - activate services to start budgeting</p>';
        }
        
        container.innerHTML = budgetHtml;
    }

    setupAccountManagementListeners() {
        document.getElementById('addDigitalAssetBtn')?.addEventListener('click', () => this.openAddDigitalAssetModal());
        document.getElementById('addBudgetBtn')?.addEventListener('click', () => this.openAddBudgetModal());
        
        // Add missing event listeners for client management
        document.getElementById('addClientJobBtn')?.addEventListener('click', () => this.openAddClientJobModal());
        document.getElementById('addClientContactBtn')?.addEventListener('click', () => this.openAddClientContactModal());
        document.getElementById('addRecurringJobBtn')?.addEventListener('click', () => this.openAddRecurringJobModal());
        document.getElementById('addOnetimeJobBtn')?.addEventListener('click', () => this.openAddOnetimeJobModal());
    }
    
    // Activate a service for a client
    activateService(serviceName) {
        if (!this.currentClientDetail) return;
        
        const clientId = this.currentClientDetail.id;
        if (!this.clientServicesData[clientId]) {
            this.clientServicesData[clientId] = [];
        }
        
        // Check if service already exists
        const existingService = this.clientServicesData[clientId].find(s => s.service === serviceName);
        if (existingService) {
            existingService.status = 'active';
            existingService.startedAt = new Date().toISOString();
        } else {
            // Create new service
            this.clientServicesData[clientId].push({
                id: Date.now(),
                clientId: clientId,
                service: serviceName,
                status: 'active',
                startedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });
        }
        
        this.saveClientServicesData();
        this.renderClientBudgets();
        this.showToast(`Service "${serviceName}" activated for ${this.currentClientDetail.name}`, 'success');
    }

    openAddDigitalAssetModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">Add Digital Asset</h2>
                    <button class="text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form id="addDigitalAssetForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Asset Type *</label>
                        <select name="assetType" id="assetType" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required>
                            <option value="">Select Type</option>
                            <option value="google_ads_account">Google Ads Account</option>
                            <option value="meta_ads_account">Meta Ads Account</option>
                            <option value="google_analytics_4">Google Analytics 4</option>
                            <option value="website_hosting">Website Hosting</option>
                            <option value="domain">Domain</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input type="text" name="assetName" id="assetName" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">External ID</label>
                        <input type="text" name="externalId" id="externalId" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Ownership *</label>
                        <select name="ownership" id="ownership" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required>
                            <option value="">Select Ownership</option>
                            <option value="ours">Ours</option>
                            <option value="client">Client</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                            Add Asset
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addDigitalAssetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddDigitalAsset(e);
        });
    }

    openAddBudgetModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">Add Budget</h2>
                    <button class="text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form id="addBudgetForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Budget Type *</label>
                        <select name="budgetType" id="budgetType" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required>
                            <option value="">Select Budget Type</option>
                            <option value="google">Google Ad Spend</option>
                            <option value="meta">Meta Ad Spend</option>
                            <option value="lsa">Local Services Ad Spend</option>
                            <option value="total">Total Ad Budget</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Monthly Amount *</label>
                        <input type="number" name="monthlyAmount" id="monthlyAmount" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required min="0" step="100">
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                            Add Budget
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addBudgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBudget(e);
        });
    }

    handleAddDigitalAsset(e) {
        const formData = new FormData(e.target);
        const assetData = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            type: formData.get('assetType'),
            name: formData.get('assetName'),
            externalId: formData.get('externalId'),
            ownership: formData.get('ownership'),
            accessStatus: 'active',
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!this.digitalAssetsData[this.currentClientDetail.id]) {
            this.digitalAssetsData[this.currentClientDetail.id] = [];
        }
        
        this.digitalAssetsData[this.currentClientDetail.id].push(assetData);
        this.saveDigitalAssetsData();
        
        // Refresh the display
        this.renderClientDigitalAssets();
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        alert('Digital asset added successfully!');
    }

    handleAddBudget(e) {
        const formData = new FormData(e.target);
        const budgetType = formData.get('budgetType');
        const monthlyAmount = parseFloat(formData.get('monthlyAmount'));
        
        // Check if this service is active for the client
        const clientServices = this.clientServicesData[this.currentClientDetail.id] || [];
        const isServiceActive = clientServices.some(service => 
            service.service === budgetType && service.status === 'active'
        );
        
        if (!isServiceActive) {
            // Prompt to activate the service
            const shouldActivate = confirm(`This client doesn't have ${budgetType} active. Add the service?`);
            if (shouldActivate) {
                // Add the service to client services
                if (!this.clientServicesData[this.currentClientDetail.id]) {
                    this.clientServicesData[this.currentClientDetail.id] = [];
                }
                
                this.clientServicesData[this.currentClientDetail.id].push({
                    id: Date.now(),
                    clientId: this.currentClientDetail.id,
                    service: budgetType,
                    status: 'active',
                    createdAt: new Date().toISOString()
                });
                
                this.saveClientServicesData();
                this.renderClientServices(); // Refresh services display
            }
        }
        
        const budgetData = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            service: budgetType,
            monthlyAmount: monthlyAmount,
            active: true,
            updatedAt: new Date().toISOString(),
            updatedByUserId: this.currentUser?.id || 'user_1'
        };
        
        if (!this.budgetAllocationsData[this.currentClientDetail.id]) {
            this.budgetAllocationsData[this.currentClientDetail.id] = [];
        }
        
        this.budgetAllocationsData[this.currentClientDetail.id].push(budgetData);
        this.saveBudgetAllocationsData();
        
        // Refresh the display
        this.renderClientBudgets();
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        alert('Budget added successfully!');
    }

    renderBudgets() {
        const container = document.getElementById('budgetsContainer');
        if (!container || !this.currentClientDetail) return;
        
        const activeServices = this.clientServicesData[this.currentClientDetail.id]?.filter(s => s.status === 'active') || [];
        const budgets = this.budgetAllocationsData[this.currentClientDetail.id] || [];
        
        container.innerHTML = '';
        
        activeServices.forEach(service => {
            const budget = budgets.find(b => b.service === service.service);
            const budgetElement = this.createBudgetElement(service, budget);
            container.appendChild(budgetElement);
        });
    }

    createBudgetElement(service, budget) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-brand-layer2 border border-brand-border rounded-lg';
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-white">${service.service.replace(/_/g, ' ').toUpperCase()}</div>
                <div class="text-sm text-gray-400">Active</div>
            </div>
            <div class="flex items-center space-x-2">
                <input type="number" 
                       value="${budget?.monthlyAmount || 0}" 
                       placeholder="Monthly amount"
                       class="flex-1 px-3 py-2 bg-brand-layer3 border border-brand-border rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                       onchange="this.updateBudget('${service.service}', this.value)">
                <span class="text-sm text-gray-400">/month</span>
            </div>
        `;
        
        return div;
    }

    updateBudget(service, amount) {
        if (!this.currentClientDetail) return;
        
        const clientId = this.currentClientDetail.id;
        if (!this.budgetAllocationsData[clientId]) {
            this.budgetAllocationsData[clientId] = [];
        }
        
        const existingIndex = this.budgetAllocationsData[clientId].findIndex(b => b.service === service);
        const budgetItem = {
            id: existingIndex >= 0 ? this.budgetAllocationsData[clientId][existingIndex].id : Date.now(),
            clientId: clientId,
            service: service,
            monthlyAmount: parseFloat(amount) || 0,
            active: true,
            updatedAt: new Date().toISOString(),
            updatedByUserId: this.currentUser.id
        };
        
        if (existingIndex >= 0) {
            this.budgetAllocationsData[clientId][existingIndex] = budgetItem;
        } else {
            this.budgetAllocationsData[clientId].push(budgetItem);
        }
        
        this.saveBudgetAllocationsData();
        this.updateTotalMonthlySpend();
    }

    updateTotalMonthlySpend() {
        const container = document.getElementById('totalMonthlySpend');
        if (!container || !this.currentClientDetail) return;
        
        const budgets = this.budgetAllocationsData[this.currentClientDetail.id] || [];
        const total = budgets.reduce((sum, budget) => sum + (budget.monthlyAmount || 0), 0);
        
        container.textContent = `$${total.toLocaleString()}`;
    }

    renderClientNotes() {
        const container = document.getElementById('notesContainer');
        if (!container || !this.currentClientDetail) return;
        
        const notes = this.notesData[this.currentClientDetail.id] || [];
        
        container.innerHTML = '';
        
        if (notes.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No notes found</p>';
            return;
        }
        
        // Sort notes by creation date, newest first
        const sortedNotes = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedNotes.forEach(note => {
            const noteElement = this.createNoteElement(note);
            container.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const div = document.createElement('div');
        div.className = 'p-4 bg-brand-layer2 border border-brand-border rounded-lg';
        
        const date = new Date(note.createdAt).toLocaleString();
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm text-gray-400">${date}</div>
            </div>
            <div class="text-white">${note.body}</div>
        `;
        
        return div;
    }

    renderClientMeetingTranscriptions() {
        const container = document.getElementById('meetingTranscriptionsContainer');
        if (!container || !this.currentClientDetail) return;
        
        const transcriptions = this.meetingTranscriptionsData[this.currentClientDetail.id] || [];
        
        container.innerHTML = '';
        
        if (transcriptions.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No meeting transcriptions found</p>';
            return;
        }
        
        transcriptions.forEach(transcription => {
            const transcriptionElement = this.createMeetingTranscriptionElement(transcription);
            container.appendChild(transcriptionElement);
        });
    }

    createMeetingTranscriptionElement(transcription) {
        const div = document.createElement('div');
        div.className = 'p-4 bg-brand-layer2 border border-brand-border rounded-lg';
        
        const date = new Date(transcription.createdAt).toLocaleString();
        const meetingDate = transcription.meetingStart ? new Date(transcription.meetingStart).toLocaleString() : 'Not specified';
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="text-sm text-gray-400">${date}</div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                    ${transcription.source}
                </span>
            </div>
            <div class="mb-2">
                <div class="text-white font-medium">Meeting: ${meetingDate}</div>
                ${transcription.participants ? `<div class="text-sm text-gray-400">Participants: ${transcription.participants.join(', ')}</div>` : ''}
            </div>
            ${transcription.summary ? `<div class="text-sm text-gray-300 mb-2">${transcription.summary}</div>` : ''}
            ${transcription.actionItems ? `<div class="text-sm text-gray-300 mb-2">Action Items: ${transcription.actionItems.join(', ')}</div>` : ''}
            ${transcription.transcriptText ? `<div class="text-sm text-gray-400 mt-3 p-2 bg-brand-layer3 rounded">${transcription.transcriptText}</div>` : ''}
        `;
        
        return div;
    }
    
    renderClientServices() {
        const container = document.getElementById('clientServicesContainer');
        if (!container) return;
        
        // Get services from client data
        const services = this.currentClientDetail.services || [];
        
        // Clear existing content
        container.innerHTML = '';
        
        // Service options
        const serviceOptions = [
            { value: 'meta_ads_management', label: 'Meta Ads Management' },
            { value: 'google_ads_management', label: 'Google Ads Management' },
            { value: 'local_service_ads', label: 'Local Service Ads' },
            { value: 'monthly_seo', label: 'Monthly SEO' },
            { value: 'website_design_hosting', label: 'Website Design & Hosting' },
            { value: 'promo_landing_pages', label: 'Promo Landing Pages' },
            { value: 'premier_content_capture', label: 'Premier Content Capture' },
            { value: 'social_media_management', label: 'Social Media Management' },
            { value: 'streaming_campaigns', label: 'Streaming Campaigns' },
            { value: 'branding_films', label: 'Branding Films' },
            { value: 'website_maintenance_hourly', label: 'Website Maintenance (Hourly)' },
            { value: 'website_maintenance_monthly', label: 'Website Maintenance (Monthly)' },
            { value: 'website_content_additions', label: 'Website Content Additions' },
            { value: 'logo_creation_refresh', label: 'Logo Creation/Refresh' },
            { value: 'brand_guidelines_book', label: 'Brand Guidelines Book' },
            { value: 'photography', label: 'Photography' },
            { value: 'animations', label: 'Animations' },
            { value: 'shedhub_seo_gold', label: 'ShedHub SEO Gold' },
            { value: 'other_service', label: 'Other Service' }
        ];
        
        // Create checkbox for each service
        serviceOptions.forEach(option => {
            const div = document.createElement('div');
            div.className = 'flex items-center';
            div.innerHTML = `
                <label class="flex items-center cursor-pointer">
                    <input type="checkbox" value="${option.value}" 
                           ${services.includes(option.value) ? 'checked' : ''} 
                           class="mr-2 rounded border-brand-border text-brand-primary focus:ring-brand-primary service-checkbox">
                    <span class="text-white text-sm">${option.label}</span>
                </label>
            `;
            container.appendChild(div);
        });
        
        // Add event listeners to checkboxes
        container.querySelectorAll('.service-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateClientServices();
            });
        });
    }

    // Add event listeners for Settings forms
    setupSettingsFormListeners() {
        // Profile form
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileSettings();
        });

        // Notifications form
        document.getElementById('notificationsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotificationSettings();
        });

        // Gmail connection
        document.getElementById('connectGmailBtn')?.addEventListener('click', () => {
            this.connectGmail();
        });

        // Add mapping button
        document.getElementById('addMappingBtn')?.addEventListener('click', () => {
            this.addFieldMapping();
        });

        // Add webhook button
        document.getElementById('addWebhookBtn')?.addEventListener('click', () => {
            this.addOutboundWebhook();
        });

        // Process sample payload
        document.getElementById('processSamplePayloadBtn')?.addEventListener('click', () => {
            this.processSamplePayload();
        });

        // Test webhooks
        document.getElementById('testWebhooksBtn')?.addEventListener('click', () => {
            this.testWebhooks();
        });

        // Remove mapping and webhook handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('removeMappingBtn')) {
                e.target.closest('.flex').remove();
            }
            if (e.target.classList.contains('removeWebhookBtn')) {
                e.target.closest('.flex').remove();
            }
        });

        console.log('Settings form listeners setup complete');
    }

    // Update client services from checkboxes
    updateClientServices() {
        if (!this.currentClientDetail) return;
        
        const checkboxes = document.querySelectorAll('#clientServicesContainer .service-checkbox:checked');
        const selectedServices = Array.from(checkboxes).map(cb => cb.value);
        
        this.currentClientDetail.services = selectedServices;
        
        // Save to clientServicesData
        if (!this.clientServicesData[this.currentClientDetail.id]) {
            this.clientServicesData[this.currentClientDetail.id] = [];
        }
        
        // Update existing services or add new ones
        selectedServices.forEach(serviceValue => {
            const existingService = this.clientServicesData[this.currentClientDetail.id].find(s => s.service === serviceValue);
            if (!existingService) {
                this.clientServicesData[this.currentClientDetail.id].push({
                    id: Date.now(),
                    clientId: this.currentClientDetail.id,
                    service: serviceValue,
                    status: 'active',
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        this.saveClientServicesData();
    }
    
    renderClientOverview() {
        // This function is called when the overview tab is selected
        // It ensures the services dropdown is properly populated
        this.renderClientServices();
    }

    // Modal Functions
    openAddDigitalAssetModal() {
        document.getElementById('addDigitalAssetModal').classList.remove('hidden');
    }

    closeAddDigitalAssetModal() {
        document.getElementById('addDigitalAssetModal').classList.add('hidden');
        document.getElementById('addDigitalAssetForm').reset();
    }
    
    // Generic modal close function
    closeModal(modalSelector = '.fixed') {
        const modal = document.querySelector(modalSelector);
        if (modal) {
            modal.remove();
        }
    }
    
    // Setup modal close handlers
    setupModalCloseHandlers() {
        // Close button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || 
                e.target.closest('.close-modal') ||
                e.target.textContent === 'Cancel' ||
                e.target.textContent === 'X') {
                e.preventDefault();
                this.closeModal();
            }
        });
        
        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openAddNoteModal() {
        document.getElementById('addNoteModal').classList.remove('hidden');
    }

    closeAddNoteModal() {
        document.getElementById('addNoteModal').classList.add('hidden');
        document.getElementById('addNoteForm').reset();
    }

    openAddMeetingTranscriptionModal() {
        document.getElementById('addMeetingTranscriptionModal').classList.remove('hidden');
    }

    closeAddMeetingTranscriptionModal() {
        document.getElementById('addMeetingTranscriptionModal').classList.add('hidden');
        document.getElementById('addMeetingTranscriptionModal').reset();
    }

    handleAddDigitalAsset(e) {
        e.preventDefault();
        
        if (!this.currentClientDetail) return;
        
        const formData = {
            type: document.getElementById('assetType').value,
            name: document.getElementById('assetName').value,
            accountUrl: document.getElementById('assetUrl').value,
            externalId: document.getElementById('assetExternalId').value,
            ownership: document.getElementById('assetOwnership').value,
            accessStatus: document.getElementById('assetAccessStatus').value,
            notes: document.getElementById('assetNotes').value
        };
        
        const asset = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!this.digitalAssetsData[this.currentClientDetail.id]) {
            this.digitalAssetsData[this.currentClientDetail.id] = [];
        }
        this.digitalAssetsData[this.currentClientDetail.id].push(asset);
        
        this.saveDigitalAssetsData();
        this.closeAddDigitalAssetModal();
        this.renderDigitalAssets();
    }

    handleAddNote(e) {
        e.preventDefault();
        
        if (!this.currentClientDetail) return;
        
        const note = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            jobId: null,
            authorUserId: this.currentUser.id,
            body: document.getElementById('noteBody').value,
            createdAt: new Date().toISOString()
        };
        
        if (!this.notesData[this.currentClientDetail.id]) {
            this.notesData[this.currentClientDetail.id] = [];
        }
        this.notesData[this.currentClientDetail.id].push(note);
        this.saveNotesData();
        this.closeAddNoteModal();
        this.renderClientNotes();
    }

    handleAddMeetingTranscription(e) {
        e.preventDefault();
        
        if (!this.currentClientDetail) return;
        
        const transcription = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            jobId: null,
            source: document.getElementById('transcriptionSource').value,
            meetingStart: document.getElementById('meetingStart').value,
            participants: document.getElementById('participants').value ? document.getElementById('participants').value.split(',').map(p => p.trim()) : [],
            summary: document.getElementById('meetingSummary').value,
            actionItems: document.getElementById('actionItems').value ? document.getElementById('actionItems').value.split(',').map(a => a.trim()) : [],
            transcriptText: document.getElementById('transcriptText').value,
            transcriptFileUrl: null,
            messageId: null,
            createdAt: new Date().toISOString()
        };
        
        if (!this.meetingTranscriptionsData[this.currentClientDetail.id]) {
            this.meetingTranscriptionsData[this.currentClientDetail.id] = [];
        }
        this.meetingTranscriptionsData[this.currentClientDetail.id].push(transcription);
        
        this.saveMeetingTranscriptionsData();
        this.closeAddMeetingTranscriptionModal();
        this.renderClientMeetingTranscriptions();
    }
    
    // Add missing modal functions
    openAddClientJobModal() {
        console.log('Opening add client job modal...');
        
        // Remove any existing modals first
        const existingModal = document.querySelector('.fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-2xl w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Add Client Job</h2>
                        <button id="closeAddClientJobModal" class="text-gray-400 hover:text-white transition-colors duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="addClientJobForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Job Title *</label>
                            <input type="text" id="jobTitle" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Job Type</label>
                            <select id="jobType" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                <option value="">Select Type</option>
                                <option value="recurring">Recurring</option>
                                <option value="onetime">One-time</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea id="jobDescription" rows="3" placeholder="Describe the job requirements..." class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                            <input type="date" id="jobDueDate" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t border-brand-border">
                            <button type="button" id="cancelAddClientJobBtn" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                                Add Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Setup event listeners
        document.getElementById('closeAddClientJobModal')?.addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddClientJobBtn')?.addEventListener('click', () => modal.remove());
        document.getElementById('addClientJobForm')?.addEventListener('submit', (e) => this.handleAddClientJob(e));
    }
    
    openAddClientContactModal() {
        console.log('Opening add client contact modal...');
        
        // Remove any existing modals first
        const existingModal = document.querySelector('.fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-2xl w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Add Client Contact</h2>
                        <button id="closeAddClientContactModal" class="text-gray-400 hover:text-white transition-colors duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="addClientContactForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                            <input type="text" id="contactName" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input type="email" id="contactEmail" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input type="tel" id="contactPhone" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <input type="text" id="contactRole" placeholder="e.g., CEO, Marketing Manager..." class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t border-brand-border">
                            <button type="button" id="cancelAddClientContactBtn" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                                Add Contact
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Setup event listeners
        document.getElementById('closeAddClientContactModal')?.addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddClientContactBtn')?.addEventListener('click', () => modal.remove());
        document.getElementById('addClientContactForm')?.addEventListener('submit', (e) => this.handleAddClientContact(e));
    }
    
    openAddRecurringJobModal() {
        console.log('Opening add recurring job modal...');
        
        // Remove any existing modals first
        const existingModal = document.querySelector('.fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-2xl w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Add Recurring Job</h2>
                        <button id="closeAddRecurringJobModal" class="text-gray-400 hover:text-white transition-colors duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="addRecurringJobForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Job Title *</label>
                            <input type="text" id="recurringJobTitle" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Client</label>
                            <select id="recurringJobClient" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                <option value="">Select Client</option>
                                ${this.clientsData.gm.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                                ${this.clientsData.sg.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                            <select id="recurringJobFrequency" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                <option value="">Select Frequency</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea id="recurringJobDescription" rows="3" placeholder="Describe the recurring job..." class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"></textarea>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t border-brand-border">
                            <button type="button" id="cancelAddRecurringJobBtn" class="px-4 py-2 text-gray-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                                Add Recurring Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Setup event listeners
        document.getElementById('closeAddRecurringJobModal')?.addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddRecurringJobBtn')?.addEventListener('click', () => modal.remove());
        document.getElementById('addRecurringJobForm')?.addEventListener('submit', (e) => this.handleAddRecurringJob(e));
    }
    
    openAddOnetimeJobModal() {
        console.log('Opening add onetime job modal...');
        
        // Remove any existing modals first
        const existingModal = document.querySelector('.fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-2xl w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Add One-time Job</h2>
                        <button id="closeAddOnetimeJobModal" class="text-gray-400 hover:text-white transition-colors duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="addOnetimeJobForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Job Title *</label>
                            <input type="text" id="onetimeJobTitle" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Client</label>
                            <select id="onetimeJobClient" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                <option value="">Select Client</option>
                                ${this.clientsData.gm.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                                ${this.clientsData.sg.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-1">Due Date</label>
                            <input type="date" id="onetimeJobDueDate" required class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea id="onetimeJobDescription" rows="3" placeholder="Describe the one-time job..." class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"></textarea>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t border-brand-border">
                            <button type="button" id="cancelAddOnetimeJobBtn" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
                                Cancel
                            </button>
                            <button type="submit" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                                Add One-time Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Setup event listeners
        document.getElementById('closeAddOnetimeJobModal')?.addEventListener('click', () => modal.remove());
        document.getElementById('cancelAddOnetimeJobBtn')?.addEventListener('click', () => modal.remove());
        document.getElementById('addOnetimeJobForm')?.addEventListener('submit', (e) => this.handleAddOnetimeJob(e));
    }

    // Add missing handler functions
    handleAddClientJob(e) {
        e.preventDefault();
        
        if (!this.currentClientDetail) return;
        
        const formData = {
            title: document.getElementById('jobTitle').value,
            type: document.getElementById('jobType').value,
            description: document.getElementById('jobDescription').value,
            dueDate: document.getElementById('jobDueDate').value
        };
        
        const job = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            ...formData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!this.jobsData[this.currentClientDetail.id]) {
            this.jobsData[this.currentClientDetail.id] = [];
        }
        this.jobsData[this.currentClientDetail.id].push(job);
        
        // Close modal
        const modal = document.querySelector('.fixed');
        if (modal) modal.remove();
        
        // Refresh display
        this.renderClientJobs();
        
        alert(`Job "${job.title}" added successfully!`);
    }
    
    handleAddClientContact(e) {
        e.preventDefault();
        
        if (!this.currentClientDetail) return;
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            role: document.getElementById('contactRole').value
        };
        
        const contact = {
            id: Date.now(),
            clientId: this.currentClientDetail.id,
            ...formData,
            createdAt: new Date().toISOString()
        };
        
        if (!this.contactsData[this.currentClientDetail.id]) {
            this.contactsData[this.currentClientDetail.id] = [];
        }
        this.contactsData[this.currentClientDetail.id].push(contact);
        
        // Close modal
        const modal = document.querySelector('.fixed');
        if (modal) modal.remove();
        
        // Refresh display
        this.renderClientContacts();
        
        alert(`Contact "${contact.name}" added successfully!`);
    }
    
    handleAddRecurringJob(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('recurringJobTitle').value,
            clientId: document.getElementById('recurringJobClient').value,
            frequency: document.getElementById('recurringJobFrequency').value,
            description: document.getElementById('recurringJobDescription').value
        };
        
        const job = {
            id: Date.now(),
            ...formData,
            status: 'active',
            nextDue: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!this.jobsData.recurring) {
            this.jobsData.recurring = [];
        }
        this.jobsData.recurring.push(job);
        
        // Close modal
        const modal = document.querySelector('.fixed');
        if (modal) modal.remove();
        
        // Refresh display
        this.renderJobs();
        
        alert(`Recurring job "${job.title}" added successfully!`);
    }
    
    handleAddOnetimeJob(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('onetimeJobTitle').value,
            clientId: document.getElementById('onetimeJobClient').value,
            dueDate: document.getElementById('onetimeJobDueDate').value,
            description: document.getElementById('onetimeJobDescription').value
        };
        
        const job = {
            id: Date.now(),
            ...formData,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (!this.jobsData.onetime) {
            this.jobsData.onetime = [];
        }
        this.jobsData.onetime.push(job);
        
        // Close modal
        const modal = document.querySelector('.fixed');
        if (modal) modal.remove();
        
        // Refresh display
        this.renderJobs();
        
        alert(`One-time job "${job.title}" added successfully!`);
    }
    
    // Task Status Update Function
    updateMyTaskStatus(taskId, completed) {
        // Find the task in the tasks data
        let taskFound = false;
        Object.values(this.tasksData).forEach(divisionTasks => {
            const taskIndex = divisionTasks.findIndex(task => task.id == taskId);
            if (taskIndex !== -1) {
                divisionTasks[taskIndex].status = completed ? 'completed' : 'in_progress';
                divisionTasks[taskIndex].updatedAt = new Date().toISOString();
                taskFound = true;
            }
        });
        
        if (taskFound) {
            this.saveTasksData();
            this.renderMyTasks();
        }
    }

    // Agenda Tab Switching
    switchAgendaTab(tab) {
        console.log('Switching to agenda tab:', tab);
        
        // Hide all tab contents
        document.querySelectorAll('.agenda-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active state from all tab buttons
        document.querySelectorAll('.agenda-tab-button').forEach(button => {
            button.classList.remove('bg-brand-primary', 'text-black');
            button.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer2');
        });
        
        // Show selected tab content
        const tabIdMap = {
            'daily-priorities': 'dailyPrioritiesTab',
            'accounts': 'myAccountsTab',
            'tasks': 'myTasksTab',
            'jobs': 'myJobsTab'
        };
        
        const selectedContent = document.getElementById(tabIdMap[tab]);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
            console.log('Showing tab content:', selectedContent.id);
        } else {
            console.error('Tab content not found:', tabIdMap[tab]);
        }
        
        // Activate selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tab}"]`);
        if (selectedButton) {
            selectedButton.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer2');
            selectedButton.classList.add('bg-brand-primary', 'text-black');
        }
        
        // Render content based on tab
        switch(tab) {
            case 'daily-priorities':
                console.log('Rendering daily priorities');
                this.renderDailyPriorities();
                this.renderSuggestedPriorities();
                break;
            case 'accounts':
                console.log('Rendering accounts');
                this.renderMyAccounts();
                break;
            case 'tasks':
                console.log('Rendering tasks');
                this.renderMyTasks();
                break;
            case 'jobs':
                console.log('Rendering jobs');
                this.renderMyJobs();
                break;
        }
    }

    // Settings Tab Switching
    // Settings Tab Switching
    switchSettingsTab(tab) {
        console.log('Switching to settings tab:', tab);
        
        // Hide all tab contents
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active state from all tab buttons
        document.querySelectorAll('.settings-tab-button').forEach(button => {
            button.classList.remove('bg-brand-primary', 'text-black');
            button.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer2');
        });
        
        // Show selected tab content
        const tabIdMap = {
            'profile': 'profileTab',
            'notifications': 'notificationsTab',
            'integrations': 'integrationsTab'
        };
        
        const selectedContent = document.getElementById(tabIdMap[tab]);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }
        
        // Activate selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tab}"]`);
        if (selectedButton) {
            selectedButton.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-brand-layer2');
            selectedButton.classList.add('bg-brand-primary', 'text-black');
        }
        
        // Load data based on tab
        switch(tab) {
            case 'profile':
                this.loadProfileSettings();
                break;
            case 'notifications':
                this.loadNotificationSettings();
                break;
            case 'integrations':
                this.loadIntegrationSettings();
                break;
        }
    }

    // Settings Rendering - simplified version
    renderSettings() {
        const container = document.getElementById('settingsContent');
        if (!container) return;
        
        // Show the settings content
        container.classList.remove('hidden');
        
        // Initialize with Profile tab
        this.switchSettingsTab('profile');
    }

    // Load Profile Settings
    loadProfileSettings() {
        console.log('Loading profile settings...');
        try {
            const settings = this.getState('settings', {});
            console.log('Settings loaded:', settings);
            const profile = settings.profile || {};
            console.log('Profile data:', profile);
            
            document.getElementById('profileName')?.value = profile.name || '';
            document.getElementById('profileRole')?.value = profile.role || '';
            document.getElementById('profileEmail')?.value = profile.email || '';
            document.getElementById('profilePhone')?.value = profile.phone || '';
            document.getElementById('profileLocation')?.value = profile.location || '';
            document.getElementById('profileNotes')?.value = profile.notes || '';
            console.log('Profile settings loaded successfully');
        } catch (error) {
            console.error('Error loading profile settings:', error);
        }
    }

    // Load Notification Settings
    loadNotificationSettings() {
        console.log('Loading notification settings...');
        try {
            const settings = this.getState('settings', {});
            console.log('Settings loaded:', settings);
            const notifications = settings.notifications || { taskAdded: false, taskOverdue: false, dailySummary: true };
            console.log('Notification data:', notifications);
            
            document.getElementById('taskAdded')?.checked = notifications.taskAdded || false;
            document.getElementById('taskOverdue')?.checked = notifications.taskOverdue || false;
            document.getElementById('dailySummary')?.checked = notifications.dailySummary !== false;
            console.log('Notification settings loaded successfully');
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    }

    // Load Integration Settings
    loadIntegrationSettings() {
        console.log('Loading integration settings...');
        try {
            const settings = this.getState('settings', {});
            console.log('Settings loaded:', settings);
            const integrations = settings.integrations || {};
            console.log('Integration data:', integrations);
            
            document.getElementById('gmailEmail')?.value = integrations.gmail?.email || '';
            
            // Load webhook settings
            const webhooks = integrations.webhooks || {};
            document.getElementById('inboundWebhookUrl')?.value = webhooks.inboundUrl || '';
            document.getElementById('referencePayload')?.value = webhooks.referencePayload ? JSON.stringify(webhooks.referencePayload, null, 2) : '';
            
            // Load outbound webhook URLs
            this.renderOutboundWebhookUrls(webhooks.outboundUrls || []);
            
            // Load triggers
            const triggers = webhooks.triggers || {};
            document.getElementById('triggerTaskCompleted')?.checked = triggers.taskCompleted || false;
            document.getElementById('triggerTaskInProgress')?.checked = triggers.taskInProgress || false;
            document.getElementById('triggerTaskOverdue')?.checked = triggers.taskOverdue || false;
            document.getElementById('triggerJobInProgress')?.checked = triggers.jobInProgress || false;
            document.getElementById('triggerJobNeedsAssistance')?.checked = triggers.jobNeedsAssistance || false;
            console.log('Integration settings loaded successfully');
        } catch (error) {
            console.error('Error loading integration settings:', error);
        }
    }



    // Daily Priorities Rendering
    renderDailyPriorities() {
        const container = document.getElementById('dailyPrioritiesList');
        if (!container) {
            console.error('Daily priorities container not found');
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const priorities = this.dailyPrioritiesData[today] || [];
        
        console.log('Rendering daily priorities for today:', today);
        console.log('Priorities found:', priorities);
        
        container.innerHTML = '';
        
        if (priorities.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">No Daily Priorities Set</h3>
                    <p class="text-gray-400">Mark tasks as daily priorities to see them here.</p>
                </div>
            `;
        } else {
            // Separate active and completed priorities
            const activePriorities = [];
            const completedPriorities = [];
            
            priorities.forEach(priority => {
                const task = this.findTaskById(priority.taskId);
                console.log('Priority:', priority, 'Task found:', task);
                if (task) {
                    if (task.status === 'completed') {
                        completedPriorities.push({ priority, task });
                    } else {
                        activePriorities.push({ priority, task });
                    }
                } else {
                    // Show a simple text element if task not found
                    const simpleElement = document.createElement('div');
                    simpleElement.className = 'bg-brand-layer2 border border-brand-border rounded-lg p-4';
                    simpleElement.innerHTML = `
                        <h4 class="text-lg font-semibold text-white mb-2">Priority ${priority.id}</h4>
                        <p class="text-gray-300">Task ID: ${priority.taskId}</p>
                        <p class="text-gray-400 text-sm">Due: ${priority.dateISO}</p>
                    `;
                    container.appendChild(simpleElement);
                }
            });
            
            // Render active priorities
            activePriorities.forEach(({ priority, task }) => {
                const priorityElement = this.createDailyPriorityElement(task, priority);
                container.appendChild(priorityElement);
            });
            
            // Render completed priorities section
            if (completedPriorities.length > 0) {
                const completedSection = document.createElement('div');
                completedSection.className = 'mt-6';
                completedSection.innerHTML = `
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Completed Today (${completedPriorities.length})
                    </h3>
                `;
                
                completedPriorities.forEach(({ priority, task }) => {
                    const completedElement = this.createDailyPriorityElement(task, priority);
                    completedElement.classList.add('opacity-75');
                    completedSection.appendChild(completedElement);
                });
                
                container.appendChild(completedSection);
            }
        }
    }

    // Suggested Priorities Rendering
    renderSuggestedPriorities() {
        const container = document.getElementById('suggestedPrioritiesList');
        if (!container) return;
        
        const allTasks = [];
        Object.values(this.tasksData).forEach(divisionTasks => {
            divisionTasks.forEach(task => {
                if (task.assigneeUserId == this.currentUser.id && task.status !== 'completed') {
                    allTasks.push({
                        ...task,
                        clientName: this.getClientName(task.clientId),
                        jobTitle: this.getJobTitle(task.jobId)
                    });
                }
            });
        });
        
        // Sort by priority and due date for suggestions
        allTasks.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            // If same priority, sort by due date (closest first)
            const aDue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
            const bDue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
            return aDue - bDue;
        });
        
        // Take top 5 suggestions
        const suggestions = allTasks.slice(0, 5);
        
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No tasks available for suggestions</p>';
        } else {
            suggestions.forEach(task => {
                const suggestionElement = this.createSuggestedPriorityElement(task);
                container.appendChild(suggestionElement);
            });
        }
    }

    // Helper Functions
    findTaskById(taskId) {
        let foundTask = null;
        Object.values(this.tasksData).forEach(divisionTasks => {
            const task = divisionTasks.find(t => t.id == taskId);
            if (task) foundTask = task;
        });
        return foundTask;
    }

    // Autofill functionality
    getKeyValue(clientId, key) {
        if (!this.keyValueIndexData[clientId]) return null;
        return this.keyValueIndexData[clientId].find(kv => kv.key === key)?.value || null;
    }

    setKeyValue(clientId, key, value) {
        if (!this.keyValueIndexData[clientId]) {
            this.keyValueIndexData[clientId] = [];
        }
        
        const existingIndex = this.keyValueIndexData[clientId].findIndex(kv => kv.key === key);
        if (existingIndex !== -1) {
            this.keyValueIndexData[clientId][existingIndex].value = value;
            this.keyValueIndexData[clientId][existingIndex].updatedAt = new Date().toISOString();
        } else {
            this.keyValueIndexData[clientId].push({
                id: Date.now(),
                clientId,
                key,
                value,
                updatedAt: new Date().toISOString()
            });
        }
        
        this.saveKeyValueIndexData();
    }

    // Add autofill suggestions to form fields
    addAutofillToForm(formElement, clientId) {
        const formFields = formElement.querySelectorAll('input, textarea, select');
        
        formFields.forEach(field => {
            const fieldName = field.name || field.id;
            if (fieldName) {
                // Check if this field maps to a known key
                const knownKeys = [
                    'google_ads.cid', 'meta.pixel_id', 'ga4.property_id', 'gtm.container_id',
                    'gsc.site', 'google_ads.monthly_budget', 'meta.ads_account_id'
                ];
                
                const matchingKey = knownKeys.find(key => 
                    fieldName.toLowerCase().includes(key.split('.')[1]) || 
                    fieldName.toLowerCase().includes(key.split('.')[0])
                );
                
                if (matchingKey) {
                    const storedValue = this.getKeyValue(clientId, matchingKey);
                    if (storedValue) {
                        this.addAutofillSuggestion(field, storedValue, matchingKey);
                    }
                }
            }
        });
    }

    addAutofillSuggestion(field, value, key) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'absolute -top-8 left-0 bg-brand-primary text-black text-xs px-2 py-1 rounded pointer-events-none';
        suggestionDiv.textContent = `Suggested: ${value}`;
        
        const insertButton = document.createElement('button');
        insertButton.className = 'ml-2 bg-black text-white text-xs px-2 py-1 rounded hover:bg-gray-800';
        insertButton.textContent = 'Insert';
        insertButton.onclick = () => {
            field.value = value;
            suggestionDiv.remove();
        };
        
        suggestionDiv.appendChild(insertButton);
        
        // Position the suggestion
        const fieldRect = field.getBoundingClientRect();
        suggestionDiv.style.position = 'absolute';
        suggestionDiv.style.top = `${fieldRect.top - 40}px`;
        suggestionDiv.style.left = `${fieldRect.left}px`;
        
        document.body.appendChild(suggestionDiv);
        
        // Remove suggestion after a delay
        setTimeout(() => {
            if (suggestionDiv.parentNode) {
                suggestionDiv.remove();
            }
        }, 5000);
    }

    createDailyPriorityElement(task, priority) {
        const div = document.createElement('div');
        div.className = 'p-4 bg-brand-layer2 border border-brand-border rounded-lg';
        
        const priorityColors = {
            'critical': 'bg-red-600',
            'high': 'bg-red-500',
            'medium': 'bg-yellow-500',
            'low': 'bg-green-500'
        };
        
        const clientName = this.getClientName(task.clientId);
        const jobTitle = this.getJobTitle(task.jobId);
        const assignee = this.getUserNameById(task.assigneeUserId) || 'Unassigned';
        const isCompleted = task.status === 'completed';
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} text-white">
                        ${task.priority}
                    </span>
                    <span class="text-sm text-gray-400">Daily Priority</span>
                </div>
                <button onclick="guerrillaCommandPost.removeDailyPriority(${priority.id})" class="text-red-400 hover:text-red-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                    <label class="inline-flex items-center gap-2 mb-1">
                        <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="guerrillaCommandPost.handleTaskCompletion(${task.id}, this.checked)">
                        <h4 class="font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-white'}">${task.title}</h4>
                    </label>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-300 font-medium">${clientName || 'No Client'}</p>
                        ${jobTitle ? `<p class=\"text-sm text-gray-400\">${jobTitle}</p>` : ''}
                    </div>
                    ${task.dueDate ? `<p class="text-xs text-gray-400 mt-2">Due: ${task.dueDate}</p>` : ''}
                </div>
                <div class="text-right min-w-[140px]">
                    <div class="text-xs text-gray-400">Assigned To</div>
                    <div class="text-sm text-white">${assignee}</div>
                </div>
            </div>
        `;
        
        return div;
    }

    createSuggestedPriorityElement(task) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-brand-layer3 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-layer2 transition-colors duration-200';
        
        const priorityColors = {
            'critical': 'bg-red-600',
            'high': 'bg-red-500',
            'medium': 'bg-yellow-500',
            'low': 'bg-green-500'
        };
        
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} text-white">
                        ${task.priority}
                    </span>
                    ${isOverdue ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">Overdue</span>' : ''}
                </div>
                <button onclick="guerrillaCommandPost.markTaskAsPriority(${task.id})" class="text-brand-primary hover:text-yellow-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
            <h4 class="font-medium text-white mb-1">${task.title}</h4>
            <p class="text-sm text-gray-300">${this.getClientName(task.clientId)}${task.jobId ? ` - ${this.getJobTitle(task.jobId)}` : ''}</p>
            ${task.dueDate ? `<p class="text-xs text-gray-400 mt-1">Due: ${task.dueDate}</p>` : ''}
        `;
        
        return div;
    }

    // Daily Priority Management
    markTaskAsPriority(taskId) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.dailyPrioritiesData[today]) {
            this.dailyPrioritiesData[today] = [];
        }
        
        // Check if already a priority
        const existingPriority = this.dailyPrioritiesData[today].find(p => p.taskId === taskId);
        if (existingPriority) {
            return; // Already a priority
        }
        
        // Add as priority
        const newPriority = {
            id: Date.now(),
            taskId: taskId,
            dateISO: today,
            createdAt: new Date().toISOString()
        };
        
        this.dailyPrioritiesData[today].push(newPriority);
        this.saveDailyPrioritiesData();
        
        // Refresh the display
        this.renderDailyPriorities();
        this.renderSuggestedPriorities();
    }
    
    // Handle task completion
    handleTaskCompletion(taskId, isCompleted) {
        // Update task status
        const task = this.findTaskById(taskId);
        if (task) {
            task.status = isCompleted ? 'completed' : 'in_progress';
            this.saveTasksData();
        }
        
        // Refresh displays
        this.renderDailyPriorities();
        this.renderSuggestedPriorities();
        
        // Show completion message
        if (isCompleted) {
            this.showToast(`Task "${task?.title || 'Unknown'}" marked as complete!`, 'success');
        }
    }

    removeDailyPriority(priorityId) {
        const today = new Date().toISOString().split('T')[0];
        
        if (this.dailyPrioritiesData[today]) {
            this.dailyPrioritiesData[today] = this.dailyPrioritiesData[today].filter(p => p.id != priorityId);
            this.saveDailyPrioritiesData();
            
            // Refresh the display
            this.renderDailyPriorities();
            this.renderSuggestedPriorities();
        }
    }

    // Enhanced Add Daily Priority Modal with Task Search and Creation
    openAddTaskModal() {
        console.log('Opening add task modal...');
        
        // Remove any existing modals first
        const existingModal = document.querySelector('.fixed');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create a simple test modal first
        const modal = document.createElement('div');
        modal.id = 'addTaskModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-2xl w-full">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Add a Task</h2>
                        <button id="closeTaskModal" class="text-gray-400 hover:text-white transition-colors duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <p class="text-white">This is a test modal to see if content displays.</p>
                        
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-1">Task Title *</label>
                                <input type="text" id="newTaskTitle" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-1">Priority *</label>
                                <select id="newTaskPriority" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary" required>
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea id="newTaskDescription" rows="3" placeholder="Describe what needs to be done..." class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"></textarea>
                            </div>
                            
                                                            <div>
                                    <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                    <select id="newTaskStatus" class="w-full px-3 py-2 bg-brand-layer2 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                                        <option value="not_started" selected>Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="assistance_needed">Assistance Needed</option>
                                    </select>
                                </div>
                            
                            <div class="flex items-center space-x-3">
                                <input type="checkbox" id="markAsDailyPriority" class="w-4 h-4 text-brand-primary bg-brand-layer2 border-brand-border rounded focus:ring-brand-primary focus:ring-2">
                                <label for="markAsDailyPriority" class="text-sm font-medium text-white">
                                    Mark as Daily Priority for today
                                </label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-3 pt-4 border-t border-brand-border">
                            <button id="closeTaskModal2" class="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
                                Cancel
                            </button>
                            <button id="submitTaskBtn" class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        console.log('Modal added to DOM');
        console.log('Modal HTML length:', modal.innerHTML.length);
        
        // Setup simple event listeners
        document.getElementById('closeTaskModal')?.addEventListener('click', () => {
            console.log('Close button clicked');
            modal.remove();
        });
        
        document.getElementById('closeTaskModal2')?.addEventListener('click', () => {
            console.log('Cancel button clicked');
            modal.remove();
        });
        
        document.getElementById('submitTaskBtn')?.addEventListener('click', () => {
            console.log('Submit button clicked');
            this.submitSimpleTask();
        });
    }
    
    submitSimpleTask() {
        console.log('submitSimpleTask called');
        
        // Get form data directly from the modal - use specific ID
        const taskModal = document.getElementById('addTaskModal');
        if (!taskModal) {
            console.error('Task modal not found');
            return;
        }
        
        console.log('Task modal found:', taskModal);
        console.log('Task modal HTML:', taskModal.innerHTML);
        
        const titleField = taskModal.querySelector('#newTaskTitle');
        const priorityField = taskModal.querySelector('#newTaskPriority');
        const descriptionField = taskModal.querySelector('#newTaskDescription');
        const statusField = taskModal.querySelector('#newTaskStatus');
        const markAsDailyPriorityField = taskModal.querySelector('#markAsDailyPriority');
        
        console.log('Form fields found:', {
            titleField: !!titleField,
            priorityField: !!priorityField,
            descriptionField: !!descriptionField,
            statusField: !!statusField,
            markAsDailyPriorityField: !!markAsDailyPriorityField
        });
        
        const title = titleField?.value?.trim() || '';
        const priority = priorityField?.value?.trim() || '';
        const description = descriptionField?.value?.trim() || '';
        const status = statusField?.value || 'not_started';
        const markAsDailyPriority = markAsDailyPriorityField?.checked || false;
        
        console.log('Form data:', { title, priority, description, status, markAsDailyPriority });
        
        console.log('Validation check - Title:', title, 'Priority:', priority);
        console.log('Title length:', title.length, 'Priority length:', priority.length);
        
        if (!title || title.length === 0) {
            alert('Please enter a Task Title');
            return;
        }
        
        if (!priority || priority.length === 0) {
            alert('Please select a Priority');
            return;
        }
        
        // Create simple task
        const newTask = {
            id: Date.now(),
            title: title,
            description: description || '',
            priority: priority,
            status: status,
            assigneeUserId: this.currentUser?.id || 'user_1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to tasks data
        if (!this.tasksData.gm) this.tasksData.gm = [];
        this.tasksData.gm.push(newTask);
        this.saveTasksData();
        
        // If marked as daily priority, add it
        if (markAsDailyPriority) {
            this.markTaskAsPriority(newTask.id);
        }
        
        // Close modal
        if (taskModal) taskModal.remove();
        
        // Toast success
        const toastRoot = document.getElementById('toastContainer');
        if (toastRoot) {
            const n = document.createElement('div');
            n.className = 'pointer-events-auto bg-white text-black px-4 py-2 rounded shadow-lg';
            n.textContent = `Task "${newTask.title}" created${markAsDailyPriority ? ' and added to today\'s priorities' : ''}.`;
            toastRoot.appendChild(n);
            setTimeout(() => n.remove(), 3000);
        }
        
        // Refresh the display
        this.renderDailyPriorities();
        this.renderSuggestedPriorities();
    }

    createNewTask(formData) {
        const newTask = {
            id: Date.now(),
            clientId: formData.clientId || null,
            jobId: formData.jobId || null,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status || 'in_progress',
            assigneeUserId: this.currentUser?.id || 'user_1',
            dueDate: formData.dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to tasks data
        if (!this.tasksData.gm) this.tasksData.gm = [];
        this.tasksData.gm.push(newTask);
        this.saveTasksData();
        
        // Automatically add to today's daily priorities
        this.markTaskAsPriority(newTask.id);
        
        // Refresh the display
        this.renderDailyPriorities();
        this.renderSuggestedPriorities();
        
        return newTask;
    }

    populateClientSelects() {
        const clientSelect = document.getElementById('newTaskClient');
        const jobSelect = document.getElementById('newTaskJob');
        
        if (clientSelect) {
            clientSelect.innerHTML = '<option value="">Select Client</option>';
            const allClients = [...(this.clientsData?.gm || []), ...(this.clientsData?.sg || [])];
            allClients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
        }
        
        if (jobSelect) {
            jobSelect.innerHTML = '<option value="">Select Job</option>';
            const allJobs = [...(this.jobsData?.recurring || []), ...(this.jobsData?.onetime || [])];
            allJobs.forEach(job => {
                const option = document.createElement('option');
                option.value = job.id;
                option.textContent = job.title;
                jobSelect.appendChild(option);
            });
        }
    }

    setupAddTaskModalListeners(modal) {
        console.log('Setting up modal event listeners...');
        
        // Search functionality
        const searchBtn = document.getElementById('searchTasksBtn');
        const createNewBtn = document.getElementById('createNewTaskBtn');
        const backBtn = document.getElementById('backToSearchBtn');
        const submitBtn = document.getElementById('submitTaskBtn');
        const searchInput = document.getElementById('taskSearchInput');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                console.log('Search button clicked');
                this.searchTasks();
            });
        }
        
        if (createNewBtn) {
            createNewBtn.addEventListener('click', () => {
                console.log('Create new task button clicked');
                this.showCreateTaskStep();
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Back button clicked');
                this.showSearchStep();
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Submit button clicked');
                this.submitTask();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed in search input');
                    this.searchTasks();
                }
            });
        }
        
        // Test button to skip to create task step
        const testBtn = document.getElementById('testCreateTaskBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                console.log('Test button clicked - skipping to create task step');
                this.showCreateTaskStep();
            });
        }
        
        console.log('Event listeners setup complete');
    }

    showCreateTaskStep() {
        document.getElementById('searchStep').classList.add('hidden');
        document.getElementById('createTaskStep').classList.remove('hidden');
    }

    showSearchStep() {
        document.getElementById('createTaskStep').classList.add('hidden');
        document.getElementById('searchStep').classList.remove('hidden');
    }

    searchTasks() {
        const query = document.getElementById('taskSearchInput').value.toLowerCase();
        const results = [];
        
        // Search through all tasks
        Object.values(this.tasksData).forEach(divisionTasks => {
            divisionTasks.forEach(task => {
                const taskText = `${task.title} ${task.description || ''}`.toLowerCase();
                const clientName = this.getClientName(task.clientId)?.toLowerCase() || '';
                const jobTitle = this.getJobTitle(task.jobId)?.toLowerCase() || '';
                
                if (taskText.includes(query) || clientName.includes(query) || jobTitle.includes(query)) {
                    results.push(task);
                }
            });
        });
        
        this.displayTaskSearchResults(results);
    }

    displayTaskSearchResults(tasks) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No tasks found matching your search.</p>';
            return;
        }
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'p-3 bg-brand-layer2 border border-brand-border rounded-lg cursor-pointer hover:bg-brand-layer3 transition-colors duration-200';
            
            const priorityColors = {
                'critical': 'bg-red-600',
                'high': 'bg-red-500',
                'medium': 'bg-yellow-500',
                'low': 'bg-green-500'
            };
            
            taskElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} text-white">
                                ${task.priority}
                            </span>
                            <span class="text-sm text-gray-400">${task.status}</span>
                        </div>
                        <h4 class="font-medium text-white mb-1">${task.title}</h4>
                        <p class="text-sm text-gray-300">${this.getClientName(task.clientId) || 'No Client'}${task.jobId ? ` - ${this.getJobTitle(task.jobId)}` : ''}</p>
                        ${task.dueDate ? `<p class="text-xs text-gray-400 mt-1">Due: ${task.dueDate}</p>` : ''}
                    </div>
                    <button onclick="guerrillaCommandPost.selectExistingTask(${task.id})" class="px-3 py-1 bg-brand-primary text-black rounded text-sm font-medium hover:bg-yellow-400 transition-colors duration-200">
                        Select
                    </button>
                </div>
            `;
            
            container.appendChild(taskElement);
        });
    }

    selectExistingTask(taskId) {
        // Add to today's daily priorities
        this.markTaskAsPriority(taskId);
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        // Show success message
        alert('Task added to today\'s priorities!');
    }

    submitTask() {
        console.log('submitTask called');
        const form = document.getElementById('createTaskForm');
        if (!form) {
            console.error('Form not found!');
            return;
        }
        
        const taskData = {
            title: document.getElementById('newTaskTitle')?.value || '',
            description: document.getElementById('newTaskDescription')?.value || '',
            priority: document.getElementById('newTaskPriority')?.value || '',
            status: document.getElementById('newTaskStatus')?.value || 'in_progress',
            clientId: document.getElementById('newTaskClient')?.value || '',
            jobId: document.getElementById('newTaskJob')?.value || '',
            dueDate: document.getElementById('newTaskDueDate')?.value || '',
            markAsDailyPriority: document.getElementById('markAsDailyPriority')?.checked || false
        };
        
        console.log('Task data:', taskData);
        
        // Validate required fields
        if (!taskData.title || !taskData.priority) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Create task
        const newTask = this.createNewTask(taskData);
        console.log('New task created:', newTask);
        
        // If marked as daily priority, add it
        if (taskData.markAsDailyPriority) {
            this.markTaskAsPriority(newTask.id);
        }
        
        // Close modal
        const submitModal = document.querySelector('.fixed');
        if (submitModal) submitModal.remove();
        
        // Show success message
        const priorityText = taskData.markAsDailyPriority ? ' and added to today\'s priorities' : '';
        alert(`Task "${newTask.title}" created successfully${priorityText}!`);
    }

    openMarkTaskAsPriorityModal() {
        // Show a simple modal explaining how to mark priorities
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-brand-layer1 rounded-2xl shadow-2xl border border-brand-border max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">Mark Task as Priority</h2>
                    <button class="text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="text-white space-y-4">
                    <p>To mark a task as a daily priority:</p>
                    <ol class="list-decimal list-inside space-y-2 text-sm">
                        <li>Look at the "Suggested Priorities" section below</li>
                        <li>Click the "+" button next to any task you want to prioritize</li>
                        <li>The task will appear in your "Daily Priorities" list above</li>
                    </ol>
                    <p class="text-sm text-gray-300">You can also create new tasks using the "Add Task" button above.</p>
                </div>
                <div class="flex justify-end pt-4">
                    <button class="px-4 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                        Got It!
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Client 360 Drawer
    openClient360Drawer(client) {
        const drawer = document.createElement('div');
        drawer.className = 'fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-end';
        drawer.innerHTML = `
            <div class="bg-brand-layer1 w-full max-w-4xl h-full overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">Client 360: ${client.name}</h2>
                        <button class="text-gray-400 hover:text-white transition-colors duration-200" onclick="this.closest('.fixed').remove()">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Left Column -->
                        <div class="space-y-6">
                            <!-- Contacts -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Contacts</h3>
                                <div id="client360Contacts" class="space-y-2">
                                    <!-- Contacts will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Jobs -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Jobs</h3>
                                <div id="client360Jobs" class="space-y-2">
                                    <!-- Jobs will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Tasks -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Tasks</h3>
                                <div id="client360Tasks" class="space-y-2">
                                    <!-- Tasks will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Column -->
                        <div class="space-y-6">
                            <!-- Services -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Services</h3>
                                <div id="client360Services" class="space-y-2">
                                    <!-- Services will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Digital Assets -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Digital Assets</h3>
                                <div id="client360Assets" class="space-y-2">
                                    <!-- Assets will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Budgets -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Budgets</h3>
                                <div id="client360Budgets" class="space-y-2">
                                    <!-- Budgets will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Notes -->
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-3">Notes</h3>
                                <div id="client360Notes" class="space-y-2">
                                    <!-- Notes will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(drawer);
        
        // Populate the drawer with client data
        this.populateClient360Drawer(client);
    }

    populateClient360Drawer(client) {
        // Populate Contacts
        const contactsContainer = document.getElementById('client360Contacts');
        if (contactsContainer) {
            const clientContacts = this.contactsData[client.type || 'gm']?.filter(c => c.clientId == client.id) || [];
            if (clientContacts.length > 0) {
                contactsContainer.innerHTML = clientContacts.map(contact => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="font-medium text-white">${contact.name}</div>
                        <div class="text-sm text-gray-400">${contact.title || ''}</div>
                        <div class="text-sm text-gray-400">${contact.email || ''}</div>
                    </div>
                `).join('');
            } else {
                contactsContainer.innerHTML = '<p class="text-gray-400 text-sm">No contacts found</p>';
            }
        }
        
        // Populate Jobs
        const jobsContainer = document.getElementById('client360Jobs');
        if (jobsContainer) {
            const allJobs = [...(this.jobsData?.recurring || []), ...(this.jobsData?.onetime || [])];
            const clientJobs = allJobs.filter(job => job.clientName === client.name);
            if (clientJobs.length > 0) {
                jobsContainer.innerHTML = clientJobs.map(job => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="font-medium text-white">${job.title}</div>
                        <div class="text-sm text-gray-400">${job.status}</div>
                        <div class="text-sm text-gray-400">Budget: $${job.budget?.toLocaleString() || 'N/A'}</div>
                    </div>
                `).join('');
            } else {
                jobsContainer.innerHTML = '<p class="text-gray-400 text-sm">No jobs found</p>';
            }
        }
        
        // Populate Tasks
        const tasksContainer = document.getElementById('client360Tasks');
        if (tasksContainer) {
            const allTasks = [];
            Object.values(this.tasksData).forEach(divisionTasks => {
                divisionTasks.forEach(task => {
                    if (task.clientId == client.id) {
                        allTasks.push(task);
                    }
                });
            });
            
            if (allTasks.length > 0) {
                const priorityColors = { critical: 'bg-red-600', high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
                tasksContainer.innerHTML = allTasks.map(task => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="flex items-center justify-between mb-1">
                            <div class="font-medium text-white">${task.title}</div>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} text-white">
                                ${task.priority}
                            </span>
                        </div>
                        <div class="text-sm text-gray-400">${task.status}</div>
                    </div>
                `).join('');
            } else {
                tasksContainer.innerHTML = '<p class="text-gray-400 text-sm">No tasks found</p>';
            }
        }
        
        // Populate Services
        const servicesContainer = document.getElementById('client360Services');
        if (servicesContainer) {
            const clientServices = this.clientServicesData[client.id] || [];
            if (clientServices.length > 0) {
                servicesContainer.innerHTML = clientServices.map(service => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="font-medium text-white">${service.service}</div>
                        <div class="text-sm text-gray-400">${service.status}</div>
                    </div>
                `).join('');
            } else {
                servicesContainer.innerHTML = '<p class="text-gray-400 text-sm">No services found</p>';
            }
        }
        
        // Populate Digital Assets
        const assetsContainer = document.getElementById('client360Assets');
        if (assetsContainer) {
            const clientAssets = this.digitalAssetsData[client.id] || [];
            if (clientAssets.length > 0) {
                assetsContainer.innerHTML = clientAssets.map(asset => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="font-medium text-white">${asset.type}</div>
                        <div class="text-sm text-gray-400">${asset.name || 'N/A'}</div>
                        <div class="text-sm text-gray-400">${asset.ownership} • ${asset.accessStatus}</div>
                    </div>
                `).join('');
            } else {
                assetsContainer.innerHTML = '<p class="text-gray-400 text-sm">No digital assets found</p>';
            }
        }
        
        // Populate Budgets
        const budgetsContainer = document.getElementById('client360Budgets');
        if (budgetsContainer) {
            const clientBudgets = this.budgetAllocationsData[client.id] || [];
            if (clientBudgets.length > 0) {
                const totalMonthly = clientBudgets.reduce((sum, budget) => sum + (budget.monthlyAmount || 0), 0);
                budgetsContainer.innerHTML = `
                    <div class="p-3 bg-brand-primary text-black rounded-lg mb-3">
                        <div class="font-bold text-lg">Total Monthly: $${totalMonthly.toLocaleString()}</div>
                    </div>
                    ${clientBudgets.map(budget => `
                        <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                            <div class="font-medium text-white">${budget.service}</div>
                            <div class="text-sm text-gray-400">$${budget.monthlyAmount?.toLocaleString() || 'N/A'}/month</div>
                        </div>
                    `).join('')}
                `;
            } else {
                budgetsContainer.innerHTML = '<p class="text-gray-400 text-sm">No budgets found</p>';
            }
        }
        
        // Populate Notes
        const notesContainer = document.getElementById('client360Notes');
        if (notesContainer) {
            const clientNotes = this.notesData[client.id] || [];
            if (clientNotes.length > 0) {
                notesContainer.innerHTML = clientNotes.map(note => `
                    <div class="p-3 bg-brand-layer2 border border-brand-border rounded-lg">
                        <div class="text-white">${note.body}</div>
                        <div class="text-sm text-gray-400 mt-1">${new Date(note.createdAt).toLocaleDateString()}</div>
                    </div>
                `).join('');
            } else {
                notesContainer.innerHTML = '<p class="text-gray-400 text-sm">No notes found</p>';
            }
        }
    }

    // Settings Helper Functions
    renderOutboundWebhookUrls(urls) {
        const container = document.getElementById('outboundWebhookUrls');
        if (!container) return;
        
        container.innerHTML = '';
        urls.forEach((url, index) => {
            const div = document.createElement('div');
            div.className = 'flex space-x-2';
            div.innerHTML = `
                <input type="url" value="${url}" class="flex-1 px-3 py-2 bg-brand-layer1 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
                <button type="button" class="removeWebhookBtn px-2 py-2 text-red-400 hover:text-red-300">×</button>
            `;
            container.appendChild(div);
        });
    }

    // Settings Event Listeners - simplified version
    setupSettingsEventListeners() {
        // Add click handlers for Settings tabs
        document.querySelectorAll('.settings-tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                if (tab) {
                    this.switchSettingsTab(tab);
                }
            });
        });
    }

    // Settings Helper Functions
    saveProfileSettings() {
        const name = document.getElementById('profileName')?.value || '';
        const email = document.getElementById('profileEmail')?.value || '';
        const role = document.getElementById('profileRole')?.value || '';
        
        const settings = this.getState('settings', {});
        settings.profile = { name, email, role };
        this.setState('settings', settings);
        
        this.showToast('Profile settings saved successfully!', 'success');
    }

    saveNotificationSettings() {
        const taskAdded = document.getElementById('taskAdded')?.checked || false;
        const taskOverdue = document.getElementById('taskOverdue')?.checked || false;
        const dailySummary = document.getElementById('dailySummary')?.checked || false;
        
        const settings = this.getState('settings', {});
        settings.notifications = { taskAdded, taskOverdue, dailySummary };
        this.setState('settings', settings);
        
        this.showToast('Notification settings saved successfully!', 'success');
    }

    connectGmail() {
        const email = document.getElementById('gmailEmail')?.value;
        if (!email) {
            this.showToast('Please enter a Gmail address', 'error');
            return;
        }
        
        const settings = this.getState('settings', {});
        if (!settings.integrations) settings.integrations = {};
        settings.integrations.gmail = { email };
        this.setState('settings', settings);
        
        this.showToast('Gmail connected successfully!', 'success');
    }

    addFieldMapping() {
        const container = document.getElementById('fieldMappings');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'flex space-x-2';
        div.innerHTML = `
            <input type="text" placeholder="Source Field" class="flex-1 px-3 py-2 bg-brand-layer1 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
            <input type="text" placeholder="Target Field" class="flex-1 px-3 py-2 bg-brand-layer1 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
            <button type="button" class="removeMappingBtn px-2 py-2 text-red-400 hover:text-red-300">×</button>
        `;
        container.appendChild(div);
    }

    addOutboundWebhook() {
        const container = document.getElementById('outboundWebhookUrls');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'flex space-x-2';
        div.innerHTML = `
            <input type="url" placeholder="https://..." class="flex-1 px-3 py-2 bg-brand-layer1 border border-brand-border rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-primary">
            <button type="button" class="removeWebhookBtn px-2 py-2 text-red-400 hover:text-red-300">×</button>
        `;
        container.appendChild(div);
    }

    processSamplePayload() {
        const payload = document.getElementById('referencePayload')?.value;
        if (!payload) {
            this.showToast('Error processing payload: Please enter a reference payload', 'error');
            return;
        }
        
        try {
            const parsed = this.parseReferencePayload(payload);
            const mappings = this.getFieldMappings();
            const transformed = this.applyFieldMappings(parsed, mappings);
            
            document.getElementById('processedPayload').value = JSON.stringify(transformed, null, 2);
            this.showToast('Payload processed successfully!', 'success');
        } catch (error) {
            this.showToast('Error processing payload: ' + error.message, 'error');
        }
    }

    getFieldMappings() {
        const mappings = [];
        document.querySelectorAll('#fieldMappings .flex').forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs[0].value && inputs[1].value) {
                mappings.push({
                    source: inputs[0].value,
                    target: inputs[1].value
                });
            }
        });
        return mappings;
    }

    applyFieldMappings(data, mappings) {
        const result = {};
        mappings.forEach(mapping => {
            if (data[mapping.source] !== undefined) {
                result[mapping.target] = data[mapping.source];
            }
        });
        return result;
    }

    async testWebhooks() {
        const urls = this.getOutboundWebhookUrls();
        
        if (urls.length === 0) {
            this.showToast('No webhook URLs configured', 'error');
            return;
        }
        
        const testPayload = {
            event: 'test',
            timestamp: new Date().toISOString(),
            data: { message: 'Test webhook from Guerrilla Command Post' }
        };
        
        let successCount = 0;
        let totalCount = urls.length;
        
        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testPayload)
                });
                
                if (response.ok) {
                    successCount++;
                }
            } catch (error) {
                console.error('Webhook test failed for:', url, error);
            }
        }
        
        if (successCount === totalCount) {
            this.showToast(`All webhooks tested successfully! (${successCount}/${totalCount})`, 'success');
        } else if (successCount > 0) {
            this.showToast(`Some webhooks failed: ${successCount}/${totalCount} successful`, 'warning');
        } else {
            this.showToast('All webhook tests failed', 'error');
        }
    }

    getOutboundWebhookUrls() {
        const urls = [];
        document.querySelectorAll('#outboundWebhookUrls .flex input').forEach(input => {
            if (input.value.trim()) {
                urls.push(input.value.trim());
            }
        });
        return urls;
    }

    getWebhookTriggers() {
        return {
            taskCompleted: document.getElementById('triggerTaskCompleted')?.checked || false,
            taskInProgress: document.getElementById('triggerTaskInProgress')?.checked || false,
            taskOverdue: document.getElementById('triggerTaskOverdue')?.checked || false,
            jobInProgress: document.getElementById('triggerJobInProgress')?.checked || false,
            jobNeedsAssistance: document.getElementById('triggerJobNeedsAssistance')?.checked || false
        };
    }

    saveIntegrationSettings() {
        const inboundUrl = document.getElementById('inboundWebhookUrl')?.value || '';
        const referencePayload = document.getElementById('referencePayload')?.value || '';
        const fieldMappings = this.getFieldMappings();
        const outboundUrls = this.getOutboundWebhookUrls();
        const triggers = this.getWebhookTriggers();
        
        const integrations = {
            webhooks: {
                inboundUrl,
                referencePayload,
                mappings: fieldMappings,
                outboundUrls,
                triggers
            }
        };
        
        const settings = this.getState('settings', {});
        settings.integrations = integrations;
        this.setState('settings', settings);
        
        this.showToast('Integration settings saved successfully!', 'success');
    }

    parseReferencePayload(payload) {
        try {
            return JSON.parse(payload);
        } catch (error) {
            throw new Error('Invalid JSON payload');
        }
    }

    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' :
            type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuerrillaCommandPost();
});

