import { authenticate } from '../shopify.server'
import { Page } from '@shopify/polaris'

export async function action({request}) { 
    console.log('---hit app proxy----')

    const {session} = await authenticate.public.appProxy(request)
    if(session){
        console.log(session)
    }
    return null
}

/* export const action: ActionFunction = async ({request}) => {
    console.log('---hit app proxy----')

    const {session} = await authenticate.public.appProxy(request)
    if(session){
        console.log(session)
    }
    return null
} */

const Proxy = () => {
    return <Page>proxy </Page> 
}

export default Proxy