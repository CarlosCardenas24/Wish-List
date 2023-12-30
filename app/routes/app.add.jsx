import { useState } from "react";
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
/* 
import { getWishList, postWishList } from "../wishList.server"; */

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
 
// wrap loader method inside another function, call the function on initial function (use effect, [])

  export default function Index() {
    const {productData} = useLoaderData()
    const {productId} = useLoaderData()

    const sameProduct = productData.map((item) => {

        for (let i = 0; i < item.length; i++) {
            let newId = item[i].id
            let newTitle = item[i].title
            if(newId == productId) {
                return [newId, newTitle]
            }
         }
    })

    console.log(sameProduct)

    return (
    <Page>
        <Layout>
            <Layout.Section>
                <Card>
                    <VerticalStack gap={{xs: '4', sm: '5'}}>
                        <Box width="100%">
                            <VerticalStack gap={{xs: '2', sm: '4'}}>
                                { productId ? productId : 'Nothing'}
                            </VerticalStack>
                        </Box>
                    </VerticalStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}