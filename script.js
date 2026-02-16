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
function saveLinksToStorage() {
    localStorage.setItem('linkVault_links', JSON.stringify(links));
}

function loadLinksFromStorage() {
    const stored = localStorage.getItem('linkVault_links');
    if (stored) {
        links = JSON.parse(stored);
    } else {
        // Sample data
        links = [
            {
                id: Date.now() + 1,
                title: 'GitHub',
                url: 'https://github.com',
                description: 'Plataforma de hospedagem de código-fonte e controle de versão usando Git',
                category: 'development',
                icon: 'fab fa-github',
                tags: ['git', 'código', 'colaboração'],
                color: '#181717',
                favorite: true,
                visits: 127,
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                title: 'Figma',
                url: 'https://figma.com',
                description: 'Ferramenta colaborativa de design de interface e prototipagem',
                category: 'design',
                icon: 'fas fa-pencil-ruler',
                tags: ['design', 'ui', 'prototipagem'],
                color: '#F24E1E',
                favorite: false,
                visits: 89,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() + 3,
                title: 'Notion',
                url: 'https://notion.so',
                description: 'Workspace all-in-one para anotações, documentos e gerenciamento de projetos',
                category: 'productivity',
                icon: 'fas fa-file-alt',
                tags: ['produtividade', 'notas', 'documentos'],
                color: '#000000',
                favorite: true,
                visits: 234,
                createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: Date.now() + 4,
                title: 'freeCodeCamp',
                url: 'https://freecodecamp.org',
                description: 'Aprenda a programar gratuitamente com tutoriais interativos',
                category: 'learning',
                icon: 'fas fa-code',
                tags: ['programação', 'grátis', 'cursos'],
                color: '#0A0A23',
                favorite: false,
                visits: 56,
                createdAt: new Date(Date.now() - 259200000).toISOString()
            }
        ];
        saveLinksToStorage();
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

    // Add link button
    document.getElementById('addLinkBtn').addEventListener('click', openAddLinkModal);

    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('linkForm').addEventListener('submit', handleFormSubmit);
    
    // Click outside modal to close
    document.getElementById('linkModal').addEventListener('click', (e) => {
        if (e.target.id === 'linkModal') {
            closeModal();
        }
    });

    // Random color
    document.getElementById('randomColor').addEventListener('click', () => {
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('linkColor').value = randomColor;
    });

    // Fetch metadata
    document.getElementById('fetchMetadata').addEventListener('click', fetchUrlMetadata);

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
        // Ctrl/Cmd + N = New link
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openAddLinkModal();
        }
        // Escape = Close modal
        if (e.key === 'Escape') {
            closeModal();
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
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');

            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(linkId);
                });
            }

            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditLinkModal(linkId);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteLink(linkId);
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
                    <button class="link-action-btn edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="link-action-btn delete-btn" title="Excluir">
                        <i class="fas fa-trash"></i>
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
        saveLinksToStorage();
        updateStats();
        window.open(link.url, '_blank');
    }
}

function toggleFavorite(linkId) {
    const link = links.find(l => l.id === linkId);
    if (link) {
        link.favorite = !link.favorite;
        saveLinksToStorage();
        renderLinks();
        showToast('success', link.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos');
        updateFavoritesList();
    }
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

// ==================== MODAL ====================
function openAddLinkModal() {
    editingLinkId = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Novo Link';
    document.getElementById('linkForm').reset();
    document.getElementById('linkColor').value = '#3b82f6';
    document.getElementById('linkModal').classList.add('active');
}

function openEditLinkModal(linkId) {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    editingLinkId = linkId;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Link';
    document.getElementById('linkTitle').value = link.title;
    document.getElementById('linkUrl').value = link.url;
    document.getElementById('linkDescription').value = link.description;
    document.getElementById('linkCategory').value = link.category;
    document.getElementById('linkIcon').value = link.icon;
    document.getElementById('linkTags').value = link.tags.join(', ');
    document.getElementById('linkColor').value = link.color;
    document.getElementById('linkModal').classList.add('active');
}

function closeModal() {
    document.getElementById('linkModal').classList.remove('active');
    editingLinkId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const linkData = {
        title: document.getElementById('linkTitle').value,
        url: document.getElementById('linkUrl').value,
        description: document.getElementById('linkDescription').value,
        category: document.getElementById('linkCategory').value,
        icon: document.getElementById('linkIcon').value || 'fas fa-link',
        tags: document.getElementById('linkTags').value.split(',').map(t => t.trim()).filter(t => t),
        color: document.getElementById('linkColor').value
    };

    if (editingLinkId) {
        // Edit existing link
        const link = links.find(l => l.id === editingLinkId);
        if (link) {
            Object.assign(link, linkData);
            showToast('success', 'Link atualizado com sucesso!');
        }
    } else {
        // Add new link
        const newLink = {
            id: Date.now(),
            ...linkData,
            favorite: false,
            visits: 0,
            createdAt: new Date().toISOString()
        };
        links.unshift(newLink);
        showToast('success', 'Link adicionado com sucesso!');
    }

    saveLinksToStorage();
    closeModal();
    renderLinks();
    updateCategoryCounts();
}

async function fetchUrlMetadata() {
    const url = document.getElementById('linkUrl').value;
    if (!url) {
        showToast('warning', 'Digite uma URL primeiro!');
        return;
    }

    showToast('info', 'Buscando informações...');
    
    // Simulated metadata fetch (in real app, use a backend API)
    // For now, just extract domain name
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        document.getElementById('linkTitle').value = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
        showToast('success', 'Informações preenchidas!');
    } catch (error) {
        showToast('error', 'URL inválida!');
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
        case 'edit':
            openEditLinkModal(linkId);
            break;
        case 'copy':
            navigator.clipboard.writeText(link.url);
            showToast('success', 'URL copiada!');
            break;
        case 'favorite':
            toggleFavorite(linkId);
            break;
        case 'delete':
            deleteLink(linkId);
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

// ==================== EXPORT/IMPORT ====================
function exportLinks() {
    const dataStr = JSON.stringify(links, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvault-backup-${Date.now()}.json`;
    link.click();
    showToast('success', 'Links exportados com sucesso!');
}

function importLinks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            links = imported;
            saveLinksToStorage();
            renderLinks();
            updateCategoryCounts();
            showToast('success', 'Links importados com sucesso!');
        } catch (error) {
            showToast('error', 'Erro ao importar arquivo!');
        }
    };
    reader.readAsText(file);
}

// Initialize favorites list
updateFavoritesList();
