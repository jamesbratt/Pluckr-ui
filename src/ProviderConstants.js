import { getGitHubData, GITHUB_RESOURCES } from './data_sources/Github';
import { getSalesforceData, SALESFORCE_RESOURCES } from './data_sources/Salesforce';
import { getFacebookData, FACEBOOK_RESOURCES } from './data_sources/Facebook';
import { getJiraData, JIRA_RESOURCES } from './data_sources/Jira';
import { getStripeData, STRIPE_RESOURCES } from './data_sources/Stripe';
import { getFinanceData, FINANCE_RESOURCES } from './data_sources/Finance';
import { getWrikeData, WRIKE_RESOURCES } from './data_sources/Wrike';
import { getXeroData, XERO_RESOURCES } from './data_sources/Xero';
import { getWhoData, WHO_RESOURCES } from './data_sources/Who';


import salesforceLogo from './img/salesforce-logo.png';
import githubLogo from './img/github-logo.png';
import facebookLogo from './img/facebook-logo.png';
import jiraLogo from './img/jira-logo.png';
import stripeLogo from './img/stripe-logo.png';
import financeLogo from './img/finance-logo.png';
import wrikeLogo from './img/wrike-logo.png';
import xeroLogo from './img/xero-logo.png';
import whoLogo from './img/who-logo.png';

export const SALESFORCE_REDIRECT = 'https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=3MVG9tzQRhEbH_K3xwzvYEwgSPo59l0Wo1d55C46uZyF0V3jd7PrgQ1DKfbV7xhV8I4.zxOvHJMY.qQXKfFz6&redirect_uri='+ process.env.REACT_APP_REDIRECT_URI +'/authenticate/salesforce&scope=full%20refresh_token';
export const GITHUB_REDIRECT = 'https://github.com/login/oauth/authorize?client_id=5e1960289e1bb322b2c6&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/github&scope=read,repo';
export const FACEBOOK_REDIRECT = 'https://www.facebook.com/v4.0/dialog/oauth?client_id=383901508907652&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/facebook&state=test'
export const JIRA_REDIRECT = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=vRq5RE46A8BCPhGJcv16WzqovBvqYAmV&scope=offline_access%20read%3Ajira-user%20read%3Ajira-work&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/jira&state=test&response_type=code&prompt=consent';
export const STRIPE_REDIRECT = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_G5CZaJNVr3W8BtcdOt1MdqK3oMXTBjV5&scope=read_only&stripe_landing=login&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/stripe';
export const WRIKE_REDIRECT = 'https://login.wrike.com/oauth2/authorize/v4?client_id=ZRYuPMXo&response_type=code'
export const XERO_REDIRECT = 'https://login.xero.com/identity/connect/authorize?response_type=code&client_id=839D0A762C6843558252807D4817B811&redirect_uri=' + process.env.REACT_APP_REDIRECT_URI + '/authenticate/xero&scope=openid offline_access profile email accounting.settings.read accounting.transactions.read accounting.contacts.read accounting.settings.read';

export const SALESFORCE_DOCS = 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/';
export const GITHUB_DOCS = 'https://developer.github.com/v3/';
export const FACEBOOK_DOCS = 'https://developers.facebook.com/docs';
export const STRIPE_DOCS = 'https://stripe.com/docs/api';
export const JIRA_DOCS = 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest&utm_medium=302';
export const WRIKE_DOCS = 'https://developers.wrike.com/documentation/api/overview';
export const XERO_DOCS = 'https://developer.xero.com/documentation/';
export const FINANCE_DOCS = 'https://iexcloud.io/docs/api/';
export const WHO_DOCS = 'https://www.who.int/data/gho/info/gho-odata-api';

export const providers = [
  {
    provider: 'facebook',
    redirectUrl: FACEBOOK_REDIRECT,
    request: getFacebookData,
    resources: FACEBOOK_RESOURCES,
    isActive: false,
    isDisabled: true,
    icon: facebookLogo,
    auth: true,
    docs: FACEBOOK_DOCS
  },
  {
    provider: 'stock market',
    redirectUrl: null,
    request: getFinanceData,
    resources: FINANCE_RESOURCES,
    isActive: true,
    isDisabled: false,
    icon: financeLogo,
    auth: false,
    docs: FINANCE_DOCS,
  },
  {
    provider: 'world health organisation',
    redirectUrl: null,
    request: getWhoData,
    resources: WHO_RESOURCES,
    isActive: true,
    isDisabled: false,
    icon: whoLogo,
    auth: false,
    docs: WHO_DOCS,
  },
  {
    provider: 'github',
    redirectUrl: GITHUB_REDIRECT,
    request: getGitHubData,
    resources: GITHUB_RESOURCES,
    isActive: false,
    isDisabled: false,
    icon: githubLogo,
    auth: true,
    docs: GITHUB_DOCS
  },
  {
    provider: 'jira',
    redirectUrl: JIRA_REDIRECT,
    request: getJiraData,
    resources: JIRA_RESOURCES,
    isActive: false,
    isDisabled: false,
    icon: jiraLogo,
    auth: true,
    docs: JIRA_DOCS
  },
  {
    provider: 'salesforce',
    redirectUrl: SALESFORCE_REDIRECT,
    request: getSalesforceData,
    resources: SALESFORCE_RESOURCES,
    isActive: false,
    isDisabled: false,
    icon: salesforceLogo,
    auth: true,
    docs: SALESFORCE_DOCS
  },
  {
    provider: 'stripe',
    redirectUrl: STRIPE_REDIRECT,
    request: getStripeData,
    resources: STRIPE_RESOURCES,
    isActive: false,
    isDisabled: false,
    icon: stripeLogo,
    auth: true,
    docs: STRIPE_DOCS
  },
  {
    provider: 'wrike',
    redirectUrl: WRIKE_REDIRECT,
    request: getWrikeData,
    resources: WRIKE_RESOURCES,
    isActive: false,
    isDisabled: true,
    icon: wrikeLogo,
    auth: true,
    docs: WRIKE_DOCS
  },
  {
    provider: 'xero',
    redirectUrl: XERO_REDIRECT,
    request: getXeroData,
    resources: XERO_RESOURCES,
    isActive: false,
    isDisabled: true,
    icon: xeroLogo,
    auth: true,
    docs: XERO_DOCS
  },
];