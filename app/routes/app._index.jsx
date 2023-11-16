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
    const { session } = await authenticate.admin(request);

    const url = new URL(request.url)
    /* const title = url.searchParams.get('title') */ 
    console.log(url)
  
    return json({ shop: session.shop.replace(".myshopify.com", "")});
};


export default function Index() {
    //const [enabled, setEnabled] = useState(false)

    const [enabled, setEnabled] = useState(false)

    const handleToggle = () => {
        if (!enabled) {
            setEnabled(true)
        } else if (enabled) {
            setEnabled(false)
        }
    }

    const status = enabled ? 'Turn off' : 'Turn on'

    const badgeStatus = enabled ? 'success' : undefined;
    
    const badgeContent = enabled ? 'On' : 'Off';

    const settingBadge = (
        <Badge
          status={badgeStatus}
          statusAndProgressLabelOverride={`Setting is ${badgeContent}`}
        >
          {badgeContent}
        </Badge>
      );


    const settingTitle = ( 
        <HorizontalStack gap="2" wrap={false}>
            <HorizontalStack gap="2" align="start" blockAlign="baseline">
                <Text variant="headingMd" as="h6">
                    Toggle On or Off
                </Text>
                <HorizontalStack gap="2" align="center" blockAlign="center">
                    {settingBadge}
                </HorizontalStack>
            </HorizontalStack>
        </HorizontalStack> )

    const switchAction = (
        <Button
            role="switch"
            ariaChecked={enabled ? 'true' : 'false'}
            onClick={handleToggle}
            size="slim"
        >
            {status}
        </Button>
    )

    const header = (
        <Box width="100%">
            <HorizontalStack
                gap="12"
                align="space-between"
                blockAlign="start"
                wrap={false}
            >
                {settingTitle}
                <Box minWidth="fit-content">
                    <HorizontalStack align="end">{switchAction}</HorizontalStack>
                </Box> 
            </HorizontalStack>
    </Box>
    )

    return (
    <Page>
        <ui-title-bar title="Wish List Configuration">
            <button variant="primary">
            Home
            </button>
        </ui-title-bar>
        <Layout>
            <Layout.Section>
                <Card>
                    <VerticalStack gap={{xs: '4', sm: '5'}}>
                        <Box width="100%">
                            <VerticalStack gap={{xs: '2', sm: '4'}}>
                                {header}
                            </VerticalStack>
                        </Box>
                    </VerticalStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  );
}
