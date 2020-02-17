
import { getGitHubData, GITHUB_RESOURCES } from '../data_sources/Github';
import { getSalesforceData, SALESFORCE_RESOURCES } from '../data_sources/Salesforce';
import { getFacebookData, FACEBOOK_RESOURCES } from '../data_sources/Facebook';
import { getJiraData, JIRA_RESOURCES } from '../data_sources/Jira';
import { getStripeData, STRIPE_RESOURCES } from '../data_sources/Stripe';
import { getFinanceData, FINANCE_RESOURCES } from '../data_sources/Finance';
import { assocPath } from 'ramda';
import { GITHUB_REDIRECT, SALESFORCE_REDIRECT, FACEBOOK_REDIRECT, JIRA_REDIRECT, STRIPE_REDIRECT, WRIKE_REDIRECT } from '../Constants';
import salesforceLogo from '../img/salesforce-logo.png';
import githubLogo from '../img/github-logo.png';
import facebookLogo from '../img/facebook-logo.png';
import jiraLogo from '../img/jira-logo.png';
import stripeLogo from '../img/stripe-logo.png';
import financeLogo from '../img/finance-logo.png';
import wrikeLogo from '../img/wrike-logo.png';

const initialState = [
  {
    provider: 'facebook',
    redirectUrl: FACEBOOK_REDIRECT,
    request: getFacebookData,
    resources: FACEBOOK_RESOURCES,
    isActive: false,
    isDisabled: true,
    icon: facebookLogo,
    auth: true,
  },
  {
    provider: 'financial modeling',
    redirectUrl: null,
    request: getFinanceData,
    resources: FINANCE_RESOURCES,
    isActive: true,
    isDisabled: false,
    icon: financeLogo,
    auth: false,
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
  },
  {
    provider: 'wrike',
    redirectUrl: WRIKE_REDIRECT,
    request: () => {},
    resources: [],
    isActive: false,
    isDisabled: false,
    icon: wrikeLogo,
    auth: true,
  },
];

const dataProviders = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROVIDERS':
      const providers = state.map(dataProvider => {
        const currentProvider = action.payload.find(dp => dp.provider === dataProvider.provider);
        return assocPath(['isActive'], (currentProvider || !dataProvider.auth ? true : false), dataProvider);
      })
      return providers;

    default:
      return state;
  }
};

export default dataProviders;