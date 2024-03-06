const titleInput = document.querySelector('.title');
const priceInput = document.querySelector('.price');
const shopInput = document.querySelector('.shop-id');
const productInput = document.querySelector('.product-id');
const button = document.querySelector('.add-to-list-button');

const title = titleInput?.value;
const price = priceInput?.value;
const shopId = shopInput?.value;
const productId = productInput?.value;

button?.addEventListener('click', () => {
    const PORT = 3000;

    const values = [title, price, shopId, productId];

    if(values.some(value => !value)){
        console.log('Please fill out all fields');
        return null;
    }

    fetch(`http://localhost:${PORT}/api/product/storage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, shopId, price, title })
    })
    .then(response => response.json())
    .then(data => { console.log(data)})
    .catch(error => console.error(error));

});