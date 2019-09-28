
import { getGitHubData, GITHUB_RESOURCES } from '../data_sources/Github';
import { getSalesforceData, SALESFORCE_RESOURCES } from '../data_sources/Salesforce';
import { getFacebookData, FACEBOOK_RESOURCES } from '../data_sources/Facebook';
import { assocPath } from 'ramda';
import { GITHUB_REDIRECT, SALESFORCE_REDIRECT, FACEBOOK_REDIRECT } from '../Constants';
import salesforceLogo from '../img/salesforce-logo.png';
import githubLogo from '../img/github-logo.png';
import facebookLogo from '../img/facebook-logo.png';

const initialState = [
  {
    provider: 'github',
    redirectUrl: GITHUB_REDIRECT,
    request: getGitHubData,
    resources: GITHUB_RESOURCES,
    isActive: false,
    icon: githubLogo,
  },
  {
    provider: 'salesforce',
    redirectUrl: SALESFORCE_REDIRECT,
    request: getSalesforceData,
    resources: SALESFORCE_RESOURCES,
    isActive: false,
    icon: salesforceLogo,
  },
  {
    provider: 'facebook',
    redirectUrl: FACEBOOK_REDIRECT,
    request: getFacebookData,
    resources: FACEBOOK_RESOURCES,
    isActive: false,
    icon: facebookLogo,
  },
];

const dataProviders = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROVIDERS':
      const providers = state.map(dataProvider => {
        const currentProvider = action.payload.find(dp => dp.provider === dataProvider.provider);
        return assocPath(['isActive'], (currentProvider ? true : false), dataProvider);
      })
      return providers;

    default:
      return state;
  }
};

export default dataProviders;