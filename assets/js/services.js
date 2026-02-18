// Services Management for Public Website
let services = [];
let currentServiceIndex = 0; // For alternating left/right layout

async function loadServicesFromSupabase() {
    try {
        const { data, error } = await window.supabaseClient
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) {
            console.error('Error loading services:', error);
            showFallbackServices();
            return;
        }
        
        services = data || [];
        
        if (services.length === 0) {
            showFallbackServices();
            return;
        }
        
        displayServices();
    } catch (error) {
        console.error('Error loading services:', error);
        showFallbackServices();
    }
}

function displayServices() {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    // Hide fallback services
    document.querySelectorAll('.fallback-service').forEach(el => {
        el.style.display = 'none';
    });
    
    container.innerHTML = services.map((service, index) => {
        const isEven = index % 2 === 1;
        const features = service.features ? (Array.isArray(service.features) ? service.features : []) : [];
        const imageUrl = service.image_url || 'assets/images/images.jpg';
        
        return `
            <div id="${service.slug}" class="service-detail" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="row align-items-center">
                    <div class="col-lg-5 ${isEven ? 'order-lg-2' : ''}">
                        <div class="service-image">
                            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(service.title)}" class="img-fluid rounded service-img">
                        </div>
                    </div>
                    <div class="col-lg-7 ${isEven ? 'order-lg-1' : ''}">
                        <div class="service-content">
                            ${service.icon ? `
                            <div class="service-icon">
                                <i class="${escapeHtml(service.icon)}"></i>
                            </div>
                            ` : ''}
                            <h2 class="service-title">${escapeHtml(service.title)}</h2>
                            <p>${escapeHtml(service.description)}</p>
                            ${features.length > 0 ? `
                            <div class="service-features">
                                <h4>Nos services comprennent :</h4>
                                <ul>
                                    ${features.map(feature => `
                                        <li><i class="fas fa-check"></i> ${escapeHtml(feature)}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            ` : ''}
                            <a href="contact.html" class="btn btn-primary mt-3">Demander un devis</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update navigation links if they exist
    updateServiceLinks();
}

function updateServiceLinks() {
    // Update dropdown menu in navigation
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        // Keep existing structure or update dynamically
    }
    
    // Update service cards on homepage
    updateHomepageServices();
}

async function updateHomepageServices() {
    try {
        const homepageServices = services.filter(s => s.show_on_homepage).slice(0, 6);
        const servicesGrid = document.querySelector('.services-grid');
        
        if (servicesGrid) {
            servicesGrid.innerHTML = homepageServices.map((service, index) => {
                const icon = service.icon || 'fas fa-cog';
                const shortDesc = service.short_description || service.description.substring(0, 100) + '...';
                
                return `
                    <div class="service-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="service-icon">
                            <i class="${escapeHtml(icon)}"></i>
                        </div>
                        <h3 class="service-title">${escapeHtml(service.title)}</h3>
                        <p class="service-description">${escapeHtml(shortDesc)}</p>
                        <a href="services.html#${escapeHtml(service.slug)}" class="service-link">En savoir plus <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error updating homepage services:', error);
    }
}

function showFallbackServices() {
    // Show fallback services if Supabase fails
    document.querySelectorAll('.fallback-service').forEach(el => {
        el.style.display = 'block';
    });
    
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = '<p class="text-center text-muted">Chargement des services...</p>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

