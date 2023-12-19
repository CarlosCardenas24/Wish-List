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
    Button,
    HorizontalStack,
    Box,
    Divider,
    List,
    Link,
    Badge,
  } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { getWishList, postWishList } from "../wishList.server";

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
 


  export default function Index() {
    const {productData} = useLoaderData()
    const {productId} = useLoaderData()

    postWishList(productId)
    /* function sameProductFunction (productData, productId) {
        for (let i = 0; i < productData.length; i++) {
            let newId = productId
            console.log(productData[0])
            if (productData[i].id === newId) {
                return [product.id, product.title]
            }
        }
    }

    const sameProduct = sameProductFunction(productData, productId) */

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