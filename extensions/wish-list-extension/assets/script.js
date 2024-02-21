const button = document.querySelector('.add-to-list-button');
let productId = null;
// needed for shop id
var javaScript = document.getElementById('myScript')
let shopId = javaScript.getAttribute('shopId')

if(!button) {
    console.error('Button not found: ' + button);
}
if(!shopId) {
    console.error('Shop Id not found: ' + shop_Id);
}

console.log(shopId)

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