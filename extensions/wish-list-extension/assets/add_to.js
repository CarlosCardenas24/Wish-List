let buttonAdd = document.querySelector('.add-to-list-button');

function variant_change_listener(callback){
    const selector = 'input[name="id"]';
    const emitting_element = document.querySelector(selector);
   
    emitting_element.addEventListener('change', function(){
     callback ? callback() : location.reload();
    });
}
variant_change_listener();

buttonAdd?.addEventListener('click', () => {
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
    let productImage = image;

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
        if(data.successMessage.resource.wishList){
            let successPopup = document.getElementById('popup-container-success');
            successPopup.style.display = "block";
        } else {
            let errorPopup = document.getElementById('popup-container-error');
            errorPopup.style.display = "block";
        }
    })
    .catch(error => console.error(error));
});
