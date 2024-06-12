function testProxy() {
    return new Promise((resolve, reject) => {
        fetch("https://testingwishlist.myshopify.com/apps/proxytest"), {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
    }).then((response) => {
        console.log(response, 'response');
    }).then((data) => {
        resolve(data)
    }).catch((error) => {
        reject(error)
    })
}