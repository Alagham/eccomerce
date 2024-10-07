function loadProducts() { 
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let delicacyinHTML = "";

        data.forEach(item => {
            delicacyinHTML += 
                `<div class="delicacy-list">
                    <img src="${item.image.thumbnail}" alt="${item.name}"/>
                    <button class="add-to-cart-btn"> <img src="./assets/images/icon-add-to-cart.svg" alt=""/> Add to Cart</button>
                    <button class="add-to-cart-btn2">
                        <span class="minus-btn">-</span> 
                        <span class="cart-count">0</span> 
                        <span class="plus-btn">+</span>
                    </button>
                    <p class="nametype">${item.category}</p>
                    <h4 class="name">${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>`;
        });

        document.querySelector(".delicacy").innerHTML = delicacyinHTML;

        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        const addToCartBtns2 = document.querySelectorAll('.add-to-cart-btn2');
         // The "Your cart (0)" section
        const cartCountDisplay = document.querySelector('.cart-section h2');
        const cartSection = document.querySelector('.cart-section');
         // Container for cart items
        const cartItemsContainer = document.createElement('div');
        // Display total amount
        const totalDisplay = document.createElement('h3'); 

        let cartCount = 0;
        let totalAmount = 0;

        const emptyCartImage = cartSection.querySelector('img');
        const emptyCartText = cartSection.querySelector('p');

        // Add the container to the cart section
        cartSection.appendChild(cartItemsContainer); 
        // Add the total amount display to the cart section
        cartSection.appendChild(totalDisplay); 

        addToCartBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                btn.style.display = 'none';
                addToCartBtns2[index].style.display = 'block';

                // Add item to cart
                addItemToCart(data[index]);
            });
        });

        addToCartBtns2.forEach((btn2, index) => {
            const minusBtn = btn2.querySelector('.minus-btn');
            const plusBtn = btn2.querySelector('.plus-btn');
            const cartCountBtn = btn2.querySelector('.cart-count');

            minusBtn.addEventListener('click', function() {
                let currentCount = parseInt(cartCountBtn.textContent);
                if (currentCount > 0) {
                    currentCount--;
                    cartCountBtn.textContent = currentCount;
                    cartCount--;
                    cartCountDisplay.textContent = `Your cart (${cartCount})`;

                    // Subtract price from total
                    totalAmount -= data[index].price;
                    updateTotalDisplay();

                    // Remove item from cart if count is 0
                    if (currentCount === 0) {
                        removeItemFromCart(data[index]);
                        addToCartBtns2[index].style.display = 'none';
                        addToCartBtns[index].style.display = 'block';
                    }
                }
            });

            plusBtn.addEventListener('click', function() {
                let currentCount = parseInt(cartCountBtn.textContent);
                currentCount++;
                cartCountBtn.textContent = currentCount;
                cartCount++;
                cartCountDisplay.textContent = `Your cart (${cartCount})`;

                // Add price to total
                totalAmount += data[index].price;
                updateTotalDisplay();
            });
        });

        function addItemToCart(item) {
            // Hide image and text once an item is added
            if (cartCount === 0) {
                emptyCartImage.style.display = 'none';
                emptyCartText.style.display = 'none';
            }

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `<h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p>`;
            cartItemsContainer.appendChild(cartItem);

            // Update total price
            totalAmount += item.price;
            updateTotalDisplay();
        }

        function removeItemFromCart(item) {
            const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
            cartItems.forEach(cartItem => {
                if (cartItem.querySelector('h4').textContent === item.name) {
                    cartItemsContainer.removeChild(cartItem);
                }
            });

            // If the cart is empty, restore the image and message
            if (cartCount === 0) {
                emptyCartImage.style.display = 'block';
                emptyCartText.style.display = 'block';
            }
        }

        function updateTotalDisplay() {
            totalDisplay.textContent = `Total: $${totalAmount.toFixed(2)}`;
        }
    })
    .catch(error => console.error("Error:", error));
}

window.onload = loadProducts;
