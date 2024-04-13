import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useEffect } from "react";


import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
  useRevalidator,
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
  Thumbnail,
  IndexTable,
  LegacyCard,
  useBreakpoints,
  EmptySearchResult,
} from "@shopify/polaris";
import {CircleInformationMajor} from '@shopify/polaris-icons';

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const prisma = new PrismaClient();
  prisma ? console.timeStamp() : console.error({ message: "Prisma ORM failed to initialize"});
  const products = await prisma.product.findMany();
  
  return json({ shop: session.shop.replace(".myshopify.com", ""), products });
};

/* export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
} */

export default function Index() {
  const nav = useNavigation();
  const { shop, products } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const revalidator = useRevalidator()

  useEffect(() => {
    const interval = setInterval(() => {
      revalidator.revalidate();
    }, 300000)

    return () => clearInterval(interval)
  }, [revalidator])

  /* const renderProducts = () => {
    if (!products) return null;

    return products.map((product) => (
      <li key={product.id}>
        <Thumbnail source={product.image} size="small"/> {product.variantName}: Quantity: {product.quantity} Unit Price: {product.price} Total Price: {product.quantity*product.price} <Divider />
      </li>
    ));
  }; */

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const navigate = useNavigate()

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No additions to the Wish List'}
      withIllustration
    />
  )

  const rowMarkup = products.map(
    (
      {variantId, image, variantName, name, quantity, price},
      index,
    ) => (
      <IndexTable.Row id={variantId} key={variantId} position={index}>
        <IndexTable.Cell>
          <Thumbnail source={image} size="small"/>
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{variantName}</IndexTable.Cell>
        <IndexTable.Cell>{quantity}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {price}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {price * quantity}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page fullWidth>
      <ui-title-bar title="Wish List">
        {/* <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button> */}
      </ui-title-bar>

      <LegacyCard>
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={products.length}
          emptyState={emptyStateMarkup}
          headings={[
            {title: 'Image'},
            {title: 'Product Name'},
            {title: 'Variant Name'},
            {title: 'Quantity'},
            {title: 'Unit Price', alignment: 'end'},
            {title: 'Total Price', alignment: 'end'},
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable> 
      </LegacyCard>

      {/* <Layout>
        <Layout.Section>
          <Card>
            <VerticalStack gap="5">
              <VerticalStack gap="2">
                <Text as="h2" variant="headingMd">
                  Total amount of items in wish lists
                  <br />
                  ID - Title - Total
                </Text>
                <Text variant="bodyMd" as="p">
                  {renderProducts()}
                </Text>
              </VerticalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
      </Layout> */}
    </Page>
  );
}