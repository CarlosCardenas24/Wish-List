import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
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
import {CircleInformationMajor} from '@shopify/polaris-icons';

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    //const { session } = await authenticate.admin(request);

    const url = new URL(request.url)
    const hasTitle = url.searchParams.get('title')

    if(hasTitle){
        const title = hasTitle
        return title
    } else if (!hasTitle) {
        const title = null
        return title
    } else {
        throw json("Something went wrong", { status: 404 });
    }
    
    return json({ title })
};


export default function Index() {
    const data = useLoaderData()

    


    return (
    <Page>
        <Layout>
            <Layout.Section>
                <Card>
                    <VerticalStack gap={{xs: '4', sm: '5'}}>
                        <Box width="100%">
                            <VerticalStack gap={{xs: '2', sm: '4'}}>
                                { data ? data : 'Nothing'}
                            </VerticalStack>
                        </Box>
                    </VerticalStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
