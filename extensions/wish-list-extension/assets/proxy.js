function testProxy() {
    return new Promise((resolve, reject) => {
        fetch("https://testingwishlist.myshopify.com/apps/proxy"), {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content_Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    }).then((response) => {
        console.log(response, 'reponse');
    }).then((data) => {
        resolve(data)
    }).catch((error) => {
        reject(error)
    })
}