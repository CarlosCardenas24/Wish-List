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
  useState,
} from "@remix-run/react";
import {
  Page,
  Text,
  Thumbnail,
  IndexTable,
  LegacyCard,
  useBreakpoints,
  EmptySearchResult,
  IndexFilters,
} from "@shopify/polaris";
import type {IndexFiltersProps} from '@shopify/polaris'
import {CircleInformationMajor} from '@shopify/polaris-icons';

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const prisma = new PrismaClient();
  prisma ? console.timeStamp() : console.error({ message: "Prisma ORM failed to initialize"});
  const products = await prisma.product.findMany();
  
  return json({ shop: session.shop.replace(".myshopify.com", ""), products });
};

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
  );

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

  const sortOptions: IndexFiltersProps['sortOptions'] = [
    {label: 'Product', value: 'product asc', directionLabel: 'A-Z'},
    {label: 'Product', value: 'product desc', directionLabel: 'Z-A'},
    {label: 'Quantity', value: 'quantity asc', directionLabel: 'Ascending'},
    {label: 'Quantity', value: 'quantity desc', directionLabel: 'Descending'},
  ];
  const [sortSelected, setSortSelected] = useState(['order asc']);

  return (
    <Page fullWidth>
      <ui-title-bar title="Wish List">
      </ui-title-bar>

      <LegacyCard>
        <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        onSort={setSortSelected}
        />
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
    </Page>
  );
}