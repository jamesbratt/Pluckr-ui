
import { combineReducers } from 'redux';
import charts from './charts';
import sources from './sources';
import datasets from './datasets';
import operations from './operations';
import dataProviders from './dataProviders';
import user from './user';
import loader from './loader';
import notification from './notification';
import template from './template';
import dashboards from './dashboards';

const chartConfigReducers = combineReducers({
  charts,
  sources,
  datasets,
  operations,
  dataProviders,
  user,
  loader,
  notification,
  template,
  dashboards,
});
 
export default chartConfigReducers;