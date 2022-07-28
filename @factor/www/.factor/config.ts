/* tslint:disable */
/**
 * Automatically generated file, do not modify by hand.
 */

export interface CompiledServiceConfig {
  commands: "build" | "bundle" | "deploy" | "dev" | "generate" | "r-dev" | "release" | "render" | "server" | "www";
  vars:
    | "APP_PORT"
    | "AWS_ACCESS_KEY"
    | "AWS_ACCESS_KEY_SECRET"
    | "COMMAND"
    | "COMMAND_OPTS"
    | "GOOGLE_CLIENT_ID"
    | "GOOGLE_CLIENT_SECRET"
    | "IS_TEST"
    | "NODE_ENV"
    | "POSTGRES_URL"
    | "RUNTIME_VERSION"
    | "SERVER_PORT"
    | "SMTP_HOST"
    | "SMTP_PASSWORD"
    | "SMTP_USER"
    | "STRIPE_SECRET_KEY_PROD"
    | "STRIPE_SECRET_KEY_TEST"
    | "TEST_APP_PORT"
    | "TOKEN_SECRET"
    | "WWW_PORT";
  endpoints:
    | "AllProducts"
    | "CurrentUser"
    | "GetCoupon"
    | "GetCustomerData"
    | "GetInvoices"
    | "GetProduct"
    | "ListSubscriptions"
    | "Login"
    | "ManageCustomer"
    | "ManagePaymentMethod"
    | "ManageSubscription"
    | "ManageUser"
    | "MediaAction"
    | "MediaIndex"
    | "NewVerificationCode"
    | "ResetPassword"
    | "SaveMedia"
    | "SendOneTimeCode"
    | "SetPassword"
    | "StartNewUser"
    | "Unsplash"
    | "UpdateCurrentUser"
    | "UserGoogleAuth"
    | "VerifyAccountEmail"
    | "stripeWebhooks";
  routes:
    | "blog"
    | "blogIndex"
    | "blogSingle"
    | "docs"
    | "docsIndex"
    | "docsSingle"
    | "home"
    | "install"
    | "plugins"
    | "showcase"
    | "showcaseSingle"
    | "testInputs"
    | "testing";
  ui: "";
  menus: "";
  [k: string]: unknown;
}
