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