
import { combineReducers } from 'redux';
import charts from './charts';
import sources from './sources';
import datasets from './datasets';

const chartConfigReducers = combineReducers({
  charts,
  sources,
  datasets,
});
 
export default chartConfigReducers;