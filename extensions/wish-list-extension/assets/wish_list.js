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
                                        <input type="hidden" name="id" value="${item.variantId}" />
                                        <input type="hidden" id="quantity" name="quantity" value="1"/>
                                        <input type="submit" value="Add to cart" class="button button--full-width button--secondary add--to--cart" />
                                    </form>
                                </div>

                                <div class="delete-from-list">
                                    <button> X </button>
                                </div>
                            </div>
                            
                        </li> `
            });
            /* 
            <div class="list-buttons-flex">
                                <button class="delete-from-list> X </button>
                            </div>
            
            <form method="post" action="/cart/add" class="list-form>
                                        <input type="hidden" name="id" value="${item.variantId}" />
                                        <input type="hidden" id="quantity" name="quantity" value="1"/>
                                        <input type="submit" value="Add to cart" class="button button--full-width button--secondary" />
                                    </form> */

            insert.innerHTML = `
                    <ul class="list-ul">${renderedWishlist.join('')}</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";
            
        }
    })
    .catch(error => console.error(error));
});