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
        <p>Quantity: <span class="quantity" id="quantity-${product.id}">${product.quantity}</span></p>
        <p><del><span class="previous-price">Ksh.${product.previousPrice.toFixed(2)}</span></del></p>
        <p>Price: Ksh.${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
        <button class="delete-product" data-id="${product.id}">Delete</button>
      `;
      productList.appendChild(item);
  
      
    // Add event listener to "Add to cart" button
    const addToCartBtn = item.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
    const id = parseInt(addToCartBtn.dataset.id);
    const quantityEl = document.querySelector(`#quantity-${id}`);
    let quantity = parseInt(quantityEl.textContent);
        if (quantity === 0) {
        quantityEl.textContent = "Out of stock";
        quantityEl.style.color = "red";
        addToCartBtn.disabled = true;
        return;
    }
  quantityEl.textContent = --quantity;
  const itemInCart = cart.find(item => item.id === id);
  if (itemInCart) {
    itemInCart.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1
    });
  }
  updateCart();
});
    // Add event listener to "Delete" button
    const deleteProductBtn = item.querySelector('.delete-product');
    deleteProductBtn.addEventListener('click', () => {
    const id = parseInt(deleteProductBtn.dataset.id);
    deleteProduct(id);
 });
});
}
function addToCart(id) {
    const productToAdd = products.find(product => product.id === id);
    const itemInCart = cart.find(item => item.id === id);
  
    if (itemInCart) {
      // If item is already in cart, increase quantity
      if (itemInCart.quantity === productToAdd.quantity) {
        alert('Out of stock');
        const quantityP = document.querySelector('#quantity-' + id);
        quantityP.textContent = productToAdd.quantity;
        return;
        }
        itemInCart.quantity++;
        } else {
        // Add new item to cart
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
        message.textContent = "Purchase Done! Thank you for shopping with us.";
        message.style.color =  "green";
        document.body.appendChild(message);
        setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
        // Reload page
        setTimeout(() => {
        location.reload();
    }, 3000);
    });

function deleteProduct(id) {
    // Send a DELETE request to the server to remove the product
    fetch(`http://localhost:3000/items/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      // Remove the product from the products array
      products = products.filter(product => product.id !== id);
      // Remove the product from the display
      const productToRemove = document.querySelector(`li[data-id="${id}"]`);
      productList.removeChild(productToRemove);
    })
    .catch(error => console.error(`Error deleting product: ${error}`));
  }
  

  // Update cart
function updateCart() {
    // Clear cart items
    cartItems.innerHTML = '';
    // Initialize total
    let total = 0;
    // Update cart items in table
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>Ksh.${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>Ksh.${(item.price * item.quantity).toFixed(2)}</td>
            `;
        cartItems.appendChild(row);
        total += item.price * item.quantity;
    });

}

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
    const quantity = parseInt(document.querySelector('#quantity').value);
    const previousPrice = parseFloat(document.querySelector('#previous-price').value);
    const price = parseFloat(document.querySelector('#price').value);

    const newProduct = {
    name: name,
    description: description,
    quantity: quantity,
    previousPrice: previousPrice,
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

    console.log('Payment method:', paymentMethod);
    console.log('Phone number:', phoneNumber);
    console.log('Name:', name);
    console.log('Location:', location);
});

// Add event listener to "Update cart" button
updateCartBtn.addEventListener('click', () => {
updateCart();
});



