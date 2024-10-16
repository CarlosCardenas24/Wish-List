/* const { session, admin } = await authenticate.admin(request);

const shop = session.shop.replace(".myshopify.com", "");
const appHandle = "wishifylist"
const returnUrl = `https://admin.shopify.com/store/${shop}/apps/${appHandle}/charge_approval`;

const response = await admin.graphql(
  `#graphql
  mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
    appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
      userErrors {
        field
        message
      }
      appSubscription {
        id
      }
      confirmationUrl
    }
  }`,
  {
    variables: {
      "name": "Wishify Access",
      "returnUrl": returnUrl,
      "lineItems": [
        {
          "plan": {
            "appRecurringPricingDetails": {
              "price": {
                "amount": 5.00,
                "currencyCode": "USD"
              },
              "interval": "EVERY_30_DAYS"
            }
          }
        }
      ]
    },
  },
);

const data = await response.json(); */