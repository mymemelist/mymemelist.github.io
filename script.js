// ==================== DATA STRUCTURE ====================
let links = [];
let currentCategory = 'all';
let currentView = 'grid';
let currentSort = 'newest';
let editingLinkId = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    loadLinksFromStorage();
    initializeEventListeners();
    renderLinks();
    updateStats();
    updateCategoryCounts();
});

// ==================== PARTICLES BACKGROUND ====================
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#3b82f6' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3b82f6',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// ==================== LOCAL STORAGE ====================
// LocalStorage desabilitado - links são gerenciados direto no código
// Para adicionar/editar/remover links, edite a seção SEUS LINKS abaixo

function loadLinksFromStorage() {
    // ====================================
    // 📝 SEUS LINKS - EDITE AQUI!
    // ====================================
    // Para adicionar novos links, copie e cole o template abaixo:
    /*
    {
        id: Date.now() + X, // Troque X por um número único
        title: 'Nome do Site',
        url: 'https://exemplo.com',
        description: 'Descrição do site',
        category: 'development', // development, design, productivity, learning, tools, entertainment, other
        icon: 'fas fa-code', // Ícone Font Awesome
        tags: ['tag1', 'tag2', 'tag3'],
        color: '#3b82f6', // Cor em hexadecimal
        favorite: false, // true ou false
        visits: 0,
        createdAt: new Date().toISOString()
    },
    */
    
    links = [
        {
            id: 1,
            title: 'Geopolítica Mundial',
            url: 'https://youtube.com/@geopoliticamundial',
            description: 'Organize projetos com quadros Kanban',
            category: 'productivity',
            icon: 'fab fa-youtube',
            tags: ['geo', 'política', 'geopolítica'],
            color: '#0079BF',
            favorite: false,
            visits: 0,
            createdAt: new Date(Date.now() - 518400000).toISOString()
        },
        {
            id: 2,
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org',
            description: 'Documentação completa sobre tecnologias web',
            category: 'learning',
            icon: 'fab fa-firefox-browser',
            tags: ['documentação', 'web', 'html', 'css', 'javascript'],
            color: '#000000',
            favorite: true,
            visits: 0,
            createdAt: new Date(Date.now() - 604800000).toISOString()
        }
        // ADICIONE MAIS LINKS AQUI seguindo o mesmo formato
    ];
    
    // Carregar favoritos do localStorage (apenas favoritos são salvos)
    const savedFavorites = localStorage.getItem('linkVault_favorites');
    if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        links.forEach(link => {
            if (favoriteIds.includes(link.id)) {
                link.favorite = true;
            }
        });
    }
    
    // Carregar contador de visitas do localStorage
    const savedVisits = localStorage.getItem('linkVault_visits');
    if (savedVisits) {
        const visits = JSON.parse(savedVisits);
        links.forEach(link => {
            if (visits[link.id]) {
                link.visits = visits[link.id];
            }
        });
    }
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('#categoriesNav li').forEach(item => {
        item.addEventListener('click', () => {
            currentCategory = item.dataset.category;
            document.querySelectorAll('#categoriesNav li').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderLinks();
            updateCategoryBanner();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        if (e.target.value) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        renderLinks();
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        renderLinks();
    });

    // View options
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentView = btn.dataset.view;
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateView();
        });
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderLinks();
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Mobile menu
    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Context menu
    document.addEventListener('click', () => {
        document.getElementById('contextMenu').classList.remove('active');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K = Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        // Escape = Close modal
        if (e.key === 'Escape') {
            document.getElementById('contextMenu').classList.remove('active');
        }
    });
}

