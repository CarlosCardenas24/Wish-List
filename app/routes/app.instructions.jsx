import {
    Page,
    Text,
    LegacyCard,
    useBreakpoints,
    BlockStack,
    InlineStack,
    Layout,
    Card,
    Select
  } from "@shopify/polaris"; 
import {useState, useCallback} from 'react'; 

export default function InstructionsPage() {
const [selected, setSelected] = useState('selectone')

const handleSelectChange = useCallback((value) => setSelected(value), []);

const options = [
    {label: 'Select one', value: 'selectone'},
    {label: '2.0 Theme', value: 'twopointzerotheme'},
    {label: 'Vintage', value: 'vintage'},
];

return (
    <Page>
        <ui-title-bar title="Instructions page" />
            <Layout>
            <Layout.Section>
                <Card>
                    <BlockStack gap="300">
                        <Text variant="headingXl" as="h4">
                            App Blocks
                        </Text>
                        <Select
                        label="Theme"
                        options={options}
                        onChange={handleSelectChange}
                        value={selected}
                        />
                        <div style={{marginTop: '20px'}}>
                            {selected === 'twopointzerotheme' && (
                            <>
                                <Text as="p" variant="bodyMd">
                                    The app blocks should work on all Online Store 2.0 Themes. Here is a video on how to set it up.
                                </Text>
                                <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/rbeSYHIIwzE?si=SBZpi94jWD5zJaW5"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                ></iframe>
                            </>
                            )}
                            {selected === 'vintage' && (
                                <Text as="p" variant="bodyMd">
                                    unfortunately these app blocks are only available on Shopify's Online Store 2.0 themes.
                                </Text>
                            )}
                        </div>
                        
                    </BlockStack>
                    <BlockStack gap="300">
                        <Text variant="headingXl" as="h4">
                            App Embedded Blocks
                        </Text>
                        <Text as="p" variant="bodyMd">
                            While these embedded blocks should work on any theme, you will need the Online Store 2.0 themes for the app blocks. Here is a video on how to turn them on
                        </Text>
                        <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/20fVsSS2aWU?si=nSb6rx2mwDY-WT5V"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        ></iframe>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
);
}