import { authenticate } from '../shopify.server'
import { Page } from '@shopify/polaris'
import { cors } from 'remix-utils'
import { json } from '@remix-run/node';

export const loader = async ({request}) => {
    console.log('---hit app proxy----')

    const {session} = await authenticate.public.appProxy(request)
    
    return await cors(request, json({status: 200}))
}

const Proxy = () => {
    return <Page>proxy </Page>
}

export default Proxy