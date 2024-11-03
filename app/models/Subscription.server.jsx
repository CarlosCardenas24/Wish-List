export async function getSubscriptionStatus(graphql) {
    const request = await graphql(
        `
        #graphql
        query Shop {
            app {
                installation {
                    launchUrl
                    activeSubscriptions {
                        id
                        name
                        createdAt
                        returnUrl
                        status
                        currentPeriodEnd
                        trialDays
                        test
                    }
                }
            }
        }
        `,
        { variables: {} }
    )

    const response = await request.json()
    return response
}

export async function subscriptionMetaField(graphql, value) {
    const appInstallIDRequest = await graphql(
        `
          #graphql
          query {
            currentAppInstallation {
              id
            }
          }
        `)
      
        const appInstallIDResponse = await appInstallIDRequest.json()
        const appInstallID = appInstallIDResponse.data.currentAppInstallation.id
    
        const appMetafield = await graphql(`
          #graphql
          mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafieldsSetInput) {
              metafields {
                id
                namespace
                key
              }
              userErrors {
                field
                message
              }
            }
          }
          `, {
            variables: {
                "metafieldsSetInput": {
                  "namespace": "wishify",
                  "key": "hasPaid",
                  "type": "boolean",
                  "value": value,
                  "ownerId": appInstallID,
                },
            },
        },
        )
      
          const metafieldResponse = await appMetafield.json()
          console.log("Field of Meta", metafieldResponse)
          return;
  }