
import { getStravaData, getProfile, STRAVA_RESOURCES } from '../data_sources/Strava';
import { getGitHubData, getUser, GITHUB_RESOURCES } from '../data_sources/Github';
import { assocPath } from 'ramda';
import { STRAVA_REDIRECT, GITHUB_REDIRECT, SALESFORCE_REDIRECT } from '../Constants';

const initialState = [
  {
    provider: 'strava',
    ping: getProfile,
    redirectUrl: STRAVA_REDIRECT,
    request: getStravaData,
    resources: STRAVA_RESOURCES,
    isActive: false,
  },
  {
    provider: 'github',
    ping: getUser,
    redirectUrl: GITHUB_REDIRECT,
    request: getGitHubData,
    resources: GITHUB_RESOURCES,
    isActive: false,
  },
  {
    provider: 'salesforce',
    ping: null,
    redirectUrl: SALESFORCE_REDIRECT,
    request: null,
    resources: null,
    isActive: false,
  },
];

const dataProviders = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROVIDERS':
      const providers = state.map(dataProvider => {
        const currentProvider = action.payload.find(dp => dp.provider === dataProvider.provider);
        return assocPath(['isActive'], (currentProvider.status >= 200 && currentProvider.status <= 300), dataProvider);
      })
      return providers;

    default:
      return state;
  }
};

export default dataProviders;