
import { combineReducers } from 'redux';
import charts from './charts';
import sources from './sources';
import datasets from './datasets';
import operations from './operations';

const chartConfigReducers = combineReducers({
  charts,
  sources,
  datasets,
  operations,
});
 
export default chartConfigReducers;