// ==================== RENDER FUNCTIONS ====================
function renderLinks() {
    const container = document.getElementById('linksContainer');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter links
    let filteredLinks = links.filter(link => {
        const matchesCategory = currentCategory === 'all' || link.category === currentCategory;
        const matchesSearch = !searchTerm || 
            link.title.toLowerCase().includes(searchTerm) ||
            link.description.toLowerCase().includes(searchTerm) ||
            link.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        return matchesCategory && matchesSearch;
    });

    // Sort links
    filteredLinks = sortLinks(filteredLinks);

    // Display
    if (filteredLinks.length === 0) {
        container.innerHTML = '';
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('emptyState').style.display = 'none';
        container.innerHTML = filteredLinks.map(link => createLinkCard(link)).join('');
        
        // Add event listeners to cards
        container.querySelectorAll('.link-card').forEach(card => {
            const linkId = parseInt(card.dataset.id);
            
            // Click to visit
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.link-action-btn')) {
                    visitLink(linkId);
                }
            });

            // Context menu
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showContextMenu(e, linkId);
            });

            // Action buttons
            const favoriteBtn = card.querySelector('.favorite-btn');

            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(linkId);
                });
            }
        });
    }

    updateStats();
    updatePopularTags();
}

function createLinkCard(link) {
    const categoryNames = {
        development: 'Desenvolvimento',
        design: 'Design',
        productivity: 'Produtividade',
        learning: 'Aprendizado',
        tools: 'Ferramentas',
        entertainment: 'Entretenimento',
        other: 'Outros'
    };

    const tagsHtml = link.tags.map(tag => 
        `<span class="link-tag">#${tag}</span>`
    ).join('');

    return `
        <div class="link-card" data-id="${link.id}">
            <div class="link-card-header">
                <div class="link-icon" style="background: ${link.color}">
                    <i class="${link.icon}"></i>
                </div>
                <div class="link-actions">
                    <button class="link-action-btn favorite-btn ${link.favorite ? 'active' : ''}" title="Favorito">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
            <div class="link-card-body">
                <h3>${link.title}</h3>
                <p>${link.description}</p>
                <div class="link-meta">
                    <span><i class="fas fa-eye"></i> ${link.visits} visitas</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(link.createdAt)}</span>
                </div>
                <div class="link-tags">
                    ${tagsHtml}
                </div>
            </div>
            <div class="link-card-footer">
                <span class="link-category">${categoryNames[link.category]}</span>
                <a href="${link.url}" class="link-url" target="_blank" onclick="event.stopPropagation()">
                    Visitar <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

function sortLinks(links) {
    const sorted = [...links];
    
    switch (currentSort) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'name':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'popular':
            return sorted.sort((a, b) => b.visits - a.visits);
        default:
            return sorted;
    }
}

function updateView() {
    const container = document.getElementById('linksContainer');
    container.className = `links-container ${currentView}-view`;
}

function updateCategoryBanner() {
    const categoryData = {
        all: {
            icon: 'fas fa-grip',
            title: 'Todas as Categorias',
            desc: 'Explore toda sua coleção de links úteis'
        },
        development: {
            icon: 'fas fa-code',
            title: 'Desenvolvimento',
            desc: 'Ferramentas e recursos para desenvolvedores'
        },
        design: {
            icon: 'fas fa-palette',
            title: 'Design',
            desc: 'Ferramentas de design e criação visual'
        },
        productivity: {
            icon: 'fas fa-rocket',
            title: 'Produtividade',
            desc: 'Aumente sua produtividade e organização'
        },
        learning: {
            icon: 'fas fa-graduation-cap',
            title: 'Aprendizado',
            desc: 'Recursos educacionais e cursos'
        },
        tools: {
            icon: 'fas fa-wrench',
            title: 'Ferramentas',
            desc: 'Utilitários e ferramentas diversas'
        },
        entertainment: {
            icon: 'fas fa-gamepad',
            title: 'Entretenimento',
            desc: 'Diversão e entretenimento'
        },
        other: {
            icon: 'fas fa-ellipsis-h',
            title: 'Outros',
            desc: 'Outros links úteis'
        }
    };

    const data = categoryData[currentCategory];
    const banner = document.querySelector('.banner-content');
    banner.innerHTML = `
        <i class="${data.icon}"></i>
        <div>
            <h2 id="currentCategoryTitle">${data.title}</h2>
            <p id="currentCategoryDesc">${data.desc}</p>
        </div>
    `;
}

// ==================== STATS & COUNTS ====================
function updateStats() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredLinks = links.filter(link => {
        const matchesCategory = currentCategory === 'all' || link.category === currentCategory;
        const matchesSearch = !searchTerm || 
            link.title.toLowerCase().includes(searchTerm) ||
            link.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    document.getElementById('totalLinks').textContent = links.length;
    document.getElementById('totalFavorites').textContent = links.filter(l => l.favorite).length;
    document.getElementById('displayedLinks').textContent = filteredLinks.length;
    document.getElementById('totalVisits').textContent = links.reduce((sum, link) => sum + link.visits, 0);
    
    const today = new Date().toDateString();
    const todayLinks = links.filter(l => new Date(l.createdAt).toDateString() === today);
    document.getElementById('recentlyAdded').textContent = todayLinks.length;
    
    const mostVisited = Math.max(...links.map(l => l.visits), 0);
    document.getElementById('topRated').textContent = mostVisited;
}

function updateCategoryCounts() {
    const counts = {};
    links.forEach(link => {
        counts[link.category] = (counts[link.category] || 0) + 1;
    });

    document.querySelectorAll('#categoriesNav li').forEach(item => {
        const category = item.dataset.category;
        const count = category === 'all' ? links.length : (counts[category] || 0);
        item.querySelector('.count').textContent = count;
    });
}

function updatePopularTags() {
    const tagCounts = {};
    links.forEach(link => {
        link.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const container = document.getElementById('popularTags');
    container.innerHTML = sortedTags.map(([tag, count]) => 
        `<span class="tag" onclick="searchByTag('${tag}')">#${tag} (${count})</span>`
    ).join('');
}

