let buttonList = document.querySelector('.wish-list-button');
let insert = document.getElementById('insert');

buttonList?.addEventListener('click', () => {
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
        
        if(data.successMessage.resource){
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
                                        <input type="submit" value="Add to cart" class="button button--full-width button--secondary add--to--cart delete-button" />
                                    </form>
                                </div>

                                <div class="delete-from-list">
                                    <input type="hidden" class="user-item" value="${item.variantId}">
                                    <button class="delete-button delete-button-css"> X </button>
                                </div>

                            </div>
                            
                        </li> `
            });
            insert.innerHTML = `
                    <ul class="list-ul">${renderedWishlist.join('')}</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";

            document.querySelectorAll('.delete-button').forEach(elem => {
                elem.addEventListener('click', () => { 
                    const PORT = 3000;
                    
                    const userId = document.querySelector('.customer-id-list').value;
                    const userItem = document.querySelector('.user-item').value;
                
                    console.log(userId)
                    console.log(userItem)
                
                    /* fetch(`http://localhost:${PORT}/api/product/storage`, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId })
                    }).then(response => response.json())
                    .catch(error => console.error(error)); */
                })
            })

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
        }
    })
    .catch(error => console.error(error));
});

// <input type="hidden" class="user-item" value="${item.variantId}"> <button class="delete-button"> X </button> <input class="delete-button delete-button-css" type="button" value="X" />

