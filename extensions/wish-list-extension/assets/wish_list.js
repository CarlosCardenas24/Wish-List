let button = document.querySelector('.wish-list-button');
let insert = document.getElementById('insert');

console.log(insert);    

function variant_change_listener(callback){
    const selector = 'input[name="id"]';
    const emitting_element = document.querySelector(selector);
   
    emitting_element.addEventListener('change', function(){
     callback ? callback() : location.reload();
    });
}
variant_change_listener();

button?.addEventListener('click', () => {
    const PORT = 3000;

    const userId = document.querySelector('.customer-id').value;
    const productId = document.querySelector('.product-id').value;
    const title = document.querySelector('.title').value;
    const shopId = document.querySelector('.shop-id').value;
    const variantId = document.querySelector('.variant-id').value;
    let variantTitle = document.querySelector('.variant-title').value;
    const priceString = document.getElementById('price').value;
    const price = parseFloat(priceString);
    let image = document.querySelector('.image').value;
    if (!image) {
        image = ''
    }

    if(variantTitle === 'Default Title') {
        variantTitle = ''

        const values = [userId, productId, title, shopId, variantId, price];

        if(values.some(value => !value)){
            console.log('Please fill out all fields');
            return null;
        }
    } else {
        const values = [userId, productId, title, shopId, variantId, variantTitle, price];

        if(values.some(value => !value)){
            console.log('Please fill out all fields');
            return null;
        }
    }
    
    fetch(`http://localhost:${PORT}/api/product/storage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId, title, shopId, variantId, variantTitle, price, image})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.successMessage.resource.wishList);
        let wishlist = null;
        let renderedWishlist = null;
        
        if(data.successMessage.resource.wishList){
            wishlist = data.successMessage.resource.wishList;
            renderedWishlist = wishlist.map(item => {
                return `<li>${item.id}</li>
                        <li>${item.quantity}</li>
                        <li>${item.variantId}</li>
                `
            });
        }

        const containerStyle = 'padding: 20px; background-color: #f8f9fa; border-radius: 5px; width: 300px; margin: 0 auto; border: 1px solid #ccc;';
        const textStyle = 'font-size: 18px; color: #333; text-align: center;';
        insert.innerHTML = `
            <div style="${containerStyle}">
                <p style="${textStyle}">User List Goes Here</p>
                <ul>${renderedWishlist.join('')}</ul>
            </div>
        `
    })
    .catch(error => console.error(error));
});