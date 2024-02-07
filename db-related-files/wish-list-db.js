import fs from 'fs/promises'

export function storeWishList(id) {
  fs.writeFile('data/wish-list.json', JSON.stringify(`product_id: ` + id))
}