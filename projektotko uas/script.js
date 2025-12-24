// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ========== DARK MODE TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
let themeIcon;

if (themeToggle) {
    themeIcon = themeToggle.querySelector('i');
    
    // Cek preferensi user
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    localStorage.setItem('darkMode', 'enabled');
    showToast('Dark mode diaktifkan! 🌙');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    localStorage.setItem('darkMode', 'disabled');
    showToast('Light mode diaktifkan! ☀️');
}

// ========== LOADING ANIMATION ==========
const loading = document.getElementById('loading');

function showLoading() {
    if (loading) loading.classList.add('active');
}

function hideLoading() {
    if (loading) loading.classList.remove('active');
}

// Simulasi loading saat klik link
document.querySelectorAll('a').forEach(link => {
    if (link.href && !link.href.includes('#') && link.target !== '_blank') {
        link.addEventListener('click', (e) => {
            if (link.href.includes('detail-produk') || link.href.includes('daftar') || link.href.includes('profil')) {
                showLoading();
                setTimeout(hideLoading, 800);
            }
        });
    }
});

// ========== SHOPPING CART ==========
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart display
function updateCart() {
    if (cartCount) cartCount.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart items in sidebar
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; margin-top: 50px;">Keranjang masih kosong</p>';
            if (cartTotal) cartTotal.textContent = 'Rp 0';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            itemsHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 5px;">${item.name}</h4>
                        <p>Rp ${item.price.toLocaleString()}</p>
                        <button onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px; font-size: 12px;">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            `;
            total += item.price;
        });
        
        cartItems.innerHTML = itemsHTML;
        if (cartTotal) cartTotal.textContent = `Rp ${total.toLocaleString()}`;
    }
}

// Add to cart function (global)
window.addToCart = function(productId, productName, productPrice, productImage) {
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
    };
    
    cart.push(product);
    updateCart();
    showToast(`${productName} ditambahkan ke keranjang! 🛒`);
    
    // Animasi cart icon
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
};

// Remove from cart
window.removeFromCart = function(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCart();
    showToast(`${removedItem.name} dihapus dari keranjang!`, 'error');
};

// Cart toggle
if (cartIcon && cartSidebar && cartOverlay && closeCart) {
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

// ========== PRODUCT FILTER ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.produk-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const brand = card.getAttribute('data-brand') || '';
                const price = parseInt(card.getAttribute('data-price')) || 0;
                
                let show = false;
                
                switch(filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'nike':
                        show = brand === 'nike';
                        break;
                    case 'adidas':
                        show = brand === 'adidas';
                        break;
                    case 'puma':
                        show = brand === 'puma';
                        break;
                    case 'harga':
                        show = price < 2000000;
                        break;
                    default:
                        show = true;
                }
                
                if (show) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========== ANIMATED COUNTER ==========
const counters = document.querySelectorAll('.counter-number');

function animateCounter() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounter, 20);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
}

// Trigger counter when in viewport
if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const counterContainer = document.querySelector('.counter-container');
    if (counterContainer) {
        observer.observe(counterContainer);
    }
}

// ========== TOAST NOTIFICATION ==========
const toast = document.getElementById('toast');

window.showToast = function(message, type = 'success') {
    if (toast) {
        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type);
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// ========== QUICK VIEW MODAL ==========
window.quickView = function(productId) {
    const products = {
        '1': {
            nama: 'Nike Air Max 270',
            harga: 'Rp 1.799.000',
            deskripsi: 'Sneaker dengan bantalan udara terbesar yang pernah dibuat Nike, memberikan kenyamanan sepanjang hari. Cocok untuk aktivitas sehari-hari dan olahraga ringan.',
            gambar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            brand: 'Nike',
            warna: 'Black/White',
            ukuran: '38-45',
            material: 'Mesh & Synthetic Leather',
            stok: '15 pasang'
        },
        '2': {
            nama: 'Adidas Ultraboost 22',
            harga: 'Rp 2.299.000',
            deskripsi: 'Menggunakan teknologi Boost terbaru untuk responsivitas maksimal saat berlari. Desain ergonomis mendukung bentuk kaki secara natural.',
            gambar: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            brand: 'Adidas',
            warna: 'Core Black/Solar Red',
            ukuran: '39-46',
            material: 'Primeknit+',
            stok: '8 pasang'
        },
        '3': {
            nama: 'Puma RS-X Bold',
            harga: 'Rp 1.499.000',
            deskripsi: 'Desain bold dengan paduan warna unik. Midsole tebal memberikan kenyamanan maksimal untuk gaya streetwear sehari-hari.',
            gambar: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            brand: 'Puma',
            warna: 'White/Blue/Orange',
            ukuran: '37-44',
            material: 'Suede & Textile',
            stok: '12 pasang'
        }
    };
    
    const product = products[productId];
    
    if (!product) return;
    
    // Create modal HTML
    const modalHTML = `
        <div class="quick-view-modal">
            <div class="quick-view-overlay"></div>
            <div class="quick-view-content">
                <button class="quick-view-close"><i class="fas fa-times"></i></button>
                <h2>Quick View</h2>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img src="${product.gambar}" alt="${product.nama}">
                    </div>
                    <div class="quick-view-info">
                        <h3>${product.nama}</h3>
                        <p class="quick-view-price">${product.harga}</p>
                        <p class="quick-view-description">${product.deskripsi}</p>
                        
                        <div class="quick-view-specs">
                            <p><strong>Brand:</strong> ${product.brand}</p>
                            <p><strong>Warna:</strong> ${product.warna}</p>
                            <p><strong>Ukuran:</strong> ${product.ukuran}</p>
                            <p><strong>Stok:</strong> ${product.stok}</p>
                        </div>
                        
                        <div class="quick-view-actions">
                            <a href="detail-produk.html?id=${productId}" class="btn-detail">
                                <i class="fas fa-info-circle"></i> Lihat Detail Lengkap
                            </a>
                            <button class="btn-beli" onclick="addToCart(${productId}, '${product.nama}', ${parseInt(product.harga.replace(/[^\d]/g, ''))}, '${product.gambar}'); closeQuickView()">
                                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal with animation
    setTimeout(() => {
        document.querySelector('.quick-view-modal').classList.add('active');
    }, 10);
    
    // Close modal functionality
    document.querySelector('.quick-view-close').addEventListener('click', closeQuickView);
    document.querySelector('.quick-view-overlay').addEventListener('click', closeQuickView);
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeQuickView();
    });
};

function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ========== FORM VALIDATION ==========
const formDaftar = document.getElementById('formDaftar');
if (formDaftar) {
    formDaftar.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password.length < 6) {
            showToast('Password minimal 6 karakter!', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Password dan Konfirmasi Password tidak cocok!', 'error');
            return;
        }
        
        showLoading();
        setTimeout(() => {
            hideLoading();
            showToast('Pendaftaran berhasil! 🎉');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1500);
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========== INITIALIZE ON LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // Update cart on page load
    updateCart();
    
    // Hide loading after page loads
    setTimeout(hideLoading, 500);
    
    // Add active class to current page in nav
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add animation to product cards on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${entries.indexOf(entry) * 0.2}s`;
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.produk-card').forEach(card => {
        animateOnScroll.observe(card);
    });
});