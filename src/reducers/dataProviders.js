
import { getStravaData, getProfile, STRAVA_RESOURCES } from '../data_sources/Strava';
import { getGitHubData, getUser, GITHUB_RESOURCES } from '../data_sources/Github';
import { getSalesforceData, SALESFORCE_RESOURCES } from '../data_sources/Salesforce';
import { assocPath } from 'ramda';
import { STRAVA_REDIRECT, GITHUB_REDIRECT, SALESFORCE_REDIRECT } from '../Constants';

const initialState = [
  {
    provider: 'strava',
    ping: getProfile,
    redirectUrl: '',
    request: getStravaData,
    resources: STRAVA_RESOURCES,
    isActive: false,
  },
  {
    provider: 'github',
    ping: getUser,
    redirectUrl: '',
    request: getGitHubData,
    resources: GITHUB_RESOURCES,
    isActive: false,
  },
  {
    provider: 'salesforce',
    redirectUrl: SALESFORCE_REDIRECT,
    request: getSalesforceData,
    resources: SALESFORCE_RESOURCES,
    isActive: false,
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