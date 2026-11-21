// 1. Initialize Cart from localStorage (keeps cart across pages)
let cart = JSON.parse(localStorage.getItem('solevaultCart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('solevaultCart', JSON.stringify(cart));
}

// 2. Add to Cart Function
function addToCart(name, price) {
    cart.push({ name, price });
    saveCart(); // Save to local storage
    updateCartUI();
    
    // Automatically open the cart when an item is added
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
}

// 3. Update the UI (List, Total Price, Badge)
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cart-count');

    // Update Badge Count
    if (cartCount) cartCount.innerText = cart.length;

    // Clear current items
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty. Start shopping!</p>';
        if (cartTotal) cartTotal.innerText = 'KSh 0';
        return;
    }

    let total = 0;

    // Loop through cart array and create HTML for each item
    cart.forEach((item, index) => {
        total += item.price;
        
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>KSh ${item.price.toLocaleString()}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        if (cartItemsContainer) cartItemsContainer.appendChild(itemDiv);
    });

    // Update Total Price
    if (cartTotal) cartTotal.innerText = `KSh ${total.toLocaleString()}`;
}

// 4. Remove Item from Cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove 1 item at the specific index
    saveCart(); // Update local storage
    updateCartUI();
}

// 5. Open/Close Cart Sidebar
function toggleCart(event) {
    if(event) event.preventDefault(); 
    
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// 6. Mobile Menu Toggle (Hamburger)
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// 7. Search Functionality
function toggleSearch(event) {
    if (event) event.preventDefault(); 
    
    const searchBar = document.getElementById('searchBar');
    const input = document.getElementById('searchInput');
    
    if (searchBar && input) {
        searchBar.classList.toggle('active');
        
        if (searchBar.classList.contains('active')) {
            // Focus the input so the user can type immediately
            setTimeout(() => input.focus(), 300); 
        } else {
            // If closed, clear the search and bring all products back
            input.value = '';
            filterProducts();
        }
    }
}

function filterProducts() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        // Get the title (h3) and category (p) text
        const title = product.querySelector('h3').textContent.toLowerCase();
        const category = product.querySelector('p').textContent.toLowerCase();
        
        // Check if the query matches the title or category
        if (title.includes(query) || category.includes(query)) {
            product.style.display = 'flex'; // Show product
        } else {
            product.style.display = 'none'; // Hide product
        }
    });
}

// 8. Checkout Function via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some shoes first.");
        return;
    }

    const phoneNumber = "254791188746"; 

    let message = "Hello SoleVault! I would like to order the following shoes:%0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        message += `👟 ${index + 1}. ${item.name} - KSh ${item.price.toLocaleString()}%0A`;
        total += item.price;
    });

    message += `%0A*Total: KSh ${total.toLocaleString()}*`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, "_blank");
    
    // Clear the cart and close the sidebar after checkout
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// 9. Run UI Update on Page Load (so cart count is correct immediately)
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});