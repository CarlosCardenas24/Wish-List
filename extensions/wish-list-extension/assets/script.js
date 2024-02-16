const button = document.querySelector('.add-to-list-button');
let productId = null;

if(!button) {
    console.error('Button not found: ' + button);
}

button?.addEventListener('click', () => {
    productId = button.getAttribute('id');

    const PORT = 3000;

    fetch(`http://localhost:${PORT}/api/product/storage`, {
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