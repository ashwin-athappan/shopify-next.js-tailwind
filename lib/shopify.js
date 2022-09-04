const domain = process.env.SHOPIFY_STORE_DOMAIN;

const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN;

async function shopifyData(query) {
	const URL = `https://${domain}/api/2022-07/graphql.json`;

	const options = {
		endpoint: URL,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
			'Accept': 'application/json',
		},
		body: JSON.stringify({ query }),
	};

	try {
		const data = await fetch(URL, options).then((response) =>
			response.json()
		);
		return data;
	} catch (error) {
		throw new Error('Products not fetched');
	}
}

export async function getProductsInCollection() {
	const query = `
    {
        collectionByHandle(handle: "frontpage") {
          title
          products(first: 25) {
            edges{
                node {
                    id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }`;
      const response = await shopifyData(query);
      const allProducts = response.data.collectionByHandle.products.edges ? response.data.collectionByHandle.products.edges : [];
      return allProducts;
}

export async function getAllProducts() {
  const query = `
  {
      products(first: 25) {
      edges {
        node {
          handle
          id
        }
      }
    }
  }`;

  const response = await shopifyData(query);

  const slugs = response.data.products.edges ? response.data.products.edges : [];

  return slugs;
}

export async function getProduct(handle) {
  const query = `
  {
    productByHandle(handle: "${handle}") {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            title
            id
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }`;

  const response = await shopifyData(query);

  const product = response.data.productByHandle ? response.data.productByHandle : [];

  return product;
}