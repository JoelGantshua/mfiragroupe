// Dashboard functionality
let currentFilter = 'all';
let contacts = [];
let notifications = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('auth_token')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Wait for Supabase to be initialized
    function waitForSupabase(callback, maxAttempts = 10) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.supabaseClient) {
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('Supabase client failed to initialize after', maxAttempts, 'attempts');
                // Still try to initialize dashboard without Supabase
                initDashboard();
                setupEventListeners();
            }
        }, 100);
    }
    
    // Set user email
    const userEmail = localStorage.getItem('user_email') || 'aggroupe@gmail.com';
    if (document.getElementById('user-email')) {
        document.getElementById('user-email').textContent = userEmail;
    }
    if (document.getElementById('settings-email')) {
        document.getElementById('settings-email').value = userEmail;
    }
    
    // Initialize dashboard
    initDashboard();
    setupEventListeners();
    
    // Wait for Supabase before loading data
    waitForSupabase(() => {
        loadContacts();
        loadNotifications();
        loadServices();
        setupRealtimeSubscriptions();
    });
});

function initDashboard() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function setupEventListeners() {
    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        window.location.href = 'login.html';
    });
    
    // Refresh contacts
    document.getElementById('refresh-contacts').addEventListener('click', function() {
        loadContacts();
    });
    
    // Services management
    document.getElementById('refresh-services').addEventListener('click', function() {
        loadServices();
    });
    
    document.getElementById('add-service-btn').addEventListener('click', function() {
        openServiceModal();
    });
    
    document.getElementById('service-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveService();
    });
    
    document.getElementById('close-service-modal').addEventListener('click', closeServiceModal);
    document.getElementById('cancel-service-btn').addEventListener('click', closeServiceModal);
    
    // Auto-generate slug from title
    document.getElementById('service-title').addEventListener('input', function() {
        const title = this.value;
        const slug = title.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        document.getElementById('service-slug').value = slug;
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            displayContacts();
        });
    });
    
    // Notification dropdown
    const notificationBtn = document.getElementById('notification-btn');
    const notificationsMenu = document.getElementById('notifications-menu');
    
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationsMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!notificationsMenu.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationsMenu.classList.remove('active');
        }
    });
    
    // Mark all as read
    document.getElementById('mark-all-read').addEventListener('click', markAllNotificationsRead);
    document.getElementById('mark-all-notifications-read').addEventListener('click', markAllNotificationsRead);
    
    // Modal close
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Close modal on outside click
    document.getElementById('contact-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close service modal on outside click
    document.getElementById('service-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeServiceModal();
        }
    });
}

function showSection(sectionName) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-section`).classList.add('active');
}

async function loadContacts() {
    try {
        // Check if supabaseClient is available
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            document.getElementById('contacts-list').innerHTML = 
                '<p class="no-data">Erreur : Supabase n\'est pas initialisé. Vérifiez la connexion.</p>';
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        contacts = data || [];
        displayContacts();
        updateStats();
    } catch (error) {
        console.error('Error loading contacts:', error);
        document.getElementById('contacts-list').innerHTML = 
            '<p class="no-data">Erreur lors du chargement des messages</p>';
    }
}

function displayContacts() {
    const container = document.getElementById('contacts-list');
    
    let filteredContacts = contacts;
    
    if (currentFilter === 'unread') {
        filteredContacts = contacts.filter(c => !c.is_read);
    } else if (currentFilter === 'read') {
        filteredContacts = contacts.filter(c => c.is_read);
    }
    
    if (filteredContacts.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun message</p>';
        return;
    }
    
    container.innerHTML = filteredContacts.map(contact => `
        <div class="contact-card ${!contact.is_read ? 'unread' : ''}" data-id="${contact.id}">
            <div class="contact-header">
                <div>
                    <div class="contact-name">${escapeHtml(contact.name)}</div>
                    <div class="contact-email">${escapeHtml(contact.email)}</div>
                </div>
                <div class="contact-time">${formatDate(contact.created_at)}</div>
            </div>
            <div class="contact-subject">${escapeHtml(contact.subject)}</div>
            <div class="contact-message">${escapeHtml(contact.message)}</div>
            ${contact.service ? `<span class="contact-service">${escapeHtml(contact.service)}</span>` : ''}
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-id'));
            showContactDetail(contactId);
        });
    });
}