function searchByTag(tag) {
    document.getElementById('searchInput').value = tag;
    document.getElementById('clearSearch').style.display = 'block';
    renderLinks();
}

// ==================== LINK ACTIONS ====================
function visitLink(linkId) {
    const link = links.find(l => l.id === linkId);
    if (link) {
        link.visits++;
        saveVisits();
        updateStats();
        window.open(link.url, '_blank');
    }
}

function saveVisits() {
    const visits = {};
    links.forEach(link => {
        visits[link.id] = link.visits;
    });
    localStorage.setItem('linkVault_visits', JSON.stringify(visits));
}

function toggleFavorite(linkId) {
    const link = links.find(l => l.id === linkId);
    if (link) {
        link.favorite = !link.favorite;
        saveFavorites();
        renderLinks();
        showToast('success', link.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos');
        updateFavoritesList();
    }
}

function saveFavorites() {
    const favoriteIds = links.filter(l => l.favorite).map(l => l.id);
    localStorage.setItem('linkVault_favorites', JSON.stringify(favoriteIds));
}

function updateFavoritesList() {
    const favorites = links.filter(l => l.favorite);
    const container = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        container.innerHTML = '<li style="padding: 10px 12px; color: var(--text-muted); font-size: 13px;">Nenhum favorito</li>';
    } else {
        container.innerHTML = favorites.map(link => `
            <li onclick="visitLink(${link.id})" style="cursor: pointer;">
                <i class="${link.icon}"></i> ${link.title}
            </li>
        `).join('');
    }
}

function deleteLink(linkId) {
    if (confirm('Tem certeza que deseja excluir este link?')) {
        links = links.filter(l => l.id !== linkId);
        saveLinksToStorage();
        renderLinks();
        updateCategoryCounts();
        showToast('success', 'Link excluído com sucesso!');
    }
}

// ==================== CONTEXT MENU ====================
function showContextMenu(e, linkId) {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
    contextMenu.classList.add('active');

    // Remove old listeners
    const newMenu = contextMenu.cloneNode(true);
    contextMenu.parentNode.replaceChild(newMenu, contextMenu);

    // Add new listeners
    newMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleContextAction(action, linkId);
            newMenu.classList.remove('active');
        });
    });
}

function handleContextAction(action, linkId) {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    switch (action) {
        case 'open':
            window.open(link.url, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(link.url);
            showToast('success', 'URL copiada!');
            break;
        case 'favorite':
            toggleFavorite(linkId);
            break;
    }
}

// ==================== THEME ====================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (isLight) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Modo Escuro</span>';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i><span>Modo Claro</span>';
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <span>${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ==================== UTILITIES ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
    return `${Math.floor(days / 365)} anos atrás`;
}

// Initialize favorites list
updateFavoritesList();
