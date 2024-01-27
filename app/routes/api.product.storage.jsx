import { json } from "@remix-run/node";
//import of the product storage

export async function loader({ request }) {
    try {
        console.log("request", request);
        let headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return json({ message: "Success!", method: 'loader()' }, { headers });
    } catch (error) {
        console.log(error);
    }

}

/*@NOTES grab id from action method and generate a storage JSON file from it to simulate database storage */

export async function action({ request }) {
    
    try {
        console.log("request", request);
        let headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return json({ message: "Success!", method: 'action()'}, { headers });
    } catch (error) {
        console.log(error);
    }
}