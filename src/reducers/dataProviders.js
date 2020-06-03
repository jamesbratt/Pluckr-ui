import { assocPath } from 'ramda';
import { providers } from '../ProviderConstants';

const dataProviders = (state = providers, action) => {
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