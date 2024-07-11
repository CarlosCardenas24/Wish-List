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
        console.log(data.successMessage.resource);
        let wishlist = null;
        let renderedWishlist = null;
        
        if(data.successMessage.resource){
            document.getElementById("user-wishList").style.display = "none";
            wishlist = data.successMessage.resource;
            renderedWishlist = wishlist.map(item => {
                return `
                        <li class="list-li"> <img src="${item.image}" width="30" height="25">
                            <div class="list-flex">
                                <div class="list-name">
                                    ${item.name} ${item.variantName} 
                                </div>
                                <div class="list-price">
                                    $${item.price} USD
                                </div>                                
                            </div>
                        </li> `
            });
            console.log(renderedWishlist)

            /* const containerStyle = 'padding: 20px; background-color: #f8f9fa; border-radius: 5px; width: 350px; margin: 10px; border: 1px solid #ccc;';
            const textStyle = 'font-size: 20px; color: #333; text-align: center;'; */
            insert.innerHTML = `
                    <ul class="list-ul">${renderedWishlist.join('')}</ul>
            `;
            document.getElementById("wish-list-popup").style.display = "block";
            
        }
    })
    .catch(error => console.error(error));
});