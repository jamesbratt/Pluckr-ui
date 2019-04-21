
import { getProfile } from '../data_sources/Strava';
import { getUser } from '../data_sources/Github';
import { assocPath } from 'ramda';

const initialState = [
  {
    provider: 'strava',
    ping: getProfile,
    isActive: false,
  },
  {
    provider: 'github',
    ping: getUser,
    isActive: false,
  },
];

const dataProviders = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROVIDERS':
      const providers = state.map(dataProvider => {
        const currentProvider = action.payload.find(dp => dp.provider === dataProvider.provider);
        assocPath(['isActive'], (currentProvider.status >= 200 && currentProvider.status <= 300), dataProvider);
      })
      return providers;

    default:
      return state;
  }
};

export default dataProviders;