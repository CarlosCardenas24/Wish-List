function closePopup() {
    document.getElementById('popup-container-success').style.display = "none";
    document.getElementById('popup-container-error').style.display = "none";
    document.getElementById('popup-container-already').style.display = "none";
}

function closeWishList() {
    document.getElementById("wish-list-popup").style.display = "none";
    document.getElementById("user-wishList").style.display = "block";
}