/* //import prisma from "~/db.server.js"
/* var javaScript = document.getElementById('myScript')

let wish_counter = javaScript.getAttribute('wish_counter')
let productID = javaScript.getAttribute('productID')
let productTitle = javaScript.getAttribute('productTitle')

function counter () {
    wish_counter++
    console.log(wish_counter)
  }

const action = async ({request}) => {
    const form = await request.formData()
    const fields = {productID, productTitle}

    const wishList = await prisma.wishList.create({data: fields})
    
    return null
}

document.getElementById("addToWishListButton").addEventListener("click", action) title=${productTitle}& */
var javaScript = document.getElementById('myScript')
let productID = javaScript.getAttribute('productID')

function redirectToExample() {
  window.location.href = `https://admin.shopify.com/store/wish-list-alpha/apps/wish-list-18/app/add?id=${productID}`;
}

document.getElementById("addToWishListButton").addEventListener("click", redirectToExample)