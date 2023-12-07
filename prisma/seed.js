const {PrismaClient} = require('@prisma/client')
const db = new PrismaClient()

async function seed() {
    await Promise.all(
        getPosts().map(post => {
            return db.post.create({ date: post })
        })
    )
}

seed()

function() {

}