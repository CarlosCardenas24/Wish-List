import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
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
  Text,
  Thumbnail,
  IndexTable,
  LegacyCard,
  useBreakpoints,
  EmptySearchResult,
  IndexFilters,
  useSetIndexFiltersMode,
} from "@shopify/polaris"; 
import {NoteIcon} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const prisma = new PrismaClient();
  prisma ? console.timeStamp() : console.error({ message: "Prisma ORM failed to initialize"});
  const products = await prisma.product.findMany();
  
  return json({ shop: session.shop.replace(".myshopify.com", ""), products });
};

export default function Index() {
  useEffect(() => {
    console.log("Component mounted or updated");
    return () => {
      console.log("Component will unmount");
    };
  });

  const nav = useNavigation();
  const { shop, products: initialProducts } = useLoaderData();
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

  const [itemStrings, setItemStrings] = useState(["All"]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
  }));

  const sortOptions = [
    {label: 'Product', value: 'product asc', directionLabel: 'A-Z'},
    {label: 'Product', value: 'product desc', directionLabel: 'Z-A'},
    {label: 'Quantity', value: 'quantity asc', directionLabel: 'Ascending'},
    {label: 'Quantity', value: 'quantity desc', directionLabel: 'Descending'},
  ];
  /* const sortOptions = [
    {label: 'Product (A-Z)', value: 'product asc'},
    {label: 'Product (Z-A)', value: 'product desc'},
    {label: 'Quantity (Low to High)', value: 'quantity asc'},
    {label: 'Quantity (High to Low)', value: 'quantity desc'},
  ]; */

  const [sortSelected, setSortSelected] = useState('quantity desc');
  const { mode, setMode } = useSetIndexFiltersMode();

  // Create a sorting function
  function sortProducts(products, sortOption) {
    // Convert sortOption to string to ensure it can be split
    const sortOptionString = String(sortOption);

    // Check if sortOptionString contains a space to split
    if (!sortOptionString.includes(' ')) {
        console.error('Invalid sortOption format:', sortOptionString);
        return products;
    }

    // Split sortOptionString into key and order
    const [key, order] = sortOptionString.split(' ');

    // Convert key to the exact property name in the product object
    let keyToSort;
    if (key === 'product') {
        keyToSort = 'name'; // Adjust if the property name is different
    } else if (key === 'quantity') {
        keyToSort = 'quantity';
    } else {
        keyToSort = key; // Fallback to the provided key
    }

    // Sort the products based on the keyToSort and order
    return products.slice().sort((a, b) => {
        const aValue = a[keyToSort];
        const bValue = b[keyToSort];

        // Determine sorting direction
        const direction = order === 'desc' ? -1 : 1;

        // Compare the values and sort
        if (aValue > bValue) {
            return direction;
        }
        if (aValue < bValue) {
            return -direction;
        }
        return 0;
    });
}

const rowMarkup = sortProducts(initialProducts, sortSelected).map(
  ({ variantId, image, variantName, name, quantity, price }, index) => (
    <IndexTable.Row id={variantId} key={variantId} position={index}>
      <IndexTable.Cell>
        <Thumbnail source={image} alt="No Image" size="small"/>
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
  )
);

  /* const rowMarkup = sortedProducts.map(
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
  ); */


  return (
    <Page fullWidth>
      <ui-title-bar title="Wish List">
      </ui-title-bar>

      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          onSort={(selected) => setSortSelected(selected)}
          tabs={tabs}
          mode={mode}
          setMode={setMode}
          hideFilters
          hideQueryField
          canCreateNewView={false}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={initialProducts.length}
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