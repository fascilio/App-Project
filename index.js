// Variables
    const productList = document.querySelector('#product-list');
    const cartItems = document.querySelector('#cart-items tbody');
    const updateCartBtn = document.querySelector('#update-cart-btn');
    const postProductForm = document.querySelector('#post-product-form');

    let products = []; 
    let cart = []; 

// Fetch products from server
    fetch('http://localhost:3000/items')
    .then(response => response.json())
    .then(data => {
      products = data;
      displayProducts();
  });

// Display products on page
function displayProducts() {
    products.forEach(product => {
    const item = document.createElement('li');
     item.innerHTML = `
     <h2>${product.name}</h2>
     <p>${product.description}</p>
     <p>Price: Ksh.${product.price.toFixed(2)}</p>
     <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
     <button class="delete-product" data-id="${product.id}">Delete</button>
`;
  productList.appendChild(item);

// Add event listener to "Add to cart" button
    const addToCartBtn = item.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
    const id = parseInt(addToCartBtn.dataset.id);
    addToCart(id);
});
// Add event listener to 'Delete' button 
    const deleteProductBtn = item.querySelector('.delete-product');
    deleteProductBtn.addEventListener('click', () => {
    const id = parseInt(deleteProductBtn.dataset.id);
    deleteProduct(id);
});
});
}
// Add item to cart
function addToCart(id) {
    const productToAdd = products.find(product => product.id === id);
    const itemInCart = cart.find(item => item.id === id);

    if (itemInCart) {
        // If item is already in cart, increase quantity
    itemInCart.quantity++;
    } else {
      // If item is not in cart, add to cart with quantity of 1
    cart.push({
    id: productToAdd.id,
    name: productToAdd.name,
    description: productToAdd.description,
    price: productToAdd.price,
    quantity: 1
    });
}
    updateCart();
}

const buyBtn = document.querySelector('#buy');
    buyBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const message = document.createElement('div');
    message.textContent = "Thank you for shopping with us. You were served by SAMUEL.";
    document.body.appendChild(message);
    setTimeout(() => {
    document.body.removeChild(message);
}, 3000);
    // Reload page
    setTimeout(() => {
    location.reload();
}, 3000);
});
// Delete product from server and remove from page
function deleteProduct(id) {
    fetch(`http://localhost:3000/items/${id}`, { method: 'DELETE' 
    })
    .then(response => response.json())
    .then(() => {
    products = products.filter(product => product.id !== id);

// Remove product from page
    const itemToRemove = productList.querySelector(`[data-id="${id}"]`);
    productList.removeChild(itemToRemove);
    })
    .catch(error => console.error(`Error deleting product: ${error}`));
}
// Update cart
function updateCart() {
    // Clear cart items
    cartItems.innerHTML = '';
    // Update cart items in table
    cart.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.description}</td>
    <td>Ksh.${item.price.toFixed(2)}</td>
    <td><input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="item-quantity"></td>
    <td><button class="remove-item" data-id="${item.id}">Remove</button></td>
    `;
    cartItems.appendChild(row);
});
// Add event listener to "Remove" button
const removeItemBtn = row.querySelector('.remove-item');
    removeItemBtn.addEventListener('click', () => {
        const id = parseInt(removeItemBtn.dataset.id);
    removeFromCart(id);
});
// Add event listener to quantity input
const quantityInput = row.querySelector('.item-quantity');
    quantityInput.addEventListener('input', () => {
    const id = parseInt(quantityInput.dataset.id);
    updateItemQuantity(id, parseInt(quantityInput.value));
    });

};
// Update cart total
const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
document.querySelector('#cart-total').textContent = `Ksh.${cartTotal.toFixed(2)}`;

// Remove item from cart
function removeFromCart(id) {
cart = cart.filter(item => item.id !== id);
updateCart();
}

// Update cart items in table
function updateCart() {
    // Clear table body
cartItems.innerHTML = '';

// Update cart items
cart.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>Ksh.${item.price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="item-quantity"></td>
        <td><button class="remove-item" data-id="${item.id}">Remove</button></td>
    `;
cartItems.appendChild(row);

// Add event listener to "Remove" button
const removeBtn = row.querySelector('.remove-item');
removeBtn.addEventListener('click', () => {
  const id = parseInt(removeBtn.dataset.id);
  removeFromCart(id);
});
  // Add event listener to quantity input
  const quantityInput = row.querySelector('.item-quantity');
quantityInput.addEventListener('change', () => {
    const id = parseInt(quantityInput.dataset.id);
    const newQuantity = parseInt(quantityInput.value);
    updateCartQuantity(id, newQuantity);
});
});

// Update cart total
const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
document.querySelector('#cart-total').textContent = `Ksh.${cartTotal.toFixed(2)}`;

// Update cart link text
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartLink.textContent = `Cart (${cartItemCount})`;
}
// Update item quantity in cart
function updateItemQuantity(id, quantity) {
    const itemToUpdate = cart.find(item => item.id === id);
    itemToUpdate.quantity = quantity;
        updateCart();
}

//Submit post product form
postProductForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const description = document.querySelector('#description').value;
    const price = parseFloat(document.querySelector('#price').value);

    const newProduct = {
    name: name,
    description: description,
    price: price
};

    fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
    'Content-Type': 'application/json'
    },
body: JSON.stringify(newProduct)
})
    .then(response => response.json())
    .then(data => {
    products.push(data);
    displayProducts();
    postProductForm.reset();
    });
});


// Update cart link text
function updateCartLinkText() {
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLinkText = `Cart (${cartItemCount})`;
    cartLink.textContent = cartLinkText;
}
// Initialize cart link text
// updateCartLinkText();

const clientInfoForm = document.querySelector('#client-info-form');

clientInfoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const paymentMethod = document.querySelector('#payment-method').value;
    const phoneNumber = document.querySelector('#phone-number').value;
    const name = document.querySelector('#name1').value;
    const location = document.querySelector('#location').value;

 // Use the form data as needed in your code
    console.log('Payment method:', paymentMethod);
    console.log('Phone number:', phoneNumber);
    console.log('name:', name);
    console.log('Location:', location);
});

// Add event listener to "Update cart" button
updateCartBtn.addEventListener('click', () => {
updateCart();
});