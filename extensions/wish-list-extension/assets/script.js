const button = document.querySelector('.add-to-list-button');

button?.addEventListener('click', () => {
    const PORT = 3000;

    const title = document.querySelector('.title');
    const price = document.querySelector('.price');
    const shopId = document.querySelector('.shop-id');
    const productId = document.querySelector('.product-id');

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