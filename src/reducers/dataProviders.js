
import { getProfile } from '../data_sources/Strava';
import { getUser } from '../data_sources/Github';
import { assocPath } from 'ramda';
import { STRAVA_REDIRECT, GITHUB_REDIRECT } from '../Constants';

const initialState = [
  {
    provider: 'strava',
    ping: getProfile,
    redirectUrl: STRAVA_REDIRECT,
    isActive: false,
  },
  {
    provider: 'github',
    ping: getUser,
    redirectUrl: GITHUB_REDIRECT,
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