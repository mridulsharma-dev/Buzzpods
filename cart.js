// Initialize cart array to store items
let cart = [];

// Add to cart functionality
function addToCart(productImage, productName, productCategory, productPrice) {
    const cartItem = {
        image: productImage,
        name: productName,
        category: productCategory,
        price: parseFloat(productPrice.replace('₹', '')),
        quantity: 1
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (existingItemIndex !== -1) {
        // If item exists, increment quantity
        cart[existingItemIndex].quantity++;
        
    } else {
        // If item doesn't exist, add to cart
        cart.push(cartItem);
        
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart UI
    updateCartUI();
}

// Remove from cart functionality
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.lni-cart-1');
    const shopCartCards = document.querySelector('.shop-cart-cards');
    const subtotalInfo = document.querySelector('.subtotal-info');
    
    // Update cart icon
    if (cart.length > 0) {
        cartCount.setAttribute('data-count', cart.length);
    } else {
        cartCount.removeAttribute('data-count');
    }

    // If not on cart page, only update the cart count
    if (!shopCartCards || !subtotalInfo) return;

    // Update cart items display
    if (cart.length === 0) {
        shopCartCards.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        subtotalInfo.innerHTML = `
            <div>
                <h4><strong>Sub Total</strong></h4>
                <p>0 items Selected</p>
            </div>
            <h5> <strong>₹0.00 </strong></h5>
        `;
        return;
    }

    // Generate cart items HTML
    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartHTML += `
            <div class="shop-cards">
                <div class="cart-img">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid">
                    <input type="checkbox" checked>
                </div>
                <div class="cart-info">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.category}</p>
                    </div>
                    <div>
                        <h5>₹${itemTotal.toFixed(2)}</h5>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.name}')">
                   <img src="Images/close-circle-line.png.png" alt="Remove">
                </button>
            </div>
        `;
    });

    // Update cart display
    shopCartCards.innerHTML = cartHTML;
    
    // Update subtotal
    subtotalInfo.innerHTML = `
        <div>
            <h4>Sub Total</h4>
            <p>${cart.length} item${cart.length > 1 ? 's' : ''} Selected</p>
        </div>
        <h5 > <strong>₹${total.toFixed(2)}<strong></h5>
    `;
}

// Order form functionality
function openOrderForm() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    document.getElementById('orderFormModal').style.display = 'block';
}

function closeOrderForm() {
    document.getElementById('orderFormModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    // Clear cart after successful order
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    window.location.href = 'Shop.html'; // Redirect to shop page
}

// Handle order form submission
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    // Add click event listeners to all add to cart buttons
    const addButtons = document.querySelectorAll('.plus-icon button');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = this.closest('.item');
            const productImage = productCard.querySelector('img').src;
            const productName = productCard.querySelector('h3').textContent.trim();
            const productCategory = productCard.querySelector('p').textContent.trim();
            const productPrice = productCard.querySelector('h5').textContent.trim();
            
            addToCart(productImage, productName, productCategory, productPrice);
        });
    });

    // Initialize cart UI
    updateCartUI();

    // Add order form submission handler
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the order to a server
            // For now, we'll just show the success message
            document.getElementById('orderFormModal').style.display = 'none';
            document.getElementById('successModal').style.display = 'block';
        });
    }
});

// Add CSS for notifications and cart count
const style = document.createElement('style');
style.textContent = `
    .lni-cart-1[data-count]:after {
        content: attr(data-count);
        position: absolute;
        top: -10px;
        right: -10px;
        background: red;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: bold;
    }
    .lni-cart-1 {
        position: relative;
    }
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background:red;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    .empty-cart {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 16px;
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);