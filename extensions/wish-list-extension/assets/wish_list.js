let buttonList = document.querySelector('.wish-list-button');
let insert = document.getElementById('insert');

function viewList() {
    const PORT = 3000;
    
    const userId = document.querySelector('.customer-id-list').value;

    fetch(`http://localhost:${PORT}/api/product/storage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        let wishlist = null;
        let renderedWishlist = null;
        
        if(data.successMessage.resource === "No Data" || data.successMessage.resource.length === 0) {
            document.getElementById("user-wishList").style.display = "none";
            insert.innerHTML = `
                    <ul class="list-ul">Your Wish List Is Empty</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";
        }      
        if(data.successMessage.resource && data.successMessage.resource.length != 0){
            document.getElementById("user-wishList").style.display = "none";
            wishlist = data.successMessage.resource;
            renderedWishlist = wishlist.map(item => {
                let formData = {
                    'items': [{
                        'id': item.variantId,
                        'quantity': 1
                    }]
                }
                return `
                        <li class="list-li"> 
                            <img src="${item.image}" width="35" height="45">

                            <div class="list-flex">
                                <div class="list-name">
                                    ${item.name} ${item.variantName} 
                                </div>
                                <div class="list-price">
                                    $${item.price} USD
                                </div>   
                            </div>

                            <div class="list-buttons-flex">
                                <div class="form-container">
                                    <form method="post" action="/cart/add" class="list-form">
                                        <input type="hidden" class="user-item" value="${item.variantId}">
                                        <input type="hidden" name="id" value="${item.variantId}" />
                                        <input type="hidden" id="quantity" name="quantity" value="1"/>
                                        <input type="submit" value="Add to cart" onclick="deleteButton('${item.variantId}')" class="button button--full-width button--secondary add--to--cart delete-button" />
                                    </form>
                                </div>

                                <div class="delete-from-list">
                                    <input type="hidden" class="user-item" value="${item.variantId}">
                                    <button onclick="deleteButton('${item.variantId}')" class="delete-button delete-button-css"> <i class="fa-solid fa-trash"></i> </button>
                                </div>

                            </div>
                            
                        </li> `
            });
            insert.innerHTML = `
                    <ul class="list-ul">${renderedWishlist.join('')}</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";

            
        }
    })
    .catch(error => console.error(error));
}
/* buttonList?.addEventListener('click', () => {
    const PORT = 3000;
    
    const userId = document.querySelector('.customer-id-list').value;

    fetch(`http://localhost:${PORT}/api/product/storage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        let wishlist = null;
        let renderedWishlist = null;
        
        if(data.successMessage.resource === "No Data" || data.successMessage.resource.length === 0) {
            document.getElementById("user-wishList").style.display = "none";
            insert.innerHTML = `
                    <ul class="list-ul">Your Wish List Is Empty</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";
        }      
        if(data.successMessage.resource && data.successMessage.resource.length != 0){
            document.getElementById("user-wishList").style.display = "none";
            wishlist = data.successMessage.resource;
            renderedWishlist = wishlist.map(item => {
                let formData = {
                    'items': [{
                        'id': item.variantId,
                        'quantity': 1
                    }]
                }
                return `
                        <li class="list-li"> 
                            <img src="${item.image}" width="35" height="45">

                            <div class="list-flex">
                                <div class="list-name">
                                    ${item.name} ${item.variantName} 
                                </div>
                                <div class="list-price">
                                    $${item.price} USD
                                </div>   
                            </div>

                            <div class="list-buttons-flex">
                                <div class="form-container">
                                    <form method="post" action="/cart/add" class="list-form">
                                        <input type="hidden" class="user-item" value="${item.variantId}">
                                        <input type="hidden" name="id" value="${item.variantId}" />
                                        <input type="hidden" id="quantity" name="quantity" value="1"/>
                                        <input type="submit" value="Add to cart" onclick="deleteButton('${item.variantId}')" class="button button--full-width button--secondary add--to--cart delete-button" />
                                    </form>
                                </div>

                                <div class="delete-from-list">
                                    <input type="hidden" class="user-item" value="${item.variantId}">
                                    <button onclick="deleteButton('${item.variantId}')" class="delete-button delete-button-css"> X </button>
                                </div>

                            </div>
                            
                        </li> `
            });
            insert.innerHTML = `
                    <ul class="list-ul">${renderedWishlist.join('')}</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";

            
        }
    })
    .catch(error => console.error(error));
}); */

function deleteButton(item) {
            const PORT = 3000;
            
            const userId = document.querySelector('.customer-id-list').value;
            const variantId = item;
        
            fetch(`http://localhost:${PORT}/api/product/storage`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, variantId })
            }).then(response => response.json())
            .catch(error => console.error(error));

            closeWishList()
            viewList()
}


/* document.querySelectorAll('.delete-button').forEach(elem => {
                elem.addEventListener('click', () => { 
                    const PORT = 3000;
                    
                    const userId = document.querySelector('.customer-id-list').value;
                    const userItem = document.querySelector('.user-item').value;
                
                    console.log(userId)
                    console.log(userItem)
                
                    fetch(`http://localhost:${PORT}/api/product/storage`, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId })
                    }).then(response => response.json())
                    .catch(error => console.error(error));
                })
            }) */

            /* let deleteButton = document.querySelector('.delete-button');
            console.log(deleteButton)
            deleteButton?.addEventListener('click', () => { 
                const PORT = 3000;
                
                const userId = document.querySelector('.customer-id-list').value;
                const userItem = document.querySelector('.user-item').value;
            
                console.log(userId)
                console.log(userItem)
            
                fetch(`http://localhost:${PORT}/api/product/storage`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                }).then(response => response.json())
                .catch(error => console.error(error));
            }) */