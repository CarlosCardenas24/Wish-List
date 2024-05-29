function testProxy() {
    return new Promise((resolve, reject) => {
        fetch("https://testingwishlist.myshopify.com/apps/proxytest"), {
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
        resolvePath(data)
    }).catch((error) => {
        reject(error)
    })
}