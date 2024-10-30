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
   try {

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
            
        /* if(!appInstallIDResponse || appInstallIDRequest) {
            console.log("Error: appInstallIDResponse or appInstallIDRequest is undefined")
            return;
        } */
    
        const appInstallID = appInstallIDResponse.data.currentAppInstallation.id
    
        /* if(!appInstallID) {
            console.log("Error: appInstallID is undefined")
            return;
        } */
    
        const appMetafield = await graphql(`
          #graphql
          mutation CreateAppDataMetafield($metafields: [Metafields!]!) {
            metafieldsSet(metafields: $metafields) {
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
              metafields: {
                  namespace: "wishify",
                  key: "hasPaid",
                  type: "boolean",
                  value: value,
                  ownerId: appInstallID,
                },
            },
          },)
      
          const metafieldResponse = await appMetafield.json()
          console.log("Field of Meta", metafieldResponse)
          return;

   } catch {
        console.log("Error on Subscription page")
   }
   
    /* const appInstallIDRequest = await graphql(
    `
      #graphql
      query {
        currentAppInstallation {
          id
        }
      }
    `)
  
    const appInstallIDResponse = await appInstallIDRequest.json()
        
     if(!appInstallIDResponse || appInstallIDRequest) {
        console.log("Error: appInstallIDResponse or appInstallIDRequest is undefined")
        return;
    }

    const appInstallID = appInstallIDResponse.data.currentAppInstallation.id

     if(!appInstallID) {
        console.log("Error: appInstallID is undefined")
        return;
    }

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
          "metafieldsSetInput": [
            {
              "namespace": "wishify",
              "key": "hasPaid",
              "type": "boolean",
              "value": value,
              "ownerId": appInstallID,
            }
          ]
        }
      })
  
      const metafieldResponse = await appMetafield.json()
      console.log("Field of Meta", metafieldResponse)
      return; */
  }