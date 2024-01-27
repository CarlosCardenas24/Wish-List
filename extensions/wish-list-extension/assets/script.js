const button = document.querySelector('.add-to-list-button');
let productId = null;

if(!button) {
    console.error('Button not found: ' + button);
}

button?.addEventListener('click', () => {
    productId = button.getAttribute('id');

    fetch('http://localhost:53234/api/product/storage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => { console.log(data)})
    .catch(error => console.error(error));
});