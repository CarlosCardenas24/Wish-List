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
                                <Text as="p" variant="bodyMd">
                                    These are the instructions for the app blocks
                                </Text>
                            )}
                            {selected === 'vintage' && (
                                <Text as="p" variant="bodyMd">
                                    unfortunately these app blocks are only available on Shopify's Online Store 2.0 themes.
                                </Text>
                            )}
                        </div>
                        
                    </BlockStack>
                    <BlockStack gap="300">
                        <Text as="p" variant="bodyMd">
                            
                        </Text>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
);
}