async function showContactDetail(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    // Mark as read
    if (!contact.is_read) {
        await markContactAsRead(id);
    }
    
    // Show modal
    const modal = document.getElementById('contact-modal');
    const content = document.getElementById('contact-detail-content');
    
    content.innerHTML = `
        <div class="contact-detail-item">
            <label>Nom</label>
            <div class="value">${escapeHtml(contact.name)}</div>
        </div>
        <div class="contact-detail-item">
            <label>Email</label>
            <div class="value">${escapeHtml(contact.email)}</div>
        </div>
        <div class="contact-detail-item">
            <label>Sujet</label>
            <div class="value">${escapeHtml(contact.subject)}</div>
        </div>
        ${contact.service ? `
        <div class="contact-detail-item">
            <label>Service</label>
            <div class="value">${escapeHtml(contact.service)}</div>
        </div>
        ` : ''}
        <div class="contact-detail-item">
            <label>Message</label>
            <div class="value" style="white-space: pre-wrap;">${escapeHtml(contact.message)}</div>
        </div>
        <div class="contact-detail-item">
            <label>Date</label>
            <div class="value">${formatDate(contact.created_at)}</div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('contact-modal').classList.remove('active');
}

async function markContactAsRead(id) {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            return;
        }
        
        const { error } = await window.supabaseClient
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id);
        
        if (error) throw error;
        
        // Update local data
        const contact = contacts.find(c => c.id === id);
        if (contact) {
            contact.is_read = true;
        }
        
        // Reload to update UI
        loadContacts();
        loadNotifications();
    } catch (error) {
        console.error('Error marking contact as read:', error);
    }
}

async function loadNotifications() {
    try {
        // Check if supabaseClient is available
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        notifications = data || [];
        displayNotifications();
        updateNotificationBadges();
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function displayNotifications() {
    const container = document.getElementById('notifications-list');
    const fullContainer = document.getElementById('all-notifications-list');
    
    const unreadNotifications = notifications.filter(n => !n.is_read);
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="no-notifications">Aucune notification</p>';
        fullContainer.innerHTML = '<p class="no-data">Aucune notification</p>';
        return;
    }
    
    // Dropdown notifications (last 5)
    const recentNotifications = notifications.slice(0, 5);
    container.innerHTML = recentNotifications.map(notif => `
        <div class="notification-item ${!notif.is_read ? 'unread' : ''}" data-id="${notif.id}">
            <div class="notification-title">${escapeHtml(notif.title)}</div>
            <div class="notification-time">${formatDate(notif.created_at)}</div>
        </div>
    `).join('');
    
    // Full notifications list
    fullContainer.innerHTML = notifications.map(notif => `
        <div class="notification-item-full ${!notif.is_read ? 'unread' : ''}">
            <div class="notification-title">${escapeHtml(notif.title)}</div>
            <div class="notification-time">${formatDate(notif.created_at)}</div>
            ${notif.message ? `<div style="margin-top: 0.5rem; color: var(--text-secondary);">${escapeHtml(notif.message)}</div>` : ''}
        </div>
    `).join('');
    
    // Add click listeners for dropdown
    document.querySelectorAll('#notifications-list .notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const notifId = parseInt(this.getAttribute('data-id'));
            markNotificationAsRead(notifId);
        });
    });
}

async function markAllNotificationsRead() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            return;
        }
        
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        
        if (unreadIds.length === 0) return;
        
        const { error } = await window.supabaseClient
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);
        
        if (error) throw error;
        
        notifications.forEach(n => {
            if (!n.is_read) n.is_read = true;
        });
        
        displayNotifications();
        updateNotificationBadges();
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

async function markNotificationAsRead(id) {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            return;
        }
        
        const { error } = await window.supabaseClient
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        
        if (error) throw error;
        
        const notif = notifications.find(n => n.id === id);
        if (notif) {
            notif.is_read = true;
        }
        
        displayNotifications();
        updateNotificationBadges();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

function updateNotificationBadges() {
    const unreadCount = notifications.filter(n => !n.is_read).length;
    
    document.getElementById('notification-count').textContent = unreadCount;
    document.getElementById('notifications-badge').textContent = unreadCount;
    
    if (unreadCount === 0) {
        document.getElementById('notification-count').style.display = 'none';
        document.getElementById('notifications-badge').style.display = 'none';
    } else {
        document.getElementById('notification-count').style.display = 'flex';
        document.getElementById('notifications-badge').style.display = 'inline-block';
    }
}

function updateStats() {
    const totalContacts = contacts.length;
    const unreadContacts = contacts.filter(c => !c.is_read).length;
    const readContacts = contacts.filter(c => c.is_read).length;
    const totalNotifications = notifications.filter(n => !n.is_read).length;
    const totalServices = services.length;
    
    document.getElementById('total-contacts').textContent = totalContacts;
    document.getElementById('unread-contacts').textContent = unreadContacts;
    document.getElementById('read-contacts').textContent = readContacts;
    document.getElementById('total-notifications').textContent = totalNotifications;
    
    // Update services stat if element exists
    const totalServicesElement = document.getElementById('total-services');
    if (totalServicesElement) {
        totalServicesElement.textContent = totalServices;
    }
    
    // Update contacts badge
    document.getElementById('contacts-badge').textContent = unreadContacts;
    if (unreadContacts === 0) {
        document.getElementById('contacts-badge').style.display = 'none';
    } else {
        document.getElementById('contacts-badge').style.display = 'inline-block';
    }
    
    // Show recent contacts
    const recentContainer = document.getElementById('recent-contacts');
    const recentContacts = contacts.slice(0, 5);
    
    if (recentContacts.length === 0) {
        recentContainer.innerHTML = '<p class="no-data">Aucun message pour le moment</p>';
    } else {
        recentContainer.innerHTML = recentContacts.map(contact => `
            <div class="contact-card ${!contact.is_read ? 'unread' : ''}" data-id="${contact.id}">
                <div class="contact-header">
                    <div>
                        <div class="contact-name">${escapeHtml(contact.name)}</div>
                        <div class="contact-email">${escapeHtml(contact.email)}</div>
                    </div>
                    <div class="contact-time">${formatDate(contact.created_at)}</div>
                </div>
                <div class="contact-subject">${escapeHtml(contact.subject)}</div>
                <div class="contact-message">${escapeHtml(contact.message)}</div>
            </div>
        `).join('');
        
        document.querySelectorAll('#recent-contacts .contact-card').forEach(card => {
            card.addEventListener('click', function() {
                const contactId = parseInt(this.getAttribute('data-id'));
                showContactDetail(contactId);
            });
        });
    }
}

function setupRealtimeSubscriptions() {
    // Check if supabaseClient is available
    if (!window.supabaseClient) {
        console.warn('Supabase client is not initialized. Realtime subscriptions will not work.');
        return;
    }
    
    // Subscribe to contact_messages changes
    window.supabaseClient
        .channel('contact_messages_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'contact_messages' },
            (payload) => {
                console.log('Contact message change:', payload);
                loadContacts();
                createNotification('Nouveau message', `Un nouveau message de contact a été reçu`);
            }
        )
        .subscribe();
    
    // Subscribe to notifications changes
    window.supabaseClient
        .channel('notifications_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'notifications' },
            (payload) => {
                console.log('Notification change:', payload);
                loadNotifications();
            }
        )
        .subscribe();
}

async function createNotification(title, message) {
    try {
        const { error } = await window.supabaseClient
            .from('notifications')
            .insert({
                title: title,
                message: message,
                is_read: false
            });
        
        if (error) throw error;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== Services Management ==========
let services = [];

async function loadServices() {
    try {
        // Check if supabaseClient is available
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            document.getElementById('services-list').innerHTML = 
                '<p class="no-data">Erreur : Supabase n\'est pas initialisé. Vérifiez la connexion.</p>';
            return;
        }
        
        // Load ALL services (active and inactive) for dashboard
        const { data, error } = await window.supabaseClient
            .from('services')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        services = data || [];
        displayServices();
        
        // Update all stats including services
        updateStats();
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('services-list').innerHTML = 
            '<p class="no-data">Erreur lors du chargement des services. Vérifiez la connexion à Supabase et que les tables sont créées.</p>';
    }
}

function updateServiceStats() {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.is_active).length;
    const inactiveServices = services.filter(s => !s.is_active).length;
    
    // Update stats if elements exist
    const statsElement = document.querySelector('.stats-grid');
    if (statsElement && document.getElementById('total-services')) {
        document.getElementById('total-services').textContent = totalServices;
        document.getElementById('active-services').textContent = activeServices;
        document.getElementById('inactive-services').textContent = inactiveServices;
    }
}

function displayServices() {
    const container = document.getElementById('services-list');
    
    if (services.length === 0) {
        container.innerHTML = '<p class="no-data">Aucun service pour le moment</p>';
        return;
    }
    
    container.innerHTML = services.map(service => {
        const features = service.features ? (Array.isArray(service.features) ? service.features : []) : [];
        const statusClass = service.is_active ? 'active' : 'inactive';
        const statusText = service.is_active ? 'Actif' : 'Inactif';
        
        return `
            <div class="service-item ${!service.is_active ? 'inactive' : ''}" data-id="${service.id}">
                <div class="service-info">
                    ${service.icon ? `<div class="service-icon-preview"><i class="${escapeHtml(service.icon)}"></i></div>` : ''}
                    <div class="service-details">
                        <h3>${escapeHtml(service.title)}</h3>
                        <p>${escapeHtml(service.short_description || service.description.substring(0, 100) + '...')}</p>
                        <div class="service-meta">
                            <span><i class="fas fa-link"></i> ${escapeHtml(service.slug)}</span>
                            <span><i class="fas fa-sort"></i> Ordre: ${service.display_order}</span>
                            <span class="service-badge ${statusClass}">${statusText}</span>
                            ${service.show_on_homepage ? '<span class="service-badge active">Page d\'accueil</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="service-actions">
                    <button class="btn-icon edit" onclick="editService('${service.id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteService('${service.id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    const modalTitle = document.getElementById('service-modal-title');
    
    if (serviceId) {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            modalTitle.textContent = 'Modifier le Service';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-title').value = service.title;
            document.getElementById('service-slug').value = service.slug;
            document.getElementById('service-icon').value = service.icon || '';
            document.getElementById('service-image').value = service.image_url || '';
            document.getElementById('service-short-description').value = service.short_description || '';
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-display-order').value = service.display_order || 0;
            document.getElementById('service-type').value = service.service_type || '';
            document.getElementById('service-is-active').checked = service.is_active !== false;
            document.getElementById('service-show-homepage').checked = service.show_on_homepage !== false;
            
            // Handle features
            if (service.features && Array.isArray(service.features)) {
                document.getElementById('service-features').value = service.features.join('\n');
            } else {
                document.getElementById('service-features').value = '';
            }
        }
    } else {
        modalTitle.textContent = 'Ajouter un Service';
        form.reset();
        document.getElementById('service-id').value = '';
        document.getElementById('service-display-order').value = services.length;
        document.getElementById('service-is-active').checked = true;
        document.getElementById('service-show-homepage').checked = true;
    }
    
    modal.classList.add('active');
}

