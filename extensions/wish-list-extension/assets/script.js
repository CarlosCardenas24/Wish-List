const button = document.querySelector('.add-to-list-button');
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

    const productId = document.querySelector('.product-id').value;
    const title = document.querySelector('.title').value;
    const shopId = document.querySelector('.shop-id').value;
    const variantId = document.querySelector('.variant-id').value;
    const variantTitle = document.querySelector('.variant-title').value;
    const price = document.getElementById('price').value;

    console.log(variantTitle)
    console.log(price)
    console.log(variantId)

    const values = [title, price, shopId, productId];

    if(values.some(value => !value)){
        console.log('Please fill out all fields');
        return null;
    }

    /* fetch(`http://localhost:${PORT}/api/product/storage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, shopId, price, title })
    })
    .then(response => response.json())
    .then(data => { console.log(data)})
    .catch(error => console.error(error)); */

});