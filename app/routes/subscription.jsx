import { authenticate } from "../shopify.server";

async function subscription({request}) {
    const { admin } =  await authenticate.admin(request);

    const returnUrl = `https://vital-wish-list-c86fce13cbd9.herokuapp.com/charge_approval`;

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
    console.log("R", response)

    const data = await response.json();
    console.log("D", data)
    return data
}

subscription()