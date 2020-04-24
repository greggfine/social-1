export default {
  url: process.env.REACT_APP_OKTA_ORG_URL,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
  redirect_uri: window.location.origin + "/implicit/callback",
  client_id: process.env.REACT_APP_OKTA_CLIENT_ID
}
