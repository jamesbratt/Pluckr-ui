
import { combineReducers } from 'redux';
import charts from './charts';
import sources from './sources';
import datasets from './datasets';
import operations from './operations';
import dataProviders from './dataProviders';
import user from './user';
import loader from './loader';
import axis from './axis';

const chartConfigReducers = combineReducers({
  charts,
  sources,
  datasets,
  operations,
  dataProviders,
  user,
  loader,
  axis,
});
 
export default chartConfigReducers;