(function() {
    function selectElement(selector, node) {
        return (node || document).querySelector(selector);
      }

    function find({target}) {
        const rootblock = target.closest(".prapp-blocj[data-product-id]")
        const {productId} = rootblock.dataset
        console.log(productId)
    }

})


