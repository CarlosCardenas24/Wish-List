/* import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import {
    Page,
    Layout,
    Text,
    VerticalStack,
    Card,
    HorizontalStack,
    Box,
  } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from '../db.server.js'

export async function loader({ request, params }) {
    const { admin, session } = await authenticate.admin(request);
  
    const url = new URL(request.url)
    const productId = url.searchParams.get('id')

    const product = await admin.rest.resources.Product.all({
        session: session,
    })

    const productData = [product.data]
    return {productData, productId}

   
}

export const action = async ({request}) => {
    const form = await request.formData()
    const productTitle = form.get('productTitle')
    const productId = form.get('productId')
    console.log(productTitle)
    const fields = {productTitle, productId}

    
    return []
}

export default function Index() {
    const {productData} = useLoaderData()
    const {productId} = useLoaderData()
    const submit = useSubmit()
    const formData = new FormData()

    const sameProduct = productData.map((item) => {
        for (let i = 0; i < item.length; i++) {
            let newId = item[i].id
            let productTitle = item[i].title
            if(newId == productId) {
                return {productId, productTitle}
            }
        }
    })

    let title = sameProduct.map( product => product.productTitle)
    let id = sameProduct.map( product => product.productId)
    
    formData.append({productId: id}, {productTitle: title})

    useEffect(() => {
        submit(formData, { method: "post"})
    }, [])



    return (
    <Page>
        <Layout>
            <Layout.Section>
                <Card>
                    <VerticalStack gap={{xs: '4', sm: '5'}}>
                        <Box width="100%">
                            <VerticalStack gap={{xs: '2', sm: '4'}}>
                                 { title } has been added to your wish list!
                            </VerticalStack>
                        </Box>

                        <form
                            onChange={(evemt) => {
                                submit(event?.currentTarget)
                            }}
                        />
 
                
                    </VerticalStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
} */