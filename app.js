// NOTNICE E-commerce Application JavaScript - Fixed Version

// Product data from the provided JSON
let products = [
    {
        id: "notnice-cross-hoodie-001",
        title: "NOTNICE Gothic Cross Hoodie",
        description: "Premium heavyweight hoodie featuring the signature NOTNICE cross emblem. Crafted with rebellion and luxury in mind.",
        price: 295,
        category: "Hoodies",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
        tags: ["gothic", "streetwear", "luxury", "cross", "black"]
    },
    {
        id: "notnice-silver-chain-002",
        title: "NOTNICE Sterling Silver Chain",
        description: "Heavy sterling silver chain with gothic cross pendant. Each piece is handcrafted and unique.",
        price: 450,
        category: "Jewelry",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        tags: ["jewelry", "silver", "chain", "gothic", "luxury"]
    },
    {
        id: "notnice-rebel-tee-003",
        title: "NOTNICE Rebel T-Shirt",
        description: "Premium cotton tee with distressed NOTNICE logo. Perfect for the rebellious soul.",
        price: 85,
        category: "T-Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        tags: ["t-shirt", "cotton", "rebel", "logo", "casual"]
    },
    {
        id: "notnice-leather-jacket-004",
        title: "NOTNICE Moto Leather Jacket",
        description: "Genuine leather moto jacket with silver hardware and NOTNICE embossed details. A statement piece for the bold.",
        price: 795,
        category: "Outerwear",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        tags: ["leather", "jacket", "moto", "luxury", "statement"]
    },
    {
        id: "notnice-cross-ring-005",
        title: "NOTNICE Gothic Cross Ring",
        description: "Sterling silver ring featuring intricate gothic cross design. Available in multiple sizes.",
        price: 185,
        category: "Jewelry",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        tags: ["ring", "silver", "gothic", "cross", "jewelry"]
    },
    {
        id: "notnice-beanie-006",
        title: "NOTNICE Gothic Beanie",
        description: "Soft knit beanie with embroidered NOTNICE logo. Essential for the modern rebel.",
        price: 65,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop",
        tags: ["beanie", "accessories", "logo", "knit", "casual"]
    }
];

// Cart functionality
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const uploadForm = document.getElementById('uploadForm');
const filePreview = document.getElementById('filePreview');
const productImageInput = document.getElementById('productImage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    setupSmoothScrolling();
    setupFileUpload();
});

// Render products based on current filter
function renderProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #c0c0c0; grid-column: 1 / -1; padding: 40px;">No products found in this category.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-tags">
                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <button class="btn btn--primary btn--sm" onclick="addToCart('${product.id}')">
                    ADD TO CART
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add product to cart with visual feedback
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartFeedback();
    showNotification(`${product.title} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
    
    if (product) {
        showNotification(`${product.title} removed from cart!`);
    }
}

// Update cart count and total
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
    
    // Hide cart count badge if empty
    if (totalItems === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'flex';
    }
}

// Show cart feedback animation
function showCartFeedback() {
    cartBtn.style.transform = 'scale(1.2)';
    cartBtn.style.boxShadow = '0 0 20px rgba(192, 192, 192, 0.5)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
        cartBtn.style.boxShadow = '';
    }, 300);
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render cart items in modal
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #c0c0c0; padding: 20px;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.title}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="btn-remove" onclick="removeFromCart('${item.id}')" title="Remove from cart">
                ×
            </button>
        </div>
    `).join('');
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = productImageInput;
    const filePreviewContainer = filePreview;
    
    // Create a custom file upload button
    const customFileButton = document.createElement('div');
    customFileButton.className = 'custom-file-upload';
    customFileButton.innerHTML = `
        <div class="file-upload-icon">📷</div>
        <div class="file-upload-text">
            <strong>Click to upload image</strong>
            <br>or drag and drop
        </div>
    `;
    
    // Replace the original input
    fileInput.style.display = 'none';
    fileInput.parentNode.insertBefore(customFileButton, fileInput.nextSibling);
    
    customFileButton.addEventListener('click', () => fileInput.click());
    
    // Drag and drop functionality
    customFileButton.addEventListener('dragover', (e) => {
        e.preventDefault();
        customFileButton.classList.add('dragover');
    });
    
    customFileButton.addEventListener('dragleave', () => {
        customFileButton.classList.remove('dragover');
    });
    
    customFileButton.addEventListener('drop', (e) => {
        e.preventDefault();
        customFileButton.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFilePreview({ target: { files } });
        }
    });
}

// Handle file preview
function handleFilePreview(e) {
    const file = e.target.files[0];
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = `
                <div class="file-preview-container">
                    <img src="${e.target.result}" alt="Preview" class="file-preview-image">
                    <div class="file-preview-info">
                        <p class="file-name">${file.name}</p>
                        <p class="file-size">${(file.size / 1024).toFixed(1)} KB</p>
                        <button type="button" class="btn-remove-file" onclick="clearFilePreview()">Remove</button>
                    </div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        filePreview.innerHTML = '';
    }
}

// Clear file preview
function clearFilePreview() {
    productImageInput.value = '';
    filePreview.innerHTML = '';
}

// Enhanced form validation
function validateForm() {
    const productName = document.getElementById('productName').value.trim();
    const productDescription = document.getElementById('productDescription').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value;
    
    const errors = [];
    
    if (!productName) errors.push('Product name is required');
    if (!productDescription) errors.push('Product description is required');
    if (!productPrice || productPrice <= 0) errors.push('Valid price is required');
    if (!productCategory) errors.push('Product category is required');
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Handle product upload with enhanced validation
function handleProductUpload(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const file = productImageInput.files[0];
    
    // Get form values
    const productName = document.getElementById('productName').value.trim();
    const productDescription = document.getElementById('productDescription').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value;
    const productTags = document.getElementById('productTags').value.trim();
    
    // Create new product
    const newProduct = {
        id: `notnice-${Date.now()}`,
        title: productName,
        description: productDescription,
        price: productPrice,
        category: productCategory,
        image: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        tags: productTags ? productTags.split(',').map(tag => tag.trim().toLowerCase()) : []
    };
    
    // Add to products array
    products.unshift(newProduct);
    
    // Reset form
    uploadForm.reset();
    clearFilePreview();
    
    // Re-render products
    renderProducts();
    
    // Show success message
    showNotification(`${productName} added successfully!`);
    
    // Scroll to products section
    setTimeout(() => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        renderCartItems();
        document.body.style.overflow = 'hidden';
    });
    
    closeCartModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal on outside click
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`Thank you for your order! Total: $${total.toFixed(2)}\n\nThis is a demo - no actual payment was processed.`);
        
        cart = [];
        updateCartUI();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current filter and render products
            currentFilter = button.dataset.filter;
            renderProducts();
        });
    });
    
    // File input preview
    productImageInput.addEventListener('change', handleFilePreview);
    
    // Upload form
    uploadForm.addEventListener('submit', handleProductUpload);
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle window scroll for header effects
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
    }
});

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearFilePreview = clearFilePreview;