function closeServiceModal() {
    document.getElementById('service-modal').classList.remove('active');
    document.getElementById('service-form').reset();
}

async function saveService() {
    const form = document.getElementById('service-form');
    const serviceId = document.getElementById('service-id').value;
    const title = document.getElementById('service-title').value;
    const slug = document.getElementById('service-slug').value;
    const icon = document.getElementById('service-icon').value;
    const imageUrl = document.getElementById('service-image').value;
    const shortDescription = document.getElementById('service-short-description').value;
    const description = document.getElementById('service-description').value;
    const displayOrder = parseInt(document.getElementById('service-display-order').value) || 0;
    const serviceType = document.getElementById('service-type').value;
    const isActive = document.getElementById('service-is-active').checked;
    const showOnHomepage = document.getElementById('service-show-homepage').checked;
    
    // Parse features
    const featuresText = document.getElementById('service-features').value;
    const features = featuresText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    const serviceData = {
        title,
        slug,
        description,
        short_description: shortDescription || null,
        icon: icon || null,
        image_url: imageUrl || null,
        features: features.length > 0 ? features : null,
        display_order: displayOrder,
        service_type: serviceType || null,
        is_active: isActive,
        show_on_homepage: showOnHomepage
    };
    
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            alert('Erreur : Supabase n\'est pas initialisé. Vérifiez la connexion.');
            return;
        }
        
        let error;
        if (serviceId) {
            // Update existing service
            const { error: updateError } = await window.supabaseClient
                .from('services')
                .update(serviceData)
                .eq('id', serviceId);
            error = updateError;
        } else {
            // Insert new service
            const { error: insertError } = await window.supabaseClient
                .from('services')
                .insert([serviceData]);
            error = insertError;
        }
        
        if (error) throw error;
        
        closeServiceModal();
        loadServices();
        
        // Show success notification
        createNotification('Service enregistré', `Le service "${title}" a été ${serviceId ? 'modifié' : 'ajouté'} avec succès`);
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Erreur lors de l\'enregistrement du service. Veuillez réessayer.');
    }
}

async function editService(serviceId) {
    openServiceModal(serviceId);
}

async function deleteService(serviceId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
        return;
    }
    
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client is not initialized');
            alert('Erreur : Supabase n\'est pas initialisé. Vérifiez la connexion.');
            return;
        }
        
        const { error } = await window.supabaseClient
            .from('services')
            .delete()
            .eq('id', serviceId);
        
        if (error) throw error;
        
        loadServices();
        createNotification('Service supprimé', 'Le service a été supprimé avec succès');
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Erreur lors de la suppression du service. Veuillez réessayer.');
    }
}

// Make functions global for onclick handlers
window.editService = editService;
window.deleteService = deleteService;

