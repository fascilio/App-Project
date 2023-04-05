## README
This is a program that it's an implementation of a simple shopping 
cart that retrieves data from a server, displays the products on a 
webpage, it allows a user to add them to a cart, delete from the cart and checkout.

## Variables
 The program has various variables such as:
 =>`productList` a constant that points to the HTML element that 
 will display the list of products
 =>`cartItems` it points to HTML element that will display the cart
 =>`updateCartBtn` it points to the elemnt that will update the cart
 =>`postProductForm` it points to the element that will post new products to the server.
 =>`products` an empty array that will store products retrieved from the server
 =>`cart` an empty array that will store products added to cart

 ## Fetching Products from the server
 The program uses `fetch()` method to retrieve products from a server running  on `http://localhost:3000/items`.
 Once the response is received, it is converted to JSON formart using `json()` method, and resulting data is stored in the ``products` array.
 Then the `displayProducts()` function is called to display the products on the webpage.
 The `displayProducts()` function loops through the `products` array and creates a new HTML list item element for each product. 
 The product's name, description, quantity, price, and buttons to add to cart and delete the product are added to the list item element
 There are event listeners added tothe add to cart and delete buttons and works in a way that when add to cart button is clicked 
 the product is added to the cart and the quantity decrease by one.
 If the quantity reaches zero, the button is disabled and the quantity is displayed as "Out of stock". If the delete button is clicked
 a DELETE requst is sent to the server to remove the product from the database and also removed from display.
 The `updateCart` function is called whenever the cart is updated, either by adding or removing items. It clears the cart item table, calculates the new total cost of the cart and updates the cart with the new data.
 There is a remove button on items added to cart and this is for removing items from cart if the user has changed preference.
 There is a calculator function where it calculates the cost products added to cart depending with their quantity.

 ## Adding a new product
 The `postProductForm` is a form that can be used to post new products to the server.
 The form data is sent as a POST request to `http://localhost:3000/items`. when the request is received the `products` arrayis updated with the new product and displayed on the bage by `displayProducts()` function.

 ## Checking out
 When the "buy" button is clicked, a message is displayed thanking the user for shopping. After three seconds, the page reloads.

 ## Conclusion
 This program provides a simple implementation of a shopping cart that can be used as a starting point for building a complex e-commerce applications.

 ## Resources
 `http://localhost:3000/items`

 ## Author
 Samuel Karanja.