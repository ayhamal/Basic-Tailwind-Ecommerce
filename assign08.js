var products = []
var productsOnCart = []

const productsContainer = document.querySelector('#productsContainer')
const productsOnShoppingCartContainer = document.querySelector('#productsOnShoppingCartContainer')
const shoppingCartForm = document.querySelector('#shoppingCartForm')
const phoneNumberInputField = document.querySelector('#phoneNumber')
const formatPhoneNumberSpanErrorMessage = document.querySelector('#formatPhoneNumberErrorMessage')
const messageCartEmpty = document.querySelector('#messageCartEmpty')
const btnSubmitForm = document.querySelector('#btnSubmitForm')
const btnResetForm = document.querySelector('#btnResetForm')

window.onload = function() {
    getProducts()
}

function addProductsCardsToDOM(productsData) {
    let productsCardsHTML = ``
    for (const product of productsData) {
        productsCardsHTML += `
            <!-- Product ${product.id} -->
            <div id="product_${product.id}" class="product-card w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
                <div class="flex items-end justify-end h-56 w-full bg-cover" style="background-image: url('${product.imageUrl}')">
                    <button
                        id="btnProduct${product.id}"
                        onclick="addProductToCart(event)"
                        productId="${product.id}"
                        class="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                            Add
                    </button>
                </div>
                <div class="px-5 py-3">
                    <h3 class="text-gray-700 uppercase">${product.title}</h3>
                    <span class="text-gray-500 mt-2">$${product.pricing}</span><br/>
                    <p>${product.description}</p>
                </div>
            </div>
        `
    }
    productsContainer.innerHTML = productsCardsHTML
}

function addProductsCardsToShoppingCart(product) {
    let productCardHTML = `
        <!-- Item ${product.id} -->
        <div id="productOnShoppingCartCard${product.id}" class="flex justify-between mt-6">
            <div class="flex">
                <img class="h-20 w-20 object-cover rounded" src="${product.imageUrl}">
                <div class="mx-3">
                    <h3 class="text-sm text-gray-600">${product.title}</h3>
                    <input id="item_${product.id}" name="item_${product.id}" type="checkbox" name="item_0">
                    <span>Buy</span>
                    <div class="flex items-center mt-2">
                        <button id="btnIncrementItem${product.id}" onclick="incrementNumberOfSelectedProducts(${product.id}, event)" class="text-blue-500 focus:outline-none focus:text-gray-600 pr-2">
                            (+)
                        </button>
                        <input id="item_${product.id}_count" class="text-center" type="number" min="0" max="999" value="1">
                        <button id="btnReduceItem${product.id}" onclick="reduceNumberOfSelectedProducts(${product.id}, event)" class="text-red-500 focus:outline-none focus:text-gray-600 pl-2">
                            (-)
                        </button>
                    </div>
                </div>
            </div>
            <span class="text-gray-600">20$</span>
            <div class="flex items-center justify-between">
                <!-- Remove product icon -->
                <button id="btnRemoveProductFromCart" productId="${product.id}" onclick="removeProductFromCart(${product.id},event)" class="text-gray-600 focus:outline-none">
                    x
                </button>
            </div>
        </div>
    `
    productsOnShoppingCartContainer.innerHTML += productCardHTML
    productsOnShoppingCartContainer.childElementCount <= 1 ? document.querySelector('#messageCartEmpty').classList.remove('hidden') : document.querySelector('#messageCartEmpty').classList.add('hidden')

    document.querySelector(`#item_${product.id}_count`).addEventListener('keyup', () => {
        let selectedProductsNumberInputField = document.querySelector(`#item_${product.id}_count`)
        let selectedProductsNumber = Number.parseInt(selectedProductsNumberInputField.value)
        if(selectedProductsNumber < 0) {
            selectedProductsNumberInputField.value = 1
        }
    })
}

function addProductToCart(event) {
    event.preventDefault()
    let productId = Number.parseInt(event.target.getAttribute("productId"))
    let product = products[productId]
    if(productsOnCart.some(productOnCart => productOnCart.id == product.id)) {
        // Call to increment number of selected products
        incrementNumberOfSelectedProducts(product.id)
    } else {
        // Product not added yet to cart
        productsOnCart.push(product)
        addProductsCardsToShoppingCart(product)
    }
}

function removeProductFromCart(productId, event = null) {
    if (event != null) {
        event.preventDefault()
    }
    let product = products[productId]
    productsOnCart = removeProductFromShoppingCartCache(productsOnCart, product)
    document.getElementById(`productOnShoppingCartCard${product.id}`).remove()
    productsOnShoppingCartContainer.childElementCount <= 1 ? document.querySelector('#messageCartEmpty').classList.remove('hidden') : document.querySelector('#messageCartEmpty').classList.add('hidden')
}

function incrementNumberOfSelectedProducts(productId, event = null) {
    if (event != null) {
        event.preventDefault()
    }
    let product = products[productId]
    let productSelectedNumberInputField = document.querySelector(`#item_${product.id}_count`)
    let selectedProductsNumber = Number.parseInt(productSelectedNumberInputField.value)
    productSelectedNumberInputField.value = selectedProductsNumber + 1
}

function reduceNumberOfSelectedProducts(productId, event = null) {
    if (event != null) {
        event.preventDefault()
    }
    let product = products[productId]
    let productSelectedNumberInputField = document.querySelector(`#item_${product.id}_count`)
    let selectedProductsNumber = Number.parseInt(productSelectedNumberInputField.value)
    selectedProductsNumber <= 1 ? productSelectedNumberInputField.value = 1 : productSelectedNumberInputField.value = selectedProductsNumber - 1
}

function getProducts() {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            products = data
            addProductsCardsToDOM(products)
        })
}

function removeAllProductsCardfromDOM(productsContainer) {
    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.firstChild)
    }
}

function validatePhoneNumberFormat(inputtxt) { // Validate the provided phone has the struct XXX-XXX-XXXX
  var phoneRule = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/
  if (inputtxt.value.match(phoneRule)) {
      return true
    } else {
        return false;
    }
}

// Phone Number input event listener
phoneNumberInputField.addEventListener('keyup', event => {
    if (!validatePhoneNumberFormat(phoneNumberInputField)) {
        showErrors(phoneNumberInputField, formatPhoneNumberSpanErrorMessage)
    } else {
        removeErrors(phoneNumberInputField, formatPhoneNumberSpanErrorMessage)
    }
    if (event.target.value.length == 10) {
        var number = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
        event.target.value = number[1] + '-' + number[2] + '-' + number[3]
    }
})

// Display errors on provided InputField, and the error message
function showErrors(InputField, SpanErrorField) {
    InputField.classList.replace('focus:ring-blue-600', 'focus:ring-red-600')
    InputField.classList.replace('border-blue-300', 'border-red-600')
    SpanErrorField.classList.remove('hidden')
}

// Remove errors on provided InputField, and the error message
function removeErrors(InputField, SpanErrorField) {
    InputField.classList.replace('focus:ring-red-600', 'focus:ring-blue-600')
    InputField.classList.replace('border-red-600', 'border-blue-300')
    SpanErrorField.classList.add('hidden')
}

// Function to remove product from shoppingCart memory
function removeProductFromShoppingCartCache(products, product) {
    return products.filter(function(ele){
        return ele.id != product.id;
    });
}

// Submit event listener
btnSubmitForm.addEventListener('click', function(event) {
    event.preventDefault()
    console.log('Click on submit form button')
})

// Reset form event listener
btnResetForm.addEventListener('click', function(event) {
    event.preventDefault()
    console.log('Click on reset form button')
})

// Enhance the native capabilities of the DOM
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
